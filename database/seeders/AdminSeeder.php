<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Super Admin ─────────────────────────────────────────────────────────
        User::create([
            'name'              => 'Super Admin Singgah',
            'email'             => 'admin@singgah.id',
            'email_verified_at' => now(),
            'password'          => Hash::make('password'),
            'role'              => 'admin',
            'phone'             => '081234567890',
            'address'           => 'Jl. Sudirman No. 1, Jakarta Pusat',
            'avatar'            => null,
        ]);

        // ─── Village Managers (akan digunakan oleh VillageSeeder) ─────────────────
        $managers = [
            ['name' => 'Ketut Wiyasa', 'email' => 'manager.penglipuran@singgah.id', 'phone' => '081234000001'],
            ['name' => 'Amaq Senin',   'email' => 'manager.sade@singgah.id',        'phone' => '081234000002'],
            ['name' => 'Martinus Reo', 'email' => 'manager.waerebo@singgah.id',     'phone' => '081234000003'],
            ['name' => 'Pak Harjo',    'email' => 'manager.dieng@singgah.id',       'phone' => '081234000004'],
            ['name' => 'Wayan Suarka', 'email' => 'manager.trunyan@singgah.id',     'phone' => '081234000005'],
            ['name' => 'Pak Hasyim',   'email' => 'manager.kemiren@singgah.id',     'phone' => '081234000006'],
        ];

        foreach ($managers as $manager) {
            User::create([
                'name'              => $manager['name'],
                'email'             => $manager['email'],
                'email_verified_at' => now(),
                'password'          => Hash::make('password'),
                'role'              => 'manager',
                'phone'             => $manager['phone'],
                'address'           => 'Desa, Indonesia',
                'avatar'            => null,
            ]);
        }

        // ─── Regular Visitors (dummy) ─────────────────────────────────────────────
        User::factory()->count(15)->create(['role' => 'user']);
    }
}
