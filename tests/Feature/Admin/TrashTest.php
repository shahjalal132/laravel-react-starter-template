<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TrashTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Create a user with all permissions
        $this->user = User::factory()->create();
        $role = Role::create(['name' => 'admin']);
        
        // Create necessary permissions for trash
        Permission::create(['name' => 'view-users']);
        Permission::create(['name' => 'edit-users']);
        Permission::create(['name' => 'delete-users']);
        Permission::create(['name' => 'view-roles']);
        Permission::create(['name' => 'edit-roles']);
        Permission::create(['name' => 'delete-roles']);
        Permission::create(['name' => 'view-permissions']);
        Permission::create(['name' => 'edit-permissions']);
        Permission::create(['name' => 'delete-permissions']);

        $role->givePermissionTo(Permission::all());
        $this->user->assignRole($role);
    }

    public function test_admin_can_view_trash_page()
    {
        $response = $this->actingAs($this->user)->get(route('admin.trash.index'));
        $response->assertStatus(200);
    }

    public function test_soft_deleted_user_appears_in_trash()
    {
        $userToDelete = User::factory()->create();
        $userToDelete->delete();

        $response = $this->actingAs($this->user)->get(route('admin.trash.index', ['tab' => 'users']));
        $response->assertSee($userToDelete->name);
    }

    public function test_can_restore_user()
    {
        $userToDelete = User::factory()->create();
        $userToDelete->delete();

        $this->assertSoftDeleted('users', ['id' => $userToDelete->id]);

        $response = $this->actingAs($this->user)
            ->post(route('admin.trash.users.restore', $userToDelete->id));

        $response->assertRedirect();
        $this->assertNotSoftDeleted('users', ['id' => $userToDelete->id]);
    }

    public function test_can_force_delete_user()
    {
        $userToDelete = User::factory()->create();
        $userToDelete->delete();

        $this->assertSoftDeleted('users', ['id' => $userToDelete->id]);

        $response = $this->actingAs($this->user)
            ->delete(route('admin.trash.users.force-delete', $userToDelete->id));

        $response->assertRedirect();
        $this->assertDatabaseMissing('users', ['id' => $userToDelete->id]);
    }

    // Role Tests
    public function test_can_restore_role()
    {
        $role = Role::create(['name' => 'test-role']);
        $role->delete();

        $this->assertSoftDeleted('roles', ['id' => $role->id]);

        $response = $this->actingAs($this->user)
            ->post(route('admin.trash.roles.restore', $role->id));

        $response->assertRedirect();
        $this->assertNotSoftDeleted('roles', ['id' => $role->id]);
    }

    public function test_can_force_delete_role()
    {
        $role = Role::create(['name' => 'test-role']);
        $role->delete();

        $this->assertSoftDeleted('roles', ['id' => $role->id]);

        $response = $this->actingAs($this->user)
            ->delete(route('admin.trash.roles.force-delete', $role->id));

        $response->assertRedirect();
        $this->assertDatabaseMissing('roles', ['id' => $role->id]);
    }

    // Permission Tests
    public function test_can_restore_permission()
    {
        $permission = Permission::create(['name' => 'test-permission']);
        $permission->delete();

        $this->assertSoftDeleted('permissions', ['id' => $permission->id]);

        $response = $this->actingAs($this->user)
            ->post(route('admin.trash.permissions.restore', $permission->id));

        $response->assertRedirect();
        $this->assertNotSoftDeleted('permissions', ['id' => $permission->id]);
    }

    public function test_can_force_delete_permission()
    {
        $permission = Permission::create(['name' => 'test-permission']);
        $permission->delete();

        $this->assertSoftDeleted('permissions', ['id' => $permission->id]);

        $response = $this->actingAs($this->user)
            ->delete(route('admin.trash.permissions.force-delete', $permission->id));

        $response->assertRedirect();
        $this->assertDatabaseMissing('permissions', ['id' => $permission->id]);
    }
}
