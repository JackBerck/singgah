<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Village;
use Illuminate\Database\Seeder;

class VillageSeeder extends Seeder
{
    /** Data desa wisata realistis Indonesia */
    private array $villages = [
        [
            'name'              => 'Desa Adat Penglipuran',
            'slug'              => 'desa-adat-penglipuran',
            'short_description' => 'Desa adat terbersih di dunia terletak di Bangli, Bali, dengan arsitektur tradisional yang terjaga.',
            'description'       => '<p>Desa Adat Penglipuran adalah salah satu desa tradisional Bali yang terkenal sebagai salah satu desa terbersih di dunia. Terletak di Kabupaten Bangli, desa ini mempertahankan tata ruang dan arsitektur tradisional Bali secara konsisten sejak ratusan tahun lalu.</p><p>Setiap rumah di Penglipuran memiliki pintu gerbang (angkul-angkul) yang seragam, menciptakan pemandangan yang sangat estetis dan harmonis. Hutan bambu yang lebat di belakang desa menjadi penyangga ekosistem yang dijaga ketat oleh masyarakat adat setempat.</p><p>Pengunjung dapat menikmati suasana pedesaan Bali yang autentik, mempelajari adat istiadat lokal, serta mencicipi kuliner khas seperti loloh cemcem dan minuman tradisional lainnya.</p><p>Desa ini juga aktif menyelenggarakan berbagai kegiatan budaya dan upacara adat yang berkaitan dengan siklus pertanian dan kepercayaan Hindu Bali.</p>',
            'address'           => 'Jl. Penglipuran, Desa Kubu, Kec. Bangli, Kab. Bangli, Bali 80613',
            'latitude'          => -8.4109,
            'longitude'         => 115.3590,
            'map_url'           => 'https://maps.google.com/?q=-8.4109,115.3590',
            'status'            => 'verified',
            'is_featured'       => true,
            'manager_email'     => 'manager.penglipuran@singgah.id',
            'category'          => 'budaya_tradisi',
        ],
        [
            'name'              => 'Desa Sade',
            'slug'              => 'desa-sade',
            'short_description' => 'Desa tradisional suku Sasak di Lombok dengan rumah beratap ilalang dan ritual adat yang masih terjaga.',
            'description'       => '<p>Desa Sade adalah desa adat suku Sasak yang terletak di Kecamatan Pujut, Kabupaten Lombok Tengah, Nusa Tenggara Barat. Desa ini merupakan salah satu dari sedikit desa yang masih mempertahankan kehidupan tradisional suku Sasak secara autentik.</p><p>Rumah-rumah di Desa Sade memiliki ciri khas berupa lantai yang dipel menggunakan kotoran kerbau yang digunakan secara tradisional karena dipercaya memiliki khasiat tertentu dan membuat lantai mengeras. Atap rumah terbuat dari ilalang yang diganti setiap beberapa tahun sekali.</p><p>Pengunjung dapat menyaksikan langsung proses pembuatan kain tenun ikat Sasak, salah satu warisan budaya yang masih dilestarikan oleh para ibu dan perempuan di desa ini. Motif-motif tenun Sasak memiliki nilai filosofis yang dalam.</p><p>Ritual adat dan perkawinan tradisional Sasak juga masih dilaksanakan, menjadikan Desa Sade destinasi budaya yang sangat berharga bagi wisatawan yang ingin memahami kebudayaan Lombok lebih dalam.</p>',
            'address'           => 'Desa Rembitan, Kec. Pujut, Kab. Lombok Tengah, NTB 83573',
            'latitude'          => -8.8667,
            'longitude'         => 116.2333,
            'map_url'           => 'https://maps.google.com/?q=-8.8667,116.2333',
            'status'            => 'verified',
            'is_featured'       => true,
            'manager_email'     => 'manager.sade@singgah.id',
            'category'          => 'budaya_tradisi',
        ],
        [
            'name'              => 'Desa Wae Rebo',
            'slug'              => 'desa-wae-rebo',
            'short_description' => 'Desa adat terpencil di atas pegunungan Manggarai, NTT, dengan rumah adat Mbaru Niang berbentuk kerucut.',
            'description'       => '<p>Desa Wae Rebo adalah sebuah desa adat yang tersembunyi di dalam hutan pegunungan Manggarai, Flores, Nusa Tenggara Timur. Terletak di ketinggian sekitar 1.200 meter di atas permukaan laut, desa ini hanya bisa dicapai dengan trekking selama 3-4 jam dari Desa Denge.</p><p>Keunikan utama Wae Rebo adalah tujuh rumah adat Mbaru Niang yang berbentuk kerucut menjulang setinggi sekitar 15 meter. Semua rumah ini dibangun menggunakan material alami dari hutan sekitar dan dipertahankan sesuai dengan aturan adat yang ketat.</p><p>UNESCO memberikan penghargaan kepada Wae Rebo atas keberhasilan masyarakat setempat dalam merevitalisasi dan mempertahankan arsitektur tradisional mereka. Ini menjadikan Wae Rebo sebagai contoh sukses pelestarian warisan budaya tingkat dunia.</p><p>Pengunjung yang menginap di Wae Rebo akan mendapatkan pengalaman hidup bersama masyarakat adat, menikmati masakan tradisional, dan menyaksikan ritual-ritual adat yang masih dijaga dengan penuh kekhusyukan.</p>',
            'address'           => 'Desa Satar Lenda, Kec. Satar Mese Barat, Kab. Manggarai, NTT 86562',
            'latitude'          => -8.6833,
            'longitude'         => 120.3667,
            'map_url'           => 'https://maps.google.com/?q=-8.6833,120.3667',
            'status'            => 'verified',
            'is_featured'       => false,
            'manager_email'     => 'manager.waerebo@singgah.id',
            'category'          => 'budaya_tradisi',
        ],
        [
            'name'              => 'Desa Wisata Dieng Kulon',
            'slug'              => 'desa-wisata-dieng-kulon',
            'short_description' => 'Desa di dataran tinggi Dieng yang menawarkan keindahan alam pegunungan, candi Hindu kuno, dan fenomena alam unik.',
            'description'       => '<p>Desa Wisata Dieng Kulon berada di kawasan Dataran Tinggi Dieng, Kabupaten Wonosobo, Jawa Tengah, pada ketinggian sekitar 2.093 meter di atas permukaan laut. Kawasan ini dikenal sebagai "Negeri di Atas Awan" karena pemandangan awan yang sering menyelimuti lembah dan gunung di sekitarnya.</p><p>Dataran Tinggi Dieng merupakan kawasan vulkanik aktif yang menyimpan berbagai keajaiban alam sekaligus peninggalan sejarah yang luar biasa. Kompleks candi Hindu dari Abad ke-7 hingga ke-9 Masehi menjadi salah satu daya tarik arkeologi terpenting di Jawa.</p><p>Fenomena alam yang paling terkenal adalah kawah-kawah aktif seperti Kawah Sikidang dan Kawah Candradimuka, serta Telaga Warna yang memiliki warna air yang berubah-ubah karena kandungan belerang dan mineral tertentu.</p><p>Ritual Pemotongan Rambut Gimbal anak-anak Dieng adalah tradisi unik yang menarik ribuan wisatawan setiap tahunnya. Anak-anak berambut gimbal (rambut yang tumbuh menggumpal secara alami) dipercaya memiliki kekuatan spiritual khusus dan pemotongan rambutnya dilakukan dalam upacara adat yang meriah.</p>',
            'address'           => 'Desa Dieng Kulon, Kec. Batur, Kab. Banjarnegara, Jawa Tengah 53456',
            'latitude'          => -7.2097,
            'longitude'         => 109.9175,
            'map_url'           => 'https://maps.google.com/?q=-7.2097,109.9175',
            'status'            => 'verified',
            'is_featured'       => true,
            'manager_email'     => 'manager.dieng@singgah.id',
            'category'          => 'budaya_tradisi',
        ],
        [
            'name'              => 'Desa Trunyan',
            'slug'              => 'desa-trunyan',
            'short_description' => 'Desa kuno di tepi Danau Batur, Bali, terkenal dengan tradisi pemakaman unik di bawah pohon Taru Menyan.',
            'description'       => '<p>Desa Trunyan adalah desa kuno Bali Aga yang terletak di tepi barat Danau Batur, Kecamatan Kintamani, Kabupaten Bangli, Bali. Desa ini dihuni oleh suku Bali Aga, yaitu penduduk asli Bali sebelum masuknya pengaruh Hindu dari Jawa.</p><p>Tradisi paling terkenal dari Desa Trunyan adalah cara pemakaman yang sangat unik. Jenazah orang yang meninggal tidak dikubur atau dibakar (ngaben), melainkan diletakkan begitu saja di bawah pohon Taru Menyan yang sudah berusia ratusan tahun. Keunikannya, meski jenazah dibiarkan di alam terbuka, pohon Taru Menyan mengeluarkan aroma harum yang mengorbankan bau busuk dari proses pembusukan jenazah.</p><p>Selain tradisi pemakaman, Desa Trunyan memiliki Pura Pancering Jagat, salah satu pura tertua dan paling keramat di Bali yang dipersembahkan kepada Dewa Ratu Gede Pancering Jagat. Upacara keagamaan di pura ini selalu berlangsung dengan hikmat dan penuh warna.</p><p>Akses ke Desa Trunyan hanya bisa melalui perahu menyeberangi Danau Batur, menambah kesan petualangan bagi setiap wisatawan yang berkunjung.</p>',
            'address'           => 'Desa Trunyan, Kec. Kintamani, Kab. Bangli, Bali 80652',
            'latitude'          => -8.2561,
            'longitude'         => 115.4143,
            'map_url'           => 'https://maps.google.com/?q=-8.2561,115.4143',
            'status'            => 'verified',
            'is_featured'       => false,
            'manager_email'     => 'manager.trunyan@singgah.id',
            'category'          => 'budaya_tradisi',
        ],
        [
            'name'              => 'Desa Wisata Kemiren',
            'slug'              => 'desa-wisata-kemiren',
            'short_description' => 'Desa adat suku Osing di Banyuwangi yang kaya seni budaya, ritual tradisional, dan kerajinan tangan khas.',
            'description'       => '<p>Desa Wisata Kemiren terletak di Kecamatan Glagah, Kabupaten Banyuwangi, Jawa Timur. Desa ini merupakan sentra kebudayaan suku Osing, suku asli Banyuwangi yang memiliki bahasa, seni, dan tradisi yang berbeda dari suku Jawa maupun Bali.</p><p>Kesenian khas suku Osing yang paling terkenal adalah Tari Gandrung, tarian seremonial yang melambangkan rasa syukur setelah panen dan telah menjadi ikon budaya Banyuwangi. Setiap tahun, Festival Gandrung Sewu menampilkan ribuan penari Gandrung secara bersamaan di pantai Banyuwangi.</p><p>Ritual Barong Ider Bumi yang dilaksanakan setiap tanggal 2 Syawal adalah tradisi unik yang bertujuan untuk menolak bala dan menjaga keselamatan warga desa. Prosesi ini melibatkan seluruh warga desa dan berlangsung sangat meriah.</p><p>Rumah adat suku Osing di Kemiren memiliki ciri khas berupa teras depan terbuka yang disebut "serambi" dan penggunaan material kayu yang dominan. Para pengunjung dapat menyaksikan langsung pembuatan batik Using dan kerajinan anyaman bambu.',
            'address'           => 'Desa Kemiren, Kec. Glagah, Kab. Banyuwangi, Jawa Timur 68453',
            'latitude'          => -8.2169,
            'longitude'         => 114.3586,
            'map_url'           => 'https://maps.google.com/?q=-8.2169,114.3586',
            'status'            => 'pending',
            'is_featured'       => false,
            'manager_email'     => 'manager.kemiren@singgah.id',
            'category'          => 'budaya_tradisi',
        ],
    ];

