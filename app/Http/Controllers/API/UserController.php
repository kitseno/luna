<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use App\Http\Resources\User as UserResource;
use App\Http\Resources\UserCollection;

use App\Http\Requests\ChangeUserProfile;


class UserController extends Controller
{
  
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = User::orderBy('created_at', 'desc')
                    ->whereHas('roles', function ($q) {
                        // $q->where('name', '<>', 'Super-admin');
                    })
                    ->with('roles')
                    ->withTrashed()
                    ->paginate(5);

        return new UserCollection($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        return new UserResource(User::find($id));
          // return response()->json(auth()->user()->hasRole('admin'), 200);
          // if ($this->user->hasRole('admin')) {
          //     return 'OK';
          // } else {
          //     return 'Not OK';
          // }
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

        $user = User::withTrashed()->findOrFail($id);

        // return $user;


        if ($user) {

            switch ($request->method) {
                case 'changeName':

                    return $user
                              ->changeName($request)
                              // ->notifySubscribers()
                              ->sendResponse();
                break;

                case 'restoreUser':

                    $user->restore();

                    return $user->sendResponse();
                break;
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        if ($user = User::findOrFail($id) ) {
            if ($user->delete()) {
                return $user->sendResponse();
            }
        }

        
    }
}
