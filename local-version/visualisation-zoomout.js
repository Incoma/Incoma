
var rightpanelhtmleval = "<center><div id='posvotes' class='posvotes'></div><div class='evalpos button' onClick='evalpos()'>+</div>&nbsp&nbsp<div class='evalneg button' onClick='evalneg()'>-</div><div id='negvotes' class='negvotes'></div></center><div id='evalalert' class='alerttext noselect'>&nbsp</div>";

var rightpanelhtmllinkeval = "<center><div id='linkposvotes' class='posvotes'></div><div class='evalpos button' onClick='linkevalpos()'>+</div>&nbsp&nbsp<div class='evalneg button' onClick='linkevalneg()'>-</div><div id='linknegvotes' class='negvotes'></div></center><div id='evalalert' class='alerttext noselect'>&nbsp</div>";

var rightpanelhtmlreplyandlink = "<center><div id='showreply' class='showreplypanel button' onClick='showreplypanel()'>Reply</div>&nbsp&nbsp&nbsp&nbsp<div class='showconnectpanel button' id='showlink' onClick='showcreatelink()'>Connect</div></center>";

var rightpanelhtmlreply = "<br><table><tr><td> Type of reply: </td><td><select id=\"replynodetype\" onchange=\"connectionChange(this);\"  ><option value=1>General</option><option value=2>Question</option><option value=3>Answer</option> <option value=4>Proposal</option><option value=5>Info</option></select>  <br></td></tr><tr><td>Type of relation:</td><td> <select id=\"replylinktype\"> <option value=1>General</option><option value=3>Agree</option> <option value=4>Disagree</option><option value=2>Consequence</option><option value=7>Alternative</option><option value=0>No relation</option></select></td></tr></table><textarea id='replybox' class='areareply' spellcheck='false'></textarea>Name:&nbsp<textarea id='namebox2' class='areaname' spellcheck='false'></textarea>&nbsp&nbsp&nbsp&nbsp<div class='save button' onClick='savenode()'>Save</div><div class='cancel button' onClick='hidereplypanel()'>Cancel</div><div id='replyalert' class='alerttext noselect' style='text-align:right;'>&nbsp</div>";

var rightpanelhtmllink = "<center><br>Type of relation:&nbsp&nbsp<select id=\"replylinktype2\"> <option value=1>General</option><option value=6>Contradiction</option><option value=2>Consequence</option><option value=5>Related</option><option value=3>Agree</option> <option value=4>Disagree</option><option value=7>Alternative</option><option value=8>Answer</option> onClick='changelinktype()'</select>&nbsp&nbsp&nbsp&nbsp<div class='cancel button' onClick='cancellink()'>Cancel</div></center>";

saved = true;

 function connectionChange(selectObj) { 
     var idx = selectObj.selectedIndex; 
     var valreply = selectObj.options[idx].value;
     connlist = Model.connectionlist(valreply);
     var cSelect = document.getElementById("replylinktype"); 
     Visualisations.setOptions(cSelect, connlist); 
  }
  

Visualisations.register(new ZoomOut());
/*
    ZoomOut follows the Presentation/Abstraction/Control pattern:
    * Abstraction: 
            This object keeps all data that is needed for the presentation. If it refers to an external model, it is also responsible
            for updating itself when the external data changes, for example by registering appropiate listeners with the external model.
            The Abstraction also stores the current selection, current zoom state and edit modes (for example "create link")
            Lastly the abstraction provides methods for manipulating its data.
    * Presentation:
            The single main responsibility of the presentation is to take the data from the abstraction and put it on screen.
            It usually provides an update() method that refreshes the screen from the data.
            It should also provide methods for translating screen coordinates to objects from the abstraction (selecting) and for
            registering callbacks for mouseclicks, textedits etc.
            Methods in Presentation never change data directly!
    * Control:
            This object provides methods for all possible user interactions: editing, creating, deleting, selecting, ...
            These methods receive some parameters and then change the data in the abstraction and the model.
            It also registers callbacks with the presentation for events it wants to interpret. 
 */
 
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

// Start of this == abstraction = model and state of filters [abstraction initialized with (model)]


function ZoomOut_Abstraction() {

    this.model = null;
	
    this.linkFilters = {
	1: {name: "General",state: true, typeId: 1},
        2: {name: "Consequence", state: true, typeId: 2},
        3: {name: "Agree", state: true, typeId: 3},
        4: {name: "Disagree", state: true, typeId: 4},
        5: {name: "Related", state: true, typeId: 5},
        6: {name: "Contradiction", state: true, typeId: 6},
        7: {name: "Alternative", state: true, typeId: 7},
        8: {name: "Answer", state: true, typeId: 8},
    };
	
    this.nodeFilters = {
	1: {name: "General", state: true, typeId: 1},
        2: {name: "Question", state: true, typeId: 2},
        3: {name: "Answer", state: true, typeId: 3},
        4: {name: "Proposal", state: true, typeId: 4},
        5: {name: "Info", state: true, typeId: 5},
    };
	
    this.sizeFilters = {
	nodes: {name: "Boxes", state: true},
        links: {name: "Threads", state: true},
    };
	
    this.init = function (model) {
        this.model = model;
        this.clickednodehash = "";
        this.clickedlinkhash = "";
        this.creatinglink = false;
        this.replying = false;
    }
};

// End of this == abstraction

// Start of this == presentation [initialized with (html5node, abstraction)]

