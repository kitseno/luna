<?php

namespace App\Http\Controllers\Auth;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Http\Requests\RegisterRequest;
use Illuminate\Auth\Events\Registered;
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


    public function register(RegisterRequest $request)
    {

        try {

            // Try creating new user
            $newUser = User::createUserWithProfile($request->all());

            // Event new registered user
            event(new Registered($newUser));

            // Check if user need to verify email if not app will try to login the new user
            if (!config('access.users.verify_email')) {
                // Login user
                $userLogin = $newUser->login($request->only(['email', 'password']));

                return response()->json([
                  'user' => $userLogin['data'],
                  'token'=> $userLogin['token'],
                ], 200);

            }

            // Send Email for Verification
            $newUser->sendEmailVerificationNotification();
            // $newUser->sendEmailVerificationNotification();

            return response()->json(['message','Registered successfully! Please check your email for confirmation.'],200);
            
        } catch (\Exception $e) {
            dd($e->getMessage(), $e->getCode(), $e->getTrace());

            return response()->json([
                "error" => "could_not_register",
                "message" => $e->getMessage()
            ], 400);
        }
    }


}
