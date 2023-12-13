<?php

namespace PORTFOLIO\Api;

class TestimonialApi extends ApiHandler {
	public function register_routes(): void {
		register_rest_route($this->namespace, '/testimonial-portfolio', array(
			'methods'  => 'GET',
			'callback' => array($this, 'get_testimonial_settings'),
		));
	}

	public function get_testimonial_settings(): \WP_Error|\WP_REST_Response|\WP_HTTP_Response {
		$testimonial_title = get_field('testimonial_title', 'option');
		$testimonial_title_secondary = get_field('testimonial_overlay_title', 'option');
		$testimonial_items = get_field('testimonial_items', 'option');
		$testimonials = array();
		foreach ($testimonial_items as $item) {
			$testimonials[] = [
				'image' => $item['image'],
				'title' => $item['title'],
				'subtitle' => $item['subtitle'],
				'rating' => $item['rating'],
				'content' => $item['content'],
			];
		};

		$testimonial_settings = array(
			'testimonial_title' => $testimonial_title,
			'testimonial_title_overlay' => $testimonial_title_secondary,
			'testimonial' => $testimonials,
		);
		return rest_ensure_response($testimonial_settings);
	}
}
