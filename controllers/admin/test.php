<?php
namespace controllers\admin;
use \timer as timer;
use \models as models;
class test extends _ {
	function __construct(){
		parent::__construct();
	}
	function page(){
		//if ($this->user['ID']=="")$this->f3->reroute("/login");
		
		$rowsO = new \resources\admin\rows\templates();
		$rows = $rowsO->html();
		
		//test_string($rows); 
		
		$tmpl = new \template("template.twig","ui/admin");
		$tmpl->page = array(
			"section"    => "test",
			"sub_section"=> "test",
			"template"   => "test",
			"meta"       => array(
				"title"=> "Admin | Test",
			),
		);
		$tmpl->rows = $rows;
		$tmpl->output();
	}
	
	
	
}
