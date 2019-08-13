import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import webPush from 'web-push';
import fs from 'fs';

import * as utils from './util/util';

const PRODUCTION = process.env.NODE_ENV === "prod";
const envFile = fs.readFileSync('cushionEnv.json');
const envVars = JSON.parse(envFile);
const vapidKeys = envVars['vapid-keys'];
const couchBaseURL = PRODUCTION ? envVars.couch.URL : 'http://localhost:5984/';
const couch = envVars.couch;

const server = express();

if (!PRODUCTION) {
  server.use(cors());
} else {
  server.use(cors({
    origin: envVars.app.URL
  }));
}

server.use(express.json());

webPush.setVapidDetails(
  `mailto:${envVars.app.email}`,
  vapidKeys.public,
  vapidKeys.private
);

server.get('/', (req, res) => {
  res.send('CushionServer is running');
})

server.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  return fetch(
    utils.couchUserAddress(couchBaseURL, username),
    utils.fetchAuthAPIOptions({
      method: 'PUT',
      data: utils.defaultNewUserDoc(username, password)
    })
  )

    .then(response => {
      res.status(response.status)
      return response.json();
    })

    .then(json => res.send(json))
  
    .catch(error => {
      res.status(500)
      res.send({error: 'Database cannot be reached'});
    });
});

server.post('/subscribe_device_to_notifications', (req, res) => {
  const username = req.body.username;
  const subscription = req.body.subscription;
  subscription.device = req.body.device;

  const userCouchUrl = utils.couchUserAddress(couchBaseURL, username);

  return fetch(
    userCouchUrl,
    utils.fetchAuthAPIOptions({ method: 'GET' })
  )

    .then(response => response.json()).then(userDoc => {
      return fetch(
        userCouchUrl,
        utils.fetchAuthAPIOptions({
          method: 'PUT',
          data: utils.addSubscriptionToUserDoc(userDoc, subscription),
        })
      )

        .then(response => {
          res.status(response.status);
          return response.json();
        }).then(
          json => res.send(json)
        );
    })

    .catch(_ => {
      res.status(500);
      res.send({error: 'Database cannot be reached'});
    });
});

server.post('/trigger_update_user_devices', (req, res) => {
  const username = req.body.username;

  fetch(
    utils.couchUserAddress(couchBaseURL, username),
    utils.fetchAuthAPIOptions({method: 'GET'})
  )
  
    .then(response => response.json()).then(json => {
      const subscriptions = json.subscriptions;
      const payload = JSON.stringify({
        action: 'SYNC',
        title: 'Sync device'
      });

      subscriptions.forEach(sub => {
        webPush.sendNotification(sub, payload);
      });

    })

    .catch(_ => {
      res.status(500);
      res.send({error: 'Database cannot be reached'});
    });
});

export default server;
