<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCulinaryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'               => ['required', 'string', 'max:255'],
            'description'        => ['nullable', 'string'],
            'price_min'          => ['nullable', 'numeric', 'min:0'],
            'price_max'          => ['nullable', 'numeric', 'min:0'],
            'location'           => ['nullable', 'string', 'max:500'],
            'contact_info'       => ['nullable', 'string', 'max:500'],
            'files'              => ['nullable', 'array'],
            'files.*'            => ['file', 'mimes:jpg,jpeg,png,webp,gif,mp4,webm', 'max:51200'],
            'existing_media_ids'   => ['nullable', 'array'],
            'existing_media_ids.*' => ['integer'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'  => 'Nama kuliner wajib diisi.',
            'price_min.min'  => 'Harga minimal tidak boleh negatif.',
            'price_max.min'  => 'Harga maksimal tidak boleh negatif.',
            'files.*.mimes'  => 'File harus berformat JPG, PNG, WebP, GIF, MP4, atau WebM.',
            'files.*.max'    => 'Ukuran file terlalu besar.',
        ];
    }
}
