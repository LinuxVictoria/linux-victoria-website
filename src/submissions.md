---
title: "Submissions"
description: "Submit a talk, demo, lightning talk, or other presentation for an upcoming event."
formTitle: "Submissions"
formDescription: "Are you interested in sharing a talk, demo, lightning talk etc at our events? Fill out the form below and the event organisers will be in touch! \n\n The submissions from the form are only sent to the organisers and will not be documented publicly."
formName: "submissions"
formSubmitLabel: "Submit"
formColClass: "col-12"
formFields:
  - name: where
    type: radio
    label: Where
    options:
      - Upcoming Linux Town Hall
      - Hardware Freedom Day
      - Other
  - name: description
    type: textarea
    label: "Description (title, abstract, and all relevant details)"
    rows: 8
  - name: email
    type: email
    label: Email Address
---

{% include "partials/form.njk" %}
