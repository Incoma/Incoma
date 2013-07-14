<?
$conversation = $_POST['conversation'];
$title = $_POST['title'];
$time = $_POST['time'];
$ispublic = $_POST['ispublic'];
$language = $_POST['language'];

$lines = file('incomadb.conf');
$username = rtrim(str_replace(array("\$username=\"", "\";"), "", $lines[0]));
$password = rtrim(str_replace(array("\$password=\"", "\";"), "", $lines[1]));
$database = rtrim(str_replace(array("\$database=\"", "\";"), "", $lines[2]));

mysql_connect(localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");


$sqlnodestable = 'CREATE TABLE nodes_'.$conversation.
    	     '( hash bigint, content text, contentsum tinytext, evalpos int, evalneg int, evaluatedby longtext, type int, author tinytext, seed tinyint, time bigint )';

mysql_query($sqlnodestable);


$sqllinkstable = 'CREATE TABLE links_'.$conversation.
    	     '( hash bigint, source bigint, target bigint, direct tinyint, evalpos int, evalneg int, evaluatedby longtext, type int, author tinytext, time bigint)';

mysql_query($sqllinkstable);


$sqlconversation =  'INSERT INTO conversations'.
'( hash  , title , thoughtnum , lasttime, creationtime, ispublic, language) '.
'VALUES ( "'.$conversation.'" , "'.$title.'" , 1 , '.$time.',  '.$time.', '.$ispublic.', "'.$language.'")';

mysql_query($sqlconversation);



mysql_close();

?>