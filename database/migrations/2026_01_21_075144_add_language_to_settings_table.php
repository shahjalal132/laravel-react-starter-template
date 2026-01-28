<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Insert default language setting
        DB::table('settings')->insert([
            'key' => 'language',
            'value' => 'en',
            'group' => 'general',
            'type' => 'string',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove language setting
        DB::table('settings')->where('key', 'language')->delete();
    }
};
