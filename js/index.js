define(["opensave", "jsonmodels", "webtext", "model", "visualisation", "visualisation-zoomout", "visualisation-initialmenu", "conversations"]
, function(OpenSave, JsonModels, webtextModule,Model,Visualisations, Zoomout, InitialMenu, ConversationManager) {
	ConversationManager.onNoConversation = opennoconversationpanel;
	
	// Add trailing slash to the url to avoid problems with the .htaccess redirection
	url = window.location.href;
	if ((url.slice(-9) !== "index.php") && (url.slice(-1) !== "/") && (url.indexOf("?") == -1)) {
	window.location.href = window.location.href+"/";		
	} else {
	};
	
	$("#noconversation_button").click(bt_menu);
	$("#headerlangselect").val(weblang);
	$("#headerlangselect").change(function() { changelanguage(this) });
	
	
	// Set the text for the elements in the header
	//	 	document.getElementById("headerExport").innerHTML = tx_export;
	document.getElementById("headerMenu").innerHTML = webtextModule.tx_menu;
	$("#headerMenu")[0].onclick = bt_menu;
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
	

// end of dbcode ***

	function changelanguage(selection){
	
        /*var path = "/"+window.location.pathname.match(/_[A-Za-z0-9-_]+/)+"/";
        if (window.location.pathname.match(/_[A-Za-z0-9-_]+/) == "") {		
        path="/";
        };*/ //TODO
        path = window.location.pathname;

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
				var str = (conversation == "") ? path+"?lang="+selection.value : path+"?c=" + conversation+"&lang="+selection.value;
				alert(str);
				window.location.href = str;				
		}
	}
	
	
	function openlanguagepanel(){
		var width = 400;
		var height = 150;
		
		$('#language_panel').css({ 
			"width": width,
			"height": height,
			"top": ($(window).height()-height-150)/2, 
			"left": ($(window).width()-width-$('#right_bar').width())/2
		});
		
		$('#language_panel').fadeIn(200);
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
	
	function opennoconversationpanel(){
		var width = 300;
		var height = 100;
		
		document.getElementById("noconversation_panel").setAttribute("style","visibility:visible;");
		
		$('#noconversation_panel').css({ 
			"width": width,
			"height": height,
			"top": ($(window).height()-height-200)/2,
			"left": ($(window).width()-width)/2
		});
		
		$('#noconversation_button').width(90);
		
		autoupdate = "";
	}
	
	function bt_menu() {
		$( "#window_title" ).html("INCOMA");
		clearTimeout(autoupdate);
	    Model.clear(JsonModels.Menu);
		conversation = "";
	    
		$("#htmlcontent").fadeOut(300);
		$("#lower_bar").fadeOut(300);
		$("#legend_bar").fadeOut(300);
		$('#info_panel').fadeOut(300);
		$("#headerMenu").fadeOut(200);
	    //$("#headerBlog").fadeOut(200);
		$("#headerExport").fadeOut(200);
		$("#headerUsername").fadeOut(200);
	
		loadmenu();
	}
});