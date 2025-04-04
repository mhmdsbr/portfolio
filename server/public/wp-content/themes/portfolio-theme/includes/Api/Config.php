<?php

namespace PORTFOLIO\Api;

class Config extends ApiHandler {
    public function __construct($namespace) {
        parent::__construct($namespace);
        
        // Add routes during initialization
        $this->add_route(
            '/config-portfolio',
            'POST',
            'get_configs'
        );
    }

    public function get_configs(): \WP_Error|\WP_REST_Response|\WP_HTTP_Response {
        $apiBaseUrl = get_field('api_base_url', 'option');
        $recaptcha = get_field('recaptcha', 'option');

        $api_configs = [
            'api_base_url' => $apiBaseUrl,
            'recaptcha'    => $recaptcha,
        ];

        return rest_ensure_response($api_configs);
    }
}