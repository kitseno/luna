<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Verification extends Model
{
    //

	protected $fillable = [
        'email', 'token'
    ];

    // Eloquent relationships

    public function user()
    {
        return $this->belongsTo('App\User', 'email', 'email');
    }

    // End of eloquent relationships

    public function checkIfExpired()
    {
    		return Carbon::parse($this->updated_at)->addDays(config('access.users.verify_email_token_expires_days'))->isPast();
    }

}
