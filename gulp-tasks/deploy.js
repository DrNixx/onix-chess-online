module.exports = function (gulp, plugins, PATHS, PRODUCTION) {
    const task = function () {
        const del = require('del');

        del.sync(PATHS.build.deploy, {force: true});

        gulp
            .src(PATHS.build.assets + "/**/*.*")
            .pipe(gulp.dest(PATHS.build.deploy));

        return gulp
            .src(PATHS.build.php + "/**/*.*")
            .pipe(gulp.dest(PATHS.build.deploy_php));
    }

    task.displayName = 'deploy';

    return task;
};
