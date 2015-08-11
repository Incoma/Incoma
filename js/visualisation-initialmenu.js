//Contains the html code of the initial menu and the visualization for the background graph animation, with the same structure than "visualization-zoomout.js" (although not the last version) (look this for more details)

Visualisations.register(new InitialMenu()); //adds the InitialMenu visualization to the Visualizations array

//stablishes the name and defines the Abstraction and Presentation modules of the visualization
function InitialMenu() {

    this.name = "Initial Menu",
    this.abstraction = new InitialMenu_Abstraction();
    this.presentation = new InitialMenu_Presentation(this, this.abstraction);

    this.init = function (html5node, model) {
        this.abstraction.init(model);
        this.presentation.init(html5node);
    }

    this.destroy = function () {}

}

//defines arrays and parameters needed for the Abstraction module
function InitialMenu_Abstraction() {

    this.model = null;

	
    this.linkFilters = {
		1: {name: tx_general,state: true, typeId: 1},
		2: {name: tx_agreement, state: true, typeId: 2},
		3: {name: tx_disagreement, state: true, typeId: 3},
		4: {name: tx_consequence, state: true, typeId: 4},		
		5: {name: tx_alternative, state: true, typeId: 5},
		6: {name: tx_equivalence, state: true, typeId: 6},
    };
	
    this.nodeFilters = {
		1: {name: tx_general, state: true, typeId: 1},
        2: {name: tx_question, state: true, typeId: 2},
        3: {name: tx_proposal, state: true, typeId: 3},
        4: {name: tx_info, state: true, typeId: 4},
    };


	
    this.sizeFilters = {
	nodes: {name: "Boxes", state: true},
        links: {name: "Threads", state: true},
    };

    this.init = function (model) {
        this.model = model;
    };
};


