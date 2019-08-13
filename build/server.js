"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _cors = _interopRequireDefault(require("cors"));

var _webPush = _interopRequireDefault(require("web-push"));

var utils = _interopRequireWildcard(require("./util/util"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PRODUCTION = process.env.NODE_ENV === "prod";
var envVars = utils.getEnvVars();
var server = (0, _express["default"])();

if (!PRODUCTION) {
  server.use((0, _cors["default"])());
} else {
  server.use((0, _cors["default"])({
    origin: envVars.appURL
  }));
}

server.use(_express["default"].json());

_webPush["default"].setVapidDetails("mailto:".concat(envVars.appEmail), envVars.publicVapid, envVars.privateVapid);

server.get('/', function (req, res) {
  res.send('CushionServer is running');
});
server.post('/signup', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  return (0, _nodeFetch["default"])(utils.couchUserAddress(envVars.couchBaseURL, username), utils.fetchAuthAPIOptions({
    method: 'PUT',
    data: utils.defaultNewUserDoc(username, password)
  })).then(function (response) {
    res.status(response.status);
    return response.json();
  }).then(function (json) {
    return res.send(json);
  })["catch"](function (_) {
    res.status(500);
    res.send({
      error: 'Database cannot be reached'
    });
  });
});
server.post('/subscribe_device_to_notifications', function (req, res) {
  var username = req.body.username;
  var subscription = req.body.subscription;
  subscription.device = req.body.device;
  var userCouchUrl = utils.couchUserAddress(envVars.couchBaseURL, username);
  return (0, _nodeFetch["default"])(userCouchUrl, utils.fetchAuthAPIOptions({
    method: 'GET'
  })).then(function (response) {
    return response.json();
  }).then(function (userDoc) {
    console.log(utils.addSubscriptionToUserDoc(userDoc, subscription));
    return (0, _nodeFetch["default"])(userCouchUrl, utils.fetchAuthAPIOptions({
      method: 'PUT',
      data: utils.addSubscriptionToUserDoc(userDoc, subscription)
    })).then(function (response) {
      res.status(response.status);
      return response.json();
    }).then(function (json) {
      return res.send(json);
    });
  })["catch"](function (_) {
    res.status(500);
    res.send({
      error: 'Database cannot be reached'
    });
  });
});
server.post('/trigger_update_user_devices', function (req, res) {
  var username = req.body.username;
  (0, _nodeFetch["default"])(utils.couchUserAddress(envVars.couchBaseURL, username), utils.fetchAuthAPIOptions({
    method: 'GET'
  })).then(function (response) {
    return response.json();
  }).then(function (json) {
    var subscriptions = json.subscriptions;
    var payload = JSON.stringify({
      action: 'SYNC',
      title: 'Sync device'
    });
    subscriptions.forEach(function (sub) {
      _webPush["default"].sendNotification(sub, payload);
    });
  })["catch"](function (_) {
    res.status(500);
    res.send({
      error: 'Database cannot be reached'
    });
  });
});
var _default = server;
exports["default"] = _default;