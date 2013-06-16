<!--
// ************
// ************ Here you can find the functions defined in index.php with some of the calls 
// ************ We hope this helps you to understand better the code
// ************
 -->

<!DOCTYPE html>
<link rel="stylesheet" type="text/css" href="style.css"/>
<link rel="stylesheet" href="ezMark-master/css/ezmark.css" media="all">
<link rel="stylesheet" media="screen and (min-height: 486px) and (max-height: 2000px)" type="text/css" href="zoomout-large.css"/>
<link rel="stylesheet" media="screen and (min-height: 100px) and (max-height: 485px)" type="text/css" href="zoomout-small.css"/>

<body>
<!-- Javascript -->
<!-- opensave: Open and save conversations -->
<!-- jsonmodels: Some example conversations (or "Models") -->
<!-- languageslist: Language list for setting the conversation lang -->
<!-- model: info and general functions to interact with the models -->
<!-- visualisation: keeps track of the visualisations -->
<!-- visualisation-zoomout: visualise a conversation as circles and lines -->
<!-- visualisation-initialmenu: visualise the initial menu (Sandbox, Create, Participate) -->
<script src="d3.v3.min.js"></script>
<script src="jquery.ddCslick.js"></script>
<script src="jquery.ddTslick.js"></script>
<script src="jquery-ui.js"></script>
<script src="opensave.js"></script>
<script src="jsonmodels.js"></script>
<script src="languageslist.js"></script>
<script src="model.js"></script>
<script src="visualisation.js"></script>
<script src="visualisation-zoomout.js"></script>
<script src="visualisation-initialmenu.js"></script>

<script>
// dbcode ***
	//look for a conversation parameter in the URL
	<? $conversation= $_GET['c']; ?>	
	var conversation="<?php echo $conversation; ?>"; 
	
	//if a conversation is being loaded, gets it from the db, if not, shows the initial menu
	if (conversation == "") {		
		Model.clear(IncomaMenuModel);
		reInit(Visualisations.select(2));			
	} else {
		db_loadconversation();		
	};

	function db_loadconversation(){
	//Get the conversation from the DB
		db_getmodel();
	//From the previous DB conversation generate a valid JS conversation
		db_generatemodel();
		//loads the 'zoom-out' visualization with the conversation data loaded from the db and converted to the js format
		Model.clear(modeldb);	
		reInit(Visualisations.select(1));
	}

	function db_getconversations(){
	//Get the list of conversations (shown in Participate)
			url: 'getconversations.php',
	}

	function db_createconversation(conversation,title,time,ispublic, language){
	//Create a conversation in the DB list of conversations
		$.post("createconversation.php", {conversation: conversation, title:title, time:time, ispublic:ispublic, language:language});
	}

	function db_reloadconversation(){
			reInit(Visualisations.select(1));
	}
	
	function db_gettitle(){
		url: 'gettitle.php',
	}	
		
	function db_getmodel(){
	//Get the conversation from the DB
		url: 'getmodel.php',
	}
	
	function db_generatemodel(){
	//From the previous DB conversation generate a valid JS conversation
	}

	function db_savenode(newnode){
			$.post("savenode.php", {newnodephp: newnodestring, conversation: conversation});
	}

	function db_savelink(newlink){
			$.post("savelink.php", {newlinkphp: newlinkstring, conversation: conversation});
	}

	function db_update_eval_node(variable,value){
			$.post("updateevaluatedby.php", {conversation:conversation, table:table, variable:variable, value:value, hash:hash});
	}

	function db_update_eval_link(variable,value){
			$.post("updateeval.php", {conversation:conversation, table:table, variable:variable, value:value, hash:hash});
			$.post("updateevaluatedby.php", {conversation:conversation, table:table, variable:variable, value:value, hash:hash});
	}

	function db_update_public_conv(){
	//Update the list of conversations in Participate from the DB list
			$.post("updatepublicconv.php");
	}

	function updateConversation(){
	//Compares the DB conversation with the one showed, and updates this last one (only the new nodes and links) if there are changes
		var PRES = Visualisations.current().presentation;
		db_getmodel();
		db_generatemodel();
				drawnewnodes();
				drawnewlinks();
	}
	
// end of dbcode ***

	//@@language dependent
	function changelanguage(selection){
	}

	function loadsandbox(){
	}

	function loadmenu(){
		reInit(Visualisations.select(2));
	}

	function createconvhash(string){
	}
	
	function nodehashit(string){
	// Create a hash to identify a node
	}

	function linkhashit(string){
		// Create a hash to identify a link
	}

	function hashit(str){
		// Generate a hash from a string (v1)
	}

	function hashit2(str){
		// Generate a hash from a string (v2)
	}
		
	function timeAgo(date) {
		// Transform Epoch timestamp in human time
	}

</script>
</body>
</html>
