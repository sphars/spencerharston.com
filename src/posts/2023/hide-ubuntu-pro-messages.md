---
title: Hide Ubuntu Pro Messages in Ubuntu
description: A simple way to hide Ubuntu Pro messages showing up in your Ubuntu system.
date: 2023-02-01 12:00:00
updated: 2023-02-02 19:00:00
tags:
    - self-hosting
    - tips
    - ubuntu
image: https://images.unsplash.com/photo-1629654297299-c8506221ca97
imageAlt: Screenshot of a Ubuntu linux bash terminal
---

A recent update to Ubuntu has added messages about the Ubuntu Pro subscription service in both the default message of the day (MOTD) (like when logging into a Ubuntu server) and when using `apt` commands. 

The message showing up in the MOTD is:

> Introducing Expanded Security Maintenance for Applications.
> Receive updates to over 25,000 software packages with your
> Ubuntu Pro subscription. Free for personal use.
>   
> https://ubuntu.com/pro

The message that shows up in `apt` commands is similar to this:

> Try Ubuntu Pro beta with a free personal subscription on up to 5 machines.  
> Learn more at https://ubuntu.com/pro

You can read more about Ubuntu Pro on [Ubuntu's website](https://ubuntu.com/pro) if you're curious.

I'm running Ubuntu Server 20.04.5 on my home server, which from my quick research, it looks like the messages only show up in LTS distributions. I really don't care about subscribing to Ubuntu Pro, even if it's free for personal use. I really dislike seeing ads in my OS, so I figured I can just hide the messages.

## Hide the Ubuntu Pro message in the MOTD
To hide the message, it's as simple as renaming the file at `/etc/update-motd.d/88-esm-announce`. You can do this with the following command:

```
sudo mv /etc/update-motd.d/88-esm-announce /etc/update-motd.d/88-esm-announce.bak
```
Simple as that. 

## Hide the Ubuntu Pro messages in `apt` commands
Similar to the steps above, you can turn off the messages by renaming the file at `/etc/apt/apt.conf.d/20apt-esm-hook.conf` and creating an empty file in its place. The commands are:

```
sudo mv /etc/apt/apt.conf.d/20apt-esm-hook.conf /etc/apt/apt.conf.d/20apt-esm-hook.conf.bak
sudo touch /etc/apt/apt.conf.d/20apt-esm-hook.conf
```
A reboot should make sure it sticks.

Note that running `apt` commands shows the messages, whereas using `apt-get` does not. This is because the former is for more human-readable package management, and the latter is used more often in scripts (so you may not see them anyways).

## Alternatives

The `ubuntu-advantage-tools` package is the culprit behind these update messages^[My server currently has version 27.13.3~20.04.1 installed]. Some have reported^[See this [comment on reddit](https://www.reddit.com/r/Ubuntu/comments/xxafiu/how_to_remove_advertisements_from_apt/iultkp5/)] that removing that package will prevent future messages from appearing, but it is a required system package and may break things.

If a future package update changes how this works, I'll try and remember to update this post.
