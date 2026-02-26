<?php

namespace Database\Factories;

use App\Models\Village;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attraction>
 */
class AttractionFactory extends Factory
{
    public function definition(): array
    {
        $attractions = [
            'Air Terjun Seribu Batu',
            'Bukit Panorama Indah',
            'Goa Kristal',
            'Sawah Terasering',
            'Telaga Warna',
            'Curug Lawe',
            'Bukit Sunrise',
            'Kebun Teh Hijau',
            'Danau Biru',
            'Hutan Pinus Mangunan',
            'Pantai Pasir Putih',
            'Jembatan Gantung Desa',
        ];

        $name     = fake()->randomElement($attractions);
        $priceMin = fake()->randomElement([5000, 10000, 15000, 20000]);
        $priceMax = $priceMin + fake()->randomElement([5000, 10000, 15000, 20000]);

        return [
            'village_id'      => Village::factory()->verified(),
            'name'            => $name,
            'slug'            => Str::slug($name) . '-' . fake()->unique()->numberBetween(1, 9999),
            'description'     => '<p>' . implode('</p><p>', fake()->paragraphs(3)) . '</p>',
            'price_min'       => $priceMin,
            'price_max'       => $priceMax,
            'location'        => 'Dusun ' . fake()->word() . ', ' . fake()->city(),
            'contact_info'    => fake()->numerify('08##########'),
            'operating_hours' => fake()->randomElement([
                '07.00 - 17.00',
                '08.00 - 16.00',
                '06.00 - 18.00',
                '08.00 - 17.00',
            ]),
        ];
    }
}
