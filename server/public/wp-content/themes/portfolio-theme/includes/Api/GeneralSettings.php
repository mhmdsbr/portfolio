<?php


namespace PORTFOLIO\Api;

use PORTFOLIO\Services\ACFLoaderInterface;
use PORTFOLIO\Services\SanitizationService;
use WP_Error;
use WP_REST_Response;
use WP_HTTP_Response;

class GeneralSettings extends ApiHandler {
    private ACFLoaderInterface $acf_loader;
    private SanitizationService $sanitizer;

    // Field name constants
    private const FIELD_LINKEDIN = 'linkedin';
    private const FIELD_GITHUB = 'github';
    private const FIELD_TWITTER = 'twitter';
    private const FIELD_EMAIL = 'mail';
    private const FIELD_PROFILE_IMAGE = 'profile_image';
    private const FIELD_PROFILE_TITLE = 'profile_title';
    private const FIELD_TERMS = 'terms_policies';
    private const FIELD_DISCLAIMER = 'disclaimer';

    public function __construct(
        string $namespace,
        ACFLoaderInterface $acf_loader,
        SanitizationService $sanitizer
    ) {
        parent::__construct($namespace);
        $this->acf_loader = $acf_loader;
        $this->sanitizer = $sanitizer;

        $this->add_route(
            '/general-portfolio',
            'GET',
            'get_general_settings'
        );
    }

    public function get_general_settings(): \WP_Error|\WP_REST_Response|\WP_HTTP_Response {
        return rest_ensure_response([
            'social_links' => [
                'linkedin' => $this->sanitizer->url($this->acf_loader->get_field(self::FIELD_LINKEDIN, 'option') ?: ''),
                'github' => $this->sanitizer->url($this->acf_loader->get_field(self::FIELD_GITHUB, 'option') ?: ''),
                'twitter' => $this->sanitizer->url($this->acf_loader->get_field(self::FIELD_TWITTER, 'option') ?: ''),
                'email' => $this->sanitizer->email($this->acf_loader->get_field(self::FIELD_EMAIL, 'option') ?: ''),
            ],
            'profile' => [
                'image' => $this->acf_loader->get_field(self::FIELD_PROFILE_IMAGE, 'option'),
                'title' => $this->sanitizer->text($this->acf_loader->get_field(self::FIELD_PROFILE_TITLE, 'option') ?: '')
            ],
            'legal' => [
                'terms' => $this->sanitizer->text($this->acf_loader->get_field(self::FIELD_TERMS, 'option') ?: ''),
                'disclaimer' => $this->sanitizer->text($this->acf_loader->get_field(self::FIELD_DISCLAIMER, 'option') ?: '')
            ]
        ]);
    }
}