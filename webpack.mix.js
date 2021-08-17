const mix = require('laravel-mix');
const path = require('path');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.ts('resources/js/index.tsx', 'public/js/app.js')
    .sass('resources/css/app.scss', 'public/css', [
        //
    ]).options({
    // processCssUrls: false
});


mix.options({
    hmrOptions: {
        host: '127.0.0.1',  // site's host name
        port: 8080,
    }
});

// // fix css files 404 issue
mix.webpackConfig({
    // add any webpack dev server config here
    resolve: {
        modules: [
            "node_modules",
            path.join(__dirname, './resources/js')
        ]
    },
    devServer: {
        proxy: {
            host: '127.0.0.1',  // host machine ip
            port: 8080,
        },
        watchOptions: {
            aggregateTimeout: 200,
            poll: 5000
        },

    }
});

mix.override((config) => {
    delete config.watchOptions;
});

mix.disableSuccessNotifications();
