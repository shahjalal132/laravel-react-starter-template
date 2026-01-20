<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class SettingsUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $group = $this->input('group', 'general');

        return match ($group) {
            'general' => [
                'app_name' => ['required', 'string', 'max:255'],
                'app_email' => ['required', 'email', 'max:255'],
                'app_phone' => ['nullable', 'string', 'max:50'],
                'app_address' => ['nullable', 'string', 'max:500'],
                'logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
            ],
            'payment' => [
                'payment_gateway' => ['nullable', 'string', 'in:stripe,paypal,none'],
                'currency' => ['nullable', 'string', 'max:10'],
                'currency_symbol' => ['nullable', 'string', 'max:10'],
                'stripe_public_key' => ['nullable', 'string', 'max:255'],
                'stripe_secret_key' => ['nullable', 'string', 'max:255'],
                'stripe_webhook_secret' => ['nullable', 'string', 'max:255'],
                'paypal_client_id' => ['nullable', 'string', 'max:255'],
                'paypal_secret' => ['nullable', 'string', 'max:255'],
                'payment_mode' => ['nullable', 'string', 'in:sandbox,live'],
            ],
            'seo' => [
                'meta_title' => ['nullable', 'string', 'max:255'],
                'meta_description' => ['nullable', 'string', 'max:500'],
                'meta_keywords' => ['nullable', 'string', 'max:500'],
                'og_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
                'google_analytics_id' => ['nullable', 'string', 'max:255'],
                'google_search_console_verification' => ['nullable', 'string', 'max:255'],
            ],
            'smtp' => [
                'smtp_host' => ['nullable', 'string', 'max:255'],
                'smtp_port' => ['nullable', 'integer', 'min:1', 'max:65535'],
                'smtp_username' => ['nullable', 'string', 'max:255'],
                'smtp_password' => ['nullable', 'string', 'max:255'],
                'smtp_encryption' => ['nullable', 'string', 'in:tls,ssl,none'],
                'smtp_from_address' => ['nullable', 'email', 'max:255'],
                'smtp_from_name' => ['nullable', 'string', 'max:255'],
            ],
            'notifications' => [
                'email_notifications_enabled' => ['nullable', 'boolean'],
                'push_notifications_enabled' => ['nullable', 'boolean'],
                'notification_email' => ['nullable', 'email', 'max:255'],
                'low_stock_threshold' => ['nullable', 'integer', 'min:0'],
                'order_notification_enabled' => ['nullable', 'boolean'],
            ],
            'security' => [
                'password_min_length' => ['nullable', 'integer', 'min:4', 'max:128'],
                'password_require_uppercase' => ['nullable', 'boolean'],
                'password_require_lowercase' => ['nullable', 'boolean'],
                'password_require_numbers' => ['nullable', 'boolean'],
                'password_require_symbols' => ['nullable', 'boolean'],
                'two_factor_enabled' => ['nullable', 'boolean'],
                'session_timeout' => ['nullable', 'integer', 'min:1', 'max:1440'],
            ],
            default => [],
        };
    }
}
