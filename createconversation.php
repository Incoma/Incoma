<?
$conversation = $_POST['conversation'];
$title = $_POST['title'];
$time = $_POST['time'];
$readispublic = $_POST['ispublic'];
$ispublic = ($readispublic === 'true');

$lines = file('incomadb.conf');
$username = rtrim(str_replace(array("\$username=\"", "\";"), "", $lines[0]));
$password = rtrim(str_replace(array("\$password=\"", "\";"), "", $lines[1]));
$database = rtrim(str_replace(array("\$database=\"", "\";"), "", $lines[2]));

mysql_connect(localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");


$sqlnodestable = 'CREATE TABLE nodes_'.$conversation.
    	     '( hash bigint, content mediumtext, evalpos int, evalneg int, evaluatedby mediumtext, type int, author tinytext, time tinytext )';

mysql_query($sqlnodestable);


$sqllinkstable = 'CREATE TABLE links_'.$conversation.
    	     '( hash bigint, source bigint, target bigint, evalpos int, evalneg int, evaluatedby mediumtext, type int, author tinytext, time tinytext )';

mysql_query($sqllinkstable);


if ($ispublic){
	$sqlconversation =  'INSERT INTO public_conversations'.
	'( hash  , title , thoughtnum , lasttime) '.
	'VALUES ( "'.$conversation.'" , "'.$title.'" , 1 , '.$time.')';
	
	mysql_query($sqlconversation);
}


mysql_close();

?>