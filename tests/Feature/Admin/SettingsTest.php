<?php

namespace Tests\Feature\Admin;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class SettingsTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create();
    }

    public function test_settings_page_is_accessible(): void
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.settings'));

        $response->assertStatus(200);
    }

    public function test_settings_are_shared_via_inertia(): void
    {
        Setting::setValue('app_name', 'Test App', 'general');
        Setting::setValue('meta_title', 'Test Meta', 'seo');

        $response = $this->actingAs($this->admin)
            ->get(route('admin.dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->has('settings.general', fn (Assert $page) => $page
                ->where('app_name', 'Test App')
                ->etc()
            )
            ->has('settings.seo', fn (Assert $page) => $page
                ->where('meta_title', 'Test Meta')
                ->etc()
            )
        );
    }

    public function test_general_settings_can_be_updated(): void
    {
        $response = $this->actingAs($this->admin)
            ->post(route('admin.settings.update'), [
                'group' => 'general',
                'app_name' => 'Updated App Name',
                'app_email' => 'admin@example.com',
                'app_phone' => '123456789',
                'app_address' => '123 Test St',
            ]);

        $response->assertRedirect();
        $this->assertEquals('Updated App Name', Setting::getValue('app_name'));
    }

    public function test_seo_settings_can_be_updated(): void
    {
        $response = $this->actingAs($this->admin)
            ->post(route('admin.settings.update'), [
                'group' => 'seo',
                'meta_title' => 'Updated Meta Title',
                'meta_description' => 'Updated Meta Description',
                'meta_keywords' => 'test, updated',
            ]);

        $response->assertRedirect();
        $this->assertEquals('Updated Meta Title', Setting::getValue('meta_title'));
    }
}
