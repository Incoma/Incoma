<?php
$conversation = $_POST['conversation'];

$lines = file('incomadb.conf');
$username = rtrim(str_replace(array("\$username=\"", "\";"), "", $lines[0]));
$password = rtrim(str_replace(array("\$password=\"", "\";"), "", $lines[1]));
$database = rtrim(str_replace(array("\$database=\"", "\";"), "", $lines[2]));
$localhost = rtrim(str_replace(array("\$localhost=\"", "\";"), "", $lines[3]));

mysql_connect($localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");



$minimumsizeofwordstobetagged = 5;
$minimumamountofappearances = 4;


	$pubconversation = $conversation;

	$querynodes="SELECT content FROM nodes_".$pubconversation." ";
	$resultnodes=mysql_query($querynodes);
	while($nodesphp[]=mysql_fetch_array($resultnodes));
	$pubnumnodes=mysql_numrows($resultnodes);


	$contentnodes = array();
	for($j = 0, $size2 = count($nodesphp)-1; $j < $size2; ++$j) {
	array_push($contentnodes, $nodesphp[$j][0]);
	}

$wordlistnodes = implode(" ", $contentnodes);
$wordlistnodesarray = preg_split("/[\s,\.\?\!¿'\"\"\:\(\)]+/", $wordlistnodes);
$wordlistnodesarray2 = array_map('strtolower', $wordlistnodesarray);
$wordlistnodesarray2 = array_unique($wordlistnodesarray2);
$wordlistnodesarray2 = explode(",", implode(",", $wordlistnodesarray2));

$wordlistnodesarrayclean = array();


for($j = 0, $size2 = count($wordlistnodesarray2); $j < $size2; ++$j) {
   if (strlen($wordlistnodesarray2[$j]) > $minimumsizeofwordstobetagged-1) {
   array_push($wordlistnodesarrayclean, $wordlistnodesarray2[$j]);
   }
}

$wordlistnodesarraycleantimes = array();
for($j = 0, $size2 = count($wordlistnodesarrayclean); $j < $size2; ++$j) {
$wordlistnodesarraycleantimes[$j] = 0;
	for($k = 0, $size3 = count($contentnodes); $k < $size3; ++$k) {
           $pos = strpos(strtolower($contentnodes[$k]), " ".$wordlistnodesarrayclean[$j]." ");
           if ($pos === false) {
           } else {
           ++$wordlistnodesarraycleantimes[$j];
           }
	}
}


$taglistarray = array();
$taglistarraytimes = array();
if (count($wordlistnodesarraycleantimes) !== 0) {
  $maxtimes = max($wordlistnodesarraycleantimes);
  for($j = $maxtimes; $j > $minimumamountofappearances-1; --$j) {
      for($k = 0, $size2 = count($wordlistnodesarrayclean); $k < $size2; ++$k) {
      if ($wordlistnodesarraycleantimes[$k] == $j) {
      array_push($taglistarray, $wordlistnodesarrayclean[$k]);
      array_push($taglistarraytimes, $wordlistnodesarraycleantimes[$k]);
      }
      }
  }
} 

$taglist = implode(", ", $taglistarray);


if (strlen($taglist) !== 0) {
 $sqlupdate =  'UPDATE conversations'.
        ' SET tags="'.$taglist.'"'.
        ' WHERE hash="'.$pubconversation.'"';
        mysql_query($sqlupdate);	
}

	unset($nodesphp);
	unset($nodesphp2);
	unset($wordlistnodesarrayclean);
	unset($wordlistnodesarrayclean2);
	unset($wordlistnodesarraycleantimes);
	unset($taglistarray);
	


mysql_close();



?>
