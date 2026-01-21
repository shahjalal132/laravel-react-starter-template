<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = 'en'; // Default locale

        // Try to get locale from authenticated user's settings
        if ($request->user()) {
            $userLocale = \App\Models\Setting::getValue('language', 'general');
            if ($userLocale && in_array($userLocale, ['en', 'bn'])) {
                $locale = $userLocale;
            }
        }

        // Fallback to browser's Accept-Language header if no user preference
        if ($locale === 'en' && !$request->user()) {
            $browserLocale = $request->getPreferredLanguage(['en', 'bn']);
            if ($browserLocale) {
                $locale = $browserLocale;
            }
        }

        // Set the application locale
        app()->setLocale($locale);

        return $next($request);
    }
}
