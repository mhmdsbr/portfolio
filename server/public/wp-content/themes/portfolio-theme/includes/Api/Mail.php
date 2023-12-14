<?php

namespace PORTFOLIO\Api;

use WP_REST_Request;
use WP_REST_Response;

class Mail {
	protected string $namespace;
	public function __construct($namespace) {
		$this->namespace = $namespace;
		add_action('rest_api_init', array($this, 'register_routes'));
		add_action('phpmailer_init', [&$this, 'setupSmtp']);
	}
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

		add_action('phpmailer_init', [$this, 'setupSmtp']);

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

	/**
	 * Set up SMTP configuration
	 *
	 * @return void
	 */
	public function setupSmtp(): void
	{
		$smtp_credentials = array(
			'host'     => get_field('smtp_host', 'option'),
			'port'     => get_field('smtp_port', 'option'),
			'username' => get_field('smtp_username', 'option'),
			'password' => get_field('smtp_password', 'option'),
		);

		add_action('phpmailer_init', function ($phpmailer) use ($smtp_credentials) {
			$phpmailer->isSMTP();
			$phpmailer->Host       = $smtp_credentials['host'];
			$phpmailer->Port       = $smtp_credentials['port'];
			$phpmailer->SMTPAuth   = true;
			$phpmailer->Username   = $smtp_credentials['username'];
			$phpmailer->Password   = $smtp_credentials['password'];
			$phpmailer->SMTPSecure = 'ssl';
		});
	}

}