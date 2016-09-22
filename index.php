<?php
date_default_timezone_set('Africa/Johannesburg');
setlocale(LC_ALL, 'en_ZA.UTF8');
$errorFolder = ".". DIRECTORY_SEPARATOR . "logs".DIRECTORY_SEPARATOR. "php";
if (!file_exists($errorFolder)) {
		@mkdir($errorFolder, 01777, true);
	}
$errorFile = $errorFolder . DIRECTORY_SEPARATOR . date("Y-m") . ".log";
ini_set("error_log", $errorFile);

if (session_id() == "") {
	$SID = @session_start();
} else $SID = session_id();
if (!$SID) {
	session_start();
	$SID = session_id();
}
$GLOBALS["output"] = array();
$GLOBALS["models"] = array();
require_once('vendor/autoload.php');

$f3 = \base::instance();
require('inc/timer.php');
require('inc/template.php');
require('inc/functions.php');
require('inc/pagination.php');
$GLOBALS['page_execute_timer'] = new timer(true);
$cfg = array();
require_once('config.default.inc.php');
if (file_exists("config.inc.php")) {
	require_once('config.inc.php');
}

$f3->set('AUTOLOAD', './|lib/|controllers/|inc/|/modules/|/app/controllers/|/resources/**/*');
$f3->set('PLUGINS', 'vendor/bcosca/fatfree/lib/');
$f3->set('CACHE', true);

$f3->set('DB', new DB\SQL('mysql:host=' . $cfg['DB']['host'] . ';dbname=' . $cfg['DB']['database'] . '', $cfg['DB']['username'], $cfg['DB']['password']));



//test_array("woof"); 


$f3->set('cfg', $cfg);
$f3->set('DEBUG',3);




$f3->set('UI', 'ui/|media/|resources/');
$f3->set('MEDIA', './media/|'.$cfg['media']);
$f3->set('TZ', 'Africa/Johannesburg');

$f3->set('TAGS', 'p,br,b,strong,i,italics,em,h1,h2,h3,h4,h5,h6,div,span,blockquote,pre,cite,ol,li,ul');


//$f3->set('ERRORFILE', $errorFile);
//$f3->set('ONERROR', 'Error::handler');
$f3->set('ONERRORd',
	function($f3) {
		// recursively clear existing output buffers:
		while (ob_get_level())
			ob_end_clean();
		// your fresh page here:
		echo $f3->get('ERROR.text');
		print_r($f3->get('ERROR.stack'));
	}
);

$version = date("YmdH");
if (file_exists("./.git/refs/heads/" . $cfg['git']['branch'])) {
	$version = file_get_contents("./.git/refs/heads/" . $cfg['git']['branch']);
	$version = substr(base_convert(md5($version), 16, 10), -10);
}

$minVersion = preg_replace("/[^0-9]/", "", $version);
$f3->set('_version', $version);
$f3->set('_v', $minVersion);



$uID = isset($_SESSION['uID']) ? base64_decode($_SESSION['uID']) : "";

$userO = new \models\user();
$user = $userO->get($uID);
if (isset($_GET['auID']) && $user['su']=='1'){
	$_SESSION['uID'] = $_GET['auID'];
	$user = $userO->get($_GET['auID']);
}
//test_array($uID); 

$f3->set('user', $user);

if ($user['ID']){
	models\user::lastActivity($user);
}



$content_types = models\content_types::getInstance()->getGlobalSetup();
$f3->set('content_types', $content_types);

//test_array($content_types); 


//$f3->set('user', $user);
$f3->set('session', $SID);



$f3->route('GET|POST /test', function(){
	
	// include_once("./resources/inputs/html/input_html.php");
	
	$t = "html";
	
	$inputO = "\\resources\\inputs\\{$t}\\input_{$t}";
	$t = new $inputO();
	
	
	
	
	
});



$f3->route('GET|POST /', 'controllers\front\home->page');

$f3->route('GET|POST /admin', 'controllers\admin\home->page');


$f3->route('GET|POST /admin/content/form/@type', 'controllers\admin\content_form->page');



$f3->route('GET|POST /admin/settings', 'controllers\admin\settings_domain->page');
$f3->route('GET|POST /admin/settings/content', 'controllers\admin\settings_content->page');
$f3->route('GET|POST /admin/settings/content/@ID', 'controllers\admin\settings_content->page');




$f3->route('GET|POST /logout', function ($f3, $params) use ($user) {
	session_start();
	session_unset();
	session_destroy();
	session_write_close();
	setcookie(session_name(),'',0,'/');
	//session_regenerate_id(true);
	
	//session_destroy();
	$f3->reroute("/login");
});











$f3->route('GET /php', function () {
	phpinfo();
	exit();
});







$f3->route("GET|POST /admin/save/@function", function ($app, $params) {
	$app->call("controllers\\admin\\save\\save->" . $params['function']);
});
$f3->route("GET|POST /admin/save/@class/@function", function ($app, $params) {
	$app->call("controllers\\admin\\save\\" . $params['class'] . "->" . $params['function']);
});
$f3->route("GET|POST /admin/save/@folder/@class/@function", function ($app, $params) {
	$app->call("controllers\\admin\\save\\" . $params['folder'] . "\\" . $params['class'] . "->" . $params['function']);
});
$f3->route("GET|POST /admin/data/@function", function ($app, $params) {
	$app->call("controllers\\admin\\data\\data->" . $params['function']);
});
$f3->route("GET|POST /admin/data/@class/@function", function ($app, $params) {
	//test_array($params); 
	$app->call("controllers\\admin\\data\\" . $params['class'] . "->" . $params['function']);
});
$f3->route("GET|POST /admin/data/@folder/@class/@function", function ($app, $params) {
	$app->call("controllers\\admin\\data\\" . $params['folder'] . "\\" . $params['class'] . "->" . $params['function']);
});




$f3->run();



	

$models = $GLOBALS['models'];

///test_array($models); 
$t = array();
foreach ($models as $model) {
	$c = array();
	foreach ($model['m'] as $method) {
		$c[] = $method;
	}
	$model['m'] = $c;
	$t[] = $model;
}

//test_array($t); 

$models = $t;
$pageTime = timer::shortenTimer($GLOBALS['page_execute_timer']->stop("Page Execute"));

$GLOBALS["output"]['timer'] = $GLOBALS['timer'];

$GLOBALS["output"]['models'] = $models;



$GLOBALS["output"]['page'] = array(
	"page" => $_SERVER['REQUEST_URI'],
	"time" => $pageTime
);

//test_array($tt); 

if ($f3->get("ERROR")){
	exit();
}

if (($f3->get("AJAX") && ($f3->get("__runTemplate")==false) || $f3->get("__runJSON"))) {
	header("Content-Type: application/json");
	echo json_encode($GLOBALS["output"]);
} else {

	//if (strpos())
	if ($f3->get("NOTIMERS")){
		exit();
	}
	
	
	echo '
					<script type="text/javascript">
				      updatetimerlist(' . json_encode($GLOBALS["output"]) . ');
					</script>
					</body>
</html>';

}



?>
