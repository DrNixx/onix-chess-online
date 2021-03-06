﻿const gulp = require('gulp');
const { series, parallel, watch } = require('gulp');
const plugins = require('gulp-load-plugins')({
    rename: {
        'gulp-if': 'gif',
        'nunjucks-api': 'nunjucksApi'
    }
});

const { PRODUCTION } = require('./config');
const PATHS_OPTIONS = require('./paths');

function getTask(module, task, paths) {
    let taskMoodule = '.';
    if (module) {
        taskMoodule += '/' + module
    }

    taskMoodule +=  '/gulp-tasks/' + task;

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
const siteBoard = getTask('', 'board', PATHS_OPTIONS.site);
const siteVendors = getTask('', 'vendors', PATHS_OPTIONS.site);
const siteHtml = getTask('', 'html', PATHS_OPTIONS.site);
const siteStyles = getTask('', 'styles', PATHS_OPTIONS.site);
const siteWebpack = getTask('', 'webpack', PATHS_OPTIONS.site);
const siteServer = getTask('', 'server', PATHS_OPTIONS.site);
const siteWatch = getTask('', 'watch', PATHS_OPTIONS.site);

let site = series(siteClean, parallel(siteBoard, siteVendors, siteHtml, siteStyles, siteWebpack));
gulp.task("site", site, function () {
    console.log('Building site...');
});

gulp.task('site:server', parallel('site', siteWatch, siteServer));

gulp.task('sass:watch', function () {
    gulp.watch('./chess/**/*.scss', parallel(['chessSass']));
    gulp.watch('./pages/**/*.scss', parallel(['pagesSass']));
});