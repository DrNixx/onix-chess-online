const pipe = require('multipipe');

module.exports = function (gulp, plugins, path, PRODUCTION) {
    const task = function () {
        return gulp.src(path.src).pipe(gulp.dest(path.dest));
    }

    task.displayName = 'copy';

    return task;
};
