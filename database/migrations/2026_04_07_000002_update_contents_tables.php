<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('village_events', function (Blueprint $table) {
            $table->string('map_url')->nullable();
        });

        Schema::table('attractions', function (Blueprint $table) {
            $table->string('map_url')->nullable();
            $table->time('open_time')->nullable();
            $table->time('close_time')->nullable();
            $table->dropColumn('operating_hours');
        });

        Schema::table('culinaries', function (Blueprint $table) {
            $table->string('map_url')->nullable();
            $table->time('open_time')->nullable();
            $table->time('close_time')->nullable();
        });

        Schema::table('accommodations', function (Blueprint $table) {
            $table->string('map_url')->nullable();
            $table->time('open_time')->nullable();
            $table->time('close_time')->nullable();
            $table->dropColumn('operating_hours');
        });
    }

    public function down(): void
    {
        Schema::table('village_events', function (Blueprint $table) {
            $table->dropColumn('map_url');
        });

        Schema::table('attractions', function (Blueprint $table) {
            $table->dropColumn(['map_url', 'open_time', 'close_time']);
            $table->string('operating_hours')->nullable();
        });

        Schema::table('culinaries', function (Blueprint $table) {
            $table->dropColumn(['map_url', 'open_time', 'close_time']);
            $table->string('operating_hours')->nullable();
        });

        Schema::table('accommodations', function (Blueprint $table) {
            $table->dropColumn(['map_url', 'open_time', 'close_time']);
            $table->string('operating_hours')->nullable();
        });
    }
};
