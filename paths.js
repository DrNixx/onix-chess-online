const path = require("path");

const { PRODUCTION } = require("./config");

const suffix = PRODUCTION ? "-prod" : "-dev";
const suffix2 = PRODUCTION ? "prod" : "dev";
const base = PRODUCTION ? path.resolve(__dirname, "build") : path.resolve(__dirname, "public");
const assets = (PRODUCTION ? "" : "/assets");
const php = PRODUCTION ? '/php' : '/site/php';

module.exports = {
    site: {
        build: {
            base: base,
            php: base +  php,
            html: base + "/site",
            assets: base + "/site" + assets,
            scripts: base + "/site" + assets + "/js",
            styles: base + "/site" + assets + "/css",
            board: base + "/site" + assets + "/bs",
            locales: base + "/site/locales",
            deploy: "D:\\Workspace\\OpenServer\\domains\\dev.chess-online.com\\ui\\build\\chess" + suffix,
            deploy_php: "D:\\Workspace\\OpenServer\\domains\\dev.chess-online.com\\ui\\assets\\" + suffix2,
        },

        src: {
            scriptsPath: "./src/js/",
            scripts: "./src/js/index.ts",
            styles: ["./src/css/*.scss", "!./src/css/_*.scss"],
            tests: "./src/test/index.ts",
            templates: "./src/templates/",
            nunj: "src/templates/*.nunj",
            locales: "src/locales/*.json",
        },

        watch: {
            nunj: "src/templates/tpl/*.html",
            scripts: ["src/js/**/*.ts", "src/js/**/*.tsx"],
            styles: "src/css/**/*.scss",
            locales: "src/locales/**/*.json",
        },

        clean: base + "/site",

        locales: {
            src: "./src/locales/**/*.json",
            dest: base + "/site/locales"
        },

        fonts: {
            src: "./src/fonts/**/*.*",
            dest: base + "/site" + assets + "/fonts"
        },

        img: {
            src: "./src/img/**/*.*",
            dest: base + "/site" + assets + "/img"
        },

        webpack: {
            entry: {
                onix: path.resolve(__dirname, "./src/js/index.ts"),
                
                dashboard: {
                    import: path.resolve(__dirname, "./src/js/dashboard.ts"),
                    dependOn: "onix",
                },
                
                watch:  {
                    import: path.resolve(__dirname, "./src/js/watch.ts"),
                    dependOn: "onix",
                },

                play:  {
                    import: path.resolve(__dirname, "./src/js/play.ts"),
                    dependOn: "onix",
                },
                
                analyse: {
                    import: path.resolve(__dirname, "./src/js/analyse.ts"),
                    dependOn: "onix",
                },

                configure: {
                    import: path.resolve(__dirname, "./src/js/configure.ts"),
                    dependOn: "onix",
                },

                setup: {
                    import: path.resolve(__dirname, "./src/js/setup.ts"),
                    dependOn: "onix",
                },

                pgn: {
                    import: path.resolve(__dirname, "./src/js/pgn.ts"),
                    dependOn: "onix",
                }
            },
            
            output: {
                libraryTarget: "umd",
                library: "[name]",
                path: base + "/site" + assets + "/site/js",
                publicPath: "/assets/js",
                crossOriginLoading: "anonymous",
                chunkFilename: "chess-online.[id].js",
                filename: "chess-online.[name].js",
            },
        }
    },
    welcome: {
        build: {
            html: base + "/welcome",
            assets: base + "/welcome" + assets,
            scripts: base + "/welcome" + assets + "/js",
            styles: base + "/welcome" + assets + "/css",
            deploy: "D:\\Workspace\\OpenServer\\domains\\dev.chess-online.com\\ui\\build\\welcome" + suffix,
        },

        src: {
            stylesBase: "./src/modules/welcome/css",
            styles: ["./src/modules/welcome/css/**/*.scss", "!./src/modules/welcome/css/_*.scss"],
            scriptsBase: "./src/modules/welcome/js",
            scripts: ["./src/modules/welcome/js/**/*.js"]
        },

        clean: assets + "/welcome"
    }
};
