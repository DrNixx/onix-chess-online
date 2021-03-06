module.exports = function (gulp, plugins, PATHS, PRODUCTION) {
	let task;
	if (PRODUCTION) {
		task = function () {
			return gulp.src('.', {allowEmpty: true});
		};
	} else {
		task = function(cb) {
			const html = require('./html');
			const styles = require('./styles');
			const webpack = require('./webpack');

			gulp.watch(PATHS.watch.nunj, html(gulp, plugins, PATHS, PRODUCTION));
			gulp.watch(PATHS.watch.styles, styles(gulp, plugins, PATHS, PRODUCTION));
			gulp.watch(PATHS.watch.scripts, webpack(gulp, plugins, PATHS, PRODUCTION));

			return cb();
		};
	}


	task.displayName = 'watch';

    return task;
};
