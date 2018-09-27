<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['prefix' => 'password'], function() {
    Route::post('create', 'Auth\PasswordResetController@create');
    Route::post('reset', 'Auth\PasswordResetController@reset');
});

Route::group(['prefix'=> 'auth'], function() {
    Route::post('/register','Auth\RegisterController@register');
    Route::post('/login','Auth\LoginController@login');
    Route::post('/login/{social}/callback','Auth\LoginController@handleProviderCallback')->where('social','twitter|facebook|linkedin|google|graph');

    // Check if user is authenticated
    Route::get('/check','Auth\LoginController@checkIfUserIsAuthenticated')->middleware('auth:api');

    Route::delete('/logout', 'Auth\LoginController@logout')
    	->name('auth.logout')
    	->middleware('auth:api');

});

Route::group(['middleware'=> 'auth:api'], function() {
    Route::resource('users', 'API\UserController');
    Route::resource('roles', 'API\RoleController');
    Route::resource('permissions', 'API\PermissionController');
});

Route::post('/resend-email-verification','Auth\VerificationController@resend');


// Route::group(['prefix'=> 'users', 'middleware' => 'auth:api'], function() {
//     // Route::match(['put', 'patch'], '/{id}', 'Api\UserController@update')->name('users.update');
//     Route::post('/{id}', 'Api\UserController@fetch');
// });
