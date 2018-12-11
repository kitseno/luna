<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return config('access.registration');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'first_name' => 'required|min:1',
            'last_name'  => 'required|min:1',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|min:6|confirmed',
            'password_confirmation' => 'required|min:6'
        ];
    }
}
