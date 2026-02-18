<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PermissionStoreRequest;
use App\Http\Requests\Admin\PermissionUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('view-permissions'), 403);
        $query = Permission::query()->orderBy('name');

        // Search
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $permissions = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Administration/Permissions/Index', [
            'permissions' => $permissions,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        abort_unless(auth()->user()->can('create-permissions'), 403);
        return Inertia::render('Admin/Administration/Permissions/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PermissionStoreRequest $request): RedirectResponse
    {
        abort_unless($request->user()->can('create-permissions'), 403);
        Permission::create(['name' => $request->name]);

        return redirect()->route('admin.administration.permissions.index')
            ->with('success', 'Permission created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Permission $permission): Response
    {
        abort_unless(auth()->user()->can('view-permissions'), 403);
        return Inertia::render('Admin/Administration/Permissions/Edit', [
            'permission' => $permission,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Permission $permission): Response
    {
        abort_unless(auth()->user()->can('edit-permissions'), 403);
        return Inertia::render('Admin/Administration/Permissions/Edit', [
            'permission' => $permission,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PermissionUpdateRequest $request, Permission $permission): RedirectResponse
    {
        abort_unless($request->user()->can('edit-permissions'), 403);
        $permission->update(['name' => $request->name]);

        return redirect()->route('admin.administration.permissions.index')
            ->with('success', 'Permission updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission): RedirectResponse
    {
        abort_unless(auth()->user()->can('delete-permissions'), 403);
        // Check if permission is assigned to any roles
        if ($permission->roles()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete permission that is assigned to roles.');
        }

        $permission->delete();

        return redirect()->route('admin.administration.permissions.index')
            ->with('success', 'Permission deleted successfully.');
    }
    /**
     * Remove the specified resources from storage.
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        abort_unless($request->user()->can('delete-permissions'), 403);
        $ids = $request->input('ids', []);

        if (empty($ids)) {
            return redirect()->back()->with('error', 'No permissions selected.');
        }

        $permissions = Permission::whereIn('id', $ids)->get();
        $deletedCount = 0;
        $activeCount = 0;

        foreach ($permissions as $permission) {
            /** @var \App\Models\Permission $permission */
            if ($permission->roles()->count() > 0) {
                $activeCount++;
                continue;
            }
            $permission->delete();
            $deletedCount++;
        }

        if ($deletedCount === 0) {
            return redirect()->back()->with('error', 'Selected permissions are assigned to roles and cannot be deleted.');
        }

        $message = $deletedCount . ' permissions deleted successfully.';
        if ($activeCount > 0) {
            $message .= ' ' . $activeCount . ' permissions were skipped as they are assigned to roles.';
        }

        return redirect()->route('admin.administration.permissions.index')->with('success', $message);
    }
}
