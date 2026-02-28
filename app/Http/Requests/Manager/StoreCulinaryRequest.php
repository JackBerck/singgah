<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;

class StoreCulinaryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isManager();
    }

    public function rules(): array
    {
        return [
            'name'         => ['required', 'string', 'max:255'],
            'description'  => ['required', 'string'],
            'price_min'    => ['nullable', 'numeric', 'min:0'],
            'price_max'    => ['nullable', 'numeric', 'min:0', 'gte:price_min'],
            'location'     => ['nullable', 'string', 'max:255'],
            'contact_info' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name'        => 'Nama Kuliner',
            'description' => 'Deskripsi',
            'price_min'   => 'Harga Minimum',
            'price_max'   => 'Harga Maksimum',
        ];
    }
}
