<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

        public function run(): void
    {
        $categories = ['Electronics', 'Mobile Phones', 'Laptops', 'Accessories', 'Home Appliances'];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category,
                'slug' => Str::slug($category), 
            ]);
        }
    }
    
}
