<?php

namespace PORTFOLIO\Api;

class Config extends ApiHandler {
	public function register_routes(): void {
		register_rest_route($this->namespace, '/config-portfolio', array(
			'methods'  => 'GET',
			'callback' => array($this, 'get_configs'),
		));
	}

	public function get_configs(): \WP_Error|\WP_REST_Response|\WP_HTTP_Response {
		$apiBaseUrl = get_field('api_base_url', 'option');
		$recaptcha = get_field('recaptcha', 'option');

		$api_configs = array(
			'api_base_url' => $apiBaseUrl,
			'recaptcha' => $recaptcha,

		);
		return rest_ensure_response($api_configs);
	}
}
