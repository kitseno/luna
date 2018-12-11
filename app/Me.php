<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;
use Auth;

class Me extends User
{
    //

    public $me;

    public static function __invoke()
    {
        
    }

    public static function info()
    {
        return Auth::user();
    }

}
