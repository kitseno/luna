<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    //

		protected $table = 'profiles';
		// protected $primaryKey = 'profile_id';

		protected $fillable = [
        'user_id', 'about',
    ];

    public function user()
    {
        return $this->belongsTo('App\User', 'id');
    }

}
