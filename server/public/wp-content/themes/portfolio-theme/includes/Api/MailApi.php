<?php

namespace PORTFOLIO\Api;

class MailApi extends ApiHandler {
	public function register_routes(): void {
		register_rest_route($this->namespace, '/send-email', array(
			'methods'  => 'POST',
			'callback' => array($this, 'send_custom_email'),
		));
	}

	function send_custom_email(WP_REST_Request $request): WP_REST_Response {
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
}