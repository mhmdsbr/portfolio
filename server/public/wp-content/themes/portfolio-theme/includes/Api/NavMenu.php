<?php

namespace PORTFOLIO\Api;

use PORTFOLIO\Services\SanitizationService;
use WP_Error;
use WP_REST_Response;
use WP_HTTP_Response;

class NavMenu extends ApiHandler {
    private SanitizationService $sanitizer;
    private const MENU_SLUG = 'primary-menu';

    public function __construct(
        string $namespace,
        SanitizationService $sanitizer
    ) {
        parent::__construct($namespace);
        $this->sanitizer = $sanitizer;
        
        $this->add_route(
            '/menu-items',
            'GET',
            'get_menu_items'
        );
    }

    public function get_menu_items(): WP_Error|WP_REST_Response|WP_HTTP_Response {
        $menu_items = wp_get_nav_menu_items(self::MENU_SLUG);
        return rest_ensure_response($this->process_menu_items($menu_items ?: []));
    }

    private function process_menu_items(array $items): array {
        $processed = [];
        
        foreach ($items as $item) {
            if (!is_object($item)) {
                continue;
            }

            $processed[] = [
                'ID' => $this->sanitizer->int($item->ID),
                'title' => $this->sanitizer->text($item->title),
                'url' => $this->sanitizer->url($item->url),
                'target' => $this->sanitizer->text($item->target),
                'classes' => $item->classes,
                'menu_item_parent' => $this->sanitizer->int($item->menu_item_parent),
                'order' => $this->sanitizer->int($item->menu_order)
            ];
        }

        return $processed;
    }

}