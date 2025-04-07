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
        'sanitizer' => new PORTFOLIO\Services\SanitizationService(),
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
        PORTFOLIO\Api\Mail::class => ['acf_loader', 'sanitizer']
    ],
    'third_party' => [
        PORTFOLIO\ThirdParty\ACF::class
    ]
];

// Initialize API Handler with security middleware
new PORTFOLIO\Api\ApiHandler($dependencies['namespace']);

// Initialize core classes
foreach ($dependencies['core'] as $core_class) {
    new $core_class();
}

// Initialize API classes with dependencies
foreach ($dependencies['api'] as $api_class => $required_services) {
    $args = [$dependencies['namespace']];
    foreach ($required_services as $service) {
        $args[] = $dependencies['services'][$service];
    }
    new $api_class(...$args);
}

// Initialize third-party integrations
foreach ($dependencies['third_party'] as $third_party_class) {
    new $third_party_class();
}