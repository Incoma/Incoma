<?

$lines = file('incomadb.conf');
$username = rtrim(str_replace(array("\$username=\"", "\";"), "", $lines[0]));
$password = rtrim(str_replace(array("\$password=\"", "\";"), "", $lines[1]));
$database = rtrim(str_replace(array("\$database=\"", "\";"), "", $lines[2]));

mysql_connect(localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");

$queryconv="SELECT * FROM public_conversations";
$resultconv=mysql_query($queryconv);
while($convphp[]=mysql_fetch_array($resultconv));
$numconv=mysql_numrows($resultconv);

mysql_close();


$dataconv = array();
$data['conversations'] = $convphp;

echo json_encode($data);

?>