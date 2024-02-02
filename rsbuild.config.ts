import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import {pluginSvgr} from "@rsbuild/plugin-svgr";

export default defineConfig({
    html: {
        template: './public/index.html',
    },
    dev: {
        writeToDisk: true
    },
    source: {
        entry: {
            index: './src/index.ts',
            background: './src/background/index.ts',
        },
    },
    output: {
        filename: {
            js: '[name].js',
        },
        distPath: {
            root: 'build',
        },
    },
    performance: {
        chunkSplit: {
            strategy: 'all-in-one'
        },
    },
    plugins: [pluginSvgr(), pluginReact()],
});