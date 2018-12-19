---
title: "home security for a raspbery pi"
category: code
tags: raspberry pi, slack-bot, iot, wot, nodejs, rest api
---

[![alt code snippet][ref-image]][github-link]

A basic home security system as a WOT-Thing, using a Raspberry Pi with a REST-api as a back-end, and a slack bot as a front-end to send messages and recieve commands.

The Pi is based on the example from the Web Of Things-book by Dominique D. Guinard and Vlad M. Trifa.

The Pi will, when turned on:
Have a motion sensor that can be turned on and off if the right code is supplied. If the motion sensor is on, a LED is on as well.
Have a camera that will take a picture when told.
Have a speaker that will make a sound when called.
If the motion sensor is activated, the Pi will automatically take a picture, sound the sound, and send the picture to all the subscribed users.
 
[on github][github-link]

[github-link]: https://github.com/theuggla/pi-home-security-playground
[ref-image]: ../assets/projects/images/raspberry.png