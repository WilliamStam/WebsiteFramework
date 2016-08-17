<?php
$cfg['DB']['host'] = "localhost";
$cfg['DB']['username'] = "";
$cfg['DB']['password'] = "";
$cfg['DB']['database'] = "website-framework";

$cfg['git'] = array(
	'username'=>"",
	"password"=>"",
	"path"=>"github.com/WilliamStam/Website-Framework",
	"branch"=>"master"
);

$cfg['media'] = $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR. "media" . DIRECTORY_SEPARATOR;
$cfg['backup'] = $cfg['media'] . "backups" . DIRECTORY_SEPARATOR;

$cfg['rows'] = array(
		"Popular-Layouts"=>array(
				array(12),
				array(6,6),
				array(4,8)
		),
		"2-Column"=>array(
				array(1,11),
				array(2,10),
				array(3,9),
				array(4,8),
				array(5,7),
				array(6,6),
				array(7,5),
				array(8,4),
				array(9,3),
				array(10,2),
				array(11,1),
		),
		"3-Column"=>array(
				array(4,4,4),
				array(3,3,6),
				array(6,3,3),
				array(2,3,7),
				array(2,2,8),
				array(8,2,2),
		
		
		)
);