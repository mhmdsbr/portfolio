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

/** Core */
// Instantiate and initialize Core classes
new EXP\Core\Cleaner();
new EXP\Core\Enqueues();
new EXP\Core\General();
new EXP\Core\PostType();
new EXP\Core\ApiManager("portfolio/v2");
new EXP\Core\GeneralSettings("portfolio/v2");
new EXP\Core\Hero("portfolio/v2");
new EXP\Core\About("portfolio/v2");
new EXP\Core\Services("portfolio/v2");
new EXP\Core\Summary("portfolio/v2");
new EXP\Core\Projects("portfolio/v2");
new EXP\Core\Testimonial("portfolio/v2");
new EXP\Core\Contact("portfolio/v2");

// Instantiate and initialize ThirdParty class
new EXP\ThirdParty\ACF();

// Define custom MIME types for SVG and SVGZ files
function cc_mime_types( $mimes ) {
	$mimes['svg']  = 'image/svg+xml';
	$mimes['svgz'] = 'image/svg+xml';

	return $mimes;
}

// Add the custom MIME types to WordPress
add_filter( 'upload_mimes', 'cc_mime_types' );

// Function to retrieve menu items for a custom REST API route
function custom_get_menu_items(): WP_Error|WP_REST_Response|WP_HTTP_Response {
	// Replace 'primary-menu' with your desired menu location.
	$menu_items = wp_get_nav_menu_items('primary-menu');

	return rest_ensure_response($menu_items);
}

// Register a custom REST API route for retrieving menu items
add_action('rest_api_init', function () {
	register_rest_route('portfolio/v2', '/menu-items', array(
		'methods' => 'GET',
		'callback' => 'custom_get_menu_items',
	));
});