<?php

namespace PORTFOLIO\Api;

class Summary extends ApiHandler {
	public function register_routes(): void {
		register_rest_route($this->namespace, '/summary-portfolio', array(
			'methods'  => 'GET',
			'callback' => array($this, 'get_summary_settings'),
		));
	}

	public function get_summary_settings(): \WP_Error|\WP_REST_Response|\WP_HTTP_Response {
		$summary_title = get_field('summary_title', 'option');
		$summary_title_secondary = get_field('summary_overlay_title', 'option');
		$summary_button = get_field('summary_button', 'option');
		$summary_items = get_field('summary_items', 'option');
		$experience_items = get_field('experiences', 'option');
		$summaries = array();
		$experiences = array();
		foreach ($summary_items as $item) {
			$summaries[] = [
				'from' => $item['from'],
				'to' => $item['to'],
				'title' => $item['title'],
				'company' => $item['company'],
				'description' => $item['description']
			];
		};
		foreach ($experience_items as $item) {
			$experiences[] = [
				'skill' => $item['skill'],
				'level' => $item['level']
			];
		};

		$summary_settings = array(
			'summary_title' => $summary_title,
			'summary_title_overlay' => $summary_title_secondary,
			'summary_button' => $summary_button,
			'summaries' => $summaries,
			'experiences' => $experiences,
		);
		return rest_ensure_response($summary_settings);
	}
}
