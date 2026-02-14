const dayjs = require('dayjs');
const advancedFormat = require('dayjs/plugin/advancedFormat');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const fs = require('fs');
const path = require('path');

dayjs.extend(advancedFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

module.exports = function (eleventyConfig) {
  // Load site data for timezone and date format
  const siteData = JSON.parse(fs.readFileSync('./src/_data/site.json', 'utf8'));
  const SITE_TIMEZONE = siteData.timezone || 'Australia/Sydney';
  const DEFAULT_DATE_FORMAT = siteData.dateFormat || 'dddd, Do MMMM YYYY';

  // Helper function to get event end date/time
  function getEventEndDateTime(event) {
    if (!event.data.eventDate) return null;
    
    try {
      // Try to parse the event date without timezone first
      let eventDate = dayjs(event.data.eventDate);
      
      // If invalid date, return null
      if (!eventDate.isValid()) {
        console.warn(`Invalid eventDate for event: ${event.data.title || 'Unknown'} - ${event.data.eventDate}`);
        return null;
      }
      
      // If endTime is specified, use it
      if (event.data.endTime) {
        try {
          const timeStr = event.data.endTime.toString().trim();
          let endTime;
          
          // Try parsing different formats
          if (timeStr.includes(':')) {
            // Format like "4:00PM", "16:00", "4:00 PM"
            endTime = dayjs(`${eventDate.format('YYYY-MM-DD')} ${timeStr}`);
          } else if (timeStr.length === 3 || timeStr.length === 4) {
            // Format like "1400" or "400" (24-hour without colon)
            const paddedTime = timeStr.padStart(4, '0');
            const hours = paddedTime.slice(0, 2);
            const minutes = paddedTime.slice(2);
            endTime = dayjs(`${eventDate.format('YYYY-MM-DD')} ${hours}:${minutes}`);
          } else {
            // Fallback: try parsing as-is
            endTime = dayjs(`${eventDate.format('YYYY-MM-DD')} ${timeStr}`);
          }
          
          if (endTime.isValid()) {
            return endTime;
          } else {
            console.warn(`Invalid endTime for event: ${event.data.title || 'Unknown'} - ${event.data.endTime}`);
            return eventDate.endOf('day');
          }
        } catch (err) {
          console.warn(`Error parsing endTime for event: ${event.data.title || 'Unknown'} - ${err.message}`);
          return eventDate.endOf('day');
        }
      }
      
      // Default: event ends at midnight (end of day)
      return eventDate.endOf('day');
    } catch (err) {
      console.warn(`Error parsing date for event: ${event.data.title || 'Unknown'} - ${err.message}`);
      return null;
    }
  }

  //admin is left unprocessed and copied to site
  eleventyConfig.ignores.add("src/admin/index.html");
  eleventyConfig.ignores.add("src/admin/**/*.html");
  eleventyConfig.addPassthroughCopy("src/admin");

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  // Gallery images reader
  eleventyConfig.addGlobalData('galleries', function() {
    const galleries = {};
    
    function scanGalleryDirectory(dirPath, filterPrefix = null) {
      const fullPath = path.join(__dirname, 'src', dirPath);
      
      try {
        if (!fs.existsSync(fullPath)) {
          console.log(`Gallery directory not found: ${dirPath}`);
          return [];
        }
        
        const files = fs.readdirSync(fullPath);
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        
        let images = files.filter(file => {
          const ext = path.extname(file).toLowerCase();
          return imageExtensions.includes(ext);
        });
        
        // Filter by prefix if provided (e.g., 'gallery-')
        if (filterPrefix) {
          images = images.filter(file => file.startsWith(filterPrefix));
        }
        
        images.sort();
        
        if (images.length === 0) {
          console.log(`No images found in ${dirPath}${filterPrefix ? ' with prefix "' + filterPrefix + '"' : ''}`);
        } else {
          console.log(`Found ${images.length} images in ${dirPath}${filterPrefix ? ' with prefix "' + filterPrefix + '"' : ''}`);
        }
        
        return images;
      } catch (error) {
        console.error(`Error reading gallery directory ${dirPath}:`, error.message);
        return [];
      }
    }
    
    // Register a gallery path scanner
    galleries.scan = function(dirPath, filterPrefix = null) {
      const key = dirPath + (filterPrefix || '');
      if (!galleries[key]) {
        galleries[key] = scanGalleryDirectory(dirPath, filterPrefix);
      }
      return galleries[key];
    };
    
    return galleries;
  });

  // All events (sorted by date ascending)
  eleventyConfig.addCollection("events", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/events/*.md")
      .sort((a, b) => new Date(a.data.eventDate) - new Date(b.data.eventDate));
  });

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => new Date(b.data.postDate) - new Date(a.data.postDate));
  });

  // Upcoming events (event hasn't ended yet)
  eleventyConfig.addCollection("upcomingEvents", function (collectionApi) {
    const now = dayjs().tz(SITE_TIMEZONE);
    return collectionApi.getFilteredByGlob("src/events/*.md")
      .filter(e => {
        const endDateTime = getEventEndDateTime(e);
        return endDateTime && endDateTime.isAfter(now);
      })
      .sort((a, b) => new Date(a.data.eventDate) - new Date(b.data.eventDate));
  });

  // Past events (event has ended)
  eleventyConfig.addCollection("pastEvents", function (collectionApi) {
    const now = dayjs().tz(SITE_TIMEZONE);
    return collectionApi.getFilteredByGlob("src/events/*.md")
      .filter(e => {
        const endDateTime = getEventEndDateTime(e);
        return endDateTime && endDateTime.isSameOrBefore(now);
      })
      .sort((a, b) => new Date(b.data.eventDate) - new Date(a.data.eventDate));
  });

  // Featured events
  eleventyConfig.addCollection("featuredEvents", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/events/*.md")
      .filter(e => e.data.featured === true)
      .sort((a, b) => new Date(a.data.eventDate) - new Date(b.data.eventDate));
  });

  // Featured posts
  eleventyConfig.addCollection("featuredPosts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md")
      .filter(p => p.data.featured === true)
      .sort((a, b) => new Date(b.data.postDate) - new Date(a.data.postDate));
  });

  // Preview events - upcoming only (excluding featured)
  eleventyConfig.addCollection("previewEvents", function (collectionApi) {
    const now = dayjs().tz(SITE_TIMEZONE);
    return collectionApi.getFilteredByGlob("src/events/*.md")
      .filter(e => {
        const endDateTime = getEventEndDateTime(e);
        return endDateTime && 
               endDateTime.isAfter(now) &&
               e.data.featured !== true;
      })
      .sort((a, b) => new Date(a.data.eventDate) - new Date(b.data.eventDate))
      .slice(0, 3);
  });

  // Preview events - upcoming only (including featured)
  eleventyConfig.addCollection("previewEventsAll", function (collectionApi) {
    const now = dayjs().tz(SITE_TIMEZONE);
    return collectionApi.getFilteredByGlob("src/events/*.md")
      .filter(e => {
        const endDateTime = getEventEndDateTime(e);
        return endDateTime && endDateTime.isAfter(now);
      })
      .sort((a, b) => new Date(a.data.eventDate) - new Date(b.data.eventDate))
      .slice(0, 3);
  });

  // Preview events - combined past and upcoming (excluding featured)
  eleventyConfig.addCollection("previewEventsCombined", function (collectionApi) {
    const now = dayjs().tz(SITE_TIMEZONE);
    const allEvents = collectionApi.getFilteredByGlob("src/events/*.md")
      .filter(e => e.data.eventDate && e.data.featured !== true);
    
    const upcoming = allEvents
      .filter(e => {
        const endDateTime = getEventEndDateTime(e);
        return endDateTime && endDateTime.isAfter(now);
      })
      .sort((a, b) => new Date(a.data.eventDate) - new Date(b.data.eventDate))
      .slice(0, 2);
    
    const past = allEvents
      .filter(e => {
        const endDateTime = getEventEndDateTime(e);
        return endDateTime && endDateTime.isSameOrBefore(now);
      })
      .sort((a, b) => new Date(b.data.eventDate) - new Date(a.data.eventDate))
      .slice(0, 1);
    
    return [...upcoming, ...past];
  });

  // Preview events - combined past and upcoming (including featured)
  eleventyConfig.addCollection("previewEventsCombinedAll", function (collectionApi) {
    const now = dayjs().tz(SITE_TIMEZONE);
    const allEvents = collectionApi.getFilteredByGlob("src/events/*.md")
      .filter(e => e.data.eventDate);
    
    const upcoming = allEvents
      .filter(e => {
        const endDateTime = getEventEndDateTime(e);
        return endDateTime && endDateTime.isAfter(now);
      })
      .sort((a, b) => new Date(a.data.eventDate) - new Date(b.data.eventDate))
      .slice(0, 2);
    
    const past = allEvents
      .filter(e => {
        const endDateTime = getEventEndDateTime(e);
        return endDateTime && endDateTime.isSameOrBefore(now);
      })
      .sort((a, b) => new Date(b.data.eventDate) - new Date(a.data.eventDate))
      .slice(0, 1);
    
    return [...upcoming, ...past];
  });

  // Preview events - past only (excluding featured)
  eleventyConfig.addCollection("previewPastEvents", function (collectionApi) {
    const now = dayjs().tz(SITE_TIMEZONE);
    return collectionApi.getFilteredByGlob("src/events/*.md")
      .filter(e => {
        const endDateTime = getEventEndDateTime(e);
        return endDateTime && 
               endDateTime.isSameOrBefore(now) &&
               e.data.featured !== true;
      })
      .sort((a, b) => new Date(b.data.eventDate) - new Date(a.data.eventDate))
      .slice(0, 3);
  });

  // Preview events - past only (including featured)
  eleventyConfig.addCollection("previewPastEventsAll", function (collectionApi) {
    const now = dayjs().tz(SITE_TIMEZONE);
    return collectionApi.getFilteredByGlob("src/events/*.md")
      .filter(e => {
        const endDateTime = getEventEndDateTime(e);
        return endDateTime && endDateTime.isSameOrBefore(now);
      })
      .sort((a, b) => new Date(b.data.eventDate) - new Date(a.data.eventDate))
      .slice(0, 3);
  });

  // Preview events - upcoming only (excluding featured) - duplicate for consistency
  eleventyConfig.addCollection("previewUpcomingEvents", function (collectionApi) {
    const now = dayjs().tz(SITE_TIMEZONE);
    return collectionApi.getFilteredByGlob("src/events/*.md")
      .filter(e => {
        const endDateTime = getEventEndDateTime(e);
        return endDateTime && 
               endDateTime.isAfter(now) &&
               e.data.featured !== true;
      })
      .sort((a, b) => new Date(a.data.eventDate) - new Date(b.data.eventDate))
      .slice(0, 3);
  });

  // Preview events - upcoming only (including featured) - duplicate for consistency
  eleventyConfig.addCollection("previewUpcomingEventsAll", function (collectionApi) {
    const now = dayjs().tz(SITE_TIMEZONE);
    return collectionApi.getFilteredByGlob("src/events/*.md")
      .filter(e => {
        const endDateTime = getEventEndDateTime(e);
        return endDateTime && endDateTime.isAfter(now);
      })
      .sort((a, b) => new Date(a.data.eventDate) - new Date(b.data.eventDate))
      .slice(0, 3);
  });

  // Preview posts (excluding featured by default)
  eleventyConfig.addCollection("previewPosts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md")
      .filter(p => p.data.featured !== true) // hide featured
      .sort((a, b) => new Date(b.data.postDate) - new Date(a.data.postDate))
      .slice(0, 3);
  });

  // Preview posts (including featured)
  eleventyConfig.addCollection("previewPostsAll", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => new Date(b.data.postDate) - new Date(a.data.postDate))
      .slice(0, 3);
  });

  // Consolidated galleries - all events and posts with gallery property, sorted by date (most recent first)
  eleventyConfig.addCollection("consolidatedGalleries", function (collectionApi) {
    const events = collectionApi.getFilteredByGlob("src/events/*.md")
      .filter(e => e.data.gallery)
      .map(e => ({
        date: new Date(e.data.eventDate),
        type: 'event',
        pageTitle: e.data.title,
        gallery: e.data.gallery,
        url: e.url
      }));
    
    const posts = collectionApi.getFilteredByGlob("src/posts/*.md")
      .filter(p => p.data.gallery)
      .map(p => ({
        date: new Date(p.data.postDate),
        type: 'post',
        pageTitle: p.data.title,
        gallery: p.data.gallery,
        url: p.url
      }));
    
    return [...events, ...posts]
      .sort((a, b) => b.date - a.date);
  });

  // Date formatting filter - uses site.json dateFormat as default
  eleventyConfig.addFilter("formatDate", function (dateInput, format) {
    if (!dateInput) return '';
    try {
      // Use provided format, or fall back to site default
      const dateFormat = format || DEFAULT_DATE_FORMAT;
      const parsed = dayjs(dateInput);
      return parsed.isValid() ? parsed.format(dateFormat) : String(dateInput);
    } catch (err) {
      console.warn(`Error formatting date: ${dateInput} - ${err.message}`);
      return String(dateInput);
    }
  });

  // Concat filter for Nunjucks
  eleventyConfig.addFilter("concat", function (arr1, arr2) {
    if (!Array.isArray(arr1)) arr1 = [];
    if (!Array.isArray(arr2)) arr2 = [];
    return arr1.concat(arr2);
  });

  // Check if rendered content already contains a manually placed gallery
  eleventyConfig.addFilter("hasGallery", function(content) {
    return content && content.includes('<div class="gallery">');
  });

  // Strip leading slash from a path
  eleventyConfig.addFilter("stripLeadingSlash", function(str) {
    return str ? str.replace(/^\//, '') : str;
  });

  // JSON stringify filter
  eleventyConfig.addFilter("jsonify", function(value) {
    return JSON.stringify(value);
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};