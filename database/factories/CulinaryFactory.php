<?php

namespace Database\Factories;

use App\Models\Village;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Culinary>
 */
class CulinaryFactory extends Factory
{
    public function definition(): array
    {
        $culinaries = [
            'Warung Makan Bu Sri',
            'Nasi Liwet Pak Slamet',
            'Sate Kambing Pak Haji',
            'Kerajinan Anyaman Bambu',
            'Batik Tulis Klasik',
            'Tempe Mendoan Crispy',
            'Jamu Tradisional Bu Tini',
            'Kopi Robusta Desa',
            'Gudeg Spesial Bu Nah',
            'Tahu Gimbal Bu Lastri',
            'Keripik Singkong Pedas',
            'Gula Aren Asli Desa',
            'Olahan Madu Hutan',
            'Soto Ayam Khas Desa',
        ];

        $name     = fake()->randomElement($culinaries);
        $priceMin = fake()->randomElement([5000, 10000, 15000, 20000, 25000]);
        $priceMax = $priceMin + fake()->randomElement([5000, 10000, 15000, 30000]);

        return [
            'village_id'   => Village::factory()->verified(),
            'name'         => $name,
            'slug'         => Str::slug($name) . '-' . fake()->unique()->numberBetween(1, 9999),
            'description'  => '<p>' . implode('</p><p>', fake()->paragraphs(3)) . '</p>',
            'price_min'    => $priceMin,
            'price_max'    => $priceMax,
            'location'     => 'Jl. ' . fake()->streetName() . ', Desa',
            'contact_info' => fake()->numerify('08##########'),
        ];
    }
}
