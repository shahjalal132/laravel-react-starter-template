<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TrashController extends Controller
{
    public function index(Request $request): Response
    {
        $tab = $request->query('tab', 'users');

        $data = [];

        if ($tab === 'users') {
            abort_unless($request->user()->can('view-users'), 403);
            $data = User::onlyTrashed()->with('roles')->paginate(10)->withQueryString();
        } elseif ($tab === 'roles') {
            abort_unless($request->user()->can('view-roles'), 403);
            $data = Role::onlyTrashed()->with('permissions')->paginate(10)->withQueryString();
        } elseif ($tab === 'permissions') {
            abort_unless($request->user()->can('view-permissions'), 403);
            $data = Permission::onlyTrashed()->paginate(10)->withQueryString();
        }

        return Inertia::render('Admin/Trash/Index', [
            'tab' => $tab,
            'data' => $data,
            'counts' => [
                'users' => User::onlyTrashed()->count(),
                'roles' => Role::onlyTrashed()->count(),
                'permissions' => Permission::onlyTrashed()->count(),
            ],
        ]);
    }

    public function restoreUser($id)
    {
        abort_unless(auth()->user()->can('edit-users'), 403);
        $user = User::onlyTrashed()->findOrFail($id);
        $user->restore();

        return redirect()->back()->with('success', 'User restored successfully.');
    }

    public function forceDeleteUser($id)
    {
        abort_unless(auth()->user()->can('delete-users'), 403);
        $user = User::onlyTrashed()->findOrFail($id);
        $user->forceDelete();

        return redirect()->back()->with('success', 'User permanently deleted.');
    }

    public function restoreRole($id)
    {
        abort_unless(auth()->user()->can('edit-roles'), 403);
        $role = Role::onlyTrashed()->findOrFail($id);
        $role->restore();

        return redirect()->back()->with('success', 'Role restored successfully.');
    }

    public function forceDeleteRole($id)
    {
        abort_unless(auth()->user()->can('delete-roles'), 403);
        $role = Role::onlyTrashed()->findOrFail($id);
        $role->forceDelete();

        return redirect()->back()->with('success', 'Role permanently deleted.');
    }

    public function restorePermission($id)
    {
        abort_unless(auth()->user()->can('edit-permissions'), 403);
        $permission = Permission::onlyTrashed()->findOrFail($id);
        $permission->restore();

        return redirect()->back()->with('success', 'Permission restored successfully.');
    }

    public function forceDeletePermission($id)
    {
        abort_unless(auth()->user()->can('delete-permissions'), 403);
        $permission = Permission::onlyTrashed()->findOrFail($id);
        $permission->forceDelete();

        return redirect()->back()->with('success', 'Permission permanently deleted.');
    }
}