function ZoomOut_Presentation(VIS, ABSTR) {
    // public interface

    this.container = null;
    this.nodeSizeDefault = 12;
    this.width = $(window).width()-5;
    this.height = $(window).height()-50-19;
    this.bordercolor = {
        "normal": "rgba(0,0,0,0)",
        "clicked": "#000",
        "linkclicked": "#000",
        "over": "#c33",
		"origin": "#360"
    };

    this.showfilters = 0;
    this.showlegend = 1;

    this.svg = null;

	// previous colors
  //  this.color = ["#000000", "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f"];
	
    this.nodecolor = ["#000000", "#7f7f7f", "#ec9242", "#9261c3", "#df64ba", "#1f77b4"];
    this.linkcolor = ["#000000", "#7f7f7f", "#339e94", "#2ca02c", "#d62728", "#1f77b4", "#5e3a1a", "#ec9242", "#9261c3"];                                            

    this.liveAttributes = new LiveAttributes(ABSTR, this);
    //    this.updateLinks = function() { this.definedBelow(); }
	
    this.update = function () {
        this.definedBelow();
    }
	
		
    this.init = function (html5node) {
        this.definedBelow();
    }
    
    this.setViewport = function(tx, ty, zoom, transitionTime) {
    	this.svg
			.transition().duration(transitionTime)
            .attr("transform","translate(" + tx + ',' + ty + ") scale(" + zoom + ")");
    };
    
    // end of public interface

    // Start of init function = change the html code (.innerHTML) inside of the html5node (adding visualization, text areas, and filters) and calls with the abstraction as a parameter: initSVG, initLinkFilters, initNodeFilters, initSizeFilters (this four will create the filters and the svg and place it in the previous html code)

    this.init = function (html5node) {
        this.scaler = new Scaler(this);
        this.container = html5node;
 
	//defines the html content of the visualization (except the header, defined in index)

		html5node.innerHTML =
            '   \
              <div class="svg_and_right_bar" >   \
   \
                  <div id="svg" style="Float:left">   \
                    <div class="svg">  </div>   \
                  </div>   \
	 \
                  <div id="right_bar" style="Float:right">   \
                    <div id="right_bar_header" class="right_bar_header noselect">   \
                      <div id="contentlabel" class="right_bar_title">   \
					    &nbsp \
                      </div>   \
                    </div>   \
    \
                    <div id="contbox" class="divareacontent noselect"></div>   \
					<div id="rightpaneleval">  \
					</div> \
					<div id="rightpanel">  \
					</div> \
					<br></br> \
					<br></br> \
					<br></br> \
					<br></br> \
					<br></br> \
					<br></br> \
					<br></br> \
					<br></br> \
					<br></br> \
					<br></br> \
					<br></br> \
					<br></br> \
					<br></br> \
					<br></br> \
                  </div>   \
	\
				  <div id="left_bar" class="mod">   \
                    <div class="left_bar_header noselect">   \
                        <center>   \
						<div class="zoombutton button" id="cmd_zoomout">-</div>   \
						&nbsp&nbspzoom&nbsp&nbsp \
						<div class="zoombutton button" id="cmd_zoomin">+</div>   \
						<\center>  \
                    </div>   \
                  </div>   \
    \
             </div>   \
   \
             <div id= "legend_bar" class="legend_bar">   \
                  <div class="legend_bar_elems">   \
                    <div id="legend_title" class="lower_title" style="Float:left" >   \
                      <b>Legend</b>\
                    </div>   \
                    <div id="legend_nodes" class="lower_nodes" style="Float:left" >   \
                      <b>Boxes</b>             \
                    </div>   \
   \
                    <div id="legend_links" class="lower_links" style="Float:left">   \
                      <b>Connections</b>    \
                    </div>   \
                    <div id="legend_hide" class="lower_hide"  style="Float:right" >   \
                      <div class="lower_hide_button" id="cmd_hideshowlegend">Hide/show legend</div>   \
                    </div>   \
                 </div>   \
             </div>   \
             <div id= "lower_bar" class="lower_bar">   \
   \
                  <div class="lower_bar_elems">   \
                    <div id="filters_title" class="lower_title" style="Float:left" >   \
                      <b>Filters</b>\
                    </div>   \
                    <div id="filt_nodes" class="lower_nodes" style="Float:left" >   \
                      <b>Boxes</b>             \
                    </div>   \
   \
                    <div id="filt_links" class="lower_links" style="Float:left">   \
                      <b>Connections</b>    \
                    </div>   \
   \
                    <div id="filt_sizes" class="lower_sizes" style="Float:left" >   \
                      <b>Evaluations</b>     \
                    </div>   \
                    <div id="filt_hide" class="lower_hide"  style="Float:right" >   \
                      <div class="lower_hide_button" id="cmd_hideshowfilters">Hide/show filters</div>   \
                    </div>   \
                 </div>   \
    \
             </div>   \
        '; // end of innerHTML

		//makes visible the "menu" and "export" buttons of the header
	 	document.getElementById("headerMenu").setAttribute("style","visibility:visible;");
		document.getElementById("headerExport").setAttribute("style","visibility:visible;");
		
		//stablish the onclick functions for the html elements of html5node
        $( "#cmd_zoomin" )[0].onclick = this.scaler.zoomin;
        $( "#cmd_zoomout" )[0].onclick = this.scaler.zoomout;
		$( "#cmd_zoomin" )[0].onclick = this.scaler.zoomin;
        $( "#cmd_zoomout" )[0].onclick = this.scaler.zoomout;
        $( "#cmd_hideshowlegend" )[0].onclick = hideshowlegend;
        $( "#cmd_hideshowfilters" )[0].onclick = hideshowfilters;
        $( "#legend_title" )[0].onclick = hideshowlegend;
        $( "#filters_title" )[0].onclick = hideshowfilters;
        
        initSVG(this, ABSTR, this.width, this.height);

        initNodeLegend(this, "legend_nodes", ABSTR.nodeFilters);
        initLinkLegend(this, "legend_links", ABSTR.linkFilters);

        initNodeFilters(this, "filt_nodes", ABSTR.nodeFilters);
        initLinkFilters(this, "filt_links", ABSTR.linkFilters);
        initSizeFilters(this, "filt_sizes", ABSTR.sizeFilters);
        // The initfilters take as an input parameter the id of the div where they will be placed (e.g "filt_links"), with appendChild.

    };
    // End of init function of presentation

    // Start of initSVG = create the svg from the abstraction, and place it into the "visualization" html div tag inserted on the html5node

    function initSVG(PRES, ABSTR, width, height) {

        PRES.force = d3.layout.force()
 //           .charge(-600)
			.charge(function(d) { return -Math.sqrt(d.weight)*500; }) //stablish a charge for each node proportional to its number of links
			.gravity(0.1)
            .linkDistance(40)
			.theta(0.95)
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
			.on("mousedown", PRES.liveAttributes.mousedown)
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
			.style("stroke-opacity",0);
		
		PRES.setViewport(-300/2, -100/2, 1, 0); //center the 'origin point' of the graph


        var graph = ABSTR.model;

		
		//stablishes the correct relation between links source/target and the nodes hash
		var hash_lookup = [];
		
		graph.nodes.forEach(function(d, i) {
		  hash_lookup[d.hash] = d;
		});
		
		graph.links.forEach(function(d, i) {
		  d.source = hash_lookup[d.source];
		  d.target = hash_lookup[d.target];
		});

		

        force
            .nodes(graph.nodes)
            .links(graph.links)
            .start();

		PRES.prelink = svg.append("line")
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", 0)
			.attr("y2", 0)
			.style("stroke-width", 2)
			.style("stroke", "black")
			.style("stroke-opacity",0.5);

			
        PRES.links = svg.selectAll(".link")
            .data(graph.links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke", PRES.liveAttributes.linkStroke)
            .style("stroke-width", PRES.liveAttributes.linkStrokeWidth)
            .on("click", PRES.liveAttributes.clicklink);
        //The attributes (as the strokewidth) are obtained from the fields of each node (as example d.evaluation) via functions (example linkStrokeWidth), taking in account if the filters are acting or not (this.abstraction.sizeFilter.links.state)

		PRES.nodes = svg.selectAll(".node")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", PRES.liveAttributes.nodeWidth)
            .style("fill", PRES.liveAttributes.nodeFill)
            .on("mouseover", PRES.liveAttributes.mouseover)
            .on("click", PRES.liveAttributes.click)
			.on("dblclick", PRES.liveAttributes.dblclick)
            .call(force.drag);
			
		PRES.nodes
			.style("fill-opacity",0)
			.transition().delay(800).duration(1000)
			.style("fill-opacity",1);
			
		PRES.links
			.style("stroke-opacity",0)
			.transition().delay(800).duration(1500)
			.style("stroke-opacity",1);	
			
	//This three alternative paragraphs below to the previous one, to append text to the nodes (but work much slower)
	
        // var node = svg.selectAll(".node")
            // .data(graph.nodes)
            // .enter().append("g")
            // .attr("class", "node")
            // .call(force.drag);
			
		// node.append("circle")
			// .attr("r", PRES.liveAttributes.nodeWidth)
            // .style("fill", PRES.liveAttributes.nodeFill)
            // .on("mouseover", PRES.liveAttributes.mouseover)
            // .on("click", PRES.liveAttributes.click)
			// .on("dblclick", PRES.liveAttributes.dblclick)

		// node.append("text")
			// .attr("x", 0)
			// .attr("y", 0)
			// .text(function(d) { return d.content })
			// .attr("stroke", "#000")
			// .attr("stroke-width","0px")
			// .style("fill-opacity",0)
			// .style("text-anchor", "middle")
			// .style("font-family", "sans-serif")
            // .style("font-size", "2px");

			
        force.on("tick", function () {
		
            PRES.svg.selectAll(".link")
				.attr("x1", function (d) {return d.source.x;})
                .attr("y1", function (d) {return d.source.y;})
                .attr("x2", function (d) {return d.target.x;})
                .attr("y2", function (d) {return d.target.y;});

            PRES.svg.selectAll(".node")
				.attr("cx", function (d) {return d.x;})
                .attr("cy", function (d) {return d.y;});
				
		//	PRES.nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; }); // an alternative
        });

    };
    // End of initSVG

    // Start of initLinkFilters = create the html from the filters, appending it (appendChild) to the right div tags



    function initLinkFilters(PRES, columnId, filterlist) {

        var numfilts = 8 ;
        var filtspercol = 3 ;
        var filtsperrow = Math.ceil(numfilts/filtspercol);

    	var column = document.getElementById(columnId);

	var table  = document.createElement("table");
	table.style.width = "100%";
	table.setAttribute('border','0');
	table.setAttribute('cellpadding','0');
	table.setAttribute('cellspacing','0');
	tb = document.createElement("tbody");

	var checkbox = new Array();
	var threadslegend = new Array();

        for (var i = 1; i < numfilts+1; ++i) {
            var filter = filterlist[i];
            checkbox[i] = Visualisations.makeFilterBox(filter); 
            if (i == 1 || i == 1+1*filtsperrow || i == 1+2*filtsperrow) {
		tr = document.createElement("tr");
	    }
	    tdname = document.createElement("td");
	    tdbox = document.createElement("td");
	    threadslegend[i] = document.createElement("canvas");
	    threadslegend[i].width  = 6; // in pixels
	    threadslegend[i].height = 10;
	    threadslegend[i].style.backgroundColor  = PRES.linkcolor[i];
            tdname.appendChild(threadslegend[i]);
            tdname.appendChild(Visualisations.makeText(" " + filter.name + ": "));
            tdbox.appendChild(checkbox[i]);
            checkbox[i].onclick = function() { 
		for (var j = 1; j < numfilts+1; ++j) {
		    switch (filterlist[j].name) {
		    case this.name:
			filterlist[j].state = !filterlist[j].state; 				   
			break
		    default:
		    }
		};			  
		PRES.update(); 
	    }    
	    tr.appendChild(tdname);
	    tr.appendChild(tdbox);      
            if (i == 1*filtsperrow || i == 2*filtsperrow || i == 3*filtsperrow || i == numfilts) {
		tb.appendChild(tr);
		table.appendChild(tb);
	    }

        }

	column.appendChild(table);

    };

    function initLinkLegend(PRES, columnId, filterlist) {

        var numfilts = 8 ;
        var filtspercol = 3 ;
        var filtsperrow = Math.ceil(numfilts/filtspercol);

    	var column = document.getElementById(columnId);

	var table  = document.createElement("table");
	table.style.width = "100%";
	table.setAttribute('border','0');
	table.setAttribute('cellpadding','0');
	table.setAttribute('cellspacing','0');
	tb = document.createElement("tbody");

	var threadslegend = new Array();

        for (var i = 1; i < numfilts+1; ++i) {
            var filter = filterlist[i];
            if (i == 1 || i == 1+1*filtsperrow || i == 1+2*filtsperrow) {
		tr = document.createElement("tr");
	    }
	    tdname = document.createElement("td");
	    tdbox = document.createElement("td");
	    threadslegend[i] = document.createElement("canvas");
	    threadslegend[i].width  = 6; // in pixels
	    threadslegend[i].height = 10;
	    threadslegend[i].style.backgroundColor  = PRES.linkcolor[i];
            tdname.appendChild(threadslegend[i]);

            tdname.appendChild(Visualisations.makeText(" " + filter.name));
	    tr.appendChild(tdname);
	    tr.appendChild(tdbox);      
            if (i == 1*filtsperrow || i == 2*filtsperrow || i == 3*filtsperrow || i == numfilts) {
		tb.appendChild(tr);
		table.appendChild(tb);
	    }

        }

	column.appendChild(table);

    };


    // Start of initNodeFilters

    function initNodeFilters(PRES, columnId, filterlist) {

        var numfilts = 5;
        var filtspercol = 3 ;
        var filtsperrow = Math.ceil(numfilts/filtspercol);

    	var column = document.getElementById(columnId);

	var table  = document.createElement("table");
	table.style.width = "100%";
	table.setAttribute('border','0');
	table.setAttribute('cellpadding','0');
	table.setAttribute('cellspacing','0');
	tb = document.createElement("tbody");

	var checkbox = new Array();
	var boxeslegend = new Array();

        for (var i = 1; i < numfilts+1; ++i) {
            var filter = filterlist[i];
	    checkbox[i] = Visualisations.makeFilterBox(filter);                         
	    if (i == 1 || i == 1+1*filtsperrow || i == 1+2*filtsperrow) {
		tr = document.createElement("tr");
	    }
	    tdname = document.createElement("td");
	    tdbox = document.createElement("td");
	    boxeslegend[i] = document.createElement("canvas");
	    boxeslegend[i].width  = 10; // in pixels
	    boxeslegend[i].height = 10;
	    boxeslegend[i].style.backgroundColor  = PRES.nodecolor[i];
            tdname.appendChild(boxeslegend[i]);

            tdname.appendChild(Visualisations.makeText(" " + filter.name + ": "));
            tdbox.appendChild(checkbox[i]);
            checkbox[i].onclick = function() { 
		for (var j = 1; j < numfilts+1; ++j) {
		    switch (filterlist[j].name) {
		    case this.name:
			filterlist[j].state = !filterlist[j].state; 				   
			break
		    default:
		    }
		}; 
                PRES.update(); 
	    }
	    tr.appendChild(tdname);
	    tr.appendChild(tdbox);
            if (i == 1*filtsperrow || i == 2*filtsperrow || i == 3*filtsperrow || i == numfilts) {
		tb.appendChild(tr);
		table.appendChild(tb);
	    }

        }

	column.appendChild(table);

    };

    function initNodeLegend(PRES, columnId, filterlist) {

        var numfilts = 5;
        var filtspercol = 3 ;
        var filtsperrow = Math.ceil(numfilts/filtspercol);

    	var column = document.getElementById(columnId);

	var table  = document.createElement("table");
	table.style.width = "100%";
	table.setAttribute('border','0');
	table.setAttribute('cellpadding','0');
	table.setAttribute('cellspacing','0');
	tb = document.createElement("tbody");

	var checkbox = new Array();
	var boxeslegend = new Array();

        for (var i = 1; i < numfilts+1; ++i) {
            var filter = filterlist[i];
	    if (i == 1 || i == 1+1*filtsperrow || i == 1+2*filtsperrow) {
		tr = document.createElement("tr");
	    }
	    tdname = document.createElement("td");
	    tdbox = document.createElement("td");
	    boxeslegend[i] = document.createElement("canvas");
	    boxeslegend[i].width  = 10; // in pixels
	    boxeslegend[i].height = 10;
	    boxeslegend[i].style.backgroundColor  = PRES.nodecolor[i];
            tdname.appendChild(boxeslegend[i]);

            tdname.appendChild(Visualisations.makeText(" " + filter.name));
	    tr.appendChild(tdname);
	    tr.appendChild(tdbox);
            if (i == 1*filtsperrow || i == 2*filtsperrow || i == 3*filtsperrow || i == numfilts) {
		tb.appendChild(tr);
		table.appendChild(tb);
	    }

        }

	column.appendChild(table);

    };



    // Start of initSizeFilters

    function initSizeFilters(PRES, columnId, filterlist) {

    var column = document.getElementById(columnId);

	var checkbox = new Array();

	var table  = document.createElement("table");
	table.style.width = "100%";
	table.setAttribute('border','0');
	table.setAttribute('cellpadding','0');
	table.setAttribute('cellspacing','0');
	tb = document.createElement("tbody");

        var filter = filterlist.nodes;
	tr = document.createElement("tr");
	tdname = document.createElement("td");
	tdbox = document.createElement("td");
        checkbox[1] = Visualisations.makeFilterBox(filter); 
        tdname.appendChild(Visualisations.makeText(filter.name + ": "));
        tdbox.appendChild(checkbox[1]);
        checkbox[1].onclick = function() { 
   	    filterlist.nodes.state = !filterlist.nodes.state; 				   
            PRES.update(); 
	}
	tr.appendChild(tdname);
	tr.appendChild(tdbox);
	tb.appendChild(tr);

        var filter = filterlist.links;
	tr = document.createElement("tr");
	tdname = document.createElement("td");
	tdbox = document.createElement("td");
        checkbox[2] = Visualisations.makeFilterBox(filter); 
        tdname.appendChild(Visualisations.makeText(filter.name + ": "));
        tdbox.appendChild(checkbox[2]);
	checkbox[2].onclick = function() { 
   	    filterlist.links.state = !filterlist.links.state; 				   
            PRES.update(); 
	}
	tr.appendChild(tdname);
	tr.appendChild(tdbox);
	tb.appendChild(tr);

	table.appendChild(tb);
	column.appendChild(table);


    };


    // functions that return the right style of each element (considering filters)        

    function LiveAttributes(ABSTR, PRES) {

        this.nodeFill = function (d) {
            return PRES.nodecolor[d.type];
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
            return PRES.linkcolor[d.type];
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
                    .filter(function (e) {return e.target.hash == d.hash;})
                    .style("stroke-opacity", 0);
            }
			return PRES.nodecolor[d.type];
        };		

		
        this.mousemove = function (d) {
			if (ABSTR.creatinglink){
                var nodes = PRES.force.nodes();
                var index = searchhash(nodes, ABSTR.clickednodehash);
                var linecolor = PRES.linkcolor[document.getElementById("replylinktype2").value];
				
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
					.style("stroke", linecolor);
			}
		};

		//if the node where the mouse is, is visible, 
		//-changes its border color to the defined "over" color (restoring the border color of the rest of nodes)
		//-updates the information showed in the content box and in its label
		
        this.mouseover = function (d) {

			var fillopacity = 	PRES.svg.selectAll(".node")
						.filter(function (e) {return e.hash == d.hash;})
						.style("fill-opacity");	
								
			if (fillopacity == 0){return};
			
			if (ABSTR.clickednodehash === "" && ABSTR.clickedlinkhash === "") {
                PRES.svg.selectAll(".node")
                    .style("stroke", PRES.bordercolor.normal);
				
				PRES.svg.selectAll(".node")
					.filter(function (d) {return d.origin == "1";})
					.style("stroke",PRES.bordercolor.origin);

				// this line below is the node where the mouse is over			
				d3.select(this)
					.style("stroke", PRES.bordercolor.over);
						
				// change the color of the header to the color corresponding to the type of the box, and shows its type of content and its author			
				document.getElementById("right_bar_header").setAttribute ("style", "background: "+  hex2rgb(PRES.nodecolor[ABSTR.nodeFilters[d.type].typeId],0.2)   + ";"); // change the color of the header to the color that corresponds to the type of the box showed
				document.getElementById("contentlabel").setAttribute ("style", "background: "+  hex2rgb(PRES.nodecolor[ABSTR.nodeFilters[d.type].typeId],0.2)   + ";");
				document.getElementById("contentlabel").innerHTML = "<b>" + ABSTR.nodeFilters[d.type].name + "</b>" + "&nbsp&nbsp" + " (by " +d.author +")";
				document.getElementById("contbox").innerHTML = URLlinks(d.content);
			}
        };

		//when the user clicks in empty space.
		//if the user is not creating a link, deselects any previously selected node, restablishing border colors and the info of the content box and its label
        this.mousedown = function (d) {
			if (!ABSTR.creatinglink){
				PRES.svg.selectAll(".node")
					.style("stroke", PRES.bordercolor.normal);
				
				PRES.svg.selectAll(".link")
					.style("stroke", PRES.liveAttributes.linkStroke);
				
				PRES.svg.selectAll(".node")
					.filter(function (d) {return d.origin == "1";})
					.style("stroke",PRES.bordercolor.origin);
					
				ABSTR.clickednodehash = "";
				ABSTR.clickedlinkhash = "";
				
				document.getElementById("right_bar_header").setAttribute ("style", "background: (227,226,230);");
				document.getElementById("contentlabel").setAttribute ("style", "background: (227,226,230);");
				document.getElementById("contentlabel").innerHTML = "&nbsp";
	
				document.getElementById("contbox").innerHTML = "";
				$('#rightpaneleval').html(" ");
				$('#rightpanel').html(" ");
				
				ABSTR.replying = false;
			};
        };

		//when the user clicks inside one node
		//if the user is creating a link, it saves the link using the last clicked node as the target
		//if the user is not creatin a link, selects the clicked node, changing its border color and showing its information in the content box and in its label.
        this.click = function (d) {
			if (ABSTR.creatinglink){
				if (d.hash !== ABSTR.clickednodehash){
					savelink(d);
				}
			}else{
				var fillopacity = 	PRES.svg.selectAll(".node")
									.filter(function (e) {return e.hash == d.hash;})
									.style("fill-opacity");	
									
				if (fillopacity == 0){return};

				PRES.svg.selectAll(".node")
					.style("stroke", PRES.bordercolor.normal);
					
				PRES.svg.selectAll(".link")
					.style("stroke", PRES.liveAttributes.linkStroke);
		
				PRES.svg.selectAll(".node")
					.filter(function (d) {return d.origin == "1";})
					.style("stroke",PRES.bordercolor.origin);
				
				// this line below is the clicked node
				d3.select(this)
					.style("stroke", PRES.bordercolor.clicked);
		
				ABSTR.clickednodehash = d.hash;
				ABSTR.clickedlinkhash = "";
				
				$('#rightpaneleval').html(rightpanelhtmleval);
				$('#rightpanel').html(rightpanelhtmlreplyandlink);
				
				document.getElementById("right_bar_header").setAttribute ("style", "background: "+  hex2rgb(PRES.nodecolor[ABSTR.nodeFilters[d.type].typeId],0.3)   + ";"); // change the color of the header to the color that corresponds to the type of the box showed
				document.getElementById("contentlabel").setAttribute ("style", "background: "+  hex2rgb(PRES.nodecolor[ABSTR.nodeFilters[d.type].typeId],0.3)   + ";");
				document.getElementById("contentlabel").innerHTML = "<b>" + ABSTR.nodeFilters[d.type].name + "</b>" + "&nbsp&nbsp" + " (by " +d.author + ")";
				document.getElementById("contbox").innerHTML = URLlinks(d.content);
				
				document.getElementById("posvotes").innerHTML = d.evalpos;
				document.getElementById("negvotes").innerHTML = d.evalneg;
				
			};
			
		};
		
		//focus on the double clicked node
		this.dblclick = function (d) {
			
			var selx = PRES.svg.selectAll(".node")
								.filter(function (e) {return e.hash == d.hash;})
								.attr("cx");
								
			var sely = PRES.svg.selectAll(".node")
								.filter(function (e) {return e.hash == d.hash;})
								.attr("cy");

			PRES.scaler.zoomval = 1.5;
			
			PRES.scaler.despx0 = (PRES.scaler.midx-selx*PRES.scaler.zoomval) - PRES.scaler.despxp;
			PRES.scaler.despy0 = (PRES.scaler.midy-sely*PRES.scaler.zoomval) - PRES.scaler.despyp;

			
			//alert(selx);
			
			PRES.scaler.despx = PRES.scaler.despxp + PRES.scaler.despx0;
			PRES.scaler.despy = PRES.scaler.despyp + PRES.scaler.despy0;
				

			PRES.svg
				.transition().duration(400)
				.attr("transform", "translate(" + PRES.scaler.despx + ',' + PRES.scaler.despy + ") scale(" + PRES.scaler.zoomval + ")");
		};

		
		//if the user is not creating a new link, selects the clicked link, changing its stroke color and showing its information in the content label
        this.clicklink = function (d) {
			if (!ABSTR.creatinglink){

				var strokewidth = 	PRES.svg.selectAll(".link")
									.filter(function (e) {return e.hash == d.hash;})
									.style("stroke-width");

				if (strokewidth == 0){return};

				d3.select(this)
					.style("stroke", "#000");
		
				ABSTR.clickedlinkhash = d.hash;
				
				$('#rightpaneleval').html(rightpanelhtmllinkeval);
				$('#rightpanel').html("");
				
				document.getElementById("contentlabel").setAttribute ("style", "background: "+  hex2rgb(PRES.linkcolor[ABSTR.linkFilters[d.type].typeId],0.3)   + ";"); // change the color of the header to the color that corresponds to the type of the box showed					
				document.getElementById("right_bar_header").setAttribute ("style", "background: "+  hex2rgb(PRES.linkcolor[ABSTR.linkFilters[d.type].typeId],0.3)   + ";"); // change the color of the header to the color that corresponds to the type of the box showed			
					
				document.getElementById("contentlabel").innerHTML = "<b>" + ABSTR.linkFilters[d.type].name + " connection" + "</b>";
				
				document.getElementById("linkposvotes").innerHTML = d.evalpos;
				document.getElementById("linknegvotes").innerHTML = d.evalneg;			
			};
		};

    };
	
	// end of this == LiveAttributes	

	


    // update functions (svg, nodes and links)

    function updateLinks(PRES) {
        PRES.svg.selectAll(".link")
			.style("stroke-width", PRES.liveAttributes.linkStrokeWidth)
			.style("stroke-opacity", PRES.liveAttributes.linkStrokeOpacity);
    };

    function updateNodes(PRES) {
        PRES.svg.selectAll(".node")
			.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
			.attr("r", PRES.liveAttributes.nodeWidth)
			.style("fill-opacity", PRES.liveAttributes.nodeFillOpacity)
			.style("stroke-opacity", PRES.liveAttributes.nodeStrokeOpacity);
    };

	function updateRelatedOpacity(PRES) {
	    PRES.svg.selectAll(".link").style("stroke", PRES.liveAttributes.relatedNodesOpacity);
        PRES.svg.selectAll(".node").style("fill", PRES.liveAttributes.relatedLinksOpacity);
	};
	
	
    this.update = function () {
        updateLinks(this);
        updateNodes(this);
		updateRelatedOpacity(this);
    };
	
};
// End of this == presentation


