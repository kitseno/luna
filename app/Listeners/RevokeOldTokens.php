<?php

namespace App\Listeners;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class RevokeOldTokens
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        //
        \DB::table('oauth_access_tokens')
            ->where('id', '<>', $event->tokenId)
            ->where('client_id', $event->clientId)
            ->where('user_id', $event->userId)
            ->where('revoked', 0)
            ->update(['revoked' => 1]);
        
        \Log::info('Revoked token for user id: '.$event->userId);
    }
}
