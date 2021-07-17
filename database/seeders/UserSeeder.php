<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'username' => '5000000',
            'password' => 'admin',
            'role' => User::ROLE_ADMIN,
        ]);
    }
}
