<?php

namespace controllers\admin\save;
use \models as models;

class content_form extends _ {
	function __construct() {
		parent::__construct();

	}


	function form(){
		$result = array();
		$ID = isset($_REQUEST['ID'])?$_REQUEST['ID']:"";
		$typeID = isset($_REQUEST['typeID'])?$_REQUEST['typeID']:"";
		
		$values = array(
				"heading" => $this->post("heading",true),
				"typeID"=>$typeID
		);
		
		$fields = $this->f3->get("content_types");
		$fields = $fields[$typeID]['inputs'];
		
		$data = array();
		foreach ($fields as $field){
			if (!in_array($field['module'],array("html"))){
				$data[$field['name']] = isset($_POST[$field['name']])?$_POST[$field['name']]:"";
				if ($field['required_text']!=""){
					if ($data[$field['name']]==""){
						$this->errors[$field['name']]=$field['required_text'];
					}
				}
			}
		}
		
		$values['data'] = $data;
		
		//test_array($values); 
		//test_array($values); 
		
		
		
		if (count($this->errors)==0){
			
			$ID = models\content::_save($ID,$values);
			
			
		}
		$return = array(
				"ID" => $ID,
				"errors" => $this->errors
		);
		
		return $GLOBALS["output"]['data'] = $return;
	}
	
	
	
}
