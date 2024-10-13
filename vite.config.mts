import { resolve } from 'path';
import { defineConfig, type PluginOption, type UserConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import packageJson from './package.json';

export default defineConfig(({ mode, command }) => {
    const isProd = mode === 'production';
    const outDir = mode === 'production' ? 'prod' : 'dev';

    const config: UserConfig = {
        plugins: [react(), visualizer() as PluginOption],
        define: {
            VITE_APP_VERSION: JSON.stringify(packageJson.version),
            'process.env.NODE_ENV': JSON.stringify(mode),
        },
        build: {
            outDir: './build/' + outDir + '/mjs',
            lib: {
                entry: [
                    resolve(__dirname, 'src/onix.ts'),
                    resolve(__dirname, 'src/dashboard.ts'),
                    resolve(__dirname, 'src/analyse.ts'),
                    resolve(__dirname, 'src/play.ts'),
                    resolve(__dirname, 'src/watch.ts'),
                    resolve(__dirname, 'src/pgn.ts'),
                    resolve(__dirname, 'src/configure.ts'),
                ],
                name: 'onix',
                // fileName: 'onix.chess',
                fileName: (format, entryName) => {
                    return `chess-online.${entryName}.mjs`;
                },
                formats: ['es'],
            },
            manifest: true,
            rollupOptions: {
                onwarn(warning, defaultHandler) {
                    if (warning.code === 'SOURCEMAP_ERROR') {
                        return
                    }

                    defaultHandler(warning)
                },
                output: {

                },
            },
        },
        server: {
            port: 8080,
        },
    };

    if (isProd) {
        config.define = {
            'process.env.NODE_ENV': '"production"',
        };
    } else {
        if (!config.build) {
            config.build = {};
        }

        config.build.minify = false;
        config.build.sourcemap = true;
    }

    if (command == 'serve') {
        if (!config.plugins) {
            config.plugins = [];
        }

        config.plugins.push(legacy());
    }

    return config;
});
