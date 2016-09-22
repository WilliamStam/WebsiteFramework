<?php

namespace controllers\admin\data;
use \models as models;

class settings_content extends _ {
	private static $instance;
	function __construct() {
		parent::__construct();
		
		
	}
	public static function getInstance(){
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	function data(){
		$ID = (isset($_REQUEST['ID'])) ? $_REQUEST['ID'] :"";
		$return = array();
		
		
		
		$return['details'] = models\content_types::getInstance()->get($ID,array("format"=>true,"render"=>"admin"));
		

		
		
		$return['records'] = array();
		
		return $GLOBALS["output"]['data'] = $return;
	}
	
	function input_list(){
		$type = isset($_GET['typeID'])?$_GET['typeID']:"";
		$input = isset($_GET['input'])?$_GET['input']:"";
		$order = isset($_GET['order'])?$_GET['order']:"asc";
		$order_by = isset($_GET['order_by'])?$_GET['order_by']:"name";
		
		
		
		$prefix = "input-";
		if (substr($input, 0, strlen($prefix)) == $prefix) {
			$input = substr($input, strlen($prefix));
		}
		
		$listO = \resources\inputs\input::getInputClass($input);;
		
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
			
			
			$result['records'] = models\input_modules::getInstance()->getAll("module='{$input}'","$order_by $order");
			
			
			foreach ($list as $item){
				
				$result['records'][] = $item;
			}
			
			
			
		}
			
				
		$result["order-by"]=$order_by;
		$result["order"]=$order;
		
		return $GLOBALS["output"]['data'] = $result;
	}
	function inputs(){
		
		
		$result = array();
		$result['list']= \resources\inputs\input::getInputsList();;
		
		
		//test_array($result); 
		return $GLOBALS["output"]['data'] = $result;
		
	}
	function input_data(){
		$ID = isset($_GET['ID'])?$_GET['ID']:"";
		$type = isset($_GET['type'])?$_GET['type']:"";
		$result = models\input_modules::getInstance()->get($ID,array("format"=>true));
		if (is_numeric($ID)){
			$type = $result['module'];
		} else {
			$IDparts = explode("|",$ID);
			$type=$IDparts[0];
		}
		
		$inputO = \resources\inputs\input::getInputClass($type);
		
		$formHtml = false;
		$defaultList = array();
		if (class_exists($inputO)){
			$defaultList = $inputO."::_list";
			$defaultList = $defaultList();
			
		}
		if (isset($defaultList[$ID])){
			$result = $defaultList[$ID];
			$result['ID'] = "";
			$result['module'] = $type;
		}
		
		if (class_exists($inputO)) {
			$result['html'] = $inputO::getInstance()->admin($result);
			
			//test_array(json_decode($result['data'])); 
			
			$mergedData = $inputO."::_data";
			$mergedData = $mergedData($result);
			$result['data'] = $mergedData['data'];
			
		}
		$result['module'] = $type;
		
		
		
		//test_array($result); 
		return $GLOBALS["output"]['data'] = $result;
		
	}
	
}
