<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'key',
        'value',
        'group',
        'type',
    ];

    /**
     * Get a setting value by key.
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public static function getValue(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        
        if (!$setting) {
            return $default;
        }

        return static::castValue($setting->value, $setting->type);
    }

    /**
     * Set or update a setting value.
     *
     * @param string $key
     * @param mixed $value
     * @param string $group
     * @param string $type
     * @return Setting
     */
    public static function setValue(string $key, $value, string $group, string $type = 'string'): Setting
    {
        return static::updateOrCreate(
            ['key' => $key],
            [
                'value' => is_array($value) ? json_encode($value) : $value,
                'group' => $group,
                'type' => $type,
            ]
        );
    }

    /**
     * Get all settings for a specific group.
     *
     * @param string $group
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getGroup(string $group)
    {
        return static::where('group', $group)->get()->mapWithKeys(function ($setting) {
            return [$setting->key => static::castValue($setting->value, $setting->type)];
        });
    }

    /**
     * Cast value based on type.
     *
     * @param mixed $value
     * @param string $type
     * @return mixed
     */
    protected static function castValue($value, string $type)
    {
        if ($value === null) {
            return null;
        }

        return match ($type) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'number', 'integer' => (int) $value,
            'float' => (float) $value,
            'json' => json_decode($value, true),
            default => $value,
        };
    }
}
