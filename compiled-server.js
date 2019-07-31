"use strict";

var _express = _interopRequireDefault(require("express"));

var _btoa = _interopRequireDefault(require("btoa"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _cors = _interopRequireDefault(require("cors"));

var _webPush = _interopRequireDefault(require("web-push"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
// const saltRounds = 2;
var server = (0, _express["default"])();
server.use((0, _cors["default"])());
server.use(_express["default"].json());
var publicVapidKey = 'BCA04yoTGRbqfe__mD3jXmNxYWCKF2jcPY4Kbas7GqV3o7vS43kahAucdIQF_aFix1mCkkGQzRwqob53atFxHJg';
var privateVapidKey = 'd06XlKrpPtkRrYc0EyEXZ2r2k14H1vUkj5GfOoEate0';

_webPush["default"].setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);

var PORT = 3001;
var config = {
  couchBaseUrl: 'http://localhost:5984/',
  admin: 'admin',
  adminPass: 'admin',
  tokenKey: '12345678'
};
server.use(function (req, res, next) {
  try {
    var token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, config.tokenKey, function (err, payload) {
      console.log(payload);

      if (payload) {
        var options = {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: 'Basic ' + (0, _btoa["default"])('admin:admin')
          }
        };
        return (0, _nodeFetch["default"])("http://127.0.0.1:5984/pouchdb_users/".concat(payload.userId), options).then(function (response) {
          console.log('[RESPONSE] ', response);
          req.user = response.body;
          console.log(req.user);
          next();
        })["catch"](function (error) {
          console.log('[ERROR] ', error);
        });
      } else {
        next();
      }
    });
  } catch (_unused) {
    next();
  }
}); // server.post('/signin',function(req,res) {
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

server.post('/signup', function (req, res) {
  console.log('[REQUEST BODY] ', req.body);
  console.log('------------------');
  var username = req.body.username; // const password = req.body.password;
  // let salt = bcrypt.genSaltSync(saltRounds);

  var url = "http://127.0.0.1:5984/_users/org.couchdb.user:".concat(username); // let url = `http://127.0.0.1:5984/pouchdb_users/`;

  var data = {
    name: username,
    password: req.body.password,
    roles: [],
    type: 'user',
    subscriptions: []
  }; // bcrypt.compareSync(password, hash); true / false

  var options = {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: 'Basic ' + (0, _btoa["default"])('admin:admin')
    }
  };
  return (0, _nodeFetch["default"])(url, options).then(function (response) {
    console.log('[RESPONSE] ', response); // TODO HANDLE 400 STATUS FROM SERVER

    res.send(response);
  })["catch"](function (error) {
    // NETWORK ERROR GOES IN HERE
    console.log('[ERROR] ', error);
  });
});
server.post('/subscribe', function (req, res) {
  var username = req.body.username;
  var subscription = req.body.subscription;
  subscription.device = req.body.device;
  console.log('[SUBSCRIPTION] ', subscription);
  var url = "http://127.0.0.1:5984/_users/org.couchdb.user:".concat(username);
  var options = {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: 'Basic ' + (0, _btoa["default"])('admin:admin')
    }
  };
  (0, _nodeFetch["default"])(url, options).then(function (getRes) {
    getRes.json().then(function (json) {
      var rev = json._rev;
      console.log('[GET RES JSON] ', json);

      var data = _objectSpread({}, json, {
        subscriptions: [].concat(_toConsumableArray(json.subscriptions), [subscription])
      });

      options = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: 'Basic ' + (0, _btoa["default"])('admin:admin')
        }
      };
      return (0, _nodeFetch["default"])(url, options).then(function (response) {
        console.log('[RESPONSE] ', response); // TODO HANDLE 400 STATUS FROM SERVER

        res.send(response);
      })["catch"](function (error) {
        // NETWORK ERROR GOES IN HERE
        console.log('[ERROR] ', error);
      });
    });
  })["catch"](function (err) {
    console.log('[GET REV ERROR] ', err);
  });
});
server.post('/triggerSync', function (req, res) {
  var username = req.body.username;
  var url = "http://127.0.0.1:5984/_users/org.couchdb.user:".concat(username);
  var options = {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: 'Basic ' + (0, _btoa["default"])('admin:admin')
    }
  };
  (0, _nodeFetch["default"])(url, options).then(function (response) {
    response.json().then(function (json) {
      var subscriptions = json.subscriptions;
      var payload = JSON.stringify({
        action: 'SYNC',
        title: 'Updated!'
      });
      subscriptions.forEach(function (sub) {
        _webPush["default"].sendNotification(sub, payload);
      });
    });
    res.status(200).json({});
  });
});
server.listen(PORT, function () {
  console.log("Cushion server is running on ".concat(PORT));
});
