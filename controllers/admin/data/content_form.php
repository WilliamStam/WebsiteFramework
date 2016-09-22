<?php

namespace controllers\admin\data;
use \models as models;

class content_form extends _ {
	function __construct() {
		parent::__construct();

	}


	function data(){
		$type = (isset($_REQUEST['type'])) ? $_REQUEST['type'] :"";
		$ID = (isset($_REQUEST['ID'])) ? $_REQUEST['ID'] :"";
		$return = array();
		
		
		
		$return['details'] = models\content::getInstance()->get($ID,array("format"=>true));
		$return['type'] = models\content_types::getInstance()->get($type,array("format"=>true,"render"=>"front"));
		

		
		
		
		
		return $GLOBALS["output"]['data'] = $return;
	}
	

	
}
