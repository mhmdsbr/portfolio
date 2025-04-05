<?php

namespace PORTFOLIO\Api;

class NavMenu extends ApiHandler {
    public function __construct(string $namespace) {
        parent::__construct($namespace);
        
        $this->add_route(
            '/menu-items',
            'GET',
            'get_menu_items'
        );
    }

    public function get_menu_items(): \WP_Error|\WP_REST_Response|\WP_HTTP_Response {
        $menu_items = wp_get_nav_menu_items('primary-menu');
        
        $formatted_items = array_map(function($item) {
            return [
                'ID' => $item->ID,
                'title' => $item->title,
                'url' => $item->url,
                'target' => $item->target,
                'classes' => $item->classes,
                'menu_item_parent' => $item->menu_item_parent,
                'order' => $item->menu_order
            ];
        }, $menu_items ?: []);

        return rest_ensure_response($formatted_items);
    }
}