//shows or hides the filters and legend bars
function hideshowlegend() {

    var PRES = Visualisations.current().presentation;
    var legend_bar = document.getElementById("legend_bar");

    PRES.showlegend = !PRES.showlegend;

    legendfiltersupdate();

};


function hideshowfilters() {

    var PRES = Visualisations.current().presentation;
    var lower_bar = document.getElementById("lower_bar");

    PRES.showfilters = !PRES.showfilters;

    legendfiltersupdate();
};

function legendfiltersupdate() {

    var PRES = Visualisations.current().presentation;
    var lower_bar = document.getElementById("lower_bar");
    var legend_bar = document.getElementById("legend_bar");

    if (PRES.showfilters && PRES.showlegend) {
	lower_bar.style.bottom = "-100px";
	legend_bar.style.bottom = "0px";
    } else if (!PRES.showfilters && PRES.showlegend) {    
	lower_bar.style.bottom = "-182px";
	legend_bar.style.bottom = "-82px";
    } else if (PRES.showfilters && !PRES.showlegend) {    
	lower_bar.style.bottom = "-100px";
	legend_bar.style.bottom = "-82px";
    } else  {   
	lower_bar.style.bottom = "-182px";
	legend_bar.style.bottom = "-164px";
    }

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
	
    //var name = document.getElementById("namebox").value;    
    if (name == ""){name = "anon";}
	
	if($.inArray(name, targetnode.evaluatedby) > -1){
	
		var alert = document.getElementById("evalalert");
		alert.innerHTML = "You have already rated this node";
		setTimeout(function(){alert.innerHTML = "&nbsp";},2000);
		
	} else{
	
		targetnode.evaluatedby.push(name);
		
		if (vote=="pos"){
			targetnode.evalpos += 1; 
			document.getElementById("posvotes").innerHTML = targetnode.evalpos;
		}else{
			targetnode.evalneg += 1;
			document.getElementById("negvotes").innerHTML = targetnode.evalneg;
		}
	
		PRES.svg.selectAll(".node")
			.filter(function (d) {return d.hash == ABSTR.clickednodehash;})
			.transition().duration(1000).ease("elastic")
			.attr("r", PRES.liveAttributes.nodeWidth) 
	
	}
};

