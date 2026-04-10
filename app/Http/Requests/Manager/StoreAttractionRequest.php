<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttractionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isManager();
    }

    public function rules(): array
    {
        return [
            'name'            => ['required', 'string', 'max:255'],
            'description'     => ['required', 'string'],
            'price_min'       => ['nullable', 'numeric', 'min:0'],
            'price_max'       => ['nullable', 'numeric', 'min:0', 'gte:price_min'],
            'location'        => ['nullable', 'string', 'max:255'],
            'contact_info'    => ['nullable', 'numeric'],
            'open_time'       => ['nullable', 'date_format:H:i'],
            'close_time'      => ['nullable', 'date_format:H:i', 'after:open_time'],
            'map_url'         => ['nullable', 'url', 'max:1000'],
            'existing_media_ids' => ['nullable', 'array'],
            'existing_media_ids.*' => ['integer', 'exists:media,id'],
            'files'           => ['nullable', 'array', 'max:15'],
            'files.*'         => ['file', 'mimes:jpg,jpeg,png,webp,gif,mp4,webm', 'max:51200'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name'            => 'Nama Wisata',
            'description'     => 'Deskripsi',
            'price_min'       => 'Harga Minimum',
            'price_max'       => 'Harga Maksimum',
            'contact_info'    => 'Info Kontak',
            'open_time'       => 'Jam Buka',
            'close_time'      => 'Jam Tutup',
            'map_url'         => 'Tautan Google Maps',
        ];
    }
}
