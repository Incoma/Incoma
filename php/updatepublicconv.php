<?php
$lines = file('incomadb.conf');
$username = rtrim(str_replace(array("\$username=\"", "\";"), "", $lines[0]));
$password = rtrim(str_replace(array("\$password=\"", "\";"), "", $lines[1]));
$database = rtrim(str_replace(array("\$database=\"", "\";"), "", $lines[2]));
$localhost = rtrim(str_replace(array("\$localhost=\"", "\";"), "", $lines[3]));

mysql_connect($localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");

$queryconvs="SELECT hash FROM conversations";
$resultconvs=mysql_query($queryconvs);
while($convlist[]=mysql_fetch_array($resultconvs));

for($i = 0, $size = count($convlist)-1; $i < $size; ++$i) {

	$pubconversation = $convlist[$i][0]; 

	$querynodes="SELECT time FROM nodes_".$pubconversation." ORDER BY time";
	$resultnodes=mysql_query($querynodes);
	while($nodesphp[]=mysql_fetch_array($resultnodes));
	$pubnumnodes=mysql_numrows($resultnodes);

	array_pop($nodesphp);
	$nodesphp2[]=array_pop($nodesphp);


	$querylinks="SELECT time FROM links_".$pubconversation." ORDER BY time";
	$resultlinks=mysql_query($querylinks);
	while($linksphp[]=mysql_fetch_array($resultlinks));

	array_pop($linksphp);
	$linksphp2[]=array_pop($linksphp);


	$publasttime=$nodesphp2[0][0];
	
	if ($linksphp2[0][0]>$nodesphp2[0][0]){
		$publasttime=$linksphp2[0][0];
	}
	
	$sqlupdate =  'UPDATE conversations'.
	' SET thoughtnum='.$pubnumnodes.', lasttime='.$publasttime.
	' WHERE hash="'.$pubconversation.'"';

	mysql_query($sqlupdate);


	unset($nodesphp);
	unset($nodesphp2);
	unset($linksphp);
	unset($linksphp2);
	
}

mysql_close();


?>