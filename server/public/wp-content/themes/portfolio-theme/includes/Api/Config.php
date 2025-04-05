<?php

namespace PORTFOLIO\Api;

use PORTFOLIO\Services\ACFLoaderInterface;
use PORTFOLIO\Services\SanitizationService;
use WP_Error;
use WP_REST_Response;
use WP_HTTP_Response;

class Config extends ApiHandler {
    private ACFLoaderInterface $acf_loader;
    private SanitizationService $sanitizer;

    private const FIELD_API_BASE_URL = 'api_base_url';
    private const FIELD_RECAPTCHA = 'recaptcha';

    public function __construct(
        string $namespace,
        ACFLoaderInterface $acf_loader,
        SanitizationService $sanitizer
    ) {
        parent::__construct($namespace);
        $this->acf_loader = $acf_loader;
        $this->sanitizer = $sanitizer;
        
        $this->add_route(
            '/config-portfolio',
            'POST',
            'get_configs'
        );
    }

    public function get_configs(): WP_Error|WP_REST_Response|WP_HTTP_Response {
        return rest_ensure_response([
            'api_base_url' => $this->sanitizer->url(
                $this->acf_loader->get_field(self::FIELD_API_BASE_URL, 'option') ?: ''
            ),
            'recaptcha' => $this->sanitizer->text(
                $this->acf_loader->get_field(self::FIELD_RECAPTCHA, 'option') ?: ''
            )
        ]);
    }
}