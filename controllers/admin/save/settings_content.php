<?php

namespace controllers\admin\save;
use \models as models;

class settings_content extends _ {
	function __construct() {
		parent::__construct();

	}


	function form(){
		$result = array();
		$ID = isset($_REQUEST['ID'])?$_REQUEST['ID']:"";
		
		$values = array(
				"label" => $this->post("label",true),
				"content" => $this->post("template",true),
				"last_edit" => date("Y-m-d H:i:s"),
		);
		
		
		//test_array($values); 
		
		
		
		if (count($this->errors)==0){
			
			$ID = models\content_types::_save($ID,$values);
			
			
		}
		$return = array(
				"ID" => $ID,
				"errors" => $this->errors
		);
		
		return $GLOBALS["output"]['data'] = $return;
	}
	
	
	
}
