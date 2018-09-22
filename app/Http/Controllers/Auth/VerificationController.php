<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Verification;
use App\User;
// use Illuminate\Foundation\Auth\VerifiesEmails;

class VerificationController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Email Verification Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling email verification for any
    | user that recently registered with the application. Emails may also
    | be re-sent if the user didn't receive the original email message.
    |
    */

    // use VerifiesEmails;

    /**
     * Where to redirect users after verification.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('auth');
        // $this->middleware('signed')->only('verify');
        // $this->middleware('throttle:6,1')->only('verify', 'resend');
    }

    public function resend(Request $request)
    {
        // return $request->all();

        $user = User::where('email', $request->email)->first();

        // Resend to user
        if ($notif = $user->sendEmailVerificationNotification()) {
            return response()->json(['result' => $notif], 200);
        }
    }

    public function verify(Request $request)
    {

        // Get verification
        if ($verification = Verification::where('token', $request->token)->first()) {
            // Get user
            $user = $verification->user()->first();

            // Check if token has expired
            if ($verification->checkIfExpired()) {
                $user->sendEmailVerificationNotification();
                return 'Verification token has expired! We have sent a new link to your email: '.$verification->email.'.';
            } 

            // Check if user is already verified
            if ($user->hasVerifiedEmail()) {
                return 'You are already verified';
            }

            // Mark user as verified
            $user->markEmailAsVerified();
            // Delete token at verification
            $verification->delete();

            return redirect('/login?email_verification_success=true&h='.str_random(50));
        } else {
            return redirect('/login?token_invalid=true&h='.str_random(50));
        }
        
    }

}

