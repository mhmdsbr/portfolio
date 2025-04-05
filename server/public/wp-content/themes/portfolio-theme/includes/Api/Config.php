<?php

namespace PORTFOLIO\Api;

use PORTFOLIO\Services\ACFLoaderInterface;

class Config extends ApiHandler {
    private ACFLoaderInterface $acf_loader;

    public function __construct(string $namespace, ACFLoaderInterface $acf_loader) {
        parent::__construct($namespace);
        $this->acf_loader = $acf_loader;
        $this->add_route('/config-portfolio', 'POST', 'get_configs');
    }

    public function get_configs(): \WP_Error|\WP_REST_Response|\WP_HTTP_Response {
        return rest_ensure_response([
            'api_base_url' => $this->acf_loader->get_field('api_base_url', 'option'),
            'recaptcha'    => $this->acf_loader->get_field('recaptcha', 'option')
        ]);
    }
}