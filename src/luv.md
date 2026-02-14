---
title: "Linux Users of Victoria"
layout: base.njk
permalink: "/luv/"
---

<style>
    :root {
        --bs-primary: #000080 !important;
        --bs-primary-rgb: 0, 0, 128 !important;
        --bs-primary-bg-subtle: #cccce6 !important;
    }

    .btn-primary {
        --bs-btn-bg: #000080 !important;
        --bs-btn-border-color: #000080 !important;
        --bs-btn-hover-bg: #000070 !important;
        --bs-btn-hover-border-color: #000070 !important;
        --bs-btn-active-bg: #000070 !important;
        --bs-btn-disabled-bg: #000080 !important;
        --bs-btn-disabled-border-color: #000080 !important;
    }
</style>

<div class="text-center mb-5">
    <img src="/assets/images/logo-luv.webp" alt="{{title}}" class="img-fluid mb-4" style="max-width: 300px;">
    <h1 class="text-primary fw-semibold fs-5">Linux Users of Victoria</h1>
</div>

{% set cards = luvCards %}
{% include "partials/cards.njk" %}