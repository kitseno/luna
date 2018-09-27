<?php

/**
 * Get configuration of component
 * component = whatever application you want to build depending on its feature
 */

if (file_exists(base_path('component/config/app.php')))
return require_once(base_path('component/config/app.php'));