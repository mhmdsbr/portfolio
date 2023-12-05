<?php

namespace portfolio-theme\includes\Core;

use portfolioclass Contact extends ApiManager {
	public function register_routes(): void {
		register_rest_route($this->namespace, '/contact-portfolio', array(
			'methods'  => 'GET',
			'callback' => array($this, 'get_contact_settings'),
		));
	}

	public function get_contact_settings(): \WP_Error|\WP_REST_Response|\WP_HTTP_Response {
		$contact_title = get_field('contact_title', 'option');
		$contact_title_secondary = get_field('contact_overlay_title', 'option');
		$contact_form_title = get_field('contact_form_title', 'option');
		$contact_button = get_field('contact_button', 'option');
		$contact_info_title = get_field('contact_info_title', 'option');
		$contact_info_address = get_field('contact_info_address', 'option');
		$contact_info_phone = get_field('contact_info_phone', 'option');
		$contact_info_email = get_field('contact_info_email', 'option');

		$contact_settings = array(
			'contact_title' => $contact_title,
			'contact_title_overlay' => $contact_title_secondary,
			'contact_form_title' => $contact_form_title,
			'contact_button' => $contact_button,
			'contact_info_title' => $contact_info_title,
			'contact_info_address' => $contact_info_address,
			'contact_info_phone' => $contact_info_phone,
			'contact_info_email' => $contact_info_email
		);
		return rest_ensure_response($contact_settings);
	}
}
