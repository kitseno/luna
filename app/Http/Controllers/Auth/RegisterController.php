<?php

namespace App\Http\Controllers\Auth;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Illuminate\Auth\Events\Registered;
use GuzzleHttp\Client;
use Validator;
use App\User;


class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */


    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:3',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
            'password_confirmation' => 'required|min:6'
        ], [
            'password.confirmed' => 'The password does not match.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                "error" => 'validation_error',
                "message" => $validator->errors(),
            ], 422);
        }

        try {

            $newUser = User::createUserWithProfile($request->all());

            if (config('access.users.confirm_email') || config('access.users.requires_approval')) {
                
                event(new Registered($newUser));

                return response()->json(['status','Registered successfully! Please check your email for confirmation.'],200);
            } else {

                event(new Registered($newUser));
                
                $http = new Client;
                
                $response = $http->post(env('APP_URL') . '/oauth/token', [
                    'verify' => false,
                    'form_params' => [
                        'grant_type' => 'password',
                        'client_id' => env('PASSWORD_CLIENT_ID'),
                        'client_secret' => env('PASSWORD_CLIENT_SECRET'),
                        'username' => $request->get('email'),
                        'password' => $request->get('password'),
                        'remember' => false,
                        'scope' => '',
                    ],
                ]);

                $user = User::where('email', $request->get('email'))
                        ->first();

                $user_array = [
                    'id'            => $user->id,
                    'email'         => $user->email,
                    'name'          => $user->name,
                    'created_at'    => date($user->created_at),
                    'updated_at'    => date($user->updated_at),
                    'deleted_at'    => date($user->deleted_at),
                    
                    // Check if user has permission to access admin panel
                    // Assign boolean using permission
                    'is_admin'  => $user->hasPermissionTo('View Admin'),

                    // Add scope permissions
                    'scopes'    => $user->getAllPermissionsName(),
                ];

                return response()->json([
                  'user' => $user_array,
                  'token'=> json_decode((string) $response->getBody(), true)['access_token'],
                ], 200);

            }
            
        } catch (\Exception $e) {
            dd($e->getMessage(), $e->getCode(), $e->getTrace());

            return response()->json([
                "error" => "could_not_register",
                "message" => $e->getMessage()
            ], 400);
        }
    }


}
