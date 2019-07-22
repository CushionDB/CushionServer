"use strict";

var _express = _interopRequireDefault(require("express"));

var _btoa = _interopRequireDefault(require("btoa"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _cors = _interopRequireDefault(require("cors"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var saltRounds = 2;
var server = (0, _express["default"])();
server.use((0, _cors["default"])());
server.use(_express["default"].json());
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

    _jsonwebtoken["default"].verify(token, config.tokenKey, function (err, payload) {
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
});
server.post('/signin', function (req, res) {
  var options = {
    method: 'POST',
    body: JSON.stringify({
      "selector": {
        "username": req.body.username
      },
      "fields": ["password", "_id", "username"],
      "limit": 1
    }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: 'Basic ' + (0, _btoa["default"])('admin:admin')
    }
  };
  return (0, _nodeFetch["default"])("http://127.0.0.1:5984/pouchdb_users/_find", options).then(function (response) {
    return response.json();
  }).then(function (response) {
    var user = response.docs[0];

    if (_bcrypt["default"].compareSync(req.body.password, user.password)) {
      var token = _jsonwebtoken["default"].sign({
        userId: user._id
      }, config.tokenKey);

      res.status(200).json({
        userId: user._id,
        username: user.username,
        token: token
      });
    } else {
      res.status(400).json({
        message: 'Invalid Password/Username'
      });
    }
  })["catch"](function (error) {
    console.log('[ERROR] ', error);
    res.status(400).json({
      message: 'Invalid Password/Username'
    });
  });
});
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
    type: 'user'
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
}); // server.post('/signin',)

server.listen(PORT, function () {
  console.log("Cushion server is running on ".concat(PORT));
});
