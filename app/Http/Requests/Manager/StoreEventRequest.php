<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
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
            'event_date'   => ['required', 'date'],
            'end_date'     => ['nullable', 'date', 'after_or_equal:event_date'],
            'location'     => ['nullable', 'string', 'max:255'],
            'contact_info' => ['nullable', 'string', 'max:255'],
            'is_featured'  => ['boolean'],
            'media_ids'    => ['nullable', 'array'],
            'media_ids.*'  => ['integer', 'exists:media,id'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name'        => 'Nama Acara',
            'description' => 'Deskripsi',
            'event_date'  => 'Tanggal Acara',
            'end_date'    => 'Tanggal Selesai',
            'location'    => 'Lokasi',
        ];
    }
}
