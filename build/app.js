"use strict";

var _server = _interopRequireDefault(require("./server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PORT = 3001;

_server["default"].listen(PORT, function () {
  console.log("Cushion server is running on ".concat(PORT));
});