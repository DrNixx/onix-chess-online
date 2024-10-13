const path = require('path');
const webpack = require('webpack');
const importMetaEnv = require("@import-meta-env/unplugin");
const TerserPlugin = require('terser-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const { PRODUCTION } = require('./config');

module.exports = {
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig.webpack.json',
                    transpileOnly: true
                },
                exclude: /node_modules/
            },
            {
				type: 'javascript/auto',
				test: /\.json$/,
				loader: 'json-loader',
			},
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false
                }
            },
        ] 
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        modules: ['node_modules'],
    },

    plugins:[
        new ForkTsCheckerWebpackPlugin(),
        importMetaEnv.webpack({
            env: '.env',
            example: '.env',
            transformMode: 'compile-time',
        }),
    ],
	devtool: PRODUCTION ? false : 'eval-source-map',
	mode: PRODUCTION ? 'production' : 'development',
    optimization: {
        runtimeChunk: 'single',
        chunkIds: 'deterministic',
        splitChunks: {
            chunks: 'all',
            maxSize: 244000,
        },
        minimize: PRODUCTION,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    ecma: 6,
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            })
        ]
    }
};