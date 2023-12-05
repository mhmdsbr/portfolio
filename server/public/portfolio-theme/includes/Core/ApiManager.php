<?php

namespace portfolio-theme\includes\Core-theme\includes\Core-theme\includes\Core;

class ApiManager {
	protected string $namespace;

	public function __construct($namespace) {
		$this->namespace = $namespace;
		add_action('rest_api_init', array($this, 'register_routes'));
	}

	public function register_routes() {
		// Implement route registration logic here.
	}
}
