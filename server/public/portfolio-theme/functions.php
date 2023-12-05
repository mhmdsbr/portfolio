<?php

// Register an autoloader function to load classes dynamically
spl_autoload_register( function ( $classname ) {
	$parts = explode( '\\', $classname );
	array_shift( $parts );
	$path      = implode( DIRECTORY_SEPARATOR, $parts );
	$classpath = functions . phpdirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . $path . '.php';
	if ( file_exists( $classpath ) ) {
		include_once $classpath;
	}
} );

/** Core */
// Instantiate and initialize Core classes
new theme\includes\Core\Cleaner();
new theme\includes\Core\Enqueues();
new theme\includes\Core\General();
new theme\includes\Core\PostType();
new theme\includes\Core\ApiManager("portfolio/v2");
new theme\includes\Core\GeneralSettings("portfolio/v2");
new theme\includes\Core\Hero("portfolio/v2");
new theme\includes\Core\About("portfolio/v2");
new theme\includes\Core\Services("portfolio/v2");
new theme\includes\Core\Summary("portfolio/v2");
new theme\includes\Core\Projects("portfolio/v2");
new theme\includes\Core\Testimonial("portfolio/v2");
new theme\includes\Core\Contact("portfolio/v2");

// Instantiate and initialize ThirdParty class
new theme\includes\ThirdParty\ACF();

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

// Use a filter to modify the "From" name and email address for outgoing emails
add_filter('wp_mail_from', 'custom_wp_mail_from');
add_filter('wp_mail_from_name', 'custom_wp_mail_from_name');

function custom_wp_mail_from($original_email_address) {
	// Get the site admin email address
	$admin_email = get_option('admin_email');

	return $admin_email;
}

function custom_wp_mail_from_name($original_email_from) {
	// Get the site name
	$site_name = get_bloginfo('name');

	return $site_name;
}

function send_custom_email(WP_REST_Request $request) {
	$data = $request->get_json_params();

	if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
		return new WP_REST_Response(array('success' => false, 'message' => 'Name, email, and message are required.'), 400);
	}

	$name = sanitize_text_field($data['name']);
	$email = sanitize_email($data['email']);
	$message = wp_kses_post($data['message']);

	add_action('phpmailer_init', 'configure_smtp');

	$to = 'saaber.mohamad@gmail.com';
	$subject = 'Portfolio Message';
	$message = "Name: $name<br>Email: $email<br>Message: $message";
	$headers = array('Content-Type: text/html; charset=UTF-8');

	$result = wp_mail($to, $subject, $message, $headers);

	if ($result) {
		return new WP_REST_Response(array('success' => true, 'message' => 'Email sent successfully!'), 200);
	} else {
		return new WP_REST_Response(array('success' => false, 'message' => 'Failed to send email. Please try again later'), 500);
	}
}

add_action('phpmailer_init', 'configure_smtp');

function configure_smtp($phpmailer) {
	$phpmailer->isSMTP();
	$phpmailer->Host       = 'mail.mohammadsaber.com';
	$phpmailer->Port       = 465;
	$phpmailer->SMTPAuth   = true;
	$phpmailer->Username   = 'info@mohammadsaber.com';
	$phpmailer->Password   = ')~4I62#hIGr&';
	$phpmailer->SMTPSecure = 'ssl';
}
