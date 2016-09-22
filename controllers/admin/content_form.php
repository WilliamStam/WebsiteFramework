<?php
namespace controllers\admin;
use \timer as timer;
use \models as models;
class content_form extends _ {
	function __construct(){
		parent::__construct();
	}
	function page(){
		//if ($this->user['ID']=="")$this->f3->reroute("/login");
		
		$content_type = models\content_types::getInstance()->get($this->params['type'],array("render"=>"front"));
		
		
		$form = $content_type['content'];
		
		
		unset($content_type['content']);
		//test_array($form); 
		
		
		$tmpl = new \template("template.twig","ui/admin");
		$tmpl->page = array(
			"section"    => "content",
			"sub_section"=> "form",
			"template"   => "content_form",
			"meta"       => array(
				"title"=> "Admin | Content | New content",
			),
				
		);
		$tmpl->form = $form;
		$tmpl->content_type = $content_type;
		$tmpl->output();
	}
	
	
	
}
