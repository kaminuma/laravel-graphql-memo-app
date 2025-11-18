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
            $table->dateTime('deadline')->nullable()->after('completed');
            $table->enum('priority', ['high', 'medium', 'low'])->default('medium')->after('deadline');
            
            // パフォーマンス最適化のためのインデックス追加
            $table->index('deadline');
            $table->index('priority');
            $table->index(['user_id', 'deadline']);
            $table->index(['user_id', 'priority']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('todos', function (Blueprint $table) {
            $table->dropIndex(['todos_deadline_index']);
            $table->dropIndex(['todos_priority_index']);
            $table->dropIndex(['todos_user_id_deadline_index']);
            $table->dropIndex(['todos_user_id_priority_index']);
            
            $table->dropColumn(['deadline', 'priority']);
        });
    }
};
