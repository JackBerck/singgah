<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
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
            'event_date'         => ['required', 'date'],
            'end_date'           => ['nullable', 'date', 'after_or_equal:event_date'],
            'location'           => ['nullable', 'string', 'max:500'],
            'contact_info'       => ['nullable', 'string', 'max:500'],
            'is_featured'        => ['boolean'],
            'files'              => ['nullable', 'array'],
            'files.*'            => ['file', 'mimes:jpg,jpeg,png,webp,gif,mp4,webm', 'max:51200'],
            'existing_media_ids'   => ['nullable', 'array'],
            'existing_media_ids.*' => ['integer'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'       => 'Nama acara wajib diisi.',
            'event_date.required' => 'Tanggal mulai wajib diisi.',
            'event_date.date'     => 'Format tanggal tidak valid.',
            'end_date.after_or_equal' => 'Tanggal selesai harus sama atau setelah tanggal mulai.',
            'files.*.mimes'       => 'File harus berformat JPG, PNG, WebP, GIF, MP4, atau WebM.',
            'files.*.max'         => 'Ukuran video maksimal 50MB.',
        ];
    }
}
