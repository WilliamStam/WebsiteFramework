<?php
namespace models;
use \timer as timer;

class content_types extends _ {
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

	function get($ID,$options=array()) {
		$timer = new timer();
		$where = "ID = '$ID'";
		

		$result = $this->f3->get("DB")->exec("
			SELECT *
			FROM content_types
			WHERE $where;
		"
		);


		if (count($result)) {
			$return = $result[0];
			
		} else {
			$return = parent::dbStructure("content_types");
		}
		if ($options['format']){
			$return = $this->format($return);
		}
		if ($options['render']=="admin"){
			$return = $this->render($return,true);
		}
		if ($options['render']=="front"){
			$return = $this->render($return,false);
		}
		//test_array(array($return,$options));
		$timer->_stop(__NAMESPACE__, __CLASS__, __FUNCTION__, func_get_args());
		return $return;
	}
	
	
	function render($data,$adminRender=false) {
		$timer = new timer();
		
	//test_string($data['content']); 
		
		$return = $data;
		$content = $data['content'];
		
		$def = array();
		$default_items = array();
		
		/* Get a lits of inputs available - on /resources/inputs/input.php */
		$inputsO = \resources\inputs\input::getInputsList();
		
		/* gets the default list */
		foreach ($inputsO as $input){
			$listO = $input['class'] . "::_list";
			foreach ($listO() as $item){
				$item['module'] = $input['type'];
				$default_items[] = $item;
			}
		}
		
		
		$pattern = '/<!--\sinput\[([^\]]*)\]\s-->/';
		preg_match_all($pattern, $content, $matches);
		
		$inputs = array();
		$elements = implode(",",array_map( function($v){ return "'".$v."'";}, $matches[1]));
		if ($elements){
			$inputs = input_modules::getInstance()->getAll("inputs.ID in ({$elements})");
		}
		
		
		$list = array();
		
		/* this gets the default items for all inputs and applies the renderer found in /resources/inputs/input.php which in turn maps it to either front or admin in the individual input class */
		
		foreach ($default_items as $item){
			$item['html'] = \resources\inputs\input::getInstance()->render($item,$adminRender);
			$list[$item['ID']] = $item;
		}
		
		foreach ($inputs as $item){
			$item['html'] = \resources\inputs\input::getInstance()->render($item,$adminRender);;
			$list[$item['ID']] = $item;
		}
		
		
		
		
		
		
		
		//test_array($list); 
		
		$patterns = array();
		$replacements = array();
		
		foreach ($matches[1] as $key=>$item){
			$replacestring = isset($matches[0][$key])?$matches[0][$key]:false;
			if (!$matches[0][$key]){
				$replacestring = "<!-- input[".$item."] -->";
			}
			
			$html = $list[$item]['html'];
			
			$patterns[] = "{$replacestring}";
			$replacements[] = $html;
			
		//	test_array(array($key,$matches[0][$key],$item)); 
			
		}
		
		$content = str_replace($patterns, $replacements,$content );
		//test_array(array($patterns,$replacements,$content)); 
		
		
		
		$data['content'] = $content;
		
	//test_array($module); 
	//test_array($data);
		
		
		$return = $data;
		
		//test_array($return);
		$timer->_stop(__NAMESPACE__, __CLASS__, __FUNCTION__, func_get_args());
		return $return;
	}
	public function getAll($where = "", $orderby = "", $limit = "", $options = array()) {
		$result = $this->getAll_raw($where,$orderby,$limit,$options);
		$result = $this->format($result);
		return $result;
		
	}
	public function getAll_raw($where = "", $orderby = "", $limit = "", $options = array()) {
		$timer = new timer();
		$f3 = \Base::instance();

		if ($where) {
			$where = "WHERE " . $where . "";
		} else {
			$where = " ";
		}

		if ($orderby) {
			$orderby = " ORDER BY " . $orderby;
		}
		if ($limit) {
			$limit = " LIMIT " . $limit;
		}

		$args = "";
		if (isset($options['args'])) $args = $options['args'];

		$ttl = "";
		if (isset($options['ttl'])) $ttl = $options['ttl'];


		$result = $f3->get("DB")->exec("
			 SELECT DISTINCT *
			FROM content_types
			$where
			$orderby
			$limit;
		", $args, $ttl
		);

		$return = $result;
		$timer->_stop(__NAMESPACE__, __CLASS__, __FUNCTION__, func_get_args());
		return $return;
	}

