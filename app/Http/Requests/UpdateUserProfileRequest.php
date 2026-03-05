<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'name'    => ['required', 'string', 'max:255'],
            'phone'   => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'avatar'  => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'  => 'Nama lengkap wajib diisi.',
            'name.max'       => 'Nama maksimal 255 karakter.',
            'phone.max'      => 'Nomor telepon maksimal 20 karakter.',
            'address.max'    => 'Alamat maksimal 500 karakter.',
            'avatar.image'   => 'File avatar harus berupa gambar.',
            'avatar.mimes'   => 'Format avatar harus JPG, JPEG, PNG, atau WEBP.',
            'avatar.max'     => 'Ukuran avatar maksimal 2MB.',
        ];
    }
}
