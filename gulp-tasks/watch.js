const gulpWatch = require('gulp-watch');
const PATHS = require('../paths');
const html = require('./html');
const styles = require('./styles');
const scripts = require('./scripts');

module.exports = function watch() {
	gulpWatch([PATHS.watch.nunj], html);
	gulpWatch([PATHS.watch.styles], styles);
}

module.exports.displayName = 'watch';