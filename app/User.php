<?php

namespace App;

use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Notifications\ResetPassword as ResetPasswordNotification;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;


class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasRoles;
    use SoftDeletes;

    protected $guard_name = 'api';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'timezone',
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


    /* start of eloquent relationships */

    public function profile()
    {
        return $this->hasOne('App\Profile', 'user_id');
    }

    /* end of eloquent relationships */


    /**
    ** Methods
    */

    /**
     * @return bool
     */
    public function isConfirmed()
    {
        return $this->confirmed;
    }

    // Change name
    public function changeName($request)
    {

        $this->update(['name' => $request->name]);


        return $this;
    }

    public function sendPasswordResetNotification($token)
    {
        // Your your own implementation.
        $this->notify(new ResetPasswordNotification($token, $this->getEmailForPasswordReset()));
    }

    /* send response */

    public function sendResponse()
    {

        $statusCode = ($this ? 200 : 422);


        return response()->json(['user' => $this], $statusCode);
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
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $user->profile()
                ->create([
                    'about' => 'Default about profile.'
                ]);

        $role = $data['role'] ?? config('access.users.default_role');

        $user->assignRole($role);

        return $user;

    }

    
}
