<?php
namespace models;
use \timer as timer;

class input_modules extends _ {
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
			FROM inputs
			WHERE $where;
		"
		);


		if (count($result)) {
			$return = $result[0];
			
		} else {
			$return = parent::dbStructure("inputs");
		}
		if ($options['format']){
			$return = $this->format($return);
		}
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

		$sql = "
			 SELECT DISTINCT *
			FROM inputs
			$where
			$orderby
			$limit;
		";
	//	test_string($sql);
		
		$result = $f3->get("DB")->exec($sql, $args, $ttl);

		$return = $result;
		$timer->_stop(__NAMESPACE__, __CLASS__, __FUNCTION__, func_get_args());
		return $return;
	}

	

	public static function _save($ID, $values = array()) {
		$timer = new timer();
		$f3 = \Base::instance();
		$return = array();

		
		if (isset($values['ID'])) unset($values['ID']);


		$a = new \DB\SQL\Mapper($f3->get("DB"), "inputs");
		$a->load("ID='$ID'");

		foreach ($values as $key => $value) {
			
			if ($key=="data"){
				$value = json_encode($value);
			}
			
			if (isset($a->$key)) {
				$a->$key = $value;
			}
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


		$a = new \DB\SQL\Mapper($f3->get("DB"),"inputs");
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
			
			$item['data']=(array)json_decode($item['data'], true);
				
			$n[] = $item;
		}
		
		
		
		if ($single) $n = $n[0];
		
		
		$records = $n;
		
		
		
		//test_array($n); 
		
		
		$timer->_stop(__NAMESPACE__, __CLASS__, __FUNCTION__, func_get_args());
		return $n;
	}
	
	

	
	
}
