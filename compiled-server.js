"use strict";

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var server = (0, _express["default"])();
var PORT = 3001;
server.post('/signup', function (req, res) {
  res.send('loud and clear');
});
server.listen(PORT, function () {
  console.log("Cushion server is running on ".concat(PORT));
});
