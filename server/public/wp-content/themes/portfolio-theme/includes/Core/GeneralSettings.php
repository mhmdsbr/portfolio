<?php

namespace PORTFOLIO\Core;

class GeneralSettings extends ApiManager {

	public function register_routes(): void {
		register_rest_route($this->namespace, '/general-portfolio', array(
			'methods'  => 'GET',
			'callback' => array($this, 'get_general_settings'),
		));
	}

	public function get_general_settings(): \WP_Error|\WP_REST_Response|\WP_HTTP_Response {

		$global_linkedin = get_field('linkedin', 'option');
		$global_github = get_field('github', 'option');
		$global_twitter = get_field('twitter', 'option');
		$global_mail = get_field('mail', 'option');
		$profile_image = get_field('profile_image', 'option');
		$profile_title = get_field('profile_title', 'option');
		$terms_policies = get_field('terms_policies', 'option');
		$disclaimer = get_field('disclaimer', 'option');

		$global_settings = array(
			'linkedin' => $global_linkedin,
			'github' => $global_github,
			'twitter' => $global_twitter,
			'google' => $global_mail,
			'profile_image' => $profile_image,
			'profile_title' => $profile_title,
			'terms' => $terms_policies,
			'disclaimer' => $disclaimer
		);

		return rest_ensure_response($global_settings);
	}
}
