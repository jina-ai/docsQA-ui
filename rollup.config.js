import nodeResolve from '@rollup/plugin-node-resolve';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import polyfillsLoader from '@web/rollup-plugin-polyfills-loader';
import html from '@web/rollup-plugin-html';
import { copy } from '@web/rollup-plugin-copy';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import summary from 'rollup-plugin-summary';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import { terser } from 'rollup-plugin-terser';
// import { generateSW } from 'rollup-plugin-workbox';
// import path from 'path';

// Configure an instance of @web/rollup-plugin-html
const htmlPlugin = html({
  // injectServiceWorker: true,
  // serviceWorkerPath: 'dist/sw.js',
  rootDir: './',
  flattenOutput: false,
});

export default {
  input: 'index.html',
  output: {
    entryFileNames: '[hash].js',
    chunkFileNames: '[hash].js',
    assetFileNames: '[hash][extname]',
    format: 'es',
    dir: 'dist',
  },
  preserveEntrySignatures: false,

  plugins: [
    /** Enable using HTML as rollup entrypoint */
    htmlPlugin,
    /** Resolve bare module imports */
    nodeResolve(),
    minifyHTML(),
    /** Minify JS */
    terser({
      module: true,
      warnings: true,
    }),
    /** Bundle assets references via import.meta.url */
    importMetaAssets(),
    // Inject polyfills into HTML (core-js, regnerator-runtime, webcoponents,
    // lit/polyfill-support) and dynamically loads modern vs. legacy builds
    polyfillsLoader({
      modernOutput: {
        name: 'modern',
      },
      // Feature detection for loading legacy bundles
      legacyOutput: {
        name: 'legacy',
        test: '!!Array.prototype.flat',
        type: 'systemjs',
      },
      // List of polyfills to inject (each has individual feature detection)
      polyfills: {
        hash: true,
        coreJs: true,
        regeneratorRuntime: true,
        fetch: true,
        webcomponents: true,
        // Custom configuration for loading Lit's polyfill-support module,
        // required for interfacing with the webcomponents polyfills
        custom: [
          {
            name: 'lit-polyfill-support',
            path: 'node_modules/lit/polyfill-support.js',
            test: "!('attachShadow' in Element.prototype)",
            module: false,
          },
        ],
      },
    }),

    /** Create and inject a service worker */
    // generateSW({
    //   globIgnores: ['polyfills/*.js', 'nomodule-*.js'],
    //   navigateFallback: '/index.html',
    //   // where to output the generated sw
    //   swDest: path.join('dist', 'sw.js'),
    //   // directory to match patterns against to be precached
    //   globDirectory: path.join('dist'),
    //   // cache any html js and css by default
    //   globPatterns: ['**/*.{html,js,css,webmanifest}'],
    //   skipWaiting: true,
    //   clientsClaim: true,
    //   runtimeCaching: [{ urlPattern: 'polyfills/*.js', handler: 'CacheFirst' }],
    // }),

    // Print bundle summary
    // Optional: copy any static assets to build directory
    copy({
      patterns: ['data/**/*', 'assets/**/*', 'static/**/*', 'public/**/*'],
      rootDir: './',
    }),
    summary(),
  ],
  // Specifies two JS output configurations, modern and legacy, which the HTML plugin will
  // automatically choose between; the legacy build is compiled to ES5
  // and SystemJS modules
  output: [
    {
      // Modern JS bundles (no JS compilation, ES module output)
      format: 'esm',
      chunkFileNames: '[name]-[hash].js',
      entryFileNames: '[name]-[hash].js',
      dir: 'dist',
      plugins: [
        htmlPlugin.api.addOutput('modern')
      ],
    },
    {
      // Legacy JS bundles (ES5 compilation and SystemJS module output)
      format: 'esm',
      chunkFileNames: 'legacy-[name]-[hash].js',
      entryFileNames: 'legacy-[name]-[hash].js',
      dir: 'dist',
      plugins: [
        htmlPlugin.api.addOutput('legacy'),
        // Uses babel to compile JS to ES5 and modules to SystemJS
        getBabelOutputPlugin({
          compact: true,
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  ie: '11',
                },
                modules: 'systemjs',
              },
            ],
          ],
        }),
      ],
    },
  ],
  preserveEntrySignatures: false,
};
