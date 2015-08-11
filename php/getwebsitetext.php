<?php
$weblang= $_GET['weblang'];

$langfile = file('lang-'.$weblang.'.txt');

echo json_encode($langfile);

?>