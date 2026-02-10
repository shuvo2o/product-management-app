<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens, HasRoles, Notifiable;

    protected $guard_name = 'api';

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_approved',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin()
    {
        return $this->hasRole(['admin', 'superadmin'], 'api');
    }

    public function isModerator()
    {
        return $this->hasRole(['moderator', 'admin', 'superadmin'], 'api');
    }

    public function isApproved()
    {
        return (int) $this->is_approved === 1;
    }
}
