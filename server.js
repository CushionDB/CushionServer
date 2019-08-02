import express from 'express';
import fetch from 'node-fetch';
import webPush from 'web-push';
import btoa from 'btoa';

// IF DEVELOPMENT
import cors from 'cors';

const server = express();
const PORT = 3001;

server.use(express.json());

// IF DEVELOPMENT
server.use(cors());

// GET FROM CONFIG FILE. GENERATE KEYS AS PART OF INIT SCRIPT
const publicVapidKey = 'BCA04yoTGRbqfe__mD3jXmNxYWCKF2jcPY4Kbas7GqV3o7vS43kahAucdIQF_aFix1mCkkGQzRwqob53atFxHJg';
const privateVapidKey = 'd06XlKrpPtkRrYc0EyEXZ2r2k14H1vUkj5GfOoEate0';

// GET MAIL ADDRESS FROM CONFIG FILE
webPush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);

// TRANSFER TO ACTUAL CONFIG FILE
const config = {
  couchBaseUrl: 'http://localhost:5984/',
  admin: 'admin',
  adminPass: 'admin',
};

// ||| DELETE |||

// server.use((req,res,next) => {
//   try {
//     const token = req.headers.authorization.split(' ')[1];
//     jwt.verify(token, config.tokenKey, (err, payload) => {
//       console.log(payload);

//       if(payload){
//         let options = {
//           method: 'GET',
//           headers:{
//             "Content-Type": "application/json",
//             Accept: "application/json",
//             Authorization: 'Basic '+btoa('admin:admin')
//           }
//         }
//         return fetch(`http://127.0.0.1:5984/pouchdb_users/${payload.userId}`, options)
//           .then(response =>  {
//             console.log('[RESPONSE] ', response);
//             req.user = response.body;
//             console.log(req.user);
//             next();
//           }).catch(error => {
//             console.log('[ERROR] ', error);
//           });
//       } else {
//         next();
//       }
//     });
//   } catch {
//     next();
//   }
// });

// server.post('/signin',function(req,res) {
//   let options = {
//     method: 'POST',
//     body: JSON.stringify({
//       "selector":{
//         "username": req.body.username ,
//       },
//       "fields": ["password", "_id", "username"],
//       "limit":1,
//     }),
//     headers:{
//       "Content-Type": "application/json",
//       Accept: "application/json",
//       Authorization: 'Basic '+btoa('admin:admin')
//     }
//   }
//   return fetch(`http://127.0.0.1:5984/pouchdb_users/_find`, options)
//     .then(response => response.json())
//     .then(response =>  {
//       const user = response.docs[0];
//
//       if(bcrypt.compareSync(req.body.password, user.password)){
//         let token = jwt.sign({userId:user._id}, config.tokenKey);
//         res.status(200).json({
//           userId: user._id,
//           username: user.username,
//           token
//         })
//       } else {
//         res.status(400).json({message:'Invalid Password/Username'});
//       }
//     }).catch(error => {
//       console.log('[ERROR] ', error);
//       res.status(400).json({message:'Invalid Password/Username'});
//     });
// });

// ||| DELETE |||

// CHANGE ADDRESS TO `api/signup` ?
server.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // CHANGE ALL lets to CONSTS
  // GET FROM UTIL FUNC -> USERADDRESS(COUCH_BASE_URL, USERNAME)
  let url = `http://127.0.0.1:5984/_users/org.couchdb.user:${username}`;
  // let url = `http://127.0.0.1:5984/pouchdb_users/`;

  let data = {
    name: username,
    // GET FROM VAR
    password: req.body.password,
    roles: [],
    type: 'user',
    subscriptions: [],
  };

  let options = {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      // GET ADMIN NAME AND PASS FROM CONFIG FILE 
      Authorization: 'Basic '+btoa('admin:admin')
    },
  };

  // Why are we returning some fetches but not others?
  // Change fetches to await?
  return fetch(url, options)
    .then(response =>  {
    console.log('[RESPONSE] ', response);

    // TODO HANDLE 400 STATUS FROM SERVER
    res.send(response);
  }).catch(error => {
    // NETWORK ERROR GOES IN HERE
    console.log('[ERROR] ', error);
  });
});

// change endpoing to something more descriptive
server.post('/subscribe', (req, res) => {
  const username = req.body.username;
  const subscription = req.body.subscription;
  subscription.device = req.body.device;

  console.log('[SUBSCRIPTION] ', subscription);

  // SEE NOTE FROM ABOVE FUNC
  let url = `http://127.0.0.1:5984/_users/org.couchdb.user:${username}`;

  let options = {
    method: 'GET',
    headers: {
      // HEADERS COULD BE REFACTORES
      "Content-Type": "application/json",
      Accept: "application/json",
      // SEE NOTE ABOVE
      Authorization: 'Basic '+btoa('admin:admin')
    },
  };

  // CHANGE VARIABLE NAMES (getRes etc)
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
            // SEE NOTE ABOVE
            Authorization: 'Basic '+btoa('admin:admin')
          },
        };

        // SEE NOTE ABOUT RETURNING FETCHES
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
      // USER NOT FOUND
      console.log('[GET REV ERROR] ', err);
    });
});

// CHANGE ROUTE NAME
server.post('/triggerSync', (req, res) => {
  // SAME NOTES AS ABOVE

  const username = req.body.username;
  //
  let url = `http://127.0.0.1:5984/_users/org.couchdb.user:${username}`;
  let options = {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      //
      Authorization: 'Basic '+btoa('admin:admin')
    },
  };

  fetch(url, options)
  .then(response => {
    response.json().then(json => {
      const subscriptions = json.subscriptions;
      const payload = JSON.stringify({
        title: 'sync',
        id: 'SYNC'
      });

      subscriptions.forEach(sub => {
        // ONLY SEND PUSH NOTIFICATION IF NOT FROM CURRENT DEVICE
        webPush.sendNotification(sub, payload);
      })
    });

    // WEIRD RESPONSE
    res.status(200).json({});
  })
  // ADD CATCH FOR ERRORS
});

// MESSAHE COULD BE MORE DESCRIPTIVE
server.listen(PORT, () => {
  console.log(`Cushion server is running on ${PORT}`);
});
