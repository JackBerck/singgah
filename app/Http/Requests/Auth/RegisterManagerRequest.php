<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterManagerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'                      => ['required', 'string', 'max:255'],
            'email'                     => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password'                  => ['required', 'string', 'min:8', 'confirmed'],
            'phone'                     => ['nullable', 'string', 'max:20'],
            'village_name'              => ['required', 'string', 'max:255'],
            'village_address'           => ['nullable', 'string', 'max:500'],
            'village_short_description' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'         => 'Nama lengkap wajib diisi.',
            'email.required'        => 'Alamat email wajib diisi.',
            'email.email'           => 'Format email tidak valid.',
            'email.unique'          => 'Email ini sudah terdaftar.',
            'password.required'     => 'Kata sandi wajib diisi.',
            'password.min'          => 'Kata sandi minimal 8 karakter.',
            'password.confirmed'    => 'Konfirmasi kata sandi tidak cocok.',
            'village_name.required' => 'Nama desa wajib diisi.',
        ];
    }
}
