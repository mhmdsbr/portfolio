<?php
/**
 * General setup for the Advanced Custom Fields plugin
 */
namespace PORTFOLIO\ThirdParty;


class ACF
{
    public function __construct()
    {
        /** Check if ACF is activated */
        if (!function_exists('acf_add_options_page')) {
            return add_action('admin_notices', [&$this, 'displayACFInstallNotice']);
        }

        // Add custom WYSIWYG toolbar
        add_filter('acf/fields/wysiwyg/toolbars', [&$this, 'addCustomWysiwygToolbar']);

        $this->registerOptionPages();
    }

    /**
     * Show admin notice if ACF is not installed & activated
     *
     * @return void
     */
    public function displayACFInstallNotice(): void
    {
        $classes = 'notice notice-error';
        $message = 'Please install Advanced Custom Fields PRO, it is required for this theme to work properly!';

        printf('<div class="%1$s"><p>%2$s</p></div>', esc_attr($classes), esc_html($message));
    }

    /**
     * Register ACF option pages
     *
     * @return void
     */
    public function registerOptionPages(): void
    {
        acf_add_options_page(array(
            'page_title' => __('Theme General Settings', 'expedition'),
            'menu_title' => __('General Settings', 'expedition'),
            'menu_slug'  => 'theme-general-settings',
            'capability' => 'manage_options',
            'redirect'   => false
        ));

	    acf_add_options_sub_page(array(
		    'page_title'  => __('HeroApi Section', 'expedition'),
		    'menu_title'  => __('HeroApi', 'expedition'),
		    'menu_slug'  => 'theme-hero-section',
		    'parent_slug' => 'theme-general-settings',
	    ));

	    acf_add_options_sub_page(array(
		    'page_title'  => __('About Section', 'expedition'),
		    'menu_title'  => __('About', 'expedition'),
		    'menu_slug'  => 'theme-about-section',
		    'parent_slug' => 'theme-general-settings',
	    ));

	    acf_add_options_sub_page(array(
		    'page_title'  => __('ServicesApi Section', 'expedition'),
		    'menu_title'  => __('ServicesApi', 'expedition'),
		    'menu_slug'  => 'theme-services-section',
		    'parent_slug' => 'theme-general-settings',
	    ));

	    acf_add_options_sub_page(array(
		    'page_title'  => __('SummaryApi Section', 'expedition'),
		    'menu_title'  => __('SummaryApi', 'expedition'),
		    'menu_slug'  => 'theme-summary-section',
		    'parent_slug' => 'theme-general-settings',
	    ));

	    acf_add_options_sub_page(array(
		    'page_title'  => __('TestimonialApi Section', 'expedition'),
		    'menu_title'  => __('TestimonialApi', 'expedition'),
		    'menu_slug'  => 'theme-testimonial-section',
		    'parent_slug' => 'theme-general-settings',
	    ));

	    acf_add_options_sub_page(array(
		    'page_title'  => __('Contact Section', 'expedition'),
		    'menu_title'  => __('Contact', 'expedition'),
		    'menu_slug'  => 'theme-contact-section',
		    'parent_slug' => 'theme-general-settings',
	    ));

	    acf_add_options_sub_page(array(
		    'page_title' => __('Configuration', 'expedition'),
		    'menu_title' => __('Configuration', 'expedition'),
		    'menu_slug'  => 'theme-general-config',
		    'parent_slug' => 'theme-general-settings',
		    'redirect'   => false
	    ));

    }

    /**
     * Add Custom WYSIWYG Toolbar
     */
    function addCustomWysiwygToolbar($toolbars)
    {
        // Add a new toolbar called "Very Simple"
        // - this toolbar has only 1 row of buttons
        $toolbars['Very Simple']    = array();
        $toolbars['Very Simple'][1] = array('bold');

        // Edit the "Full" toolbar and remove 'code'
        // - delet from array code from http://stackoverflow.com/questions/7225070/php-array-delete-by-value-not-key
        if (($key = array_search('code', $toolbars['Full'][2])) !== false) {
            unset($toolbars['Full'][2][$key]);
        }

        // return $toolbars - IMPORTANT!
        return $toolbars;
    }
}
