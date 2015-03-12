<?php
/*
|--------------------------------------------------------------------------
| oAuth Config
|--------------------------------------------------------------------------
*/

if (file_exists(app_path().'/config/oauth_creds.php')) {
    require_once app_path().'/config/oauth_creds.php';
}

return [
    'storage'   => 'Session',
    'consumers' => $consumers,
];