    public function run(): void
    {
        $visitors = User::where('role', 'user')->get();

        foreach ($this->villages as $data) {
            $manager = User::where('email', $data['manager_email'])->first();

            $village = Village::create([
                'manager_id'        => $manager->id,
                'name'              => $data['name'],
                'slug'              => $data['slug'],
                'short_description' => $data['short_description'],
                'description'       => $data['description'],
                'address'           => $data['address'],
                'latitude'          => $data['latitude'],
                'longitude'         => $data['longitude'],
                'map_url'           => $data['map_url'],
                'status'            => $data['status'],
                'is_featured'       => $data['is_featured'],
                'category'          => $data['category'],
            ]);

            // Seed media untuk village (3 gambar dummy)
            for ($i = 1; $i <= 3; $i++) {
                $village->media()->create([
                    'file_path' => "images/villages/{$village->slug}/photo-{$i}.jpg",
                    'disk'      => 'public',
                    'type'      => 'image',
                    'alt_text'  => "Foto {$i} - {$village->name}",
                    'order'     => $i,
                ]);
            }

            // Seed ulasan untuk village (skip village yang masih pending)
            if ($village->status === 'verified' && $visitors->isNotEmpty()) {
                $reviewers = $visitors->random(min(8, $visitors->count()));
                foreach ($reviewers as $reviewer) {
                    $village->reviews()->create([
                        'user_id'    => $reviewer->id,
                        'rating'     => fake()->numberBetween(3, 5),
                        'comment'    => fake()->randomElement([
                            'Desanya sangat indah dan bersih, wajib dikunjungi!',
                            'Pengalaman budaya yang luar biasa, tidak akan terlupakan.',
                            'Masyarakatnya ramah dan informatif, sangat berkesan.',
                            'Pemandangan alam yang menakjubkan, cocok untuk keluarga.',
                            'Autentik dan alami, jauh dari kesan komersil. Saya sangat suka.',
                            'Akses transportasi masih perlu ditingkatkan, tapi destinasinya worth it.',
                            'Sangat merekomendasikan desa ini untuk wisatawan yang mencari pengalaman unik.',
                            'Harga tiket sangat terjangkau untuk pengalaman sebesar ini.',
                        ]),
                        'is_visible' => true,
                    ]);
                }
            }
        }
    }
}
