<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'amount',
        'address',
        'transaction_id',
        'status',
        'currency',
    ];
}
