const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

const { PRODUCTION } = require('./config');

module.exports = {
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: { configFile: 'tsconfig.webpack.json' },
                exclude: /node_modules/
            },
            {
				type: 'javascript/auto',
				test: /\.json$/,
				loader: 'json-loader',
			},
        ] 
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        modules: ['node_modules'],
    },

    plugins:[],
	devtool: PRODUCTION ? false : 'eval-source-map',
	mode: PRODUCTION ? 'production' : 'development',
	optimization: {
        runtimeChunk: 'single',
        //chunkIds: PRODUCTION ? 'deterministic' : 'named',
        chunkIds: 'deterministic',
        splitChunks: {
            chunks: 'all',
            //cacheGroups: {
            //    defaultVendors: {
            //        test: /[\\/]node_modules[\\/]/,
            //        name: "vendors",
            //        priority: -20,
            //        chunks: "all"
            //    }
            //}
        },
		minimize: PRODUCTION,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
	}
};