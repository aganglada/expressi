'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _router = require('./services/router');

var _router2 = _interopRequireDefault(_router);

var _logger = require('./services/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use(_logger2.default);

exports.default = function (dir, cb) {
  if (typeof dir === 'function') {
    dir = _path2.default.resolve(__dirname, 'pages');
    cb = dir;
  }

  return (0, _router2.default)(app, dir, cb);
};