<!DOCTYPE html>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="css/style.css"/>
<link rel="stylesheet" href="plugins/ezMark-master/css/ezmark.css" media="all">
<link rel="stylesheet" media="screen and (min-height: 486px) and (max-height: 2000px)" type="text/css" href="css/zoomout-large.css"/>
<link rel="stylesheet" media="screen and (min-height: 100px) and (max-height: 485px)" type="text/css" href="css/zoomout-small.css"/>

<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
<title  id="window_title">INCOMA</title>
<link rel="shortcut icon" href="img/favicon.ico">
</head>


<body>
    <script src="js/jquery-1.9.1.js"></script>
	<!-- ezMark is a script to make more beauty the checkboxes -->
	<script type="text/javascript" language="Javascript" src="plugins/ezMark-master/js/jquery.ezmark.js"></script>

<!-- HTML frame -->

    <div id="headerMain">
        <div id="headerName" class="header noselect">
        <a  id="headerName" href="http://incoma.org">
            INCOMA<sup>beta</sup></a>
        </div>
		<div id="headerMenu"  class="header noselect" onclick="bt_menu()" style="visibility:hidden;">
            Menu
        </div>
        <a id="headerUrl" class="header" href="http://blog.incoma.org" target="_blank">
            blog.incoma.org
        </a>
        <div id="headerLangSelection" class="header noselect">
			Language:
            <select id="headerlangselect" class="header noselect" onchange="changelanguage(this)">
				<option value="English" selected="selected">English</option>
				<option value="Spanish">Spanish</option>
				<option value="More">More languages</option>
            </select>
        </div>
        <div id="headerUsername" class="header noselect" style="visibility:hidden;">
            Name:&nbsp;
            <textarea id='headerNamebox' class="header" spellcheck='false' maxlength='20'></textarea>
        </div>
        <div id="headerExport" class="header noselect" style="visibility:hidden;">
            <a class="header" href="" id="headerExportLink" >&nbsp;</a>
        </div>
    </div>
<!-- This tag will be filled by the visualization scripts -->
    <div id="visualisationMain">
		<div id="noconversation_panel" class="language_panel shadow noselect" style="position:absolute; visibility:hidden;">
			There is no conversation with this URL.
			<div id="noconversation_button" class="language_button button" onclick="bt_menu();">Go to menu</div>
		</div>
    </div>  


<!-- Javascript -->
<!-- opensave: Open and save conversations -->
<!-- jsonmodels: Some example conversations (or "Models") -->
<!-- languageslist: Language list for setting the conversation lang -->
<!-- model: info and general functions to interact with the models -->
<!-- visualisation: keeps track of the visualisations -->
<!-- visualisation-zoomout: visualise a conversation as circles and lines -->
<!-- visualisation-initialmenu: visualise the initial menu (Sandbox, Create, Participate) -->
<script src="js/d3.v3.min.js"></script>
<script src="plugins/jquery.ddCslick.js"></script>
<script src="plugins/jquery.ddTslick.js"></script>
<script src="js/jquery-ui.js"></script>
<script src="js/opensave.js"></script>
<script src="js/jsonmodels.js"></script>
<script src="js/languageslist.js"></script>
<script src="js/model.js"></script>
<script src="js/visualisation.js"></script>
<script src="js/visualisation-zoomout.js"></script>
<script src="js/visualisation-initialmenu.js"></script>

<script> 
$(function() {$('.resizable').resizable();});
</script>

<script>

	weblanguage = "English";

	//gets the current user name from the name box in the header
    var author = $("#headerNamebox")[0];
    author.onchange = function(e) {
        Model.currentAuthor(author.value);
    };
      
    function reInit(newVisualisation) {
        if (newVisualisation) {
            newVisualisation.init( $( "#visualisationMain" )[0], Model.model);
        }
    };
    
    var saveModelFile = function() { return Model.exportFile(); }

    var loadModelFile = function(file) {
                            var fileName = file.name || "current conversation" ;
                            OpenSave.blobToText( file, function(text) { Model.importFile(text); reInit(Visualisations.current()); } );
                        }; 

    OpenSave.addExportListener( $( "#headerExport" )[0], "Export", "Incoma-conversation.json", saveModelFile );
	
	
