<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use App\Http\Resources\User as UserResource;
use App\Http\Resources\UserCollection;

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
                    ->withTrashed()
                    ->paginate(10);

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
        
        if ($request->user()->can('Add User')) {

            $validator = Validator::make($request->all(), [
                'name'      => 'required|min:3',
                'email'     => 'required|email|unique:users,email',
                'password'  => 'required|min:6',
                'role'      => 'required'
            ], [
                'role.required' => 'You must not leave the role blank.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    "error" => 'validation_error',
                    "message" => $validator->errors(),
                ], 422);
            }

            try {

                return User::createUserWithProfile($request->all())->sendResponse();

            } catch (\Exception $e) {

            }

        } else {
            return response()->json(['error' => 'Unauthorized', 'message' => "You're not allowed to create user."], 402);
        }
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
                    if ($request->user()->can('Restore User')) {
                        $user->restore();

                        return $user->sendResponse();
                    }
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