function evallink(vote) {

    var PRES = Visualisations.current().presentation;   
	var ABSTR = Visualisations.current().abstraction;
	
	var nodes = PRES.force.nodes();
    var links = PRES.force.links();
  
    var targetindex = searchhash(links, ABSTR.clickedlinkhash);
    targetlink = links[targetindex];
	
    //var name = document.getElementById("namebox").value;    
    if (name == ""){name = "anon";}
	
	if($.inArray(name, targetlink.evaluatedby) > -1){
		var alert = document.getElementById("evalalert");
		alert.innerHTML = "You have already rated this link";
		setTimeout(function(){alert.innerHTML = "&nbsp";},2000);
		
	} else{
	
		targetlink.evaluatedby.push(name);
		
		if (vote=="pos"){
			targetlink.evalpos += 1; 
			document.getElementById("linkposvotes").innerHTML = targetlink.evalpos;
		}else{
			targetlink.evalneg += 1;
			document.getElementById("linknegvotes").innerHTML = targetlink.evalneg; 
		}
	
		PRES.svg.selectAll(".link")
			.filter(function (d) {return d.hash == ABSTR.clickedlinkhash;})
			.transition().duration(1000).ease("elastic")
			.style("stroke-width", PRES.liveAttributes.linkStrokeWidth);

	}
};


