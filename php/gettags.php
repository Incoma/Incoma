<?php
$conversation= $_GET['conversation'];

$lines = file('incomadb.conf');
$username = rtrim(str_replace(array("\$username=\"", "\";"), "", $lines[0]));
$password = rtrim(str_replace(array("\$password=\"", "\";"), "", $lines[1]));
$database = rtrim(str_replace(array("\$database=\"", "\";"), "", $lines[2]));
$localhost = rtrim(str_replace(array("\$localhost=\"", "\";"), "", $lines[3]));

mysql_connect($localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");

$querytags="SELECT tags FROM conversations WHERE hash='".$conversation."'";
$resulttags=mysql_query($querytags);
while($tagsphp[]=mysql_fetch_array($resulttags));

mysql_close();


$data = array();
$data['tags'] = $tagsphp;

echo json_encode($data);

?>