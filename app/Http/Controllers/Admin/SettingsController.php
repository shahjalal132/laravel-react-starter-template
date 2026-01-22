<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SettingsUpdateRequest;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * Display the settings page.
     */
    public function index(): Response
    {
        $groups = ['general', 'payment', 'seo', 'smtp', 'notifications', 'security'];
        $settings = [];

        foreach ($groups as $group) {
            $settings[$group] = Setting::getGroup($group)->toArray();
        }

        return Inertia::render('Admin/Settings', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update settings.
     */
    public function update(SettingsUpdateRequest $request): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $data = $request->validated();
        $group = $request->input('group');

        // Handle file uploads separately
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('settings', 'public');
            Setting::setValue('logo', $logoPath, 'general', 'file');
        }

        if ($request->hasFile('og_image')) {
            $ogImagePath = $request->file('og_image')->store('settings', 'public');
            Setting::setValue('og_image', $ogImagePath, 'seo', 'file');
        }

        // Process other settings based on group
        $settingMappings = $this->getSettingMappings($group);

        foreach ($settingMappings as $formKey => $config) {
            if (isset($data[$formKey])) {
                $value = $data[$formKey];
                $type = $config['type'] ?? 'string';
                
                Setting::setValue($config['key'], $value, $group, $type);
            }
        }

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'message' => 'Settings updated successfully.']);
        }

        return redirect()->route('admin.settings')->with('success', 'Settings updated successfully.');
    }

    /**
     * Get setting mappings for a group.
     */
    protected function getSettingMappings(string $group): array
    {
        return match ($group) {
            'general' => [
                'app_name' => ['key' => 'app_name', 'type' => 'string'],
                'app_email' => ['key' => 'app_email', 'type' => 'string'],
                'app_phone' => ['key' => 'app_phone', 'type' => 'string'],
                'app_address' => ['key' => 'app_address', 'type' => 'string'],
                'language' => ['key' => 'language', 'type' => 'string'],
            ],
            'payment' => [
                'payment_gateway' => ['key' => 'payment_gateway', 'type' => 'string'],
                'currency' => ['key' => 'currency', 'type' => 'string'],
                'currency_symbol' => ['key' => 'currency_symbol', 'type' => 'string'],
                'stripe_public_key' => ['key' => 'stripe_public_key', 'type' => 'string'],
                'stripe_secret_key' => ['key' => 'stripe_secret_key', 'type' => 'string'],
                'stripe_webhook_secret' => ['key' => 'stripe_webhook_secret', 'type' => 'string'],
                'paypal_client_id' => ['key' => 'paypal_client_id', 'type' => 'string'],
                'paypal_secret' => ['key' => 'paypal_secret', 'type' => 'string'],
                'sslcommerz_store_id' => ['key' => 'sslcommerz_store_id', 'type' => 'string'],
                'sslcommerz_store_password' => ['key' => 'sslcommerz_store_password', 'type' => 'string'],
                'payment_mode' => ['key' => 'payment_mode', 'type' => 'string'],
            ],
            'seo' => [
                'meta_title' => ['key' => 'meta_title', 'type' => 'string'],
                'meta_description' => ['key' => 'meta_description', 'type' => 'string'],
                'meta_keywords' => ['key' => 'meta_keywords', 'type' => 'string'],
                'google_analytics_id' => ['key' => 'google_analytics_id', 'type' => 'string'],
                'google_search_console_verification' => ['key' => 'google_search_console_verification', 'type' => 'string'],
            ],
            'smtp' => [
                'smtp_host' => ['key' => 'smtp_host', 'type' => 'string'],
                'smtp_port' => ['key' => 'smtp_port', 'type' => 'number'],
                'smtp_username' => ['key' => 'smtp_username', 'type' => 'string'],
                'smtp_password' => ['key' => 'smtp_password', 'type' => 'string'],
                'smtp_encryption' => ['key' => 'smtp_encryption', 'type' => 'string'],
                'smtp_from_address' => ['key' => 'smtp_from_address', 'type' => 'string'],
                'smtp_from_name' => ['key' => 'smtp_from_name', 'type' => 'string'],
            ],
            'notifications' => [
                'email_notifications_enabled' => ['key' => 'email_notifications_enabled', 'type' => 'boolean'],
                'push_notifications_enabled' => ['key' => 'push_notifications_enabled', 'type' => 'boolean'],
                'notification_email' => ['key' => 'notification_email', 'type' => 'string'],
                'low_stock_threshold' => ['key' => 'low_stock_threshold', 'type' => 'number'],
                'order_notification_enabled' => ['key' => 'order_notification_enabled', 'type' => 'boolean'],
            ],
            'security' => [
                'password_min_length' => ['key' => 'password_min_length', 'type' => 'number'],
                'password_require_uppercase' => ['key' => 'password_require_uppercase', 'type' => 'boolean'],
                'password_require_lowercase' => ['key' => 'password_require_lowercase', 'type' => 'boolean'],
                'password_require_numbers' => ['key' => 'password_require_numbers', 'type' => 'boolean'],
                'password_require_symbols' => ['key' => 'password_require_symbols', 'type' => 'boolean'],
                'two_factor_enabled' => ['key' => 'two_factor_enabled', 'type' => 'boolean'],
                'session_timeout' => ['key' => 'session_timeout', 'type' => 'number'],
            ],
            default => [],
        };
    }
}
