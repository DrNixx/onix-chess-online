const path = require('path');
const pipe = require('multipipe');

module.exports = function (gulp, plugins, PATHS, PRODUCTION) {
    const gulpWebpack = require('webpack-stream');
    const webpack = require('webpack');
    const { merge } = require('webpack-merge');

    const common = require(path.resolve(__dirname, '../webpack.common.js'));

    const config = merge(common, PATHS.webpack);
    
    const task = function () {
		return gulp.src(PATHS.src.scripts)
  			.pipe(gulpWebpack(config, webpack))
  			.pipe(gulp.dest(PATHS.build.scripts))
        .pipe(
          plugins.gif(
              PRODUCTION,
              pipe(
                  plugins.rename({ suffix: ".min" }),
                  gulp.dest(PATHS.build.scripts)
              )
          )
        );
    };

    task.displayName = 'webpack';

    return task;
};
