<?php

namespace Database\Factories;

use App\Models\Village;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VillageEvent>
 */
class VillageEventFactory extends Factory
{
    public function definition(): array
    {
        $eventNames = [
            'Festival Kopi Nusantara',
            'Upacara Adat Ngaben',
            'Pesta Panen Raya',
            'Festival Budaya Desa',
            'Pasar Malam Tradisional',
            'Lomba Tari Tradisional',
            'Festival Lampion Desa',
            'Karnaval Budaya Lokal',
            'Pameran Kerajinan UMKM',
            'Malam Seni & Budaya',
        ];

        $name      = fake()->randomElement($eventNames);
        $eventDate = fake()->dateTimeBetween('now', '+6 months');

        return [
            'village_id'   => Village::factory()->verified(),
            'name'         => $name,
            'slug'         => Str::slug($name) . '-' . fake()->unique()->numberBetween(1, 9999),
            'description'  => '<p>' . implode('</p><p>', fake()->paragraphs(3)) . '</p>',
            'location'     => 'Lapangan Utama Desa',
            'event_date'   => $eventDate,
            'end_date'     => fake()->optional(0.6)->dateTimeBetween($eventDate, '+3 days'),
            'contact_info' => fake()->numerify('08##########'),
            'is_featured'  => fake()->boolean(20),
        ];
    }
}