//defines the parameters and elements of the Presentation module
function InitialMenu_Presentation(VIS, ABSTR) {

    this.container = null;
    this.nodeSizeDefault = 12;
    this.width = $(window).width();
    this.height = $(window).height();
    this.bordercolor = {
        "normal": "rgba(0,0,0,0)",
        "clicked": "#000",
        "linkclicked": "#000",
        "over": "#c33",
		"origin": "#360"
    };

    this.svg = null;
                                               
    this.color = ["#000000", "#7f7f7f", "#339e94", "#2ca02c", "#d62728", "#1f77b4", "#5e3a1a", "#ec9242", "#9261c3"];
                                                    
    this.liveAttributes = new LiveAttributes(ABSTR, this);
	
    this.update = function () {
        this.definedBelow();
    }
	
    this.init = function (html5node) {
        this.definedBelow();
    }

	//defines the html content of the visualization (except the header, defined in index)
    this.init = function (html5node) {
        this.scaler = new Scaler(this);
        this.container = html5node;


        html5node.innerHTML =
          '   \
		  <div class="svg_and_right_bar" >   \
		  \
			  <div id="svg" style="Float:left">   \
				<div class="svg"></div>   \
			  </div>   \
	\
			  <div id="big_background" class="noselect">   \
				  <div id="menu_panel" class="huge_panel_1 noselect">  \
					<center>  \
						<div class="big_panel noselect">  \
						  <center>  \
							<div class="big_button" onclick="bt_sandbox()">'+tx_sandbox+'</div>   \
							<div class="big_label noselect">'+tx_learn+'</div>   \
						   </center>   \
						 </div>   \
						<div class="big_panel noselect">    \
						  <center>  \
							<div class="big_button" onclick="bt_create()">'+tx_create+'</div>   \
							<div class="big_label noselect">'+tx_start+'</div>   \
						  </center>   \
						</div>   \
						<div class="big_panel noselect">    \
						  <center>  \
							<div class="big_button" onclick="bt_join()">'+tx_participate+'</div>   \
							<div class="big_label noselect">'+tx_join+'</div>   \
						  </center>   \
						</div>   \
					 </center>   \
				  </div>  \
					\
					  <div id="join_panel" class="huge_panel_2 noselect">   \
						<center>  \
						<table style="border-spacing: 20px 0;"><tr>  \
						<td>  \
						'+tx_order_by+'&nbsp;<select id="orderselect" style="display:inline"></select>  \
						</td>  \
						<td>  \
						'+tx_filter_lang+' <select id="languagefilter" style="display:inline"></select> \
						</td>  \
						</tr></table>  \
						</center>  \
						</center>  \
						<div class="conv_select_panel noselect">  \
						  <select id="selectconversation"></select>  \
						</div>  \
						<div class="bt_panel2 noselect">  \
							<center>  \
								<div id="bt_join_ok" onclick="bt_join_ok()" class="conv_ok button">'+tx_ok+'</div>  \
								<div id="bt_join_cancel" onclick="bt_cancel()" class="conv_cancel button">'+tx_cancel+'</div>  \
							</center>  \
						</div>  \
					  </div>   \
					  \
					  <div id="new_panel" class="huge_panel_3 noselect">   \
						<div class="new_header noselect">'+tx_introduce_title+'</div>  \
						<textarea id="new_title" class="new_title" spellcheck="false" maxlength="60"></textarea> \
						<center><div id="titlealert" class="alerttext noselect">&nbsp</div><div id="firstthoughtalert" class="alerttext noselect">&nbsp</div><center>  \
						<div class="new_header noselect">'+tx_write_first_thought+'</div>  \
						<textarea id="new_firstcomment" class="new_first" spellcheck="false" maxlength="5000"></textarea> \
						<br>'+tx_summary_thought+':<textarea id="new_firstsum" class="areareplysum" spellcheck="false" maxlength="100"></textarea>  \
						<div style="display:block;padding:0px">  \
							<div style="Float:left;">  \
								<div class="new_name_header noselect">'+tx_your_name+'&nbsp;</div>  \
								<textarea id="new_name" class="new_name" spellcheck="false" maxlength="20"></textarea> \
							</div>  \
							<div class="new_selectlanguage">  \
								'+tx_select_language+':  \
								<br><select id="selectlanguage" style="display:inline;"></select>  \
							</div>  \
						</div>  \
						<div class="radiosel">  \
							<input type="radio" name="typeconv" value="Private" checked>'+tx_private+'<br>  \
							<input type="radio" name="typeconv" value="Public">'+tx_public+'<br> \
						</div>  \
                        <div class="bt_panel noselect">  \
                            <center>  \
                                <div id="bt_new_vok" onclick="bt_new_ok()" class="conv_ok button">'+tx_ok+'</div>  \
                                <div id="bt_new_cancel" onclick="bt_cancel()" class="conv_cancel button">'+tx_cancel+'</div>  \
                            </center>  \
                        </div>  \
					  </div>   \
			  </div>   \
			  <div id="language_panel" class="language_panel shadow noselect">   \
				'+tx_no_more_lang+'<br><br>'+tx_help_translate1+' <br>'+tx_help_translate2+'  \
				<a href="http://titanpad.com/incomatranslation" target="_blank">titanpad.com/incomatranslation</a>  \
				<div id="language_button" class="language_button button">'+tx_ok+'</div>  \
			  </div>   \
              <div id="editable_panel" class="noselect">'+tx_if_editable+'<br></br>'+tx_want_editable+'<br></br>  \
                <div id="btn_editable_yes" onclick="btn_editable_yes()" class="btn_editable button">'+tx_yes+'</div> \
                <div id="btn_editable_no" onclick="btn_editable_no()" class="btn_editable button">'+tx_no+'</div>  \
            </div>  \
		 </div>  \
			 ' 
			 
		$('input').ezMark();	
		
		//hides some elements of the header
	 	document.getElementById("headerMenu").setAttribute("style","visibility:hidden;");
		document.getElementById("headerExport").setAttribute("style","visibility:hidden;"); 

		$('#big_background').fadeOut(0);
		$('#language_panel').fadeOut(0);
        $('#editable_panel').fadeOut(0);
		$('#big_background').fadeIn(1200);

		$( "#language_button" )[0].onclick = closelanguagepanel;


        initSVG(this, ABSTR, this.width, this.height);
		
		//updates and loads the list of conversations	
		db_update_public_conv();
		db_getconversations();
		conversationlist = completeconversationlist;
		
		//prepares the different select controls
		convlistorder=1; //default value: order conversations by last activity
		prepareorderselect();
		preparelangselect();
		preparelangfilter();
		prepareconvlistselect();
    };
	

	//initialization and definition of the SVG and its elements (the graph with nodes, links, prelink line, the force)
    function initSVG(PRES, ABSTR, width, height) {

        PRES.force = d3.layout.force()
            .charge(-600)
			.gravity(0.1)
            .linkDistance(40)
			.theta(0.8)
            .size([width, height]);
        var force = PRES.force;

        PRES.svg = d3.select(".svg").append("svg")
            .attr("width", width)
            .attr("height", height);
		
		var svg = PRES.svg;
		
		
		PRES.background = svg.append('svg:rect')
			.attr('width', width*11)
			.attr('height', height*11)
			.attr("x",-5*height)
			.attr("y",-5*height)
			.attr('fill', "white")
			.style("stroke-width", "15px")
            .style("stroke", "blue")
			.style("stroke-opacity",0);


        var graph = Model.model;

        force
            .nodes(graph.nodes)
            .links(graph.links)
            .start();
		
        PRES.links = svg.selectAll(".link")
            .data(graph.links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke", PRES.liveAttributes.linkStroke)
            .style("stroke-width", PRES.liveAttributes.linkStrokeWidth)

		PRES.nodes = svg.selectAll(".node")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", PRES.liveAttributes.nodeWidth)
            .style("fill", PRES.liveAttributes.nodeFill)
            .call(force.drag);
			
		PRES.nodes
			.style("fill-opacity",0)
			.style("stroke-opacity",0)
			.transition().delay(2000).duration(1500)
			.style("fill-opacity",1)
			.style("stroke-opacity",1);
			
		PRES.links
			.style("stroke-opacity",0)
			.transition().delay(2000).duration(2000)
			.style("stroke-opacity",1);	
			
		//call to force.resume() each 3 seconds to animate the graph
		pulses = setInterval(function(){force.resume();},3000); 
		
		
        force.on("tick", function () {
		
            PRES.svg.selectAll(".link")
				.attr("x1", function (d) {return d.source.x;})
                .attr("y1", function (d) {return d.source.y;})
                .attr("x2", function (d) {return d.target.x;})
                .attr("y2", function (d) {return d.target.y;});

            PRES.svg.selectAll(".node")
				.attr("cx", function (d) {return d.x;})
                .attr("cy", function (d) {return d.y;});
        });

    };
	
    
	//the attributes for the nodes and links
    function LiveAttributes(ABSTR, PRES) {

        this.nodeFill = function (d) {
            return PRES.color[d.type];
        };

        this.nodeHeight = function (d) {
            if (ABSTR.sizeFilters.nodes.state && (d.evalpos-d.evalneg> 0)) {
                return PRES.nodeSizeDefault * Math.sqrt(Math.sqrt(1+d.evalpos-d.evalneg));
            } else {
                return PRES.nodeSizeDefault;
            }
        };

        this.nodeWidth = function (d) {
            if (ABSTR.sizeFilters.nodes.state && (d.evalpos-d.evalneg> 0)) {
                return PRES.nodeSizeDefault *Math.sqrt(Math.sqrt(1+d.evalpos-d.evalneg));
            } else {
                return PRES.nodeSizeDefault;
            }
        };

        this.nodeStrokeWidth = function (d) {
            if (ABSTR.nodeFilters[d.type].state) {
                return "2px";
            } else {
                return "0px";
            }
        };
		
		this.nodeFillOpacity = function (d) {
            if (ABSTR.nodeFilters[d.type].state) {
                return "1";
            } else {
				return "0";
            }
        };
		
		this.nodeStrokeOpacity = function (d) {
            if (ABSTR.nodeFilters[d.type].state) {
                return "1";
            } else {
				return "0";
            }
        };

        this.linkStroke = function (d) {
            return PRES.color[d.type];
        };

        this.linkStrokeWidth = function (d) {
            if (ABSTR.linkFilters[d.type].state) {
                if (ABSTR.sizeFilters.links.state && d.evalpos > d.evalneg)
                    return 3*Math.sqrt(1 + d.evalpos-d.evalneg);
                else
                    return 3;
            } else {
                return 0;
            }
        };

		this.linkStrokeOpacity = function (d) {
            if (ABSTR.linkFilters[d.type].state) {
                return "1";
            } else {
				return "0";
            }
        };
	
	};

};

function closelanguagepanel(){
	$('#language_panel').fadeOut(300);
}	

function bt_menu(){

	$( "#window_title" ).html("INCOMA");
	clearTimeout(autoupdate);
    Model.clear(IncomaMenuModel);
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


//Functions for the different buttons of the initial menu

//shows the 'create new conversation' panel
function bt_create(){
	
	$('#menu_panel').animate({left: "-100%"},700,'easeInOutCubic');
	$('#join_panel').animate({left: "130%"},700,'easeInOutCubic');
	$('#new_panel').animate({left: "35%"},700, 'easeInOutCubic');

	document.getElementById("new_title").focus();
	conversation="";	

}

//shows the 'join conversation' panel
function bt_join(){
	
	$('#menu_panel').animate({left: "-100%"},700,'easeInOutCubic');
	$('#join_panel').animate({left: "30%"},700,'easeInOutCubic');
	$('#new_panel').animate({left: "135%"},700, 'easeInOutCubic');
	
	conversation="";	

}

//returns to the initial screen
function bt_cancel(){

	$('#menu_panel').animate({left: "0%"},700,'easeInOutCubic');
	$('#join_panel').animate({left: "130%"},700,'easeInOutCubic');
	$('#new_panel').animate({left: "135%"},700, 'easeInOutCubic');
	
}


//loads the sandbox model and the zoom-out visualization
function bt_sandbox(){
	
	$('#menu_panel').animate({left: "100%"},700,'easeInOutCubic');
	loadsandbox();
	
}


//loads an existing conversation
function bt_join_ok(){

	if (conversation == ""){return;}
	
	$('#join_panel').animate({left: "-70%"},700,'easeInOutCubic');
    $('#svg').fadeOut(500);
	//$('#svg').fadeOut(700);
	//setTimeout(function(){window.location.href = "?c=" + conversation;},700);
    setTimeout(function(){ db_reloadconversation(); }, 730);
    

}


//creates a new conversation
function bt_new_ok(){

    title = document.getElementById("new_title").value;
    content = document.getElementById("new_firstcomment").value;
    var contentsum = document.getElementById("new_firstsum").value;


	if (title==""){
		var alert = document.getElementById("titlealert");
		alert.innerHTML = tx_write_title;
		setTimeout(function(){alert.innerHTML = "&nbsp";},2000);
		$('#new_title').effect('highlight',2000);
		return;
	}
	
	if (content==""){
		var alert = document.getElementById("firstthoughtalert");
		alert.innerHTML = tx_write_something;
		setTimeout(function(){alert.innerHTML = "&nbsp";},2000);
		$('#new_firstcomment').effect('highlight',2000);
		return;
	}

	author = document.getElementById("new_name").value.replace(/[\W]/g,'');
	if (author == ""){
		//var alert = document.getElementById("namealert");
		//alert.innerHTML = tx_write_your_name;
		//setTimeout(function(){alert.innerHTML = "&nbsp";},2000);
		$('#new_name').effect('highlight',2000);
		return;
	};
	
	time = Math.floor((new Date()).getTime() / 1000);
	
	var radios = document.getElementsByName('typeconv');
	ispublic = 0;
	if (radios[1].checked) {
		ispublic = 1;
	}


	Model.clear(IncomaEmptyModel);	
	Model.createNode(1, content, contentsum, author, 2, time); //creates the initial node, type="general", seed=2
	Model.title = title;
	
	
	//creates a hash conversation checking that a similar one doesn't exist already
	var stringforhash = title + content + contentsum + author + time;
	conversation = createconvhash(stringforhash);

	//creates the tables for the new conversation and stores the first node	
    
    $('#new_panel').animate({left: "-65%"},700,'easeInOutCubic');
    
    
    if (ispublic == 0) {
        setTimeout(function(){ $("#editable_panel").fadeIn(300) }, 400);
        return;
    }
    
    $('#svg').fadeOut(500);
	db_createconversation(conversation,title,time,ispublic, convlanguage, false);
	
	
	
}

function btn_editable_yes(){
    $("#svg").fadeOut(300);
    $("#editable_panel").fadeOut(300);
    db_createconversation(conversation,title,time,ispublic, convlanguage, 1);
}

function btn_editable_no(){
    $("#svg").fadeOut(300);
    $("#editable_panel").fadeOut(300);
    db_createconversation(conversation,title,time,ispublic, convlanguage, 0);
}

//

function prepareconvlistselect(){
	
	//obtains the width of join_panel (where the 'join' menu elements are) to adapt the width of the ddslickconvs select control
	element = document.getElementById('join_panel');
	style = window.getComputedStyle(element);
	panelwidth = parseInt(style.getPropertyValue('width'))*.99;
	
	//adds the information to the elements of the ddslickconvs selector
	var ddData = [];
	
	for (var i=0;i<conversationlist.length;i++){
		ddData.push({
			text: conversationlist[i].title,
			value: i,
			selected:false,
			description: conversationlist[i].thoughtnum + " "+tx_thoughts+"&nbsp&nbsp&nbsp " + tx_created + ": " + timeAgo(conversationlist[i].creationtime) + "&nbsp&nbsp&nbsp" + tx_activity +": " + timeAgo(conversationlist[i].lasttime) + "&nbsp&nbsp&nbsp " + tx_language + ": " + conversationlist[i].language, 
		});
	}

	//reinitiates and defines the properties and the onSelected actions of the ddslickconvs selector
	$('#selectconversation').ddCslick('destroy');

	//heightdd=searchCssProp('.conv_select_ddcslick','height');
	var ratio = ($(window).height() < 486) ? 0.40 : 0.55;
	var heightdd = $("#join_panel").height()*ratio;
	
	$('#selectconversation').ddCslick({
		data: ddData,
		selectText: tx_select_conv,
		width: panelwidth,
		height:heightdd,
		background: "#fff",
		onSelected: function(selectedData){
			conversation = conversationlist[selectedData.selectedIndex].hash;
		}
	});
	
	$('#selectconversation').ddCslick('open');
}


function orderconversationlist(){
	
	switch (convlistorder){
		
	case 1: //by last activity		
		conversationlist.sort(function(a,b){
			return b.lasttime - a.lasttime;
		});
		break

	case 2: //by creation time	
		conversationlist.sort(function(a,b){
			return b.creationtime - a.creationtime;
		});
		break

	case 3: //by number of thoughts	
		conversationlist.sort(function(a,b){
			return b.thoughtnum - a.thoughtnum;
		});
		break		

	case 4: //by title		
		conversationlist.sort(function(a,b){
			return (a.title).localeCompare(b.title);
		});
		break
		
	case 5: //by language		
		conversationlist.sort(function(a,b){
			return a.language === null ? 1 : b.language === null ? -1 : (a.language).localeCompare(b.language); //@@change for this line for the next one
			//return (a.language).localeCompare(b.language);
		});
		break
	}
	
	prepareconvlistselect();
		
}



function preparelangselect(){
	
	//@@language dependent (?)
	//the languages that will be shown at the top of the list
	var ddData = [
		{text: "------------------", value: 0, selected: false}, 
		{text: "English", value: 1, selected: true}, 
		{text: "Spanish", value: 2, selected: false},
		{text: "------------------", value: 3, selected: false}
	];
	
	//@@language dependent (?)
	convlangindex = 1;
	
	var j= ddData.length+1;
	
	for (i in languageslist){	
		ddData.push({text: languageslist[i].name, value: j, selected: false});
		j++;
	}
	

	$('#selectlanguage').ddTslick({
		data: ddData,
		selectText: tx_select_language + "...",
		width: 140,
		height:150,
		background: "#fff",
		onSelected: function(selectedData){
		
			var oldconvlangindex = convlangindex;
			
			convlangindex = selectedData.selectedIndex;
			convlanguage = ddData[selectedData.selectedIndex].text;
			
			if (convlanguage == "------------------"){
				$('#selectlanguage').ddTslick('select', {index: oldconvlangindex});
			}
			
		}
	});

}

function preparelangfilter(){
	
	//@@language dependent (?)
	var ddData = [
		{text: "------------------", value: 0, selected: false},
		{text: "("+tx_all_lang+")", value: 1, selected: false},
		{text: "English", value: 2, selected: true}, 
		{text: "Spanish", value: 3, selected: false},
		{text: "------------------", value: 4, selected: false}		
	]
	
	//@@language dependent (?)
	langfilterindex = 2;
	
	var j=ddData.length;
	
	for (i in languageslist){
		ddData.push({text: languageslist[i].name, value: j, selected: false});
		j++;
	}


	$('#languagefilter').ddTslick({
		data: ddData,
		selectText: tx_select_language + "...",
		width: 140,
		height:250,
		background: "#fff",
		onSelected: function(selectedData){
		
			var oldlangfilterindex = langfilterindex;
			
			langfilterindex = selectedData.selectedIndex;
			langfilter = ddData[selectedData.selectedIndex].text;
						
			if (langfilter == "------------------"){
				$('#languagefilter').ddTslick('select', {index: oldlangfilterindex});
			} else {
				filterbylanguage();
			}
			
		}
	});

}

function prepareorderselect(){

	var ddData = [
		{
			text: tx_activity,
			value: 1,
			selected: true,
		},
		{
			text: tx_creation,
			value: 2,
			selected: false,
		},
		{
			text: tx_number_thoughts,
			value: 3,
			selected: false,
		},
		{
			text: tx_title,
			value: 4,
			selected: false,
		},
		{
			text: tx_language,
			value: 5,
			selected: false,
		}
	];
	
	
	$('#orderselect').ddTslick({
		data: ddData,
		selectText: tx_select_order,
		width: 140,
		height:25*5,
		background: "#fff",
		onSelected: function(selectedData){
			convlistorder = ddData[selectedData.selectedIndex].value;
			orderconversationlist();
		}
	});
	
}


function filterbylanguage(){
	
    var ccl = completeconversationlist;
	var cl = [];
	
	for (var i=0;i<ccl.length;i++){
		if (ccl[i].language == langfilter){
			cl.push(ccl[i]);
		}
	}
	
	conversationlist = cl;
	
	if (langfilter=="("+tx_all_lang+")"){
		conversationlist = ccl;
	}
	
	orderconversationlist();
	prepareconvlistselect();

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

