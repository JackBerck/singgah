<?php

namespace App\Services;

use App\Models\Accommodation;
use App\Models\Attraction;
use App\Models\Culinary;
use App\Models\Village;
use App\Models\VillageEvent;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class AiRagService
{
    /** Indonesian stop-words to strip from keyword extraction */
    private const STOP_WORDS = [
        'ada',
        'apa',
        'atau',
        'bisa',
        'cari',
        'carikan',
        'dan',
        'dari',
        'dengan',
        'di',
        'di',
        'dimana',
        'ingin',
        'ini',
        'itu',
        'juga',
        'kalau',
        'kata',
        'ke',
        'karena',
        'lebih',
        'mana',
        'mau',
        'menjadi',
        'mungkin',
        'nya',
        'oleh',
        'pada',
        'paling',
        'sama',
        'saya',
        'sering',
        'sudah',
        'supaya',
        'tentang',
        'tidak',
        'tiga',
        'tolong',
        'untuk',
        'yang',
        'ya',
        'bagaimana',
        'rekomen',
        'rekomendasi',
        'tahu',
        'kasih',
        'tau',
        'boleh',
        'mohon',
        'desa',
        'wisata',
        'tempat',
        'lokasi',
        'nomor',
        'info',
    ];

    /**
     * Main entry point: given a user query, retrieve relevant context from DB
     * and send to the AI API, returning the AI's reply text.
     *
     * @throws \RuntimeException
     */
    public function ask(string $query): string
    {
        $keywords = $this->extractKeywords($query);
        $context  = $this->buildContext($keywords, $query);

        $systemPrompt = $this->buildSystemPrompt($context);

        return $this->callApi($systemPrompt, $query);
    }

    // ─── Keyword Extraction ───────────────────────────────────────────────────

    private function extractKeywords(string $query): array
    {
        // Lowercase, remove punctuation, split to words
        $words = preg_split('/\s+/', preg_replace('/[^\w\s]/u', ' ', mb_strtolower($query)));

        $keywords = array_filter(
            $words,
            fn($w) =>
            strlen($w) >= 3 && !in_array($w, self::STOP_WORDS, true)
        );

        return array_values(array_unique($keywords));
    }

    // ─── Database Retrieval (RAG) ─────────────────────────────────────────────

    private function buildContext(array $keywords, string $rawQuery): string
    {
        if (empty($keywords)) {
            // Fall back to using a few words from the raw query
            $keywords = array_slice(explode(' ', $rawQuery), 0, 5);
        }

        $sections = [];

        $villages = $this->searchVillages($keywords);
        if ($villages->isNotEmpty()) {
            $lines = $villages->map(
                fn($v) =>
                "- Desa \"{$v->name}\" (Kategori: {$v->category_label}, Alamat: {$v->address}): {$v->short_description}"
            )->join("\n");
            $sections[] = "=== DESA WISATA ===\n{$lines}";
        }

        $attractions = $this->searchAttractions($keywords);
        if ($attractions->isNotEmpty()) {
            $lines = $attractions->map(
                fn($a) =>
                "- Wisata \"{$a->name}\" di Desa \"{$a->village->name}\" (Lokasi: {$a->location}, Harga: Rp " . number_format($a->price_min) . " - Rp " . number_format($a->price_max) . "): "
                    . Str::limit(strip_tags($a->description), 200)
            )->join("\n");
            $sections[] = "=== WISATA / ATRAKSI ===\n{$lines}";
        }

        $culinaries = $this->searchCulinaries($keywords);
        if ($culinaries->isNotEmpty()) {
            $lines = $culinaries->map(
                fn($c) =>
                "- Kuliner \"{$c->name}\" di Desa \"{$c->village->name}\" (Lokasi: {$c->location}, Harga: Rp " . number_format($c->price_min) . " - Rp " . number_format($c->price_max) . "): "
                    . Str::limit(strip_tags($c->description), 200)
            )->join("\n");
            $sections[] = "=== KULINER / UMKM ===\n{$lines}";
        }

        $accommodations = $this->searchAccommodations($keywords);
        if ($accommodations->isNotEmpty()) {
            $lines = $accommodations->map(
                fn($a) =>
                "- Akomodasi \"{$a->name}\" di Desa \"{$a->village->name}\" (Jam: {$a->operating_hours}, Harga per malam: Rp " . number_format($a->price_min) . " - Rp " . number_format($a->price_max) . "): "
                    . Str::limit(strip_tags($a->description), 200)
            )->join("\n");
            $sections[] = "=== AKOMODASI ===\n{$lines}";
        }

        $events = $this->searchEvents($keywords);
        if ($events->isNotEmpty()) {
            $lines = $events->map(
                fn($e) =>
                "- Event \"{$e->name}\" di Desa \"{$e->village->name}\" (Tanggal: {$e->event_date?->format('d M Y')}, Lokasi: {$e->location}): "
                    . Str::limit(strip_tags($e->description), 150)
            )->join("\n");
            $sections[] = "=== EVENT / ACARA ===\n{$lines}";
        }

        return empty($sections)
            ? '[TIDAK ADA DATA RELEVAN DITEMUKAN DI DATABASE SINGGAH]'
            : implode("\n\n", $sections);
    }

    private function searchVillages(array $keywords)
    {
        return Village::verified()
            ->where(function ($q) use ($keywords) {
                foreach ($keywords as $kw) {
                    $q->orWhere('name', 'ilike', "%{$kw}%")
                        ->orWhere('short_description', 'ilike', "%{$kw}%")
                        ->orWhere('description', 'ilike', "%{$kw}%")
                        ->orWhere('category', 'ilike', "%{$kw}%")
                        ->orWhere('address', 'ilike', "%{$kw}%");
                }
            })
            ->limit(5)
            ->get(['id', 'name', 'slug', 'category', 'short_description', 'address']);
    }

    private function searchAttractions(array $keywords)
    {
        return Attraction::with('village:id,name,slug')
            ->whereHas('village', fn($q) => $q->verified())
            ->where(function ($q) use ($keywords) {
                foreach ($keywords as $kw) {
                    $q->orWhere('name', 'ilike', "%{$kw}%")
                        ->orWhere('description', 'ilike', "%{$kw}%")
                        ->orWhere('location', 'ilike', "%{$kw}%");
                }
            })
            ->limit(5)
            ->get(['id', 'village_id', 'name', 'description', 'location', 'price_min', 'price_max']);
    }

    private function searchCulinaries(array $keywords)
    {
        return Culinary::with('village:id,name,slug')
            ->whereHas('village', fn($q) => $q->verified())
            ->where(function ($q) use ($keywords) {
                foreach ($keywords as $kw) {
                    $q->orWhere('name', 'ilike', "%{$kw}%")
                        ->orWhere('description', 'ilike', "%{$kw}%")
                        ->orWhere('location', 'ilike', "%{$kw}%");
                }
            })
            ->limit(5)
            ->get(['id', 'village_id', 'name', 'description', 'location', 'price_min', 'price_max']);
    }

    private function searchAccommodations(array $keywords)
    {
        return Accommodation::with('village:id,name,slug')
            ->whereHas('village', fn($q) => $q->verified())
            ->where(function ($q) use ($keywords) {
                foreach ($keywords as $kw) {
                    $q->orWhere('name', 'ilike', "%{$kw}%")
                        ->orWhere('description', 'ilike', "%{$kw}%")
                        ->orWhere('location', 'ilike', "%{$kw}%");
                }
            })
            ->limit(5)
            ->get(['id', 'village_id', 'name', 'description', 'location', 'price_min', 'price_max', 'operating_hours']);
    }

    private function searchEvents(array $keywords)
    {
        return VillageEvent::with('village:id,name,slug')
            ->whereHas('village', fn($q) => $q->verified())
            ->where(function ($q) use ($keywords) {
                foreach ($keywords as $kw) {
                    $q->orWhere('name', 'ilike', "%{$kw}%")
                        ->orWhere('description', 'ilike', "%{$kw}%")
                        ->orWhere('location', 'ilike', "%{$kw}%");
                }
            })
            ->orderBy('event_date')
            ->limit(5)
            ->get(['id', 'village_id', 'name', 'description', 'location', 'event_date']);
    }

    // ─── Prompt Assembly ──────────────────────────────────────────────────────

    private function buildSystemPrompt(string $context): string
    {
        return <<<PROMPT
Kamu adalah "Asisten Wisata Singgah", sebuah asisten travel cerdas untuk platform desa wisata Indonesia bernama Singgah.
Tugasmu adalah membantu pengunjung menemukan rekomendasi desa, wisata, kuliner, akomodasi, dan event berdasarkan DATA NYATA berikut yang diambil dari database.

ATURAN KERAS:
- Hanya jawab berdasarkan data yang diberikan di bagian DATA DATABASE di bawah ini.
- Jika data tidak ada atau tidak relevan, katakan dengan sopan bahwa rekomendasi untuk permintaan tersebut belum tersedia di platform Singgah.
- Jangan pernah mengarang informasi atau memberikan rekomendasi di luar data yang ada.
- Jawab dalam Bahasa Indonesia yang ramah, membantu, dan informatif.
- Sertakan nama desa, lokasi, harga, dan detail relevan lainnya saat merekomendasikan.
- Format jawaban menggunakan poin-poin jika ada lebih dari satu rekomendasi.
- Jawaban maksimal 3 paragraf atau 5 poin agar ringkas dan mudah dibaca.
- Jangan sebutkan bahwa kamu menggunakan "database" atau "data" kepada user, cukup rekomendasikan secara natural.

--- DATA DATABASE ---
{$context}
--- AKHIR DATA ---
PROMPT;
    }

    // ─── API Call ─────────────────────────────────────────────────────────────

    private function callApi(string $systemPrompt, string $userMessage): string
    {
        $apiKey = config('services.sumopod.key');
        $url    = config('services.sumopod.url');
        $model  = config('services.sumopod.model');

        $response = Http::withToken($apiKey)
            ->timeout(25)
            ->retry(1, 500)
            ->post($url, [
                'model'    => $model,
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user',   'content' => $userMessage],
                ],
                'max_tokens'  => 600,
                'temperature' => 0.3, // low = less hallucination
            ]);

        if ($response->failed()) {
            throw new \RuntimeException(
                'Maaf, layanan AI sedang tidak dapat diakses saat ini. Silakan coba lagi beberapa saat.'
            );
        }

        $text = $response->json('choices.0.message.content');

        if (empty($text)) {
            throw new \RuntimeException('Maaf, tidak ada balasan dari asisten AI. Silakan coba lagi.');
        }

        return trim($text);
    }
}
