"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addSubscriptionToUserDoc = exports.fetchAuthAPIOptions = exports.defaultNewUserDoc = exports.couchUserAddress = void 0;

var _btoa = _interopRequireDefault(require("btoa"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PRODUCTION = process.env.NODE_ENV === "prod";

var envFile = _fs["default"].readFileSync('cushionEnv.json');

var envVars = JSON.parse(envFile);
var couchAuth = PRODUCTION ? {
  admin: process.env.COUCH_ADMIN,
  password: process.env.COUCH_PASSWORD
} : {
  admin: envVars.couch.devAdmin,
  password: envVars.couch.devPassword
};

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
  console.log(couchAuth);
  var opts = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic ".concat((0, _btoa["default"])("".concat(couchAuth.admin, ":").concat(couchAuth.password)))
    }
  };
  return data ? _objectSpread({}, opts, {
    body: JSON.stringify(data)
  }) : opts;
};

exports.fetchAuthAPIOptions = fetchAuthAPIOptions;

var addSubscriptionToUserDoc = function addSubscriptionToUserDoc(userDoc, sub) {
  return _objectSpread({}, userDoc, {
    subscriptions: [].concat(_toConsumableArray(subscriptions), [sub])
  });
};

exports.addSubscriptionToUserDoc = addSubscriptionToUserDoc;