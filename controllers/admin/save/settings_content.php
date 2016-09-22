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
	function input_save(){
		
		$reservedFieldNames = array("heading","datein","typeID","data");
		
		
		$result = array();
		$ID = isset($_REQUEST['ID'])?$_REQUEST['ID']:"";
		
		$values = array(
				"name" => $this->post("module-name",true),
				"description" => $this->post("module-description",true),
				"module" => $this->post("module-type",true),
				"required_text" => $this->post("module-required_text"),
		);
		
		$post = $_POST;
		
		// TODO: make sure name is alpha chars only or dash or underscore. if not then throw an error
		
		$data = array();
		foreach($post as $k=>$v){
			if (!in_array($k,array("module-name","module-description","module-type","module-required_text"))){
				
				$data[$k] = $v;
			}
		}
		
		if (in_array($values["name"], $reservedFieldNames)){
			$this->errors["module-name"] = $values["name"]." is a reserved field name - reserved names (".implode(", ",$reservedFieldNames).")";
		}
		
		
		$values['data'] = $data;
		
		if ($ID!=""){
			$values['dateEdited'] = date("Y-m-d H:i:s");
		}
		//test_array(array($values,$this->errors)); 
		
		
		
		if (count($this->errors)==0){
			
			$ID = models\input_modules::_save($ID,$values);
			
			
		}
		$return = array(
				"ID" => $ID,
				"errors" => $this->errors
		);
		
		return $GLOBALS["output"]['data'] = $return;
	}
	
	
}
