---
title: "Contact"
description: "Get involved with Linux Victoria: volunteer, contribute, and help grow the Linux community in Victoria"
layout: "base.njk"
---

# Engage with Linux Victoria

Linux Victoria thrives thanks to the dedication and passion of our community members.   
Whether you're a seasoned Linux expert or just starting your journey, there are many ways to contribute and make a difference.


## Ways to Contribute

##### 🎤 Speak at Events

Share your knowledge and experiences with the community. We're always looking for speakers for:

- Town Hall meetings
- Software Freedom Day
- Linux Regional Summit

##### Volunteer at Install Fests

Help newcomers discover Linux by:

- Assisting with Linux installations at an install fest
- Organising and coordinating an Install Fest

##### Join Our Team

Interested in taking on a more active role? We have various positions available:

- Event organisers
- Volunteer Coordinators
- Writing event reports and annoucements
- Working groups point of contact
- Community reach out
- Website maintainers

<div class="row mb-5">
    <div class="text-primary text-center col-12 bg-light rounded-3 p-4 pb-3 shadow">
    <h2 class="mb-3 fs-3 fw-semibold">Subscribe to Our Newsletter</h2>

{% include "partials/newsletterEngageForm.njk" %}

</div>
</div>




## Connect With Us

<div class="row">
    <div class="col-md-6">
{% set formTitle = "Get in Touch" %}
{% set formDescription = "Have a question or want to get involved? Send us a message!" %}
{% set formName = "contact" %}
{% set formFields = ["name", "email", "message"] %}
{% set formColClass = "col-12" %}
{% include "partials/form.njk" %}
    </div>
    <div class="col-md-6">
        <div class="px-md-5 h-100 text-wrap">
            
### Contact Details

#### Email addresses
General inqueries   
<team@linuxvictoria.org>

Alexar Pendashteh / President   
<president@linuxvictoria.org>

Sophie Allen / Treasurer   
<team@linuxvictoria.org>


#### LinkedIn
<https://www.linkedin.com/company/linux-victoria>

#### Telegram
<https://t.me/linuxvictoria>

#### Town Hall Meetings
[View upcoming meetings](/events)

#### Mailing List
<https://lists.luv.asn.au/mailman/listinfo/luv-main>

#### GitHub
<https://github.com/linuxvictoria>
        </div>
    </div>
</div>

---

<a id="host-your-own-event"></a>

## Host Your Own Event

While Linux Victoria organises, runs and hosts events, we encourage **all community members** to host their own catchups, discussions or meetups. Whether it's a chat about your favourite distro, a workshop on a tool you love, or just a casual hangout, you can make it happen!

### Getting Listed on the Linux Victoria Calendar

There are several ways to get your event visible to the community:

#### Option 1: Luma (Easiest)
1. Go to [lu.ma/linux-victoria](https://lu.ma/linux-victoria)
2. Click **Submit Event** (you only need an email address)
3. Fill in your event details and submit
4. We'll receive a request and approve it
5. Your event will appear on the Linux Victoria Calendar!

#### Option 2: GitHub Website
1. Go to the [Linux Victoria GitHub repository](https://github.com/linuxvictoria/linux-victoria-website)
2. Copy `src/events/template.njk` and rename it to `YYYY-MM-DD_your-event-title.md`
3. Fill in the frontmatter: `title`, `description`, `eventDate`, `startTime`, `endTime`, `location`
4. Write your event details in the body using Markdown
5. Create a Pull Request
6. Once merged, your event appears on the website!

#### Option 3: Meetup
Reach out to us and we can add your event to our Meetup group.

### Need Help?

Contact us at <team@linuxvictoria.org> if you need assistance, including:
- **Graphics**: event images, logos, promotional material
- **Venues**: finding a space for your in-person event
- **Listing**: getting your event on the website, Luma, and Meetup

### Online Events

For online events, **Electron Workshop** sponsors video conferencing.

You can use **electronworkshop/goto/venue** for your online catchup, discussion, or event.

The main thing is that **you're able to be there and host**, whether online or in person. We can help handle the rest!

---

Every contribution, no matter how small, helps strengthen our community. We look forward to hearing from you!
