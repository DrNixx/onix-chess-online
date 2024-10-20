const gulp = require('gulp');
const plugins = require('gulp-load-plugins')({
    rename: {
        'gulp-if': 'gif',
        'gulp-dart-sass': 'sass',
        'nunjucks-api': 'nunjucksApi'
    }
});

const { PRODUCTION } = require('./config');
const PATHS_OPTIONS = require('./paths');

function getTask(task, paths, taskName = undefined)
{
    const taskMoodule =  './gulp-tasks/' + task;
    const taskFn = require(taskMoodule)(gulp, plugins, paths, PRODUCTION);
    if (taskName) {
        taskFn.displayName = taskName;
    }

    return taskFn;
}

const welcomePath = PATHS_OPTIONS.welcome;
const welcomeClean = getTask('clean', welcomePath);
const welcomeStyles = getTask('styles', welcomePath);
const welcomeScripts = getTask('scripts', welcomePath);
let welcome = gulp.series(welcomeClean, gulp.parallel(welcomeStyles, welcomeScripts));
gulp.task("welcome", welcome, function () {
    console.log('Building welcome...');
});

const sitePath = PATHS_OPTIONS.site;
const siteClean = getTask('clean', sitePath);
const siteBoard = getTask('board', sitePath);
const siteFonts = getTask('copy', sitePath.fonts, 'fonts');
const siteImg = getTask('copy', sitePath.img, 'img');
const siteLocales = getTask('copy', sitePath.locales, 'locales');
const siteStyles = getTask('styles', sitePath);
const siteWebpack = getTask('webpack', sitePath);

let siteStyle = gulp.series(gulp.parallel(siteFonts, siteImg, siteStyles));
gulp.task("site:style", siteStyle, function () {
    console.log('Building site style...');
});

let siteScript = gulp.series(gulp.parallel(siteWebpack));
gulp.task("site:script", siteScript, function () {
    console.log('Building site scripts...');
});

let site = gulp.series(siteClean, gulp.parallel(siteBoard, siteFonts, siteImg, siteLocales, siteStyles, siteWebpack));
gulp.task("site", site, function () {
    console.log('Building site...');
});

gulp.task('sass:watch', function () {
    gulp.watch('./styles/**/*.scss', gulp.parallel(['siteStyles']));
    gulp.watch('./welcome/**/*.scss', gulp.parallel(['welcomeStyles']));
});