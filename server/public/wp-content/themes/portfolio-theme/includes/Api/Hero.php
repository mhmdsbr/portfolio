<?php

namespace PORTFOLIO\Api;

class Hero extends ApiHandler {
	public function register_routes(): void {
		register_rest_route($this->namespace, '/hero-portfolio', array(
			'methods'  => 'GET',
			'callback' => array($this, 'get_hero_settings'),
		));
	}

	public function get_hero_settings(): \WP_Error|\WP_REST_Response|\WP_HTTP_Response {
		// Retrieve values from the repeater field 'hero_titles'
		$hero_titles = get_field('hero_titles', 'option');

		// Initialize an array to store hero title values
		$hero_titles_data = array();

		foreach ($hero_titles as $hero_title) {
			$hero_titles_data[] = $hero_title['hero_title'];
		}

		// Retrieve other hero settings
		$hero_button = get_field('hero_button', 'option');
		$hero_location = get_field('hero_location', 'option');
		$hero_background_image = get_field('hero_background_image', 'option');

		// Create an array with all the hero settings
		$hero_settings = array(
			'titles' => $hero_titles_data,
			'button' => $hero_button,
			'location' => $hero_location,
			'background_image' => $hero_background_image,
		);

		// Return the hero settings as JSON
		return rest_ensure_response($hero_settings);
	}
}
