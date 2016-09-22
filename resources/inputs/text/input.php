<?php
namespace resources\inputs\text;

class input extends \resources\inputs\input {
	private static $instance;
	
	function __construct() {
		parent::__construct();
	}
	
	public static function getInstance() {
		if (is_null(self::$instance)) {
			self::$instance = new self();
		}
		
		return self::$instance;
	}
	
	static function _def() {
		return array(
			"type" => "text",
			"label" => "Text Input"
		);
	}
	
	static function _list() {
		$list = array();
		
		$list[] = array(
			"ID" => "text|fullname",
			"description" => "Text input 'Full Name'",
			"name" => "fullname",
			"data" => array(
				
				"label" => "Full Name",
				"placeholder" => "Full Name",
				"style" => "2",
				"custom_use_style" => "0",
			)
		
		);
		
		$l = array();
		foreach ($list as $item) {
			$l[$item['ID']] = $item;
		}
		
		return $l;
	}
	
	static function default_data() {
		$settings = array(
				"placeholder" => "",
				"style" => "2",
				"label" => "",
				"custom_use_style" => "0",
			// form-horizontal, form-inline
		);
		
		
		return $settings;
	}
	
	function front($data) {
		$settings = array();
		
		$data = self::_data($data);
		$settings = $data['data'];
		
		//test_array($settings); 
		
		$tmpl = new \template("template.twig", "resources/inputs/text");
		$tmpl->settings = $settings;
		$tmpl->data = $data;
		
		return $tmpl->render_template();
		
	}
	
	function admin($data) {
		$settings = array();
		
		
		$data = self::_data($data);
		$settings = $data['data'];
		
		
		
		$tmpl = new \template("admin_template.twig", "resources/inputs/text");
		$tmpl->settings = $settings;
		$tmpl->data = $data;
		
		return $tmpl->render_template();
		
	}
	static function _data($data){
		return parent::merge_data($data,self::default_data());
	}
	
	
}
