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
		$data = models\content_types::getInstance()->get($this->params['ID']);
		
		$inputs = \controllers\admin\data\settings_content::getInstance()->inputs();
		$inputTypes = $inputs['list'];
		
		// test_array($inputTypes); 
		$this->f3->set("__runJSON", false);
		
		$tmpl = new \template("template.twig","ui/admin");
		$tmpl->page = array(
			"section"    => "settings",
			"sub_section"=> "content-".$data['ID'],
			"template"   => "settings_content",
			"meta"       => array(
				"title"=> "Admin | Settings | Content Types | ".$data['label'],
			),
				"js"=>array("/vendor/codemirror/CodeMirror/lib/codemirror.js","/vendor/codemirror/CodeMirror/mode/xml/xml.js","/vendor/codemirror/CodeMirror/mode/htmlmixed/htmlmixed.js","/vendor/codemirror/CodeMirror/addon/display/placeholder.js"),
				"css"=>array("/vendor/codemirror/CodeMirror/lib/codemirror.css")
		);
		$tmpl->data = $data;
		$tmpl->columns = $this->cfg['rows'];
		$tmpl->input_types = $inputTypes;
		$tmpl->output();
	}
	
	
	
}
