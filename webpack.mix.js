const mix = require('laravel-mix');

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

mix.extract([
   			'jquery',
		    'popper.js',
		    'bootstrap',
		]);

// Copy favicons
mix.copyDirectory('resources/assets/images/favicon', 'public/images/favicon');

mix.react('resources/js/app.js', 'public/js')
   .sass('resources/sass/app.scss', 'public/css')
   // .sass('resources/assets/sass/admin.scss', 'public/css')
   .styles([
    		// 'resources/assets/css/semantic-ui.css',
        'resources/css/animate.css'
        ],'public/css/vendor.css');
