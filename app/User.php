<?php

namespace App;

use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Notifications\ResetPassword as ResetPasswordNotification;
use Spatie\Permission\Traits\HasRoles;


class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
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


    /* start of eloquent relationships */

    public function profile()
    {
        return $this->hasOne('App\Profile', 'user_id');
    }

    /* end of eloquent relationships */

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
}
