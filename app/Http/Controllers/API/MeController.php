<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateAvatarRequest;

use Illuminate\Support\Facades\Storage;

use Auth;

class MeController extends Controller
{
    //
    protected $me;

    public function __construct() {
        $this->middleware(['auth']);

        $this->me = Auth::user();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return $this->me;
    }


    public function updateAvatar(UpdateAvatarRequest $request)
    {
        $avatarName = $request->user()->id.'_avatar'.time().'.'.$request->avatar->getClientOriginalExtension();
        
        // Delete previous avatar
        Storage::delete('avatars/'.$request->user()->avatar);

        $request->file('avatar')->storeAs('avatars', $avatarName);
        $request->user()->avatar = $avatarName;

        if ($request->user()->save()) {
            return response()->json([
                'user' => $request->user(),
                'message' => 'Avatar updated!'
            ], 200);
        }
    }

}
