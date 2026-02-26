<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    public function definition(): array
    {
        $comments = [
            'Tempat yang sangat indah dan bersih! Sangat direkomendasikan.',
            'Pengalaman yang luar biasa, pasti akan kembali lagi.',
            'Makanannya enak dan harganya terjangkau. Pelayanan ramah.',
            'Pemandangannya menakjubkan, udara segar dan sejuk.',
            'Sangat menyenangkan! Anak-anak senang sekali di sini.',
            'Tempat yang unik dan autentik, mencerminkan budaya lokal.',
            'Harganya sesuai dengan fasilitas yang diberikan.',
            'Akses jalan masih agak sulit, tapi sepadan dengan keindahannya.',
            'Sangat cocok untuk wisata keluarga. Fasilitas cukup lengkap.',
            'Pengelolanya ramah dan informatif tentang budaya desa.',
            'Produk UMKM-nya berkualitas tinggi dan harga bersahabat.',
            'Kalau weekend agak ramai, tapi tetap menyenangkan.',
            'Penginapannya bersih dan nyaman, tidur nyenyak di sini.',
            'Makanan lokal yang autentik, tidak ada di tempat lain!',
            'Sunset di sini luar biasa, wajib dikunjungi!',
        ];

        return [
            'user_id'    => User::factory(),
            'rating'     => fake()->numberBetween(3, 5),
            'comment'    => fake()->randomElement($comments),
            'is_visible' => true,
        ];
    }
}
