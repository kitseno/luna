<?php

namespace App;

use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

use App\Notifications\ResetPassword as ResetPasswordNotification;
use App\Notifications\EmailVerificationNotification;
use App\Notifications\UserRegistered as UserRegisteredNotification;

use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Spatie\Permission\Models\Role;

use GuzzleHttp\Client;
use Laravel\Scout\Searchable;
use Illuminate\Support\Str;

use Spatie\Activitylog\Traits\LogsActivity;



class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, Notifiable, HasRoles;
    use SoftDeletes;
    use Searchable;

    use LogsActivity;
    protected static $logName = 'user';
    protected static $recordEvents = ['deleted', 'updated', 'created'];
    protected static $logAttributes = ['first_name', 'last_name', 'email', 'password', 'last_login_ip', 'deleted_at'];

    protected $guard_name = 'api';
    public $asYouType = true;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'first_name',
        'last_name',
        'email',
        'password',
        'avatar',
        'email_verified_at',
        'timezone',
        'provider',
        'last_login_at',
        'last_login_ip',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];


    protected $casts = [
        'is_admin' => 'boolean',
    ];

    protected $dates = ['deleted_at'];

    public function toSearchableArray()
    {
        return [
             'id' => $this->id,
             'first_name' => $this->first_name,
             'last_name' => $this->last_name,
             'email' => $this->email,
        ];
    }


    /* start of eloquent relationships */

    public function profile()
    {
        return $this->hasOne('App\Profile', 'user_id');
    }

    /**
     *
     * Verification relation ship
     *
     */
    public function verification()
    {
        return $this->hasOne('App\Verification', 'email', 'email');
    }

    /* end of eloquent relationships */


    /**
    ** Methods
    */

    /**
     * @return email address
     */
    public function getEmailAddress()
    {
        return $this->email;
    }

    // Change name
    public function changeName($request)
    {

        $this->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name
        ]);


        return $this;
    }

    public function updateUser($request) {

        $this->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
        ]);

        $this->syncRoles([$request->role]);

        return $this;
    }

    /* send response */

    public function sendResponse($message = null)
    {

        $statusCode = ($this ? 200 : 422);


        return response()->json(['user' => $this, 'message' => $message], $statusCode);
    }

    /*
    Get all permissions scope
    **/

    public function getAllPermissionsName()
    {
        $scopes = [];

        foreach ($this->getAllPermissions()->pluck('name') as $scope) {
                $scopes[] = [
                    'action'    => explode(' ', $scope)[0],
                    'subject'   => explode(' ', $scope)[1],
                ];
        }

        return $scopes;
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array $data
     * @return User
     */
    public static function createUserWithProfile(array $data)
    {

        $user = self::create([
            'id'            => (string) Str::orderedUuid(),
            'first_name'    => $data['first_name'],
            'last_name'     => $data['last_name'],
            'email'         => $data['email'],
            'password'      => bcrypt($data['password']),
            'email_verified_at' => (config('access.users.verify_email')) ? null : now(),
        ]);

        $user->profile()
                ->create([
                    'about' => 'Default about profile.'
                ]);

        $role = $data['role'] ?? config('access.users.default_role');

        $user->assignRole($role);

        return $user;

    }

    /**
     * Get active users
     */

    public static function getActiveUsers()
    {
        return self::whereHas('tokens', function ($q) {
            $q->where('revoked', false);
        })
        ->whereHas('roles', function ($q) {
            $q->where('name', '<>', 'Super-admin');
        })
        ->count();
    }

    /**
     * Get total users count
     */

    public static function getTotalUsersCount()
    {
        return self::whereHas('roles', function ($q) {
            $q->where('name', '<>', 'Super-admin');
        })
        ->count();
    }

    /**
     * Get new users
     */

    public static function getNewUsersToday()
    {
        return self::whereHas('roles', function ($q) {
            $q->where('name', '<>', 'Super-admin');
        })
        ->whereDate('created_at', date('Y-m-d'))
        ->count();
    }

    /**
     *
     * Login user
     *
     */

    public function login(array $data)
    {

        try {

            $http = new Client;
                    
            $response = $http->post(env('APP_URL') . '/oauth/token', [
                'verify' => false,
                'form_params' => [
                    'grant_type' => 'password',
                    'client_id' => $data['client_id'] ?? env('PASSWORD_CLIENT_ID'),
                    'client_secret' => $data['client_secret'] ?? env('PASSWORD_CLIENT_SECRET'),
                    'username' => $data['email'],
                    'password' => $data['password'],
                    'remember' => false,
                    'scope' => '',
                ],
            ]);

            $user_array = [
                'id'            => $this->id,
                'email'         => $this->email,
                'first_name'    => $this->first_name,
                'last_name'     => $this->last_name,
                'avatar'        => $this->avatar,
                'created_at'    => date($this->created_at),
                'updated_at'    => date($this->updated_at),
                'deleted_at'    => date($this->deleted_at),
                
                // Check if user has permission to access admin panel
                // Assign boolean using permission
                'is_admin'  => $this->hasPermissionTo('View Admin'),

                // Add scope permissions
                'scopes'    => $this->getAllPermissionsName(),
            ];

            return [
                        'data' => $user_array,
                        'token' => json_decode((string) $response->getBody(), true)['access_token']
                    ];

        } catch (\GuzzleHttp\Exception\ClientException $e) {

            return json_decode((string) $e->getResponse()->getBody(), false);

        }
    }

    /**
     *
     * Send password reset notification
     *
     */

     public function sendPasswordResetNotification($token)
    {
        // Your your own implementation.
        $this->notify(new ResetPasswordNotification($token, $this->getEmailForPasswordReset()));
    }

    /**
     *
     * Send email verification notification to user
     *
     */
    public function sendEmailVerificationNotification()
    {

        $verification = Verification::updateOrCreate(
            ['email' => $this->email],
            [
                'email'  => $this->email,
                'token'  => str_random(150),
            ]
        );

        $this->notify(new EmailVerificationNotification($verification->email, $verification->token));
    }

    /**
     *
     * Send email verification notification to user
     *
     */
    public function sendUserRegisteredNotification()
    {
        $this->notify(new UserRegisteredNotification());

        return $this;
    }

    
}
