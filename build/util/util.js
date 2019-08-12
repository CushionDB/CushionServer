"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchAuthAPIOptions = exports.defaultNewUserDoc = exports.couchUserAddress = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var couchUserAddress = function couchUserAddress(baseURL, username) {
  return "".concat(baseURL, "_users/org.couchdb.user:").concat(username);
};

exports.couchUserAddress = couchUserAddress;

var defaultNewUserDoc = function defaultNewUserDoc(name, password) {
  return {
    name: name,
    password: password,
    roles: [],
    type: "user",
    subscriptions: []
  };
};

exports.defaultNewUserDoc = defaultNewUserDoc;

var fetchAuthAPIOptions = function fetchAuthAPIOptions(_ref) {
  var method = _ref.method,
      data = _ref.data,
      auth = _ref.auth;
  var opts = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: auth
    }
  };
  return data ? _objectSpread({}, opts, {
    body: JSON.stringify(data)
  }) : opts;
};

exports.fetchAuthAPIOptions = fetchAuthAPIOptions;