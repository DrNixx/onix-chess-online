const gulp = require('gulp');
const { series, parallel, watch } = require('gulp');
const plugins = require('gulp-load-plugins')({
    rename: {
        'gulp-if': 'gif',
        'gulp-dart-sass': 'sass',
        'nunjucks-api': 'nunjucksApi'
    }
});

const { PRODUCTION } = require('./config');
const PATHS_OPTIONS = require('./paths');

function getTask(module, task, paths, taskName = undefined) {
    let taskMoodule = '.';
    if (module) {
        taskMoodule += '/' + module
    }

    taskMoodule +=  '/gulp-tasks/' + task;

    const taskFn = require(taskMoodule)(gulp, plugins, paths, PRODUCTION);
    if (taskName) {
        taskFn.displayName = taskName;
    }
    
    return taskFn;
}

const welcomeClean = getTask('', 'clean', PATHS_OPTIONS.welcome);
const welcomeStyles = getTask('', 'styles', PATHS_OPTIONS.welcome);
const welcomeScripts = getTask('', 'scripts', PATHS_OPTIONS.welcome);
let welcome = series(welcomeClean, parallel(welcomeStyles, welcomeScripts));
gulp.task("welcome", welcome, function () {
    console.log('Building welcome...');
});

const siteClean = getTask('', 'clean', PATHS_OPTIONS.site);
const siteBoard = getTask('', 'board', PATHS_OPTIONS.site);
const siteVendors = getTask('', 'vendors', PATHS_OPTIONS.site);
const siteHtml = getTask('', 'html', PATHS_OPTIONS.site);
const siteFonts = getTask('', 'copy', PATHS_OPTIONS.site.fonts, 'fonts');
const siteImg = getTask('', 'copy', PATHS_OPTIONS.site.img, 'img');
const siteStyles = getTask('', 'styles', PATHS_OPTIONS.site);
const siteWebpack = getTask('', 'webpack', PATHS_OPTIONS.site);
const siteServer = getTask('', 'server', PATHS_OPTIONS.site);
const siteWatch = getTask('', 'watch', PATHS_OPTIONS.site);
const siteDeploy = getTask('', 'deploy', PATHS_OPTIONS.site);

let site = series(siteClean, parallel(siteBoard, siteFonts, siteImg, siteVendors, siteHtml, siteStyles, siteWebpack), siteDeploy);
gulp.task("site", site, function () {
    console.log('Building site...');
});

let siteStyle = series(parallel(siteFonts, siteImg, siteStyles));
gulp.task("site:style", siteStyle, function () {
    console.log('Building site...');
});

let siteDeployTask = series(siteDeploy);
gulp.task("site:deploy", siteDeployTask, function () {
    console.log('Building site...');
});



gulp.task('site:server', parallel('site', siteWatch, siteServer));

gulp.task('sass:watch', function () {
    gulp.watch('./chess/**/*.scss', parallel(['chessSass']));
    gulp.watch('./pages/**/*.scss', parallel(['pagesSass']));
});