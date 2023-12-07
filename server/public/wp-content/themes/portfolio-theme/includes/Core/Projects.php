<?php

namespace PORTFOLIO\Core;

class Projects extends ApiManager {
	public function register_routes(): void {
		register_rest_route($this->namespace, '/projects-portfolio', array(
			'methods'  => 'GET',
			'callback' => array($this, 'get_projects_settings'),
		));
	}

	public function get_projects_settings($request): \WP_Error|\WP_REST_Response|\WP_HTTP_Response {
		$portfolio_title = get_field('portfolio_title', 'option');
		$portfolio_title_secondary = get_field('portfolio_overlay_title', 'option');
		$projects = get_posts(array(
			'post_type' => 'project',
			'numberposts' => -1,
		));

		$project_data = array();

		foreach ($projects as $project) {
			$project_id = $project->ID;
			$title = get_the_title($project);
			$project_types = wp_get_post_terms($project_id, 'project-type');
			$featured_image_url = get_the_post_thumbnail_url($project, 'full');
			$project_data[] = array(
				'post_id' => $project_id,
				'title' => $title,
				'project_types' => $project_types,
				'featured_image' => $featured_image_url,
			);
		}

		$project_settings = array(
			'portfolio_title' => $portfolio_title,
			'portfolio_overlay_title' => $portfolio_title_secondary,
			'project_data' => $project_data,
		);

		return rest_ensure_response($project_settings);
	}

}
