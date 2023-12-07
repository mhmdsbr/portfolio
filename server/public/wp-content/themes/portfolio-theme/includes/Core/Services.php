<?php

namespace PORTFOLIO\Core;


class Services extends ApiManager {
	public function register_routes(): void {
		register_rest_route($this->namespace, '/services-portfolio', array(
			'methods'  => 'GET',
			'callback' => array($this, 'get_services_settings'),
		));
	}

	public function get_services_settings(): \WP_Error|\WP_REST_Response|\WP_HTTP_Response {
		$services_title = get_field('services_title', 'option');
		$services_title_secondary = get_field('services_overlay_title', 'option');
		$services_items = get_field('service_items', 'option');
		$services = array();
		foreach ($services_items as $item) {
			$services[] = [
				'title' => $item['title'],
				'content' => $item['content'],
				'icon' => $item['icon']
			];
		};

		$services_settings = array(
			'services_title' => $services_title,
			'services_title_overlay' => $services_title_secondary,
			'services' => $services,
		);
		return rest_ensure_response($services_settings);
	}
}
