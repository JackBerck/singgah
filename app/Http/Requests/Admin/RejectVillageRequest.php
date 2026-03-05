<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class RejectVillageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'rejected_reason' => ['required', 'string', 'min:10', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'rejected_reason.required' => 'Alasan penolakan harus diisi.',
            'rejected_reason.min'      => 'Alasan penolakan minimal 10 karakter.',
        ];
    }
}
