<?php
$conversation= $_POST['conversation'];
$type= $_POST['type'];
$hash= $_POST['hash'];

$lines = file('incomadb.conf');
$username = rtrim(str_replace(array("\$username=\"", "\";"), "", $lines[0]));
$password = rtrim(str_replace(array("\$password=\"", "\";"), "", $lines[1]));
$database = rtrim(str_replace(array("\$database=\"", "\";"), "", $lines[2]));
$localhost = rtrim(str_replace(array("\$localhost=\"", "\";"), "", $lines[3]));

mysql_connect($localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");


$query="SELECT hash FROM ".$type."s_".$conversation." WHERE hash='".$hash."'";
$result=mysql_query($query);
while($resultphp[]=mysql_fetch_array($result));

mysql_close();

echo $resultphp[0][0];

?>