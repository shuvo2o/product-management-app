<?php

namespace App\Models;


use App\Models\Category;
use App\Models\StockHistory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'sku',
        'description',
        'price',
        'stock',
        'image',
        'status'
    ];
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function stockHistories()
    {
        return $this->hasMany(StockHistory::class);
    }
}
