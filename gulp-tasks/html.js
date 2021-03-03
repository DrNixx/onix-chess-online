const path = require('path');
const log = require('fancy-log');
const pipe = require('multipipe');

module.exports = function (gulp, plugins, PATHS, PRODUCTION) {
    const task = function () {
		if (PRODUCTION) {
			return gulp.src('.', {allowEmpty: true});
		} else {
			const globalData = {};
			const extensions = require(path.resolve(PATHS.src.templates, 'lib/extensions.js'));
			const filters = require(path.resolve(PATHS.src.templates, 'lib/filters.js'));
			const functions = require(path.resolve(PATHS.src.templates, 'lib/functions.js'));

			return gulp
				.src(PATHS.src.nunj)
				.pipe(
					plugins.plumber({
						errorHandler: function(err) {
							log(err.message);
						},
					})
				)
				.pipe(
					plugins.nunjucksApi({
						src: PATHS.src.templates,
						data: Object.assign(
							{
								DEVELOP: !PRODUCTION,
							},
							globalData
						),
						extensions,
						filters,
						functions,
						trimBlocks: true,
						lstripBlocks: true,
						autoescape: false,
					})
				)
				.pipe(gulp.dest(PATHS.build.html));
		}
	};

	task.displayName = 'html';

    return task;
};
