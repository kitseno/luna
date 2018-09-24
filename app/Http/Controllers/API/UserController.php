<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use App\Http\Resources\User as UserResource;
use App\Http\Resources\UserCollection;

use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateUserRequest;

use App\Http\Requests\ChangeUserProfile;
use Illuminate\Auth\Events\Registered;
use Validator;


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
                        $q->where('name', '<>', 'Super-admin');
                    })
                    ->with('roles')
                    ->with(['tokens' => function ($q) {
                        $q->where('revoked', false);
                    }])
                    ->withTrashed()
                    ->paginate(10);

        $activeUsers = User::whereHas('tokens', function ($q) {
                        $q->where('revoked', false);
                    })->get();

        return new UserCollection($data, $activeUsers);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateUserRequest $request)
    {
        return User::createUserWithProfile($request->all())
                // Send user registered notification
                ->sendUserRegisteredNotification()
                // return response
                ->sendResponse();
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
    public function update(UpdateUserRequest $request, $id)
    {

        $user = User::withTrashed()->findOrFail($id);

        if ($user) {

            switch ($request->method) {
                case 'changeName':

                    return $user
                              ->changeName($request)
                              // ->notifySubscribers()
                              ->sendResponse();
                break;

                case 'updateUser':
                    
                    return $user->updateUser($request)->sendResponse();
                    // return $user->sendResponse();
                break;

                case 'restoreUser':
                    if ($request->user()->can('Restore User')) {
                        $user->restore();

                        return $user->sendResponse();
                    }
                break;

                case 'revokeUserAccess':
                    
                    // Revoke each token access
                    foreach ($user->tokens as $token) {
                        $token->revoke();
                    }
                    return $user->sendResponse();
                    // return $user->sendResponse();
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
        if ($request->user()->can('Delete User')) {
            if ($user = User::findOrFail($id) ) {
                if ($user->delete()) {
                    return $user->sendResponse();
                }
            }
        }

        
    }
}
