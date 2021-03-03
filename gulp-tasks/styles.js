const assets = require('postcss-assets');
const autoprefixer = require('autoprefixer');
const fonts = require('postcss-font-magician');
const cssnano = require('cssnano');
const inlineSVG = require('postcss-inline-svg');
const pipe = require('multipipe');

module.exports = function (gulp, plugins, PATHS, PRODUCTION) {
    const task = function () {
        // const pre = [assets({basePath: 'https://static.chess-online.com/', loadPaths: ['pages/img/', 'pages/fonts/', 'pages/ico/']})];
        // const pre = [];
        // const post = [inlineSVG, autoprefixer, fonts];
        const post = [inlineSVG, autoprefixer, fonts];
        const compress = [cssnano()];

        return gulp.src(PATHS.src.styles, {base: PATHS.src.stylesBase})
            // .pipe(postcss(pre, {syntax: plugins.syntax}))
            // .pipe(sassVars(boardFiles, { verbose: false }))
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.sass({
                includePaths: ['node_modules/breakpoint-sass/stylesheets/breakpoint'],
            }).on("error", plugins.sass.logError))
            .pipe(plugins.postcss(post))
            .pipe(plugins.sourcemaps.write('.'))
            .pipe(gulp.dest(PATHS.build.styles))
            .pipe(
                plugins.gif(
                    PRODUCTION,
                    pipe(
                        plugins.filter('**/*.css'),
                        plugins.postcss(compress),
                        plugins.rename({ suffix: ".min" }),
                        gulp.dest(PATHS.build.styles)
                    )
                )
            )
            //.pipe(plugins.gif(PRODUCTION, plugins.postcss(compress)))
            //.pipe(plugins.gif(PRODUCTION, gulp.dest(PATHS.build.css)))
            ;
    }

    task.displayName = 'styles';

    return task;
};
