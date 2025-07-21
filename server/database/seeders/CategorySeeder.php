<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => '仕事', 'color' => '#1976d2'],
            ['name' => 'プライベート', 'color' => '#388e3c'],
            ['name' => '勉強', 'color' => '#f57c00'],
            ['name' => '買い物', 'color' => '#d32f2f'],
            ['name' => 'その他', 'color' => '#7b1fa2'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['name' => $category['name']], $category);
        }
    }
}