<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SuspendUserRequest;
use App\Http\Requests\Admin\UserStoreRequest;
use App\Http\Requests\Admin\UserUpdateRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('view-users'), 403);
        $query = User::with('roles');

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->has('role') && $request->role) {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('roles.id', $request->role);
            });
        }

        // Filter by suspended status
        if ($request->has('suspended') && $request->suspended !== null) {
            if ($request->suspended) {
                $query->suspended();
            } else {
                $query->notSuspended();
            }
        }

        $users = $query->paginate(15)->withQueryString();
        $roles = Role::all();

        return Inertia::render('Admin/Administration/Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['search', 'role', 'suspended']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        abort_unless(auth()->user()->can('create-users'), 403);
        $roles = Role::all();

        return Inertia::render('Admin/Administration/Users/Create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserStoreRequest $request): RedirectResponse
    {
        abort_unless($request->user()->can('create-users'), 403);
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        if ($request->has('roles')) {
            $user->syncRoles($request->roles);
        }

        return redirect()->route('admin.administration.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): Response
    {
        return $this->edit($user);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response
    {
        abort_unless(auth()->user()->can('edit-users'), 403);
        $user->load('roles');
        $roles = Role::all();

        return Inertia::render('Admin/Administration/Users/Edit', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserUpdateRequest $request, User $user): RedirectResponse
    {
        abort_unless($request->user()->can('edit-users'), 403);
        $data = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        if ($request->has('roles')) {
            $user->syncRoles($request->roles);
        }

        return redirect()->route('admin.administration.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        abort_unless(auth()->user()->can('delete-users'), 403);
        $user->delete();

        return redirect()->route('admin.administration.users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Suspend a user.
     */
    public function suspend(SuspendUserRequest $request, User $user): RedirectResponse
    {
        abort_unless($request->user()->can('suspend-users'), 403);
        $user->suspend($request->suspended_until, $request->suspension_reason);

        return redirect()->back()
            ->with('success', 'User suspended successfully.');
    }

    /**
     * Unsuspend a user.
     */
    public function unsuspend(User $user): RedirectResponse
    {
        abort_unless(auth()->user()->can('suspend-users'), 403);
        $user->unsuspend();

        return redirect()->back()
            ->with('success', 'User unsuspended successfully.');
    }
}
