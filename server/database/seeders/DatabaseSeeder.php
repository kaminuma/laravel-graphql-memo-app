<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 全てのSeederを順番に実行
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
        ]);
    }
}
