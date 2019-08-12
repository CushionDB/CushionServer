import express from 'express';
import btoa from 'btoa';
import fetch from 'node-fetch';
import cors from 'cors';
import webPush from 'web-push';
import fs from 'fs';

import * as utils from './util/util';

const envFile = fs.readFileSync('cushionEnv.json');
const envVars = JSON.parse(envFile);
const vapidKeys = envVars['vapid-keys'];
const appDetails = envVars.app;
const couchDetails = envVars.couch;
const PORT = 3001;

const server = express();

server.use(cors({
  origin: appDetails.URL
}));

server.use(express.json());

webPush.setVapidDetails(
  `mailto:${appDetails.email}`,
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
    utils.couchUserAddress(couchDetails.baseURL, username),
    utils.fetchAuthAPIOptions({
      method: 'PUT',
      data,
      auth: `Basic ${btoa(`${couchDetails.admin}:${couchDetails.password}`)}`
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

  const userCouchUrl = utils.couchUserAddress(couchDetails.baseURL, username);

  return fetch(
    userCouchUrl,
    utils.fetchAuthAPIOptions({
      method: 'GET',
      auth: `Basic ${btoa(`${couchDetails.admin}:${couchDetails.password}`)}`
    })
  )

    .then(response => response.json()).then(userDoc => {
      return fetch(
        userCouchUrl,
        utils.fetchAuthAPIOptions({
          method: 'PUT',
          data: utils.addSubscriptionToUserDoc(userDoc, subscription),
          auth: `Basic ${btoa(`${couchDetails.admin}:${couchDetails.password}`)}`
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

  const url = utils.couchUserAddress(couchDetails.baseURL, username);

  const fetchOptions = utils.fetchAuthAPIOptions({
    method: 'GET',
    auth: `Basic ${btoa(`${couchDetails.admin}:${couchDetails.password}`)}`
  });

  fetch(url, fetchOptions)
  
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

server.listen(PORT, () => {
  console.log(`Cushion server is running on ${PORT}`);
});
