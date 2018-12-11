<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Auth\Access\AuthorizationException;

class UpdateUserRequest extends FormRequest
{

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */

    public function authorize()
    {
        switch (FormRequest::get('method')) {
            case 'updateUser':
                return $this->user()->can('Update User');
            case 'restoreUser':
                return $this->user()->can('Restore User');
            case 'revokeUserAccess':
                return $this->user()->can('Revoke User');
            default:
                return false;
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        switch ($this->method) {

            case 'updateUser':
                    return [
                        'first_name'=> 'required|min:1',
                        'last_name' => 'required|min:1',
                        'email'     => 'required|unique:users,email,'.$this->id,
                        'role'      => 'required'
                    ];
                break;
            case 'restoreUser':
            case 'revokeUserAccess':
            default:
                return [];

        }
    }

    protected function failedAuthorization()
    {
        switch (FormRequest::get('method')) {
            case 'restoreUser':
                throw new AuthorizationException(__('api.user.unauthorized.restore'));
            case 'revokeUserAccess':
                throw new AuthorizationException(__('api.user.unauthorized.revoke'));
            default:
                throw new AuthorizationException(__('api.user.unauthorized.update'));
        }   
        
    }
}