//shows the reply options and cancel the creation of a new link, or hides the options if they are already showed
function showreplypanel(){

	var ABSTR = Visualisations.current().abstraction;
	
	cancellink();
	if (ABSTR.replying){
			ABSTR.replying = false;
			var PRES = Visualisations.current().presentation;
			PRES.mousedown();
		}
		$('#rightpanel').html(rightpanelhtmlreplyandlink + rightpanelhtmlreply);	
		ABSTR.replying = true;
		
		//document.getElementById("namebox2").value = document.getElementById("namebox").value;
		document.getElementById("showreply").setAttribute("style", "box-shadow: inset 1px 1px 2px 1px rgba(0, 0, 0, 0.5);");
		document.getElementById("replybox").focus();
}

function hidereplypanel(){
	var ABSTR = Visualisations.current().abstraction;
	document.getElementById("replybox").value = "";  
	 ABSTR.replying = false; 
	 $('#rightpanel').html(rightpanelhtmlreplyandlink);	
}


//shows the create link options
function showcreatelink(){
	var ABSTR = Visualisations.current().abstraction;
	if (ABSTR.creatinglink){
		cancellink();
	}else{
		$('#rightpanel').html(rightpanelhtmlreplyandlink + rightpanelhtmllink);
		ABSTR.creatinglink = true;
		ABSTR.replying = false;
		button = document.getElementById("showlink");
		button.setAttribute("style", "box-shadow: inset 1px 1px 2px 1px rgba(0, 0, 0, 0.5);");
	}
}

