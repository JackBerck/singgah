<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('culinaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('village_id')->constrained('villages')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->longText('description');
            $table->decimal('price_min', 12, 2)->nullable();
            $table->decimal('price_max', 12, 2)->nullable();
            $table->string('location')->nullable();
            $table->string('contact_info')->nullable();
            $table->timestamps();

            $table->index('village_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('culinaries');
    }
};
