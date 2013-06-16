<?
$conversation= $_GET['conversation'];

$lines = file('incomadb.conf');
$username = rtrim(str_replace(array("\$username=\"", "\";"), "", $lines[0]));
$password = rtrim(str_replace(array("\$password=\"", "\";"), "", $lines[1]));
$database = rtrim(str_replace(array("\$database=\"", "\";"), "", $lines[2]));

mysql_connect(localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");

$querynodes="SELECT * FROM nodes_".$conversation;
$resultnodes=mysql_query($querynodes);
while($nodesphp[]=mysql_fetch_array($resultnodes));
$numnodes=mysql_numrows($resultnodes);

$querylinks="SELECT * FROM links_".$conversation;
$resultlinks=mysql_query($querylinks);
while($linksphp[]=mysql_fetch_array($resultlinks));
$numlinks=mysql_numrows($resultlinks);

mysql_close();


$data = array();
$data['nodes'] = $nodesphp;
$data['links'] = $linksphp;

echo json_encode($data);

?>