function cancellink(){
	$('#rightpanel').html(rightpanelhtmlreplyandlink);
	
	var PRES = Visualisations.current().presentation;
	var ABSTR = Visualisations.current().abstraction;
	PRES.prelink 
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", 0)
		.attr("y2", 0);
		
	ABSTR.creatinglink = false;
}

//creation of a new node
function savenode() {
	if (document.getElementById("replybox").value == ""){
	
		var alert = document.getElementById("replyalert");
		alert.innerHTML = "Write something first!&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
		setTimeout(function(){alert.innerHTML = "&nbsp";},2000);
		
		return;
	}
    var PRES = Visualisations.current().presentation;
    createnode(PRES);
	

};

	
function createnode(PRES){
		    
	var ABSTR = Visualisations.current().abstraction;
    var nodes = PRES.force.nodes();

    var content = document.getElementById("replybox").value;
    var nodetype = document.getElementById("replynodetype").value;
	
	var targetindex = searchhash(nodes, ABSTR.clickednodehash), 
    targetnode = nodes[targetindex];
	
	var author = Model.currentAuthor();
    
    var newnode = {
        "hash": nodes.length,
        "content": content,
        "evalpos": 1,
		"evalneg": 0,
        "evaluatedby": [author],
        "type": nodetype,
        "author": author,
        "time": Date.now(),
        x: targetnode.x,
        y: targetnode.y
    };
    
    nodes.push(newnode);
	
	var linktype = document.getElementById("replylinktype").value;
	
	if (linktype !== "0"){ //creates a new link only if user chooses a relation different than "No relation".
		var links = PRES.force.links();	
		links.push({"hash": links.length, source: newnode, target: targetnode,"evalpos":0,"evalneg":0,"evaluatedby": [],"type":linktype,"author": author,"time": Date.now()});
		newnode.x = targetnode.x + 20;
		newnode.y = targetnode.y + 20;
    }
	
	hidereplypanel();
    drawnewnodes(PRES);
	
}

