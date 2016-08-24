<?php

namespace controllers\admin\data;
use \models as models;

class settings_content extends _ {
	function __construct() {
		parent::__construct();

	}


	function data(){
		$ID = (isset($_REQUEST['ID'])) ? $_REQUEST['ID'] :"";
		$return = array();
		
		
		
		$return['details'] = models\content_types::getInstance()->get($ID,array("format"=>true));
		

		
		
		$return['records'] = models\content_types::getInstance()->getAll("", "datein DESC", "");
		
		return $GLOBALS["output"]['data'] = $return;
	}
	
	function input_list(){
		$type = isset($_GET['typeID'])?$_GET['typeID']:"";
		$input = isset($_GET['input'])?$_GET['input']:"";
		$prefix = "input-";
		if (substr($input, 0, strlen($prefix)) == $prefix) {
			$input = substr($input, strlen($prefix));
		}
		
		$listO = "\\resources\\admin\\inputs\\{$input}\\input";
		
		
		
		$result = array(
				"type"=>$type,
				"label"=>"",
				"records"=>Array()
		);
		
		
		if (class_exists($listO)){
			
			$result = $listO::_def();
			
			$listO = $listO."::_list";
			$list = $listO();
			//test_array($list); 
			foreach ($list as $item){
				
				$result['records'][] = $item;
			}
			
			
			
		}
		
		
		
		
		return $GLOBALS["output"]['data'] = $result;
	}
	
}
