<?php

namespace PORTFOLIO\Api;

use PORTFOLIO\Services\ACFLoaderInterface;
use PORTFOLIO\Services\SanitizationService;
use WP_Error;
use WP_REST_Response;
use WP_HTTP_Response;

class Hero extends ApiHandler {
    private ACFLoaderInterface $acf_loader;
    private SanitizationService $sanitizer;

    private const FIELD_TITLES = 'hero_titles';
    private const FIELD_BUTTON = 'hero_button';
    private const FIELD_LOCATION = 'hero_location';
    private const FIELD_BACKGROUND = 'hero_background_image';

    public function __construct(
        string $namespace,
        ACFLoaderInterface $acf_loader,
        SanitizationService $sanitizer
    ) {
        parent::__construct($namespace);
        $this->acf_loader = $acf_loader;
        $this->sanitizer = $sanitizer;
        
        $this->add_route(
            '/hero-portfolio',
            'GET',
            'get_hero_settings'
        );

    }

    public function get_hero_settings(): WP_Error|WP_REST_Response|WP_HTTP_Response {
        return rest_ensure_response([
            'titles' => $this->process_titles(),
            'button' => $this->acf_loader->get_field(self::FIELD_BUTTON, 'option') ?: [],
            'location' => $this->sanitizer->text($this->acf_loader->get_field(self::FIELD_LOCATION, 'option') ?: ''),
            'background_image' => $this->acf_loader->get_field(self::FIELD_BACKGROUND, 'option')
        ]);
    }

    private function process_titles(): array {
        $titles = $this->acf_loader->get_field(self::FIELD_TITLES, 'option') ?: [];
        $processed = [];
        
        foreach ($titles as $title) {
            if (!is_array($title)) {
                continue;
            }
            
            $processed[] = $this->sanitizer->text($title['hero_title'] ?? '');
        }

        return $processed;
    }

}