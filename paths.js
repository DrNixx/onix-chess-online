/* eslint-disable */
const path = require("path");

const { PRODUCTION } = require("./config");

const suffix = PRODUCTION ? "-prod" : "-dev";
const suffix2 = PRODUCTION ? "prod" : "dev";
const base = PRODUCTION ? path.resolve(__dirname, "build") : path.resolve(__dirname, "public");
const assets = (PRODUCTION ? "" : "/assets");
const php = PRODUCTION ? '/php' : '/site/php';

module.exports = {
    site: {
        src: {
            scriptsPath: "./src/",
            scripts: "./src/index.ts",
            styles: ["./styles/*.scss", "!./styles/_*.scss"],
            tests: "./test/index.ts",
            templates: "./templates/",
        },

        build: {
            base: base,
            php: base +  php,
            assets: base + "/site" + assets,
            scripts: base + "/site" + assets + "/js",
            styles: base + "/site" + assets + "/css",
            board: base + "/site" + assets + "/bs",
        },

        locales: {
            src: "./locales/**/*.json",
            dest: base + "/locales",
        },

        fonts: {
            src: "./media/fonts/**/*.*",
            dest: base + "/site" + assets + "/fonts"
        },

        img: {
            src: "./media/img/**/*.*",
            dest: base + "/site" + assets + "/img"
        },

        clean: [
            base +  php,
            base + "/site" + assets,
            base + "/site/locales"
        ],

        webpack: {
            entry: {
                onix: path.resolve(__dirname, "./src/onix.ts"),

                dashboard: {
                    import: path.resolve(__dirname, "./src/dashboard.ts"),
                    dependOn: "onix",
                },

                watch:  {
                    import: path.resolve(__dirname, "./src/watch.ts"),
                    dependOn: "onix",
                },

                play:  {
                    import: path.resolve(__dirname, "./src/play.ts"),
                    dependOn: "onix",
                },

                analyse: {
                    import: path.resolve(__dirname, "./src/analyse.ts"),
                    dependOn: "onix",
                },

                configure: {
                    import: path.resolve(__dirname, "./src/configure.ts"),
                    dependOn: "onix",
                },

                setup: {
                    import: path.resolve(__dirname, "./src/setup.ts"),
                    dependOn: "onix",
                },

                pgn: {
                    import: path.resolve(__dirname, "./src/pgn.ts"),
                    dependOn: "onix",
                }
            },

            output: {
                library: {
                    name: "[name]",
                    type: "umd"
                },
                path: base + "/site" + assets + "/site/js",
                crossOriginLoading: "anonymous",
                chunkFilename: "chess-online.[id].js",
                filename: "chess-online.[name].js",
            },

            externals: {
                bootstrap: true,
            },
        }
    },
    welcome: {
        src: {
            stylesBase: "./welcome/css",
            styles: ["./welcome/css/**/*.scss", "!./src/modules/welcome/css/_*.scss"],
            scriptsBase: "./welcome/js",
            scripts: ["./welcome/js/**/*.js"]
        },

        build: {
            html: base + "/welcome",
            assets: base + "/welcome" + assets,
            scripts: base + "/welcome" + assets + "/js",
            styles: base + "/welcome" + assets + "/css",
        },

        clean: base + "/welcome"
    }
};
