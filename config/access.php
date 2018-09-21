<?php

return [
    /*
     * Application access configuration
     */
    
    /*
     * Whether or not registration is enabled
     */
    'registration' => env('ENABLE_REGISTRATION', true),
   
    /*
     * Configurations for the user
     */
    'users' => [
        /*
         * Whether or not the user has to confirm their email when signing up
         */
        'verify_email' => env('VERIFY_EMAIL', false),
        /*
         * Whether or not the users email can be changed on the edit profile screen
         */
        'change_email' => env('CHANGE_EMAIL', false),
        /*
         * The name of the super administrator role
         */
        'admin_role' => 'Super-admin',
        /*
         * The default role all new registered users get added to
         */
        'default_role' => 'Member',
        /*
         * Whether or not new users need to be approved by an administrator before logging in
         * If this is set to true, then confirm_email is not in effect
         */
        'requires_approval' => env('REQUIRES_APPROVAL', false),
        /*
         * Login username to be used by the controller.
         */
        'username' => 'email',
        /*
         * Session Database Driver Only
         * When active, a user can only have one session active at a time
         * That is all other sessions for that user will be deleted when they log in
         * (They can only be logged into one place at a time, all others will be logged out)
         */
        'single_login' => true,
        /*
         * How many days before users have to change their passwords
         * false is off
         */
        'password_expires_days' => env('PASSWORD_EXPIRES_DAYS', 30),

        'token_expires_days' => env('TOKEN_EXPIRES_DAYS', 15),

        'refresh_token_expires_days' => env('REFRESH_TOKEN_EXPIRES_DAYS', 30),

        /*
         * How many days before token for the confirm email will expire
         * Default: 5
         */
        'confirm_email_token_expires_days' => env('CONFIRM_EMAIL_TOKEN_EXPIRES_DAYS', 5),
    ],
];