<?php
/**
 * Class to remove unwanted or weirdly configured settings that are automatically done by WordPress
 */
namespace EXP\Core;

class Cleaner
{
    protected $wp_admin_bar;

    public function __construct()
    {
        global $wp_admin_bar;
        $this->wp_admin_bar = &$wp_admin_bar;

        /** Cleanup in <head> tag */
        add_action('init', [$this, 'headCleanup']);

        /** Remove the WordPress version from RSS feeds */
        add_filter('the_generator', '__return_false');

        /** Completely disable XML-RPC */
        add_filter('xmlrpc_enabled', '__return_false');

        /** Completely disable attachment permalinks */
        add_filter('attachment_link', '__return_false');

        /** REST API */
//        add_filter('rest_authentication_errors', [&$this, 'restApiAuth'], 20);

        /** Admin bar */
        add_action('wp_before_admin_bar_render', [&$this, 'removeAdminBarItems']);

        /** Dashboard widgets */
        add_action('admin_init', [&$this, 'removeDashboardWidgets']);

        /** Style loader tag */
        add_filter('style_loader_tag', [&$this, 'cleanStyleLoaderTag'], 10, 3);

        /** Script loader tag */
        add_filter('script_loader_tag', [&$this, 'cleanScriptLoaderTag'], 10, 3);

        /** Default Gutenberg styling */
        add_action('wp_print_styles', [&$this, 'removeGutenbergStyling']);

        /** Remove default modules */
        add_action('admin_menu', [&$this, 'removeModules']);

        remove_filter( 'the_content', 'wpautop' );
        remove_filter( 'the_excerpt', 'wpautop' );
    }

    /**
     * Calling all the remove functions for various standard inclusions made by WordPress
     *
     * @return void
     */
    public function headCleanup() : void
    {
        /** General WP stuff */
        remove_action('wp_head', 'wp_generator');
        remove_action('wp_head', 'wp_shortlink_wp_head', 10);
        remove_action('template_redirect', 'wp_shortlink_header', 11);

        /** Real Simple Discovery & Windows Live Writer */
        remove_action('wp_head', 'rsd_link');
        remove_action('wp_head', 'wlwmanifest_link');

        /** Emoji */
        remove_action('wp_head', 'print_emoji_detection_script', 7);
        remove_action('wp_print_styles', 'print_emoji_styles');

        /** Next & Previous links */
        remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10);

        /** RSS */
        remove_action('wp_head', 'feed_links', 2);
        remove_action('wp_head', 'feed_links_extra', 3);

        /** REST API links & headers */
        remove_action('xmlrpc_rsd_apis', 'rest_output_rsd');
        remove_action('template_redirect', 'rest_output_link_header', 11);
        remove_action('wp_head', 'rest_output_link_wp_head', 10);

        /** oEmbed */
        remove_action('wp_head', 'wp_oembed_add_discovery_links');
        remove_action('wp_head', 'wp_oembed_add_host_js');
        remove_action('wp_head', 'wp_oembed_register_route');
        remove_action('oembed_dataparse', 'wp_filter_oembed_result');

        /** Resource hinting */
        remove_action('wp_head', 'wp_resource_hints', 2);
    }

    /**
     * Disabling REST API for users not logged in.
     * WordPress depends too much on the API to disable site-wide.
     *
     * @link https://core.trac.wordpress.org/ticket/38446
     * @param $access
     *
     * @return \WP_Error|null|boolean
     */
    public function restApiAuth($access)
    {
        if (! is_user_logged_in()) {
            return new \WP_Error('rest_cannot_access', 'Only authenticated users can access the REST API.', [
                'status' => rest_authorization_required_code(),
            ]);
        }

        return $access;
    }

    /**
     * Remove Admin bar items
     *
     * @return void
     */
    public function removeAdminBarItems() : void
    {
        $this->wp_admin_bar->remove_node('wp-logo');
        $this->wp_admin_bar->remove_node('new-content');
        $this->wp_admin_bar->remove_node('customize');
        $this->wp_admin_bar->remove_node('search');
    }

    /**
     * Remove dashboard widgets
     *
     * @return void
     */
    public function removeDashboardWidgets() : void
    {
        remove_action('welcome_panel', 'wp_welcome_panel');

        remove_meta_box('dashboard_incoming_links', 'dashboard', 'normal');
        remove_meta_box('dashboard_plugins', 'dashboard', 'normal');
        remove_meta_box('dashboard_primary', 'dashboard', 'side');
        remove_meta_box('dashboard_secondary', 'dashboard', 'normal');
        remove_meta_box('dashboard_quick_press', 'dashboard', 'side');
        remove_meta_box('dashboard_recent_drafts', 'dashboard', 'side');
        remove_meta_box('dashboard_recent_comments', 'dashboard', 'normal');
        remove_meta_box('rg_forms_dashboard', 'dashboard', 'side');
        remove_meta_box('dashboard_site_health', 'dashboard', 'normal');
        remove_meta_box('wpseo-dashboard-overview', 'dashboard', 'side');
    }

    /**
     * Cleanup on the stylesheets output to strip out unnecessary properties and force double quotes
     *
     * @param string $html
     * @param string $handle
     * @param string $href
     *
     * @return string
     */
    public function cleanStyleLoaderTag($html, $handle, $href) : string
    {
        return '<link rel="stylesheet" href="' . $href . '">' . PHP_EOL;
    }

    /**
     * Cleanup on the script src output to strip out unnecessary properties and force double quotes
     *
     * @param string $tag
     * @param string $handle
     * @param string $src
     *
     * @return string
     */
    public function cleanScriptLoaderTag($tag, $handle, $src) : string
    {
        /** Don't change anything if we are in the administrative interface page */
        if (is_admin()) {
            return $tag;
        }

        return '<script src="' . $src . '"></script>' . PHP_EOL;
    }

    /**
     * Remove the Gutenberg block styling
     *
     * @return void
     */
    public function removeGutenbergStyling() : void
    {
        wp_dequeue_style('wp-block-library');
    }

    /**
     * Remove default modules
     *
     * @return void
     */
    public function removeModules() : void
    {
        // Remove for everyone
        remove_menu_page('edit.php');                   // Posts
        remove_menu_page('edit-comments.php');          // Comments

        // Remove for the end user
        $user = wp_get_current_user();

        if ( !is_admin() && $user->ID != "1") {
            $customize_url_arr = array();
            $customize_url_arr[] = 'themes.php';
            $customize_url = add_query_arg('return', urlencode(wp_unslash($_SERVER['REQUEST_URI'])), 'customize.php');
            $customize_url_arr[] = $customize_url;

            remove_menu_page('plugins.php');                // Plugins
            //remove_menu_page('users.php');                  // Users
            remove_menu_page('tools.php');                  // Tools
            remove_menu_page('options-general.php');        // Settings
            remove_menu_page('edit.php?post_type=acf-field-group'); // Advanced Custom Fields

            foreach ($customize_url_arr as $customize_url) {
                remove_submenu_page('themes.php', $customize_url);
            }
        }
    }

}
