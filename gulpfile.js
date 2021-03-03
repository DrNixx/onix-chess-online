const gulp = require('gulp');
const { series, parallel } = require('gulp');
const plugins = require('gulp-load-plugins')({
    rename: {
        'gulp-if': 'gif',
        'nunjucks-api': 'nunjucksApi'
    }
});

const { PRODUCTION } = require('./config');
const PATHS_OPTIONS = require('./paths');

function getTask(module, task, paths) {
    const taskMoodule = './' + module + '/gulp-tasks/' + task;
    return require(taskMoodule)(gulp, plugins, paths, PRODUCTION);
}

const welcomeClean = getTask('', 'clean', PATHS_OPTIONS.welcome);
const welcomeStyles = getTask('', 'styles', PATHS_OPTIONS.welcome);
const welcomeScripts = getTask('', 'scripts', PATHS_OPTIONS.welcome);
let welcome = series(welcomeClean, parallel(welcomeStyles, welcomeScripts));
gulp.task("welcome", welcome, function () {
    console.log('Building welcome...');
});

const siteClean = getTask('', 'clean', PATHS_OPTIONS.site);
const siteHtml = getTask('', 'html', PATHS_OPTIONS.site);
const siteStyles = getTask('', 'styles', PATHS_OPTIONS.site);
const siteScripts = getTask('', 'webpack', PATHS_OPTIONS.site);
let site = series(siteClean, parallel(siteHtml, siteStyles, siteScripts));
gulp.task("site", site, function () {
    console.log('Building site...');
});

gulp.task('sass:watch', function () {
    gulp.watch('./chess/**/*.scss', parallel(['chessSass']));
    gulp.watch('./pages/**/*.scss', parallel(['pagesSass']));
});