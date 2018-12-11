<?php

/**
 *		HELPER function
 */

/**
 *		me() helper for authenticated user or current user
 */
function me() {
    return \Auth::user();
}


// settings

function settings($key = null, $default = null) {
    if ($key === null) {
        return app(App\Settings::class);
    }

    return app(App\Settings::class)->get($key, $default);
}