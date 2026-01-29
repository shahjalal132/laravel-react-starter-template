<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'view-users',
            'create-users',
            'edit-users',
            'delete-users',
            'suspend-users',
            'view-roles',
            'create-roles',
            'edit-roles',
            'delete-roles',
            'view-permissions',
            'create-permissions',
            'edit-permissions',
            'delete-permissions',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create admin role with all permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        
        // Give admin all permissions (using wildcard or all permissions)
        $allPermissions = Permission::all();
        $adminRole->syncPermissions($allPermissions);

        // Create moderator role with initial permissions
        $moderatorRole = Role::firstOrCreate(['name' => 'moderator']);
        
        // Give moderator initial permissions
        $moderatorPermissions = Permission::whereIn('name', [
            'view-users',
            'view-roles',
            'view-permissions',
        ])->get();
        
        $moderatorRole->syncPermissions($moderatorPermissions);
    }
}
