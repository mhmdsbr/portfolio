<?php

namespace PORTFOLIO\Api;

use PORTFOLIO\Services\ACFLoaderInterface;

class Projects extends ApiHandler {
    private ACFLoaderInterface $acf_loader;

    public function __construct(
        string $namespace,
        ACFLoaderInterface $acf_loader
    ) {
        parent::__construct($namespace);
        $this->acf_loader = $acf_loader;
        
        $this->add_route(
            '/projects-portfolio',
            'GET',
            'get_projects_settings'
        );
    }

    public function get_projects_settings($request): \WP_Error|\WP_REST_Response|\WP_HTTP_Response {

        $portfolio_title = $this->acf_loader->get_field('portfolio_title', 'option');
        $portfolio_title_secondary = $this->acf_loader->get_field('portfolio_overlay_title', 'option');
        
        $projects = get_posts([
            'post_type' => 'project',
            'numberposts' => -1,
            'fields' => 'ids',
            'no_found_rows' => true,
        ]);

        $project_data = array_map(function($project_id) {
            $project = get_post($project_id);
            
            return [
                'post_id' => $project_id,
                'title' => get_the_title($project),
                'project_types' => wp_get_post_terms($project_id, 'project-type', ['fields' => 'names']),
                'featured_image' => get_the_post_thumbnail_url($project_id, 'full'),
                'permalink' => get_permalink($project_id),
            ];
        }, $projects);

        return rest_ensure_response([
            'portfolio_title' => $portfolio_title,
            'portfolio_overlay_title' => $portfolio_title_secondary,
            'projects' => $project_data,
        ]);
    }
}