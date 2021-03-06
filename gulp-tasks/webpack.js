module.exports = function (gulp, plugins, PATHS, PRODUCTION) {
    const task = function () {
        const path = require('path');
        const pipe = require('multipipe');
        const gulpWebpack = require('webpack-stream');
        const webpack = require('webpack');
        const { merge } = require('webpack-merge');
        var _ = require('lodash');
        const HtmlWebpackPlugin = require('html-webpack-plugin');


        const common = require(path.resolve(__dirname, '../webpack.common.js'));
        Object.keys(PATHS.webpack.entry).forEach((key) => {
            common.plugins.push(
                new HtmlWebpackPlugin({
                    filename: '../../php/' + _.capitalize(key) + 'Asset.php',
                    chunks: [key],
                    inject: false,
                    minify: false,
                    template: './src/templates/php/index.ejs'
                })
            );
        });
        
        const config = merge(common, PATHS.webpack);

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
