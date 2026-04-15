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
            'phone'                     => ['nullable', 'string', 'max:20', 'regex:/^(?:\\+62|62|0)8[0-9]{8,13}$/'],
            'village_name'              => ['required', 'string', 'max:255'],
            'village_address'           => ['nullable', 'string', 'max:255'],
            'village_short_description' => ['nullable', 'string', 'max:255'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => trim((string) $this->input('name')),
            'email' => strtolower(trim((string) $this->input('email'))),
            'phone' => $this->normalizeNullable($this->input('phone')),
            'village_name' => trim((string) $this->input('village_name')),
            'village_address' => $this->normalizeNullable($this->input('village_address')),
            'village_short_description' => $this->normalizeNullable($this->input('village_short_description')),
        ]);
    }

    private function normalizeNullable(mixed $value): ?string
    {
        $normalized = trim((string) $value);

        return $normalized === '' ? null : $normalized;
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
            'phone.regex'           => 'Format nomor telepon tidak valid.',
            'village_name.required' => 'Nama desa wajib diisi.',
            'village_address.max'   => 'Alamat desa maksimal 255 karakter.',
            'village_short_description.max' => 'Deskripsi singkat maksimal 255 karakter.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'nama lengkap',
            'email' => 'alamat email',
            'password' => 'kata sandi',
            'password_confirmation' => 'konfirmasi kata sandi',
            'phone' => 'nomor telepon',
            'village_name' => 'nama desa',
            'village_address' => 'alamat desa',
            'village_short_description' => 'deskripsi singkat desa',
        ];
    }
}
