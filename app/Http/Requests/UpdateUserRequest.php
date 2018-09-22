<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->user()->can('Update User');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        if ($this->method == 'updateUser') {
            return [
                'name'      => 'required|min:3',
                'email'     => 'required|unique:users,email,'.$this->id,
                'role'      => 'required'
            ];
        }

        return [];
    }
}
