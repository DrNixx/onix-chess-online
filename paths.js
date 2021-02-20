const { PRODUCTION } = require('./config');
const base = PRODUCTION ? '../build/chess-online' : 'public';
const assets = base + (PRODUCTION ? '' : '/assets');

module.exports = {
    build: {
        html: base + '/',
        assets: assets + '/',
        scripts: assets + '/js/',
        styles: assets + '/css/',
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
        scripts: 'src/js/**/*.ts',
        styles: 'src/css/**/*.scss',
    },
    clean: base + '/*',
    deploy: '../web/boards/',
};
