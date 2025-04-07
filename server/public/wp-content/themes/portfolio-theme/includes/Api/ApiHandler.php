<?php

namespace PORTFOLIO\Api;

use PORTFOLIO\Services\SecurityMiddleware;

class ApiHandler {
    protected string $namespace;
    protected array $routes = [];

    public function __construct($namespace) {
        $this->namespace = $namespace;

        // Initialize security middleware
        SecurityMiddleware::init();

        add_action('rest_api_init', [$this, 'register_routes']);
    }

    /**
     * Add a route to the registration queue
     */
    protected function add_route(
        string $endpoint,
        string $method,
        string $callback,
        array $args = []
    ): void {
        $this->routes[] = [
            'endpoint' => $endpoint,
            'method'   => $method,
            'callback' => $callback,
            'args'     => $args,
            'permission_callback' => [SecurityMiddleware::class, 'validate_request']
        ];
    }

    /**
     * Register all queued routes
     */
    public function register_routes(): void {
        foreach ($this->routes as $route) {
            register_rest_route(
                $this->namespace,
                $route['endpoint'],
                [
                    'methods'  => $route['method'],
                    'callback' => [$this, $route['callback']],
                    'args'     => $route['args'],
                    'permission_callback' => $route['permission_callback']
                ]
            );
        }
    }
}