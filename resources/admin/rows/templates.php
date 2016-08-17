<?php
namespace resources\admin\rows;
use \timer as timer;
use \models as models;
class templates extends \resources\_ {
	function __construct(){
		parent::__construct();
	}
	function page(){
		$size = isset($_REQUEST['size'])?$_REQUEST['size']:"sm";
		
		$tmpl = new \template("templates.twig","resources/admin/rows");
		$tmpl->columns = $this->cfg['rows'];
		$tmpl->size = $size;
		$tmpl->output(false,true);
		
	}
	function html($size="sm"){
		
		$tmpl = new \template("templates.twig","resources/admin/rows");
		$tmpl->columns = $this->cfg['rows'];
		$tmpl->size = $size;
		return $tmpl->output(false,false);
		
		
	}
	
	
	
}
