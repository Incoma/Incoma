define(["opensave", "jsonmodels", "webtext", "model", "visualisation", "visualisation-zoomout", "visualisation-initialmenu", "conversations"]
, function(OpenSave, JsonModels, webtextModule,Model,Visualisations, Zoomout, InitialMenu, ConversationManager) {
	// Add trailing slash to the url to avoid problems with the .htaccess redirection
	url = window.location.href;
	if ((url.slice(-9) !== "index.php") && (url.slice(-1) !== "/") && (url.indexOf("?") == -1)) {
	window.location.href = window.location.href+"/";		
	} else {
	};
	
	$("#headerlangselect").val(weblang);
	
	
	// Set the text for the elements in the header
	//	 	document.getElementById("headerExport").innerHTML = tx_export;
	document.getElementById("headerMenu").innerHTML = webtextModule.tx_menu;
	document.getElementById("headerBlog").innerHTML = webtextModule.tx_blog;
	document.getElementById("noconversation_panel_text").innerHTML = webtextModule.tx_no_conversation;
	document.getElementById("noconversation_button").innerHTML = webtextModule.tx_goto_menu;
	document.getElementById("morelang").innerHTML = webtextModule.tx_morelang;
	
	$(function() {$('.resizable').resizable();});
	
	var reInit = function(newVisualisation) {
        if (newVisualisation) {
            newVisualisation.init( $( "#visualisationMain" )[0], Model.model);
        }
    };
    
    var saveModelFile = function() { return Model.exportFile(); }

    var loadModelFile = function(file) {
                            var fileName = file.name || "current conversation" ;
                            OpenSave.blobToText( file, function(text) { Model.importFile(text); reInit(Visualisations.current()); } );
                        }; 

    OpenSave.addExportListener( $( "#headerExport" )[0], webtextModule.tx_export, "Incoma-conversation.json", saveModelFile );
	
	
// dbcode ***
// All the functions that call to the PHP code to interact with the MySQL database

	
    author = "";
    this.modelfromdb = "";

	//if a conversation is being loaded, gets it from the db, if not, shows the initial menu
	if (conversation == "") {
		
		Model.clear(JsonModels.Menu);
		reInit(Visualisations.select(2));
	} else if(conversation == "sandbox") {
		ConversationManager.loadSandbox();
	} else {
		ConversationManager.loadConversation();
	};


	

    
    function checkifsaved(type, hash, checktime, newlink){
        $.post("php/checkifsaved.php", {conversation: conversation, type: type, hash: hash}, function(data){
            if (data == hash){
                if (typeof newlink != "undefined") {
                    db_savelink(newlink);
                } else {
                    if (showingsavingicon) setTimeout( function() {$("#saving").fadeOut(300)}, 400);
                    showingsavingicon = false;
                }
            } else {
                var actualtime = new Date().getTime();
                if (actualtime - checktime < 10000){
                    setTimeout(function(){checkifsaved(type, hash, checktime, newlink)}, 400);
                } else {
                    alert(webtextModule.tx_an_error);
                    location.reload(true);
                }
            }
        });
    }

    function checkifsavedonlynode(type, hash, checktime){
        $.post("php/checkifsaved.php", {conversation: conversation, type: type, hash: hash}, function(data){
            if (data == hash){
                if (showingsavingicon) setTimeout( function() {$("#saving").fadeOut(300)}, 400);
                showingsavingicon = false;
            } else {
                var actualtime = new Date().getTime();
                if (actualtime - checktime < 10000){
                    setTimeout(function(){checkifsavedonlynode(type, hash, checktime)}, 200);
                } else {
                    alert(webtextModule.tx_an_error);
                    location.reload(true);
                }
            }
        });
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
                Model.model.nodes.push(updatednodes[i]);
				
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
                Model.model.links.push(updatedlinks[i]);

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

	function changelanguage(selection){
	
        var path = "/"+window.location.pathname.match(/_[A-Za-z0-9-_]+/)+"/";
        if (window.location.pathname.match(/_[A-Za-z0-9-_]+/) == "") {		
        path="/";
        };

		switch (selection.value){	
			case "eng":
				var str = (conversation == "") ? path : path+"?c=" + conversation;
				window.location.href = str;				
				break;
			case "More":
				$("#headerlangselect").val(weblang);
				openlanguagepanel();
				break;

			default:
				var str = (conversation == "") ? path+selection.value+"/" : path+selection.value+"/?c=" + conversation;
				window.location.href = str;				
		}
	}
	
	function loadmenu(){

		setTimeout(function(){
            Model.clear(JsonModels.Menu);
            if (Visualisations.current() != null){
                var PRES = Visualisations.current().presentation;
                PRES.force.nodes([]);
                PRES.force.links([]);
            }
            $('#htmlcontent').fadeOut(300);
            $('#lower_bar').fadeOut(300);
            
			window.history.pushState("", "", "?"); //with this the page is not refreshed
			setTimeout(function(){ reInit(Visualisations.select(2)) }, 320);
			//window.location.href = "?";
		},10);
		
	}
});