<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use GuzzleHttp\Client;
use App\User;
use App\Profile;

use Socialite;

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

    public function login(Request $request)
    {
        
        $validator = \Validator::make($request->only(['email','password']), [
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:6'
        ], [
            'email.exists' => 'User not yet registered.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                "error" => 'validation_error',
                "message" => $validator->errors()->all(),
            ], 422);
        }

        try {

            $http = new Client;
            // $headers = ['Accept' => 'application/json'];
            $response = $http->post(env('APP_URL') . '/oauth/token', [
                // 'headers' => $headers,
                'verify' => false,
                'form_params' => [
                    'grant_type' => 'password',
                    'client_id' => env('PASSWORD_CLIENT_ID'),
                    'client_secret' => env('PASSWORD_CLIENT_SECRET'),
                    'username' => $request->get('email'),
                    'password' => $request->get('password'),
                    // 'remember' => $request->get('remember'),
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

        } catch (\GuzzleHttp\Exception\ClientException $e) {
            return response()->json([
                'error' => 'invalid_credentials',
                'message' => json_decode((string) $e->getResponse()->getBody()->getContents(), true)
            ], 401);
        }
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

        return response()->json(['message' => '`I guess I\'m kinda hoping you\'ll come back over the rail and get me off the hook here.` - Titanic, Jack, Leonardo DiCarpio'], 201);
    }

    public function socialLogin($social)
    {
        if ($social == "facebook" || $social == "google" || $social == "linkedin" || $social == "graph") {

            $scopes = [];

            if ($social == "graph") {
                $scopes = ['User.Read.All', 'Calendars.Read', 'Mail.Read'];
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
            $userSocial = Socialite::with($social)->stateless()->user();
        } else {
            $userSocial = Socialite::with($social)->user();
        }

        $token = $userSocial->token;

        $user = User::firstOrNew(['email' => $userSocial->getEmail()]);

        if (!$user->id) {
            $user->fill([
                "name" => $userSocial->getName(),
                "password"=>bcrypt(str_random(6))
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