function searchhash(elements, objective){
    for (i=0;i<elements.length;i++){
	if (elements[i].hash == objective){return i;}
    };
}

function drawnewnodes(PRES) {
    
    var nodes = PRES.force.nodes();
    var links = PRES.force.links();
    
    var link = PRES.svg.selectAll(".link")
        .data(links)
        .enter().insert("line",".node")
        .attr("class", "link")
		.style("stroke", PRES.liveAttributes.linkStroke)
		.style("stroke-width", PRES.liveAttributes.linkStrokeWidth)
        .on("click", PRES.liveAttributes.clicklink);
    
    var node = PRES.svg.selectAll(".node")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("cx", function (d) {return d.x;})
        .attr("cy", function (d) {return d.y;})
		.attr("r", 0)
		.style("fill", PRES.liveAttributes.nodeFill)
		.on("mouseover", PRES.liveAttributes.mouseover)
		.on("click", PRES.liveAttributes.click)
		.on("dblclick", PRES.liveAttributes.dblclick)
        .call(PRES.force.drag)
		.transition().ease("elastic").duration(1000)
		.attr("r", PRES.liveAttributes.nodeWidth);
		
    
    PRES.force.start();
};

//creation of a new link
function savelink(d){

    var PRES = Visualisations.current().presentation;
	var ABSTR = Visualisations.current().abstraction;
	
    var nodes = PRES.force.nodes();
    var links = PRES.force.links();

    var linktype = document.getElementById("replylinktype2").value;
    
    var sourceindex = searchhash(nodes, ABSTR.clickednodehash);
    sourcenode = nodes[sourceindex];
	
    var author = Model.currentAuthor();
	
    links.push({"hash": links.length, source: sourcenode, target: d, "evalpos":0, "evalneg":0,"evaluatedby": [],"type":linktype,"author": author,"time": Date.now()});
	
    var link = PRES.svg.selectAll(".link")
        .data(links)
        .enter().insert("line",".node")
        .attr("class", "link")
		.style("stroke", PRES.liveAttributes.linkStroke)
		.style("stroke-width", PRES.liveAttributes.linkStrokeWidth)
		.on("click", PRES.liveAttributes.clicklink);
		
    cancellink();

		
    PRES.force.start();
		
}

