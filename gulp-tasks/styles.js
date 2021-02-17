const gulp = require('gulp');
const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const syntax = require('postcss-scss');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const assets = require('postcss-assets');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');

const { PRODUCTION } = require('../config');
const PATHS = require('../paths');

module.exports = function() {
    var pre = [assets({basePath: 'public/', loadPaths: ['static/img/', 'static/fonts/']})];
    var post = [autoprefixer];
    var compress = [cssnano];

    return gulp.src(PATHS.src.styles)
        .pipe(postcss(pre, {syntax: syntax}))
        .pipe(sass().on("error", sass.logError))
        .pipe(postcss(post))
        .pipe(gulp.dest(PATHS.build.styles))
        .pipe(
            gulpif(
				PRODUCTION,
				rename({ suffix: ".min" })
			)
        )
        .pipe(
            gulpif(
				PRODUCTION,
                cleanCSS()
                //postcss(compress)
			)
        )
        .pipe(
            gulpif(
				PRODUCTION,
				gulp.dest(PATHS.build.styles)
			)
        ); 
}

module.exports.displayName = 'styles';