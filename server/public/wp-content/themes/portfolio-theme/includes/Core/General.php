<?php
/**
 * Some general WordPress function calls
 */

namespace EXP\Core;

class General
{
    public function __construct()
    {
        /** General setup methods */
        add_action('after_setup_theme', [&$this, 'generalSetup']);

        /** Custom Admin footer */
        add_filter('admin_footer_text', [&$this, 'customAdminFooterText']);

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
        return 'طراح: <a href="https://www.mohammadsaber.ir/" target="_blank" rel="noopener"> محمد صابر </a>';
    }


    /**
     * @param $context
     * @return mixed
     */
    public function loadACFOptions($context): mixed {
        $context['options'] = get_fields('option');
        return $context;
    }

}


