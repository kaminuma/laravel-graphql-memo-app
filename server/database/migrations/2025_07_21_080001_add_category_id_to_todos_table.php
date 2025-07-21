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
        Schema::table('todos', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('priority')->constrained()->onDelete('set null');
            $table->index('category_id');
            $table->index(['user_id', 'category_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('todos', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropIndex(['todos_category_id_index']);
            $table->dropIndex(['todos_user_id_category_id_index']);
            $table->dropColumn('category_id');
        });
    }
};