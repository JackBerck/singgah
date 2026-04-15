<?php

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'reviewable_type' => ['required', 'string', 'in:village,attraction,culinary,accommodation,event,village_event'],
            'reviewable_id'   => ['required', 'integer', 'min:1'],
            'rating'          => ['required', 'integer', 'min:1', 'max:5'],
            'comment'         => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'reviewable_type.required' => 'Tipe entitas wajib diisi.',
            'reviewable_type.in'       => 'Tipe entitas tidak valid.',
            'reviewable_id.required'   => 'ID entitas wajib diisi.',
            'rating.required'          => 'Rating wajib diisi.',
            'rating.min'               => 'Rating minimal 1 bintang.',
            'rating.max'               => 'Rating maksimal 5 bintang.',
            'comment.max'              => 'Komentar maksimal 1000 karakter.',
        ];
    }
}
