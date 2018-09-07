<?php

namespace App\Providers;

use Illuminate\Support\Facades\Event;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        'App\Events\Event' => [
            'App\Listeners\EventListener',
        ],

        // Passport Access Tokens
        'Laravel\Passport\Events\AccessTokenCreated' => [
            'App\Listeners\RevokeOldTokens',
        ],

        // 'Laravel\Passport\Events\RefreshTokenCreated' => [
        //     'App\Listeners\PruneOldTokens',
        // ],

        // User Events
        // 'App\Events\User\Login' => [
        //     'App\Listeners\UserEventSubscriber',
        // ],

        // 'App\Events\User\Logout' => [
        //     'App\Listeners\UserEventSubscriber',
        // ],

        \SocialiteProviders\Manager\SocialiteWasCalled::class => [
            // add your listeners (aka providers) here
            'SocialiteProviders\\Graph\\GraphExtendSocialite@handle',
        ],
    ];

    protected $subscribe = [
        'App\Listeners\UserEventSubscriber',
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        //
    }
}
