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

add_action('rest_api_init', function () {
	register_rest_route('portfolio/v2', '/send-email/', array(
		'methods'  => 'POST',
		'callback' => 'send_custom_email',
	));
});

function send_custom_email(WP_REST_Request $request) {
	// Get data from the request
	$data = $request->get_json_params();

	// Example: Validate required fields
	if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
		return new WP_Error('invalid_params', 'Name, email, and message are required.', array('status' => 400));
	}

	// Use the configured SMTP settings
	add_action( 'phpmailer_init', 'configure_smtp' );
	function configure_smtp( $phpmailer ) {
		$phpmailer->isSMTP();
		$phpmailer->Host       = 'mail.mohammadsaber.com';
		$phpmailer->Port       = 465;
		$phpmailer->SMTPAuth   = true;
		$phpmailer->Username   = 'info@mohammadsaber.com';
		$phpmailer->Password   = ')~4I62#hIGr&';
		$phpmailer->SMTPSecure = 'ssl';
	}

	// Compose email
	$to = 'saaber.mohamad@gmail.com';
	$subject = 'Contact Form Submission';
	$message = "Name: {$data['name']}<br>Email: {$data['email']}<br>Message: {$data['message']}";
	$headers = array('Content-Type: text/html; charset=UTF-8');

	// Send email
	$result = wp_mail($to, $subject, $message, $headers);

	// Return response based on email sending result
	if ($result) {
		return new WP_REST_Response(array('message' => 'Email sent successfully!'), 200);
	} else {
		return new WP_Error('email_send_failed', 'Failed to send email. Check your SMTP settings.', array('status' => 500));
	}
}
