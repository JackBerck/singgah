<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVillageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isManager();
    }

    public function rules(): array
    {
        return [
            'name'              => ['required', 'string', 'max:255'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description'       => ['required', 'string'],
            'category'          => ['nullable', 'in:pesisir_bahari,agrowisata,kuliner_lokal,budaya_tradisi,wisata_alam'],
            'address'           => ['nullable', 'string', 'max:500'],
            'latitude'          => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'         => ['nullable', 'numeric', 'between:-180,180'],
            'map_url'           => ['nullable', 'url', 'max:2000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name'              => 'Nama Desa',
            'short_description' => 'Deskripsi Singkat',
            'description'       => 'Deskripsi Lengkap',
            'category'          => 'Kategori',
            'address'           => 'Alamat',
            'latitude'          => 'Latitude',
            'longitude'         => 'Longitude',
            'map_url'           => 'URL Peta',
        ];
    }
}
