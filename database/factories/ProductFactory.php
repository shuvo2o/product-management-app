<?php
namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = $this->faker->words(3, true); 
        
        return [
            'category_id' => Category::inRandomOrder()->first()->id ?? 1, 
            'name'        => $name,
            'slug'        => Str::slug($name),
            'sku'         => 'PRD-' . strtoupper(Str::random(8)),
            'description' => $this->faker->paragraph(),
            'price'       => $this->faker->randomFloat(2, 50, 2000),
            'stock'       => $this->faker->numberBetween(5, 100),
            'status'      => 'active',
            'image'       => null, 
        ];
    }
}