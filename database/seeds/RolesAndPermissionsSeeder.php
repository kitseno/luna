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
        Permission::create(['name' => 'View User']);
        Permission::create(['name' => 'Create User']);
        Permission::create(['name' => 'Update User']);
        Permission::create(['name' => 'Delete User']);
        Permission::create(['name' => 'Restore User']);

        // profile
        Permission::create(['name' => 'Update Profile']);


        // create roles and assign created permissions
        Permission::create(['name' => 'Administer Roles']);
        Permission::create(['name' => 'Administer Permissions']);

        // Admin
        Permission::create(['name' => 'View Admin']);

        // Settings
        Permission::create(['name' => 'View Settings']);        

        // Super admin
        $role = Role::create(['name' => 'Super-admin']);
        $role->givePermissionTo(Permission::all());
        $user = \App\User::find(1); // Set super-admin
        $user->assignRole(1); // Set super-admin

        // Admin
        $role = Role::create(['name' => 'Admin']);
        $role->givePermissionTo([
            'View User',
            'Update Profile',
            'Create User',
            'Update User',
            'Administer Roles',
            'Administer Permissions',
            'View Admin',
        ]);

        // Member
        $role = Role::create(['name' => 'Member']);
        $role->givePermissionTo('Update Profile');
    }
}
