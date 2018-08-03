<?php

use Illuminate\Http\Request;

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
	Route::post('/email', 'Auth\ForgotPasswordController@getResetToken');
	Route::post('/reset', 'Auth\ResetPasswordController@reset');
});

Route::group(['prefix'=> 'auth'], function() {
    Route::post('/register','Auth\RegisterController@register');
    Route::post('/login','Auth\LoginController@login');
    Route::post('/login/{social}/callback','Auth\LoginController@handleProviderCallback')->where('social','twitter|facebook|linkedin|google|graph');

    Route::delete('/logout', 'Auth\LoginController@logout')
    	->name('auth.logout')
    	->middleware('auth:api');
});

Route::resource('users', 'API\UserController')->middleware('auth:api');

// Route::group(['prefix'=> 'users', 'middleware' => 'auth:api'], function() {
//     // Route::match(['put', 'patch'], '/{id}', 'Api\UserController@update')->name('users.update');
//     Route::post('/{id}', 'Api\UserController@fetch');
// });
