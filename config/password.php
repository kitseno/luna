<?php

return [
   
    /*
     * Configurations for the password reset
     */
    'reset' => [

        'token_expiration' => env('PASSWORD_RESET_TOKEN_EXPIRATION', 720),
    ],
];