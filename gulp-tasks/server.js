module.exports = function (gulp, plugins, PATHS, PRODUCTION) {
	let task;
	if (PRODUCTION) {
		const task = function () {
			return gulp.src('.', {allowEmpty: true});
		}
	} else {
		const browserSync = require('browser-sync').create();
		let watchFiles = [
			PATHS.build.html + '*.html',
			PATHS.build.styles + '*.css'
		];
		
		
		watchFiles.push(PATHS.build.scripts + '*.js');
		watchFiles.push(PATHS.watch.scripts);

		task = function () {
			browserSync.init({
				server: {
					baseDir: PATHS.build.html,
					middleware: [],
				},
				injectchanges: true,
				notify: false,
				open: false,
				port: 9000,
				logPrefix: 'SP.Starter',
				files: watchFiles,
			});
		};
	}

	task.displayName = 'server';

    return task;
};
