//definition of the html code of the right panel bar for different situations:
// Reply and Connect buttons
// Eval buttons
// Eval buttons with a message
// Reply button clicked
// Connect button clicked
// No buttons

var rightpanelhtmlreplyandlink = "<div id='showreply' class='showreplypanel button' onClick='showreplypanel()'>Reply</div><div id='showconnect' class='showconnectpanel button' onClick='showcreatelink()'>Connect</div>";


var rightpanelhtmleval = "<div style='float:right;'><div style='float:right;'><div id='nodepos' class='evalpos' onClick='evalpos()'>+</div><div id='nodeneg' class='evalneg' onClick='evalneg()'>-</div></div><br><div id='evalalert' class='linkalerttext noselect' style='float:right;'></div></div>";


var rightpanelhtmllinkeval = "<div style='float:right;'><div id='evalalert' class='alerttext noselect'></div><div id='linkpos' class='evalpos' onClick='linkevalpos()'>+</div><div id='linkneg' class='evalneg' onClick='linkevalneg()'>-</div></div>";

var rightpanelhtmlreply = "<table><tr><td id='tdnodetype'>Type of reply:&nbsp<select id='replynodetype'></select></td><td>&nbsp&nbsp&nbsp&nbsp</td><td id='tdlinktype'>Type of connection:&nbsp<select id=\"replylinktype\" style='display:inline-block;'></select></td></tr></table><textarea id='replybox' class='areareply' spellcheck='false' maxlength='5000'></textarea>Summary of your reply (optional):<textarea id='replyboxsum' class='areareplysum' spellcheck='false' maxlength='100'></textarea>Name:&nbsp<textarea id='namebox2' class='areaname' spellcheck='false' maxlength='20'></textarea>&nbsp&nbsp&nbsp&nbsp<div class='replysavecancel'><center><div class='save button' onClick='savenode()'>Save</div><div class='cancel button' onClick='hidereplypanel()'>Cancel</div></center><div id='replyalert' class='alerttext noselect' style='text-align:right;'>&nbsp</div></div>";

var rightpanelhtmllink = "<table><tr><td id='tdconnect'><select id='connectlinktype'></select></td><td><p>&nbsp&nbsp</p></td><td><div class='cancel button' onClick='cancellink()'>Cancel</div></td></tr></table><br><div id='connecttext' class='connecttext'>&nbsp</div>";

var rightpanelhtmlspace = "<div style='float:left;visibility:hidden;'><div style='float:right;'><div id='nodepos' class='evalpos'>+</div></div><br></div>"; 

var rightbarhtml = '<center><div id="changevisualization" class="changevisualization justbutton" onclick="changevisualization();">Show timeline</div></center><div id="right_bar_header" class="right_bar_header "><div id="contentlabel" class="right_bar_title" ondblclick="rbexpand()">&nbsp</div></div><div id="contbox" class="divareacontent"></div><div id="rightpaneleval"></div><div id="rightpanel"></div><div id="rightpanelspace"></div>';

var timevisrightbarhtml = '<center><div id="changevisualization" class="changevisualization justbutton" onclick="changevisualization();">Hide timeline</div></center><div id="timevisdiv" class="timevisdiv"></div>';

var timevisrightbarhtml = '<center><div id="changevisualization" class="changevisualization justbutton" onclick="changevisualization();">Hide timeline</div></center><div id="timevisdiv" class="timevisdiv"></div>';

var timevisinteracthtml = "<div id='evalalert' class='linkalerttext noselect' style='float:left;'></div><div style='float:right;'><div id='showreply' class='smallshowreplypanel justbutton' onClick='showreplypanel()'>Reply</div><div id='showconnect' class='smallshowconnectpanel justbutton' onClick='showcreatelink()'>Connect</div><div id='nodepos' class='smallevalpos justbutton' onClick='evalpos()'>+</div><div id='nodeneg' class='smallevalneg justbutton' onClick='evalneg()'>-</div></div>";
  
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
    }

    this.destroy = function () {}

}

//*****************************************************************************************************************************
// Start of this == abstraction = model and state of filters [abstraction initialized passing to it a (model)]
function ZoomOut_Abstraction() {

    this.model = null;
	
    this.linkFilters = {
		1: {name: "General",state: true, typeId: 1},
		2: {name: "Agreement", state: true, typeId: 2},
		3: {name: "Disagreement", state: true, typeId: 3},
		4: {name: "Consequence", state: true, typeId: 4},		
		5: {name: "Alternative", state: true, typeId: 5},
		6: {name: "Equivalence", state: true, typeId: 6},
    };
	
    this.nodeFilters = {
		1: {name: "General", state: true, typeId: 1},
        2: {name: "Question", state: true, typeId: 2},
        3: {name: "Proposal", state: true, typeId: 3},
        4: {name: "Info", state: true, typeId: 4},
    };
	
    this.sizeFilters = {
		evaluations: {name: "Evaluations", state: true},
    };
	
	
    this.init = function (model) {
        this.model = model;
		this.clickednode = "";
        this.clickednodehash = "";
		this.overnodehash = "";
        this.clickedlinkhash = "";
		this.selectedlink = "";
        this.creatinglink = false;
		this.replying = false;
		this.overnode = false;
		this.overlink = false;
		this.overseed = false;
		this.letmouseover = false;
		this.tutorialopened=false;
		this.showingevolution=false;
		this.evolutionpause=false;
		this.timevisualization=false;
		this.youarenotalone=false;
		this.firsttick=true;
    }
};
// End of this == abstraction

