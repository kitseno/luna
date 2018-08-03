<?php

namespace App\Http\Controllers\Auth;

use App\User;
use App\Profile;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Validator;
use GuzzleHttp\Client;


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
                    $this->createUserWithProfile($request->all())
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

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array $data
     * @return User
     */
    protected function createUserWithProfile(array $data)
    {

        $user = new User;

        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->password = bcrypt($data['password']);

        if ($user->save()) {

            // new profile instance
            $profile = new Profile([
                'about' => 'Default about profile.'
            ]);

            // save profile of user
            $user->profile()
                ->save($profile);

            $user->assignRole('member');

            return $user;
        } else {
            return false;
        }
    }


}
