<?php
namespace resources\inputs\html;

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
			"type" => "html",
			"label" => "HTML block"
		);
	}
	
	static function _list() {
		$list[] = array(
			"ID" => "html|hr",
			"description" => "Horizontal Rule",
			"data" => array(
				"html" => "<hr>",
			)
		);
		$list[] = array(
			"ID" => "html|padding10",
			"description" => "Padding 10",
			"data" => array(
				"html" => "<div class='padding:10px;'></div>",
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
				"html" => "",
		);
		
		
		return $settings;
	}
	
	function front($data) {
		$settings = array();
		
		$data = self::_data($data);
		$settings = $data['data'];
		
		//test_array($settings); 
		
		$tmpl = new \template("template.twig", "resources/inputs/html");
		$tmpl->settings = $settings;
		$tmpl->data = $data;
		
		return $tmpl->render_template();
		
	}
	
	function admin($data) {
		$settings = array();
		
		
		$data = self::_data($data);
		$settings = $data['data'];
		
		
		
		$tmpl = new \template("admin_template.twig", "resources/inputs/html");
		$tmpl->settings = $settings;
		$tmpl->data = $data;
		
		return $tmpl->render_template();
		
	}
	static function _data($data){
		return parent::merge_data($data,self::default_data());
	}
	
	
}
