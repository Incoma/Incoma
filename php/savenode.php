<?php
$newnodephp = $_POST['newnodephp'];
$conversation = $_POST['conversation'];

$lines = file('incomadb.conf');
$username = rtrim(str_replace(array("\$username=\"", "\";"), "", $lines[0]));
$password = rtrim(str_replace(array("\$password=\"", "\";"), "", $lines[1]));
$database = rtrim(str_replace(array("\$database=\"", "\";"), "", $lines[2]));
$localhost = rtrim(str_replace(array("\$localhost=\"", "\";"), "", $lines[3]));

mysql_connect($localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");

$newnodephparray = explode("####", $newnodephp);

$sqlnode = 'INSERT INTO nodes_'.$conversation.
	'( hash  , content  , contentsum , evalpos , evalneg , evaluatedby , adveval, advevalby, type , author , seed , time) '.
	'VALUES ( '.$newnodephparray[1].' , "'.$newnodephparray[3].'" ,  "'.$newnodephparray[5].'" , '.$newnodephparray[7].' , '.$newnodephparray[9].' , "'.$newnodephparray[11].'" , "'.$newnodephparray[13].'" , "'.$newnodephparray[15].'" , '.$newnodephparray[17].'  , "'.$newnodephparray[19].'" , '.$newnodephparray[21].' , '.time().' )';
	
mysql_query($sqlnode);

mysql_close();

?>