// dbcode ***
// All the functions that call to the PHP code to interact with the MySQL database

	//look for a conversation parameter in the URL
	<? $conversation= $_GET['c']; ?>
	
	var conversation="<?php echo $conversation; ?>"; 
	
    this.modelfromdb = "";

	//if a conversation is being loaded, gets it from the db, if not, shows the initial menu
	if (conversation == "") {
		
		Model.clear(IncomaMenuModel);
		reInit(Visualisations.select(2));
			
	} else {

		db_loadconversation();
		
	};


	function db_loadconversation(){


	//Update the tags from the conversation
        $.post("php/updatetags.php", {conversation: conversation});


	//Get the conversation from the DB
		db_getmodel();
		
		if (modelfromdb == ""){
			opennoconversationpanel();
			return;
		}
		
	//From the previous DB conversation generate a valid JS conversation
		db_generatemodel();

		//loads the 'zoom-out' visualization with the conversation data loaded from the db and converted to the js format
		Model.clear(modeldb);
		
		reInit(Visualisations.select(1));

	}


	function db_getconversations(){

	//Get the list of conversations (shown in Participate)
		$.ajax({
			dataType: 'json',
			url: 'php/getconversations.php',
			async: false,
			}).done(function(data) {
			data.conversations.pop();
			completeconversationlist =  data.conversations;
		});

	}


	function db_createconversation(conversation,title,time,ispublic, language){
	//Create a conversation in the DB list of conversations
		$.post("php/createconversation.php", {conversation: conversation, title:title, time:time, ispublic:ispublic, language:language});

	}


	function db_reloadconversation(){

		setTimeout(function(){
			window.history.pushState("", "", "?c=" + conversation); //with this alternative two lines, the page is not refreshed
			reInit(Visualisations.select(1));
			//window.location.href = "?c=" + conversation;
		},700);

	}

	
	function db_gettitle(){
	
		$.ajax({
		dataType: 'json',
		url: 'php/gettitle.php',
		data: { conversation: conversation},
		async: false,
		}).done(function(data) {
		data.title.pop()
		Model.title = data.title[0].title;
		});

	}
	
	
	function db_gettags(){

                $.ajax({
                dataType: 'json',
                url: 'php/gettags.php',
                data: { conversation: conversation},
                async: false,
                }).done(function(data) {
                data.tags.pop()
                Model.tags = data.tags[0].tags;
                });

        }

	
	function db_getmodel(){
	//Get the conversation from the DB

		$.ajax({
		dataType: 'json',
		url: 'php/getmodel.php',
		data: { conversation: conversation},
		async: false,
		}).done(function(data) {
		data.nodes.pop();
		data.links.pop();
		modelfromdb =  { nodes: data.nodes, links: data.links, authors: []};
		}).fail(function(data) {
	        });
	}
	
	
	function db_generatemodel(){
	//From the previous DB conversation generate a valid JS conversation
	
		var nodesjs=modelfromdb.nodes;
		var linksjs=modelfromdb.links;
		var numnodesdb=modelfromdb.nodes.length;
		var numlinksdb=modelfromdb.links.length;
		
		var nodeslist = [];
	
		for (var i=0; i<numnodesdb; i++) {


			onenodedb = {"hash":parseInt(nodesjs[i]['hash']),"content":nodesjs[i]['content'],"contentsum":nodesjs[i]['contentsum'],"evalpos":parseInt(nodesjs[i]['evalpos']),"evalneg":parseInt(nodesjs[i]['evalneg']),"evaluatedby":(nodesjs[i]['evaluatedby']).split("@@@@"),"type":parseInt(nodesjs[i]['type']),"author":nodesjs[i]['author'],"seed":parseInt(nodesjs[i]['seed']),"time":parseInt(nodesjs[i]['time'])};
	

			nodeslist.push(onenodedb);
		}

		var linkslist = [];
		
		for (var i=0; i<numlinksdb; i++) {
		
			onelinkdb = {"hash":parseInt(linksjs[i]['hash']),"source":parseInt(linksjs[i]['source']),"target":parseInt(linksjs[i]['target']),"direct":parseInt(linksjs[i]['direct']),"evalpos":parseInt(linksjs[i]['evalpos']),"evalneg":parseInt(linksjs[i]['evalneg']),"evaluatedby":(linksjs[i]['evaluatedby']).split("@@@@"),"type":linksjs[i]['type'],"author":linksjs[i]['author'],"time":parseInt(linksjs[i]['time'])};

			linkslist.push(onelinkdb);
		}

		modeldb = { nodes: nodeslist, links: linkslist, authors: []};
		
	}


	function db_savenode(newnode){

	    if(conversation != "sandbox" && conversation != "sandbox_es"){
			var newnodejs = ["hash",newnode.hash,"content",newnode.content,"contentsum",newnode.contentsum,"evalpos",newnode.evalpos,"evalneg",newnode.evalneg,"evaluatedby",(newnode.evaluatedby).join("@@@@"),"type",newnode.type,"author",newnode.author,"seed",newnode.seed,"time",newnode.time];
			
			newnodestring = newnodejs.join('####');

			$.post("php/savenode.php", {newnodephp: newnodestring, conversation: conversation});
		}
	}


	function db_savelink(newlink){

	    if(conversation != "sandbox" && conversation != "sandbox_es"){
			var newlinkjs = ["hash",newlink.hash,"source",newlink.source,"target",newlink.target,"direct", newlink.direct, "evalpos",newlink.evalpos,"evalneg",newlink.evalneg,"evaluatedby",(newlink.evaluatedby).join("@@@@"),"type",newlink.type,"author",newlink.author,"time",newlink.time];
					
			newlinkstring = newlinkjs.join('####');

			$.post("php/savelink.php", {newlinkphp: newlinkstring, conversation: conversation});
        }
	}


	function db_update_eval_node(variable,value){

	    if(conversation != "sandbox" && conversation != "sandbox_es"){
			var table="nodes_" + conversation,
				hash = parseInt(targetnode.hash);
		
			$.post("php/updateeval.php", {conversation:conversation, table:table, variable:variable, value:value, hash:hash});
			var variable = "evaluatedby",
				value = (targetnode.evaluatedby).join("@@@@");
				
			$.post("php/updateevaluatedby.php", {conversation:conversation, table:table, variable:variable, value:value, hash:hash});
        }
	}


	function db_update_eval_link(variable,value){

	    if(conversation != "sandbox" && conversation != "sandbox_es"){
			var table="links_" + conversation,
				hash = parseInt(targetlink.hash);
		
			$.post("php/updateeval.php", {conversation:conversation, table:table, variable:variable, value:value, hash:hash});
			var variable = "evaluatedby",
				value = (targetlink.evaluatedby).join("@@@@");
				
			$.post("php/updateevaluatedby.php", {conversation:conversation, table:table, variable:variable, value:value, hash:hash});
        } 
	}


	function db_update_public_conv(){
	//Update the list of conversations in Participate from the DB list
			$.post("php/updatepublicconv.php");
			return false;
	}
	

	function updateConversation(){
	//Compares the DB conversation with the one showed, and updates this last one (only the new nodes and links) if there are changes

		var ABSTR = Visualisations.current().abstraction;
		var PRES = Visualisations.current().presentation;
		
		if (ABSTR.showingevolution){return;}
		
		nodes = PRES.force.nodes();
		links = PRES.force.links();
		
		
		var old_model = Model.model;
		
		db_getmodel();
		db_generatemodel();
		
		var new_model = modeldb;
	
			
		updatednodes = [];
		old_nodeshash = [];
		
		for (var i=0;i<old_model.nodes.length;i++){	
			old_nodeshash.push(old_model.nodes[i].hash);
		}
		
		for (var i=0;i<new_model.nodes.length;i++){		
			if($.inArray(new_model.nodes[i].hash, old_nodeshash) < 0){
				updatednodes.push(new_model.nodes[i]);
			}
		}		
		

		updatedlinks = [];
		old_linkshash = [];
		
		for (var i=0;i<old_model.links.length;i++){		
			old_linkshash.push(old_model.links[i].hash);
		}
		
		for (var i=0;i<new_model.links.length;i++){		
			if($.inArray(new_model.links[i].hash, old_linkshash) < 0){
				updatedlinks.push(new_model.links[i]);
			}
		}		
			
		
		if (updatedlinks.length>0 || updatednodes.length>0){
		
			update_hash_lookup(updatednodes, updatedlinks);
			
			for (var i=0;i<updatednodes.length;i++){
				nodes.push(updatednodes[i]);
				
				var linkednode = "";
				
				for (j=0;j<updatedlinks.length;j++){
					if (updatedlinks[j].source.hash == updatednodes[i].hash){
						linkednode = updatedlinks[j].target;
					} else if(updatedlinks[j].target.hash == updatednodes[i].hash){
						linkednode = updatedlinks[j].source;
					}
				}				
				
				if (typeof linkednode.x !="undefined"){
					updatednodes[i].x = linkednode.x;
					updatednodes[i].y = linkednode.y;
				} else {
					updatednodes[i].x = PRES.scaler.midx;
					updatednodes[i].y = PRES.scaler.midy;
				}
				
				var randomplusminus = Math.random() < 0.5 ? -1 : 1;
				updatednodes[i].x += randomplusminus*10*(Math.random()+1);
				updatednodes[i].y += randomplusminus*10*(Math.random()+1);
				
				drawnewnodes();
				
				if (updatednodes[i].seed > 0){
					addseed(updatednodes[i]);
				}
			}	
			
			for (var i=0;i<updatedlinks.length;i++){
				links.push(updatedlinks[i]);
				drawnewlinks();
				
				if (updatedlinks[i].direct == 1){
					var coordx = (updatedlinks[i].source.x + updatedlinks[i].target.x)/2;
					var coordy = (updatedlinks[i].source.y + updatedlinks[i].target.y)/2;
					var expcolor = PRES.linkcolor[updatedlinks[i].type];
					explode(coordx, coordy, expcolor);
				}
			}	
		}
	}
	

