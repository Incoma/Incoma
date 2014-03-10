<?
$conversation= $_GET['conversation'];

$lines = file('incomadb.conf');
$username = rtrim(str_replace(array("\$username=\"", "\";"), "", $lines[0]));
$password = rtrim(str_replace(array("\$password=\"", "\";"), "", $lines[1]));
$database = rtrim(str_replace(array("\$database=\"", "\";"), "", $lines[2]));
$localhost = rtrim(str_replace(array("\$localhost=\"", "\";"), "", $lines[3]));

mysql_connect($localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");

$querytitle="SELECT title FROM conversations WHERE hash='".$conversation."'";
$resulttitle=mysql_query($querytitle);
while($titlephp[]=mysql_fetch_array($resulttitle));

$queryeditable="SELECT editable FROM conversations WHERE hash='".$conversation."'";
$resulteditable=mysql_query($queryeditable);
while($editablephp[]=mysql_fetch_array($resulteditable));

mysql_close();

$data = array();
$data['title'] = $titlephp;
$data['editable'] = $editablephp;

echo json_encode($data);

?>