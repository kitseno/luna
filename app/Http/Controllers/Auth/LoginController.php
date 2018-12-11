<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Http\Requests\LoginRequest;

use Illuminate\Support\Facades\DB;
use GuzzleHttp\Client;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

use App\User;
use App\Profile;

use Socialite;

// Events
use App\Events\User\Login as UserLogin;
use App\Events\User\Logout as UserLogout;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    public function login(LoginRequest $request)
    {

        // Get user where email address
        $user = User::where('email', $request->get('email'))
                    ->first();

        // Try to login user
        $userLogin = $user->login($request->only(['email', 'password', 'client_id', 'client_secret']));

        
        if (isset($userLogin->error)) return response()->json($userLogin, 401);

        // Check if the user has already verified email
        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                "error" => 'email_not_verified',
                "message" => __('auth.email_unverified'),
            ], 401);
        }

        // Event user logged in
        event(new UserLogin($user));

        // Log activity
        activity('login')
            ->performedOn($user)
            ->causedBy($user)
            ->log('('.$user->id.') '.$user->first_name.' has successfully logged in.');

        return response()->json([
              'user' => $userLogin['data'],
              'token'=> $userLogin['token'],
            ], 200);
    }

    public function logout(Request $request)
    {
        $accessToken = $request->user()->token();

        DB::table('oauth_refresh_tokens')
            ->where('access_token_id', $accessToken->id)
            ->update([
                'revoked' => true
            ]);

        $accessToken->revoke();

        event(new UserLogout($request->user()));

        return response()->json(['message' => __('auth.logout')], 201);
    }

    public function socialLogin($social)
    {
        if ($social == "facebook" || $social == "google" || $social == "linkedin" || $social == "graph") {

            $scopes = [];

            if ($social == "graph") {
                $scopes = ['User.Read.All', 'Calendars.Read', 'Mail.Read'];
            } else if ($social == "facebook") {
                $scopes = ['public_profile'];
            }

            return Socialite::with($social)
                            ->scopes($scopes)
                            ->stateless()
                            ->redirect();
        } else {
            return Socialite::with($social)->redirect();
        }
    }

    public function handleProviderCallback($social)
    {
        if ($social == "facebook" || $social == "google" || $social == "linkedin" || $social == "graph") {

            $fields = [];

            if ($social == "facebook") {
                $fields = [
                    'name',
                    'first_name',
                    'last_name',
                    'email',
                ];
            }

            $userSocial = Socialite::with($social)
                                    ->fields($fields)
                                    ->stateless()
                                    ->user();

        } else {
            $userSocial = Socialite::with($social)->user();
        }

        $token = $userSocial->token;

        $user = User::firstOrNew(['email' => $userSocial->getEmail()]);

        if (!$user->id) {

            // Update avatar
            $avatar = file_get_contents($userSocial->getAvatar());
            $avatarExtension = image_type_to_extension(getimagesize($userSocial->getAvatar())[2]);
            $avatarName = $userSocial->id.'_avatar'.time().$avatarExtension;

            // Delete previous avatar
            Storage::delete('avatars/'.$user->avatar);

            // $avatar->storeAs('avatars', $avatarName);
            Storage::disk('local')->put('public/avatars/'.$avatarName, $avatar);

            $user->fill([
                "id"                => (string) Str::orderedUuid(),
                "first_name"        => $userSocial->user['first_name'],
                "last_name"         => $userSocial->user['last_name'],
                "avatar"            => $avatarName,
                "provider"          => $social,
                "password"          => bcrypt(str_random(6))
            ]);

            // Save user social
            if ($user->save()) {

                // new profile instance
                $profile = new Profile([
                    'about' => ''
                ]);

                // save profile of user
                $user->profile()
                    ->save($profile);

                $user->assignRole('member');
                // return $user;
            }

            // $user->sendUserRegisteredNotification();
        }

        // $user_details = User::find($user->id);

        $access_token = $user->createToken($token)->accessToken;

        return response()->json([
            'user'  => $user,
            'userSocial'  => $userSocial,
            'token' => $access_token,
        ],200);
    }

    public function checkIfUserIsAuthenticated(Request $request)
    {

           if ($request->user()) {

                return response()->json([
                    'isAuthenticated' => true,
                    'isAdmin' => $request->user()->hasPermissionTo('View Admin'),
                    'scopes' => $request->user()->getAllPermissionsName(), 
                ], 200);
                
           } else {
                return response()->json(['isAuthenticated' => false], 400);
           }
    }

}
