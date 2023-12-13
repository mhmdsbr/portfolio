<?php

namespace PORTFOLIO\Core;

class General
{
    public function __construct()
    {
        /** General setup methods */
        add_action('after_setup_theme', [&$this, 'generalSetup']);
	    add_action('phpmailer_init', [&$this, 'setupSmtp']);
	    /** Custom Admin footer */
        add_filter('admin_footer_text', [&$this, 'customAdminFooterText']);
	    add_filter( 'upload_mimes', [&$this,'cc_mime_types'] );
	    add_filter('wp_mail_from', [&$this, 'custom_wp_mail_from']);
	    add_filter('wp_mail_from_name', [&$this, 'custom_wp_mail_from_name']);
        /** Helper to delete the adminbar when developing */
        if (isset($_GET['nobar'])) {
            add_filter('show_admin_bar', '__return_false');
        }

        add_filter('tiny_mce_before_init', function($init_array) {
            $init_array['formats'] = json_encode([
                // add new format to formats
                'p' => [
                    'selector' => 'p',
                    'block'    => 'p',

                ],
                'intro' => [
                    'selector' => 'div',
                    'block'    => 'div',
                ],
            ], JSON_THROW_ON_ERROR);
            // remove from that array not needed formats
            $block_formats = [
                'Paragraph=p',
                'Intro=intro',
                'Heading 2=h2',
                'Heading 3=h3',
                'Heading 4=h4',
                'Heading 5=h5',
                'Heading 6=h6',
                'Preformatted=pre',
            ];
            $init_array['block_formats'] = implode(';', $block_formats);

            return $init_array;
        });
    }
    /**
     * General setup methods for multiple things all WordPress related
     *
     * @return void
     */
    public function generalSetup(): void
    {
        /** Show title tag in <head> */
        add_theme_support('title-tag');
        /** Add post thumbnail support for theme */
        add_theme_support('post-thumbnails');
    }
    /**
     * Customizing the Admin footer text
     *
     * @return string
     */
    public function customAdminFooterText(): string
    {
        return '<a href="https://www.mohammadsaber.ir/" target="_blank" rel="noopener">Mohammad Saber</a>';
    }

	// Define custom MIME types for SVG and SVGZ files
	function cc_mime_types( $mimes ) {
		$mimes['svg']  = 'image/svg+xml';
		$mimes['svgz'] = 'image/svg+xml';
		return $mimes;
	}
	function custom_wp_mail_from($original_email_address) {
		$admin_email = get_option('admin_email');
		return $admin_email;
	}
	function custom_wp_mail_from_name($original_email_from): string {
		$site_name = get_bloginfo('name');
		return $site_name;
	}

	/**
	 * Set up SMTP configuration
	 *
	 * @return void
	 */
	public function setupSmtp(): void
	{
		$smtp_credentials = array(
			'host'     => get_field('smtp_host', 'option'),
			'port'     => get_field('smtp_port', 'option'),
			'username' => get_field('smtp_username', 'option'),
			'password' => get_field('smtp_password', 'option'),
		);

		add_action('phpmailer_init', function ($phpmailer) use ($smtp_credentials) {
			$phpmailer->isSMTP();
			$phpmailer->Host       = $smtp_credentials['host'];
			$phpmailer->Port       = $smtp_credentials['port'];
			$phpmailer->SMTPAuth   = true;
			$phpmailer->Username   = $smtp_credentials['username'];
			$phpmailer->Password   = $smtp_credentials['password'];
			$phpmailer->SMTPSecure = 'ssl';
		});
	}

}


