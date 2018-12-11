<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Events\NewMessage;

class ChatController extends Controller
{
    //

    public function sendMessage(Request $request)
    {
        broadcast(new NewMessage($request->user()->first_name, $request->message))->toOthers();

        return 'Message Sent!';
    }
}
