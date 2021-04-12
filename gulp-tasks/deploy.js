module.exports = function (gulp, plugins, PATHS, PRODUCTION) {
    const task = function () {
        const del = require('del');

        del.sync(PATHS.build.deploy, {force: true});

        return gulp
            .src(PATHS.build.assets + "/**/*.*")
            .pipe(gulp.dest(PATHS.build.deploy));
    }

    task.displayName = 'deploy';

    return task;
};
