<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserCollection;

use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\DeleteUserRequest;

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
                    ->orderBy('id', 'desc')
                    ->withTrashed()
                    ->paginate(10);

        return new UserCollection($data, User::getActiveUsers(), User::getTotalUsersCount(), User::getNewUsersToday()); 
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateUserRequest $request)
    {

        // Try creating new user
        $newUser = User::createUserWithProfile($request->all());

        // Event new registered user
        event(new Registered($newUser));
        // Send user registered notification
        $newUser->sendUserRegisteredNotification();

        // Check if user need to verify email if not app will try to login the new user
        if (config('access.users.verify_email')) {
            // Send Email for Verification
            $newUser->sendEmailVerificationNotification();
        }

        return $newUser->sendResponse();
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
                break;

                case 'restoreUser':

                    $user->restore();
                    return $user->sendResponse(__('api.user.success.restore', ['first_name' => $user->first_name]));
                break;

                case 'revokeUserAccess':
                    
                    // Revoke each token access
                    foreach ($user->tokens as $token) {
                        $token->revoke();
                    }
                    return $user->sendResponse(__('api.user.success.revoke', ['first_name' => $user->first_name]));
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
    public function destroy($id, DeleteUserRequest $request)
    {
        //
        if ($user = User::findOrFail($id) ) {
            $user->delete();
            return $user->sendResponse(__('api.user.success.delete', ['first_name' => $user->first_name]));
        }
    }

    /**
     * Search Users using Scout index
     *
     * @param  string  $keyword
     * @return \Illuminate\Http\Response
     */
    public function searchUsers(Request $request)
    {
        //
        $ids = collect(User::search($request->q)->take(500)->get())->pluck('id');

        $data = User::orderBy('created_at', 'desc')
                    ->whereIn('id', $ids)
                    ->whereHas('roles', function ($q) {
                        $q->where('name', '<>', 'Super-admin');
                    })
                    ->with('roles')
                    ->with(['tokens' => function ($q) {
                        $q->where('revoked', false);
                    }])
                    ->withTrashed()
                    ->paginate(10);

        return new UserCollection($data, User::getActiveUsers(), User::getTotalUsersCount(), User::getNewUsersToday()); 
    }
}
