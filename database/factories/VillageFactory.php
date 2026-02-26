<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Village>
 */
class VillageFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->randomElement([
            'Desa Wisata Nglanggeran',
            'Desa Adat Panglipuran',
            'Desa Sade',
            'Desa Wae Rebo',
            'Desa Dieng Kulon',
            'Desa Trunyan',
            'Desa Kemiren',
            'Desa Candirejo',
            'Desa Pentingsari',
            'Desa Ubud',
        ]);

        return [
            'manager_id'        => User::factory()->manager(),
            'name'              => $name,
            'slug'              => Str::slug($name) . '-' . fake()->unique()->numberBetween(1, 999),
            'short_description' => fake()->sentence(12),
            'description'       => fake()->paragraphs(4, true),
            'address'           => fake()->address(),
            'latitude'          => fake()->latitude(-8.5, -7.0),
            'longitude'         => fake()->longitude(108.0, 115.5),
            'map_url'           => 'https://maps.google.com/?q=' . fake()->latitude(-8.5, -7.0) . ',' . fake()->longitude(108.0, 115.5),
            'status'            => 'pending',
            'is_featured'       => false,
            'rejected_reason'   => null,
        ];
    }

    public function verified(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'verified',
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn(array $attributes) => [
            'status'      => 'verified',
            'is_featured' => true,
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn(array $attributes) => [
            'status'          => 'rejected',
            'rejected_reason' => fake()->sentence(),
        ]);
    }
}
