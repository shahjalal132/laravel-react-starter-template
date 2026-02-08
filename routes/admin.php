<?php

use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'suspended'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    // Settings
    Route::middleware('permission:view-settings')->group(function () {
        Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    });

    Route::middleware('permission:edit-settings')->group(function () {
        Route::post('/settings', [SettingsController::class, 'update'])->name('settings.update');
    });

    Route::prefix('administration')->name('administration.')->group(function () {
        // Users
        Route::middleware('permission:view-users')->group(function () {
            Route::get('/users', [UserController::class, 'index'])->name('users.index');
        });
        
        Route::middleware('permission:create-users')->group(function () {
            Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
            Route::post('/users', [UserController::class, 'store'])->name('users.store');
        });
        
        Route::middleware('permission:view-users')->group(function () {
            Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
        });

        Route::middleware('permission:edit-users')->group(function () {
            Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
            Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        });
        
        Route::middleware('permission:delete-users')->group(function () {
            Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        });
        
        Route::middleware('permission:suspend-users')->group(function () {
            Route::post('/users/{user}/suspend', [UserController::class, 'suspend'])->name('users.suspend');
            Route::post('/users/{user}/unsuspend', [UserController::class, 'unsuspend'])->name('users.unsuspend');
        });
        
        // Roles
        Route::middleware('permission:view-roles')->group(function () {
            Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
        });

        Route::middleware('permission:create-roles')->group(function () {
            Route::get('/roles/create', [RoleController::class, 'create'])->name('roles.create');
            Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
        });

        Route::middleware('permission:view-roles')->group(function () {
            Route::get('/roles/{role}', [RoleController::class, 'show'])->name('roles.show');
        });
        
        Route::middleware('permission:edit-roles')->group(function () {
            Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
            Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');
        });
        
        Route::middleware('permission:delete-roles')->group(function () {
            Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');
        });
        
        // Permissions
        Route::middleware('permission:view-permissions')->group(function () {
            Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index');
        });

        Route::middleware('permission:create-permissions')->group(function () {
            Route::get('/permissions/create', [PermissionController::class, 'create'])->name('permissions.create');
            Route::post('/permissions', [PermissionController::class, 'store'])->name('permissions.store');
        });

        Route::middleware('permission:view-permissions')->group(function () {
            Route::get('/permissions/{permission}', [PermissionController::class, 'show'])->name('permissions.show');
        });
        
        Route::middleware('permission:edit-permissions')->group(function () {
            Route::get('/permissions/{permission}/edit', [PermissionController::class, 'edit'])->name('permissions.edit');
            Route::put('/permissions/{permission}', [PermissionController::class, 'update'])->name('permissions.update');
        });
        
        Route::middleware('permission:delete-permissions')->group(function () {
            Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy');
        });
    });
});