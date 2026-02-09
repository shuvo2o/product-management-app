<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        $superAdminRole = Role::firstOrCreate(['name' => 'superadmin', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'moderator', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);

        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@proproject.com'], 
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password123'),
                'is_approved' => 1
            ]
        );

        $superAdmin->assignRole($superAdminRole);
    }
}