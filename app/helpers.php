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