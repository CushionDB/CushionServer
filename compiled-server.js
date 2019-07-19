"use strict";

var _express = _interopRequireDefault(require("express"));

var _btoa = _interopRequireDefault(require("btoa"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _cors = _interopRequireDefault(require("cors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var server = (0, _express["default"])();
server.use((0, _cors["default"])());
server.use(_express["default"].json());
var PORT = 3001;
var config = {
  couchBaseUrl: 'http://localhost:5984/',
  admin: 'admin',
  adminPass: 'admin'
};
server.post('/signup', function (req, res) {
  console.log('[REQUEST BODY] ', req.body);
  console.log('------------------');
  var username = req.body.username;
  var password = req.body.password;
  var url = "http://127.0.0.1:5984/_users/org.couchdb.user:".concat(username);
  var data = {
    name: username,
    password: password,
    roles: [],
    type: 'user'
  };
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
    console.log('[RESPONSE] ', response);
    res.send(response);
  })["catch"](function (error) {
    console.log('[ERROR] ', error);
  });
});
server.listen(PORT, function () {
  console.log("Cushion server is running on ".concat(PORT));
});
