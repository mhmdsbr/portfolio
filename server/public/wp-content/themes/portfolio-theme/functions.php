<?php

// Register an autoloader function to load classes dynamically
spl_autoload_register( function ( $classname ) {
	$parts = explode( '\\', $classname );
	array_shift( $parts );
	$path      = implode( DIRECTORY_SEPARATOR, $parts );
	$classpath = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . $path . '.php';
	if ( file_exists( $classpath ) ) {
		include_once $classpath;
	}
} );

/** Core **/
new PORTFOLIO\Core\Cleaner();
new PORTFOLIO\Core\Enqueues();
new PORTFOLIO\Core\General();
new PORTFOLIO\Core\PostType();

/** Api **/
new PORTFOLIO\Api\ApiHandler("portfolio/v2");
new PORTFOLIO\Api\Config("portfolio/v2");
new PORTFOLIO\Api\GeneralSettings("portfolio/v2");
new PORTFOLIO\Api\NavMenu("portfolio/v2");
new PORTFOLIO\Api\Hero("portfolio/v2");
new PORTFOLIO\Api\About("portfolio/v2");
new PORTFOLIO\Api\Services("portfolio/v2");
new PORTFOLIO\Api\Summary("portfolio/v2");
new PORTFOLIO\Api\Projects("portfolio/v2");
new PORTFOLIO\Api\Testimonial("portfolio/v2");
new PORTFOLIO\Api\Contact("portfolio/v2");
new PORTFOLIO\Api\Mail("portfolio/v2");

/** ThirdParty **/
new PORTFOLIO\ThirdParty\ACF();

// Handle CORS and preflight requests
add_action('init', function() {
    $origin = get_http_origin();
    if ($origin && in_array($origin, ['http://localhost:3000', 'https://yourproductiondomain.com'])) {
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