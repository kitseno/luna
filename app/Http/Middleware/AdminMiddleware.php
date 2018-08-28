<?php

namespace App\Http\Middleware;

use Closure;
use Auth;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        if (!Auth::user()->hasPermissionTo('Administer Roles') || !Auth::user()->hasPermissionTo('Administer Permissions')) {
            return response()->json(['error' => 'Unauthorized'], 400);
        }

        return $next($request);
    }
}
