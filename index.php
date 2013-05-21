<!DOCTYPE html>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="style.css"/>
<link rel="stylesheet" media="screen and (min-height: 486px) and (max-height: 2000px)" type="text/css" href="zoomout-large.css"/>
<link rel="stylesheet" media="screen and (min-height: 100px) and (max-height: 485px)" type="text/css" href="zoomout-small.css"/>
<head>
<title>INCOMA</title>
</head>


<body>
    <script src="jquery-1.9.1.js"></script>

<!-- HTML frame -->


    <div id="headerMain">
        <div id="headerName" class="header">
            INCOMA&nbsp;&nbsp;&nbsp;&nbsp;&nbsp
        </div>
		<div id="headerMenu"  class="header" onclick="bt_menu()">
            menu
        </div>
        <a id="headerUrl" href="http://incomaproject.org" target="_blank">
            incomaproject.org
        </a>
        <div id="headerUsername">
            Name:&nbsp;
            <textarea id='headerNamebox' spellcheck='false'></textarea>
        </div>
        <div id="headerChangeVis" class="header" style="visibility:hidden;">
            Visualisation:
            <select id="visChoice" name="visualisationChoice" size="1">
            </select>
        </div>
        <div id="headerImport" class="header" style="visibility:hidden;">
            Import debate:&nbsp;
        </div>
        <div id="headerExport"  class="header">
            <a href="" id="headerExportLink" >&nbsp;</a>
        </div>
    </div>
    <div id="visualisationMain">
    </div>  

<!-- Javascript -->

<script src="d3.v3.min.js"></script>
<script src="jquery.ddslick.min.js"></script>
<script src="opensave.js"></script>
<script src="jsonmodels.js"></script>
<script src="model.js"></script>
<script src="visualisation.js"></script>
<script src="visualisation-zoomout.js"></script>
<script src="visualisation-initialmenu.js"></script>

<script>


	//gets the current user name from the name box in the header
    var author = $("#headerNamebox")[0];
    author.onchange = function(e) {
        Model.currentAuthor(author.value);
    };
      
    // var chooseVisualisation = $("#visChoice")[0];
    // Visualisations.setOptions(chooseVisualisation, Visualisations.options());
    // chooseVisualisation.onchange = function (e) {
        // var i = chooseVisualisation.options[chooseVisualisation.selectedIndex].value;
        // reInit(Visualisations.select(i));
    // };
      
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

    OpenSave.addImportListener( $( "#headerImport" )[0], ".xml,.json,application/x-incoma", loadModelFile );
    OpenSave.addExportListener( $( "#headerExport" )[0], "Export", "Incoma-conversation.json", saveModelFile );
	
	
	
