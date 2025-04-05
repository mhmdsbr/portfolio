<?php

namespace PORTFOLIO\Api;

use PORTFOLIO\Services\ACFLoaderInterface;

class GeneralSettings extends ApiHandler {
    private ACFLoaderInterface $acf_loader;

    public function __construct(
        string $namespace,
        ACFLoaderInterface $acf_loader
    ) {
        parent::__construct($namespace);
        $this->acf_loader = $acf_loader;
        
        $this->add_route(
            '/general-portfolio',
            'GET',
            'get_general_settings'
        );
    }

    public function get_general_settings(): \WP_Error|\WP_REST_Response|\WP_HTTP_Response {
        return rest_ensure_response([
            'social_links' => [
                'linkedin' => $this->acf_loader->get_field('linkedin', 'option'),
                'github' => $this->acf_loader->get_field('github', 'option'),
                'twitter' => $this->acf_loader->get_field('twitter', 'option'),
                'email' => $this->acf_loader->get_field('mail', 'option')
            ],
            'profile' => [
                'image' => $this->acf_loader->get_field('profile_image', 'option'),
                'title' => $this->acf_loader->get_field('profile_title', 'option')
            ],
            'legal' => [
                'terms' => $this->acf_loader->get_field('terms_policies', 'option'),
                'disclaimer' => $this->acf_loader->get_field('disclaimer', 'option')
            ]
        ]);
    }
}