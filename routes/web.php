<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/redirect/{social}','Auth\LoginController@socialLogin')->where('social','twitter|facebook|linkedin|google|graph');

Route::get('/verify-email/{token}','Auth\VerificationController@verify');

// Route::domain('register.' . env('APP_DOMAIN'))->group(function () {
	
// });

// Route::get('/createusers', function () {
//     $users = factory(App\User::class, 1000)->create()->each(function($user) {

//         $user->profile()
//                 ->create([
//                     'about' => 'Default about profile.'
//                 ]);

//         $role = config('access.users.default_role');
//         $user->assignRole($role);
//     });
// });

Route::get('{slug}', function() {
    return view('home');
})->where('slug', '(?!api)([A-z\d-\/_.]+)?');
