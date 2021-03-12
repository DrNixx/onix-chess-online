module.exports = function (gulp, plugins, PATHS, PRODUCTION) {
	let task;
	if (PRODUCTION) {
		task = function () {
			return gulp.src('.', {allowEmpty: true});
		}
	} else {
		task = function () {
			return gulp.src([
                './node_modules/bootstrap/dist/**/*.*'
                ])
                .pipe(gulp.dest(PATHS.build.assets));
		};
	}

	task.displayName = 'vendors';

    return task;
};
