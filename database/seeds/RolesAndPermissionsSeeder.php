<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;


class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Reset cached roles and permissions
        app()['cache']->forget('spatie.permission.cache');

        // create permissions

        // user
        Permission::create(['name' => 'add user']);
        Permission::create(['name' => 'edit user']);
        Permission::create(['name' => 'delete user']);

        // profile
        Permission::create(['name' => 'edit profile']);


        // create roles and assign created permissions


        // Super admin
        $role = Role::create(['name' => 'super-admin']);
        $role->givePermissionTo(Permission::all());
        $user = \App\User::find(1); // Set super-admin
        $user->assignRole(1); // Set super-admin

        // Admin
        $role = Role::create(['name' => 'admin']);
        $role->givePermissionTo(['edit profile', 'add user', 'edit user']);

        // Member
        $role = Role::create(['name' => 'member']);
        $role->givePermissionTo('edit profile');
    }
}
