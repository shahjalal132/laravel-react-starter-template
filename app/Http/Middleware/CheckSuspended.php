<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSuspended
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->isSuspended()) {
            $user = $request->user();
            $suspensionReason = $user->suspension_reason;
            auth()->logout();
            
            return redirect()->route('login')
                ->with('error', 'Your account has been suspended.')
                ->with('suspension_reason', $suspensionReason);
        }

        return $next($request);
    }
}
