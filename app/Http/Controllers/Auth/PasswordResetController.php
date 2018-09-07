<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Carbon\Carbon;
use App\Notifications\PasswordResetRequest;
use App\Notifications\PasswordResetSuccess;
use App\User;
use App\PasswordReset;

class PasswordResetController extends Controller
{
    //
		/**
     * Create token password reset
     *
     * @param  [string] email
     * @return [string] message
     */
    public function create(Request $request)
    {
    		//
        $request->validate([
            'email' => 'required|string|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
	            return response()->json([
	                'message' => "Your email address isn't in our record."
	            ], 404);
	      }

	      if ($previousPasswordReset = PasswordReset::where('email', $user->email)->first()) {
	      	$previousPasswordReset->delete();
	      }
        
        $passwordReset = PasswordReset::create(
            [
               'email' => $user->email,
               'token' => str_random(150)
            ]
        );

        if ($user && $passwordReset) {
            $user->notify(
                new PasswordResetRequest($passwordReset->token, $passwordReset->email)
            );
	        return response()->json([
	            'message' => 'We have e-mailed your password reset link!'
	        ]);
	      }
	      //
    }

     /**
     * Reset password
     *
     * @param  [string] email
     * @param  [string] password
     * @param  [string] password_confirmation
     * @param  [string] token
     * @return [string] message
     * @return [json] user object
     */
    public function reset(Request $request)
    {

            $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string|confirmed',
                'token' => 'required|string'
            ]);

            $passwordReset = PasswordReset::where([
                ['token', $request->token],
                ['email', $request->email]
            ])->first();

            if (!$passwordReset) {
                return response()->json([
                    'message' => 'This password reset token is invalid.'
                ], 422);
            } else if (Carbon::parse($passwordReset->updated_at)->addMinutes(config('password.reset.token_expiration'))->isPast()) {
                
                $passwordReset->delete();

                return response()->json([
                    'message' => 'This password reset token has expired.'
                ], 422);
            }

            $user = User::where('email', $passwordReset->email)->first();

            if (!$user) {
                return response()->json([
                    'message' => 'We can\'t find a user with that e-mail address.'
                ], 422);
            }

            // Encrypt the password
            $user->password = bcrypt($request->password);
            // Save user model for reset password
            $user->save();

            // Delete password reset token
            $passwordReset->delete();

            // Notify the user
            $user->notify(new PasswordResetSuccess($request->password));
            
            return response()->json($user);
            
    }
}
