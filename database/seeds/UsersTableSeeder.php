<?php

use Illuminate\Database\Seeder;

// use App\User;
// use Spatie\Permission\Models\Role;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\User::create([
            'name' => 'Administrator',
            'email' => 'admin@domain.com',
            'password' => bcrypt('secret'),
            'email_verified_at' => now(),
            'remember_token' => str_random(10),
        ]);

        \App\Profile::create([
            'about' => '',
            'user_id' => 1
        ]);
    }
}