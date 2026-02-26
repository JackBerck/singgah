<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,   // Users: 1 admin + 6 managers + 15 visitors
            VillageSeeder::class, // 6 villages (5 verified, 1 pending) + media + reviews
            EntitySeeder::class,  // Attractions, culinaries, accommodations per village + media + reviews
            EventSeeder::class,   // Events per village + media
        ]);
    }
}
