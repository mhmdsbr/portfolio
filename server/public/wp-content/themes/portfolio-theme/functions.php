<?php

// Register an optimized autoloader
spl_autoload_register(function ($classname) {
    $prefix = 'PORTFOLIO\\';
    
    if (strpos($classname, $prefix) !== 0) {
        return;
    }

    $relative_class = substr($classname, strlen($prefix));
    $path = dirname(__FILE__) . '/includes/' . str_replace('\\', '/', $relative_class) . '.php';
    
    if (file_exists($path)) {
        require_once $path;
    }
});

/**
 * Dependency Container Setup
 */
$dependencies = [
    'namespace' => 'portfolio/v2',
    'services' => [
        'acf_loader' => new PORTFOLIO\Services\ACFLoader(),
        'sanitizer' => new PORTFOLIO\Services\SanitizationService()
    ],
    'core' => [
        PORTFOLIO\Core\Cleaner::class,
        PORTFOLIO\Core\Enqueues::class,
        PORTFOLIO\Core\General::class,
        PORTFOLIO\Core\PostType::class
    ],
    'api' => [
        PORTFOLIO\Api\Config::class => ['acf_loader', 'sanitizer'],
        PORTFOLIO\Api\GeneralSettings::class => ['acf_loader', 'sanitizer'],
        PORTFOLIO\Api\Hero::class => ['acf_loader', 'sanitizer'],
        PORTFOLIO\Api\About::class => ['acf_loader', 'sanitizer'],
        PORTFOLIO\Api\Services::class => ['acf_loader', 'sanitizer'],
        PORTFOLIO\Api\Summary::class => ['acf_loader', 'sanitizer'],
        PORTFOLIO\Api\Projects::class => ['acf_loader', 'sanitizer'],
        PORTFOLIO\Api\Testimonial::class => ['acf_loader', 'sanitizer'],
        PORTFOLIO\Api\Contact::class => ['acf_loader', 'sanitizer'],
        PORTFOLIO\Api\NavMenu::class => ['sanitizer'],
        PORTFOLIO\Api\Mail::class => []
    ],
    'third_party' => [
        PORTFOLIO\ThirdParty\ACF::class
    ]
];

new PORTFOLIO\Api\ApiHandler($dependencies['namespace']);

foreach ($dependencies['core'] as $core_class) {
    new $core_class();
}

foreach ($dependencies['api'] as $api_class => $required_services) {
    $args = [$dependencies['namespace']];
    foreach ($required_services as $service) {
        $args[] = $dependencies['services'][$service];
    }
    new $api_class(...$args);
}

foreach ($dependencies['third_party'] as $third_party_class) {
    new $third_party_class();
}


// Handle CORS and preflight requests
add_action('init', function() {
    $origin = get_http_origin();
    if ($origin && in_array($origin, ['http://localhost:3000', 'https://mohammadsaber.com'])) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        
        if ('OPTIONS' == $_SERVER['REQUEST_METHOD']) {
            status_header(200);
            exit();
        }
    }
});

// Specifically handle REST API CORS
add_filter('rest_pre_serve_request', function($value) {
    header("Access-Control-Allow-Origin: " . get_http_origin());
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Credentials: true");
    return $value;
});
