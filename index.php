<!DOCTYPE html>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="css/style.css"/>
<link rel="stylesheet" href="plugins/ezMark-master/css/ezmark.css" media="all">
<link rel="stylesheet" href="plugins/dragdealer-v0.9.5/dragdealer.css" media="all">
<link rel="stylesheet" media="screen and (min-height: 486px) and (max-height: 2000px)" type="text/css" href="css/zoomout-large.css"/>
<link rel="stylesheet" media="screen and (min-height: 100px) and (max-height: 485px)" type="text/css" href="css/zoomout-small.css"/>

<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
<title  id="window_title">INCOMA</title>
<link rel="shortcut icon" href="img/favicon.ico">
</head>


<body>



<!-- HTML frame -->

 <div id="headerMain">
     <div id="headerName" class="header noselect">
        <a  id="headerName" href="http://incoma.org">
            INCOMA<sup>beta</sup>
        </a>
     </div>
     <div id="headerLangSelection" class="header noselect">
         <select id="headerlangselect" class="header noselect" onchange="changelanguage(this)">
				<option value="eng" selected="selected">English</option>
				<option value="es">Spanish</option>
				<option value="fra">French</option>
				// ADD HERE THE NEW LANGUAGES (+ the language file in the php directory) (and check webtext.js and txvars.txt)
				<option id="morelang" value="More"></option>
         </select>
		</div>
		<div id="headerMenu"  class="header headerborder noselect" style="visibility:hidden;">
			<!--         Menu    (text defined in the javascript)-->
     </div>
     <a id="headerBlog" class="header headerborder" href="http://blog.incoma.org" target="_blank">
  			<!--         Blog    (text defined in the javascript)-->
     </a>
     <div id="headerExport" class="header headerborder noselect" style="visibility:hidden;">
         <a class="header" href="" id="headerExportLink" >&nbsp;</a>
     </div>
 </div>
	<!-- This tag will be filled by the visualization scripts -->
 <div id="visualisationMain">
	<div id="noconversation_panel" class="language_panel shadow noselect" style="position:absolute; visibility:hidden;">
     	<div id="noconversation_panel_text">
			<!--  There is no conversation with this URL.    (text defined in the javascript)-->
			</div>
		<div id="noconversation_button" class="language_button button" onclick="bt_menu();">
     		<!--  Go to menu    (text defined in the javascript)-->
		</div>
	</div>
 </div> 

<script src="js/jquery-1.9.1.js"></script>
<script src="js/d3.v3.min.js"></script>
<script src="plugins/jquery.ddCslick.js"></script>
<script src="plugins/jquery.ddTslick.js"></script>
<script src="plugins/dragdealer-v0.9.5/dragdealer.js"></script>
<script src="js/jquery-ui.js"></script>

<!-- ezMark is a script to make more beauty the checkboxes -->
<script type="text/javascript" language="Javascript" src="plugins/ezMark-master/js/jquery.ezmark.js"></script>
<script type="text/javascript">
//look for a conversation parameter in the URL
	<?php
		if(isset($_GET['c'])) $conversation= $_GET['c'];
		else $conversation = ""; 
	?>
	
	conversation="<?php echo $conversation; ?>";
	
	
	// This script loads all the text for the website in the proper language (English by default)
	<?php $weblangphp= isset($_GET['lang']) && $_GET['lang']; ?>
	weblangphp="<?php echo $weblangphp; ?>"; 
	weblang = (weblangphp == "") ? "eng" : weblangphp;
</script>
<script type="text/javascript" src="js/require.js" data-main="js/index"></script>


<!-- Javascript -->
<!-- opensave: Open and save conversations -->
<!-- jsonmodels: Some example conversations (or "Models") -->
<!-- languageslist: Language list for setting the conversation lang -->
<!-- model: info and general functions to interact with the models -->
<!-- visualisation: keeps track of the visualisations -->
<!-- visualisation-zoomout: visualise a conversation as circles and lines -->
<!-- visualisation-initialmenu: visualise the initial menu (Sandbox, Create, Participate) -->
<!--script src="js/opensave.js"></script>
<script src="js/jsonmodels.js"></script>
<script src="js/languageslist.js"></script>
<script src="js/model.js"></script>
<script src="js/visualisation.js"></script>
<script src="js/visualisation-zoomout.js"></script>
<script src="js/visualisation-initialmenu.js"></script-->

</body>
</html>
