<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        $user = $this->route('user');

        return [
            'name'  => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role'  => ['required', Rule::in(['user', 'manager', 'admin'])],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'  => 'Nama harus diisi.',
            'email.required' => 'Email harus diisi.',
            'email.unique'   => 'Email sudah digunakan pengguna lain.',
            'role.required'  => 'Role harus dipilih.',
            'role.in'        => 'Role tidak valid.',
        ];
    }
}
