const pipe = require('multipipe');

module.exports = function (gulp, plugins, PATHS, PRODUCTION) {
    const task = function () {
        return gulp.src(PATHS.src.scripts, {base: PATHS.src.scriptsBase})
            .pipe(gulp.dest(PATHS.build.scripts))
            .pipe(
                plugins.gif(
                    PRODUCTION,
                    pipe(
                        plugins.minify({
                            ext:{
                                src:'.js',
                                min:'.min.js'
                            },
                            ignoreFiles: ['.min.js']
                        }),
                        gulp.dest(PATHS.build.scripts)
                    )
                )
            );
    }

    task.displayName = 'scripts';

    return task;
};
