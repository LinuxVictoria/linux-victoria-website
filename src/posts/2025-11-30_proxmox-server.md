---
title: "Setting Up the Proxmox Playground"
author: Sophie
description: "How we rebuilt a donated PC into a Proxmox-based sandbox for testing Linux distros, running open-weight LLMs, and creating disposable VM environments accessible through Tailscale or future one-click web buttons."
tags: ["Resource", "Distribution", "Distros"]
image: "/assets/images/pve-penguins-beach-server.png"
preview_image: "http://linuxvictoria.org/assets/images/pve-penguins-beach-server.png"
postDate: 2025-11-30
---

A donated machine, previously running Windows 10, has been repurposed to host a [Proxmox VE](https://www.proxmox.com/) server for our Linux and open source experiments. It had been sitting unused for some time, and now it is ready to explore everything from new Linux distros to open weight LLMs.

[Proxmox VE](https://www.proxmox.com/) is a powerful open source virtualization platform. It allows us to run multiple Linux environments, disposable VMs, LXC containers and local LLM tools all on a single machine. Think of it as a control center where anyone can instantly spin up a virtual machine, test a distro, try an AI model or build an experiment without needing their own hardware. To learn more about the machine, check out the [specs](#specs).

Since the machine is on a closed network, access is handled through [Tailscale](https://tailscale.com/), which is an [open-source](https://tailscale.com/opensource), zero-config, WireGuard-based mesh VPN that lets trusted users connect as if they were on the same local network. If you want to try things out, [reach out](team@linuxvictoria.org) and we will invite you to the Tailscale network and then create a Proxmox login for you.  

In the future, a public webpage will list available distros and LLM models. Clicking a “Try” button will automatically create a disposable VM through the Proxmox API. When you close your browser tab the VM will be deleted. No login will be required for basic experimenting.

## How the Server Was Set Up

Below is how the machine was prepared, from installation to templates and cloning.   
During the set up, ChatGPT and Claude assisted a lot, so these dot points were summarised based on the chats (proof read to be accurate by a human of course).

### 1. Installing Proxmox VE

1. Wiped both SSDs  
2. Created a Proxmox boot USB using Balena Etcher  
3. Booted into the installer and selected “Graphical Install”  
4. Ran into a problem where the screen kept going blank after a few seconds  
   - Solved by adding `nomodeset` to the boot options  
5. Selected the 2 TB SSD for Proxmox  
6. Chose ZFS RAID 0 on the single disk for simplicity  
7. Set hostname, management IP, gateway and DNS  
8. Completed installation  
9. Logged into the Proxmox web interface using the Tailscale IP

### 2. Preparing Storage

1. Used `lsblk` to confirm all disks  
2. Mounted the NVMe read-only to check if any old files were on it  
3. Unmounted it and added it to Proxmox as a storage location  
   - The NVMe now stores ISO images and LLM files

### 3. Getting ISO Files Ready

1. Opened Storage > ISO Images  
2. Used “Download from URL” to fetch distro ISOs directly onto the NVMe  
   - This Proxmox feature is perfect because you can paste any distro’s ISO link and it downloads automatically

### 4. Creating a VM

1. Created a new VM  
2. Selected an ISO to boot from  
3. Assigned CPU, RAM and disk  
4. Booted into the live environment  
5. Realized custom wallpaper changes in a live ISO session cannot be saved  
   - Live sessions run in RAM  
   - To customize, the OS must be installed at least once

### 5. Making a Template

1. Created the VM and confirmed it is working   
3. Shut the VM down  
4. Converted it to a template  
5. Repeated the same steps with Linux Mint 22.2  
6. Templates are now ready to be cloned anytime

We now have:
- Pop!_OS 24.04 template  
- Linux Mint 22.2 template  

If you want to help create templates for other distros, [let us know](team@linuxvictoria.org). It is easy now that the system is configured.

### 6. Cloning a Template Into a Disposable VM

1. Right click a template  
2. Select “Clone”  
3. Choose “Linked Clone”  
4. Start the VM and experiment  
5. Shut it down  
6. Delete the VM when you are done  
   - It never affects the template  
   - The next clone always starts fresh

This is the exact workflow planned for the public webpage: click a distro, get a clone, experiment, close it, and the VM disappears. It will of course be done through API's instead of direct login.

## LLM Support and Plans

The server will also host several open weight LLMs in `.gguf` format. Users will be able to try them in a local sandbox. Each model will include examples of how to use it in an agentic setup through MCPs. After trying a model, you will be able to download the same model and configuration so you can run it locally. Because everything runs locally, no data leaves your machine.

The long term goal is to offer:
- A list of LLMs  
- A “Try This Model” button for each  
- Pre-configured agentic examples  
- Downloadable local setups for reproducibility  

If you want access or want to help build more templates or LLM environments, [reach out](team@linuxvictoria.org) and we will get you connected.

<br id="specs">

---
### System Summary Specs for Nerds:

**CPU**
- **Model:** AMD Ryzen 9 3900X  
- **Cores/Threads:** 12 cores / 24 threads  
- **Base/Boost Clock:** ~3.8 GHz base / up to ~4.7 GHz boost  
- **Virtualization:** AMD‑V (SVM) supported  

**Memory**
- **Total RAM:** 64 GB (2 × 32 GB DDR4)

**GPU**
- **Model:** NVIDIA GeForce RTX 2060  
- **PCI Devices:**  
  - VGA Controller  
  - HD Audio  
  - USB‑C Controller  

**Storage**
- **NVMe SSD:** ~500 GB 
- **HDD/SSD:** ~2 TB (sda, Proxmox system + storage)  

**System Topology**
- **NUMA Nodes:** 1  
- **L3 Cache:** 64 MB  

**Virtualization / Security**
- Hardware virtualization fully supported  
- Spectre/Meltdown & related mitigations applied (per microcode)

---

### Adding More Nodes
Proxmox runs on a node, which is any PC or server with compatible hardware. Nodes can be easily added to the cluster, letting you expand computing power, GPU availability, and storage. If you have a machine, that is sitting around wanting to be put to use, with a good CPU, GPU, lots of RAM, or extra storage, [consider donating it](team@linuxvictoria.org). Every new node makes the playground bigger and faster for everyone.