	function getGlobalSetup(){
		$timer = new timer();
		$return = array();
		
		$types = $this->getAll();
		
		
		
		
		
		
		
		
		
		$inputIDs = array();
		/* getting all the inputs in the types content block */
		$t = array();
		foreach ($types as $type){
			$pattern = '/<!--\sinput\[([^\]]*)\]\s-->/';
			preg_match_all($pattern, $type['content'], $matches);
			$inputIDs = array_merge($inputIDs,$matches[1]);
			$t[$type['ID']]= $matches[1];
		}
		
		/* get the default items list */
		$default_inputs_list_types = array();
		foreach ($inputIDs as $inputid){
			$inputid = explode("|",$inputid);
			if (isset($inputid[0])&&!in_array($inputid[0],$default_inputs_list_types)&&!is_numeric($inputid[0])){
				$default_inputs_list_types[] = $inputid[0];
			}
		}
		
		$inputsO = \resources\inputs\input::getInputsList($default_inputs_list_types);
		
		foreach ($inputsO as $input){
			$listO = $input['class'] . "::_list";
			foreach ($listO() as $item){
				unset($item['data']);
				$item['module'] = $input['type'];
				$default_items[$item['ID']] = $item;
			}
		}
		
		//test_array($default_items); 
		
		
		/* get all the inputs used and add them to the types list*/
		$elements = implode(",",array_map( function($v){ return "'".$v."'";}, $inputIDs));
		
		$inputsData = $elements?input_modules::getInstance()->getAll("ID in ({$elements})"):array();
		
		$inputs = array();
		foreach ($inputsData as $input){
			unset($input['data']);
			$inputs[$input['ID']] = $input;
		}
		
		
		//test_array($inputs); 
		
		/* put the inputs into the types*/
		foreach ($types as $type){
			unset($type['content']);
			$type_inputs = $t[$type['ID']];
			$type['inputs'] = array();
			//if (count($type_inputs))	test_array($type_inputs); 
			foreach ($type_inputs as $i){
				$data = false;
				if (isset($inputs[$i])){
				//	test_array( $inputs[$i]); 
					$data = $inputs[$i];
				} elseif(isset($default_items[$i])) {
					$data = $default_items[$i];
				}
				if ($data){
					$type['inputs'][] = $data;
				}
				
			}
			
			
			$return[$type['ID']] = $type;
		}
		
		
		
//		test_array($return);
		
		
		
		
		$timer->_stop(__NAMESPACE__, __CLASS__, __FUNCTION__, func_get_args());
		return $return;
	}
	

	public static function _save($ID, $values = array()) {
		$timer = new timer();
		$f3 = \Base::instance();
		$return = array();

		$domain=$f3->get("domain");
		$domainID = $domain['ID'];
		
		if (isset($values['ID'])) unset($values['ID']);


		$a = new \DB\SQL\Mapper($f3->get("DB"), "content_types");
		$a->load("ID='$ID'");

		foreach ($values as $key => $value) {
			if (isset($a->$key)) {
				$a->$key = $value;
			}
		}
		
		if ($ID){
			$a->edited_datein = date("Y-m-d H:i:s");
		}
		

		$a->save();
		$ID = ($a->ID) ? $a->ID : $a->_id;
		
		
		$timer->_stop(__NAMESPACE__, __CLASS__, __FUNCTION__, func_get_args());
		return $ID;
	}

	

	public static function _delete($ID) {
		$timer = new timer();
		$f3 = \Base::instance();
		$user = $f3->get("user");


		$a = new \DB\SQL\Mapper($f3->get("DB"),"content_types");
		$a->load("ID='$ID'");

		$a->erase();

		$a->save();


		$timer->_stop(__NAMESPACE__, __CLASS__, __FUNCTION__, func_get_args());
		return "done";

	}
	
	
	static function format($data) {
		$timer = new timer();
		$single = false;
		//	test_array($items); 
		if (isset($data['ID'])) {
			$single = true;
			$data = array($data);
		}
		//test_array($items);
		
		$i = 1;
		$n = array();
		foreach ($data as $item) {
			
			
			$n[] = $item;
		}
		
		if ($single) $n = $n[0];
		
		
		$records = $n;
		
		
		
		//test_array($n); 
		
		
		$timer->_stop(__NAMESPACE__, __CLASS__, __FUNCTION__, func_get_args());
		return $n;
	}
	
	

	
	
}