// end of dbcode ***

	//@@language dependent
	function changelanguage(selection){
	
		switch (selection.value){
			case "Spanish":
				weblanguage = "Spanish";
				var str = (conversation == "") ? "/es" : "/es/?c=" + conversation;
				window.location.href = str;
				
				break;
				
			case "More":
				$("#headerlangselect").val(weblanguage);
				openlanguagepanel();
				break;
		}
	}
	

	function loadsandbox(){
	
		$('#svg').fadeOut(700);
		setTimeout(function(){window.location.href = "?c=sandbox";},700);
	}

	
	function loadmenu(){

		setTimeout(function(){
			// window.history.pushState("", "", "?"); //with this the page is not refreshed
			// reInit(Visualisations.select(2));
			window.location.href = "?";
		},300);
		
	}


	function createconvhash(string){
	// Create a hash to identify the conversation
		var temphash = hashit2(string);
		var hashlist=[];
		
		for (var i=0;i<conversationlist.length;i++){
			hashlist.push(conversationlist[i].hash);
		}
		
		if($.inArray(temphash, hashlist) < 0){
			return temphash;
		}
		
		var newstring = string + Date.now();
		createconvhash(newstring);
	
	}

	
	function nodehashit(string){
	// Create a hash to identify a node
		var PRES = Visualisations.current().presentation;
		nodes = PRES.force.nodes();
		var current_model = Model.model;
		current_model_nodeshashlist = [];
		
		for (var i=0;i<current_model.nodes.length;i++){	
			current_model_nodeshashlist.push(current_model.nodes[i].hash);
		}
				
		var temphash = hashit(string);

	    while($.inArray(temphash, current_model_nodeshashlist) > -1){
			var newstring = string + Date.now();
	        temphash = hashit(newstring);
	    }
	
	    return temphash;
	}


	function linkhashit(string){
		// Create a hash to identify a link
		var PRES = Visualisations.current().presentation;
		links = PRES.force.links();
		var current_model = Model.model;
		current_model_linkshashlist = [];
		
		for (var i=0;i<current_model.links.length;i++){	
			current_model_linkshashlist.push(current_model.links[i].hash);
		}
				
		var temphash = hashit(string);

	    while($.inArray(temphash, current_model_linkshashlist) > -1){
			var newstring = string + Date.now();
	        temphash = hashit(newstring);
	    }
	
	    return temphash;
	}


	function hashit(str){
		// Generate a hash from a string (v1)
		var hash = 5381;
		for (i = 0; i < str.length; i++) {
			char = str.charCodeAt(i);
			hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
		}
		return Math.abs(parseInt(hash));
	}


	function hashit2(str){
		// Generate a hash from a string (v2)
		var rotateBy = function(s,N) { for (var i = 0; i < N; i++) s.unshift(s.pop()); }

		// take a random string and convert it to char array
		var alphabet = "1LacGbJDd6f7QYC02MghijB3kAUFqwVT8HeROrt45yNXZu2KESiopI6z9".split(""); //THIS WILL BE THE CHARACTERS RANDOMLY USED

		var hash = alphabet.slice(0,10); //THE SECOND DIGIT IS THE LENGTH OF THE RESULTING HASH

		for (var i = 0; i < str.length; i++){
			var i_mod = i % hash.length;
			// cyclically shift the alphabet, to make it dependend from every char of the original string
			rotateBy(alphabet,str.charCodeAt(i) % alphabet.length + 1);
			// assign cyclically to char with index (i % hash.length) the char of the alphabet with an index depending on the i'th char of the original string and the i'th char value of the hash, which is dependend on the previous assignment...
			hash[i_mod] = alphabet[str.charCodeAt(i) * hash[i_mod].charCodeAt() % alphabet.length];
			// rotate hash to make it dependend from every new assignment
			rotateBy(hash,hash[i_mod].charCodeAt() % hash.length + 1);
		}

		return hash.join("");
	}
	
	
	function timeAgo(date) {
		// Transform Epoch timestamp in human time
		var seconds = Math.floor(Date.now()/1000) - date;
		var interval = Math.floor(seconds / 31536000);

		if (interval > 1) {
			return interval + " years ago";
		}
		if (interval > 0) {
			return interval + " year ago";
		}
		interval = Math.floor(seconds / 2592000);
		if (interval > 1) {
			return interval + " months ago";
		}
		interval = Math.floor(seconds / 86400);
		if (interval > 1) {
			return interval + " days ago";
		}
		if (interval > 0) {
			return interval + " day ago";
		}
		interval = Math.floor(seconds / 3600);
		if (interval > 1) {
			return interval + " hours ago";
		}
		if (interval > 0) {
			return interval + " hour ago";
		}
		interval = Math.floor(seconds / 60);
		if (interval > 1) {
			return interval + " minutes ago";
		}
		if (interval > 0) {
			return interval + " minute ago";
		}
		if (seconds > 1) {
			return seconds + " seconds ago";
		}
		return "just now";
	}


</script>

</body>
</html>
