module.exports = function (gulp, plugins, PATHS, PRODUCTION) {
    const task = function () {
        return gulp
            .src(['./node_modules/onix-board-assets/dist/assets/**/*.*'])
            .pipe(gulp.dest(PATHS.build.board));
    };

    task.displayName = 'board';

    return task;
};