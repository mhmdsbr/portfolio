<?php

namespace PORTFOLIO\Api;

use PORTFOLIO\Services\ACFLoaderInterface;
use PORTFOLIO\Services\SanitizationService;
use WP_Error;
use WP_REST_Response;
use WP_HTTP_Response;

class Projects extends ApiHandler {
    private ACFLoaderInterface $acf_loader;
    private SanitizationService $sanitizer;

    private const FIELD_TITLE = 'portfolio_title';
    private const FIELD_OVERLAY_TITLE = 'portfolio_overlay_title';
    private const POST_TYPE = 'project';
    private const TAXONOMY = 'project-type';

    public function __construct(
        string $namespace,
        ACFLoaderInterface $acf_loader,
        SanitizationService $sanitizer
    ) {
        parent::__construct($namespace);
        $this->acf_loader = $acf_loader;
        $this->sanitizer = $sanitizer;

        $this->add_route(
            '/projects-portfolio',
            'GET',
            'get_projects_settings'
        );
    }

    public function get_projects_settings(): WP_Error|WP_REST_Response|WP_HTTP_Response {
        return rest_ensure_response([
            'portfolio_title' => $this->sanitizer->text($this->acf_loader->get_field(self::FIELD_TITLE, 'option') ?: ''),
            'portfolio_overlay_title' => $this->sanitizer->text($this->acf_loader->get_field(self::FIELD_OVERLAY_TITLE, 'option') ?: ''),
            'projects' => $this->get_projects_data()
        ]);
    }

    private function get_projects_data(): array {
        $project_ids = get_posts([
            'post_type' => self::POST_TYPE,
            'numberposts' => -1,
            'fields' => 'ids',
            'no_found_rows' => true,
            'update_post_meta_cache' => false,
            'update_post_term_cache' => false
        ]);

        $projects = [];

        foreach ($project_ids as $project_id) {
            $projects[] = [
                'post_id' => $this->sanitizer->int($project_id),
                'title' => $this->sanitizer->text(get_the_title($project_id)),
                'project_types' => $this->sanitizer->terms(wp_get_post_terms($project_id, self::TAXONOMY, ['fields' => 'all'])),
                'featured_image' => $this->sanitizer->url(get_the_post_thumbnail_url($project_id, 'full') ?: ''),
                'permalink' => $this->sanitizer->url(get_permalink($project_id) ?: '')
            ];
        }

        return $projects;
    }

}