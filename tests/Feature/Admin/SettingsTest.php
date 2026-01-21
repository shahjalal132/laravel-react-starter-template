<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_settings_page_is_accessible_to_authenticated_users(): void
    {
        $response = $this
            ->actingAs($this->user)
            ->get(route('admin.settings'));

        $response->assertOk();
    }

    public function test_payment_settings_can_be_updated(): void
    {
        $response = $this
            ->actingAs($this->user)
            ->post(route('admin.settings.update'), [
                'group' => 'payment',
                'payment_gateway' => 'sslcommerz',
                'currency' => 'BDT',
                'currency_symbol' => '৳',
                'sslcommerz_store_id' => 'test_store_id',
                'sslcommerz_store_password' => 'test_store_password',
                'payment_mode' => 'sandbox',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('admin.settings'));

        $this->assertEquals('sslcommerz', Setting::getValue('payment_gateway', 'payment'));
        $this->assertEquals('test_store_id', Setting::getValue('sslcommerz_store_id', 'payment'));
    }

    public function test_payment_settings_validation(): void
    {
        $response = $this
            ->actingAs($this->user)
            ->post(route('admin.settings.update'), [
                'group' => 'payment',
                'payment_gateway' => 'invalid_gateway',
            ]);

        $response->assertSessionHasErrors('payment_gateway');
    }

    public function test_security_settings_can_be_updated(): void
    {
        $response = $this
            ->actingAs($this->user)
            ->post(route('admin.settings.update'), [
                'group' => 'security',
                'password_min_length' => 10,
                'password_require_uppercase' => true,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('admin.settings'));

        $this->assertEquals(10, Setting::getValue('password_min_length', 'security'));
        $this->assertEquals(true, Setting::getValue('password_require_uppercase', 'security'));
    }
}
