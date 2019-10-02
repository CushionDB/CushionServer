<p align="center"><img src="https://cushiondb.github.io/img/logo-small.png"></p>

# Overview

CushionServer is part 1 of 2 for the CushionDB backend. It is setup as a Docker image and is deployed along with the [CushionCouch](https://github.com/CushionDB/CushionCouchDocker) Docker image using Docker Compose. These two backend components are desgined to work with [CushionClient](https://github.com/CushionDB/CushionClient).

CushionServer was built to abstract away the authentication details from CouchDB for user account management. It is also used to facilitate [PWA push notifications](https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications), which CushionDB uses to automatically sync data across mutliple devices

# Getting Started

## Install

We reccomend that you head over to [CushionBackend](https://github.com/CushionDB/CushionBackend) and follow the installation steps in that repository as that is the easiest to get the CushionServer and CushionCouch database up and running.

## Setup

To install outside of a container run `npm install cushiondb-server`. Add the app's dev dependencies to your packege-json and install them, and then run `npm run dev` which will load the server through webpack's dev server.`npm start` is not currently meant to run outside of production.

Head over to [CushionCouch](https://github.com/CushionDB/CushionCouchDocker) to run CushionDB's couchDB docker image. Running CouchDB manually will require changing CouchDB's configurations and is not recommended.

<p align="center"><img src="https://cushiondb.github.io/img/cushion-backend-init.gif"></p>

# The Team

[Avshar Kirksall]() *Software Engineer* Brooklyn, NY

[Jaron Truman]() *Software Engineer* Las Vegas, NV

[Daniel Rote](https://drote.github.io) *Software Engineer* Seattle, WA
