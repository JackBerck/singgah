<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Media>
 */
class MediaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'file_path' => 'images/placeholder/' . fake()->uuid() . '.jpg',
            'disk'      => 'public',
            'type'      => 'image',
            'alt_text'  => fake()->sentence(4),
            'order'     => 0,
        ];
    }

    public function video(): static
    {
        return $this->state(fn(array $attributes) => [
            'file_path' => 'videos/placeholder/' . fake()->uuid() . '.mp4',
            'type'      => 'video',
        ]);
    }
}