//changes the color of the prelink line when a new type of link is selected
function changelinktype(){

	var PRES = Visualisations.current().presentation;
    var linecolor = PRES.linkcolor[document.getElementById("replylinktype2").value];

	PRES.prelink.style("stroke", linecolor);
}
 
// Start of control


function Scaler(PRES) {

		// despxp : "pan displacement", the movement produced by mouse dragging
		// despxz : "zoom displacement", the movement that is produced when zooming, to maintain the correct position of the svg
		// despx0 : the rest of movements, like the initial movement, or the one produced when focusing in a node (with the dblclick function)
		// transxz : a memory used to obtain the real mouse dragging displacement from d3.event.translate, that accumulates the "aditional" movement produced when zooming

    this.oldscale = 1;
    this.scale = 1;
    this.trans = [0,0];

    this.zoomval = 1;
    this.zoommax = 15;
    this.zoommin = 0.1;

	this.despx0 = -300/2;
	this.despy0 = -100/2;
		
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
                if (THIS.zoomval*1.5 < THIS.zoommax){THIS.zoomval *= 1.5;}
            } else {
                if (THIS.zoomval/1.5 > THIS.zoommin){THIS.zoomval /= 1.5;}
            }
            
			THIS.despx0 = d3.mouse(this)[0]-(d3.mouse(this)[0]-THIS.despx)*THIS.zoomval/THIS.oldzoomval-THIS.despxp;
			THIS.despy0 = d3.mouse(this)[1]-(d3.mouse(this)[1]-THIS.despy)*THIS.zoomval/THIS.oldzoomval-THIS.despyp;
            
            THIS.transxz = THIS.trans[0]-THIS.despxp;
            THIS.transyz = THIS.trans[1]-THIS.despyp;
            
            THIS.oldscale = THIS.scale;
            var transtime = 200;
			
			THIS.despx = THIS.despx0 + THIS.despxp;
			THIS.despy = THIS.despy0 + THIS.despyp;
            
			PRES.setViewport(THIS.despx, THIS.despy, THIS.zoomval, transtime);
		}
	};
		
      


    this.zoomin = function() {
	
		THIS.oldzoomval = THIS.zoomval;
		
        if (THIS.zoomval*1.5 < THIS.zoommax){THIS.zoomval *= 1.5;};
	
        THIS.despx0 = THIS.midx-(THIS.midx-THIS.despx)*THIS.zoomval/THIS.oldzoomval-THIS.despxp;
        THIS.despy0 = THIS.midy-(THIS.midy-THIS.despy)*THIS.zoomval/THIS.oldzoomval-THIS.despyp;
	
        THIS.despx = THIS.despx0 + THIS.despxp;
        THIS.despy = THIS.despy0 + THIS.despyp;
	
        PRES.setViewport(THIS.despx, THIS.despy, THIS.zoomval, 200);
    };
	

    this.zoomout = function() {
	
		THIS.oldzoomval = THIS.zoomval;
		
        if (THIS.zoomval/1.5 > THIS.zoommin){THIS.zoomval /= 1.5;};
	
        THIS.despx0 = THIS.midx-(THIS.midx-THIS.despx)*THIS.zoomval/THIS.oldzoomval-THIS.despxp;
        THIS.despy0 = THIS.midy-(THIS.midy-THIS.despy)*THIS.zoomval/THIS.oldzoomval-THIS.despyp;
	
        THIS.despx = THIS.despx0 + THIS.despxp;
        THIS.despy = THIS.despy0 + THIS.despyp;
	
        PRES.setViewport(THIS.despx, THIS.despy, THIS.zoomval, 200);
   };
}


	
function mousemove(){}

function mousedown(){}

function mouseup(){}

//converts from hex color to rgba color
function hex2rgb(hex, opacity) {
        var h=hex.replace('#', '');
        h =  h.match(new RegExp('(.{'+h.length/3+'})', 'g'));

        for(var i=0; i<h.length; i++)
            h[i] = parseInt(h[i].length==1? h[i]+h[i]:h[i], 16);

        if (typeof opacity != 'undefined')  h.push(opacity);

        return 'rgba('+h.join(',')+')';
}

function URLlinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp,"<a href='$1' target='_blank'>$1</a>"); 
}


function ZoomOut_Control(VIS, ABSTR, PRES) {};
// End of var ZoomOut