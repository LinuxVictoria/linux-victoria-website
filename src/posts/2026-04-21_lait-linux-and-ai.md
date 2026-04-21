---
title: "LAIT Night: Linux and AI — April 2026"
author: Linux & AI working group
description: "Notes from our open discussion on Linux and AI: hardware for local inference, robotics, homelabbing, Home Assistant integration, coding agents, and more."
tags: ["AI", "Linux", "Homelabbing", "Robotics"]
image: /assets/images/linux-and-ai-group.webp
postDate: 2026-04-21
---

Our April LAIT Night (Linux and AI Tuesday) was an open-floor discussion that covered a lot of ground. Here's what came up.

## Multi-modal models and agents

The group touched on the expanding landscape beyond text: Vision-Language-Action (VLA) models that connect perception to physical action, Large Action Models (LAM), and the growing ecosystem around tiny/smol models for constrained hardware. On the agentic side, Agent-to-Agent (A2A) communication protocols and MCP (Model Context Protocol) tool calling are picking up traction as practical ways to wire models into real systems.

## Robotics and simulation

[Deepbots](https://github.com/aidudezzz/deepbots) came up as a Python wrapper for reinforcement learning inside the [Webots](https://cyberbotics.com/) robot simulator — a practical entry point for experimenting with RL without physical hardware. Physics simulation more broadly is important for training robots before deploying them. One notable example: GTA was used as a training environment for an AI model, which says something about how far synthetic environments have come.

## Hardware for local AI

There was plenty of hardware talk. Options on the table ranged from Macs and gaming PCs to the Framework Desktop AI Max+ 395 (128 GB RAM, though memory bandwidth trails Apple Silicon) and multi-GPU SXM2/SXM4 boards (A100/V100) available secondhand on eBay. The RTX Pro A6000 Blackwell with 96 GB VRAM is at the high end for a single workstation card.

The CPU-only reality check: a 52-core HP Z6G4 with 300 GB DDR4 gets around 1 token/second running MiniMax 2.5 at 5-bit quantisation with a 200k context window. Usable for some workloads, not for interactive chat.

One pragmatic take from the floor: wait for some AI companies to fail — their hardware will end up on eBay.

## Homelabbing

Running AI locally means running infrastructure. The conversation covered [Tailscale](https://tailscale.com/) for zero-config VPN access to home lab machines, [Unraid](https://unraid.net/) as a flexible home server OS, and running agents inside VMs. [NixAI](https://discourse.nixos.org/t/introducing-nixai-your-ai-powered-nixos-companion) was mentioned for NixOS users wanting an AI-assisted configuration companion. [SuperHouse](https://www.superhouse.tv/) is worth a look for home automation hardware projects.

## Home Assistant and local AI

Integrating local AI with home automation is a natural fit. Home Assistant with Zigbee is the recommended stack. On the IoT device side: Tuya uses a proprietary protocol and is best avoided. Older Tuya devices can be reflashed to [Tasmota](https://tasmota.github.io/) if the firmware version is old enough. Tapo is reasonably straightforward to work with. Ewelink (used for some sensors) has been more problematic.

## Linux distros and AI

Fedora is well-positioned for AI workloads. COSMIC (the new desktop from System76 for Pop!_OS) is worth watching for its AI integration direction.

## Coding with AI

Harnesses and coding agents were discussed — the tooling around directing AI to write and run code in structured ways. A practical area where the tooling is evolving quickly.

---

*LAIT Night runs monthly. See [upcoming events](https://linuxvictoria.org/events/lait-night-chat-linux-and-ai/) for the next session.*
