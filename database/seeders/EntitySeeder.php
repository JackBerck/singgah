<?php

namespace Database\Seeders;

use App\Models\Accommodation;
use App\Models\Attraction;
use App\Models\Culinary;
use App\Models\User;
use App\Models\Village;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EntitySeeder extends Seeder
{
    public function run(): void
    {
        $visitors   = User::where('role', 'user')->get();
        $villages   = Village::where('status', 'verified')->get();

        // ─── Attractions data per village ─────────────────────────────────────────
        $attractionsData = [
            'desa-adat-penglipuran' => [
                ['name' => 'Kawasan Adat Penglipuran',    'price_min' => 15000, 'price_max' => 30000, 'hours' => '07.00 - 18.00', 'location' => 'Pusat Desa Penglipuran'],
                ['name' => 'Hutan Bambu Penglipuran',     'price_min' => 10000, 'price_max' => 20000, 'hours' => '07.00 - 17.00', 'location' => 'Belakang Desa Penglipuran'],
                ['name' => 'Pura Penataran Agung',        'price_min' => 0,     'price_max' => 0,     'hours' => '08.00 - 17.00', 'location' => 'Atas Desa Penglipuran'],
                ['name' => 'Taman Bunga Desa',            'price_min' => 5000,  'price_max' => 10000, 'hours' => '07.00 - 17.00', 'location' => 'Selatan Desa Penglipuran'],
            ],
            'desa-sade' => [
                ['name' => 'Desa Adat Suku Sasak Sade',   'price_min' => 10000, 'price_max' => 25000, 'hours' => '08.00 - 17.00', 'location' => 'Pusat Desa Sade'],
                ['name' => 'Workshop Tenun Ikat Sasak',   'price_min' => 0,     'price_max' => 0,     'hours' => '08.00 - 16.00', 'location' => 'Rumah Adat Desa Sade'],
                ['name' => 'Lumbung Padi Tradisional',    'price_min' => 5000,  'price_max' => 10000, 'hours' => '08.00 - 17.00', 'location' => 'Barat Desa Sade'],
            ],
            'desa-wae-rebo' => [
                ['name' => 'Rumah Adat Mbaru Niang',      'price_min' => 50000, 'price_max' => 100000, 'hours' => 'Sepanjang hari', 'location' => 'Puncak Pegunungan Manggarai'],
                ['name' => 'Trekking Hutan Manggarai',    'price_min' => 100000, 'price_max' => 200000, 'hours' => '06.00 - 15.00', 'location' => 'Mulai Desa Denge'],
                ['name' => 'Puncak Panorama Wae Rebo',    'price_min' => 25000,  'price_max' => 50000, 'hours' => '06.00 - 09.00', 'location' => 'Puncak Desa Wae Rebo'],
            ],
            'desa-wisata-dieng-kulon' => [
                ['name' => 'Telaga Warna Dieng',          'price_min' => 15000, 'price_max' => 30000, 'hours' => '07.00 - 17.00', 'location' => 'Kawasan Dieng'],
                ['name' => 'Komplek Candi Arjuna',        'price_min' => 20000, 'price_max' => 40000, 'hours' => '07.00 - 17.00', 'location' => 'Dieng Kulon'],
                ['name' => 'Kawah Sikidang',              'price_min' => 15000, 'price_max' => 30000, 'hours' => '06.00 - 17.00', 'location' => 'Dieng'],
                ['name' => 'Bukit Sikunir (Sunrise)',     'price_min' => 10000, 'price_max' => 20000, 'hours' => '03.00 - 07.00', 'location' => 'Sembungan, Dieng'],
                ['name' => 'Sumur Jalatunda',             'price_min' => 10000, 'price_max' => 15000, 'hours' => '08.00 - 17.00', 'location' => 'Dieng'],
            ],
            'desa-trunyan' => [
                ['name' => 'Pemakaman Trunyan (Sema)',    'price_min' => 0,     'price_max' => 0,     'hours' => '08.00 - 17.00', 'location' => 'Tepi Danau Batur, Trunyan'],
                ['name' => 'Pura Pancering Jagat',        'price_min' => 0,     'price_max' => 0,     'hours' => '09.00 - 17.00', 'location' => 'Desa Trunyan'],
                ['name' => 'Wisata Perahu Danau Batur',   'price_min' => 50000, 'price_max' => 150000, 'hours' => '07.00 - 17.00', 'location' => 'Dermaga Kedisan'],
            ],
        ];

        // ─── Culinaries data per village ──────────────────────────────────────────
        $culinarysData = [
            'desa-adat-penglipuran' => [
                ['name' => 'Loloh Cemcem',                'price_min' => 5000,  'price_max' => 15000,  'location' => 'Warung depan gapura desa'],
                ['name' => 'Tipat Cantok',                'price_min' => 10000, 'price_max' => 20000,  'location' => 'Warung Bu Ketut'],
                ['name' => 'Jaje Bali (Kue Tradisional)', 'price_min' => 5000,  'price_max' => 25000,  'location' => 'Rumah pengrajin kue Desa'],
                ['name' => 'Arak Bali & Tuak Lokal',      'price_min' => 15000, 'price_max' => 50000,  'location' => 'Warung adat Penglipuran'],
                ['name' => 'Kerajinan Bambu Penglipuran', 'price_min' => 20000, 'price_max' => 500000, 'location' => 'Sepanjang jalan utama desa'],
            ],
            'desa-sade' => [
                ['name' => 'Ayam Taliwang',               'price_min' => 25000, 'price_max' => 50000,  'location' => 'Warung makan depan desa'],
                ['name' => 'Plecing Kangkung Lombok',      'price_min' => 10000, 'price_max' => 20000,  'location' => 'Warung Bu Inaq Sade'],
                ['name' => 'Tenun Ikat Sasak',            'price_min' => 100000, 'price_max' => 1500000, 'location' => 'Workshop tenun Desa Sade'],
                ['name' => 'Kerupuk Rambak Khas Lombok',  'price_min' => 10000, 'price_max' => 30000,  'location' => 'Kios oleh-oleh pintu masuk'],
                ['name' => 'Dodol Nangka Lombok',         'price_min' => 15000, 'price_max' => 50000,  'location' => 'Warung oleh-oleh Desa Sade'],
            ],
            'desa-wae-rebo' => [
                ['name' => 'Kopi Flores Arabika',         'price_min' => 10000, 'price_max' => 250000, 'location' => 'Pos trekking Denge'],
                ['name' => 'Makan Tradisional Wae Rebo',  'price_min' => 25000, 'price_max' => 50000,  'location' => 'Dalam Mbaru Niang'],
                ['name' => 'Moke (Arak Flores)',          'price_min' => 25000, 'price_max' => 75000,  'location' => 'Warung lokal Denge'],
            ],
            'desa-wisata-dieng-kulon' => [
                ['name' => 'Carica (Pepaya Dieng)',       'price_min' => 15000, 'price_max' => 50000,  'location' => 'Toko oleh-oleh jalan utama'],
                ['name' => 'Tempe Kemul Khas Dieng',      'price_min' => 5000,  'price_max' => 15000,  'location' => 'Warung makan depan Candi'],
                ['name' => 'Mie Ongklok',                 'price_min' => 15000, 'price_max' => 25000,  'location' => 'Warung Pak Slamet Dieng'],
                ['name' => 'Kentang Goreng Dieng',        'price_min' => 10000, 'price_max' => 20000,  'location' => 'Warung sekitar Telaga Warna'],
                ['name' => 'Keripik Kentang Dieng',       'price_min' => 15000, 'price_max' => 40000,  'location' => 'Toko oleh-oleh Dieng Kulon'],
                ['name' => 'Purwaceng (Jamu Stamina)',    'price_min' => 15000, 'price_max' => 30000,  'location' => 'Apotek Jamu Dieng'],
            ],
            'desa-trunyan' => [
                ['name' => 'Babi Guling Trunyan',         'price_min' => 30000, 'price_max' => 75000,  'location' => 'Warung Bu Desak Trunyan'],
                ['name' => 'Jukut Nangka (Sayur Khas)',  'price_min' => 15000, 'price_max' => 25000,  'location' => 'Warung adat Trunyan'],
                ['name' => 'Ukiran Kayu Khas Trunyan',   'price_min' => 50000, 'price_max' => 500000, 'location' => 'Pengrajin desa Trunyan'],
            ],
        ];

        // ─── Accommodations data per village ──────────────────────────────────────
        $accommodationsData = [
            'desa-adat-penglipuran' => [
                ['name' => 'Homestay Adat Penglipuran',   'price_min' => 250000, 'price_max' => 450000, 'hours' => 'Check-in: 14.00 | Check-out: 12.00'],
                ['name' => 'Villa Bambu Penglipuran',     'price_min' => 450000, 'price_max' => 750000, 'hours' => 'Check-in: 14.00 | Check-out: 11.00'],
                ['name' => 'Bungalow Tepi Sawah Bangli',  'price_min' => 350000, 'price_max' => 600000, 'hours' => 'Check-in: 13.00 | Check-out: 12.00'],
            ],
            'desa-sade' => [
                ['name' => 'Homestay Tradisional Sasak',  'price_min' => 150000, 'price_max' => 300000, 'hours' => 'Check-in: 13.00 | Check-out: 11.00'],
                ['name' => 'Losmen Amaq Senin\'25',       'price_min' => 200000, 'price_max' => 350000, 'hours' => 'Check-in: 14.00 | Check-out: 12.00'],
            ],
            'desa-wae-rebo' => [
                ['name' => 'Menginap di Mbaru Niang',     'price_min' => 250000, 'price_max' => 350000, 'hours' => 'Check-in: 15.00 | Check-out: 08.00'],
            ],
            'desa-wisata-dieng-kulon' => [
                ['name' => 'Homestay Bu Endang Dieng',    'price_min' => 150000, 'price_max' => 250000, 'hours' => 'Check-in: 13.00 | Check-out: 11.00'],
                ['name' => 'Penginapan Panorama Dieng',   'price_min' => 250000, 'price_max' => 450000, 'hours' => 'Check-in: 14.00 | Check-out: 12.00'],
                ['name' => 'Villa Dieng Sunrise',         'price_min' => 400000, 'price_max' => 700000, 'hours' => 'Check-in: 14.00 | Check-out: 11.00'],
                ['name' => 'Guest House Kaki Gunung',     'price_min' => 200000, 'price_max' => 350000, 'hours' => 'Check-in: 13.00 | Check-out: 12.00'],
            ],
            'desa-trunyan' => [
                ['name' => 'Pondok Wisata Trunyan',       'price_min' => 150000, 'price_max' => 250000, 'hours' => 'Check-in: 14.00 | Check-out: 11.00'],
                ['name' => 'Homestay Tepi Danau Batur',   'price_min' => 200000, 'price_max' => 350000, 'hours' => 'Check-in: 13.00 | Check-out: 12.00'],
            ],
        ];

        foreach ($villages as $village) {
            $slug = $village->slug;

            // ─── Attractions ──────────────────────────────────────────────────────
            $attractionList = $attractionsData[$slug] ?? [];
            foreach ($attractionList as $idx => $data) {
                $rawHours = $data['hours'] ?? '';
                $openTime = '08:00';
                $closeTime = '17:00';
                
                if (strtolower($rawHours) === 'sepanjang hari') {
                    $openTime = '00:00';
                    $closeTime = '23:59';
                } elseif (str_contains($rawHours, ' - ')) {
                    $parts = explode(' - ', $rawHours);
                    $openTime = str_replace('.', ':', trim($parts[0]));
                    $closeTime = str_replace('.', ':', trim($parts[1]));
                }

                $attraction = Attraction::create([
                    'village_id'      => $village->id,
                    'name'            => $data['name'],
                    'slug'            => Str::slug($data['name']),
                    'description'     => '<p>' . fake()->paragraph(4) . '</p><p>' . fake()->paragraph(3) . '</p>',
                    'price_min'       => $data['price_min'],
                    'price_max'       => $data['price_max'],
                    'location'        => $data['location'],
                    'map_url'         => 'https://maps.google.com/?q=' . urlencode($data['name'] . ', ' . $village->name),
                    'contact_info'    => fake()->numerify('08##########'),
                    'open_time'       => $openTime,
                    'close_time'      => $closeTime,
                ]);

                // Media: 2 gambar per attraction
                for ($i = 1; $i <= 2; $i++) {
                    $attraction->media()->create([
                        'file_path' => "attractions/{$attraction->id}/photo-{$i}.jpg",
                        'disk'      => 'public',
                        'type'      => 'image',
                        'alt_text'  => "Foto {$i} - {$attraction->name}",
                        'order'     => $i,
                    ]);
                }

                // Reviews: 4-7 per attraction
                if ($visitors->isNotEmpty()) {
                    $count = fake()->numberBetween(4, 7);
                    $raters = $visitors->random(min($count, $visitors->count()));
                    foreach ($raters as $visitor) {
                        $attraction->reviews()->create([
                            'user_id'    => $visitor->id,
                            'rating'     => fake()->numberBetween(3, 5),
                            'comment'    => fake()->randomElement([
                                'Tempat wisata yang luar biasa indah!',
                                'Sangat recommended untuk dikunjungi bersama keluarga.',
                                'Pengalaman yang tidak terlupakan, pasti akan kembali.',
                                'Indah sekali, sayang aksesnya agak susah.',
                                'Fasilitasnya perlu ditambah, tapi tempatnya bagus.',
                                'Harga tiket sangat terjangkau untuk pemandangan seindah ini.',
                                'Spot foto terbaik yang pernah saya kunjungi!',
                            ]),
                            'is_visible' => true,
                        ]);
                    }
                }
            }

            // ─── Culinaries ───────────────────────────────────────────────────────
            $culinaryList = $culinarysData[$slug] ?? [];
            foreach ($culinaryList as $data) {
                $culinary = Culinary::create([
                    'village_id'   => $village->id,
                    'name'         => $data['name'],
                    'slug'         => Str::slug($data['name']),
                    'description'  => '<p>' . fake()->paragraph(3) . '</p><p>' . fake()->paragraph(2) . '</p>',
                    'price_min'    => $data['price_min'],
                    'price_max'    => $data['price_max'],
                    'location'     => $data['location'],
                    'map_url'      => 'https://maps.google.com/?q=' . urlencode($data['name'] . ', ' . $village->name),
                    'contact_info' => fake()->numerify('08##########'),
                    'open_time'    => '09:00',
                    'close_time'   => '21:00',
                ]);

                // Media: 2 gambar per culinary
                for ($i = 1; $i <= 2; $i++) {
                    $culinary->media()->create([
                        'file_path' => "culinaries/{$culinary->id}/photo-{$i}.jpg",
                        'disk'      => 'public',
                        'type'      => 'image',
                        'alt_text'  => "Foto {$i} - {$culinary->name}",
                        'order'     => $i,
                    ]);
                }

                // Reviews: 3-5 per culinary
                if ($visitors->isNotEmpty()) {
                    $count = fake()->numberBetween(3, 5);
                    $raters = $visitors->random(min($count, $visitors->count()));
                    foreach ($raters as $visitor) {
                        $culinary->reviews()->create([
                            'user_id'    => $visitor->id,
                            'rating'     => fake()->numberBetween(3, 5),
                            'comment'    => fake()->randomElement([
                                'Rasanya autentik dan lezat, khas daerah sini!',
                                'Harga terjangkau, porsi banyak, puas sekali.',
                                'Produk UMKM yang berkualitas, layak mendapat dukungan.',
                                'Unik dan berbeda dari yang biasa. Sangat suka!',
                                'Kerajinannya sangat halus dan bernilai tinggi.',
                                'Makanannya enak, tapi tempatnya perlu lebih nyaman.',
                            ]),
                            'is_visible' => true,
                        ]);
                    }
                }
            }

            // ─── Accommodations ───────────────────────────────────────────────────
            $accommodationList = $accommodationsData[$slug] ?? [];
            foreach ($accommodationList as $data) {
                $accommodation = Accommodation::create([
                    'village_id'      => $village->id,
                    'name'            => $data['name'],
                    'slug'            => Str::slug($data['name']),
                    'description'     => '<p>' . fake()->paragraph(3) . '</p><p>' . fake()->paragraph(2) . '</p>',
                    'price_min'       => $data['price_min'],
                    'price_max'       => $data['price_max'],
                    'location'        => 'Dalam kawasan desa wisata',
                    'map_url'         => 'https://maps.google.com/?q=' . urlencode($data['name'] . ', ' . $village->name),
                    'contact_info'    => fake()->numerify('08##########'),
                    'open_time'       => '14:00',
                    'close_time'      => '12:00',
                ]);

                // Media: 1 gambar per accommodation
                for ($i = 1; $i <= 1; $i++) {
                    $accommodation->media()->create([
                        'file_path' => "accommodations/{$accommodation->id}/photo-{$i}.jpg",
                        'disk'      => 'public',
                        'type'      => 'image',
                        'alt_text'  => "Foto {$i} - {$accommodation->name}",
                        'order'     => $i,
                    ]);
                }

                // Reviews: 3-5 per accommodation
                if ($visitors->isNotEmpty()) {
                    $count = fake()->numberBetween(3, 5);
                    $raters = $visitors->random(min($count, $visitors->count()));
                    foreach ($raters as $visitor) {
                        $accommodation->reviews()->create([
                            'user_id'    => $visitor->id,
                            'rating'     => fake()->numberBetween(3, 5),
                            'comment'    => fake()->randomElement([
                                'Penginapan yang bersih dan nyaman, tidur sangat nyenyak.',
                                'Suasana yang tenang dan alami, sangat cocok untuk relaksasi.',
                                'Pemiliknya ramah dan membantu, memberikan banyak informasi lokal.',
                                'Harga sangat worth it untuk fasilitas yang diberikan.',
                                'Pemandangan dari kamar sangat indah, langsung ke alam terbuka.',
                                'Sarapan yang disediakan enak, makanan rumahan yang lezat.',
                                'Kurang sedikit di bagian wifi, tapi secara keseluruhan memuaskan.',
                            ]),
                            'is_visible' => true,
                        ]);
                    }
                }
            }
        }
    }
}
