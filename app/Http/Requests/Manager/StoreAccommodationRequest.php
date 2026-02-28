<?php

namespace App\Http\Requests\Manager;

class StoreAccommodationRequest extends StoreAttractionRequest
{
    public function attributes(): array
    {
        return array_merge(parent::attributes(), [
            'name'        => 'Nama Akomodasi',
            'description' => 'Deskripsi',
        ]);
    }
}
