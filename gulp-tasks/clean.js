module.exports = function (gulp, plugins, PATHS, PRODUCTION) {
    const del = require('del');

    const task = function (cb) {
        del.sync(PATHS.clean, {force: true});
        return cb();
    };

    task.displayName = 'clean';

    return task;
};
