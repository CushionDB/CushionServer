"use strict";

var _express = _interopRequireDefault(require("express"));

var _btoa = _interopRequireDefault(require("btoa"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _cors = _interopRequireDefault(require("cors"));

var _webPush = _interopRequireDefault(require("web-push"));

var _fs = _interopRequireDefault(require("fs"));

var utils = _interopRequireWildcard(require("./util/util"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var envFile = _fs["default"].readFileSync('cushionEnv.json');

var envVars = JSON.parse(envFile);
var vapidKeys = envVars['vapid-keys'];
var appDetails = envVars.app;
var couchDetails = envVars.couch;
var PORT = 3001;
var server = (0, _express["default"])(); // no cors in prod

server.use((0, _cors["default"])());
server.use(_express["default"].json());

_webPush["default"].setVapidDetails("mailto:".concat(appDetails.email), vapidKeys["public"], vapidKeys["private"]);

server.get('/', function (req, res) {
  res.send('CushionServer is running');
});
server.post('/signup', function (req, res) {
  console.log('[REQUEST BODY] ', req.body);
  console.log('------------------');
  var username = req.body.username;
  var password = req.body.username;
  var url = utils.couchUserAddress(couchDetails.baseURL, username);
  var data = utils.defaultNewUserDoc(username, password);
  var fetchOptions = utils.fetchAuthAPIOptions({
    method: 'PUT',
    data: data,
    auth: {
      name: couchDetails.admin,
      pass: couchDetails.password
    }
  });
  return (0, _nodeFetch["default"])(url, fetchOptions).then(function (response) {
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
  });
});
server.listen(PORT, function () {
  console.log("Cushion server is running on ".concat(PORT));
});