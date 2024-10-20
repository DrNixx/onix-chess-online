const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const _ = require("lodash");
module.exports = function (gulp, plugins, PATHS, PRODUCTION) {
    const task = function () {
        const path = require('path');
        const pipe = require('multipipe');
        const gulpWebpack = require('webpack-stream');
        const webpack = require('webpack');
        const { merge } = require('webpack-merge');
        const _ = require('lodash');
        const HtmlWebpackPlugin = require('html-webpack-plugin');

        const suffix = PRODUCTION ? 'prod' : 'dev'

        const common = require(path.resolve(__dirname, '../webpack.common.js'));
        const phpPath = PRODUCTION ? '../../../bundles/' : '../../../../bundles/';
            Object.keys(PATHS.webpack.entry).forEach((key) => {
            if (key === "onix") {
                common.plugins.push(
                    new HtmlWebpackPlugin({
                        filename: phpPath +  suffix + '/ChessPortalAsset.inc',
                        chunks: [key],
                        inject: false,
                        minify: false,
                        template: './templates/php/include.ejs'
                    })
                );
            } else {
                const keyName = _.capitalize(key);
                common.plugins.push(
                    new HtmlWebpackPlugin({
                        filename: phpPath + suffix + '/' + _.capitalize(key) + 'Asset.inc',
                        chunks: [key],
                        inject: false,
                        minify: false,
                        template: './templates/php/include.ejs',
                        templateParameters: {
                            'keyName': keyName
                        }
                    })
                );
            }
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
