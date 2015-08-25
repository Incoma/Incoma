define(['webtext', 'visualisation', 'datetime', 'model', 'conversations', 'conversationtools', 'db'], 
function(Webtext, Visualisations, DateTime, Model, ConversationManager, ModuleConvTools, Db) {
	
		//definition of the html code of the right panel bar for different situations:
	// Reply and Connect buttons
	// Eval buttons
	// Eval buttons with a message
	// Reply button clicked
	// Connect button clicked
	// No buttons

	function insertRightPanelHtmlEval(node, mode) {
		var rightpanelhtmleval = "<div style='float:right; width: 105px;'><div style='float:right;'><div id='nodepos' class='evalpos'>+</div><div id='nodeneg' class='evalneg'>-</div></div><br><div id='evalalert' class='linkalerttext noselect' style='float:right;'></div><div id='arrowadveval' style='background-image: url(img/nodechangelight.png)' class='advevalicon' title='"+Webtext.tx_change_category+"'></div></div>";
		insertHtml(rightpanelhtmleval, node, mode);
		bindReactionTools();
	}
	
	function insertRightPanelHtmlEvalOver(node, mode) {
		rightpanelhtmlevalover = "<div style='float:right; width: 105px;'><div style='float:right;'><div id='nodepos' class='evalpos'>+</div><div id='nodeneg' class='evalneg'>-</div></div><br><div id='evalalert' class='linkalerttext noselect' style='float:right;'></div></div>";
		insertHtml(rightpanelhtmlevalover, node, mode);
		bindReactionTools();
	}
	
	function insertRightPanelHtmlLinkEval(node, mode) {
		var rightpanelhtmllinkeval = "<div id='showeditlink' class='button showedit' style='margin-top:4px;' title='"+Webtext.tx_edit_thought+"'><div id='showediticon'></div></div><div style='float:right;'><div id='evalalert' class='alerttext noselect'></div><div id='linkpos' class='evalpos'>+</div><div id='linkneg' class='evalneg'>-</div></div><br><div id='arrowadveval' style='background-image: url(img/nodechangelight.png)'; class='advevaliconlink' title='"+Webtext.tx_change_category+"'></div><div id='evalalert' class='linkalerttext noselect' style='float:right;'></div></div>";
		insertHtml(rightpanelhtmllinkeval, node, mode);
		bindLinkReactionTools();
	}
	
	function insertRightPanelHtmlLinkEvalOver(node, mode) {
		var rightpanelhtmllinkevalover = "<div id='showeditlink' class='button showedit' style='margin-top:4px;' title='"+Webtext.tx_edit_thought+"'><div id='showediticon'></div></div><div style='float:right;'><div id='evalalert' class='alerttext noselect'></div><div id='linkpos' class='evalpos'>+</div><div id='linkneg' class='evalneg'>-</div></div><br><div id='evalalert' class='linkalerttext noselect' style='float:right;'></div></div>";
		insertHtml(rightpanelhtmllinkevalover, node, mode);
		bindLinkReactionTools();
	}
	
	function insertRightPanelHtmlReply(node, mode) {
		var rightpanelhtmlreply = "<table><tr><td id='tdnodetype'>"+Webtext.tx_type_reply+":&nbsp<select id='replynodetype'></select></td><td>&nbsp&nbsp&nbsp&nbsp</td><td id='tdlinktype'>"+Webtext.tx_type_connection+":&nbsp<select id=\"replylinktype\" style='display:inline-block;'></select></td></tr></table><textarea id='replybox' class='areareply' spellcheck='false' maxlength='5000'></textarea>"+Webtext.tx_summary_reply+":<textarea id='replyboxsum' class='areareplysum' spellcheck='false' maxlength='100'></textarea>&nbsp&nbsp&nbsp&nbsp<div class='replysavecancel'><center><div id='savenode' class='save button'>"+Webtext.tx_save+"</div><div id='hidereplypanel' class='cancel button'>"+Webtext.tx_cancel+"</div></center><div id='replyalert' class='alerttext noselect' style='text-align:right;'>&nbsp</div></div>";
		insertHtml(rightpanelhtmlreply, node, mode);
		bindReplyPanelTools();
	}
	
	function bindReplyPanelTools() {
		$('#savenode, #hidereplypanel').off('click');
		$('#savenode').click(savenode);
		$('#hidereplypanel').click(hidereplypanel);
	}
	
	function insertRightPanelHtmlLink(node, mode) {
		var rightpanelhtmllink = "<table><tr><td id='tdconnect'><select id='connectlinktype'></select></td><td><p>&nbsp&nbsp</p></td><td><div id='cancellink' class='cancel button' onClick='cancellink()'>"+Webtext.tx_cancel+"</div></td></tr></table><br><div id='connecttext' class='connecttext'>&nbsp</div>";
		insertHtml(rightpanelhtmllink, node, mode);
		bindLinkPanelTools();
	}
	
	function bindLinkPanelTools() {
		$('#cancellink').off('click');
		$('#cancellink').click(cancellink);
	}
	
	function insertRightPanelEditLink(node, mode) {
		var rightpaneleditlink = "<table><tr><td id='tdconnect'><select id='connectlinktype'></select></td><td><p>&nbsp&nbsp</p></td><td><div id='editlink' class='save button' onClick='editlink()'>"+Webtext.tx_save+"</div></td></tr></table><br>";
		insertHtml(rightpaneleditlink, node, mode);
		bindEditLinkPanel();
	}
	
	function bindEditLinkPanel() {
		$('#editlink').off('click');
		$('#editlink').click(editlink);
	}
	
	function insertRightPanelHtmlSpace(node, mode) {
		var rightpanelhtmlspace = "<div style='float:left;visibility:hidden;'><div style='float:right;'><div id='nodepos' class='evalpos'>+</div></div><br></div>"; 
		insertHtml(rightpanelhtmlspace, node, mode);
	}
	
	function insertTimevisInteractHtml(node, mode) {
		var timevisinteracthtml = "<div id='evalalert' class='linkalerttext noselect' style='float:left;'></div><div style='float:right;'><div id='showreply' class='smallshowreplypanel justbutton'>"+Webtext.tx_reply+"</div><div id='showconnect' class='smallshowconnectpanel justbutton'>"+Webtext.tx_connect+"</div><div id='nodepos' class='smallevalpos justbutton'>+</div><div id='nodeneg' class='smallevalneg justbutton'>-</div></div>";
		insertHtml(timevisinteracthtml, node, mode);
		bindReactionTools();
	}
	
	function insertRightPanelHtmlReplyAndLink(node, mode) {
		var rightpanelhtmlreplyandlink = "<div id='showreply' class='showreplypanel button'>"+Webtext.tx_reply+"</div><div id='showconnect' class='showconnectpanel button'>"+Webtext.tx_connect+"</div><div id='showeditnode' class='button showedit' title='"+Webtext.tx_edit_thought+"'><div id='showediticon'></div></div>";
		insertHtml(rightpanelhtmlreplyandlink, node, mode);
		bindReactionTools();
	}
	
	function bindLinkReactionTools() {
		$('#showeditlink, #linkpos, #linkneg, #arrowadveval').off('click');
		$('#showeditlink').click(showeditlink);
		$('#linkpos').click(linkevalpos);
		$('#linkneg').click(linkevalneg);
		$('#arrowadveval').click(openadvevallinkpanel);
	}
	
	function bindReactionTools() {
		$('#showreply, #showeditnode, #showconnect, #nodepos, #nodeneg, #arrowadveval').off('click');
		$('#showreply').click(function() { showreplypanel(false) });
		$('#showeditnode').click(function() { showreplypanel(true) });
		$('#showconnect').click(function() { showcreatelink(false) });
		$('#nodepos').click(evalpos);
		$('#nodeneg').click(evalneg);
		$('#arrowadveval').click(openadvevalnodepanel);
	}
	
	function insertRightBarHtml(node, mode) {
		var rightbarhtml = '<center><div id="changevisualization" class="changevisualization justbutton">'+Webtext.tx_show_timeline+'</div></center><div id="right_bar_header" class="right_bar_header "><div id="contentlabel" class="right_bar_title">&nbsp</div></div><div id="contbox" class="divareacontent"></div><div id="rightpaneleval"></div><div id="rightpanel"></div><div id="rightpanelspace"></div>';
		insertHtml(rightbarhtml, node, mode);
		bindRightPanel();
	}
	
	function insertTimevisRightBarHtml(node, mode) {
		var timevisrightbarhtml = '<div id="saving" style="display:none;"><div id="savingicon"></div><div id="savingtext">'+Webtext.tx_saving+'</div></div><center><div id="changevisualization" class="changevisualization justbutton">'+Webtext.tx_hide_timeline+'</div></center><div id="timevisdiv" class="timevisdiv"></div>';
		insertHtml(timevisrightbarhtml, node, mode);
		bindRightPanel();
	}
	
	function bindRightPanel() {
		$('#changevisualization').off('click');
		$('#changevisualization').click(changevisualization);
		
		$('#contentlabel').off('dblclick');
		$('#contentlabel').dblclick(rbexpand);
	}
	
	function insertNewline(node) {
		insertHtml('<br />', node, 'append');
	}
	                     
	function insertHtml(html, node, mode) {
		switch(mode) {
			case 'append':
				node.html(node.html()+html)
				break;
			case 'replace':
			default:
				node.html(html);
		}
	}
	
	Visualisations.register(new ZoomOut()); //adds the ZoomOut visualization to the Visualizations array
	/*
	    ZoomOut follows the Presentation/Abstraction/Control pattern:
	    * Abstraction: 
	            This object keeps all data that is needed for the presentation. If it refers to an external model, it is also responsible
	            for updating itself when the external data changes, for example by registering appropiate listeners with the external model.
	            The Abstraction also stores the current selection, current zoom state and edit modes (for example "creatinglink")
	            Lastly the abstraction provides methods for manipulating its data.
	    * Presentation:
	            The single main responsibility of the presentation is to take the data from the abstraction and put it on screen.
	            It usually provides an update() method that refreshes the screen from the data.
	            It should also provide methods for translating screen coordinates to objects from the abstraction (selecting) and for
	            registering callbacks for mouseclicks, textedits etc.
	            Methods in Presentation never change data directly!
	    * Control:
	[Not yet implemented]
	            This object provides methods for all possible user interactions: editing, creating, deleting, selecting, ...
	            These methods receive some parameters and then change the data in the abstraction and the model.
	            It also registers callbacks with the presentation for events it wants to interpret. 
	 */
	
	//*****************************************************************************************************************************
	//stablishes the name and defines the Abstraction, Presentation and Control modules of the visualization
	function ZoomOut() {
	
	    this.name = "Zoom Out",
	    this.abstraction = new ZoomOut_Abstraction();
	    this.presentation = new ZoomOut_Presentation(this, this.abstraction);
	    this.control = new ZoomOut_Control(this, this.abstraction, this.presentation);
	
	    this.init = function (html5node, model) {
	        this.abstraction.init(model);
	        this.presentation.init(html5node);
	        this.control.init();
	    }
	
	    this.destroy = function () {}
	}
	
	//*****************************************************************************************************************************
	// Start of this == abstraction = model and state of filters [abstraction initialized passing to it a (model)]
	function ZoomOut_Abstraction() {
	
	    this.model = null;
	    
	    this.init = function (model) {
	        this.model = model;
			this.clickednode = "";
	        this.clickednodehash = "";
			this.overnodehash = "";
	        this.clickedlinkhash = "";
			this.selectedlink = "";
	        this.creatinglink = false;
			this.replying = false;
	        this.advevalnode = false;
	        this.advevallink = false;
			this.overnode = false;
			this.overlink = false;
			this.overseed = false;
			this.letmouseover = false;
			this.tutorialopened=false;
			this.showingevolution=false;
			this.evolutionpause=false;
	        this.evolutionstop=false;
			this.timevisualization=false;
			this.youarenotalone=false;
			this.treeview=false;
			//this.loading=true; //TODO: yes or no?
	        this.name="";
	        this.namepanelcaller="";
	        this.namepanelparameter="";
	        this.freezelink=false;
	        this.filters = {
	        	sizeFilter: ModuleConvTools.SizeFilters.Evaluations, //TODO: initialize from the ConversationTools values
	        	showFilter: 'none',
	        	nodeFilters: [],
	        	linkFilters: [],
	        }
	        this.filters.nodeFilters[ModuleConvTools.NodeFilters.General] = { state: true, name: Webtext.tx_general };
	        this.filters.nodeFilters[ModuleConvTools.NodeFilters.Question] = { state: true, name: Webtext.tx_question };
	        this.filters.nodeFilters[ModuleConvTools.NodeFilters.Proposal] = { state: true, name: Webtext.tx_proposal };
	        this.filters.nodeFilters[ModuleConvTools.NodeFilters.Info] = { state: true, name: Webtext.tx_info };
	        this.filters.linkFilters[ModuleConvTools.LinkFilters.General] = { state: true, name: Webtext.tx_general };
	        this.filters.linkFilters[ModuleConvTools.LinkFilters.Agreement] = { state: true, name: Webtext.tx_agreement };
	        this.filters.linkFilters[ModuleConvTools.LinkFilters.Disagreement] = { state: true, name: Webtext.tx_disagreement };
	        this.filters.linkFilters[ModuleConvTools.LinkFilters.Consequence] = { state: true, name: Webtext.tx_consequence };
	        this.filters.linkFilters[ModuleConvTools.LinkFilters.Alternative] = { state: true, name: Webtext.tx_alternative };
	        this.filters.linkFilters[ModuleConvTools.LinkFilters.Equivalence] = { state: true, name: Webtext.tx_equivalence };
	    }
	};
	// End of this == abstraction
	
	//*****************************************************************************************************************************
	// Start of this == presentation [initialized passing it (html5node, abstraction)]
	function ZoomOut_Presentation(VIS, ABSTR) {
	    // public interface
	
	// There are two sets of nodes and links with different ways to call them
	// Model.model.nodes contains all the nodes of the db
	// PRES.force.nodes() [aka remainingnodes aka timednodes] contains the nodes above the minimum rating
	// PRES.svg.selectAll(".node") acts over all the nodes of PRES.force.nodes()
	//
	// Pushing a new node into PRES.force.nodes() automatically adds it to Model.model.nodes, but 
	// doing a PRES.force.nodes(arrayofnodes) does not add them to Model.model.nodes
	//
	// PRES.readnodes    array of Hashes of read nodes
	// PRES.sessionnodes  array of Nodes created during the current session
	// allnodes
	// danodes
	
	// At the beginning of changevisualization can be seen the change.log of each one of these
		
	    this.container = null;
	    this.nodeSizeDefault = 15;
	    this.linkStrokeWidthDefault = 5;
	    this.seedSizeDefault = 2;
	    this.linkOpacityDefault = 1;
	    this.nodeOpacityDefault = 1;
	    this.updateinterval = 60000;
	    this.width = $(window).width();
	    this.height = $(window).height()-50;
	    //this.filtershelp = true;
	    this.darkerarrowsseeds = 2;
	    this.darkernodes = 0.3;
		//this.showfilters = false;
		this.evolutionvelocity = 1;
		this.readnodes = [];
		this.drawexplosions = true;
		this.elasticdraw = true;
		this.showingtags = false;
		this.showingsums = false;
		this.showingauthors = false;
		this.savelinks = "";
	    this.sessionnodes = [];
	    this.sessionlinks = [];
	    this.editingnode = false;
		
	    this.bordercolor = {
	        "normal": "#888",
	        "clicked": "#333",
			"over": "#c32222",
			"origin": "#360"
	    };
	
	    this.svg = null;
		
	//arrays of colors for nodes and links
		
	//  CODE   	   = ["#000000", "General", "Questio", "Proposa", "Info   "];
	    this.nodecolor = ["#000000", "#f9c8a4", "#a2b0e7", "#e7a2dd", "#bae59a"];
	
	//  CODE           = ["#000000", "General", "Agreeme", "Disagre", "Consequ", "Alterna", "Equival"]; 
	    this.linkcolor = ["#000000", "#f9c8a4", "#7adc7c", "#e85959", "#b27de8", "#c87b37", "#ecaa41"];
	                                           
	    
	    this.liveAttributes = new LiveAttributes(ABSTR, this);
		
	    this.update = function () {
	        this.definedBelow();
	    }
			
	    this.init = function (html5node) {
	        this.definedBelow();
	    }
	    
	    this.setViewport = function(tx, ty, zoom, transitionTime) {
	    	this.svg
				.transition().ease("cubic-out").duration(transitionTime)
	            .attr("transform","translate(" + tx + ',' + ty + ") scale(" + zoom + ")");
	    };
		
	    // end of public interface
	
		
	    //*******
	    // Start of init function = change the html code (.innerHTML) inside of the html5node (adding visualization, text areas, and filters) and calls with the abstraction as a parameter: initSVG, initLinkFilters, initNodeFilters, initSizeFilters (this four will create the filters and the svg and place it in the previous html code)	
	    this.init = function (html5node) {
	        this.scaler = new Scaler(this);
	        this.container = html5node;
	
			//defines the html content of the visualization (except the header, defined in index)
	        html5node.innerHTML =
	            '   \
	              <div id="htmlcontent" class="svg_and_right_bar" >   \
	   \
	                  <div id="svg">   \
	                    <div class="svg">  </div>   \
	                  </div>   \
		 \
		 			  <div id="left_bar" class="mod noselect">   \
	                    <div class="left_bar_header noselect">   \
							<center>   \
	                            <div class="zoombutton shadow" id="cmd_zoomin" style="float:right;">+</div>    \
	                            <div class="zoombutton shadow" id="cmd_zoomout" style="float:left;">-</div>   \
	                        </center>   \
	                    </div>   \
					  </div>   \
		\
						<div id="viewtype" class="viewtype noselect">  \
						  <center>  \
						    <div id="treeview" style="background-image: url(img/treeicon.png)"; class="viewicon button noselect" title="'+Webtext.tx_show_all_connections+'";></div>  \
						  </center>  \
						</div>  \
		\
					  <div>  \
	                    <div id="showevolution" class="showevolution shadow noselect" title="'+Webtext.tx_watch_the_evol+'">  \
	                        <div id="evolutionpause" class="evolutioncontrols">ll</div>  \
	                        <div id="evolutionplay" class="evolutioncontrols">&#9654;</div>  \
	                    </div>  \
	                  </div>   \
		\
		 			  <div class="title_container noselect">  \
						<div id="conversation_title" class="conversation_title noselect" onclick="egg1()";>   \
							title \
						</div>   \
					  </div>  \
		\
		 			  <div id="tutorial_panel" class="tutorial_panel shadow noselect">   \
						<div id="tutorial_panel_close" class="tutorial_panel_close noselect"></div>  \
						<div class="tutorial_panel_click noselect"></div>  \
	                  </div>   \
		\
	                  <div id="right_bar" class="right_bar shadow">   \
	                    <div id="saving">  \
	                        <div id="savingicon"></div>  \
	                        <div id="savingtext">'+Webtext.tx_saving+'</div>  \
	                    </div>  \
						<center>  \
						  <div id="changevisualization" class="changevisualization justbutton">  \
							'+Webtext.tx_show_timeline+'  \
						  </div>  \
						</center>  \
	                    <div id="right_bar_header" class="right_bar_header noselect">   \
	                      <div id="contentlabel" class="right_bar_title noselect" ondblclick="rbexpand()">&nbsp</div>   \
	                    </div>   \
	                    <div id="contbox" class="divareacontent"></div>   \
						<div id="rightpaneleval"></div> \
						<div id="rightpanel"></div> \
	                    <div id="rightpanelspace"></div> \
	                  </div>   \
		\
	             </div>   \
		\
	             <div id= "lower_bar" class="lower_bar shadow ">  \
	             </div>   \
		 			  <div id="language_panel" class="language_panel shadow ">   \
						'+Webtext.tx_no_more_lang+'<br><br>'+Webtext.tx_help_translate1+' <br>'+Webtext.tx_help_translate2+'  \
						<a href="http://titanpad.com/incomatranslation" target="_blank">titanpad.com/incomatranslation</a>  \
						<div id="language_button" class="language_button button">'+Webtext.tx_ok+'</div>  \
	                  </div>   \
		\
		 			  <div id="advevalnode_panel" class="advevalnode_panel shadow ">   \
						<b>'+Webtext.tx_change_of_cat+'</b> \
	                                     <br></br>'+Webtext.tx_propose_new_node+'<center><table><tr><td id="tdnewcat"><select id="newcatnodetype"></select></td></tr> \
	                                    </table></center>'+Webtext.tx_changed_after+'<div id="advevalalert" class="linkalerttext noselect"></div>\
	                    <div class="advevalnode_panel_buttons">  \
	                        <div id="advevalnode_panel_ok" class="advevalnode_panel_button button">'+Webtext.tx_change+'</div>  \
	                        <div id="advevalnode_panel_cancel" class="advevalnode_panel_button button">'+Webtext.tx_cancel+'</div>  \
	                    </div>  \
	                  </div>   \
		 			  <div id="advevallink_panel" class="advevallink_panel shadow ">   \
						<b>'+Webtext.tx_change_of_cat+'</b> \
	                                     <br></br>'+Webtext.tx_propose_new_link+'<center><table><tr><td id="tdnewcat"> \
		 		<select id="newcatlinktype"></select></td></tr></table></center>'+Webtext.tx_changed_after+'<div id="advevalalertlink" class="linkalerttext noselect"></div>\
	                    <div class="advevallink_panel_buttons">  \
	                        <div id="advevallink_panel_ok" class="advevallink_panel_button button">'+Webtext.tx_change+'</div>  \
	                        <div id="advevallink_panel_cancel" class="advevallink_panel_button button">'+Webtext.tx_cancel+'</div>  \
	                    </div>  \
	                  </div>   \
		 			  <div id="name_panel" class="name_panel shadow ">   \
						'+Webtext.tx_intro_username+': \
	                    <textarea id="name_textarea" class="areaname" spellcheck="false" maxlength="20"></textarea>  \
	                    <div class="name_panel_buttons">  \
	                        <div id="name_panel_ok" class="name_panel_button button">'+Webtext.tx_ok+'</div>  \
	                        <div id="name_panel_cancel" class="name_panel_button button">'+Webtext.tx_cancel+'</div>  \
	                    </div>  \
	                  </div>   \
	              <div id="loading_conv_panel" class="noselect">   \
					<div id="loading_conv_icon"></div>  \
	                <div id="loading_conv_text">'+Webtext.tx_loading+'</div>  \
				  </div>   \
		\
	        '; // end of innerHTML
	
			nodescutvalue = -1000;
			linkscutvalue = -1000;
	        
			insertRightPanelHtmlSpace($('#rightpanelspace'));
			
			//stablish the onclick functions for the html elements of html5node
			$( "#cmd_zoomin" )[0].onclick = this.scaler.zoomin;
	        $( "#cmd_zoomout" )[0].onclick = this.scaler.zoomout;
	        //$( "#filters_title" )[0].onclick = hideshowfilters;
			$( "#tutorial_panel" )[0].onclick = changetutorialpanel;
			$( "#tutorial_panel_close" )[0].onclick = closetutorialpanel;
			$( "#language_button" )[0].onclick = closelanguagepanel;
	        $( "#name_panel_ok" )[0].onclick = namepanelok;
	        $( "#name_panel_cancel" )[0].onclick = namepanelcancel;
	        $( "#advevalnode_panel_ok" )[0].onclick = advevalnodepanelok;
	        $( "#advevalnode_panel_cancel" )[0].onclick = advevalnodepanelcancel;
	        $( "#advevallink_panel_ok" )[0].onclick = advevallinkpanelok;
	        $( "#advevallink_panel_cancel" )[0].onclick = advevallinkpanelcancel;
	        $( "#showevolution" )[0].onclick = bigevolutionclick;
			$( "#evolutionplay" )[0].onclick = evolutionplay;
			$( "#evolutionpause" )[0].onclick = evolutionpause;
			$( "#treeview" )[0].onclick = treeview;
			$( "#treeview" )[0].onmouseover = treeviewover;
			$( "#treeview" )[0].onmouseout = treeviewout;
			bindRightPanel();
	        
			
			//$("#completeview").addClass('active');
			$("#completeview").css("box-shadow", "inset -1px 1px 1px 0px rgba(0, 0, 0, 0.5)");
			
			$( "#conversation_title" ).html(Model.title);		
			$( "#window_title" ).html("INCOMA ("+Model.title+")");
	
			//makes visible some elements of the header
		 	document.getElementById("headerMenu").setAttribute("style","visibility:visible;");
			document.getElementById("headerExport").setAttribute("style","visibility:visible;");
			
			//fadein animation
			$("#htmlcontent").fadeOut(0);
			$("#lower_bar").fadeOut(0);
			$("#legend_bar").fadeOut(0);
			$('#tutorial_panel').fadeOut(0);
			$('#language_panel').fadeOut(0);
	        $('#name_panel').fadeOut(0);
	        $('#advevalnode_panel').fadeOut(0);
	        $('#advevallink_panel').fadeOut(0);
			$('#svg').fadeOut(0);
	        $('#saving').fadeOut(0);
	        $('#evolutionpause').fadeOut(0);
	        $('#loading_conv_panel').fadeOut(0);
			
			//makes the right_bar resizable
			$(".right_bar").resizable({
				handles: 'w, s',
				minWidth: 335,
	  			resize: function() {
					$(this).css("left", 0);
				}
			});
			
			if ($(window).width()>1300){$("#right_bar").width($(window).width()/3.2);};
			
			rbwidth = $("#right_bar").width();
			cbheight = $("#contbox").height();
		
			//open the tutorial in Sandbox mode
			if (conversation === "sandbox" || conversation === "sandbox_es"){
				ABSTR.tutorialopened = true;
				ABSTR.tutorialstep = -1;
				$('#tutorial_panel').delay(800).fadeIn(600)
				changetutorialpanel();
			}		
			
		//Create the svg
	        initSVG(this, ABSTR, this.width, this.height);
	
	    };
	    // End of init function of presentation
	    //*******
		
	    // Start of initSVG = create the svg from the abstraction, and place it into the "visualization" html div tag inserted on the html5node	
	    function initSVG(PRES, ABSTR, width, height) {
	
	        PRES.force = d3.layout.force()
	            .charge(-5000)
				.gravity(0.1)
	            .linkDistance(50)
				.theta(0.95)
				.friction(0.85)
	            .size([width, height]);
				
	        var force = PRES.force;
	
	        PRES.svgg = d3.select(".svg").append("svg")
	            .attr("width", width)
	            .attr("height", height);
				
	        var svgg = PRES.svgg;
	        // force and svg are local to "presentation" (defined as this.force); 
	        // (but we define them locally as a shorthand)
	        // graph and link are local only to "initSVG" (var graph)
	
			PRES.svg = svgg
				.append('svg:g')
				.call(d3.behavior.zoom().on("zoom", PRES.scaler.rescale))
				.on("dblclick.zoom", null)
				.append('svg:g')
				.on("mousemove", PRES.liveAttributes.mousemove);
			
			var svg = PRES.svg;
			
			PRES.background = svg.append('svg:rect')
				.attr('width', width*11)
				.attr('height', height*11)
				.attr("x",-5*height)
				.attr("y",-5*height)
				.attr('fill', "white")
				.style("stroke-width", "15px")
	            .style("stroke", "blue")
				.style("stroke-opacity",0)
				.on("click", PRES.liveAttributes.backgroundclick);
			
	
	        var graph = ABSTR.model;
			
			//stablishes the correct relation between links source/target and the nodes hash
			hash_lookup = [];
			
			update_hash_lookup(graph.nodes, graph.links);
			
			
			//an array with the data to create the 'seed nodes' marks
			PRES.seedsdata = [];
	
			graph.nodes.forEach(function(d, i) {		
				if (d.seed > 0){
					PRES.seedsdata.push({homenode:d, seedtype:d.seed});
				}		
				
			});
	
			//initial position of the nodes
			// graph.nodes.forEach(function(d, i) {		
					 // d.x = d.y = width / graph.nodes.length * i;
			// });
	
			
			//definition of the renormalization for nodes and links sizes
			definerenormalization();
	
			
	        force
	            .nodes(graph.nodes)
	            .links(graph.links)
	            .start();
	        
			//appends all the visual elements to the SVG
			PRES.linkselect = svg.append("line")
				.attr("class", "linkselect")
				.attr("x1", 0)
				.attr("y1", 0)
				.attr("x2", 0)
				.attr("y2", 0)
				.style("stroke-width", 0)
				.style("stroke", PRES.bordercolor.over);
			
			PRES.linkselectw = svg.append("line")
				.attr("class", "linkselect")
				.attr("x1", 0)
				.attr("y1", 0)
				.attr("x2", 0)
				.attr("y2", 0)
				.style("stroke", "white")
				.style("stroke-width", 0)
				.style("stroke-opacity", 1);
				
			PRES.prelink = svg.append("line")
				.attr("x1", 0)
				.attr("y1", 0)
				.attr("x2", 0)
				.attr("y2", 0)
				.style("stroke-width", 3)
				.style("stroke", "black")
				.style("stroke-dasharray", "8,6")
				.style("stroke-linecap", "round")
				.style("stroke-opacity",0);
	
			//Add the links	
	        PRES.links = svg.selectAll(".link")
	            .data(graph.links)
	            .enter().append("line")
	            .attr("class", "link")
				.attr("marker-start", PRES.liveAttributes.linkArrow)
	            .style("stroke", PRES.liveAttributes.linkStroke)
	            .style("stroke-width", PRES.liveAttributes.linkStrokeWidth)
				.style("stroke-dasharray", PRES.liveAttributes.linkStrokeDashArray)
				.style("stroke-linecap", "round")
				.style("stroke-opacity", PRES.liveAttributes.linkStrokeOpacity)
				.on("mouseover", PRES.liveAttributes.mouseoverlink)
				.on("mouseout", PRES.liveAttributes.mouseoutlink)
	            .on("click", PRES.liveAttributes.clicklink);
				
			//Add the nodes	
			PRES.nodes = svg.selectAll(".node")
	            .data(graph.nodes)
	            .enter().append("circle")
	            .attr("class", "node")
				.attr("cx",function(d){return d.x;})
				.attr("cy",function(d){return d.y;})
	            .attr("r", PRES.liveAttributes.nodeRadius)
				.style("stroke", PRES.liveAttributes.nodeStroke)
				.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
	            .style("fill", PRES.liveAttributes.nodeFill)
				.style("fill-opacity",PRES.nodeOpacityDefault)
	            .on("mouseover", PRES.liveAttributes.mouseover)
				.on("mouseout", PRES.liveAttributes.mouseout)
	            .on("click", PRES.liveAttributes.click)
				.on("dblclick", PRES.liveAttributes.dblclick);
				
			//Add the seeds in the nodes	
			PRES.seeds = svg.selectAll(".seed")
				.data(PRES.seedsdata)
				.enter().append("circle")
				.attr("class", "seed")
				.attr("r", PRES.liveAttributes.seedRadius)
				.style("fill", PRES.liveAttributes.seedColor)
				.on("mouseover", PRES.liveAttributes.mouseoverseed)
				.on("mouseout", PRES.liveAttributes.mouseoutseed);
							
			for (var i=0;i<PRES.linkcolor.length;i++){
			// Defines the arrows of the links
				var str = "inversearrow"+i;
				
				PRES.arrows = svg.append("defs").append("marker")
					.attr("id", "arrow"+i)
					.attr("class", "arrowmarker")
				.attr("refX", -3)
				.attr("refY", 0.45)
					// Displacement to put the arrow in the middle of the link
					.attr("fill", PRES.liveAttributes.arrowColor(i))
					.attr("stroke", PRES.liveAttributes.arrowColor(i))
					.attr("stroke-linecap", "round")
					.attr("stroke-linejoin", "round")
					.attr("stroke-width", 0.1)
					.attr("stroke-opacity", 1.0)
					.attr("fill-opacity", 1.0)
					.attr("markerWidth", 5)
					.attr("markerHeight", 5)
					.attr("orient", "auto")
					.append("path")
					.attr("d", " M 4 0 Q 0 0.45 4 0.9 Q 0.8 0.45 4 0");
					  // This is the form of the arrow. It starts in the point (y,x)=(4,0), it draws a quadratic Bézier curve to (4,0.9) with control point (0,0.45)
					  // and then another Bézier back to (4,0) with (0.8,0.45) as the control point
	
				// An inverted arrow
				PRES.inversearrows = svg.append("defs").append("marker")
					.attr("id", "inversearrow"+i)
					.attr("class", "arrowmarker")
					.attr("refX", -6) 
					.attr("refY", 0.45)
					.attr("fill", PRES.liveAttributes.arrowColor(i))
					.attr("stroke", PRES.liveAttributes.arrowColor(i))
					.attr("stroke-linecap", "round")
					.attr("stroke-linejoin", "round")
					.attr("stroke-width", 0.1)
					.attr("stroke-opacity", 1.0)
					.attr("fill-opacity", 1.0)
					.attr("markerWidth", 5)
					.attr("markerHeight", 5)
					.attr("orient", "auto")
					.append("path")
					.attr("d", " M 0 0 Q 4 0.45 0 0.9 Q 3.2 0.45 0 0");
			}
			
			
	
			//initial loading of the conversation		
			var numnodes = Model.model.nodes.length;
			var delay=600*Math.sqrt(numnodes);
	        console.log(delay);
	        
	        $('#loading_conv_panel').css("left", ( $(window).width()-$("#right_bar").width() - 255 )/2 + "px"); 
	        if (delay > 2500) $('#loading_conv_panel').fadeIn(700);
	        
			setTimeout(function(){
	            $('#htmlcontent').fadeIn(800);
	            $('#lower_bar').fadeIn(800);            
	        },0); //delay-1000
	        
			//fadeIn animation of all the svg elements
			PRES.nodes
				.style("fill-opacity",0)
				.style("stroke-opacity",0);	
				
			PRES.links
				.style("stroke-opacity",0);
	
			svg.selectAll(".seed")
				.style("fill-opacity",0)
				.style("stroke-opacity",0);				
				
			svg.selectAll(".arrowmarker")
				.style("fill-opacity",0)
				.style("stroke-opacity",0);		
	        
			setTimeout(function(){
	            PRES.nodes
	                .transition().duration(700)
	                .style("fill-opacity",1 )
	                .style("stroke-opacity",1);	
	                
	            PRES.links
	                .transition().duration(900)
	                .style("stroke-opacity",1);
	    
	            svg.selectAll(".seed")
	                .transition().duration(700)
	                .style("fill-opacity",1 )
	                .style("stroke-opacity",1);				
	                
	            svg.selectAll(".arrowmarker")
	                .transition().duration(900)
	                .style("fill-opacity",1 )
	                .style("stroke-opacity",1);		
			},delay);
	        
			setTimeout(function(){
	           $('#loading_conv_panel').fadeOut(500);
	            console.log("fade out");
			},delay-2500);
	        startevolution();
	        
	        //end of the loading, nodes become draggable
			setTimeout(function(){
				ABSTR.letmouseover = true;
				PRES.nodes.call(force.drag);
			},delay+750);
	        
	        
			//activation of the periodic conversation update with the nodes and links created by other users simultaneously
			autoupdate = setInterval(function(){ConversationManager.updateConversation();},PRES.updateinterval); 
			
			//initialposition of the screen
			PRES.setViewport(PRES.scaler.despx0, PRES.scaler.despy0, 1, 0);
			if (graph.nodes.length < 5){PRES.scaler.zoomin();};
			if (graph.nodes.length > 15){PRES.scaler.zoomout();};
			if (graph.nodes.length > 60){PRES.scaler.zoomout();};
			if (graph.nodes.length > 150){PRES.scaler.zoomout();};
			if (graph.nodes.length > 300){PRES.scaler.zoomout();};
			
			PRES.drawexplosions = false;
			PRES.evolutionvelocity = 9000;
			PRES.force.friction(0.95);
			PRES.force.charge(-9000);
			PRES.force.gravity(0.1);
			PRES.force.linkStrength(1);
			// startevolution();		
			treeview();
			ABSTR.loading = false; //TODO
			
			//defines the movement of the nodes and links
	        force.on("tick", function () {
	            
	//			PRES.svg.selectAll(".link")
	//			.attr("points", function(d) {
	//			return d.source.x + "," + d.source.y + " " +
	//			(d.source.x + d.target.x)/2 + "," + (d.source.y + d.target.y)/2 + " " +
	//			d.target.x + "," + d.target.y; });
	
		       PRES.svg.selectAll(".link")
	                .attr("x1", function (d) {return d.source.x;})
	                .attr("y1", function (d) {return d.source.y ;})
	                .attr("x2", function (d) {return d.target.x ;})
	                .attr("y2", function (d) {return d.target.y ;});
	
	
	            PRES.svg.selectAll(".node")
					.attr("cx", function (d) {return d.x;})
	                .attr("cy", function (d) {return d.y;});
					
				PRES.svg.selectAll(".seed")
					.attr("cx", function (d) {return d.homenode.x;})
	                .attr("cy", function (d) {return d.homenode.y;});
					
				PRES.svg.selectAll("text")
					.attr("x", function (d) {return d.node.x;})
	                .attr("y", function (d) {return (parseInt(d.node.y)-parseInt(PRES.liveAttributes.nodeRadius(d.node)))-1;});
								
	//Y
				if (ABSTR.selectedlink != ""){
					PRES.svg.selectAll(".linkselect")
						.attr("x1", function (d) {return ABSTR.selectedlink.source.x;})
						.attr("y1", function (d) {return ABSTR.selectedlink.source.y;})
						.attr("x2", function (d) {return ABSTR.selectedlink.target.x;})
						.attr("y2", function (d) {return ABSTR.selectedlink.target.y;});
				}
				
	        });
	
	    };
	    // End of initSVG
	
			//functions that define the attributes for nodes and links, depending on the filter states.
	    function LiveAttributes(ABSTR, PRES) {
	
	        this.nodeRadius = function (d) {
	            switch(ABSTR.filters.sizeFilter) {
	            	case ModuleConvTools.SizeFilters.Evaluations:
						return PRES.renormalizednode(d.evalpos-d.evalneg);
	            	case ModuleConvTools.SizeFilters.None:
	            	default:
	                	return PRES.nodeSizeDefault;
	            }
	        };
	
	        this.nodeFill = function (d) {
				if($.inArray(d.hash, PRES.readnodes) < 0){
					return PRES.nodecolor[d.type];
				} else {
					return d3.rgb(PRES.nodecolor[d.type]).darker(PRES.darkernodes).toString();
				}
	        };
			
	        this.nodeStroke = function (d) {
				if (ABSTR.clickednodehash == d.hash){return PRES.bordercolor.clicked;}
				if (ABSTR.overnodehash == d.hash){return PRES.bordercolor.over;}
				return PRES.bordercolor.normal;
	        };		
	
	        this.nodeStrokeWidth = function (d) {
	            if (ABSTR.filters.nodeFilters[d.type].state) {
					if ((ABSTR.clickednodehash == d.hash) || (ABSTR.overnodehash == d.hash)){
						return "3px";
					} else {
						return "1px";
					}
	            } else {
	                return "0px";
	            }
	        };
			
			this.nodeFillOpacity = function (d) {
	            if (ABSTR.filters.nodeFilters[d.type].state) {
	                return PRES.nodeOpacityDefault;
	            } else {
					return "0";
	            }
	        };
	
			this.textFillOpacity = function (d) {
	            if (ABSTR.filters.nodeFilters[d.node.type].state) {
	                return "1";
	            } else {
					return "0";
	            }
	        };
			
	        this.linkStroke = function (d) {
	            return PRES.linkcolor[d.type];
	        };
			
	
	        this.seedRadius = function (d) {
	
			            if (ABSTR.filters.nodeFilters[d.homenode.type].state) {
					return PRES.seedSizeDefault *d.seedtype;
			            } else {
			                return 0;
			            }
	        };
	
	        this.seedColor = function (d) {
				return d3.rgb(PRES.nodecolor[d.homenode.type]).darker(PRES.darkerarrowsseeds).toString();
	        };
			
			
	        this.linkArrow = function (d) {
	            if (ABSTR.filters.linkFilters[d.type].state && !(ABSTR.treeview && d.direct == 1)) {
					if ( d.type != 5 && d.type != 6 ) {                
						//  alternative and equivalence have no direction
						if (d.type == 2 && d.direct==1){
							return "";
							// agree and disagree have no direction if it is a connection
						} else if (d.type == 3 && d.direct==1) {
							return "";
							// general have no direction if it is a connection
						} else if (d.type == 1 && d.direct==1) {
							return "";
						} else {
							
							if (d.direct==1) {			
								//created by connection
								return "url(#inversearrow"+(d.type)+")";
							} else {
								// created by reply
								return "url(#arrow"+(d.type)+")";
							}
						}
					} else {
						return "";
					}
	
		        } else {
		            return "";
		        }
	
	        };
			
			
			this.arrowColor = function(type){
				return d3.rgb(PRES.linkcolor[type]).darker(PRES.darkerarrowsseeds).toString();
			}
				
	
	        this.linkStrokeWidth = function (d) {
	            if (ABSTR.filters.linkFilters[d.type].state) {
	                switch(ABSTR.filters.sizeFilter) {
	                	case ModuleConvTools.SizeFilters.Evaluations:
							return PRES.renormalizedlink(d.evalpos-d.evalneg);
						case ModuleConvTools.SizeFilters.None:
						default:
	                    	return PRES.linkStrokeWidthDefault;
					}
	            }
	            else return 0;
	        };
			
			
			this.linkStrokeDashArray = function (d) {
				if (d.direct==1){
					return "8,6";
				} else {
					return "0,0";
				}
			}
			
	
			this.linkStrokeOpacity = function (d) {
	            if ((!ABSTR.filters.linkFilters[d.type].state) || (ABSTR.treeview && d.direct == 1 && d.source.hash != ABSTR.overnodehash && d.target.hash != ABSTR.overnodehash && d.source.hash != ABSTR.clickednodehash && d.target.hash != ABSTR.clickednodehash)) {
	                if (ABSTR.selectedlink == d) hidelinkselect();
	                return "0";
	            } else {
					return (ABSTR.treeview && d.direct == 1) ? PRES.linkOpacityDefault*0.7 : PRES.linkOpacityDefault;
	            }
	        };
			
			
	        this.relatedNodesOpacity = function (d) {
	            if (!ABSTR.filters.linkFilters[d.type].state) {		
					affectednodes = PRES.svg.selectAll(".node")
									.filter(function(e){return ((e.hash == d.source.hash)||(e.hash == d.target.hash));})
					for (i=0;i<affectednodes[0].length;i++){
						var showedlinks = false;
						linkofaffectednodes = PRES.svg.selectAll(".link")
									.filter(function(e){return ((affectednodes[0][i].__data__.hash == e.source.hash)||(affectednodes[0][i].__data__.hash == e.target.hash));})
						
						for (j=0;j<linkofaffectednodes[0].length;j++){
							linkopacity = PRES.svg.selectAll(".link")
											.filter(function(e){return e.hash == linkofaffectednodes[0][j].__data__.hash;})
											.style("stroke-opacity");
							if (linkopacity > 0){showedlinks = true};
						};
						
						if (!showedlinks){
							PRES.svg.selectAll(".node")
									.filter(function(e){return e.hash == affectednodes[0][i].__data__.hash;})
									.style("fill-opacity",0)
									.style("stroke-opacity",0);
									
							PRES.svg.selectAll("text")
								.filter(function(e){return e.node.hash == affectednodes[0][i].__data__.hash;})
								.style("fill-opacity",0);
						};
					};
				};
				return PRES.linkcolor[d.type];
			}; 
	
	
	        this.relatedSeedRadius = function (d) {
	            if (!ABSTR.filters.linkFilters[d.type].state) {		
				// Look for all the seeds in nodes connected to the link that is going to be hidden
					affectedseeds = PRES.svg.selectAll(".seed")
									.filter(function(e){return ((e.homenode.hash == d.source.hash)||(e.homenode.hash == d.target.hash));})
					for (i=0;i<affectedseeds[0].length;i++){
					        var showedlinks = false;
						//For each of these seeds, look for other links connected to the same node
						linkofaffectedseeds = PRES.svg.selectAll(".link")
									.filter(function(e){return ((affectedseeds[0][i].__data__.homenode.hash == e.source.hash)||(affectedseeds[0][i].__data__.homenode.hash == e.target.hash));})
						//If any of these other links is visible (opacity not 0), then the variable showedlinks turns to true
						for (j=0;j<linkofaffectedseeds[0].length;j++){
							linkopacity = PRES.svg.selectAll(".link")
											.filter(function(e){return e.hash == linkofaffectedseeds[0][j].__data__.hash;})
											.style("stroke-opacity");
							if (linkopacity > 0){showedlinks = true};
						};
						//If the variable showedlinks is false (all the links of the node are hidden), then it hiddes the seed
						if (!showedlinks){
							PRES.svg.selectAll(".seed")
								.filter(function(e){return e.homenode.hash == affectedseeds[0][i].__data__.homenode.hash;})
					            .attr("r", 0);			
						};
					};
	
				};
				return PRES.linkcolor[d.type];
			}; 
	
	
	        this.relatedLinksOpacity = function (d) {
	            if (!ABSTR.filters.nodeFilters[d.type].state) {
				
					PRES.svg.selectAll(".link")
	                    .filter(function (e) {return e.source.hash == d.hash;})
	                    .style("stroke-opacity", 0);
	
					PRES.svg.selectAll(".link")
						.filter(function (e) {return e.source.hash == d.hash;})
						.attr("marker-start", "");
	
					PRES.svg.selectAll(".link")
						.filter(function (e) {return e.target.hash == d.hash;})
						.style("stroke-opacity", 0);
	
					PRES.svg.selectAll(".link")
						.filter(function (e) {return e.target.hash == d.hash;})
						.attr("marker-start", "");
	
	            }
				return PRES.nodecolor[d.type];
	        };		
	
		
		
	//functions for user interaction events	
	
			//if the user is creating a new link, updates the prelink line position and color
	        this.mousemove = function (d) {
				if (ABSTR.creatinglink && selectedconnectlinktype != 0 && !ABSTR.freezelink){
	                var nodes = PRES.force.nodes();
	                var index = searchhash(nodes, ABSTR.clickednodehash);
	                PRES.linecolor = PRES.linkcolor[selectedconnectlinktype];
					
					var x1 = nodes[index].x,
						y1 = nodes[index].y,
	                    p2 = PRES.scaler.translate(d3.mouse(svg)),
	                    x2 = p2[0],
	                    y2 = p2[1];
					
					PRES.prelink
						.attr("x1", x1)
						.attr("y1", y1)
						.attr("x2", x2)
						.attr("y2", y2)
						.style("stroke", PRES.linecolor);
				}
			};
	
			
	        this.mouseover = function (d) {
			
				if (ABSTR.overnode || !ABSTR.letmouseover){return;}
				
				var fillopacity = PRES.svg.selectAll(".node")
							.filter(function (e) {return e.hash == d.hash;})
							.style("fill-opacity");	
									
				if (fillopacity == 0){return};
				
				ABSTR.overnode = true;
							
				//if ((ABSTR.clickednodehash === "" && ABSTR.clickedlinkhash === "") || (ABSTR.creatinglink && (ABSTR.clickednodehash != d.hash || ABSTR.timevisualization))){
									
					ABSTR.overnodehash = d.hash;
					
					PRES.svg.selectAll(".node")
						.transition().delay(100).duration(0)
						.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
						.style("stroke", PRES.liveAttributes.nodeStroke);
					
					PRES.svg.selectAll(".link")
						.transition().delay(100).duration(0)
						.style("stroke-opacity", PRES.liveAttributes.linkStrokeOpacity);
					
					timednodecontentlabel = setTimeout(function(){
	
						if (ABSTR.timevisualization){
						
							overindex = $.inArray(d, timednodes);
							var id = "nodecontent"+overindex;
							overdivcontent(id);
							
							$('#timevisdiv').animate({
								scrollTop: $('#timevisdiv').scrollTop()+$("#"+id).position().top-60
							}, 400);
						
						} else {
						
							$("#right_bar").height('auto');
							insertRightPanelHtmlEvalOver($('#rightpaneleval'));
							$('#rightpanelspace').html("");
							document.getElementById("nodepos").innerHTML = "+" + d.evalpos;
							document.getElementById("nodeneg").innerHTML = ((d.evalneg===0) ? "" : "-") + d.evalneg;	
							
							$("#contbox").stop().slideDown(0);
							document.getElementById("contentlabel").setAttribute ("style", "border: solid 3px " + hex2rgb(PRES.bordercolor.over, 0.6) + "; background: "+  hex2rgb(PRES.nodecolor[d.type],0.5) +";");
						    if (d.seed == 2){
					 	              document.getElementById("contentlabel").innerHTML = "<b>" +Webtext.tx_initial_thought+ "</b>" + "&nbsp&nbsp" + " ("+Webtext.tx_by+" " +d.author + " - "+DateTime.timeAgo(d.time)+")";			
						    } else {
		    				document.getElementById("contentlabel").innerHTML = "<b>" + ABSTR.filters.nodeFilters[d.type].name + "</b>" + "&nbsp&nbsp" + " ("+Webtext.tx_by+" " +d.author + " - "+DateTime.timeAgo(d.time)+")";
						    };
						
							document.getElementById("contbox").innerHTML = URLlinks(nl2br(d.content));
						}
					},150);
				//}
	        };
			
			
	        this.mouseoverseed = function (e) {
				clearTimeout(timedmouseout);
				ABSTR.overseed = true;
	        };
	
	
	        this.mouseoverlink = function (d) {
			
		    if (ABSTR.treeview && d.direct == 1){return;}
	
				ABSTR.overlink = true;
				
				var strokeopacity = PRES.svg.selectAll(".link")
							.filter(function (e) {return e.hash == d.hash;})
							.style("stroke-opacity");	
									
				if (strokeopacity == 0){return};
				
				if (ABSTR.clickednodehash === "" && ABSTR.clickedlinkhash === ""){          
					
					drawlinkselect(d, PRES.bordercolor.over, 100, 0);
	
					ABSTR.selectedlink = d;
					
					timedlinkcontentlabel = setTimeout(function(){
					
						if (ABSTR.timevisualization){return;}
						
						insertRightPanelHtmlLinkEvalOver($('#rightpaneleval'));
	                    $("#showeditlink").hide();
						$('#rightpanelspace').html("");
						document.getElementById("linkpos").innerHTML = "+" + d.evalpos;
						document.getElementById("linkneg").innerHTML = ((d.evalneg===0) ? "" : "-") + d.evalneg;	
	
						
						document.getElementById("contentlabel").setAttribute ("style", "border: solid 3px " + hex2rgb(PRES.bordercolor.over, 0.6) + "; background: "+  hex2rgb(PRES.linkcolor[d.type],0.5) +";");
	
					        document.getElementById("contentlabel").innerHTML = "<b>" + ABSTR.filters.linkFilters[d.type].name + "</b>" + "&nbsp&nbsp" + " ("+Webtext.tx_by+" " +d.author + " - "+DateTime.timeAgo(d.time)+")";
	
						
						$("#right_bar").height($("#right_bar").height());
						$("#contbox").stop().slideUp(0);
						
					},150);
	
				}
	        };
			
	
	        this.mouseout = function (d) {
			
				if (!ABSTR.letmouseover){return;};
				
				timedmouseout = setTimeout(function(){
				
					ABSTR.overnode = false;
					ABSTR.overnodehash = "";
					
					clearTimeout(timednodecontentlabel);
					
					
					PRES.svg.selectAll(".node")
						.transition().duration(1)
						.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
						.style("stroke", PRES.liveAttributes.nodeStroke);
						
					PRES.svg.selectAll(".link")
						.transition().duration(1)
						.style("stroke-opacity", PRES.liveAttributes.linkStrokeOpacity);
					
						
					if(ABSTR.clickednodehash === "" && ABSTR.clickedlinkhash === ""){
	
						if (ABSTR.timevisualization){
						
							var index = $.inArray(d, timednodes);
							var id = "nodecontent"+index;
							outdivcontent(id);
							
						} else {
							clearcontentlabel();
						}
					}
					
					//if(ABSTR.creatinglink){
					
						timednodecontentlabel = setTimeout(function(){
							
							if (ABSTR.timevisualization){
								var index = $.inArray(d, timednodes);
								var id = "nodecontent"+index;
								outdivcontent(id);
	                            return;
							}
			
					
					if(ABSTR.clickednodehash !== ""){
							document.getElementById("contentlabel").setAttribute ("style", "border: solid 3px " + hex2rgb(PRES.bordercolor.clicked, 0.7) + "; background: "+  hex2rgb(PRES.nodecolor[ABSTR.clickednode.type],0.5) +";");
						    if (ABSTR.clickednode.seed == 2){
						                                 document.getElementById("contentlabel").innerHTML = "<b>"  +Webtext.tx_initial_thought+ "</b>" + "&nbsp&nbsp" + " ("+Webtext.tx_by+" " +ABSTR.clickednode.author + " - "+DateTime.timeAgo(ABSTR.clickednode.time)+")";
						    } else {
						    document.getElementById("contentlabel").innerHTML = "<b>" + ABSTR.filters.nodeFilters[ABSTR.clickednode.type].name + "</b>" + "&nbsp&nbsp" + " ("+Webtext.tx_by+" " +ABSTR.clickednode.author + " - "+DateTime.timeAgo(ABSTR.clickednode.time)+")";
						    };
	
							document.getElementById("contbox").innerHTML = URLlinks(nl2br(ABSTR.clickednode.content));
							
							document.getElementById("nodepos").innerHTML = "+" + ABSTR.clickednode.evalpos;
							document.getElementById("nodeneg").innerHTML = ((ABSTR.clickednode.evalneg===0) ? "" : "-") + ABSTR.clickednode.evalneg;	
			
					};
	
	
	
					if(ABSTR.clickedlinkhash !== ""){
	
	                var links2 = PRES.force.links();
	                var targetindex2 = searchhash(links2, ABSTR.clickedlinkhash);
	                clickedlink2 = links2[targetindex2];
					insertRightPanelHtmlLinkEval($('#rightpaneleval'));
					$('#rightpanel').html("");
					$('#rightpanelspace').html("");
	                var elapsedtime = (new Date().getTime() / 1000) - ABSTR.selectedlink.time;
	                var recentnewlink = ($.inArray(ABSTR.selectedlink, PRES.sessionlinks) > -1 && elapsedtime < 300);
	                (recentnewlink || Model.editable == "1") ? $("#showeditlink").show() : $("#showeditlink").hide();
	
				document.getElementById("contentlabel").setAttribute ("style", "border: solid 3px " + hex2rgb(PRES.bordercolor.clicked, 0.7) + "; background: "+  hex2rgb(PRES.linkcolor[clickedlink2.type],0.5) +";");
	
			document.getElementById("contentlabel").innerHTML = "<b>" + ABSTR.filters.linkFilters[clickedlink2.type].name + " " + "</b>" + "&nbsp&nbsp" + " ("+Webtext.tx_by+" " +clickedlink2.author + " - "+DateTime.timeAgo(clickedlink2.time)+")";
	
						
						document.getElementById("linkpos").innerHTML = "+" + clickedlink2.evalpos;
						document.getElementById("linkneg").innerHTML = ((clickedlink2.evalneg===0) ? "" : "-") + clickedlink2.evalneg;	
						$('#nodepos').addClass('evalbutton').css("border-color", "#888");
						$('#nodeneg').addClass('evalbutton').css("border-color", "#888");
				
						$("#right_bar").height($("#right_bar").height());
						$('#right_bar').stop().fadeTo(200,1);
						$("#contbox").stop().slideUp(0);
					};
						
						},0);				
					
					//}
					
				},10);
	        };
			
	
	        this.mouseoutlink = function (d) {
				
				ABSTR.overlink = false;
				
				if (typeof timedlinkcontentlabel != "undefined") clearTimeout(timedlinkcontentlabel);
				
				if (ABSTR.clickedlinkhash === ""){
				
					hidelinkselect(); //TODO: why is this in LiveAttributes?!
					
					if (ABSTR.clickednodehash === "" && ABSTR.overnodehash === ""){	
						if (ABSTR.timevisualization){return;}
						
						clearcontentlabel();
	
					}
				} 
	        };
			
			
	        this.mouseoutseed = function (e) {
				ABSTR.overseed = false;
	        };
			
			
	        this.backgroundclick = function (d) {
			
				clearSelection();
	
				if (!ABSTR.creatinglink && !ABSTR.overnode && !ABSTR.overlink){
				
					hidelinkselect();
					
					if (ABSTR.timevisualization){
	                    
	                    if (oldindex != ""){
	                        var color = d3.rgb(PRES.nodecolor[timednodes[oldindex].type]).darker(0).toString();
	                        $("#nodecontent"+oldindex).css({"border": "solid 1px "+color});
	                        $("#nodeinteract"+oldindex).height("24px");
	                        $("#nodeinteract"+oldindex).html("");
	                        oldindex = "";
	                    }
						
					}else{
						clearcontentlabel();
					}
					
					ABSTR.clickednode = "";
					ABSTR.clickednodehash = "";
					ABSTR.clickedlinkhash = "";
					ABSTR.overnodehash = "";
					ABSTR.replying = false;
	                if (ABSTR.advevalnode){
	                    advevalnodepanelcancel();
	                };
	                if (ABSTR.advevallink){
	                    advevallinkpanelcancel();
	                };
					ABSTR.advevalnode = false;
					ABSTR.advevallink = false;
					
					PRES.svg.selectAll(".node")
						.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
						.style("stroke", PRES.liveAttributes.nodeStroke);
					
					PRES.svg.selectAll(".link")
						.style("stroke", PRES.liveAttributes.linkStroke)
						.style("stroke-opacity", PRES.liveAttributes.linkStrokeOpacity);
					
					
	
				};
	        };		
	
			
	        this.click = function (d) {
			
		    if (ABSTR.advevalnode){
			advevalnodepanelcancel();
		    };
		    if (ABSTR.advevallink){
			advevallinkpanelcancel();
		    };
		    ABSTR.advevalnode = false;
		    ABSTR.advevallink = false;
	
				var fillopacity = PRES.svg.selectAll(".node")
										.filter(function (e) {return e.hash == d.hash;})
										.style("fill-opacity");	
										
				if (fillopacity == 0){
					PRES.liveAttributes.backgroundclick();
					return;
				};
					
				if (ABSTR.creatinglink && selectedconnectlinktype != 0){
					if (d.hash != ABSTR.clickednodehash && !existingconnection(ABSTR.clickednodehash,d.hash)){
						savelink(d);
					}
					
				}else{
				
					hidelinkselect();
					
					ABSTR.clickednodehash = d.hash;
					ABSTR.clickednode = d;
					ABSTR.clickedlinkhash = "";
					ABSTR.replying = false;
	                
	                if (ABSTR.advevalnode){
	                    advevalnodepanelcancel();
	                };
	                if (ABSTR.advevallink){
	                    advevallinkpanelcancel();
	                };
	                
	                ABSTR.advevalnode = false;
					ABSTR.advevallink = false;
	
					if($.inArray(d.hash, PRES.readnodes) < 0){
						PRES.readnodes.push(d.hash);
					}
					
					
					PRES.svg.selectAll(".node")
						.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
						.style("stroke", PRES.liveAttributes.nodeStroke)
						.style("fill",PRES.liveAttributes.nodeFill);
						
					PRES.svg.selectAll(".link")
						.style("stroke-opacity", PRES.liveAttributes.linkStrokeOpacity);
			
					if (!ABSTR.timevisualization){
						$("#right_bar").height('auto');
						insertRightPanelHtmlEval($('#rightpaneleval'));
						insertRightPanelHtmlReplyAndLink($('#rightpanel'));
	                    var elapsedtime = (new Date().getTime() / 1000) - ABSTR.clickednode.time;
	                    var recentnewnode = ($.inArray(ABSTR.clickednode, PRES.sessionnodes) > -1 && elapsedtime < 300);
	                    (recentnewnode || Model.editable == "1") ? $("#showeditnode").show() : $("#showeditnode").hide();
						$('#rightpanelspace').html("");
						$('#nodepos').addClass('evalbutton').css("border-color", "#888");
						$('#nodeneg').addClass('evalbutton').css("border-color", "#888");
					}
					
					timedcontentlabel = setTimeout(function(){
					
						if (ABSTR.timevisualization){
							index = $.inArray(d, timednodes);
							var id = "nodecontent"+index;
							
							selectdivcontent(index);
							$('#timevisdiv').animate({
								scrollTop: $('#timevisdiv').scrollTop()+$("#"+id).position().top-60
							}, 400);
							
						} else{
					
							$('#right_bar').stop().fadeTo(200, 1);
								$("#contbox").stop().slideDown(0);
								
	                        document.getElementById("contentlabel").setAttribute ("style", "border: solid 3px " + hex2rgb(PRES.bordercolor.clicked, 0.7) + "; background: "+  hex2rgb(PRES.nodecolor[d.type],0.5) +";");	
						   if (d.seed == 2){
							  document.getElementById("contentlabel").innerHTML = "<b>" +Webtext.tx_initial_thought+ "</b>" + "&nbsp&nbsp" + " ("+Webtext.tx_by+" " +d.author + " - "+DateTime.timeAgo(d.time)+")";			
						   } else {
					            document.getElementById("contentlabel").innerHTML = "<b>" + ABSTR.filters.nodeFilters[d.type].name + "</b>" + "&nbsp&nbsp" + " ("+Webtext.tx_by+" " +d.author + " - "+DateTime.timeAgo(d.time)+")";
						   };
	                        document.getElementById("contbox").innerHTML = URLlinks(nl2br(d.content));
	                        
	                        document.getElementById("nodepos").innerHTML = "+" + d.evalpos;
	                        document.getElementById("nodeneg").innerHTML = ((d.evalneg===0) ? "" : "-") + d.evalneg;	
						}	
					},0);
					
				};			
			};
			
			
			//focus on the double clicked node
			this.dblclick = function (d) {
				nodefocus(d, 2);
			};
	
			
			//if the user is not creating a new link, selects the clicked link, changing its stroke color and showing its information in the content label
	        this.clicklink = function (d) {
	
		    if (ABSTR.advevalnode){
			advevalnodepanelcancel();
		    };
		    if (ABSTR.advevallink){
			advevallinkpanelcancel();
		    };
		    ABSTR.advevalnode = false;
		    ABSTR.advevallink = false;
	
	            //if (!ABSTR.creatinglink && !(ABSTR.treeview && d.direct == 1)){
				if (!ABSTR.creatinglink && PRES.liveAttributes.linkStrokeOpacity(d) != 0){
					
					drawlinkselect(d, PRES.bordercolor.clicked, 0, 0);
					
					ABSTR.clickednodehash = "";
					ABSTR.clickedlinkhash = d.hash;
					ABSTR.selectedlink = d;
					
					PRES.svg.selectAll(".node")
						.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
						.style("stroke", PRES.liveAttributes.nodeStroke);
						
					
					insertRightPanelHtmlLinkEval($('#rightpaneleval'));
					$('#rightpanel').html("");
					$('#rightpanelspace').html("");
	                var elapsedtime = (new Date().getTime() / 1000) - ABSTR.selectedlink.time;
	                var recentnewlink = ($.inArray(ABSTR.selectedlink, PRES.sessionlinks) > -1 && elapsedtime < 300);
	                (recentnewlink || Model.editable == "1") ? $("#showeditlink").show() : $("#showeditlink").hide();
	                
					
					timedcontentlabel = setTimeout(function(){
					
						if (ABSTR.timevisualization){return;}
						
						document.getElementById("contentlabel").setAttribute ("style", "border: solid 3px " + hex2rgb(PRES.bordercolor.clicked, 0.7) + "; background: "+  hex2rgb(PRES.linkcolor[d.type],0.5) +";");
			document.getElementById("contentlabel").innerHTML = "<b>" + ABSTR.filters.linkFilters[d.type].name + " " + "</b>" + "&nbsp&nbsp" + " ("+Webtext.tx_by+" " +d.author + " - "+DateTime.timeAgo(d.time)+")";
	
						
						document.getElementById("linkpos").innerHTML = "+" + d.evalpos;
						document.getElementById("linkneg").innerHTML = ((d.evalneg===0) ? "" : "-") + d.evalneg;	
						$('#nodepos').addClass('evalbutton').css("border-color", "#888");
						$('#nodeneg').addClass('evalbutton').css("border-color", "#888");
						
						$("#right_bar").height($("#right_bar").height());
						$('#right_bar').stop().fadeTo(200,1);
						$("#contbox").stop().slideUp(0);
					},0);
			
				};
			};
	
	    };
	    
	    
		function clearSelection() {
		    if ( document.selection ) {
		        document.selection.empty();
		    } else if ( window.getSelection ) {
		        window.getSelection().removeAllRanges();
		    }
		}
		
		
	    // update functions (svg, nodes and links)
	    this.update = function () {
	        updateLinks(this);
	        updateNodes(this);
			updateRelatedOpacity(this);
	    };
		
		
	    function updateLinks(PRES) {
	        PRES.svg.selectAll(".link")
				.style("stroke-width", PRES.liveAttributes.linkStrokeWidth)
				.style("stroke-opacity", PRES.liveAttributes.linkStrokeOpacity);
	
			PRES.svg.selectAll(".link")
				.attr("marker-start", PRES.liveAttributes.linkArrow);
	
	
	    };
	
	    function updateNodes(PRES) {
	        PRES.svg.selectAll(".node")
				.style("fill", PRES.liveAttributes.nodeFill)
				.style("stroke", PRES.liveAttributes.nodeStroke)
				.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
				.attr("r", PRES.liveAttributes.nodeRadius)
				.style("fill-opacity", PRES.liveAttributes.nodeFillOpacity)
				.style("stroke-opacity", PRES.liveAttributes.nodeStrokeOpacity);
	
			PRES.svg.selectAll(".seed")
				.attr("r", PRES.liveAttributes.seedRadius);
				
			PRES.svg.selectAll("text")
				.style("fill-opacity", PRES.liveAttributes.textFillOpacity);
	    };
	
		function updateRelatedOpacity(PRES) {
			PRES.svg.selectAll(".link").style("stroke", PRES.liveAttributes.relatedNodesOpacity);
			PRES.svg.selectAll(".link").style("stroke", PRES.liveAttributes.relatedSeedRadius);
	        PRES.svg.selectAll(".node").style("fill", PRES.liveAttributes.relatedLinksOpacity);
		};
		
	};
	// End of this == presentation
	//*****************************************************************************************************************************
	
	//shows or hides the filters and legend bars
	
	function hideshowlegend() {};
	
	//functions for the rating of nodes and links
	function evalpos(){
		evalnode("pos");
	}
	
	function evalneg(){
		evalnode("neg");
	}
	
	function linkevalpos(){
		evallink("pos");
	}
	
	function linkevalneg(){
		evallink("neg");
	}
	
	
	function advevalnode(advevalnodevote) {
	
	    var PRES = Visualisations.current().presentation;   
	    var ABSTR = Visualisations.current().abstraction;
		
	
	   if (author == ""){
	        ABSTR.namepanelcaller = "advevalnode";
	        ABSTR.namepanelparameter = advevalnodevote;
	        opennamepanel();
	        return;
	    }
	    
	    var nodes = PRES.force.nodes();
	    var links = PRES.force.links();
	  
	    var targetindex = searchhash(nodes, ABSTR.clickednodehash);
	    targetnode = nodes[targetindex];
	
	
	    if (($.inArray(author, targetnode.advevalby[0]) > -1)||($.inArray(author, targetnode.advevalby[1]) > -1)||($.inArray(author, targetnode.advevalby[2]) > -1)||($.inArray(author, targetnode.advevalby[3]) > -1)){
	
			var alert = document.getElementById("advevalalert");
			alert.innerHTML = Webtext.tx_already_propos_node;
			setTimeout(function(){alert.innerHTML = "&nbsp";},2000);
			return;
		}
		
		targetnode.advevalby[advevalnodevote].push(author);
	        targetnode.adveval[advevalnodevote] += 1;
	
	    if (targetnode.advevalby[advevalnodevote][0] == ""){targetnode.advevalby[advevalnodevote].splice(0,1);};
	
		Db.update_adveval_node();
	
		explode(targetnode.x, targetnode.y, "blue");
		
	    checkadvevalnode();
	
	};
	
	function advevallink(advevallinkvote) {
	    var PRES = Visualisations.current().presentation;   
	    var ABSTR = Visualisations.current().abstraction;
		
	
	   if (author == ""){
	        ABSTR.namepanelcaller = "advevallink";
	        ABSTR.namepanelparameter = advevallinkvote;
	        opennamepanel();
	        return;
	    }
	    
	    var nodes = PRES.force.nodes();
	    var links = PRES.force.links();
	  
	    var targetindex = searchhash(links, ABSTR.clickedlinkhash);
	    targetlink = links[targetindex];
	
	
	    if(($.inArray(author, targetlink.advevalby[0]) > -1)||($.inArray(author, targetlink.advevalby[1]) > -1)||($.inArray(author, targetlink.advevalby[2]) > -1)||($.inArray(author, targetlink.advevalby[3]) > -1)||($.inArray(author, targetlink.advevalby[4]) > -1)||($.inArray(author, targetlink.advevalby[5]) > -1)){
			
			var alert = document.getElementById("advevalalertlink");
			alert.innerHTML = Webtext.tx_already_propos_link;
			setTimeout(function(){alert.innerHTML = "&nbsp";},2000);
			return;
		}
	
		targetlink.advevalby[advevallinkvote].push(author);
	        targetlink.adveval[advevallinkvote] += 1;
	
	    if (targetlink.advevalby[advevallinkvote][0] == ""){targetlink.advevalby[advevallinkvote].splice(0,1);};
	
		Db.update_adveval_link();
	
		var coordx = (targetlink.source.x + targetlink.target.x)/2;
		var coordy = (targetlink.source.y + targetlink.target.y)/2;
		explode(coordx, coordy, "yellow");
	
	    checkadvevallink();
	
	};
	
	
	function evalnode(vote) {
	
	    var PRES = Visualisations.current().presentation;   
		var ABSTR = Visualisations.current().abstraction;
		
	    if (author == ""){
	        ABSTR.namepanelcaller = "evalnode";
	        ABSTR.namepanelparameter = vote;
	        opennamepanel();
	        return;
	    }
	    
		var nodes = PRES.force.nodes();
	    var links = PRES.force.links();
	  
	    var targetindex = searchhash(nodes, ABSTR.clickednodehash);
	    targetnode = nodes[targetindex];
	
		if($.inArray(author, targetnode.evaluatedby) > -1){
			
			var alert = document.getElementById("evalalert");
			
			var brornot = ($(window).height()<486) ? "<br>" : " ";
			if (ABSTR.timevisualization){brornot=" ";}
			
			alert.innerHTML = Webtext.tx_you_already_rated1 + brornot + Webtext.tx_you_already_rated2;
			setTimeout(function(){alert.innerHTML = "&nbsp";},2000);
			return;
		}
		
		targetnode.evaluatedby.push(author);
	
		if (vote=="pos"){
			targetnode.evalpos += 1; 
			document.getElementById("nodepos").innerHTML = "+" + targetnode.evalpos;
			var variable = "evalpos";
			var value = targetnode.evalpos;
			var color = "green";
		}else{
			targetnode.evalneg += 1;
			document.getElementById("nodeneg").innerHTML = ((targetnode.evalneg===0) ? "" : "-") + targetnode.evalneg;
			var variable = "evalneg";
			var value = targetnode.evalneg;
			var color = "red";
		}
		
		Db.update_eval_node(variable,value);
	
		PRES.svg.selectAll(".node")
			.filter(function (d) {return d.hash == ABSTR.clickednodehash;})
			.transition().duration(1000).ease("elastic")
			.attr("r", PRES.liveAttributes.nodeRadius) 
		
		explode(targetnode.x, targetnode.y, color);
		
	};
	
	
	function evallink(vote) {
	
	    var PRES = Visualisations.current().presentation;   
	    var ABSTR = Visualisations.current().abstraction;
		
	    if (author == ""){
	        ABSTR.namepanelcaller = "evallink";
	        ABSTR.namepanelparameter = vote;
	        opennamepanel();
	        return;
	    }
	    
	    var nodes = PRES.force.nodes();
	    var links = PRES.force.links();
	  
	    var targetindex = searchhash(links, ABSTR.clickedlinkhash);
	    targetlink = links[targetindex];
		
		if($.inArray(author, targetlink.evaluatedby) > -1){
	
			var alert = document.getElementById("evalalert");
			var brornot = ($(window).height()<486) ? "<br>" : " ";
			
			alert.innerHTML = Webtext.tx_you_already_rated_con1 + brornot + Webtext.tx_you_already_rated_con2 + " <br>";
			setTimeout(function(){alert.innerHTML = "&nbsp";},2000);
			return;
		} 
		
		targetlink.evaluatedby.push(author);
		
		if (vote=="pos"){
			targetlink.evalpos += 1; 
			document.getElementById("linkpos").innerHTML = "+" + targetlink.evalpos;
			var variable = "evalpos";
			var value = targetlink.evalpos;
		}else{
			targetlink.evalneg += 1;
			document.getElementById("linkneg").innerHTML = ((targetlink.evalneg===0) ? "" : "-") + targetlink.evalneg; 
			var variable = "evalneg";
			var value = targetlink.evalneg;
		}
	
		PRES.svg.selectAll(".link")
			.filter(function (d) {return d.hash == ABSTR.clickedlinkhash;})
			.transition().duration(1000).ease("elastic")
			.style("stroke-width", PRES.liveAttributes.linkStrokeWidth);
	
		drawlinkselect(targetlink, PRES.bordercolor.clicked, 0, 0);	
	
		Db.update_eval_link(variable,value);
		
		var coordx = (targetlink.source.x + targetlink.target.x)/2;
		var coordy = (targetlink.source.y + targetlink.target.y)/2;
		var expcolor = (vote=="pos") ? "green" : "red";
		explode(coordx, coordy, expcolor);
	
	};
	
	
	//shows the reply options and cancel the creation of a new link, or hides the options if they are already showed
	function showreplypanel(editing){
	    
	    var PRES = Visualisations.current().presentation;
		var ABSTR = Visualisations.current().abstraction;
		
	    (editing) ? PRES.editingnode = true : PRES.editingnode = false;
	    
		if (ABSTR.creatinglink){
			cancellink();
		}
		
		if (ABSTR.replying){
			hidereplypanel();
			return;
		}
	
		if (ABSTR.advevalnode){
			advevalnodepanelcancel();
		}
		
		if (ABSTR.timevisualization){
			$nodeInteract = $("#nodeinteract"+oldindex);
			$nodeInteract.height("auto");
			insertTimevisInteractHtml($nodeInteract);
			insertNewline($nodeInteract, 'append');
			insertRightPanelHtmlReply($nodeInteract, 'append');
			insertNewline($nodeInteract, 'append');
			
			$('#timevisdiv').animate({
				scrollTop: $('#timevisdiv').scrollTop()+$("#nodecontent"+oldindex).position().top-60
			}, 400);
	
		} else {
		
			var brornot = ($(window).height()<486) ? "" : "<br><br>";
			insertRightPanelHtmlReplyAndLink($('#rightpanel'));
			insertHtml(brornot, $('#rightpanel'), 'append');
			insertRightPanelHtmlReply($('#rightpanel'), 'append');
	        
	        $("#showeditnode").hide();
	        if (editing){
	            $("#showeditnode").show();
	            $("#replybox").val( ABSTR.clickednode.content );
	            $("#replyboxsum").val( ABSTR.clickednode.contentsum );
	            $("#tdlinktype").hide();   
	        }
			$('#rightpanelspace').html("");
		}
		ABSTR.replying = true;
		
		document.getElementById("showreply").setAttribute("style", "box-shadow: inset -1px 1px 2px 0px rgba(0, 0, 0, 0.5);");
		document.getElementById("replybox").focus();
		
	    selectedreplynodetype = (editing) ? ABSTR.clickednode.type : 1;
		preparereplynodetype(selectedreplynodetype);
	    
		selectedreplylinktype = 1;
		preparereplylinktype();
	}
	
	
	function hidereplypanel(){
	    var PRES = Visualisations.current().presentation;
		var ABSTR = Visualisations.current().abstraction;
		ABSTR.replying = false; 
			 
		document.getElementById("replybox").value = "";  
		document.getElementById("replyboxsum").value = "";
	
		
		if (ABSTR.timevisualization){
			$("#nodeinteract"+oldindex).height("24px");
			insertTimevisInteractHtml($('#nodeinteract'+oldindex));
			//$("#nodeinteract"+oldindex).html(timevisinteracthtml); 
		} else {
				
			insertRightPanelHtmlReplyAndLink($('#rightpanel'));
	        var elapsedtime = (new Date().getTime() / 1000) - ABSTR.clickednode.time;
	        var recentnewnode = ($.inArray(ABSTR.clickednode, PRES.sessionnodes) > -1 && elapsedtime < 300);
	        (recentnewnode || Model.editable == "1") ? $("#showeditnode").show() : $("#showeditnode").hide();
			 $('#rightpanelspace').html("");
		}
	}
	
	
	//shows the create link options
	function showcreatelink(editing){
	    var PRES = Visualisations.current().presentation;
		var ABSTR = Visualisations.current().abstraction;
		
		if (ABSTR.creatinglink){
			cancellink();
			return;
		}
		
		if (ABSTR.replying){
			hidereplypanel();
		}
	
		if (ABSTR.advevalnode){
			advevalnodepanelcancel();
		}
	
		if (ABSTR.timevisualization){
			var $nodeInteract = $('#nodeinteract'+oldindex);
			$nodeInteract.height("auto");
			insertTimevisInteractHtml($nodeInteract);
			insertNewline($nodeInteract, 'append');
			insertRightPanelHtmlLink($nodeInteract, 'append');
			insertNewline($nodeInteract, 'append');
			//TODO: do this animation into insert*() function?
			$('#timevisdiv').animate({
				scrollTop: $('#timevisdiv').scrollTop()+$("#nodecontent"+oldindex).position().top-60
			}, 400);
	
		} else {
	
			var brornot = ($(window).height()<486) ? "" : "<br><br>";
			if(editing) 
				insertRightPanelHtmlLink($('#rightpanel'));
			else {
				insertRightPanelHtmlReplyAndLink($('#rightpanel'));
				insertHtml(brornot, $('#rightpanel'), 'append');
				insertRightPanelHtmlLink($('#rightpanel'), 'append');
			}
			var elapsedtime = (new Date().getTime() / 1000) - ABSTR.clickednode.time;
	        var recentnewnode = ($.inArray(ABSTR.clickednode, PRES.sessionnodes) > -1 && elapsedtime < 300);
	        (recentnewnode || Model.editable == "1") ? $("#showeditnode").show() : $("#showeditnode").hide();
			$('#rightpanelspace').html("");
		}
		
		ABSTR.creatinglink = true;
		ABSTR.replying = false;
	    
		if (!editing) $("#showconnect").css("box-shadow", "inset -1px 1px 2px 0px rgba(0, 0, 0, 0.5);");
	
	    if (editing) $("#connecttext").hide();
	    selectedconnectlinktype = (editing) ? ABSTR.selectedlink.type : 0;
		prepareconnectlinktype(selectedconnectlinktype);
	
	}
	
	function showeditlink(){
	    var PRES = Visualisations.current().presentation;
		var ABSTR = Visualisations.current().abstraction;
		
		if (ABSTR.editinglink){
			$('#rightpanel').html("");
	        ABSTR.editinglink = false;
			return;
		}
	
		if (ABSTR.advevalnode){
			advevalnodepanelcancel();
		}
	
		if (ABSTR.timevisualization){
			var $nodeInteract = $("#nodeinteract"+oldindex);
			$nodeInteract.height("auto");
			insertTimevisInteractHtml($nodeInteract);
			insertNewline($nodeInteract, 'append');
			insertRightPanelEditLink($nodeInteract, 'append');
			insertNewline($nodeInteract, 'append');
			
			$('#timevisdiv').animate({
				scrollTop: $('#timevisdiv').scrollTop()+$("#nodecontent"+oldindex).position().top-60
			}, 400);
	
		} else {
	
			var brornot = ($(window).height()<486) ? "" : "<br><br>";
			$('#rightpanel').html(rightpaneleditlink);
			$('#rightpanelspace').html("");
		}
		
		ABSTR.editinglink = true;
		ABSTR.replying = false;
	
	    selectedconnectlinktype = ABSTR.selectedlink.type;
		prepareconnectlinktype(selectedconnectlinktype);
	
	}
	
	
	function cancellink(){
	
		var PRES = Visualisations.current().presentation;
		var ABSTR = Visualisations.current().abstraction;
		
		if (ABSTR.timevisualization){
			$("#nodeinteract"+oldindex).height("24px");
			insertTimevisInteractHtml($('#nodeinteract'+oldindex));
			//$("#nodeinteract"+oldindex).html(timevisinteracthtml); 
		} else {
			insertRightPanelHtmlReplyAndLink($('#rightpanel'));
			//$('#rightpanel').html(rightpanelhtmlreplyandlink);
	        var elapsedtime = (new Date().getTime() / 1000) - ABSTR.clickednode.time;
	        var recentnewnode = ($.inArray(ABSTR.clickednode, PRES.sessionnodes) > -1 && elapsedtime < 300);
	        (recentnewnode || Model.editable == "1") ? $("#showeditnode").show() : $("#showeditnode").hide();
			$('#rightpanelspace').html("");
		}
		
		PRES.prelink 
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", 0)
			.attr("y2", 0)
			.style("stroke-opacity", 0);
			
		ABSTR.creatinglink = false;
	}
	
	//creation of a new node
	function savenode() {
			
		if (document.getElementById("replybox").value == ""){
			var alert = document.getElementById("replyalert");
			alert.innerHTML = Webtext.tx_write_something+"!";
			setTimeout(function(){alert.innerHTML = "&nbsp";},2000);
			$('#replybox').effect('highlight',2000);
			return;
		}
	    var PRES = Visualisations.current().presentation;
		
	    (PRES.editingnode) ? editnode() : createnode();
	};
	
	
	function editnode(){
	    var PRES = Visualisations.current().presentation;
	    var ABSTR = Visualisations.current().abstraction;
	    var index = $.inArray(ABSTR.clickednode, Model.model.nodes);
	    
	    Db.editnode(ABSTR.clickednode.hash, $("#replybox").val(), $("#replyboxsum").val(), selectedreplynodetype);
	    
	    ABSTR.clickednode.content = $("#replybox").val();
	    ABSTR.clickednode.contentsum = $("#replyboxsum").val();
	    ABSTR.clickednode.type = selectedreplynodetype;
	    
	    PRES.svg.selectAll(".node")
			.style("fill",PRES.liveAttributes.nodeFill);
	    
	    var color = PRES.liveAttributes.nodeFill(ABSTR.clickednode); 
	    explode(ABSTR.clickednode.x, ABSTR.clickednode.y, color)
	    
	    $("#contbox").html( $("#replybox").val() );
	    cancellink();
	    PRES.force.start();
	}
	
	function editlink(){
	    var PRES = Visualisations.current().presentation;
	    var ABSTR = Visualisations.current().abstraction;
	    var index = $.inArray(ABSTR.clickednode, Model.model.nodes);
	    
	    Db.editlink(ABSTR.selectedlink.hash, selectedconnectlinktype);
	    
	    ABSTR.selectedlink.type = selectedconnectlinktype;
	    
	    PRES.svg.selectAll(".link")
	        .style("stroke", PRES.liveAttributes.linkStroke);
	    
	    
	    var color = PRES.liveAttributes.linkStroke(ABSTR.selectedlink); 
		var coordx = (ABSTR.selectedlink.source.x + ABSTR.selectedlink.target.x)/2;
		var coordy = (ABSTR.selectedlink.source.y + ABSTR.selectedlink.target.y)/2;
		explode(coordx, coordy, color);
	    
	    $('#rightpanel').html(""); 
	    ABSTR.editinglink = false;
	    PRES.force.start();
	}
	
	function createnode(){
		
	    var PRES = Visualisations.current().presentation;
	    var ABSTR = Visualisations.current().abstraction;
	    
	    if (author == ""){
	        ABSTR.namepanelcaller = "createnode";
	        opennamepanel();
	        return;
	    }
		
	    var nodes = PRES.force.nodes();
	
	    var content = document.getElementById("replybox").value;
	    var contentsum = document.getElementById("replyboxsum").value;
	    var nodetype = selectedreplynodetype;
		
		var targetindex = searchhash(nodes, ABSTR.clickednodehash), 
	    targetnode = nodes[targetindex];
		
	    var time = Math.floor((new Date()).getTime() / 1000);
	
		var seed=(selectedreplylinktype != 0) ? 0 : 1;
		
		var randomplusminus = Math.random() < 0.5 ? -1 : 1;
		var coordx = targetnode.x + randomplusminus*10*(Math.random()+1);
		var coordy = targetnode.y + randomplusminus*10*(Math.random()+1);
	
		var hash = parseInt(Model.nodehashit(content + contentsum + nodetype + author + time));
	    var newnode = {
	        "hash": hash,
	        "content": content,
	        "contentsum": contentsum,
	        "evalpos": 1,
			"evalneg": 0,
	        "evaluatedby": [author],
	        "adveval": [0,0,0,0],
	        "advevalby": [[],[],[],[]],
	        "type": nodetype,
	        "author": author,
			"seed":seed,
	        "time": time,
	        x: coordx,
	        y: coordy
	    };
		
	    nodes.push(newnode);
	    Model.model.nodes.push(newnode); //zzcheck
	
	    //remainingnodes.push(newnode);
	
	    PRES.sessionnodes.push(newnode);
		
		var linktype = selectedreplylinktype;
		
		if (linktype != 0){ //creates a new link only if user chooses a relation different than "No relation".
		
			var links = PRES.force.links();	
			
			var hash = Model.linkhashit(newnode.hash + targetnode.hash + author + linktype + time);
			
			var newlink = {
				"hash": hash, 
				"source": newnode, 
				"target": targetnode,
				"direct": 0,
				"evalpos": 1,
				"evalneg": 0,
				"evaluatedby": [author],
	   		        "adveval": [0,0,0,0,0,0],
			        "advevalby": [[],[],[],[],[],[]],
				"type": linktype,
				"author": author,
				"time": time
			};
			
		    links.push(newlink);
	        Model.model.links.push(newlink); //zzcheck
	
		    //remaininglinks.push(newlink);
	
	            PRES.sessionlinks.push(newlink);
			
			var newlinkfordb = {
				"hash": newlink.hash, 
				"source": newnode.hash, 
				"target": targetnode.hash,
				"direct": 0,
				"evalpos": 1,
				"evalneg": 0,
				"evaluatedby": [author],
	   		        "adveval": [0,0,0,0,0,0],
			        "advevalby": [[],[],[],[],[],[]],
				"type": linktype,
				"author": author,
				"time": time
			};
			
	       	Db.saveandchecknode(newnode, newlinkfordb);
		    update_hash_lookup([newnode], []);
			
			drawnewlinks();
		}else{
	       	Db.saveandcheckonlynode(newnode);	
		    update_hash_lookup([newnode], []);
	
		};
	
		hidereplypanel();
		
		drawnewnodes();
		
		if (newnode.seed == 1){
			addseed(newnode);
		}
		if (ABSTR.timevisualization){
			
			var i= timednodes.length-1;
			var legend = timednodes[i].author+' - '+DateTime.timeAgo(timednodes[i].time);
			var color = d3.rgb(PRES.nodecolor[timednodes[i].type]).darker(0).toString();
			
			var html = '<div id="nodelegend'+i+'" class="divnodelegend">'+legend+'</div><div id="nodecontent'+i+'" class="divnodecontent" style="border: solid 1px '+color+';"></div><div id="nodeinteract'+i+'" class="divnodeinteract">&nbsp</div>'; 
			
			$("#timevisdiv").html($("#timevisdiv").html().replace("<br><br><br> <br><br><br><br>","") + html + "<br><br><br> <br><br><br><br>");
			
			$("#nodecontent"+i).html(URLlinks(nl2br(timednodes[i].content)));
			assignNodeContentBindings($("#nodecontent"+i)[0]);
			
			$('#timevisdiv').animate({
				scrollTop: $('#timevisdiv').scrollTop()+$("#nodecontent"+i).position().top-60
			}, 700);
			
			$("#nodecontent"+i).fadeTo(0,0.01);
			$("#nodelegend"+i).fadeTo(0,0.01);
			$("#nodeinteract"+i).fadeTo(0,0.01);
	
			$("#nodecontent"+i).delay(800).fadeTo(300,1);
			$("#nodelegend"+i).delay(800).fadeTo(300,1);
			$("#nodeinteract"+i).delay(800).fadeTo(300,1);
			
		}
		
	}
	
	function assignNodeContentBindings(node) {
		node.onmouseover = function() { overdivcontent(this.id) };
		node.onmouseout = function() { outdivcontent(this.id) };
		node.onclick = function() { clickdivcontent(this.id) };
	}
	
	function drawnewlinks() {
	    
		var PRES = Visualisations.current().presentation;
	 
	    var links = PRES.force.links();
	    
	    var link = PRES.svg.selectAll(".link")
	        .data(links)
	        .enter().insert("line",".node")
	        .attr("class", "link")
			.attr("marker-start", PRES.liveAttributes.linkArrow)
			.style("stroke", PRES.liveAttributes.linkStroke)
			.style("stroke-width", PRES.liveAttributes.linkStrokeWidth)
			.style("stroke-opacity", PRES.liveAttributes.linkStrokeOpacity)
			.style("stroke-dasharray", PRES.liveAttributes.linkStrokeDashArray)
			.style("stroke-linecap", "round")
			.on("mouseover", PRES.liveAttributes.mouseoverlink)
			.on("mouseout", PRES.liveAttributes.mouseoutlink)
	        .on("click", PRES.liveAttributes.clicklink);
		
		PRES.force.start();
	}
	
	
	function drawnewnodes() {
	    
		var PRES = Visualisations.current().presentation;
	 
		var elasticduration = (PRES.elasticdraw) ? 1000 : 0;
	 
	    var nodes = PRES.force.nodes();
	    
	    var node = PRES.svg.selectAll(".node")
	        .data(nodes)
	        .enter().append("circle")
	        .attr("class", "node")
	        .attr("cx", function (d) {coordx = d.x; return d.x;})
	        .attr("cy", function (d) {coordy = d.y; return d.y;})
			.attr("r", 0)
			.style("fill", function(d) {var color = PRES.liveAttributes.nodeFill(d); explode(coordx, coordy, color); return color;})
				.style("fill-opacity",PRES.liveAttributes.nodeFillOpacity)
			.style("stroke", PRES.liveAttributes.nodeStroke)
			.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
			.on("mouseover", PRES.liveAttributes.mouseover)
			.on("mouseout", PRES.liveAttributes.mouseout)
			.on("click", PRES.liveAttributes.click)
			.on("dblclick", PRES.liveAttributes.dblclick)
	        .call(PRES.force.drag)
			.transition().ease("elastic").duration(elasticduration)
			.attr("r", PRES.liveAttributes.nodeRadius);
		
	    PRES.force.start();
	};
	
	function addseed(newnode){
	
		var PRES = Visualisations.current().presentation;
	
		PRES.seedsdata.push({homenode:newnode, seedtype: newnode.seed});
		
		PRES.svg.selectAll(".seed")
			.data(PRES.seedsdata)
			.enter().append("circle")
			.attr("class", "seed")
			.attr("r", PRES.liveAttributes.seedRadius)
			.style("fill", PRES.liveAttributes.seedColor)
			.on("mouseover", PRES.liveAttributes.mouseoverseed)
			.on("mouseout", PRES.liveAttributes.mouseoutseed);
	}
	
	function updateSeeds(){
	
		var PRES = Visualisations.current().presentation;
	
	        var nodes = PRES.force.nodes();
	
		var seedsdata = [];
	
			nodes.forEach(function(d, i) {		
				if (d.seed > 0){
					seedsdata.push({homenode:d, seedtype:d.seed});
				}					
			});
	
		
		PRES.svg.selectAll(".seed")
			.data(seedsdata)
			.enter().append("circle")
			.attr("class", "seed")
			.attr("r", PRES.liveAttributes.seedRadius)
			.style("fill", PRES.liveAttributes.seedColor)
			.on("mouseover", PRES.liveAttributes.mouseoverseed)
			.on("mouseout", PRES.liveAttributes.mouseoutseed);
	}
	
	
	//creation of a new link
	function savelink(d){
	//MOD
	
	    var PRES = Visualisations.current().presentation;
		var ABSTR = Visualisations.current().abstraction;
		
	    if (author == ""){
	        ABSTR.namepanelcaller = "savelink";
	        ABSTR.namepanelparameter = d;
	        opennamepanel();
	        return;
	    }
	    
	    var nodes = PRES.force.nodes();
	    var links = PRES.force.links();
	
	    var linktype = selectedconnectlinktype;
	    
	    var sourceindex = searchhash(nodes, ABSTR.clickednodehash);
	    var sourcenode = nodes[sourceindex];
		
		var time = Math.floor((new Date()).getTime() / 1000);
		
		var hash = Model.linkhashit(sourcenode.hash + d.hash + author + linktype + time);
		
		var newlink={
			"hash": hash, 
			"source": sourcenode, 
			"target": d, 
			"direct": 1,
			"evalpos": 1, 
			"evalneg": 0,
			"evaluatedby": [author],
		        "adveval": [0,0,0,0,0,0],
	                "advevalby": [[],[],[],[],[],[]],
			"type":linktype,
			"author": author,
			"time": time
		};
		
	    links.push(newlink);
	    Model.model.links.push(newlink); //zzcheck
	    
	    //remaininglinks.push(newlink);
	    PRES.sessionlinks.push(newlink);
	    
			var newlinkfordb = {
				"hash": newlink.hash, 
				"source": sourcenode.hash, 
				"target": d.hash,
				"direct": 1,
				"evalpos": 1,
				"evalneg": 0,
				"evaluatedby": [author],
	   		        "adveval": [0,0,0,0,0,0],
			        "advevalby": [[],[],[],[],[],[]],
				"type":linktype,
				"author": author,
				"time": time
			};
			
			Db.saveandchecklink(newlinkfordb);
		
	    var link = PRES.svg.selectAll(".link")
	        .data(links)
	       .enter().insert("line",".node")
	        .attr("class", "link")
			.attr("marker-start", PRES.liveAttributes.linkArrow)
			.style("stroke", PRES.liveAttributes.linkStroke)
			.style("stroke-width", PRES.liveAttributes.linkStrokeWidth)
			.style("stroke-opacity", PRES.liveAttributes.linkStrokeOpacity)
			.style("stroke-dasharray", PRES.liveAttributes.linkStrokeDashArray)
			.style("stroke-linecap", "round")
			.on("mouseover", PRES.liveAttributes.mouseoverlink)
			.on("mouseout", PRES.liveAttributes.mouseoutlink)
			.on("click", PRES.liveAttributes.clicklink);
			    
	
		var coordx = (newlink.source.x + newlink.target.x)/2;
		var coordy = (newlink.source.y + newlink.target.y)/2;
		var expcolor =  PRES.linkcolor[newlink.type];
		explode(coordx, coordy, expcolor);
	
	    cancellink();
			
	    PRES.force.start();
			
	}
	
	
	//changes the color of the prelink line when a new type of link is selected
	function changelinktype(){
		var PRES = Visualisations.current().presentation;
		PRES.prelink
			.style("stroke", PRES.linkcolor[selectedconnectlinktype])
			.style("stroke-opacity",0.6);
	}
	 
	
	//defines the Scaler method, for panning and zooming
	function Scaler(PRES) {
	
		// despxp : "pan displacement", the movement produced by mouse dragging
		// despxz : "zoom displacement", the movement that is produced when zooming, to maintain the correct position of the svg
		// despx0 : the rest of movements, like the initial movement, or the one produced when focusing in a node (with the dblclick function)
		// transxz : a memory used to obtain the real mouse dragging displacement from d3.event.translate, that accumulates the "aditional" movement produced when zooming
	
	    this.oldscale = 1;
	    this.scale = 1;
	    this.trans = [0,0];
	
	    this.zoomval = 1;
	    this.zoommax = 8;
	    this.zoommin = 0.1;
		
		this.zoomincrement = 1.3;
		this.zoomduration = 300;
	
		this.despx0 = -400/2;
		if (conversation === "sandbox" || conversation === "sandbox_es"){this.despx0 = -(400-280)/2;}
		this.despy0 = -(180-50)/2;
			
		this.despx = this.despx0;
		this.despy = this.despy0;
	
	    this.despxp = 0;
	    this.despyp = 0;
	
	    this.transxz = 0;
	    this.transyz = 0;
		
		this.midx = $(window).width()/2 + this.despx0;
		this.midy = $(window).height()/2 + this.despy0;
	
	    var THIS = this;
	    
		
	    this.translate = function(point) {
	        return [ (point[0]-THIS.despx) / THIS.zoomval, (point[1]-THIS.despy) / THIS.zoomval ];
	    };
	
	    
	    this.rescale = function() {
			
	        THIS.trans=d3.event.translate;
	        THIS.scale=d3.event.scale;
	        
	        if (THIS.scale == THIS.oldscale){  //no mousewheel movement, just translation
	        
	            THIS.despxp = THIS.trans[0]-THIS.transxz;
	            THIS.despyp = THIS.trans[1]-THIS.transyz;
				
				THIS.despx = THIS.despx0 + THIS.despxp;
				THIS.despy = THIS.despy0 + THIS.despyp;
				
				// making the transformation directly instead of calling setViewport to avoid a problem caused by transitionTime = 0
				PRES.svg
					.attr("transform","translate(" + THIS.despx + ',' + THIS.despy + ") scale(" + THIS.zoomval + ")"); 
	            
	        } else {	
			
				THIS.oldzoomval = THIS.zoomval;
	            if (THIS.scale > THIS.oldscale){
	                if (THIS.zoomval*1.5 < THIS.zoommax){THIS.zoomval *= THIS.zoomincrement;}
	            } else {
	                if (THIS.zoomval/1.5 > THIS.zoommin){THIS.zoomval /= THIS.zoomincrement;}
	            }
	            
				THIS.despx0 = d3.mouse(this)[0]-(d3.mouse(this)[0]-THIS.despx)*THIS.zoomval/THIS.oldzoomval-THIS.despxp;
				THIS.despy0 = d3.mouse(this)[1]-(d3.mouse(this)[1]-THIS.despy)*THIS.zoomval/THIS.oldzoomval-THIS.despyp;
	            
	            THIS.transxz = THIS.trans[0]-THIS.despxp;
	            THIS.transyz = THIS.trans[1]-THIS.despyp;
	            
	            THIS.oldscale = THIS.scale;
	            var transtime = THIS.zoomduration;
				
				THIS.despx = THIS.despx0 + THIS.despxp;
				THIS.despy = THIS.despy0 + THIS.despyp;
	            
				PRES.setViewport(THIS.despx, THIS.despy, THIS.zoomval, transtime);
			}
		};
			
	      
	
	
	    this.zoomin = function() {
		
			THIS.oldzoomval = THIS.zoomval;
			
	        if (THIS.zoomval*1.5 < THIS.zoommax){THIS.zoomval *=  THIS.zoomincrement;};
		
	        THIS.despx0 = THIS.midx-(THIS.midx-THIS.despx)*THIS.zoomval/THIS.oldzoomval-THIS.despxp;
	        THIS.despy0 = THIS.midy-(THIS.midy-THIS.despy)*THIS.zoomval/THIS.oldzoomval-THIS.despyp;
		
	        THIS.despx = THIS.despx0 + THIS.despxp;
	        THIS.despy = THIS.despy0 + THIS.despyp;
		
	        PRES.setViewport(THIS.despx, THIS.despy, THIS.zoomval, THIS.zoomduration);
	    };
		
	
	    this.zoomout = function() {
		
			THIS.oldzoomval = THIS.zoomval;
			
	        if (THIS.zoomval/1.5 > THIS.zoommin){THIS.zoomval /=  THIS.zoomincrement;};
		
	        THIS.despx0 = THIS.midx-(THIS.midx-THIS.despx)*THIS.zoomval/THIS.oldzoomval-THIS.despxp;
	        THIS.despy0 = THIS.midy-(THIS.midy-THIS.despy)*THIS.zoomval/THIS.oldzoomval-THIS.despyp;
		
	        THIS.despx = THIS.despx0 + THIS.despxp;
	        THIS.despy = THIS.despy0 + THIS.despyp;
		
	        PRES.setViewport(THIS.despx, THIS.despy, THIS.zoomval, THIS.zoomduration);
	   };
	}
	
	
	function nodefocus(d, zoomv){
	
		var ABSTR = Visualisations.current().abstraction;
		var PRES = Visualisations.current().presentation;
		
		var selx = PRES.svg.selectAll(".node")
							.filter(function (e) {return e.hash == d.hash;})
							.attr("cx");
							
		var sely = PRES.svg.selectAll(".node")
							.filter(function (e) {return e.hash == d.hash;})
							.attr("cy");
	
		PRES.scaler.zoomval = zoomv;
		
		var xcenter = ($(window).width() - $("#right_bar").width())/2;
		
		if (ABSTR.tutorialopened){xcenter += 175;}
		
		PRES.scaler.despx0 = (xcenter-selx*PRES.scaler.zoomval) - PRES.scaler.despxp;
		PRES.scaler.despy0 = (PRES.scaler.midy-sely*PRES.scaler.zoomval) - PRES.scaler.despyp;
		
		
		PRES.scaler.despx = PRES.scaler.despxp + PRES.scaler.despx0;
		PRES.scaler.despy = PRES.scaler.despyp + PRES.scaler.despy0;
			
	
		PRES.svg
			.transition().ease("cubic-out").duration(500)
			.attr("transform", "translate(" + PRES.scaler.despx + ',' + PRES.scaler.despy + ") scale(" + PRES.scaler.zoomval + ")");
	}
	
	
	function explode(cx, cy, color){ 
	
		var PRES = Visualisations.current().presentation;
		
		if (!PRES.drawexplosions){return;}
		
		if (typeof color==='undefined'){
			color="blue";
		}
		
		explosion = PRES.svg.append("circle")
			.attr("cx", cx)
	        .attr("cy", cy)
	        .attr("r", 10)
			.style("fill-opacity",0)
			.style("stroke-width","1px")
			.style("stroke",color)
			.style("stroke-opacity",0.9);
			
			
		explosion.transition().ease("cubic-out").duration(1500)
	        .attr("r", 450)
			.style("stroke-width","10px")
			.style("stroke-opacity",0)
			.remove();
		
		setTimeout(function(){explosion.remove();},1550);
	}
	
	
	function rbexpand(){
		var currentrbwidth = $("#right_bar").width();
		var currentcbheight = $("#contbox").height();
			
			if (currentrbwidth > rbwidth){
				$("#right_bar").animate({width: rbwidth},200);
				$("#contbox").animate({height: cbheight},200);
			} else {
				$("#right_bar").animate({width: rbwidth + 300},200);
				$("#contbox").animate({height: cbheight + 100},200);
			}
	}
	
	
	function drawlinkselect(link, color, delay, time){
	
		var PRES = Visualisations.current().presentation;
		
		var x1 = link.source.x,
			y1 = link.source.y,
			x2 = link.target.x,
			y2 = link.target.y,
			width = PRES.liveAttributes.linkStrokeWidth(link);
			
		PRES.linkselectw
			.attr("x1", x1)
			.attr("y1", y1)
			.attr("x2", x2)
			.attr("y2", y2)
			.style("stroke-width", width - 0.2);
			
		PRES.linkselect
			.attr("x1", x1)
			.attr("y1", y1)
			.attr("x2", x2)
			.attr("y2", y2)
			.style("stroke", color)
			.style("stroke-width", width + 3.5);
		
	
		PRES.linkselect
			.style("stroke-opacity", 0)
			.transition().delay(delay).duration(time)
			.style("stroke-opacity", 1);
	}
	
	function hidelinkselect(){
	
		var PRES = Visualisations.current().presentation;
	
		PRES.linkselect
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", 0)
			.attr("y2", 0)
			.style("stroke-width", 0);
	}
	
	function clearcontentlabel(){
	
	    var PRES = Visualisations.current().presentation;
		var ABSTR = Visualisations.current().abstraction;
	
		document.getElementById("right_bar_header").setAttribute ("style", "background: (227,226,230);");
		document.getElementById("contentlabel").setAttribute ("style", "background: (227,226,230);");
		document.getElementById("contentlabel").innerHTML = "&nbsp";
	
		document.getElementById("contbox").innerHTML = "";
		$('#rightpaneleval').html(" ");
		$('#rightpanel').html(" ");
		insertRightPanelHtmlSpace($('#rightpanelspace'));
		
		ABSTR.clickednodehash = "";
		ABSTR.clickedlinkhash = "";
		
		ABSTR.replying = false;
		if (ABSTR.advevalnode){
			advevalnodepanelcancel();
		};
		if (ABSTR.advevallink){
			advevallinkpanelcancel();
		};
		ABSTR.advevalnode = false;
		ABSTR.advevallink = false;
		ABSTR.creatinglink = false;
	}
	
	function preparereplynodetype(selectedtype){
	
	    var PRES = Visualisations.current().presentation;
		var ABSTR = Visualisations.current().abstraction;
	
	    var selected = selectedtype || 1; 
		var ddData=[];
		
		for (var i=0;i<Model.nodeTypesArray.length;i++){
			
			nodetype = Model.nodeTypesArray[i];
			
			ddData.push({
			    text: Model.nodeTypes[nodetype].text,
				value: Model.nodeTypes[nodetype].value,
				selected:(Model.nodeTypes[nodetype].value==selected),
				imageSrc: Model.nodeTypes[nodetype].image
			});
		}
	
	
		$('#replynodetype').ddTslick({
	
			data: ddData,
			selectText: Webtext.tx_type_reply,
			width: 135,
			height:25*(Model.nodeTypesArray.length),
			background: "#fff",
			onSelected: function(selectedData){
				selectedreplynodetype = ddData[selectedData.selectedIndex].value;
				preparereplylinktype();
			}
		});
		
	}
	
	
	function preparereplylinktype(){
	
		var nodetype = selectedreplynodetype;
		var ddData=[];
		
		var defaultselected = Webtext.tx_general;
		
		var typeslist = Model.connectionList(nodetype)
		
		for (var i=0;i<typeslist.length;i++){
			
			ddData.push({
				text: typeslist[i].text,
				value: typeslist[i].value,
				selected:(typeslist[i].text==defaultselected),
				imageSrc: typeslist[i].image
			});
		}
	
				
		$('#replylinktype').ddTslick('destroy');
		
		$('#replylinktype').ddTslick({
	
			data: ddData,
			selectText: Webtext.tx_type_relation,
			width: 135,
			height: 25*(typeslist.length),
			background: "#fff",
			onSelected: function(selectedData){
				selectedreplylinktype = ddData[selectedData.selectedIndex].value;
			}
		});
			
	}
	
	
	function prepareadvevalnodetype(){
	
	    var PRES = Visualisations.current().presentation;
		var ABSTR = Visualisations.current().abstraction;
	
	    advevalnodevote = "";
	
		var ddData=[];
		
		for (var i=0;i<Model.nodeTypesArray.length;i++){
			
			nodetype = Model.nodeTypesArray[i];
			
			ddData.push({
				text: Model.nodeTypes[nodetype].text,
				value: Model.nodeTypes[nodetype].value,
			    selected:false,
				imageSrc: Model.nodeTypes[nodetype].image
			});
		}
	
	
		$('#newcatnodetype').ddTslick('destroy');
	
	
		$('#newcatnodetype').ddTslick({
	
			data: ddData,
			selectText: Webtext.tx_new_cat_thought,
			width: 260,
			height:25*(Model.nodeTypesArray.length),
			background: "#fff",
			onSelected: function(selectedData){
			    selectednewcatnodetype = ddData[selectedData.selectedIndex].value;
	// -1 because the arrays (the vote is the position in the array) start in 0 [see advevalnode(advevalnodevote)]
			    advevalnodevote = selectednewcatnodetype-1;
			}
		});
	
			
	}
	
	function prepareadvevallinktype(){
	
	    var PRES = Visualisations.current().presentation;
		var ABSTR = Visualisations.current().abstraction;
	
	    advevallinkvote = "";
	
		var ddData=[];
	
	// "No relation" is not shown
		for (var i=0;i<Model.linkTypesArray.length-1;i++){
			
			linktype = Model.linkTypesArray[i];
			
			ddData.push({
				text: Model.linkTypes[linktype].text,
				value: Model.linkTypes[linktype].value,
			    selected:false,
				imageSrc: Model.linkTypes[linktype].image
			});
		}
	
	
		$('#newcatlinktype').ddTslick('destroy');
	
	
	// "No relation" is not shown
		$('#newcatlinktype').ddTslick({
	
			data: ddData,
			selectText: Webtext.tx_new_cat_link,
			width: 260,
			height:25*(Model.linkTypesArray.length-1),
			background: "#fff",
			onSelected: function(selectedData){
			    selectednewcatlinktype = ddData[selectedData.selectedIndex].value;
	// -1 because the arrays (the vote is the position in the array) start in 0 [see advevallink(advevallinkvote)]
			    advevallinkvote = selectednewcatlinktype-1;
			}
		});
			
	}
	
	
	
	function prepareconnectlinktype(selectedtype){
	
		var PRES = Visualisations.current().presentation;
		 var selected = selectedtype || 0; 
	    
		var ddData=[];
		
		for (var i=0;i<Model.linkConnectTypesArray.length;i++){
			
			linktype = Model.linkConnectTypesArray[i];
			
			ddData.push({
				text: Model.linkTypes[linktype].text,
				value: Model.linkTypes[linktype].value,
				selected:(Model.linkTypes[linktype].value==selected),
				imageSrc: Model.linkTypes[linktype].image
			});
		}
	
		$('#connectlinktype').ddTslick('destroy');
		
		$('#connectlinktype').ddTslick({
	
			data: ddData,
			selectText: Webtext.tx_type_relation,
			width: 135,
			height:25*(Model.linkConnectTypesArray.length),
			background: "#fff",
			onSelected: function(selectedData){
				selectedconnectlinktype = ddData[selectedData.selectedIndex].value;
				PRES.linecolor = PRES.linkcolor[selectedconnectlinktype];
				changelinktype();
				showconnecttext();
			}
		});
			
	}
	
	function showconnecttext(){
	
		switch (selectedconnectlinktype){
			case 1:
				str = Webtext.tx_select_related_thought;
				break;
			case 2:
				str = Webtext.tx_select_agree_thought;
				break;
			case 3:
				str = Webtext.tx_select_disagree_thought;
				break;
			case 4:
				str = Webtext.tx_select_conseq_thought;
				break;
			case 5:
				str = Webtext.tx_select_alternat_thought;
				break;
			case 6:
				str = Webtext.tx_select_equiv_thought;
				break;
		}
		
		$("#connecttext").html(str);
	}
	
	function mousemove(){}
	
	function mousedown(){}
	
	function mouseup(){}
	
	//given some elements, searchs the ones that has a concrete hash (objective), and returns its index
	function searchhash(elements, objective){
	    for (i=0;i<elements.length;i++){
		if (elements[i].hash == objective){return i;}
		if (i == elements.length-1){return -1;}
	    };
	}
	
	
	function existingconnection(sourcehash, targethash){
	
		var links = Model.model.links;
		
		for (var i=0;i<links.length;i++){
			if ((links[i].source.hash === sourcehash && links[i].target.hash === targethash) || (links[i].source.hash === targethash && links[i].target.hash === sourcehash)){
				return true;
			}
		}
		
		return false;
	
	}
	
	
	function update_hash_lookup(newnodes, newlinks){
	
		newnodes.forEach(function(d, i) {
		  hash_lookup[d.hash] = d;
		});
		
		newlinks.forEach(function(d, i) {
		  d.source = hash_lookup[d.source];
		  d.target = hash_lookup[d.target];
		});
			
	}
	
	//Defines the tutorial of the Sandbox
	function changetutorialpanel(){
	
	    var PRES = Visualisations.current().presentation;
		var ABSTR = Visualisations.current().abstraction;
		
		if (!ABSTR.tutorialopened){return}
		
		var text= "";
		var textclose = "<div id='tutorial_panel_close' class='tutorial_panel_close noselect'>&times</div>";
		var textclick = "<div class='tutorial_panel_click'>("+Webtext.tx_click_cont+")</div>";
		
		switch (ABSTR.tutorialstep){
		
			case -1:
			text = Webtext.tx_tut1+"  &nbsp;&nbsp; ヽ(^。^)ノ ヽ(^。^)ノ  <br>&nbsp;&nbsp;&nbsp;&nbsp; (ﾉ^ ヮ^)ﾉ *:･ﾟ✧ <br><br>"+Webtext.tx_tut2+" <i>"+Webtext.tx_tut3+"</i>";
			break;
			
			
			case 0:
		        text = Webtext.tx_tut4+" <br><br>"+Webtext.tx_tut5;
			break;
		
			
			case 1:
			text = Webtext.tx_tut6;
			
			PRES.liveAttributes.mouseover(Model.model.nodes[0]);
			ABSTR.overnode = false;
			$("#right_bar").css({"border-left": "solid 1px red", "border-bottom": "solid 1px red"});
			break;
			
			
			case 2:
			text = Webtext.tx_tut7;
	
			$("#right_bar").css({"border-left": "solid 1px #bbb", "border-bottom": "solid 1px #bbb"});
			break;
			
			
			case 3:
			text = Webtext.tx_tut8+"<br><br>"+Webtext.tx_tut9;
			
		    if (!PRES.showfilters) hideshowfilters();
			$("#lower_bar").css("border", "solid 2px red");
	            
			break;
			
	
			case 4:
			text = Webtext.tx_tut10+"<br><br> "+Webtext.tx_tut11;
			
			break;
	
			
			case 5:
			text = Webtext.tx_tut12;
	            
		    if (PRES.showfilters) hideshowfilters();
			$("#lower_bar").css({"border": "solid 1px #bbb", "border-bottom": "none"});
			
			$("#right_bar").css({"border-left": "solid 2px red", "border-bottom": "solid 2px red"});
			PRES.liveAttributes.click(Model.model.nodes[0]);
			break;
			
			
			case 6:
			text = Webtext.tx_tut13;
			
		
			$("#right_bar").css({"border-left": "solid 1px #bbb", "border-bottom": "solid 1px #bbb"});
			showreplypanel(false);
			$("#tdnodetype").css("border", "solid 2px rgba(0,0,0,0)");
			$("#tdlinktype").css("border", "solid 2px rgba(0,0,0,0)");	
			break;
			
			
			case 7:
		        text = Webtext.tx_tut14+" <br>"+Webtext.tx_tut15;
			
			$("#tdnodetype").css("border", "solid 2px red");
			$("#tdlinktype").css("border", "solid 2px red");
	
			break;
			
			
			case 8:
			text = Webtext.tx_tut16+" <br><br>"+Webtext.tx_tut17;
			
			$("#tdnodetype").css("border", "solid 2px rgba(0,0,0,0)");
			$("#tdlinktype").css("border", "solid 2px rgba(0,0,0,0)");		
			
			$("#replybox").css("border-color", "red");
			$("#replyboxsum").css("border-color", "red");
			break;
			
			
			case 9:
			text = Webtext.tx_tut18;
			
			$("#replybox").css("border-color", "#bbb");
			$("#replyboxsum").css("border-color", "#bbb");
			
			showcreatelink(false);
			$("#tdconnect").css("border", "solid 2px red");
			break;
			
			
			case 10:
			text = Webtext.tx_tut19;
			
			$("#tdconnect").css("border", "solid 2px rgba(0,0,0,0)");
			$("#nodepos").css("border", "solid 2px red");
			$("#nodeneg").css("border", "solid 2px red");
			cancellink();
			break;
			
			
			case 11:
			text = Webtext.tx_tut20+"<br><br>"+Webtext.tx_tut21;
			
			ABSTR.overnode = false;
			PRES.liveAttributes.backgroundclick();
			
			$("#left_bar").css("border-color", "red");
			$("#nodepos").css("border", "solid 2px rgba(0,0,0,0)");
			$("#nodeneg").css("border", "solid 2px rgba(0,0,0,0)");
			break;
	
			
			case 12: 
			text = Webtext.tx_tut22;
			
			$("#left_bar").css("border-color", "rgba(0,0,0,0)");
			$("#headerMenu").css("color", "#f53d3d");
			break;
			
			
			case 13:
			text = Webtext.tx_tut23+" <br><br>"+Webtext.tx_tut24;
			
			$("#headerMenu").css("color", "#ddd");
			$("#headerUrl").css("color", "#f53d3d");
			break;
		
		
			case 14:
			text = Webtext.tx_tut25+"<br><br>"+Webtext.tx_tut26;
			
			$("#headerUrl").css("color", "#ddd");
			textclick = "<div class='tutorial_panel_click'>("+Webtext.tx_tut27+")</div>";
			break;		
			
			
			case 15:
			closetutorialpanel();
			return;
			break;
		}
		
		$("#tutorial_panel").html(textclose + text + textclick);
		$('#tutorial_panel_close')[0].onclick = closetutorialpanel;
		ABSTR.tutorialstep++;
	}
	
	
	function closetutorialpanel(){
	
	    var PRES = Visualisations.current().presentation;
		var ABSTR = Visualisations.current().abstraction;
	
		tutorialfont=$("#tutorial_panel").css("font-size");
	
		//restore all the possible modifications made at different steps in the tutorial
		$("#lower_bar").css("border", "solid 1px rgba(51,51,153, 0.6)");
		$("#right_bar").css({"border-left": "solid 1px #bbb", "border-bottom": "solid 1px #bbb"});
		$("#left_bar").css("border-color", "rgba(0,0,0,0)");
		$("#headerMenu").css("color", "#ddd");
		$("#headerUrl").css("color", "#ddd");
		
		ABSTR.overnode = false;
		
		
		if (!ABSTR.timevisualization){
			PRES.liveAttributes.backgroundclick();	
			$("#tdnodetype").css("border", "solid 2px rgba(0,0,0,0)");
			$("#tdlinktype").css("border", "solid 2px rgba(0,0,0,0)");	
			$("#tdconnect").css("border", "solid 2px rgba(0,0,0,0)");		
			$("#replybox").css("border-color", "#bbb");
			$("#replyboxsum").css("border-color", "#bbb");
		}
		
		//closes the tutorial panel
		$("#tutorial_panel").html("").animate({height: 20},300).animate({width: 100},300);
		
		setTimeout(function(){
			$("#tutorial_panel").css({"font-size":"11pt", "cursor":"pointer", "text-align":"center"}).html(Webtext.tx_watch_tutorial);
			$("#tutorial_panel")[0].onclick = opentutorialpanel;
		},700);
		
		ABSTR.tutorialopened=false;
	}
	
	
	function opentutorialpanel(){
	
	    var PRES = Visualisations.current().presentation;
		var ABSTR = Visualisations.current().abstraction;
		
		$("#tutorial_panel").html("").css({"font-size":tutorialfont, "cursor":"default", "text-align":"left"}).animate({width: searchCssProp('.tutorial_panel','width')},300).animate({height: searchCssProp('.tutorial_panel','height')},300);
		
		ABSTR.tutorialopened = true;
		ABSTR.tutorialstep = 0;
		
		setTimeout(function(){
			changetutorialpanel();
			$("#tutorial_panel")[0].onclick = changetutorialpanel;
		},700);
	}
	
	
	// Search in the zoomout css file for the value of a property inside a field
	function searchCssProp(selector,prop) {
			indcss = -1;
	
		  if($(window).height() > 486) {
		      for( var i in document.styleSheets ){
			str = ""+document.styleSheets[i].href;
			posstr = str.search("zoomout-large");
			if( document.styleSheets[i].href && (posstr > 0 )) {
			      indcss = i;
			      break;
			  }
		      };
		  } else {
		      for( var i in document.styleSheets ){
			str = ""+document.styleSheets[i].href;
			posstr = str.search("zoomout-small");
			if( document.styleSheets[i].href && (posstr > 0 )) {
			      indcss = i;
			      break;
			  }
		      };
		  };
	
	    if (document.all)
		myrule = document.styleSheets[indcss].rules;
	    else
		myrule = document.styleSheets[indcss].cssRules;
	    for (i=0; reg=myrule[i]; i++)
		if (reg.selectorText.toLowerCase() == selector.toLowerCase() )
		    return reg.style[prop];
	}
	
	function closelanguagepanel(){
		$('#language_panel').fadeOut(300);
	}	
	
	
	function openadvevalnodepanel(){
		console.log('open');
	    prepareadvevalnodetype();
	
	    var ABSTR = Visualisations.current().abstraction;
	    ABSTR.freezelink = true;
	    
	
		if (ABSTR.creatinglink){
			cancellink();
		}
		
		if (ABSTR.replying){
			hidereplypanel();
		}
	
		if (ABSTR.advevalnode){
			advevalnodepanelcancel();
		    return;
		}
	
		ABSTR.advevalnode = true;
	
		var width = 425;
		var height = 175;
		
		$('#advevalnode_panel').css({ 
			"width": width,
			"height": height,
			"top": ($("#right_bar").height()-height+55), 
			"left": ($(window).width()-$('#right_bar').width()-width-65)
		});
		
		$('#advevalnode_panel').fadeIn(200);
	//    $("#_textarea").focus();
	}
	
	
	function openadvevallinkpanel(){
	
	    prepareadvevallinktype();
	
	    var ABSTR = Visualisations.current().abstraction;
	    ABSTR.freezelink = true;
	    
	
		if (ABSTR.creatinglink){
			cancellink();
		}
		
		if (ABSTR.advevallink){
			advevallinkpanelcancel();
		    return;
		}
	
		ABSTR.advevallink = true;
	
		var width = 425;
		var height = 175;
		
		$('#advevallink_panel').css({ 
			"width": width,
			"height": height,
			"top": ($("#right_bar").height()-height+55), 
			"left": ($(window).width()-$('#right_bar').width()-width-65)
		});
		
		$('#advevallink_panel').fadeIn(200);
	//    $("#_textarea").focus();
	}
	
	
	function advevalnodepanelok(){
	
	
		if(advevalnodevote === ""){
			var alert = document.getElementById("advevalalert");
			alert.innerHTML = Webtext.tx_select_first_cat;
			setTimeout(function(){alert.innerHTML = "&nbsp";},2000);
			return;
		}
	
	       advevalnode(advevalnodevote);
	
	//		var alert = document.getElementById("advevalalert");
	//		alert.innerHTML = "Nueva categoria propuesta: " + advevalnodevote + " ";
	//		setTimeout(function(){alert.innerHTML = "&nbsp";},2000);
	
	}	
	
	function advevalnodepanelcancel(){
	    advevalnodevote = "";
	    var ABSTR = Visualisations.current().abstraction;
	    ABSTR.freezelink = false;
		ABSTR.advevalnode = false;
		$('#advevalnode_panel').fadeOut(100);
	}	
	
	function advevallinkpanelok(){
	
		if(advevallinkvote === ""){
			var alert = document.getElementById("advevalalertlink");
			alert.innerHTML = Webtext.tx_select_first_cat;
			setTimeout(function(){alert.innerHTML = "&nbsp";},2000);
			return;
		}
	
	    advevallink(advevallinkvote);
	
	//		var alert = document.getElementById("advevalalertlink");
	//		alert.innerHTML = "Nueva categoria propuesta: " + advevallinkvote + " ";
	//		setTimeout(function(){alert.innerHTML = "&nbsp";},2000);
	
	}	
	
	function advevallinkpanelcancel(){
	    advevallinkvote = "";
	    var ABSTR = Visualisations.current().abstraction;
	    ABSTR.freezelink = false;
		ABSTR.advevallink = false;
		$('#advevallink_panel').fadeOut(100);
	}	
	
	
	function opennamepanel(){
	    
	    var ABSTR = Visualisations.current().abstraction;
	    ABSTR.freezelink = true;
	    
		var width = 350;
		var height = 120;
		
		$('#name_panel').css({ 
			"width": width,
			"height": height,
			"top": ($("#right_bar").height()-height+10), 
			"left": ($(window).width()-$('#right_bar').width()-width-65)
		});
		
		$('#name_panel').fadeIn(200);
	    $("#name_textarea").focus();
	}
	
	function namepanelok(){
		var PRES = Visualisations.current().presentation;
		var ABSTR = Visualisations.current().abstraction;
	    
	    ABSTR.freezelink = false;
	    
	    author = $("#name_textarea").val().replace(/[\W]/g,'');
	
		$('#name_panel').fadeOut(100);
	    
	    switch(ABSTR.namepanelcaller){
	        case ("evalnode"):
	            evalnode(ABSTR.namepanelparameter);
	            break;
	        case ("evallink"):
	            evallink(ABSTR.namepanelparameter);
	            break;
	        case ("createnode"):
	            createnode();
	            break;
	        case ("savelink"):
	            savelink(ABSTR.namepanelparameter);
	            break;
	        case ("advevalnode"):
	            advevalnode(ABSTR.namepanelparameter);
	            break;
	        case ("advevallink"):
	            advevallink(ABSTR.namepanelparameter);
	            break;
	    }
	    
	}	
	
	function namepanelcancel(){
	    var ABSTR = Visualisations.current().abstraction;
	    ABSTR.freezelink = false;
		$('#name_panel').fadeOut(100);
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
	
	
	// Defines a renormaliztion for the size of nodes and links depending on the votes of all of them
	function definerenormalization(){
	
		var minnodesize = 6;
		var maxnodesize = 30;
		var minlinksize = 1;
		var maxlinksize = 9;
		var variation = 3; //sets the variation of the sizes, they are bigger when 'variation' is closer to zero.
		
		// var evalminlimit = -10;
		// var evalmaxlimit = 15;
		
		//nodes renormalization
	    var PRES = Visualisations.current().presentation;
		
		var nodesdifevalarray = Model.model.nodes.map(function(e){return e.evalpos-e.evalneg;});
		
		var maxeval = d3.max(nodesdifevalarray);
		var mineval = d3.min(nodesdifevalarray);
		
		var maxdomain = maxeval + variation;
		var mindomain = mineval - variation;
		
		PRES.renormalizednode=d3.scale.linear().domain([mindomain,1,maxdomain]).range([minnodesize,PRES.nodeSizeDefault,maxnodesize]);
		PRES.renormalizednode.clamp(true);
		
		
		//linksrenormalization
		var linksdifevalarray = Model.model.links.map(function(e){return e.evalpos-e.evalneg;});
		
		var maxeval = d3.max(linksdifevalarray);
		var mineval = d3.min(linksdifevalarray);
		
		var maxdomain = maxeval + variation;
		var mindomain = mineval - variation;
		
		PRES.renormalizedlink=d3.scale.linear().domain([mindomain,1,maxdomain]).range([minlinksize,PRES.linkStrokeWidthDefault,maxlinksize]);
		PRES.renormalizedlink.clamp(true);
		
	
	}
	
	
	function evolutionplay(){
		var PRES = Visualisations.current().presentation;
		var ABSTR = Visualisations.current().abstraction;
		
		if (ABSTR.showingevolution){
			$("#evolutionplay").html("&#9654;");
	        $("#evolutionpause").hide();
			clearTimeout(addone);
			PRES.evolutionvelocity = 9000;
	        ABSTR.evolutionstop = true;
			addbytime(); 
		} else {
			PRES.drawexplosions = false;
			ABSTR.evolutionpause = false;
			ABSTR.letmouseover = false;
			PRES.force.friction(0.7);
			//PRES.force.charge(-500);
			//PRES.force.linkStrength(0.5);
			$("#evolutionpause").html("ll");
	        $("#evolutionplay").html("&#8718;");
	        $("#evolutionpause").show();
			hidelinkselect();
			
			startevolution();
		}
	    
	    ABSTR.showingevolution = !ABSTR.showingevolution;
	}
	
	function bigevolutionclick(){
	    var ABSTR = Visualisations.current().abstraction;
	    if (!ABSTR.showingevolution && !ABSTR.evolutionstop) evolutionplay();
	}
	
	
	function startevolution(){
	    var PRES = Visualisations.current().presentation;
		var ABSTR = Visualisations.current().abstraction;
	    
	    allnodes = PRES.force.nodes().slice();
	    alllinks = PRES.force.links().slice();
		
		allnodes.sort(function(a,b){return a.time-b.time;});
		alllinks.sort(function(a,b){return a.time-b.time;});
		
		danodes = [];
		dalinks = [];
	    
		
		PRES.force.nodes([]);
		PRES.force.links([]);
		
		PRES.svg.selectAll(".link")
	        .data("")
	        .exit().remove();
			
		PRES.svg.selectAll(".node")
	        .data("")
	        .exit().remove();
			
		PRES.svg.selectAll(".seed")
	        .data("")
	        .exit().remove();
			
		PRES.svg.selectAll("text")
	        .data("")
	        .exit().remove();
			
		//allnodes = Model.model.nodes.slice();
		//alllinks = Model.model.links.slice();
	    
	    hidenodetexts();
		PRES.liveAttributes.backgroundclick();
		addbytime(); 
		
	}
	
	function addbytime(){
		var ABSTR = Visualisations.current().abstraction;
	   var PRES = Visualisations.current().presentation;
		
	    updatetimevisualization();
	
		if (PRES.showingtags){
		    showtags();
		};
		if (PRES.showingauthors){
		    showauthors();
		};
		if (PRES.showingsums){
		    showsums();
		};
	
	
		if (allnodes.length> 0 && alllinks.length> 0){
		
			if ((allnodes[0].time < alllinks[0].time && allnodes[0].seed > 0)||(ABSTR.youarenotalone)){
	            evolutionaddnode();
			}else{
	            var directlink = alllinks[0].direct;
	            evolutionaddlink();
				if (directlink == 0) evolutionaddnode();
	            if (directlink == 1 && ABSTR.treeview){
	                addbytime();
	                return;
	            }
	        }
	        
	    }else if(allnodes.length > 0){
	        evolutionaddnode();
	    }else if(alllinks.length > 0){
	        evolutionaddlink();
	        
		} else {
	        evolutionend();
			return;
		}
		
		addone = setTimeout(function() { addbytime() },250/PRES.evolutionvelocity); 
	}
	
	function evolutionaddnode(){
	    var PRES = Visualisations.current().presentation;
	    
	    danodes.push(allnodes[0]);
	    PRES.force.nodes(danodes);
	    drawnewnodes();
	    if (allnodes[0].seed > 0){addseed(allnodes[0]);}
	    allnodes.shift();    
	}
	
	function evolutionaddlink(){
	    var PRES = Visualisations.current().presentation;
	    
	    dalinks.push(alllinks[0]);
	    PRES.force.links(dalinks);
	    drawnewlinks();		
	    alllinks.shift();
	}
	
	function evolutionpause(){
		
		var PRES = Visualisations.current().presentation;
		var ABSTR = Visualisations.current().abstraction;
	    
		if (! ABSTR.evolutionpause){
			clearTimeout(addone);
			$("#evolutionpause").html("&#9654;");
		} else {
			addbytime();
			$("#evolutionpause").html("ll");
		}
	    
	    ABSTR.evolutionpause = !ABSTR.evolutionpause;
	}
	
	function evolutionend(){
	    
		var PRES = Visualisations.current().presentation;
		var ABSTR = Visualisations.current().abstraction;
	    
	    clearInterval(addone);
	    ABSTR.showingevolution = false;
	    ABSTR.evolutionstop = false;
	    ABSTR.evolutionpause = false;
	    ABSTR.youarenotalone = false;
	    ABSTR.letmouseover = true;
	    PRES.evolutionvelocity = 1;
	    $("#evolvelocity").html("");
	    $("#evolutionplay").html("&#9654;");
	    $("#evolutionpause").hide();
	    
	    PRES.force.friction(0.85);
	    PRES.force.charge(-500);
	    //PRES.force.linkStrength(1);
	    PRES.force.gravity(0.1);
	    PRES.force.start();
	    PRES.drawexplosions = true;
	    
	    //Model.model.nodes = PRES.force.nodes();
	    //Model.model.links = PRES.force.links();
	    
	    $("#svg").delay(800).fadeIn(500);    
	}
	
	/*function evolutionfast(){
		var PRES = Visualisations.current().presentation;
	
		if (PRES.evolutionvelocity < 8){PRES.evolutionvelocity *= 2;}
		if (PRES.evolutionvelocity == 0.4){PRES.evolutionvelocity = 0.5;}
		
		var str = "";
		if (PRES.evolutionvelocity != 1){str="(x"+PRES.evolutionvelocity+")";}
		
		$("#evolvelocity").html(str);
		
		if (!ABSTR.evolutionpause){
			clearInterval(addone);
			addbytime();
		}
	}
	
	function evolutionslow(){
		var PRES = Visualisations.current().presentation;
	
		if (PRES.evolutionvelocity > 0.1){PRES.evolutionvelocity *= 0.5;}
		if (PRES.evolutionvelocity == 0.25){PRES.evolutionvelocity = 0.2;}
		
		var str = "";
		if (PRES.evolutionvelocity != 1){str="(x"+PRES.evolutionvelocity+")";}
		
		$("#evolvelocity").html(str);
	}*/
	
	
	
	function findstringsontext (strings, text) {   
	    var stringsarray=strings.split(", "); 
	    var foundstringsarray = [];
	
	    for (i=0;i<stringsarray.length;i++){
		if (text.indexOf(stringsarray[i]) !== -1){
		foundstringsarray.push(stringsarray[i]);
		}
	    };
	
	      var foundstrings = foundstringsarray.join(); 
	      return foundstrings;
	
	}
	
	function showtags(){
		hidenodetexts();
		var ABSTR = Visualisations.current().abstraction;
	    var PRES = Visualisations.current().presentation;
	    
	    ABSTR.filters.showFilter = 'tags';
	
		var textdata = [];
	
		//Model.model.nodes.forEach(function(d, i) {		
	    PRES.force.nodes().forEach(function(d, i) {		
	
				textdata.push({node:d, text: findstringsontext(Model.tags, d.content)});
		});
			
			
			PRES.svg.selectAll("text")
				.data(textdata)
				.enter().append("text")
				.text( function (d) { return d.text;})
				.attr("x", function(d) { return d.node.x; })
				.attr("y", function(d) { return (parseInt(d.node.y)-parseInt(PRES.liveAttributes.nodeRadius(d.node))-1); })
			    .style("font-size", "12px")
				.attr("text-anchor", "middle")
				.style("fill-opacity", function(d) {return PRES.liveAttributes.nodeFillOpacity(d.node);})
				.style("fill", "#333");	
		
	}
	
	function showauthors(){
		hidenodetexts();
		var ABSTR = Visualisations.current().abstraction;
	    var PRES = Visualisations.current().presentation;
	    
	    ABSTR.filters.showFilter = 'authors';
	
		var textdata3 = [];
			
	    PRES.force.nodes().forEach(function(d, i) {		
	
				textdata3.push({node:d});
		});
			
			
			PRES.svg.selectAll("text")
				.data(textdata3)
				.enter().append("text")
				.text( function (d) { return d.node.author;})
				.attr("x", function(d) { return d.node.x; })
				.attr("y", function(d) { return (parseInt(d.node.y)-parseInt(PRES.liveAttributes.nodeRadius(d.node))-1); })
			    .style("font-size", "12px")
				.attr("text-anchor", "middle")
				.style("fill-opacity", function(d) {return PRES.liveAttributes.nodeFillOpacity(d.node);})
				.style("fill", "#333");
			
	}
	
	function showsums(){
		hidenodetexts();
		var ABSTR = Visualisations.current().abstraction;
	    var PRES = Visualisations.current().presentation;
	    
	    ABSTR.filters.showFilter = 'summaries';
	
		var textdata2 = [];
		
	//	Model.model.nodes.forEach(function(d, i) {	
	    PRES.force.nodes().forEach(function(d, i) {		
	
				//if a node has no summary, an automatic summary is created with the 60 first character of its content
				var fontcolor = "#000";
				var fontstyle = "normal";
				var summary = d.contentsum;
				
				if (summary == ""){
				
					var fontcolor = "#555";
					var fontstyle = "italic";
					
					if (d.content.length > 60){
						summary = "[" + d.content.slice(0, 60) + "...]";
					} else {
						summary = "[" + d.content + "]";
					}
	
				}
				
				textdata2.push({node:d, fontcolor:fontcolor, fontstyle: fontstyle, summary: summary});
		});
			
		
	
		
			PRES.svg.selectAll("text")
			    .data(textdata2)
			    .enter().append("text")
			    .text( function (d) { return d.summary;})
			    .attr("x", function(d) { return d.node.x; })
			    .attr("y", function(d) { return (parseInt(d.node.y)-parseInt(PRES.liveAttributes.nodeRadius(d.node)))-1; })
				.attr("text-anchor", "middle")
				.style("font-size", "10px")
				.style("font-style", function(d) { return d.fontstyle; })
				.style("fill-opacity", function(d) {return PRES.liveAttributes.nodeFillOpacity(d.node);})
				.style("fill", function(d) { return d.fontcolor; });	
	
	
	}
	
	function hidenodetexts(){
		var ABSTR = Visualisations.current().abstraction;
	    var PRES = Visualisations.current().presentation;
	    
		ABSTR.filters.showFilter = 'none';
		
			PRES.svg.selectAll("text")
				.data("")
				.exit().remove();			
	}
	
	
	//TIMELINE VISUALIZATION
	
	function changevisualization(){
	
		var ABSTR = Visualisations.current().abstraction;
		var PRES = Visualisations.current().presentation;
	
	        var nodes = PRES.force.nodes();
	
		    ABSTR.timevisualization = !ABSTR.timevisualization;
	
		    if (ABSTR.advevalnode){
			advevalnodepanelcancel();
		    };
		    if (ABSTR.advevallink){
			advevallinkpanelcancel();
		    };
		    ABSTR.advevalnode = false;
		    ABSTR.advevallink = false;
	
		
		//change right_bar properties when going back to original visualization
		
		if (!ABSTR.timevisualization){
	
			cancellink();
			
			$(".right_bar").resizable( "destroy" )
			
			insertRightBarHtml($("#right_bar"));
			$("#rbexpand").css("margin-right", "4px");
			
			$(".right_bar").resizable({
				handles: 'w',
				minWidth: 335,
				resize: function() {
					$(this).css("left", 0);
				}
			});	
		
			
			$("#right_bar").css({
				"width": $("#right_bar").width()-20,
				"height": "auto",
				"overflow": "visible",
				"padding": "0px 10px 12px 10px",
			});
			
			insertRightPanelHtmlSpace($('#rightpanelspace'));
			
			if (oldindex !== ""){
				PRES.liveAttributes.click(timednodes[oldindex]);
			}
			
			
			
			return;
		}
		
		//change right_bar properties when going to time visualization
		
		oldindex = "";
		oldoverindex = 1;
		
		cancellink();
		
		$(".right_bar").resizable( "destroy" )
		
		insertTimevisRightBarHtml($("#right_bar"));
		$("#rbexpand").css("margin-right", "8px");
		
		$(".right_bar").resizable({
			handles: 'w',
			minWidth: 335,
			resize: function() {
				$(this).css("left", 0);
			}
		});	
			
		oldrbwidth = $("#right_bar").width();
		
		$("#right_bar").css({
			"width": $("#right_bar").width()+20,
			"height": $(window).height()-50,
			"overflow": "auto",
			"padding": "0px 0px 0px 0px",
		});
		
		
		$("#timevisdiv").css({
			"height": $(window).height()-50-53-0,
		});	
		
		var html = "<br>";
		
		//array of all the nodes shorted by creation time
	//	timednodes = Model.model.nodes;
		timednodes = nodes;
		timednodes.sort(function(a,b){return a.time-b.time;});	
		
		//add divs with the node contents to the right_bar
		
		for (var i=0; i< timednodes.length; i++){
			
			var color = d3.rgb(PRES.nodecolor[timednodes[i].type]).darker(0).toString();
			var legend = timednodes[i].author+' - '+DateTime.timeAgo(timednodes[i].time);
			
			html += '<div id="nodelegend'+i+'" class="divnodelegend">'+legend+'</div>'; 
			
			html += '<div id="nodecontent'+i+'" class="divnodecontent" style="border: solid 1px'+color+'"></div>'; 
			
			html += '<div id="nodeinteract'+i+'" class="divnodeinteract">&nbsp</div>'; 
		}
		
		$("#timevisdiv").html(html+"<br><br><br> <br><br><br><br>");
		
		for (var i=0; i< timednodes.length; i++){
		
			var content = URLlinks(nl2br(timednodes[i].content));	
			$("#nodecontent"+i).html(content);
			assignNodeContentBindings($("#nodecontent"+i)[0]);
			
		//	if ($("#nodecontent"+i).height()>200){$("#nodecontent"+i).height(200)}; //maximun height (thought still resizable)
		}
		
		if (ABSTR.clickednode !== "" && !ABSTR.showingevolution){
			var index = $.inArray(ABSTR.clickednode, timednodes);
			selectdivcontent(index);
			
			$('#timevisdiv').scrollTop($('#timevisdiv').scrollTop()+$("#nodecontent"+index).position().top-60);
			
		} else {
			$('#timevisdiv').scrollTop(0);
		}
		
	}
	
	function updatetimevisualization(){
	
	
		var ABSTR = Visualisations.current().abstraction;
		var PRES = Visualisations.current().presentation;
	
	        var nodes = PRES.force.nodes();
	
		if (ABSTR.timevisualization){
			
		//change right_bar properties when going to time visualization
	
		$(".right_bar").resizable( "destroy" )
		
		insertTimevisRightBarHtml($("#right_bar")[0]);
	//	$("#rbexpand").css("margin-right", "8px");
		
		$(".right_bar").resizable({
			handles: 'w',
			minWidth: 335,
			resize: function() {
				$(this).css("left", 0);
			}
		});	
			
	//	$("#right_bar").css({
	//		"width": $("#right_bar").width()+20,
	//		"height": $(window).height()-50,
	//		"overflow": "auto",
	//		"padding": "0px 0px 0px 0px",
	//	});
		
		
	//	$("#timevisdiv").css({
	//		"height": $(window).height()-50-53-0,
	//	});	
		
		var html = "<br>";
		
		//array of all the nodes shorted by creation time
	//	timednodes = Model.model.nodes;
		timednodes = nodes;
		timednodes.sort(function(a,b){return a.time-b.time;});	
		
		//add divs with the node contents to the right_bar
		
		for (var i=0; i< timednodes.length; i++){
			
			var color = d3.rgb(PRES.nodecolor[timednodes[i].type]).darker(0).toString();
			var legend = timednodes[i].author+' - '+DateTime.timeAgo(timednodes[i].time);
			
			html += '<div id="nodelegend'+i+'" class="divnodelegend">'+legend+'</div>'; 
			
			html += '<div id="nodecontent'+i+'" class="divnodecontent" style="border: solid 2px'+color+'"></div>'; 
			
			html += '<div id="nodeinteract'+i+'" class="divnodeinteract">&nbsp</div>'; 
		}
		
		$("#timevisdiv").html(html+"<br><br><br> <br><br><br><br>");
		
		for (var i=0; i< timednodes.length; i++){
		
			var content = URLlinks(nl2br(timednodes[i].content));	
			$("#nodecontent"+i).html(content);
			assignNodeContentBindings($("#nodecontent"+i)[0]);
			
		//	if ($("#nodecontent"+i).height()>200){$("#nodecontent"+i).height(200)}; //maximun height (thought still resizable)
		}
		
		if (ABSTR.clickednode !== "" && !ABSTR.showingevolution){
			var index = $.inArray(ABSTR.clickednode, timednodes);
			selectdivcontent(index);
			
			$('#timevisdiv').scrollTop($('#timevisdiv').scrollTop()+$("#nodecontent"+index).position().top-60);
			
		} else {
			$('#timevisdiv').scrollTop(0);
		}
	
		}
		
	}
	
	
	//TIMELINE INTERACTION
	
	function clickdivcontent (id){
	
		var ABSTR = Visualisations.current().abstraction;
		var PRES = Visualisations.current().presentation;
		
		var index=id.slice(11);
		var selnode=timednodes[index];
	
		if (ABSTR.creatinglink){
			index = oldindex;
			PRES.liveAttributes.click(selnode)
			return;
		}
		
		selectdivcontent(index);
	
		nodefocus(selnode, PRES.scaler.zoomval);
		
	}
	
	function selectdivcontent(index){
	
		var ABSTR = Visualisations.current().abstraction;
		var PRES = Visualisations.current().presentation;
	
		var id="nodecontent"+index;
		var selnode=timednodes[index];
		
		if (oldindex !== ""){
			var color = d3.rgb(PRES.nodecolor[timednodes[oldindex].type]).darker(0).toString();
			$("#nodecontent"+oldindex).css({
					"border": "solid 1px"+color,
			});
			
			var oldinteractheight = $("#nodeinteract"+oldindex).height();
			$("#nodeinteract"+oldindex).height("24px");
			$("#nodeinteract"+oldindex).html("");
			var newinteractheight = $("#nodeinteract"+oldindex).height();
			
			if (index>oldindex){
				$('#timevisdiv').scrollTop($('#timevisdiv').scrollTop()-oldinteractheight+newinteractheight);
			}
		}
		
		oldindex = index;
	
	//	$("#"+id).animate({height: $("#"+id)[0].scrollHeight-10},200); //make the div taller, to show all its content without scrollbar
		
		$("#"+id).css({
				"border": "solid 1px"+PRES.bordercolor.clicked,
		});
		
		$("#nodeinteract"+oldindex).height("24px");
		
		insertTimevisInteractHtml($('#nodeinteract'+index));
		//$("#nodeinteract"+index).html(timevisinteracthtml);
	
		document.getElementById("nodepos").innerHTML = "+" + selnode.evalpos;
		document.getElementById("nodeneg").innerHTML = ((selnode.evalneg===0) ? "" : "-") + selnode.evalneg;	
		
		ABSTR.clickednodehash = selnode.hash;
		ABSTR.clickednode = selnode;
		ABSTR.clickedlinkhash = "";
		if (ABSTR.replying){
			cancellink();
			ABSTR.replying = false;
		}
		
		if($.inArray(selnode.hash, PRES.readnodes) < 0){
			PRES.readnodes.push(selnode.hash);
		}
					
						
	//	updateNodes(PRES);
		PRES.svg.selectAll(".node")
			.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
			.style("stroke", PRES.liveAttributes.nodeStroke)
			.style("fill",PRES.liveAttributes.nodeFill);
			
		PRES.svg.selectAll(".link")
			.style("stroke-opacity", PRES.liveAttributes.linkStrokeOpacity);
	
	}
	
	
	function overdivcontent (id){
	
		var ABSTR = Visualisations.current().abstraction;
		var PRES = Visualisations.current().presentation;
		
		var overindex=id.slice(11);
		var selnode=timednodes[overindex];
		
		if (oldindex != overindex){
			$("#"+id).css({
				"border": "solid 1px"+PRES.bordercolor.over,
			});
		}
		
		oldoverindex = overindex;
		
		ABSTR.overnodehash = selnode.hash;
		
	//	updateNodes(PRES);
	
		PRES.svg.selectAll(".node")
			.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
			.style("stroke", PRES.liveAttributes.nodeStroke)
			.style("fill",PRES.liveAttributes.nodeFill);
			
		PRES.svg.selectAll(".link")
			.style("stroke-opacity", PRES.liveAttributes.linkStrokeOpacity);
	
		
		if (ABSTR.creatinglink && selectedconnectlinktype != 0){
				var x1 = timednodes[oldindex].x,
					y1 = timednodes[oldindex].y,
					x2 = timednodes[overindex].x,
					y2 = timednodes[overindex].y;
			
			PRES.prelink
				.attr("x1", x1)
				.attr("y1", y1)
				.attr("x2", x2)
				.attr("y2", y2)
				.style("stroke", PRES.linecolor);
		}
	}
	
	function outdivcontent(id){
		var ABSTR = Visualisations.current().abstraction;
		var PRES = Visualisations.current().presentation;
		
		var outindex=id.slice(11);
	
		if (oldindex != outindex){
			var color =  d3.rgb(PRES.nodecolor[timednodes[oldoverindex].type]).darker(0).toString();
			$("#nodecontent"+outindex).css({
				"border": "solid 1px " + color,
			});
		}
		
		ABSTR.overnodehash = "";
		ABSTR.overnode = "";
	
		PRES.svg.selectAll(".node")
			.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
			.style("stroke", PRES.liveAttributes.nodeStroke);
			
		PRES.svg.selectAll(".link")
			.style("stroke-opacity", PRES.liveAttributes.linkStrokeOpacity);
	}
	
	//END OF TIMELINE VISUALIZATION
	
	
	function egg1(){
	
		var ABSTR = Visualisations.current().abstraction;
		var PRES = Visualisations.current().presentation;
	
		if (ABSTR.showingevolution){
			clearInterval(addone);
			//$("#evolutionplay").html("&#9654;");
			ABSTR.youarenotalone = true;
			startevolution();
		}	
	}		
	
	
	function treeview(){ 
	
		var ABSTR = Visualisations.current().abstraction;
		var PRES = Visualisations.current().presentation;
		
	    ABSTR.treeview = !ABSTR.treeview;
	    
	    if (ABSTR.treeview){
	        PRES.force.linkStrength(function(d){return 1-d.direct;});
	        PRES.svg.selectAll(".link")
	            .attr("marker-start", PRES.liveAttributes.linkArrow)
	            .style("stroke-opacity", function(d){return (d.direct==1) ? 0 : PRES.linkOpacityDefault; });
	        $("#treeview").css("background-image", "url('img/treeicon.png')");
	        $("#treeview").attr("title", Webtext.tx_show_all_connections);
	    } else {
	        PRES.force
	            //.transition().duration(2000)
	            .linkStrength(0.4);
	        PRES.svg.selectAll(".link")
	            .attr("marker-start", PRES.liveAttributes.linkArrow)
	            .style("stroke-opacity", PRES.linkOpacityDefault );   
	        $("#treeview").css("background-image", "url('img/compicon.png')");
	        $("#treeview").attr("title", Webtext.tx_show_direct_connections);
	    }
	    
		PRES.force.start();
	}		
	
	
	function treeviewover(){
	    var ABSTR = Visualisations.current().abstraction;
	    var PRES = Visualisations.current().presentation;
	    
	    if (ABSTR.treeview){
	         $("#treeview").css("background-image", "url('img/compicon.png')");      
	         PRES.svg.selectAll(".link")
	            .style("stroke-opacity", function(d){return (d.direct==1) ? 0.4 : PRES.linkOpacityDefault; });        
	    } else {
	         $("#treeview").css("background-image", "url('img/treeicon.png')");   
	    }
	}			
	
	function treeviewout(){
	    var ABSTR = Visualisations.current().abstraction;
	    var PRES = Visualisations.current().presentation;
	    
	    if (!ABSTR.treeview){
	         $("#treeview").css("background-image", "url('img/compicon.png')");      
	    } else {
	         $("#treeview").css("background-image", "url('img/treeicon.png')");   
	         PRES.svg.selectAll(".link")
	            .style("stroke-opacity", function(d){return (d.direct==1) ? 0 : PRES.linkOpacityDefault; });  
	    }
	}
	
	
	//converts from hex color to rgba color
	function hex2rgb(hex, opacity) {
	        var h=hex.replace('#', '');
	        h =  h.match(new RegExp('(.{'+h.length/3+'})', 'g'));
	
	        for(var i=0; i<h.length; i++)
	            h[i] = parseInt(h[i].length==1? h[i]+h[i]:h[i], 16);
	
	        if (typeof opacity != 'undefined')  h.push(opacity);
	
	        return 'rgba('+h.join(',')+')';
	}
	
	
	//replace multiple URLs inside a string in html links
	function URLlinks(text) {
	    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9é-ú+&@#\/%?=~_|!:,.;]*[-A-Z0-9é-ú+&@#\/%=~_|])/ig;
	    return text.replace(exp,"<a href='$1' target='_blank'>$1</a>");
	}
	
	//replace line breaks with <br> html tags
	function nl2br (str, is_xhtml) {   
		var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
		return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
	}
	
	
	function ZoomOut_Control(VIS, ABSTR, PRES) {
		var conversationTools = new ModuleConvTools.ConversationTools();
		
		this.init = function() {
			conversationTools.init();
			conversationTools.control.onNodesAndLinksChanged = applyNodeChanges;
			conversationTools.control.onLinksChanged = applyLinkChanges;
			conversationTools.control.showFilterChanged.subscribe(selectShowFilter);
			conversationTools.control.sizeFilterChanged.subscribe(selectSizeFilter);
			conversationTools.control.nodeFilterChanged.subscribe(selectNodeFilter);
			conversationTools.control.linkFilterChanged.subscribe(selectLinkFilter);
			//conversationTools.control.onFilterChanged = selectFilter;
		}
	};
	// End of var ZoomOut
	
	
	function applyNodeChanges(remainingNodes, remainingLinks){
		var ABSTR = Visualisations.current().abstraction;
		var PRES = Visualisations.current().presentation;
		
		if (ABSTR.showingevolution) evolutionend();
		
		PRES.force.nodes(remainingNodes);
		PRES.force.links(remainingLinks);
	
		PRES.drawexplosions = false;
		PRES.elasticdraw = false;
		
		PRES.svg.selectAll(".node")
			.data("")
			.exit().remove();	
	
		PRES.svg.selectAll(".seed")
			.data("")
			.exit().remove();
	
		if (PRES.showingauthors || PRES.showingtags || PRES.showingsums){
		    hidenodetexts();
		};
	
		drawnewnodes();
	
		PRES.svg.selectAll(".link")
			.data("")
			.exit().remove();
	
		drawnewlinks();
	
		PRES.svg.selectAll(".link").style("stroke", PRES.liveAttributes.relatedNodesOpacity);
		PRES.svg.selectAll(".link").style("stroke", PRES.liveAttributes.relatedSeedRadius);
        PRES.svg.selectAll(".node").style("fill", PRES.liveAttributes.relatedLinksOpacity);
	
		if (PRES.showingsums){
		var textdata2 = [];	
		remainingNodes.forEach(function(d, i) {	
				//if a node has no summary, an automatic summary is created with the 60 first character of its content
				var fontcolor = "#000";
				var fontstyle = "normal";
				var summary = d.contentsum;			
				if (summary == ""){			
					var fontcolor = "#555";
					var fontstyle = "italic";				
					if (d.content.length > 60){
						summary = "[" + d.content.slice(0, 60) + "...]";
					} else {
						summary = "[" + d.content + "]";
					}
				}			
				textdata2.push({node:d, fontcolor:fontcolor, fontstyle: fontstyle, summary: summary});
		});	
			PRES.svg.selectAll("text")
			    .data(textdata2)
			    .enter().append("text")
			    .text( function (d) { return d.summary;})
			    .attr("x", function(d) { return d.node.x; })
			    .attr("y", function(d) { return (parseInt(d.node.y)-parseInt(PRES.liveAttributes.nodeRadius(d.node)))-1; })
				.attr("text-anchor", "middle")
				.style("font-size", "10px")
				.style("font-style", function(d) { return d.fontstyle; })
				.style("fill-opacity", function(d) {return PRES.liveAttributes.nodeFillOpacity(d.node);})
				.style("fill", function(d) { return d.fontcolor; });	
		}
	
		if (PRES.showingauthors){
		var textdata3 = [];	
		remainingNodes.forEach(function(d, i) {		
				textdata3.push({node:d});
		});
			PRES.svg.selectAll("text")
				.data(textdata3)
				.enter().append("text")
				.text( function (d) { return d.node.author;})
				.attr("x", function(d) { return d.node.x; })
				.attr("y", function(d) { return (parseInt(d.node.y)-parseInt(PRES.liveAttributes.nodeRadius(d.node))-1); })
			    .style("font-size", "12px")
				.attr("text-anchor", "middle")
				.style("fill-opacity", function(d) {return PRES.liveAttributes.nodeFillOpacity(d.node);})
				.style("fill", "#333");	
		}
	
		if (PRES.showingtags){
		var textdata = [];	
		remainingNodes.forEach(function(d, i) {		
				textdata.push({node:d, text: findstringsontext(Model.tags, d.content)});
		});		
			PRES.svg.selectAll("text")
				.data(textdata)
				.enter().append("text")
				.text( function (d) { return d.text;})
				.attr("x", function(d) { return d.node.x; })
				.attr("y", function(d) { return (parseInt(d.node.y)-parseInt(PRES.liveAttributes.nodeRadius(d.node))-1); })
			    .style("font-size", "12px")
				.attr("text-anchor", "middle")
				.style("fill-opacity", function(d) {return PRES.liveAttributes.nodeFillOpacity(d.node);})
				.style("fill", "#333");	
		}
	
	    updateSeeds();
	
		if (!ABSTR.showingevolution) PRES.drawexplosions = true;
		PRES.elasticdraw = true;
	
	    updatetimevisualization();
	
	}
	
	
	function applyLinkChanges(remainingLinks){
		var ABSTR = Visualisations.current().abstraction;
		var PRES = Visualisations.current().presentation;
		
		if (ABSTR.showingevolution) evolutionend();
		
		PRES.force.links(remainingLinks);
		
		PRES.drawexplosions = false;
		PRES.elasticdraw = false;
		
	
		PRES.svg.selectAll(".link")
			.data("")
			.exit().remove();
	
		drawnewlinks();
	
	
		PRES.svg.selectAll(".link").style("stroke", PRES.liveAttributes.relatedNodesOpacity);
		PRES.svg.selectAll(".link").style("stroke", PRES.liveAttributes.relatedSeedRadius);
        PRES.svg.selectAll(".node").style("fill", PRES.liveAttributes.relatedLinksOpacity);
			
		if (ABSTR.showingevolution) PRES.drawexplosions = true;
		PRES.elasticdraw = true;
	
	    updatetimevisualization();
	}
	
	function selectShowFilter(args) {
		var filter = args.state;
		var ABSTR = Visualisations.current().abstraction;
		if(ABSTR.filters.showFilter == name) hidenodetexts();
		else switch(filter) {
			case ModuleConvTools.ShowFilters.Summaries: showsums(); break;
			case ModuleConvTools.ShowFilters.Authors: showauthors(); break;
			case ModuleConvTools.ShowFilters.Tags: showtags(); break;
			case ModuleConvTools.ShowFilters.None: hidenodetexts(); break;
		}
	}
	
	function selectSizeFilter(args) {
		var filter = args.state;
		var ABSTR = Visualisations.current().abstraction;
		ABSTR.filters.sizeFilter = filter; //TODO: encapsulate (ABSTR)
		applyAttributeChanges();
	}
	
	function selectNodeFilter(args) {
		console.log('selectNodeFilter');
		var ABSTR = Visualisations.current().abstraction;
		var filterList = ABSTR.filters.nodeFilters;
		filterList[args.itemId].state = args.state;
		applyAttributeChanges();
	}
	
	function selectLinkFilter(args) {
		console.log('selectLinkFilter');
		var ABSTR = Visualisations.current().abstraction;
		var filterList = ABSTR.filters.linkFilters;
		filterList[args.itemId].state = args.state;
		applyAttributeChanges();
	}
	
	function applyAttributeChanges() {
		var PRES = Visualisations.current().presentation;
		PRES.update();
		PRES.force.start();
	}
	
	function checkadvevalnode(){
	    var ABSTR = Visualisations.current().abstraction;
	    var PRES = Visualisations.current().presentation;
	
	    var nodevotes = ABSTR.clickednode.adveval.slice();	    
	    nodevotes.sort(function(a,b){return b-a});
	    if (nodevotes[0]-nodevotes[1]>=3){
		var newtype=$.inArray(nodevotes[0], ABSTR.clickednode.adveval)+1;
		if (newtype !== ABSTR.clickednode.type){
		    Db.editnode(ABSTR.clickednode.hash, ABSTR.clickednode.content, ABSTR.clickednode.contentsum, newtype);
		    ABSTR.clickednode.type = newtype;
		    PRES.svg.selectAll(".node")
			.style("fill",PRES.liveAttributes.nodeFill);
		    var color = PRES.liveAttributes.nodeFill(ABSTR.clickednode); 
		    explode(ABSTR.clickednode.x, ABSTR.clickednode.y, color)
		    
		    cancellink();
		    PRES.force.start();
		};
	    };
	
	}
	    
	function checkadvevallink(){
	
	    var ABSTR = Visualisations.current().abstraction;
	    var PRES = Visualisations.current().presentation;
	
	    var linkvotes = ABSTR.selectedlink.adveval.slice();	    
	    linkvotes.sort(function(a,b){return b-a});
	    if (linkvotes[0]-linkvotes[1]>=3){
		var newtype=$.inArray(linkvotes[0], ABSTR.selectedlink.adveval)+1;
		if (newtype !== ABSTR.selectedlink.type){
		    Db.editlink(ABSTR.selectedlink.hash, newtype);
		    ABSTR.selectedlink.type = newtype;
	    
		    PRES.svg.selectAll(".link")
			.style("stroke", PRES.liveAttributes.linkStroke);
	       
		    var color = PRES.liveAttributes.linkStroke(ABSTR.selectedlink); 
		    var coordx = (ABSTR.selectedlink.source.x + ABSTR.selectedlink.target.x)/2;
		    var coordy = (ABSTR.selectedlink.source.y + ABSTR.selectedlink.target.y)/2;
		    explode(coordx, coordy, color);
	    
		    PRES.force.start();
		};
	    };
	
	}
	
	return { Scaler: Scaler };
});