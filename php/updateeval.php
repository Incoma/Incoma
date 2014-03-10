<?
$conversation = $_POST['conversation'];
$table = $_POST['table'];
$variable = $_POST['variable'];
$value = $_POST['value'];
$hash = $_POST['hash'];

$lines = file('incomadb.conf');
$username = rtrim(str_replace(array("\$username=\"", "\";"), "", $lines[0]));
$password = rtrim(str_replace(array("\$password=\"", "\";"), "", $lines[1]));
$database = rtrim(str_replace(array("\$database=\"", "\";"), "", $lines[2]));
$localhost = rtrim(str_replace(array("\$localhost=\"", "\";"), "", $lines[3]));

mysql_connect($localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");


$sqlupdate = 'UPDATE '.$table.' SET '.$variable.'='.$value.' WHERE hash='.$hash; 

mysql_query($sqlupdate);


mysql_close();

?>