//*****************************************************************************************************************************
// Start of this == presentation [initialized passing it (html5node, abstraction)]
function ZoomOut_Presentation(VIS, ABSTR) {
    // public interface
	
    this.container = null;
    this.nodeSizeDefault = 15;
    this.linkStrokeWidthDefault = 4;
    this.seedSizeDefault = 1;
    this.linkOpacityDefault = 1;
    this.nodeOpacityDefault = 1;
    this.updateinterval = 60000;
    this.width = $(window).width();
    this.height = $(window).height()-50;
    this.filtershelp = true;
    this.darkerarrowsseeds = 2;
    this.darkernodes = 0.3;
	this.showfilters = true;
	this.evolutionvelocity = 1;
	this.readnodes = [];
	this.drawexplosions = true;
	this.showingtexts = false;
	this.showingsums = false;
	this.savelinks = "";

	
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

		db_gettitle();
		db_gettags();
	
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
						<center><div class="zoombutton justbutton shadow" id="cmd_zoomout" style="float:left;">-</div>   \
						zoom \
						<div class="zoombutton justbutton shadow" id="cmd_zoomin" style="float:right;">+</div></center>   \
                    </div>   \
				  </div>   \
	\
				  <div>  \
				    <div id="showevolution" class="showevolution shadow noselect">Show evolution</div>  \
					<div id="controlevolution" class="controlevolution shadow noselect">  \
						<div id="evolutionslow" class="evolutioncontrols">≪</div>  \
						<div id="evolutionpause" class="evolutioncontrols">ll</div>  \
						<div id="evolutionfast" class="evolutioncontrols">≫</div>  \
						<div id="evolvelocity" class="evolutionvelocity">&nbsp</div>  \
						<div id="evolutionclose" class="evolutionclose noselect">x</div>  \
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
	 			  <div id="language_panel" class="language_panel shadow ">   \
					At the moment there are no more languages available.<br><br>If you want to help with the translation to another language, <br>you can do it entering here:  \
					<a href="http://titanpad.com/incomatranslation" target="_blank">titanpad.com/incomatranslation</a>  \
					<div id="language_button" class="language_button button">OK</div>  \
                  </div>   \
	\
                  <div id="right_bar" class="right_bar shadow">   \
					<center>  \
					  <div id="changevisualization" class="changevisualization justbutton" onclick="changevisualization();">  \
						Show timeline  \
					  </div>  \
					</center>  \
                    <div id="right_bar_header" class="right_bar_header ">   \
                      <div id="contentlabel" class="right_bar_title" ondblclick="rbexpand()">&nbsp</div>   \
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
                  <div class="lower_bar_elems">   \
                    <div id="filters_title" class="lower_title" style="Float:left" >   \
                      <b>Legend</b> \
                    </div>   \
                    <center><div id="filters_text" class="lower_text">  \
					  (Click on any element for hiding or showing it in the conversation) \
					</div></center>   \
                    <div id="filt_nodes" class="lower_nodes" style="Float:left;" >   \
                      <u><b>Thoughts</b></u>             \
                    </div>   \
   \
                    <div id="filt_links" class="lower_links" style="Float:left; ">   \
                      <u><b>Connections</b></u>    \
                    </div>   \
   \
                    <div id="filt_sizes" class="lower_sizes" style="Float:left;">   \
                      <u><b>Sizes</b></u>    \
                    </div>   \
                    <div id="showtexts" class="lower_showtexts noselect">   \
                      Show tags    \
                    </div>   \
                    <div id="showsums" class="lower_showsums">   \
                      Show summaries    \
                    </div>   \
                    <div id="filt_hide" class="lower_hide" style="Float:right">   \
                      <div class="lower_hide_button button" id="cmd_hideshowfilters">Hide</div>   \
                    </div>   \
                 </div>   \
    \
             </div>   \
        '; // end of innerHTML


		$('#rightpanelspace').html(rightpanelhtmlspace);

		
		//stablish the onclick functions for the html elements of html5node
		$( "#cmd_zoomin" )[0].onclick = this.scaler.zoomin;
        $( "#cmd_zoomout" )[0].onclick = this.scaler.zoomout;
        $( "#cmd_hideshowfilters" )[0].onclick = hideshowfilters;
        $( "#filters_title" )[0].onclick = hideshowfilters;
		$( "#tutorial_panel" )[0].onclick = changetutorialpanel;
		$( "#tutorial_panel_close" )[0].onclick = closetutorialpanel;
		$( "#language_button" )[0].onclick = closelanguagepanel;
		$( "#showevolution" )[0].onclick = showevolution;
		$( "#evolutionclose" )[0].onclick = showevolution;
		$( "#evolutionpause" )[0].onclick = evolutionpause;
		$( "#evolutionfast" )[0].onclick = evolutionfast;
		$( "#evolutionslow" )[0].onclick = evolutionslow;
	    $( "#showsums" )[0].onclick = showsums;
		
		$( "#conversation_title" ).html(Model.title);		
		$( "#window_title" ).html("INCOMA ("+Model.title+")");

		//makes visible some elements of the header
	 	document.getElementById("headerMenu").setAttribute("style","visibility:visible;");
		document.getElementById("headerExport").setAttribute("style","visibility:visible;");
		document.getElementById("headerUsername").setAttribute("style","visibility:visible;"); 
		
		//fadein animation
		$("#htmlcontent").fadeOut(0);
		$("#lower_bar").fadeOut(0);
		$("#legend_bar").fadeOut(0);
		$('#tutorial_panel').fadeOut(0);
		$('#language_panel').fadeOut(0);
		$('#controlevolution').fadeOut(0);
		$('#htmlcontent').fadeIn(800);
		$('#lower_bar').fadeIn(800);
		$('#svg').fadeOut(0);
		
		
		if (Model.tags == null){
			document.getElementById("showtexts").setAttribute("style","visibility:hidden; cursor:default;");
		} else {
			$( "#showtexts" )[0].onclick = showtexts;
		}
		
		//makes the right_bar resizable
		$(".right_bar").resizable({
			handles: 'w',
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

        document.getElementById("headerNamebox").value = Model.currentAuthor();
		
	//Create the svg
        initSVG(this, ABSTR, this.width, this.height);
	//Create the legend
        initNodeLegend(this, "legend_nodes", ABSTR.nodeFilters);
        initLinkLegend(this, "legend_links", ABSTR.linkFilters);
	//Create the filters
        initNodeFilters(this, "filt_nodes", ABSTR.nodeFilters);
        initLinkFilters(this, "filt_links", ABSTR.linkFilters);
        initSizeFilters(this, "filt_sizes", ABSTR.sizeFilters);

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
            .enter().append("polyline")
            .attr("class", "link")
			.attr("marker-mid", PRES.liveAttributes.linkArrow)
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
				.attr("refX", 3.1) 
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
				.attr("refX", 1) 
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
		var delay=1000*Math.sqrt(numnodes);
				
		//in the middle of the loading, gives a random shift to the nodes positions and changes the charge to its correct value 
		// setTimeout(function(){
			// Model.model.nodes.forEach(function(d, i) {		
				// d.x += 20*Math.random(); 
				// d.y += 20*Math.random(); 
			// });

			// PRES.force
				// .charge(-500)
				// .start();
		// },delay*0.7);
		
		//end of the loading, nodes become draggables
		setTimeout(function(){
			ABSTR.letmouseover = true;
			
			PRES.nodes
				.call(force.drag);
		},delay+750);

		//fadeIn animation of all the svg elements
		PRES.nodes
			.style("fill-opacity",0)
			.style("stroke-opacity",0)
			.transition().delay(delay).duration(700)
			.style("fill-opacity",1 )
			.style("stroke-opacity",1);	
			
		PRES.links
			.style("stroke-opacity",0)
			.transition().delay(delay).duration(900)
			.style("stroke-opacity",1);

		svg.selectAll(".seed")
			.style("fill-opacity",0)
			.style("stroke-opacity",0)
			.transition().delay(delay).duration(700)
			.style("fill-opacity",1 )
			.style("stroke-opacity",1);				
			
		svg.selectAll(".arrowmarker")
			.style("fill-opacity",0)
			.style("stroke-opacity",0)
			.transition().delay(delay).duration(900)
			.style("fill-opacity",1 )
			.style("stroke-opacity",1);		
			
			
		//activation of the periodic conversation update with the nodes and links created by other users simultaneously
		autoupdate = setInterval(function(){updateConversation();},PRES.updateinterval); 
		
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
		startevolution();		
		
		
		//defines the movement of the nodes and links
        force.on("tick", function () {
				
			PRES.svg.selectAll(".link")
			.attr("points", function(d) {
			return d.source.x + "," + d.source.y + " " +
			(d.source.x + d.target.x)/2 + "," + (d.source.y + d.target.y)/2 + " " +
			d.target.x + "," + d.target.y; });

            PRES.svg.selectAll(".node")
				.attr("cx", function (d) {return d.x;})
                .attr("cy", function (d) {return d.y;});
				
			PRES.svg.selectAll(".seed")
				.attr("cx", function (d) {return d.homenode.x;})
                .attr("cy", function (d) {return d.homenode.y;});
				
			PRES.svg.selectAll("text")
				.attr("x", function (d) {return d.node.x;})
                .attr("y", function (d) {return (parseInt(d.node.y)-parseInt(PRES.liveAttributes.nodeRadius(d.node)))-1;});
							
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

	
    // Start of initLinkFilters = create the html from the filters, appending it (appendChild) to the right div tags
    function initNodeFilters(PRES, columnId, filterlist) {

	// 5 filters with 3 per column for the nodes
        var numfilts = 4;
        var filtspercol = 2 ;
        var filtsperrow = Math.ceil(numfilts/filtspercol);

    	var column = document.getElementById(columnId);

	//It creates a table to justify the elements properly
		var table  = document.createElement("table");
		table.style.width = "100%";
		table.setAttribute('border','0');
		table.setAttribute('cellpadding','1');
		table.setAttribute('cellspacing','2');
		
		tb = document.createElement("tbody");

		var boxeslegend = new Array();

        for (var i = 1; i < numfilts+1; ++i) {
			var filter = filterlist[i];
			
			if (i == 1 || i == 1+1*filtsperrow || i == 1+2*filtsperrow) {
				tr = document.createElement("tr");
			}
	
			tdname = document.createElement("td");
			tdname.setAttribute("style","cursor: pointer");
			tdname.id = i;
			
			tdname.onclick = function () {
				
				filterlist[this.id].state = !filterlist[this.id].state; 	

				var textcolor = (filterlist[this.id].state) ? "#000" : "#777";	
				this.setAttribute("style","cursor: pointer; color: " + textcolor);
				
				$("#filters_text").delay(300).fadeOut(600);
				PRES.filtershelp = false;

				PRES.update(); 
				PRES.force.start();
			};
			
			tdimage = document.createElement("td");
            tdimage.setAttribute("style","width: 32px; height: 20px; background:url('img/node" + filter.typeId + ".png') no-repeat;");
 		
			tdspace = document.createElement("td");
			tdspace.style.width = "25px";
			
			if (i == 1*filtsperrow || i == 2*filtsperrow || i == 3*filtsperrow) {
				tdspace.style.width = "5px";
			}
		
			spaces = Visualisations.makeText(" ");
			
			var name = Visualisations.makeText(filter.name)
				
			tdname.appendChild(name);
			tdspace.appendChild(spaces);
						
			tr.appendChild(tdimage);
			tr.appendChild(tdname);
			tr.appendChild(tdspace);
			
			if (i == 1*filtsperrow || i == 2*filtsperrow || i == 3*filtsperrow || i == numfilts) {
				tb.appendChild(tr);
				table.appendChild(tb);
			}
        }
		
	column.appendChild(table);
    };
	
	
	
    function initLinkFilters(PRES, columnId, filterlist) {
	// 9 filters with 3 per column for the links
        var numfilts = 6 ;
        var filtspercol = 2 ;
        var filtsperrow = Math.ceil(numfilts/filtspercol);

    	var column = document.getElementById(columnId);

		var table  = document.createElement("table");
		table.style.width = "100%";
		table.setAttribute('border','0');
		table.setAttribute('cellpadding','1');
		table.setAttribute('cellspacing','2');
		
		tb = document.createElement("tbody");

		var threadslegend = new Array();

        for (var i = 1; i < numfilts+1; ++i) {
            var filter = filterlist[i];
            if (i == 1 || i == 1+1*filtsperrow || i == 1+2*filtsperrow) {
				tr = document.createElement("tr");
			}
			
			tdimage = document.createElement("td");
			tdimage.setAttribute("style","width: 20px; height: 20px; background:url('img/link" + filter.typeId + ".png') no-repeat;");
			
			tdname = document.createElement("td");
			tdname.setAttribute("style","cursor: pointer");
			tdname.id = i;
			
			tdname.onclick = function () {
				
				filterlist[this.id].state = !filterlist[this.id].state; 	

				var textcolor = (filterlist[this.id].state) ? "#000" : "#777";	
				this.setAttribute("style","cursor: pointer; color: " + textcolor);
				
				$("#filters_text").delay(300).fadeOut(600);
				PRES.filtershelp = false;					

				PRES.update(); 
				PRES.force.start();
			};
			
			tdspace = document.createElement("td");
			tdspace.style.width = "25px";
			
			if (i == 1*filtsperrow || i == 2*filtsperrow || i == 3*filtsperrow) {
				tdspace.style.width = "5px";
			}
			
			spaces = Visualisations.makeText(" ");
			
			tdimage.appendChild(spaces);
            tdname.appendChild(Visualisations.makeText(filter.name));
			tdspace.appendChild(spaces);
			
			spaces = Visualisations.makeText(" ");

			tr.appendChild(tdimage);
			tr.appendChild(tdname);
			tr.appendChild(tdspace);
			     
            if (i == 1*filtsperrow || i == 2*filtsperrow || i == 3*filtsperrow || i == numfilts) {
				tb.appendChild(tr);
				table.appendChild(tb);
			}
        }
		column.appendChild(table);
    };
	

	
    function initSizeFilters(PRES, columnId, filterlist) {

    var column = document.getElementById(columnId);

	var table  = document.createElement("table");
	table.style.width = "100%";
	table.setAttribute('border','0');
	table.setAttribute('cellpadding','0');
	table.setAttribute('cellspacing','2');
	tb = document.createElement("tbody");
	
    var filter = filterlist.evaluations;
	
	tr = document.createElement("tr");
	
	tdname = document.createElement("td");
	tdname.setAttribute("style","cursor: pointer");
			
	tdname.onclick = function () {		
		filterlist.evaluations.state = !filterlist.evaluations.state; 	

		var textcolor = (filterlist.evaluations.state) ? "#000" : "#777";	
		this.setAttribute("style","cursor: pointer; color: " + textcolor);
		
		$("#filters_text").delay(300).fadeOut(600);
		PRES.filtershelp = false;				
			
		PRES.update(); 
		PRES.force.start();
	};	
	
	tdname.appendChild(Visualisations.makeText(filter.name));
	tr.appendChild(tdname);
	tb.appendChild(tr);
	
	table.appendChild(tb);
	column.appendChild(table);

    };
	

	
    function initNodeLegend(PRES, columnId, filterlist) {	
    };
	
	

    function initLinkLegend(PRES, columnId, filterlist) {
    };
	
	   
	//functions that define the attributes for nodes and links, depending on the filter states.
    function LiveAttributes(ABSTR, PRES) {

        this.nodeRadius = function (d) {
            if (ABSTR.sizeFilters.evaluations.state) {
				return PRES.renormalizednode(d.evalpos-d.evalneg);
            } else {
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
            if (ABSTR.nodeFilters[d.type].state) {
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
            if (ABSTR.nodeFilters[d.type].state) {
                return PRES.nodeOpacityDefault;
            } else {
				return "0";
            }
        };

		this.textFillOpacity = function (d) {
            if (ABSTR.nodeFilters[d.node.type].state) {
                return "1";
            } else {
				return "0";
            }
        };
		
        this.linkStroke = function (d) {
            return PRES.linkcolor[d.type];
        };
		

        this.seedRadius = function (d) {

		            if (ABSTR.nodeFilters[d.homenode.type].state) {
				return PRES.seedSizeDefault *d.seedtype;
		            } else {
		                return 0;
		            }
        };

        this.seedColor = function (d) {
			return d3.rgb(PRES.nodecolor[d.homenode.type]).darker(PRES.darkerarrowsseeds).toString();
        };
		
		
        this.linkArrow = function (d) {
            if (ABSTR.linkFilters[d.type].state) {
				if ( d.type != 5 && d.type != 6 ) {                
					//  alternative and equivalence have no direction
					if (d.type == 2 && d.direct==1){
						return "";
						// agree and disagree have no direction if it is a connection
					} else if (d.type == 3 && d.direct==1) {
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
            if (ABSTR.linkFilters[d.type].state) {
                if (ABSTR.sizeFilters.evaluations.state){
					return PRES.renormalizedlink(d.evalpos-d.evalneg);
				}else{
                    return PRES.linkStrokeWidthDefault;
				}
            } else {
                return 0;
            }
        };
		
		
		this.linkStrokeDashArray = function (d) {
			if (d.direct==1){
				return "8,6";
			} else {
				return "0,0";
			}
		}
		

		this.linkStrokeOpacity = function (d) {
            if (ABSTR.linkFilters[d.type].state) {
                return PRES.linkOpacityDefault;
            } else {
				return "0";
            }
        };
		
		
        this.relatedNodesOpacity = function (d) {
            if (!ABSTR.linkFilters[d.type].state) {		
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
            if (!ABSTR.linkFilters[d.type].state) {		
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
            if (!ABSTR.nodeFilters[d.type].state) {
			
				PRES.svg.selectAll(".link")
                    .filter(function (e) {return e.source.hash == d.hash;})
                    .style("stroke-opacity", 0);

				PRES.svg.selectAll(".link")
					.filter(function (e) {return e.source.hash == d.hash;})
					.attr("marker-mid", "");

				PRES.svg.selectAll(".link")
					.filter(function (e) {return e.target.hash == d.hash;})
					.style("stroke-opacity", 0);

				PRES.svg.selectAll(".link")
					.filter(function (e) {return e.target.hash == d.hash;})
					.attr("marker-mid", "");

            }
			return PRES.nodecolor[d.type];
        };		

	
	
//functions for user interaction events	

		//if the user is creating a new link, updates the prelink line position and color
        this.mousemove = function (d) {
			if (ABSTR.creatinglink && selectedconnectlinktype != 0){
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
						
			if ((ABSTR.clickednodehash === "" && ABSTR.clickedlinkhash === "") || (ABSTR.creatinglink && (ABSTR.clickednodehash != d.hash || ABSTR.timevisualization))){
								
				ABSTR.overnodehash = d.hash;
				
				PRES.svg.selectAll(".node")
					.transition().delay(100).duration(0)
					.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
					.style("stroke", PRES.liveAttributes.nodeStroke);
				
				
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
						$('#rightpaneleval').html(rightpanelhtmleval);
						$('#rightpanelspace').html("");
						document.getElementById("nodepos").innerHTML = "+" + d.evalpos;
						document.getElementById("nodeneg").innerHTML = ((d.evalneg===0) ? "" : "-") + d.evalneg;	
						
						$("#contbox").stop().slideDown(0);
						document.getElementById("contentlabel").setAttribute ("style", "border: solid 3px " + hex2rgb(PRES.bordercolor.over, 0.6) + "; background: "+  hex2rgb(PRES.nodecolor[ABSTR.nodeFilters[d.type].typeId],0.5) +";");
						document.getElementById("contentlabel").innerHTML = "<b>" + ABSTR.nodeFilters[d.type].name + "</b>" + "&nbsp&nbsp" + " (by " +d.author + " - "+timeAgo(d.time)+")";
						document.getElementById("contbox").innerHTML = URLlinks(nl2br(d.content));
					}
				},150);
			}
        };
		
		
        this.mouseoverseed = function (e) {
			clearTimeout(timedmouseout);
			ABSTR.overseed = true;
        };


        this.mouseoverlink = function (d) {
		
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
					
					$('#rightpaneleval').html(rightpanelhtmllinkeval);
					$('#rightpanelspace').html("");
					document.getElementById("linkpos").innerHTML = "+" + d.evalpos;
					document.getElementById("linkneg").innerHTML = ((d.evalneg===0) ? "" : "-") + d.evalneg;	
					
					document.getElementById("contentlabel").setAttribute ("style", "border: solid 3px " + hex2rgb(PRES.bordercolor.over, 0.6) + "; background: "+  hex2rgb(PRES.linkcolor[ABSTR.linkFilters[d.type].typeId],0.5) +";");
					document.getElementById("contentlabel").innerHTML = "<b>" + ABSTR.linkFilters[d.type].name + " connection" + "</b>" + "&nbsp&nbsp" + " (by " +d.author + " - "+timeAgo(d.time)+")";
					
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
				
					
				if(ABSTR.clickednodehash === "" && ABSTR.clickedlinkhash === ""){

					if (ABSTR.timevisualization){
					
						var index = $.inArray(d, timednodes);
						var id = "nodecontent"+index;
						outdivcontent(id);
						
					} else {
						clearcontentlabel();
					}
				}
				
				if(ABSTR.creatinglink){
				
					timednodecontentlabel = setTimeout(function(){
						
						if (ABSTR.timevisualization){
							var index = $.inArray(d, timednodes);
							var id = "nodecontent"+index;
							outdivcontent(id);
						}
						
						document.getElementById("contentlabel").setAttribute ("style", "border: solid 3px " + hex2rgb(PRES.bordercolor.clicked, 0.7) + "; background: "+  hex2rgb(PRES.nodecolor[ABSTR.nodeFilters[ABSTR.clickednode.type].typeId],0.5) +";");
						document.getElementById("contentlabel").innerHTML = "<b>" + ABSTR.nodeFilters[ABSTR.clickednode.type].name + "</b>" + "&nbsp&nbsp" + " (by " +ABSTR.clickednode.author + " - "+timeAgo(ABSTR.clickednode.time)+")";
						document.getElementById("contbox").innerHTML = URLlinks(nl2br(ABSTR.clickednode.content));
						
						document.getElementById("nodepos").innerHTML = "+" + ABSTR.clickednode.evalpos;
						document.getElementById("nodeneg").innerHTML = ((ABSTR.clickednode.evalneg===0) ? "" : "-") + ABSTR.clickednode.evalneg;	
						
					},0);				
				
				}
				
			},10);
        };
		

        this.mouseoutlink = function (d) {
			
			ABSTR.overlink = false;
			
			clearTimeout(timedlinkcontentlabel);
			
			if (ABSTR.clickedlinkhash === ""){
			
				hidelinkselect();
				
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
					var color = d3.rgb(PRES.nodecolor[timednodes[oldindex].type]).darker(0).toString();
					$("#nodecontent"+oldindex).css({
							"border": "solid 2px "+color,
					});
					
					$("#nodeinteract"+oldindex).height("24px");
					$("#nodeinteract"+oldindex).html("");
					
					oldindex = "";
					
				}else{
				
					clearcontentlabel();
				}
				
				ABSTR.clickednode = "";
				ABSTR.clickednodehash = "";
				ABSTR.clickedlinkhash = "";
				ABSTR.overnodehash = "";
				ABSTR.replying = false;
				
				PRES.svg.selectAll(".node")
					.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
					.style("stroke", PRES.liveAttributes.nodeStroke);
				
				PRES.svg.selectAll(".link")
					.style("stroke", PRES.liveAttributes.linkStroke);	
				

			};
        };		

		
        this.click = function (d) {
		
			var fillopacity = PRES.svg.selectAll(".node")
									.filter(function (e) {return e.hash == d.hash;})
									.style("fill-opacity");	
									
			if (fillopacity == 0){
				PRES.liveAttributes.backgroundclick;
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
				
				if($.inArray(d.hash, PRES.readnodes) < 0){
					PRES.readnodes.push(d.hash);
				}
				
				
				PRES.svg.selectAll(".node")
					.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
					.style("stroke", PRES.liveAttributes.nodeStroke)
					.style("fill",PRES.liveAttributes.nodeFill);
		
				if (!ABSTR.timevisualization){
					$("#right_bar").height('auto');
					$('#rightpaneleval').html(rightpanelhtmleval);
					$('#rightpanel').html(rightpanelhtmlreplyandlink);
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
							
							document.getElementById("contentlabel").setAttribute ("style", "border: solid 3px " + hex2rgb(PRES.bordercolor.clicked, 0.7) + "; background: "+  hex2rgb(PRES.nodecolor[ABSTR.nodeFilters[d.type].typeId],0.5) +";");
							document.getElementById("contentlabel").innerHTML = "<b>" + ABSTR.nodeFilters[d.type].name + "</b>" + "&nbsp&nbsp" + " (by " +d.author + " - "+timeAgo(d.time)+")";
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
			if (!ABSTR.creatinglink){
				
				drawlinkselect(d, PRES.bordercolor.clicked, 0, 0);
				
				ABSTR.clickednodehash = "";
				ABSTR.clickedlinkhash = d.hash;
				ABSTR.selectedlink = d;
				
				PRES.svg.selectAll(".node")
					.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
					.style("stroke", PRES.liveAttributes.nodeStroke);
					
				
				$('#rightpaneleval').html(rightpanelhtmllinkeval);
				$('#rightpanel').html("");
				$('#rightpanelspace').html("");

				
				timedcontentlabel = setTimeout(function(){
				
					if (ABSTR.timevisualization){return;}
					
					document.getElementById("contentlabel").setAttribute ("style", "border: solid 3px " + hex2rgb(PRES.bordercolor.clicked, 0.7) + "; background: "+  hex2rgb(PRES.linkcolor[ABSTR.linkFilters[d.type].typeId],0.5) +";");
					document.getElementById("contentlabel").innerHTML = "<b>" + ABSTR.linkFilters[d.type].name + " connection" + "</b>" + "&nbsp&nbsp" + " (by " +d.author + " - "+timeAgo(d.time)+")";
					
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
	
	// end of this == LiveAttributes
	
	
	
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
			.attr("marker-mid", PRES.liveAttributes.linkArrow);

    };

    function updateNodes(PRES) {
        PRES.svg.selectAll(".node")
			.style("fill",PRES.liveAttributes.nodeFill)
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


function hideshowfilters() {

    var PRES = Visualisations.current().presentation;
	
	PRES.showfilters = !PRES.showfilters;	

	var str = (PRES.showfilters) ? "Hide" : "Show";
	$("#cmd_hideshowfilters").html(str);
	
    legendfiltersupdate();
	
};

function legendfiltersupdate() {

    var PRES = Visualisations.current().presentation;
    var lower_bar = document.getElementById("lower_bar");
	
    (PRES.showfilters) ? lower_bar.style.bottom = "-75px" : lower_bar.style.bottom = "-155px";

};

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


function evalnode(vote) {

    var PRES = Visualisations.current().presentation;   
	var ABSTR = Visualisations.current().abstraction;
	
	var nodes = PRES.force.nodes();
    var links = PRES.force.links();
  
    var targetindex = searchhash(nodes, ABSTR.clickednodehash);
    targetnode = nodes[targetindex];
	
    var name = document.getElementById("headerNamebox").value;    
    if (name == ""){name = "anonymous";}
	
	if($.inArray(name, targetnode.evaluatedby) > -1){
		
		var alert = document.getElementById("evalalert");
		
		var brornot = ($(window).height()<486) ? "<br>" : " ";
		if (ABSTR.timevisualization){brornot=" ";}
		
		alert.innerHTML = "You have already" + brornot + "rated this thought";
		setTimeout(function(){alert.innerHTML = "&nbsp";},2000);
		return;
	}
	
	targetnode.evaluatedby.push(name);
	
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
	
	db_update_eval_node(variable,value);

	PRES.svg.selectAll(".node")
		.filter(function (d) {return d.hash == ABSTR.clickednodehash;})
		.transition().duration(1000).ease("elastic")
		.attr("r", PRES.liveAttributes.nodeRadius) 
	
	explode(targetnode.x, targetnode.y, color);
	
};


function evallink(vote) {

    var PRES = Visualisations.current().presentation;   
    var ABSTR = Visualisations.current().abstraction;
	
    var nodes = PRES.force.nodes();
    var links = PRES.force.links();
  
    var targetindex = searchhash(links, ABSTR.clickedlinkhash);
    targetlink = links[targetindex];
	
    var name = document.getElementById("headerNamebox").value;    
    if (name == ""){name = "anon";}
	
	if($.inArray(name, targetlink.evaluatedby) > -1){
	

		var alert = document.getElementById("evalalert");
		var brornot = ($(window).height()<486) ? "<br>" : " ";
		
		alert.innerHTML = "You have already" + brornot + "rated this connection";
		setTimeout(function(){alert.innerHTML = "&nbsp";},2000);
		return;
	} 
	
	targetlink.evaluatedby.push(name);
	
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

	db_update_eval_link(variable,value);
	
	var coordx = (targetlink.source.x + targetlink.target.x)/2;
	var coordy = (targetlink.source.y + targetlink.target.y)/2;
	var expcolor = (vote=="pos") ? "green" : "red";
	explode(coordx, coordy, expcolor);

};


//shows the reply options and cancel the creation of a new link, or hides the options if they are already showed
function showreplypanel(){

	var ABSTR = Visualisations.current().abstraction;
	
	if (ABSTR.creatinglink){
		cancellink();
	}
	
	if (ABSTR.replying){
		hidereplypanel();
		return;
	}
	
	if (ABSTR.timevisualization){

		$("#nodeinteract"+oldindex).height("auto");
		$("#nodeinteract"+oldindex).html(timevisinteracthtml +  "<br></br>" + rightpanelhtmlreply + "<br></br><br>"); 
		
		$('#timevisdiv').animate({
			scrollTop: $('#timevisdiv').scrollTop()+$("#nodecontent"+oldindex).position().top-60
		}, 400);

	} else {
	
		var brornot = ($(window).height()<486) ? "" : "<br><br>";
		$('#rightpanel').html(rightpanelhtmlreplyandlink + brornot+ rightpanelhtmlreply);
		$('#rightpanelspace').html("");
	}
	ABSTR.replying = true;
	
	document.getElementById("namebox2").value = Model.currentAuthor();
	document.getElementById("showreply").setAttribute("style", "box-shadow: inset -1px 1px 2px 0px rgba(0, 0, 0, 0.5);");
	document.getElementById("replybox").focus();
	
	selectedreplynodetype = 1;
	selectedreplylinktype = 1;
	preparereplynodetype();
	preparereplylinktype();
}


function hidereplypanel(){
	var ABSTR = Visualisations.current().abstraction;
	ABSTR.replying = false; 
		 
	document.getElementById("replybox").value = "";  
	document.getElementById("replyboxsum").value = "";

	
	if (ABSTR.timevisualization){
		$("#nodeinteract"+oldindex).height("24px");
		$("#nodeinteract"+oldindex).html(timevisinteracthtml); 
	} else {
			
		 $('#rightpanel').html(rightpanelhtmlreplyandlink);	
		 $('#rightpanelspace').html("");
	}
}


//shows the create link options
function showcreatelink(){

	var ABSTR = Visualisations.current().abstraction;
	
	if (ABSTR.creatinglink){
		cancellink();
		return;
	}
	
	if (ABSTR.replying){
		hidereplypanel();
	}


	if (ABSTR.timevisualization){

		$("#nodeinteract"+oldindex).height("auto");
		$("#nodeinteract"+oldindex).html(timevisinteracthtml +  "<br></br>" + rightpanelhtmllink + "<br>"); 
		
		$('#timevisdiv').animate({
			scrollTop: $('#timevisdiv').scrollTop()+$("#nodecontent"+oldindex).position().top-60
		}, 400);

	} else {

		var brornot = ($(window).height()<486) ? "" : "<br><br>";
		$('#rightpanel').html(rightpanelhtmlreplyandlink + brornot + rightpanelhtmllink);
		$('#rightpanelspace').html("");
		
	}
	
	ABSTR.creatinglink = true;
	ABSTR.replying = false;
	button = document.getElementById("showconnect");
	button.setAttribute("style", "box-shadow: inset -1px 1px 2px 0px rgba(0, 0, 0, 0.5);");
	
	selectedconnectlinktype = 0;
	prepareconnectlinktype();


}

function cancellink(){

	var PRES = Visualisations.current().presentation;
	var ABSTR = Visualisations.current().abstraction;
	
	if (ABSTR.timevisualization){
		$("#nodeinteract"+oldindex).height("24px");
		$("#nodeinteract"+oldindex).html(timevisinteracthtml); 
	} else {
	
		$('#rightpanel').html(rightpanelhtmlreplyandlink);
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
		alert.innerHTML = "Write something first!";
		setTimeout(function(){alert.innerHTML = "&nbsp";},2000);
		$('#replybox').effect('highlight',2000);
		return;
	}
    var PRES = Visualisations.current().presentation;
	
    createnode(PRES);
};

	
function createnode(PRES){
	
	var author=document.getElementById("namebox2").value;
	if (author != ""){
		Model.currentAuthor(author);
		document.getElementById("headerNamebox").value = author;
	}
	
	var ABSTR = Visualisations.current().abstraction;
    var nodes = PRES.force.nodes();

    var content = document.getElementById("replybox").value;
    var contentsum = document.getElementById("replyboxsum").value;
    var nodetype = selectedreplynodetype;
	
	var targetindex = searchhash(nodes, ABSTR.clickednodehash), 
    targetnode = nodes[targetindex];
	
	var author = Model.currentAuthor();
    var time = Math.floor((new Date()).getTime() / 1000);

	var seed=(selectedreplylinktype != 0) ? 0 : 1;
	
	var randomplusminus = Math.random() < 0.5 ? -1 : 1;
	var coordx = targetnode.x + randomplusminus*10*(Math.random()+1);
	var coordy = targetnode.y + randomplusminus*10*(Math.random()+1);

	var hash = parseInt(nodehashit(content + contentsum + nodetype + author + time));
    var newnode = {
        "hash": hash,
        "content": content,
        "contentsum": contentsum,
        "evalpos": 1,
		"evalneg": 0,
        "evaluatedby": [author],
        "type": nodetype,
        "author": author,
		"seed":seed,
        "time": time,
        x: coordx,
        y: coordy
    };
	
    nodes.push(newnode);

	db_savenode(newnode);	
	update_hash_lookup([newnode], []);
	
	var linktype = selectedreplylinktype;
	
	if (linktype != 0){ //creates a new link only if user chooses a relation different than "No relation".
	
		var links = PRES.force.links();	
		
		var hash = linkhashit(newnode.hash + targetnode.hash + author + linktype + time);
		
		var newlink = {
			"hash": hash, 
			"source": newnode, 
			"target": targetnode,
			"direct": 0,
			"evalpos": 1,
			"evalneg": 0,
			"evaluatedby": [author],
			"type": linktype,
			"author": author,
			"time": time
		};
		
		links.push(newlink);
		
		var newlinkfordb = {
			"hash": newlink.hash, 
			"source": newnode.hash, 
			"target": targetnode.hash,
			"direct": 0,
			"evalpos": 1,
			"evalneg": 0,
			"evaluatedby": [author],
			"type": linktype,
			"author": author,
			"time": time
		};
		
		db_savelink(newlinkfordb);
		
		drawnewlinks();
    } 
	
	hidereplypanel();
	
	drawnewnodes();
	
	if (newnode.seed == 1){
		addseed(newnode);
	}
	if (ABSTR.timevisualization){
		
		var i= timednodes.length-1;
		var legend = timednodes[i].author+' - '+timeAgo(timednodes[i].time);
		var color = d3.rgb(PRES.nodecolor[timednodes[i].type]).darker(0).toString();
		
		var html = '<div id="nodelegend'+i+'" class="divnodelegend">'+legend+'</div><div id="nodecontent'+i+'" class="divnodecontent" style="border: solid 2px '+color+';" onclick="clickdivcontent(this.id);" onmouseover="overdivcontent(this.id);" onmouseout="outdivcontent(this.id);"></div><div id="nodeinteract'+i+'" class="divnodeinteract">&nbsp</div>'; 
		
		$("#timevisdiv").html($("#timevisdiv").html().replace("<br><br><br> <br><br><br><br>","") + html + "<br><br><br> <br><br><br><br>");
		
		$("#nodecontent"+i).html(URLlinks(nl2br(timednodes[i].content)));
		
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

function drawnewlinks() {
    
	var PRES = Visualisations.current().presentation;
 
    var links = PRES.force.links();
    
    var link = PRES.svg.selectAll(".link")
        .data(links)
        .enter().insert("polyline",".node")
        .attr("class", "link")
		.attr("marker-mid", PRES.liveAttributes.linkArrow)
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
 
    var nodes = PRES.force.nodes();
    
    var node = PRES.svg.selectAll(".node")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("cx", function (d) {coordx = d.x; return d.x;})
        .attr("cy", function (d) {coordy = d.y; return d.y;})
		.attr("r", 0)
		.style("fill", function(d) {var color = PRES.liveAttributes.nodeFill(d); explode(coordx, coordy, color); return color;})
		.style("stroke", PRES.liveAttributes.nodeStroke)
		.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
		.on("mouseover", PRES.liveAttributes.mouseover)
		.on("mouseout", PRES.liveAttributes.mouseout)
		.on("click", PRES.liveAttributes.click)
		.on("dblclick", PRES.liveAttributes.dblclick)
        .call(PRES.force.drag)
		.transition().ease("elastic").duration(1000)
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

//creation of a new link
function savelink(d){

    var PRES = Visualisations.current().presentation;
	var ABSTR = Visualisations.current().abstraction;
	
    var nodes = PRES.force.nodes();
    var links = PRES.force.links();

    var linktype = selectedconnectlinktype;
    
    var sourceindex = searchhash(nodes, ABSTR.clickednodehash);
    var sourcenode = nodes[sourceindex];
	
    var author = Model.currentAuthor();
	var time = Math.floor((new Date()).getTime() / 1000);
	
	var hash = linkhashit(sourcenode.hash + d.hash + author + linktype + time);
	
	var newlink={
		"hash": hash, 
		"source": sourcenode, 
		"target": d, 
		"direct": 1,
		"evalpos": 1, 
		"evalneg": 0,
		"evaluatedby": [author],
		"type":linktype,
		"author": author,
		"time": time
	};
	
    links.push(newlink);
	
		var newlinkfordb = {
			"hash": newlink.hash, 
			"source": sourcenode.hash, 
			"target": d.hash,
			"direct": 1,
			"evalpos": 1,
			"evalneg": 0,
			"evaluatedby": [author],
			"type":linktype,
			"author": author,
			"time": time
		};
		
		db_savelink(newlinkfordb);
	
    var link = PRES.svg.selectAll(".link")
        .data(links)
        .enter().insert("polyline",".node")
        .attr("class", "link")
		.attr("marker-mid", PRES.liveAttributes.linkArrow)
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


function updatecontentlabel(d, time, votes){

    var PRES = Visualisations.current().presentation;
	var ABSTR = Visualisations.current().abstraction;
	
	timedcontentlabel = setTimeout(function(){
		document.getElementById("contentlabel").setAttribute ("style", "background: "+  hex2rgb(PRES.nodecolor[ABSTR.nodeFilters[d.type].typeId],0.5)   + ";");
		document.getElementById("contentlabel").innerHTML = "<b>" + ABSTR.nodeFilters[d.type].name + "</b>" + "&nbsp&nbsp" + " (by " +d.author + " - "+timeAgo(d.time)+")";
		document.getElementById("contbox").innerHTML = URLlinks(nl2br(d.content));
		
		if (votes){
			document.getElementById("linkpos").innerHTML = "+" + d.evalpos;
			document.getElementById("linkneg").innerHTML = ((d.evalneg===0) ? "" : "-") + d.evalneg;	
		}
		
	},time);
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
	$('#rightpanelspace').html(rightpanelhtmlspace);
	
	ABSTR.clickednodehash = "";
	ABSTR.clickedlinkhash = "";
	
	ABSTR.replying = false;
	ABSTR.creatinglink = false;
}

function preparereplynodetype(){

    var PRES = Visualisations.current().presentation;
	var ABSTR = Visualisations.current().abstraction;

	var ddData=[];
	
	for (var i=0;i<Model.nodeTypesArray.length;i++){
		
		nodetype = Model.nodeTypesArray[i];
		
		ddData.push({
			text: Model.nodeTypes[nodetype].text,
			value: Model.nodeTypes[nodetype].value,
			selected:(Model.nodeTypes[nodetype].text=="General"),
			imageSrc: Model.nodeTypes[nodetype].image
		});
	}


	$('#replynodetype').ddTslick({

		data: ddData,
		selectText: "Type of reply",
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
	
	var defaultselected = "General";
	
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
		selectText: "Type of relation",
		width: 135,
		height: 25*(typeslist.length),
		background: "#fff",
		onSelected: function(selectedData){
			selectedreplylinktype = ddData[selectedData.selectedIndex].value;
		}
	});
		
}

function prepareconnectlinktype(){

	var PRES = Visualisations.current().presentation;
	
	var ddData=[];
	
	for (var i=0;i<Model.linkConnectTypesArray.length;i++){
		
		linktype = Model.linkConnectTypesArray[i];
		
		ddData.push({
			text: Model.linkTypes[linktype].text,
			value: Model.linkTypes[linktype].value,
			selected:false,
			imageSrc: Model.linkTypes[linktype].image
		});
	}

	$('#connectlinktype').ddTslick('destroy');
	
	$('#connectlinktype').ddTslick({

		data: ddData,
		selectText: "Type of relation",
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
			str = "Select a thought that is related with this one"
			break;
		case 2:
			str = "Select a thought that agrees with this one"
			break;
		case 3:
			str = "Select a thought that disagrees with this one"
			break;
		case 4:
			str = "Select a thought that is a consequence of this one"
			break;
		case 5:
			str = "Select a thought that is an alternative to this one"
			break;
		case 6:
			str = "Select a thought that is equivalent to this one"
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
	var textclose = "<div id='tutorial_panel_close' class='tutorial_panel_close noselect' onclick='closetutorialpanel()'>&times</div>";
	var textclick = "<div class='tutorial_panel_click'>(Click to continue)</div>";
	
	switch (ABSTR.tutorialstep){
	
		case -1:
		text = "Welcome to Incoma!  &nbsp;&nbsp; ヽ(^。^)ノ ヽ(^。^)ノ  <br>&nbsp;&nbsp;&nbsp;&nbsp; (ﾉ^ ヮ^)ﾉ *:･ﾟ✧ <br><br>In this panel you will see a tutorial to learn how to use it. At any moment you can close it, or click on it to advance. <i>You can play with this sandbox freely! (changes will not be saved)</i>";
		break;
		
		
		case 0:
		text = "The graph you see in the middle of the screen is a conversation. The circles represent thoughts and the lines represent the relationships among them. <br><br>This conversation entitled 'Sandbox' is just an example of a typical conversation. You can play freely with it, the changes you make will not be saved as they are in the rest of conversations." 
		break;
	
		
		case 1:
		text = "To read the different thoughts, you can pass your mouse over the circles. In the right  panel, you will see the thought, together with some info: who created it, when was created, the type of thought, and the rating given to it by other people.";
		
		PRES.liveAttributes.mouseover(Model.model.nodes[0]);
		ABSTR.overnode = false;
		$("#right_bar").css({"border-left": "solid 2px red", "border-bottom": "solid 2px red"});
		break;
		
		
		case 2:
		text = "The color of the circles indicates what type of thought they contain (a general thought, a question, a proposal, some info...), and the color of the lines indicates the type of relation that exist between the circles they connect (there could be agreement or disagreement between them, they could be equivalent, one could be the consequence of the other,...)";

		$("#right_bar").css({"border-left": "solid 1px #bbb", "border-bottom": "solid 1px #bbb"});
		break;
		
		
		case 3:
		text = "You can see the meaning of all the colors in the legend panel at the bottom of the screen. You  can also click in their names to hide or show a specific type of thought or connection.<br><br>By default the size of circles and links depends on their evaluations. If you want to see all of them with the same size then click on the word 'Evaluations' under the Size section.";
		
		$("#lower_bar").css("border", "solid 2px red");
		break;
		

		case 4:
		text = "By clicking on 'Show tags', a line of text will appear above each circle showing its tags (automatically generated among the most used words in all the conversation). By clicking on 'Show summaries' the text will show the summary of the node, either the one created by the user who made that circle or one with the beggining of the comment.<br><br> If you want to hide the legend, click on the 'Hide' button of its right corner.";
		
		break;

		
		case 5:
		text = "To interact with a thought, just click on its circle, and in the right panel will appear new buttons that allow you to reply to this thought ('Reply'), to connect it with another thought ('Connect'), and to evaluate it (green and red buttons).";
		
		$("#lower_bar").css("border", "solid 1px rgba(51,51,153, 0.6)");
		
		$("#right_bar").css({"border-left": "solid 2px red", "border-bottom": "solid 2px red"});
		PRES.liveAttributes.click(Model.model.nodes[0]);
		break;
		
		
		case 6:
		text = "When replying, you can add information about your reply, so you help everybody to follow the conversation easily.";
		
	
		$("#right_bar").css({"border-left": "solid 1px #bbb", "border-bottom": "solid 1px #bbb"});
		showreplypanel();
		$("#tdnodetype").css("border", "solid 2px rgba(0,0,0,0)");
		$("#tdlinktype").css("border", "solid 2px rgba(0,0,0,0)");	
		break;
		
		
		case 7:
		text = "First, you have a pull-down menu to select the type of reply you are doing: is it question? a proposal? information (instead of an opinion)?). <br>Second, you have another pull-down menu to select the type of relation between what you write and the thought you clicked. Depending on the type of thought you will find certain types of possible connections"
		
		$("#tdnodetype").css("border", "solid 2px red");
		$("#tdlinktype").css("border", "solid 2px red");

		break;
		
		
		case 8:
		text = "Below these menus you can write your thought, a summary of your thought (if you want), and your name. When you finish click on 'Save' and see how it appears in the graph! <br><br>If you want to write a thought not connected to any other, select 'No relation' in the menu 'type of connection'.";
		
		$("#tdnodetype").css("border", "solid 2px rgba(0,0,0,0)");
		$("#tdlinktype").css("border", "solid 2px rgba(0,0,0,0)");		
		
		$("#replybox").css("border-color", "red");
		$("#replyboxsum").css("border-color", "red");
		$("#namebox2").css("border-color", "red");
		break;
		
		
		case 9:
		text = "If you think two thoughts have a relationship between them and you want to show it in the conversation, select one of them and click on the button 'Connect'. Chose the type of relation in the menu and click on the other thought. Take into account that the order matters with the relation 'Consequence' (one of the thoughts is the consequence of the other, but not the other way around).";
		
		$("#replybox").css("border-color", "#bbb");
		$("#replyboxsum").css("border-color", "#bbb");
		$("#namebox2").css("border-color", "#bbb");
		
		showcreatelink();
		$("#tdconnect").css("border", "solid 2px red");
		break;
		
		
		case 10:
		text = "To evaluate a thought click it, write your name on the 'Name' box on the top of the screen (if you haven't introduced it yet anywhere), and then click on the green and red buttons below the thought. The number of positive and negative votes of each thought is shown in the buttons.";
		
		$("#tdconnect").css("border", "solid 2px rgba(0,0,0,0)");
		$("#headerNamebox").css("border", "solid 2px red");
		$("#nodepos").css("border", "solid 2px red");
		$("#nodeneg").css("border", "solid 2px red");
		cancellink();
		break;
		
		
		case 11:
		text = "To deselect a circle, just click on any empty part of the screen. <br><br>You  can click and drag with your  mouse to move around the conversation,  and zoom in and out using the  buttons in the top left side of the  window, or using your mousewheel. Is possible also to drag circles if you want to reposition them, and double-clicking a circle will center the view on it.";
		
		ABSTR.overnode = false;
		PRES.liveAttributes.backgroundclick();
		
		$("#left_bar").css("border-color", "red");
		$("#headerNamebox").css("border", "solid thin #ddd");
		$("#nodepos").css("border", "solid 2px rgba(0,0,0,0)");
		$("#nodeneg").css("border", "solid 2px rgba(0,0,0,0)");
		break;

		
		case 12: 
		text = "Play around with the Sandbox until you feel yourself comfortable with the use of Incoma. Once you see how everything works, you can create a new conversation or join an existing one. For this, click on the menu and then choose the option you want: 'Create' or 'Participate'. Remember that those other conversations, different from the Sandbox, will be saved or modified in the database.";
		
		$("#left_bar").css("border-color", "rgba(0,0,0,0)");
		$("#headerMenu").css("color", "#f53d3d");
		break;
		
		
		case 13:
		text = "You can find more information in the Incoma project blog blog.incoma.org. <br><br>If you have questions, suggestions, if you find a bug, want to share something nice with us, or anything else, please write us to incomaproject.contact@gmail.com";
		
		$("#headerMenu").css("color", "#ddd");
		$("#headerUrl").css("color", "#f53d3d");
		break;
	
	
		case 14:
		text = "Remember that Incoma is FREE SOFTWARE (free as in Braveheart). So it is yours and from the rest of the humanity. Because we love the 99%.<br><br>Enjoy!";
		
		$("#headerUrl").css("color", "#ddd");
		textclick = "<div class='tutorial_panel_click'>(Click to finish)</div>";
		break;		
		
		
		case 15:
		closetutorialpanel();
		return;
		break;
	}
	
	$("#tutorial_panel").html(textclose + text + textclick);
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
		$("#namebox2").css("border-color", "#bbb");
	}
	
	//closes the tutorial panel
	$("#tutorial_panel").html("").animate({height: 20},300).animate({width: 92},300);
	
	setTimeout(function(){
		$("#tutorial_panel").css({"font-size":"11pt", "cursor":"pointer"}).html("Watch tutorial");
		$("#tutorial_panel")[0].onclick = opentutorialpanel;
	},700);
	
	ABSTR.tutorialopened=false;
}


function opentutorialpanel(){

    var PRES = Visualisations.current().presentation;
	var ABSTR = Visualisations.current().abstraction;
	
	$("#tutorial_panel").html("").css({"font-size":tutorialfont, "cursor":"default"}).animate({width: searchCssProp('.tutorial_panel','width')},300).animate({height: searchCssProp('.tutorial_panel','height')},300);
	
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

function closelanguagepanel(){
	$('#language_panel').fadeOut(300);
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
	var variation = 5; //sets the variation of the sizes, they are bigger when 'variation' is closer to zero.
	
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

function showevolution(){

	var PRES = Visualisations.current().presentation;
	var ABSTR = Visualisations.current().abstraction;
	
	ABSTR.showingevolution = !ABSTR.showingevolution;
	
	if (!ABSTR.showingevolution){
		$("#controlevolution").slideUp(200);
		$("#showevolution").html("Show evolution");
		clearInterval(addone);
		PRES.evolutionvelocity = 9000;
		addbytime(); 
		
	} else {
		$("#controlevolution").slideDown(200);
		PRES.drawexplosions = false;
		ABSTR.evolutionpause = false;
		ABSTR.letmouseover = false;
		PRES.force.friction(0.7);
		PRES.force.charge(-500);
		PRES.force.linkStrength(0.5);
		$("#evolutionpause").html("ll");
		
		startevolution();
	}

}


function startevolution(){
    var PRES = Visualisations.current().presentation;
	var ABSTR = Visualisations.current().abstraction;
	
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
		
	allnodes = Model.model.nodes.slice();
	alllinks = Model.model.links.slice();
	
	allnodes.sort(function(a,b){a.time-b.time;});
	alllinks.sort(function(a,b){a.time-b.time;});
	
	danodes = [];
	dalinks = [];
	
	addbytime(); 
	
}

function addbytime(){
	
	var ABSTR = Visualisations.current().abstraction;
    var PRES = Visualisations.current().presentation;
	
	if (allnodes.length> 0 && alllinks.length> 0){
	
		if ((allnodes[0].time < alllinks[0].time && allnodes[0].seed > 0)||(ABSTR.youarenotalone)){
			danodes.push(allnodes[0]);
			PRES.force.nodes(danodes);
			drawnewnodes();
			if(allnodes[0].seed>0){addseed(allnodes[0]);}
			allnodes.shift();
		} else {
			dalinks.push(alllinks[0]);
			PRES.force.links(dalinks);
			drawnewlinks();		
			if (alllinks[0].direct == 0){
				danodes.push(allnodes[0]);
				PRES.force.nodes(danodes);
				drawnewnodes();
				if(allnodes[0].seed>0){addseed(allnodes[0]);}
				allnodes.shift();
			}
			alllinks.shift();
		}
	}else if(allnodes.length > 0){
			danodes.push(allnodes[0]);
			PRES.force.nodes(danodes);
			drawnewnodes();
			if (allnodes[0].seed > 0){addseed(allnodes[0]);}
			allnodes.shift();
	} else if(alllinks.length > 0){
			dalinks.push(alllinks[0]);
			PRES.force.links(dalinks);
			drawnewlinks();		
			alllinks.shift();
	} else {
		clearInterval(addone);
		ABSTR.showingevolution = false;
		ABSTR.youarenotalone = false;
		ABSTR.letmouseover = true;
		PRES.evolutionvelocity = 1;
		$("#evolvelocity").html("");
		$("#showevolution").html("Show evolution");
		$("#controlevolution").slideUp(200);
		
		PRES.force.friction(0.85);
	   	PRES.force.charge(-500);
		PRES.force.linkStrength(1);
		PRES.force.gravity(0.1);
		PRES.force.start();
		PRES.drawexplosions = true;
		
		Model.model.nodes = PRES.force.nodes();
		Model.model.links = PRES.force.links();
		
		$("#svg").delay(800).fadeIn(500);
		return;
	}
	
	addone = setTimeout("addbytime()",250/PRES.evolutionvelocity); 
}


function evolutionpause(){
	
	var PRES = Visualisations.current().presentation;
	var ABSTR = Visualisations.current().abstraction;

	ABSTR.evolutionpause = !ABSTR.evolutionpause;
	
	if (ABSTR.evolutionpause){
		clearInterval(addone);
		$("#evolutionpause").html("▶");
	} else {
		addbytime();
		$("#evolutionpause").html("ll");
	}
}

function evolutionfast(){
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
}



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


function showtexts(){

    var PRES = Visualisations.current().presentation;
	PRES.showingtexts = !PRES.showingtexts; 


	if (PRES.showingsums){
	hidesums();	
	}

	var textdata = [];
	
	Model.model.nodes.forEach(function(d, i) {		

			textdata.push({node:d, text: findstringsontext(Model.tags, d.content)});
	});
		
		
	if (PRES.showingtexts){
	
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
		
		$("#showtexts").css("color","#000");
	
	} else {
	
		PRES.svg.selectAll("text")
			.data("")
			.exit().remove();
			
		$("#showtexts").css("color","#777");
	}
	
}



function hidetexts(){

    var PRES = Visualisations.current().presentation;

	if (PRES.showingtexts){
	PRES.showingtexts = !PRES.showingtexts; 
	
		PRES.svg.selectAll("text")
			.data("")
			.exit().remove();
			
		$("#showtexts").css("color","#777");
	}
	
}


function showsums(){

    var PRES = Visualisations.current().presentation;
	PRES.showingsums = !PRES.showingsums; 

	if (PRES.showingtexts){
	hidetexts();	
	}
		
	var textdata2 = [];
	
	Model.model.nodes.forEach(function(d, i) {	
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
		
	
	if (PRES.showingsums){
	
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
		
		$("#showsums").css("color","#000");
	
	} else {
	
		PRES.svg.selectAll("text")
			.data("")
			.exit().remove();
			
		$("#showsums").css("color","#777");
	}
	
}

function hidesums(){

    var PRES = Visualisations.current().presentation;


	if (PRES.showingsums){
	PRES.showingsums = !PRES.showingsums; 
	
		PRES.svg.selectAll("text")
			.data("")
			.exit().remove();
			
		$("#showsums").css("color","#777");
	}
	
}


function changevisualization(){

	var ABSTR = Visualisations.current().abstraction;
	var PRES = Visualisations.current().presentation;
	
	ABSTR.timevisualization = !ABSTR.timevisualization;
	
	//change right_bar properties when going back to original visualization
	
	if (!ABSTR.timevisualization){

		cancellink();
		
		$(".right_bar").resizable( "destroy" )
		
		$("#right_bar").html(rightbarhtml);
		
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
		
		$('#rightpanelspace').html(rightpanelhtmlspace);
		
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
	
	$("#right_bar").html(timevisrightbarhtml);
	
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
	timednodes = Model.model.nodes;
	timednodes.sort(function(a,b){a.time-b.time;});	
	
	//add divs with the node contents to the right_bar
	
	for (var i=0; i< timednodes.length; i++){
		
		var color = d3.rgb(PRES.nodecolor[timednodes[i].type]).darker(0).toString();
		var legend = timednodes[i].author+' - '+timeAgo(timednodes[i].time);
		
		html += '<div id="nodelegend'+i+'" class="divnodelegend">'+legend+'</div>'; 
		
		html += '<div id="nodecontent'+i+'" class="divnodecontent" style="border: solid 2px'+color+'" onclick="clickdivcontent(this.id);" onmouseover="overdivcontent(this.id);" onmouseout="outdivcontent(this.id);"></div>'; 
		
		html += '<div id="nodeinteract'+i+'" class="divnodeinteract">&nbsp</div>'; 
	}
	
	$("#timevisdiv").html(html+"<br><br><br> <br><br><br><br>");
	
	for (var i=0; i< timednodes.length; i++){
	
		var content = URLlinks(nl2br(timednodes[i].content));	
		$("#nodecontent"+i).html(content);
		
	//	if ($("#nodecontent"+i).height()>200){$("#nodecontent"+i).height(200)}; //maximun height (thought still resizable)
	}
	
	if (ABSTR.clickednode !== ""){
		var index = $.inArray(ABSTR.clickednode, timednodes);
		selectdivcontent(index);
		
		$('#timevisdiv').scrollTop($('#timevisdiv').scrollTop()+$("#nodecontent"+index).position().top-60);
		
	} else {
		$('#timevisdiv').scrollTop(0);
	}
	
}

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
				"border": "solid 2px"+color,
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
			"border": "solid 2px"+PRES.bordercolor.clicked,
	});
	
	$("#nodeinteract"+oldindex).height("24px");
	$("#nodeinteract"+index).html(timevisinteracthtml);

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
}

function overdivcontent (id){

	var ABSTR = Visualisations.current().abstraction;
	var PRES = Visualisations.current().presentation;
	
	var overindex=id.slice(11);
	var selnode=timednodes[overindex];
	
	if (oldindex != overindex){
		$("#"+id).css({
			"border": "solid 2px"+PRES.bordercolor.over,
		});
	}
	
	oldoverindex = overindex;
	
	ABSTR.overnodehash = selnode.hash;
	
//	updateNodes(PRES);

	PRES.svg.selectAll(".node")
		.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
		.style("stroke", PRES.liveAttributes.nodeStroke)
		.style("fill",PRES.liveAttributes.nodeFill);
	
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
			"border": "solid 2px " + color,
		});
	}
	
	ABSTR.overnodehash = "";
	ABSTR.overnode = "";

	PRES.svg.selectAll(".node")
		.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
		.style("stroke", PRES.liveAttributes.nodeStroke);
}


function egg1(){

	var ABSTR = Visualisations.current().abstraction;
	var PRES = Visualisations.current().presentation;

	if (ABSTR.showingevolution){
		clearInterval(addone);
		$("#showevolution").html("Show evolution");
		$("#showevolution").html("You're not alone");
		ABSTR.youarenotalone = true;
		startevolution();
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
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp,"<a href='$1' target='_blank'>$1</a>");
}

//replace line breaks with <br> html tags
function nl2br (str, is_xhtml) {   
	var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
	return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

function clearSelection() {
    if ( document.selection ) {
        document.selection.empty();
    } else if ( window.getSelection ) {
        window.getSelection().removeAllRanges();
    }
}


function ZoomOut_Control(VIS, ABSTR, PRES) {};
// End of var ZoomOut