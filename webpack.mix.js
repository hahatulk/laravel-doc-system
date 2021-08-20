const mix = require('laravel-mix');
const path = require("path");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.ts('resources/js/index.tsx', 'public/js/app.js')
    .react()
    .sass('resources/sass/app.scss', 'public/css');

// mix.options({
//     hmrOptions: {
//         host: '127.0.0.1',  // site's host name
//         port: 80,
//     }
// });
//
// // fix css files 404 issue
// mix.webpackConfig({
//     // add any webpack dev server config here
//     resolve: {
//         modules: [
//             "node_modules",
//             path.join(__dirname, './resources/js')
//         ]
//     },
//
// });

if (mix.inProduction()) {
    mix.version();
}
