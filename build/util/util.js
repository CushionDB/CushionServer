"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchAuthAPIOptions = exports.defaultNewUserDoc = exports.couchUserAddress = void 0;

var couchUserAddress = function couchUserAddress(baseURL, username) {
  return "".concat(baseURL, "_users/org.couchdb.user:").concat(username);
};

exports.couchUserAddress = couchUserAddress;

var defaultNewUserDoc = function defaultNewUserDoc(name, password) {
  return {
    name: name,
    password: password,
    roles: [],
    type: 'user',
    subscriptions: []
  };
};

exports.defaultNewUserDoc = defaultNewUserDoc;

var fetchAuthAPIOptions = function fetchAuthAPIOptions(_ref) {
  var method = _ref.method,
      data = _ref.data,
      auth = _ref.auth;
  return {
    method: method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic ".concat(btoa("".concat(auth.name, ":").concat(auth.pass)))
    }
  };
};

exports.fetchAuthAPIOptions = fetchAuthAPIOptions;