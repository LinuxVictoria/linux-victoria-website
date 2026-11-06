// Photo blocks for the annual reports. Each set picks its own shape from its photo
// count (see src/_includes/lib/polyMesh.js), so to add photos to an event, add them
// to its list. Photos live in annual-report/mesh as webp, 900px on the long side with
// metadata stripped (GPS included), which keeps a saved PDF a sensible size. Never add
// anything from the "Not Public" Nextcloud folders.

const polyMesh = require("../_includes/lib/polyMesh");

const mesh = "/assets/images/annual-report/mesh";

const sets = {
  cover: {
    label: "Highlights from the year",
    tone: "dark",
    photos: [
      { src: `${mesh}/02-listening-06-june-the-room-watching-a-talk.webp`, alt: "Members listening to a talk" },
      { src: `${mesh}/20250825_164217.webp`, alt: "Linux Regional Summit attendees together" },
      { src: `${mesh}/IMG_20260418_113859467_MFNR.webp`, alt: "People around robots at Hardware Freedom Day" },
      { src: `${mesh}/june-group-camera.webp`, alt: "Members gathered around a camera at the June Town Hall" },
      { src: `${mesh}/E7A4171C-F87E-44C6-82B8-B4CF53581477.webp`, alt: "Members at the Penguin Picnic" },
      { src: `${mesh}/sfd-2025-group-2025.webp`, alt: "Everyone at Software Freedom Day 2025" },
      { src: `${mesh}/eo-breakfast.webp`, alt: "LUV Breakfast at Everything Open" },
      { src: `${mesh}/03-pizza-04-june-around-the-table.webp`, alt: "Dinner after the June Town Hall" },
    ],
  },
  summitTour: {
    label: "Gippsland Tech School tour",
    height: 172,
    photos: [
      { src: `${mesh}/20250825_133332.webp`, alt: "The group around a large model city" },
      { src: `${mesh}/20250825_131947.webp`, alt: "A welcome in front of the projector" },
      { src: `${mesh}/20250825_134105.webp`, alt: "The group looking at a red robot" },
    ],
  },
  summitTalks: {
    label: "Talks and demos at the summit",
    height: 190,
    layout: "cluster",
    photos: [
      { src: `${mesh}/20250825_135433.webp`, alt: "A speaker at a lectern" },
      { src: `${mesh}/20250825_150141.webp`, alt: "A speaker presenting from the lectern" },
    ],
  },
  summitOnline: {
    label: "The Linux Regional Discourse",
    mirror: true,
    height: 190,
    layout: "cluster",
    photos: [
      { src: `${mesh}/20250825_153447.webp`, alt: "A remote speaker sharing a terminal on the big screen" },
      { src: `${mesh}/20250825_162919.webp`, alt: "A remote speaker presenting a policy paper on screen" },
    ],
  },
  summitBirthday: {
    label: "Linux's 34th birthday",
    tone: "dark",
    height: 150,
    layout: "cluster",
    photos: [{ src: `${mesh}/20250825_164217.webp`, alt: "Attendees together with a birthday cake" }],
  },
  sfdTalks: {
    label: "Talks at Software Freedom Day 2025",
    height: 225,
    photos: [{ src: `${mesh}/sfd-2025-talk.webp`, alt: "A room of people watching a talk" }],
  },
  sfdVolunteers: {
    label: "Volunteers at Software Freedom Day 2025",
    height: 190,
    layout: "cluster",
    photos: [
      { src: `${mesh}/sfd-2025-stall-volunteers.webp`, alt: "Volunteers beside a large Tux" },
      { src: `${mesh}/sfd-2025-laptops-balloons.webp`, alt: "Volunteers with laptops and balloons" },
    ],
  },
  sfdCommunity: {
    label: "Everyone at Software Freedom Day 2025",
    tone: "dark",
    height: 170,
    layout: "cluster",
    photos: [
      { src: `${mesh}/sfd-2025-group-2025.webp`, alt: "Everyone who came, standing together" },
      { src: `${mesh}/sfd-2025-balloon.webp`, alt: "A red Software Freedom Day balloon" },
    ],
  },
  eo: {
    label: "Photos from the LUV Breakfast at Everything Open",
    layout: "cluster",
    photos: [
      { src: `${mesh}/photo_2026-01-22_09-16-14.webp`, alt: "Members having breakfast at outdoor tables" },
      { src: `${mesh}/photo_2026-01-22_09-16-49.webp`, alt: "The breakfast table" },
    ],
  },
  canberra: {
    label: "Photos from the Linux Collab with Canberra",
    layout: "cluster",
    photos: [
      { src: `${mesh}/photo_2026-02-14_12-25-36.webp`, alt: "Attendees at tables in Dissent Cafe and Bar" },
      { src: `${mesh}/photo_2026-02-14_12-25-42.webp`, alt: "A laptop at the install fest" },
    ],
  },
  picnicGather: {
    label: "Back at Yarra Bank Reserve for the Penguin Picnic",
    height: 240,
    photos: [
      { src: `${mesh}/E7A4171C-F87E-44C6-82B8-B4CF53581477.webp`, alt: "Members gathered around the picnic table" },
      { src: `${mesh}/72AF39A5-E29C-4CEA-9FC0-E35B80B35811.webp`, alt: "People under the shelter at Yarra Bank Reserve" },
      { src: `${mesh}/97F33A83-F7CC-48BF-A613-AFB7B9D97B7D.webp`, alt: "The picnic shelter and trees" },
    ],
  },
  picnicFood: {
    label: "Food at the Penguin Picnic",
    layout: "cluster",
    height: 230,
    photos: [
      { src: `${mesh}/99449C96-DE23-4312-B72A-FD964254B301_4_5005_c.webp`, alt: "Cooking at the barbecue" },
      { src: `${mesh}/C02D6F71-3B27-4528-955C-D6FABD9B5434.webp`, alt: "Sausages on the barbecue" },
    ],
  },
  picnicCompany: {
    label: "Good company at the Penguin Picnic",
    layout: "cluster",
    mirror: true,
    height: 230,
    photos: [
      { src: `${mesh}/A8701DB0-C98B-483F-A695-6E89AC83FA23.webp`, alt: "A small white dog at the picnic" },
      { src: `${mesh}/D5F1E916-6F1E-4939-9B51-B3DC66CFB356.webp`, alt: "A small white dog beside the picnic bench" },
    ],
  },
  helloWorld: {
    label: "Photos from Let's Hello World: n8n",
    height: 190,
    layout: "cluster",
    photos: [
      { src: `${mesh}/photo_1_2026-02-20_11-12-53.webp`, alt: "Participants around a table smiling at the camera" },
      { src: `${mesh}/photo_3_2026-02-20_11-12-53.webp`, alt: "Participants working at laptops" },
    ],
  },
  dfd: {
    label: "Document Freedom Day flyers",
    layout: "cluster",
    photos: [{ src: `${mesh}/dfd-flyers.webp`, alt: "The Open Standards flyer, closed and open" }],
  },
  hfdFloor: {
    label: "The exhibition floor at Hardware Freedom Day",
    height: 178,
    photos: [
      { src: `${mesh}/IMG_20260418_113859467_MFNR.webp`, alt: "People gathered around robots on an exhibition table" },
      { src: `${mesh}/IMG_4777.webp`, alt: "Exhibition tables at Inspire9" },
      { src: `${mesh}/IMG_4778.webp`, alt: "Exhibits on the coding table, with a small robot arm" },
    ],
  },
  hfdHardware: {
    label: "Hardware on show at Hardware Freedom Day",
    mirror: true,
    height: 178,
    photos: [
      { src: `${mesh}/PXL_20260418_014646982.RAW-01.COVER.webp`, alt: "A desktop CNC machine with a copper board" },
      { src: `${mesh}/PXL_20260418_015535211.RAW-01.COVER.webp`, alt: "A circuit board with a keypad" },
      { src: `${mesh}/PXL_20260418_032430041.RAW-01.COVER.webp`, alt: "A battery board held up in two hands" },
    ],
  },
  hfdTalks: {
    label: "Lightning talks at Hardware Freedom Day",
    height: 255,
    weights: [2.2, 1, 1],
    photos: [
      { src: `${mesh}/IMG_20260418_145448782_MFNR.webp`, alt: "The full room during lightning talks" },
      { src: `${mesh}/IMG_20260418_142547936_SR.webp`, alt: "A speaker in front of a large projected slide" },
      { src: `${mesh}/PXL_20260418_045228846.RAW-01.COVER.webp`, alt: "A circuit diagram on the projector" },
    ],
  },
  townHallFeb: {
    label: "Photos from the February Town Hall",
    layout: "cluster",
    photos: [
      { src: `${mesh}/9746E9DE-80A4-4079-BECB-D857BAFF020F.webp`, alt: "Members around the boardroom table at Inspire9" },
      { src: `${mesh}/C3081AA9-03C7-4E32-92EF-597F49117AC3.webp`, alt: "The meeting seen through the doorway" },
      { src: `${mesh}/24682F1E-F87C-416B-9C17-8F65FFC4F9D8.webp`, alt: "Members and a remote attendee on screen" },
    ],
  },
  townHallApril: {
    label: "Photos from the April Town Hall",
    layout: "cluster",
    photos: [
      { src: `${mesh}/th-april-speaker.webp`, alt: "A speaker at a lectern with coloured lights on the wall" },
      { src: `${mesh}/th-april-room.webp`, alt: "Attendees at Inspire9 with coloured lights on the wall" },
      { src: `${mesh}/th-april-audience.webp`, alt: "The audience during a talk" },
      { src: `${mesh}/th-april-talk.webp`, alt: "A speaker presenting to the room" },
    ],
  },
  townHallMay: {
    label: "The May Town Hall",
    layout: "cluster",
    photos: [{ src: `${mesh}/th-may-room.webp`, alt: "The main room at Inspire9 set up for the Town Hall" }],
  },
  townHallJune: {
    label: "Photos from the June Town Hall at Kathleen Syme Library",
    photos: [
      { src: `${mesh}/june-group-camera.webp`, alt: "Members gathered around a camera" },
      { src: `${mesh}/02-listening-02-june-the-room-during-a-presentation.webp`, alt: "The room during a presentation" },
      { src: `${mesh}/june-speaker-duncan.webp`, alt: "Duncan from MLUG presenting at a laptop" },
      { src: `${mesh}/01-talking-02-june-members-laughing-in-the-lobby.webp`, alt: "Members laughing in the lobby" },
      { src: `${mesh}/02-listening-04-june-a-row-of-attentive-faces.webp`, alt: "A row of attentive faces" },
      { src: `${mesh}/june-hallway.webp`, alt: "Members mingling in the hallway" },
      { src: `${mesh}/01-talking-05-june-around-the-computers.webp`, alt: "Members talking around the computers" },
      { src: `${mesh}/june-speaker-cap.webp`, alt: "A speaker presenting at a laptop" },
      { src: `${mesh}/03-pizza-02-june-ordering-at-papa-ginos.webp`, alt: "Ordering at Papa Gino's after the meeting" },
      { src: `${mesh}/03-pizza-09-june-good-company-after-hours.webp`, alt: "Good company at dinner after hours" },
      { src: `${mesh}/03-pizza-04-june-around-the-table.webp`, alt: "Around the table at dinner" },
    ],
  },
  lait: {
    label: "The Linux and AI group",
    layout: "cluster",
    photos: [{ src: `${mesh}/lait-group.webp`, alt: "The Linux and AI group" }],
  },
  eoTalk: {
    label: "Sophie Allen's tutorial at Everything Open 2026",
    height: 215,
    photos: [
      { src: `${mesh}/eo-3W1A4334.webp`, alt: "Sophie Allen presenting at the front of the room" },
      { src: `${mesh}/eo-3W1A4342.webp`, alt: "Attendees following along on laptops" },
      { src: `${mesh}/eo-3W1A4351.webp`, alt: "Sophie Allen speaking, seen side on" },
      { src: `${mesh}/eo-3W1A4348.webp`, alt: "Attendees listening" },
    ],
  },
  closing: {
    label: "The community at Town Hall nights and dinners",
    photos: [
      { src: `${mesh}/01-talking-01-june-two-members-in-conversation.webp`, alt: "Two members in conversation" },
      { src: `${mesh}/01-talking-03-june-sharing-an-idea-with-the-group.webp`, alt: "Sharing an idea with the group" },
      { src: `${mesh}/03-pizza-01-walking-to-dinner-after-the-meeting.webp`, alt: "Walking to dinner after the meeting" },
      { src: `${mesh}/01-talking-04-june-mingling-before-the-meeting.webp`, alt: "Mingling before the meeting" },
      { src: `${mesh}/02-listening-03-june-members-following-along.webp`, alt: "Members following along" },
    ],
  },

  // 2026-27, in progress
  townHallJuly: {
    label: "Photos from the July Town Hall",
    tone: "dark",
    photos: [
      { src: `${mesh}/th-july-training-room.webp`, alt: "The training room at Kathleen Syme Library" },
      { src: `${mesh}/01-talking-06-july-two-members-comparing-laptops.webp`, alt: "Two members comparing laptops" },
      { src: `${mesh}/02-listening-05-july-in-the-training-room.webp`, alt: "Members listening in the training room" },
      { src: `${mesh}/01-talking-09-july-chatting-by-the-bookshelves.webp`, alt: "Chatting by the bookshelves" },
      { src: `${mesh}/03-pizza-03-july-reading-the-menu-together.webp`, alt: "Reading the menu together" },
      { src: `${mesh}/03-pizza-06-july-conversation-over-dinner.webp`, alt: "Conversation over dinner" },
    ],
  },
  sfd2026: {
    label: "Software Freedom Day 2026",
    layout: "cluster",
    photos: [{ src: `${mesh}/sfd-2026-omarchy.webp`, alt: "An iMac booting Omarchy on a desk" }],
  },
  unconference: {
    label: "The Linux Unconference",
    layout: "cluster",
    photos: [{ src: `${mesh}/unconference-sign.webp`, alt: "A Linux Victoria sign on a brick wall pointing to Level 1" }],
  },
};

// Numbers run in page order across each report, so keep these lists in the order
// the blocks appear. Adding a photo moves every later number along.
const reports = [
  [
    "cover", "summitTour", "summitTalks", "summitOnline", "summitBirthday",
    "sfdTalks", "sfdVolunteers", "sfdCommunity", "eo", "canberra", "picnicGather",
    "picnicFood", "picnicCompany", "helloWorld", "dfd", "hfdFloor", "hfdHardware",
    "hfdTalks", "townHallFeb", "townHallApril", "townHallMay", "townHallJune",
    "lait", "eoTalk", "closing",
  ],
  ["townHallJuly", "sfd2026", "unconference"],
];

const meshes = {};
reports.forEach((order) => {
  let start = 1;
  order.forEach((id) => {
    meshes[id] = polyMesh({ id, ...sets[id], start });
    start += sets[id].photos.length;
  });
});

module.exports = meshes;
