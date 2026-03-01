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
            'contact_info'    => ['nullable', 'string', 'max:255'],
            'operating_hours' => ['nullable', 'string', 'max:255'],
            'media_ids'       => ['nullable', 'array'],
            'media_ids.*'     => ['integer', 'exists:media,id'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name'            => 'Nama Wisata',
            'description'     => 'Deskripsi',
            'price_min'       => 'Harga Minimum',
            'price_max'       => 'Harga Maksimum',
            'operating_hours' => 'Jam Operasional',
        ];
    }
}
