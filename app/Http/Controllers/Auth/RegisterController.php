<?php

namespace App\Http\Controllers\Auth;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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

            event(
                new Registered(
                    User::createUserWithProfile($request->all())
                )
            );

            return response()->json(['status','registered successfully'],200);
            
        } catch (\Exception $e) {
            dd($e->getMessage(), $e->getCode(), $e->getTrace());

            return response()->json([
                "error" => "could_not_register",
                "message" => $e->getMessage()
            ], 400);
        }
    }


}
