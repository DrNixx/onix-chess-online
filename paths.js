const path = require('path');

const { PRODUCTION } = require('./config');

const suffix = PRODUCTION ? '' : '-dev'
const base = PRODUCTION ? path.resolve(__dirname, 'build') : path.resolve(__dirname, 'public');
const assets = (PRODUCTION ? '' : '/assets');

module.exports = {
    site: {
        build: {
            base: base,
            html: base + '/site',
            assets: base + '/site' + assets,
            scripts: base + '/site' + assets + '/js',
            styles: base + '/site' + assets + '/css',
            board: base + '/site' + assets + '/bs',
        },

        src: {
            scriptsPath: './src/js/',
            scripts: './src/js/index.ts',
            styles: ['./src/css/*.scss', '!./src/css/_*.scss'],
            tests: './src/test/index.ts',
            templates: './src/templates/',
            nunj: 'src/templates/*.nunj',
        },

        watch: {
            nunj: 'src/templates/**/*.nunj',
            scripts: ['src/js/**/*.ts', 'src/js/**/*.tsx'],
            styles: 'src/css/**/*.scss',
        },

        clean: base + '/site',

        webpack: {
            entry: {
                site: path.resolve(__dirname, './src/js/index.ts'),
            },
            
            output: {
                libraryTarget: "umd",
                library: "onix",
                path: base + '/site' + assets + '/site/js',
                publicPath: '/assets/js',
                crossOriginLoading: "anonymous",
                chunkFilename: "chess-online.[name].js",
                filename: 'chess-online.[name].js',
            },
        }
    },
    welcome: {
        build: {
            html: base + '/welcome',
            scripts: base + '/welcome' + assets + '/js',
            styles: base + '/welcome' + assets + '/css'
        },

        src: {
            stylesBase: "./src/modules/welcome/css",
            styles: ['./src/modules/welcome/css/**/*.scss', '!./src/modules/welcome/css/_*.scss'],
            scriptsBase: './src/modules/welcome/js',
            scripts: ['./src/modules/welcome/js/**/*.js']
        },

        clean: assets + '/welcome'
    }
};
