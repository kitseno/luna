<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

use App\User;

class ChangeUserProfile extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // return true;
        $user = User::find($this->route('user'));


        return $user && $this->user()->can('edit user', $user);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules = [];

        $change_name_rules = [
            'first_name' => 'required|min:1|max:255',
            'last_name' => 'required|min:1|max:255',
        ];

        $change_email_rules = [
            'email' => 'required|email|min:5|max:255',
        ];

        if ($this['method'] == 'changeName')        $rules = array_merge($rules, $change_name_rules);
        if ($this['method'] == 'changeEmail')       $rules = array_merge($rules, $change_email_rules);

        // If method is not set
        if (!isset($this['method'])) $rules = array_merge($rules, $change_name_rules, $change_email_rules);

        return $rules;
    }

    public function messages()
    {
        return [
            'name.required' => 'Name is required :)',
            'name.min' => 'Name must be 5 longer.',
        ];
    }
}
