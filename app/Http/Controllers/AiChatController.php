<?php

namespace App\Http\Controllers;

use App\Services\AiRagService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AiChatController extends Controller
{
    public function __construct(private readonly AiRagService $ragService) {}

    public function chat(Request $request): JsonResponse
    {
        $request->validate([
            'message' => ['required', 'string', 'max:500'],
        ]);

        try {
            $reply = $this->ragService->ask($request->string('message')->trim()->toString());

            return response()->json(['reply' => $reply]);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Terjadi kesalahan tak terduga. Silakan coba lagi.',
            ], 500);
        }
    }
}
