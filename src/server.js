import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import webPush from 'web-push';
import * as utils from './utils/utils';

const envVars = utils.getEnvVars();
const server = express();

const prodCors = (req, res, next) => {
  const origin = req.headers.origin;
  if (envVars.appAddress.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
}

if (process.env.NODE_ENV !== "production") {
  server.use(cors());
} else {
  server.use(prodCors);
}

server.use(express.json());

webPush.setVapidDetails(
  `mailto:${envVars.appEmail}`,
  envVars.publicVapid,
  envVars.privateVapid
);

server.get('/', (req, res) => {
  res.send('CushionServer is running here');
})

server.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  return fetch(
    utils.couchUserAddress(envVars.couchBaseURL, username),
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

  .catch(_ => {
    res.status(500)
    res.send({error: 'Database cannot be reached'});
  });
});

server.post('/subscribe_device_to_notifications', (req, res) => {
  const username = req.body.username;
  const subscription = req.body.subscription;
  subscription.device = req.body.device;

  const userCouchUrl = utils.couchUserAddress(envVars.couchBaseURL, username);

  return fetch(
    userCouchUrl,
    utils.fetchAuthAPIOptions({ method: 'GET' })
  )

  .then(response => response.json())
  .then(userDoc => {
    return fetch(
      userCouchUrl,
      utils.fetchAuthAPIOptions({
        method: 'PUT',
        data: utils.addSubscriptionToUserDoc(userDoc, subscription),
      })
    );
  })

  .then(response => {
    res.status(response.status);
    return response.json();
  })

  .then(json => res.send(json))

  .catch(_ => {
    res.status(500);
    res.send({error: 'Database cannot be reached'});
  });
});

server.get('/is_subscribed_to_push/:username', (req, res) => {
  const username = req.params.username

  fetch(
    utils.couchUserAddress(envVars.couchBaseURL, username),
    utils.fetchAuthAPIOptions({ method: 'GET' })
  )

  .then(response => response.json()).then(json => {
    const subscriptions = json.subscriptions;

    if (subscriptions.length > 0) {
      res.send({
        ok: true,
        subscribed: true
      });
      return;
    }
    
    res.send({
      ok: true,
      subscribed: false
    });
  })

  .catch(_ => {
    res.status(500);
    res.send({error: 'Database cannot be reached'});
  });
});

server.post('/trigger_update_user_devices', (req, res) => {
  const username = req.body.username;
  const device = req.body.device;

  fetch(
    utils.couchUserAddress(envVars.couchBaseURL, username),
    utils.fetchAuthAPIOptions({ method: 'GET' })
  )

  .then(response => response.json())
  .then(json => {
    const subscriptions = json.subscriptions;

    if (subscriptions.length === 0) {
      res.status(202);
      res.send("User has no subscriptions");
    }

    const payload = JSON.stringify({
      action: 'SYNC',
      title: 'Sync device'
    });

    subscriptions.forEach(sub => {
      if (sub.device != device) {
        webPush.sendNotification(sub, payload);
      }
    });

    res.status(200);
    res.send({
      ok: true
    });
  })

  .catch(_ => {
    res.status(500);
    res.send({error: 'Database cannot be reached'});
  });
});

server.post('/updatePassword', (req, res) => { 
  const username = req.body.name;
  const newPassword = req.body.password;

  fetch(
    utils.couchUserAddress(envVars.couchBaseURL, username),
    utils.fetchAuthAPIOptions({ method: 'GET' })
    )
    
    .then(response => response.json())
    .then(json => {
      return fetch(
        utils.couchUserAddress(envVars.couchBaseURL, username),
        utils.fetchAuthAPIOptions({ 
          method: 'PUT', 
          data: utils.editUserDoc(json, { password: newPassword })
        }))
    })

    .then(response => {
      res.status(response.status);
      return response.json();
    })

    .then(json => res.send(json))

    .catch(_ => {
      res.status(500)
      res.send({error: 'Database cannot be reached'});
    });
});

export default server;
