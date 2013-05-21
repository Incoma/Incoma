<?
$newlinkphp = $_POST['newlinkphp'];
$conversation = $_POST['conversation'];

$lines = file('incomadb.conf');
$username = rtrim(str_replace(array("\$username=\"", "\";"), "", $lines[0]));
$password = rtrim(str_replace(array("\$password=\"", "\";"), "", $lines[1]));
$database = rtrim(str_replace(array("\$database=\"", "\";"), "", $lines[2]));


mysql_connect(localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");

$newlinkphparray = explode("####", $newlinkphp);

$sqllink = 'INSERT INTO links_'.$conversation.
	'( hash  , source , target, evalpos , evalneg , evaluatedby , type , author , time) '.
	'VALUES ( "'.$newlinkphparray[1].'" , "'.$newlinkphparray[3].'" , "'.$newlinkphparray[5].'" , '.$newlinkphparray[7].' , '.$newlinkphparray[9].' , "'.$newlinkphparray[11].'"  , "'.$newlinkphparray[13].'" , "'.$newlinkphparray[15].'", "'.time().'" )';

mysql_query($sqllink);

mysql_close();

?>