import express from 'express';
import btoa from 'btoa';
import fetch from 'node-fetch';
// no cors in prod
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
// no cors in prod
server.use(cors());
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
  console.log('[REQUEST BODY] ', req.body);
  console.log('------------------');

  const username = req.body.username;
  const password = req.body.username;
  const url = utils.couchUserAddress(couchDetails.baseURL, username);
  const data = utils.defaultNewUserDoc(username, password);

  const fetchOptions = utils.fetchAuthAPIOptions({
    method: 'PUT',
    data,
    auth: {
      name: couchDetails.admin,
      pass: couchDetails.password
    }
  });

  return fetch(url, fetchOptions)
    
    .then(response =>  {
      console.log('[RESPONSE] ', response);

      // TODO HANDLE 400 STATUS FROM SERVER
      res.send(response);
  }).catch(error => {
      // NETWORK ERROR GOES IN HERE
      console.log('[ERROR] ', error);
  });
});

server.post('/subscribe', (req, res) => {
  const username = req.body.username;
  const subscription = req.body.subscription;
  subscription.device = req.body.device;
  console.log('[SUBSCRIPTION] ', subscription);

  let url = `http://127.0.0.1:5984/_users/org.couchdb.user:${username}`;

  let options = {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: 'Basic '+btoa('admin:admin')
    },
  };

  fetch(url, options)
    .then(getRes => {
      getRes.json().then(json => {
        let rev = json._rev;
        console.log('[GET RES JSON] ', json);
        let data = {
          ...json,
          subscriptions: [
            ...json.subscriptions,
            subscription
          ]
        };

        options = {
          method: 'PUT',
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: 'Basic '+btoa('admin:admin')
          },
        };

        return fetch(url, options)
          .then(response =>  {
          console.log('[RESPONSE] ', response);

          // TODO HANDLE 400 STATUS FROM SERVER
          res.send(response);
        }).catch(error => {
          // NETWORK ERROR GOES IN HERE
          console.log('[ERROR] ', error);
        });
      })
    }).catch(err => {
      console.log('[GET REV ERROR] ', err);
    });
});

server.post('/triggerSync', (req, res) => {
  const username = req.body.username;
  let url = `http://127.0.0.1:5984/_users/org.couchdb.user:${username}`;
  let options = {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: 'Basic '+btoa('admin:admin')
    },
  };

  fetch(url, options)
  .then(response => {
    response.json().then(json => {
      const subscriptions = json.subscriptions;
      const payload = JSON.stringify({
        action: 'SYNC',
        title: 'Updated!'
      });

      subscriptions.forEach(sub => {
        webPush.sendNotification(sub, payload);
      })
    });
  })
});

server.listen(PORT, () => {
  console.log(`Cushion server is running on ${PORT}`);
});
