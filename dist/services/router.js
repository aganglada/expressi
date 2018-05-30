'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _nodeEmoji = require('node-emoji');

var _nodeEmoji2 = _interopRequireDefault(_nodeEmoji);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var indexFile = '/index';

var exist = function exist(location) {
  try {
    var stat = _fs2.default.statSync(location);
    return stat.isFile() || stat.isDirectory();
  } catch (err) {
    return false;
  }
};

var walkSync = function walkSync(dir) {
  var filelist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  _fs2.default.readdirSync(dir).forEach(function (file) {

    filelist = _fs2.default.statSync(_path2.default.join(dir, file)).isDirectory() ? walkSync(_path2.default.join(dir, file), filelist) : filelist.concat(_path2.default.join(dir, file));
  });

  return filelist;
};

var getRoutes = function getRoutes(location) {
  return new Promise(function (resolve) {
    resolve({
      location: location,
      files: walkSync(location, [])
    });
  });
};

var parseRoutes = function parseRoutes(_ref) {
  var location = _ref.location,
      files = _ref.files;

  return files.map(function (file) {
    var route = file.replace(new RegExp('^' + location + '(.*)?.js$', 'g'), '$1');
    var isIndex = route.indexOf(indexFile);

    if (isIndex > -1) {
      route = route.replace(indexFile, isIndex === 0 ? '/' : '').replace('.', ':');
    } else {
      route = route.replace('.', '/:');
    }

    console.log(_nodeEmoji2.default.get('white_check_mark') + '  ' + _chalk2.default.blue(route));

    return {
      file: file,
      route: route
    };
  });
};

var attachRouteToExpress = function attachRouteToExpress(app, routes) {
  routes.forEach(function (_ref2) {
    var route = _ref2.route,
        file = _ref2.file;

    app.get(route, require(file).default);
  });
};

exports.default = function (app, location, callback) {
  if (!exist(location)) {
    throw new Error('Cannot find routes folder specified (' + location + ')');
  }

  console.log(_chalk2.default.white.bgGreen('\n  ROUTES  \n'));

  getRoutes(location).then(parseRoutes).then(function (routes) {
    return attachRouteToExpress(app, routes);
  }).then(function () {
    console.log(_chalk2.default.bgBlue.white('\n  Expressi running ' + _nodeEmoji2.default.get('rocket') + '  \n'));
    callback(app);
  });
};