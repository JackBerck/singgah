<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVillageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $villageId = $this->route('village')?->id;

        return [
            'name'              => ['required', 'string', 'max:255'],
            'slug'              => ['nullable', 'string', 'max:255', "unique:villages,slug,{$villageId}"],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description'       => ['nullable', 'string'],
            'address'           => ['nullable', 'string', 'max:500'],
            'latitude'          => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'         => ['nullable', 'numeric', 'between:-180,180'],
            'map_url'           => ['nullable', 'url', 'max:1000'],
            'status'            => ['required', 'in:pending,verified,rejected'],
            'is_featured'       => ['boolean'],
            'rejected_reason'   => ['nullable', 'string', 'min:10'],
            'files'             => ['nullable', 'array'],
            'files.*'           => ['file', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            'existing_media_ids'   => ['nullable', 'array'],
            'existing_media_ids.*' => ['integer'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'       => 'Nama desa wajib diisi.',
            'status.required'     => 'Status wajib dipilih.',
            'status.in'           => 'Status tidak valid.',
            'files.*.mimes'       => 'File harus berformat JPG, PNG, WebP, atau GIF.',
            'files.*.max'         => 'Ukuran file maksimal 5MB.',
            'rejected_reason.min' => 'Alasan penolakan minimal 10 karakter.',
        ];
    }
}
