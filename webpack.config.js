const path = require('path');
const webpack = require('webpack');

const { PRODUCTION } = require('./config');
const PATHS = require('./paths');

const entryPoints = 
    PRODUCTION ? 
    {
        //app: path.resolve(__dirname, PATHS.src.scripts),
    } : 
    { 
        tests: path.resolve(__dirname, PATHS.src.tests),
    };

module.exports = {
    entry: {
        tests: path.resolve(__dirname, PATHS.src.tests),
    },
    
	output: {
        libraryTarget: "umd",
        library: "onix",
		path: path.resolve(__dirname, PATHS.build.scripts),
		publicPath: '/assets/js',
        crossOriginLoading: "anonymous",
        chunkFilename: "chess-online.[name].js",
        filename: 'chess-online.[name].js',
    },
    
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
        runtimeChunk: {
            name: "manifest"
        },
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    priority: -20,
                    chunks: "all"
                }
            }
        },
		minimize: PRODUCTION,
	}
};