<?php

namespace Database\Factories;

use App\Models\Village;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Accommodation>
 */
class AccommodationFactory extends Factory
{
    public function definition(): array
    {
        $accommodations = [
            'Homestay Bu Sari',
            'Villa Panorama Hijau',
            'Penginapan Alam Desa',
            'Bungalow Tepi Sawah',
            'Losmen Pak Joko',
            'Rumah Joglo Tradisional',
            'Glamping Bukit Indah',
            'Guest House Desa Wisata',
            'Hostel Backpacker Desa',
            'Villa Bambu Alami',
        ];

        $name     = fake()->randomElement($accommodations);
        $priceMin = fake()->randomElement([100000, 150000, 200000, 250000, 300000]);
        $priceMax = $priceMin + fake()->randomElement([50000, 100000, 150000, 200000]);

        return [
            'village_id'      => Village::factory()->verified(),
            'name'            => $name,
            'slug'            => Str::slug($name) . '-' . fake()->unique()->numberBetween(1, 9999),
            'description'     => '<p>' . implode('</p><p>', fake()->paragraphs(3)) . '</p>',
            'price_min'       => $priceMin,
            'price_max'       => $priceMax,
            'location'        => 'RT ' . fake()->numberBetween(1, 9) . '/RW ' . fake()->numberBetween(1, 9) . ', Desa',
            'contact_info'    => fake()->numerify('08##########'),
            'operating_hours' => 'Check-in: 14.00 | Check-out: 12.00',
        ];
    }
}
