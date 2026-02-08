<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'suspended_at',
        'suspended_until',
        'suspension_reason',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'suspended_at' => 'datetime',
            'suspended_until' => 'datetime',
        ];
    }

    /**
     * Check if user is currently suspended.
     */
    public function isSuspended(): bool
    {
        if (!$this->suspended_until) {
            return false;
        }

        return now()->isBefore($this->suspended_until);
    }

    /**
     * Suspend the user until a specific date.
     */
    public function suspend(\DateTimeInterface|string|null $until = null, ?string $reason = null): void
    {
        $this->suspended_at = now();
        $this->suspended_until = $until ? (is_string($until) ? \Carbon\Carbon::parse($until) : $until) : null;
        $this->suspension_reason = $reason;
        $this->save();
    }

    /**
     * Unsuspend the user.
     */
    public function unsuspend(): void
    {
        $this->suspended_at = null;
        $this->suspended_until = null;
        $this->suspension_reason = null;
        $this->save();
    }

    /**
     * Scope a query to only include suspended users.
     */
    public function scopeSuspended($query)
    {
        return $query->whereNotNull('suspended_until')
            ->where('suspended_until', '>', now());
    }

    /**
     * Scope a query to only include non-suspended users.
     */
    public function scopeNotSuspended($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('suspended_until')
                ->orWhere('suspended_until', '<=', now());
        });
    }
}
