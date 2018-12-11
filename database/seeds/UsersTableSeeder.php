<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;


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

        $id = (string) Str::orderedUuid();

        \App\User::create([
            'id' => $id,
            'first_name' => 'Administrator',
            'last_name' => '',
            'email' => 'admin@luna.test',
            'password' => bcrypt('secret'),
            'email_verified_at' => now(),
            'remember_token' => str_random(10),
        ]);

        \App\Profile::create([
            'about' => '',
            'user_id' => $id
        ]);
    }
}