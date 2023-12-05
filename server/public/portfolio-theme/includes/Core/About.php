<?php

namespace portfolio-theme\includes\Core;

use portfolioclass About extends ApiManager {
	public function register_routes(): void {
		register_rest_route($this->namespace, '/about-portfolio', array(
			'methods'  => 'GET',
			'callback' => array($this, 'get_about_settings'),
		));
	}

	public function get_about_settings(): \WP_Error|\WP_REST_Response|\WP_HTTP_Response {
		$about_title = get_field('about_title', 'option');
		$about_title_secondary = get_field('about_overlay_title', 'option');
		$about_job_title = get_field('about_job_title', 'option');
		$about_name = get_field('about_name', 'option');
		$about_button = get_field('about_button', 'option');
		$about_description = get_field('about_description', 'option');
		$about_contact = get_field('about_contact_information', 'option');
		$about_contact_information = array();
		foreach ($about_contact as $item) {
			$about_contact_information[] = [
				'title' => $item['title'],
				'content' => $item['content']
			];
		};
		$about_details = get_field('about_details', 'option');
		$about_details_information = array();
		foreach ($about_details as $item) {
			$about_details_information[] = [
				'title' => $item['title'],
				'content' => $item['number']
			];
		};

		$about_settings = array(
			'about_title' => $about_title,
			'about_title_overlay' => $about_title_secondary,
			'about_job_title' => $about_job_title,
			'about_name' => $about_name,
			'about_button' => $about_button,
			'about_description' => $about_description,
			'about_contact_info' => $about_contact_information,
			'about_details' => $about_details_information
		);
		return rest_ensure_response($about_settings);
	}
}
