<?php
namespace controllers\admin;
use \timer as timer;
use \models as models;
class settings_content extends _ {
	function __construct(){
		parent::__construct();
	}
	function page(){
		//if ($this->user['ID']=="")$this->f3->reroute("/login");
		$inputTypes = array();
		foreach (glob("./resources/admin/inputs/*/input.php") as $input) {
			$t = explode("/",$input);
			$t = $t[4];
			
			$defO = "\\resources\\admin\\inputs\\{$t}\\input";
			if (class_exists($defO)){
				$defO = $defO . "::_def";
				$list = $defO();
				$inputTypes[] = $list;
				
			}
			
			
		
			
		}
	//	test_array($inputTypes); 
		
		
		$tmpl = new \template("template.twig","ui/admin");
		$tmpl->page = array(
			"section"    => "settings",
			"sub_section"=> "content",
			"template"   => "settings_content",
			"meta"       => array(
				"title"=> "Admin | Settings | Content Types",
			),
				"js"=>array("/vendor/codemirror/CodeMirror/lib/codemirror.js","/vendor/codemirror/CodeMirror/mode/xml/xml.js","/vendor/codemirror/CodeMirror/mode/htmlmixed/htmlmixed.js"),
				"css"=>array("/vendor/codemirror/CodeMirror/lib/codemirror.css")
		);
		$tmpl->columns = $this->cfg['rows'];
		$tmpl->input_types = $inputTypes;
		$tmpl->output();
	}
	
	
	
}
