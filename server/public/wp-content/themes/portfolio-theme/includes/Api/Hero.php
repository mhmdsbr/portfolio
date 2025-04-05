<?php

namespace PORTFOLIO\Api;

use PORTFOLIO\Services\ACFLoaderInterface;

class Hero extends ApiHandler {
    private ACFLoaderInterface $acf_loader;

    public function __construct(
        string $namespace,
        ACFLoaderInterface $acf_loader
    ) {
        parent::__construct($namespace);
        $this->acf_loader = $acf_loader;
        
        $this->add_route(
            '/hero-portfolio',
            'GET',
            'get_hero_settings'
        );
    }

    public function get_hero_settings(): \WP_Error|\WP_REST_Response|\WP_HTTP_Response {
        // Get all fields through ACF loader
        $hero_titles = $this->acf_loader->get_field('hero_titles', 'option');
        $hero_button = $this->acf_loader->get_field('hero_button', 'option');
        $hero_location = $this->acf_loader->get_field('hero_location', 'option');
        $hero_background_image = $this->acf_loader->get_field('hero_background_image', 'option');

        // Process repeater field
        $hero_titles_data = [];
        if (is_array($hero_titles)) {
            foreach ($hero_titles as $hero_title) {
                if (isset($hero_title['hero_title'])) {
                    $hero_titles_data[] = $hero_title['hero_title'];
                }
            }
        }

        return rest_ensure_response([
            'titles' => $hero_titles_data,
            'button' => $hero_button,
            'location' => $hero_location,
            'background_image' => $hero_background_image,
        ]);
    }
}