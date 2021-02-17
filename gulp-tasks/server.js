const log = require('fancy-log');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpack = require('webpack');

const PATHS = require('../paths');
const webpackConfig = require('../webpack.config');

const browserSync = require('browser-sync').create();
const bundler = webpack(webpackConfig);

let watchFiles = [
	PATHS.build.html + '*.html',
	PATHS.build.styles + '*.css'
];


watchFiles.push(PATHS.build.scripts + '*.js');
watchFiles.push(PATHS.watch.scripts);

module.exports = function() {
	browserSync.init({
		server: {
			baseDir: './public',
			middleware: [],
		},
		injectchanges: true,
		notify: false,
		open: false,
		port: 9000,
		logPrefix: 'SP.Starter',
		files: watchFiles,
	});
}

module.exports.displayName = 'server';