// dbcode ***

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

		db_getmodel();

		generatemodel();

		//loads the 'zoom-out' visualization with the conversation data loaded from the db
		Model.clear(modeldb);
		
		reInit(Visualisations.select(1));

	}


	function db_getconversations(){

		$.ajax({
			dataType: 'json',
			url: 'getconversations.php',
			async: false,
			}).done(function(data) {
			data.conversations.pop();
			conversations =  data.conversations;
		});

	}


	function db_createconversation(conversation,title,time,ispublic){

	$.post("createconversation.php", {conversation: conversation, title:title, time:time, ispublic:ispublic});

	}

	function db_getmodel(){

		//$.getJSON("getmodel.php", { conversation: conversationjs})
		//.done(function(data) {

		$.ajax({
		dataType: 'json',
		url: 'getmodel.php',
		data: { conversation: conversation},
		async: false,
		}).done(function(data) {
		data.nodes.pop();
		data.links.pop();
		modelfromdb =  { nodes: data.nodes, links: data.links, authors: []};
		});
	}
	
	function generatemodel(){
	
		var nodesjs=modelfromdb.nodes;
		var linksjs=modelfromdb.links;
		var numnodesdb=modelfromdb.nodes.length;
		var numlinksdb=modelfromdb.links.length;
		
		var nodeslist = [];
		for (var i=0; i<numnodesdb; i++) {
		
		onenodedb = {"hash":parseInt(nodesjs[i]['hash']),"content":nodesjs[i]['content'],"evalpos":parseInt(nodesjs[i]['evalpos']),"evalneg":parseInt(nodesjs[i]['evalneg']),"evaluatedby":(nodesjs[i]['evaluatedby']).split("@@@@"),"type":nodesjs[i]['type'],"author":nodesjs[i]['author'],"time":nodesjs[i]['time']};

		nodeslist.push(onenodedb);
		}

		var linkslist = [];
		for (var i=0; i<numlinksdb; i++) {
		
		onelinkdb = {"hash":parseInt(linksjs[i]['hash']),"source":parseInt(linksjs[i]['source']),"target":parseInt(linksjs[i]['target']),"evalpos":parseInt(linksjs[i]['evalpos']),"evalneg":parseInt(linksjs[i]['evalneg']),"evaluatedby":(linksjs[i]['evaluatedby']).split("@@@@"),"type":linksjs[i]['type'],"author":linksjs[i]['author'],"time":linksjs[i]['time']};

		linkslist.push(onelinkdb);
		}

		modeldb = { nodes: nodeslist, links: linkslist, authors: []};
		
	}


	function db_savenode(newnode){

		var newnodejs = ["hash",newnode.hash,"content",newnode.content,"evalpos",newnode.evalpos,"evalneg",newnode.evalneg,"evaluatedby",(newnode.evaluatedby).join("@@@@"),"type",newnode.type,"author",newnode.author,"time",newnode.time];
		
		newnodestring = newnodejs.join('####');

		$.post("savenode.php", {newnodephp: newnodestring, conversation: conversation});
	}


	function db_savelink(newlink){

		var newlinkjs = ["hash",newlink.hash,"source",newlink.source,"target",newlink.target,"evalpos",newlink.evalpos,"evalneg",newlink.evalneg,"evaluatedby",(newlink.evaluatedby).join("@@@@"),"type",newlink.type,"author",newlink.author,"time",newlink.time];
				
		newlinkstring = newlinkjs.join('####');

		$.post("savelink.php", {newlinkphp: newlinkstring, conversation: conversation});
	}


	function db_update_eval_node(variable,value){

		var table="nodes_" + conversation,
			hash = parseInt(targetnode.hash);
	
		$.post("updateeval.php", {conversation:conversation, table:table, variable:variable, value:value, hash:hash});
		var variable = "evaluatedby",
			value = (targetnode.evaluatedby).join("@@@@");
			
		$.post("updateevaluatedby.php", {conversation:conversation, table:table, variable:variable, value:value, hash:hash});

	}


	function db_update_eval_link(variable,value){

		var table="links_" + conversation,
			hash = parseInt(targetlink.hash);
	
		$.post("updateeval.php", {conversation:conversation, table:table, variable:variable, value:value, hash:hash});
		var variable = "evaluatedby",
			value = (targetlink.evaluatedby).join("@@@@");
			
		$.post("updateevaluatedby.php", {conversation:conversation, table:table, variable:variable, value:value, hash:hash});

	}




	function update_public_conv_db(){

			$.post("updatepublicconv.php");
			return false;
	}
	

	function updateConversation(){
		
		var PRES = Visualisations.current().presentation;
		
		nodes = PRES.force.nodes();
		links = PRES.force.links();
		
		var old_model = Model.model;
		
		db_getmodel();
		generatemodel();
		Model.clear(modeldb);
		
		var new_model = Model.model;
	
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
		
		for (var i=0;i<updatednodes.length;i++){
			nodes.push(updatednodes[i]);
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
		
		for (var i=0;i<updatedlinks.length;i++){
			links.push(updatedlinks[i]);
		}	
			
		updatednodes.forEach(function(d, i) {
		  hash_lookup[d.hash] = d;
		});
		
		updatedlinks.forEach(function(d, i) {
		  d.source = hash_lookup[d.source];
		  d.target = hash_lookup[d.target];
		});
		
		
		if (updatedlinks.length>0 || updatednodes.length>0){
			drawnewnodes(PRES)
		}
		
	}

// end of dbcode ***

	
	function hashit(str){
		var hash = 5381;
		for (i = 0; i < str.length; i++) {
			char = str.charCodeAt(i);
			hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
		}
		return Math.abs(parseInt(hash));
	}


	function hashit2(str){

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
