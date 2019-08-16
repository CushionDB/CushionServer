<p align="center"><img src="https://cushiondb.github.io/img/logo-small.png"></p>

# Overview

CushionServer is part 1 of 2 for the CushionDB backend. It is setup as a Docker image and is deployed along with the [CushionCouch](https://github.com/CushionDB/CushionCouchDocker) Docker image using Docker Compose. This allows for simple deployment and configuration.

CushionServer was built to abstract away the authentication details from CouchDB for user account management. It is also used to facilitate [PWA push notifications](https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications), which CushionDB uses to automatically sync data across mutliple devices

# Getting Started

## Install

The CushionServer container is built and run on your server automatically once you have cloned [CushionDocker](https://github.com/CushionDB/CushionDocker) and go through the setup steps.

## Setup

From inside the [CushionDocker](https://github.com/CushionDB/CushionDocker) directory, you will run `cushion-backend-init`, which will prompt you to input information that will be used for networking between the client and the backend, CouchDB authentication details and push notification keys.

<p align="center"><img src="https://cushiondb.github.io/img/cushion-backend-init.gif.gif"></p>

# The Team

[Avshar Kirksall]() *Software Engineer* Brooklyn, NY

[Jaron Truman]() *Software Engineer* Las Vegas, NV

[Daniel Rote]() *Software Engineer* Seattle, WA
