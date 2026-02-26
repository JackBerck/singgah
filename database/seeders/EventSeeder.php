<?php

namespace Database\Seeders;

use App\Models\Village;
use App\Models\VillageEvent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EventSeeder extends Seeder
{
    private array $eventsData = [
        'desa-adat-penglipuran' => [
            [
                'name'         => 'Festival Desa Adat Penglipuran',
                'description'  => '<p>Festival tahunan yang menampilkan seluruh kekayaan budaya Desa Adat Penglipuran. Mulai dari pertunjukan tari tradisional Bali, lomba merangkai canang sari, hingga pameran kerajinan bambu khas desa.</p><p>Acara ini terbuka untuk umum dan menjadi ajang promosi budaya desa kepada wisatawan domestik maupun mancanegara. Selama festival berlangsung, seluruh jalan desa dihias dengan ornamen tradisional Bali yang indah.</p>',
                'location'     => 'Balai Desa Adat Penglipuran',
                'days_from_now' => 30,
                'contact'      => '081234000001',
                'is_featured'  => true,
            ],
            [
                'name'         => 'Upacara Ngusaba Desa Penglipuran',
                'description'  => '<p>Upacara adat tahunan yang dilaksanakan sebagai bentuk rasa syukur atas hasil panen dan keselamatan desa. Seluruh warga desa berpartisipasi dalam prosesi upacara yang berlangsung di Pura Penataran Agung Penglipuran.</p><p>Wisatawan dipersilakan menyaksikan upacara dari jarak yang telah ditentukan dan diwajibkan mengenakan kain untuk memasuki area pura.</p>',
                'location'     => 'Pura Penataran Agung Penglipuran',
                'days_from_now' => 90,
                'contact'      => '081234000001',
                'is_featured'  => false,
            ],
        ],
        'desa-sade' => [
            [
                'name'         => 'Pameran Tenun Ikat Sasak',
                'description'  => '<p>Pameran dan bursa tenun ikat khas suku Sasak yang menampilkan ratusan motif kain tenun tradisional. Para pengunjung dapat menyaksikan langsung proses pembuatan tenun menggunakan alat tradisional yang masih dipertahankan hingga kini.</p><p>Tersedia kelas workshop singkat untuk wisatawan yang ingin mencoba menenun sendiri dengan bimbingan pengrajin berpengalaman.</p>',
                'location'     => 'Balai Komunitas Desa Sade',
                'days_from_now' => 45,
                'contact'      => '081234000002',
                'is_featured'  => true,
            ],
            [
                'name'         => 'Perayaan Lebaran Topat Desa Sade',
                'description'  => '<p>Tradisi unik suku Sasak yang dirayakan satu minggu setelah Idul Fitri. Seluruh warga membawa ketupat dan lauk pauk untuk bersama-sama makan di area terbuka. Suasana kebersamaan dan kekeluargaan begitu terasa dalam perayaan ini.</p>',
                'location'     => 'Lapangan Desa Sade',
                'days_from_now' => 120,
                'contact'      => '081234000002',
                'is_featured'  => false,
            ],
        ],
        'desa-wae-rebo' => [
            [
                'name'         => 'Ritual Penti (Tahun Baru Wae Rebo)',
                'description'  => '<p>Ritual Penti adalah upacara syukuran akhir tahun tradisional masyarakat Wae Rebo yang dilaksanakan setelah masa panen. Seluruh warga berkumpul di dalam Mbaru Niang utama untuk berdoa bersama, makan bersama, dan mengucap syukur kepada leluhur atas hasil bumi yang melimpah.</p><p>Ini adalah salah satu ritual paling sakral di Wae Rebo yang biasanya tidak boleh disaksikan oleh orang luar selain tamu undangan. Namun, pihak desa kadang membuka kesempatan bagi wisatawan khusus untuk menyaksikannya dari kejauhan.</p>',
                'location'     => 'Mbaru Niang Utama, Desa Wae Rebo',
                'days_from_now' => 60,
                'contact'      => '081234000003',
                'is_featured'  => true,
            ],
        ],
        'desa-wisata-dieng-kulon' => [
            [
                'name'         => 'Dieng Culture Festival (DCF)',
                'description'  => '<p>Festival budaya terbesar di Dataran Tinggi Dieng yang menampilkan puncak acara berupa ritual Pemotongan Rambut Gimbal anak-anak Dieng. Festival ini juga menampilkan pertunjukan wayang kulit, jazz di atas awan, dan berbagai pertunjukan seni budaya lokal.</p><p>DCF telah menjadi salah satu festival pariwisata paling populer di Indonesia dan menarik ribuan wisatawan dari seluruh nusantara bahkan mancanegara setiap tahunnya.</p>',
                'location'     => 'Kompleks Candi Arjuna, Dieng',
                'days_from_now' => 75,
                'contact'      => '081234000004',
                'is_featured'  => true,
            ],
            [
                'name'         => 'Pasar Malam Agrowisata Dieng',
                'description'  => '<p>Pasar malam yang menampilkan berbagai produk agrowisata Dieng, mulai dari kentang, carica, purwaceng, hingga berbagai produk olahan khas dataran tinggi Dieng. Dilengkapi dengan hiburan live musik tradisional dan kuliner khas Wonosobo.</p>',
                'location'     => 'Alun-alun Dieng Kulon',
                'days_from_now' => 15,
                'contact'      => '081234000004',
                'is_featured'  => false,
            ],
        ],
        'desa-trunyan' => [
            [
                'name'         => 'Odalan Pura Pancering Jagat',
                'description'  => '<p>Upacara odalan (hari jadi pura) yang dilaksanakan setiap 210 hari sekali berdasarkan kalender Bali Pawukon. Upacara ini adalah yang paling sakral dan meriah di Desa Trunyan, melibatkan seluruh warga dan berlangsung selama beberapa hari.</p><p>Wisatawan yang tertarik dapat menyaksikan rangkaian upacara dari luar area pura dengan mengenakan pakaian yang sopan dan selendang.</p>',
                'location'     => 'Pura Pancering Jagat, Trunyan',
                'days_from_now' => 105,
                'contact'      => '081234000005',
                'is_featured'  => true,
            ],
        ],
    ];

    public function run(): void
    {
        $villages = Village::where('status', 'verified')->get()->keyBy('slug');

        foreach ($this->eventsData as $slug => $events) {
            $village = $villages->get($slug);
            if (! $village) {
                continue;
            }

            foreach ($events as $data) {
                $eventDate = now()->addDays($data['days_from_now']);

                $event = VillageEvent::create([
                    'village_id'   => $village->id,
                    'name'         => $data['name'],
                    'slug'         => Str::slug($data['name']),
                    'description'  => $data['description'],
                    'location'     => $data['location'],
                    'event_date'   => $eventDate,
                    'end_date'     => $eventDate->copy()->addDays(fake()->numberBetween(1, 3)),
                    'contact_info' => $data['contact'],
                    'is_featured'  => $data['is_featured'],
                ]);

                // 1 banner image per event
                $event->media()->create([
                    'file_path' => "images/events/{$event->id}/banner.jpg",
                    'disk'      => 'public',
                    'type'      => 'image',
                    'alt_text'  => "Banner - {$event->name}",
                    'order'     => 1,
                ]);
            }
        }
    }
}
