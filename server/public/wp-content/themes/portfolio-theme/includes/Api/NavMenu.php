<?php

namespace Portfolio\Api;

class NavMenu extends ApiHandler {
	public function register_routes(): void {
		register_rest_route($this->namespace, '/menu-items', array(
			'methods'  => 'GET',
			'callback' => array($this, 'get_menu_items'),
		));
	}
	function get_menu_items(): \WP_Error|\WP_REST_Response|\WP_HTTP_Response {
		$menu_items = wp_get_nav_menu_items('primary-menu');
		return rest_ensure_response($menu_items);
	}

}
