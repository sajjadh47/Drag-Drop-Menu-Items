<?php
/**
 * Plugin Name: Drag & Drop Menu Items
 * Plugin URI: https://wordpress.org/plugins/drag-drop-menu-items/
 * Author: Sajjad Hossain Sagor
 * Description: Easily Add Nav Menu Item By Dragging It To Menu Lists Container
 * Version: 1.0.3
 * Author URI: https://sajjadhsagor.com
 * Text Domain: drag-drop-menu-items
 */

if ( ! defined( 'ABSPATH' ) )
{
	exit;
}

// plugin root path....
define( 'DNDMI_ROOT_DIR', dirname( __FILE__ ) ); // Plugin root dir

// plugin root url....
define( 'DNDMI_ROOT_URL', plugin_dir_url( __FILE__ ) ); // Plugin root url

// plugin version (we could say framework version)
define( 'DNDMI_VERSION', '1.0.3' );

// load translation files...
add_action( 'plugins_loaded', function()
{	
	load_plugin_textdomain( 'drag-drop-menu-items', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
} );

add_action( 'admin_enqueue_scripts', function()
{
	global $pagenow;

	if ( $pagenow == 'nav-menus.php' )
	{	
		// load plugin script
		wp_enqueue_script( 'dndmi_plugin_script', DNDMI_ROOT_URL . 'assets/js/script.js', array( 'jquery', 'wp-util' ), DNDMI_VERSION, true );

		wp_localize_script( 'dndmi_plugin_script', 'dndmi', array(
			'fakeDropPlaceholder' => __( 'Drop here to Add Menu item here', 'drag-drop-menu-items' )
		) );
	}
} );
