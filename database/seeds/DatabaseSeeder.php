<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    		// User seeder
        $this->call(UsersTableSeeder::class);

        // Roles and permission seeder
        $this->call(RolesAndPermissionsSeeder::class);
    }
}
