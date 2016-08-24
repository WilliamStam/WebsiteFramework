<?php
namespace resources\admin\inputs\text;
use \timer as timer;
use \models as models;
class input extends \resources\_ {
	private static $instance;
	function __construct(){
		parent::__construct();
	}
	public static function getInstance(){
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}
	static function _def(){
		return array(
				"type"=>"text",
				"label"=>"Text Input"
		);
	}
	static function _list(){
		$list = array(
			"default|heading"=>array(
				"ID"=>"default|heading",
				"label"=>"Text input 'heading'",
				"settings"=>array(
					"name"=>"heading",
					"placeholder"=>"Heading",
					"form-type"=>"form-horizontal"
				)
			), 
			"default|name"=>array(
				"ID"=>"default|name",
				"label"=>"Text input 'Name'",
				"settings"=>array(
					"name"=>"name",
					"placeholder"=>"name",
					"form-type"=>"form-horizontal"
				)
			),
		);
		
		return $list;
	}
	
	function default_settings(){
		$settings = array(
			"name"=>"default-text-input",
			"placeholder"=>"",
			"label"=>"",
			"form-type"=>"form-horizontal", // form-horizontal, form-inline
		);
		
		
		return $settings;
	}
	function input(){
		$ID = $this->f3->get("PARAMS['ID']");
		$settings = $this->default_settings();
		
		$items = self::_list();
		$item = isset($items[$ID])?$items[$ID]:false;
		
		if ($item){
			$settings = array_merge($settings,$item);
		}
		
		$tmpl = new \template("templates.twig","resources/admin/inputs/text");
		$tmpl->settings = $settings;
		$tmpl->output();
		
	
	}
	
	
	
}
