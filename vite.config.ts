import { resolve } from 'path';
import { defineConfig, splitVendorChunkPlugin, type PluginOption, type UserConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import packageJson from './package.json';

export default defineConfig(({ mode, command }) => {
    const isProd = mode === 'production';
    const outDir = mode === 'production' ? 'prod' : 'dev';

    const config: UserConfig = {
        plugins: [react(), splitVendorChunkPlugin(), visualizer() as PluginOption],
        define: {
            VITE_APP_VERSION: JSON.stringify(packageJson.version),
            'process.env.NODE_ENV': JSON.stringify(mode),
        },
        build: {
            outDir: './build/' + outDir + '/mjs',
            lib: {
                entry: resolve(__dirname, 'src/js/main.ts'),
                name: 'onix',
                fileName: 'onix.chess',
                formats: ['es'],
            },
            manifest: true,
            rollupOptions: {
                output: {},
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
        if (config.build) {
            config.build.minify = false;
            config.build.sourcemap = true;
        }

    }

    if (command == 'serve') {
        config.plugins && config.plugins.push(legacy());
    }

    return config;
});
