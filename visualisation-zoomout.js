var oldscale = 1;
var scale = 1;
var trans = [0,0];

var zoomval = 1;
var zoommax = 5;
var zoommin = 0.2;

var despx = 0;
var despy = 0;

var despxz = 0;
var despyz = 0;

var despxp = 0;
var despyp = 0;

var transxz = 0;
var transyz = 0;

var rightpanelhtmleval = "<center><div id='posvotes' class='posvotes'></div><div class='evalpos button' onClick='evalpos()'>+</div>&nbsp&nbsp<div class='evalneg button' onClick='evalneg()'>-</div><div id='negvotes' class='negvotes'></div></center>";

var rightpanelhtmlreplyandlink = "<br><center><div id='showreply' class='showreplypanel button' onClick='showreplypanel()'>Reply</div>&nbsp&nbsp&nbsp&nbsp<div class='showconnectpanel button' id='showlink' onClick='showcreatelink()'>Connect</div></center>";

var rightpanelhtmlreply = "<br><table><tr><td> Type of reply: </td><td><select id=\"replynodetype\"><option value=1>General</option><option value=2>Question</option><option value=3>Answer</option> <option value=4>Proposal</option><option value=5>Info</option></select>  <br></td></tr><tr><td> Type of relation:</td><td> <select id=\"replylinktype\"> <option value=1>General</option><option value=3>Agree</option> <option value=4>Disagree</option><option value=2>Consequence</option><option value=7>Alternative</option></select></td></tr></table><textarea id='replybox' class='areareply' spellcheck='false'></textarea>Name:&nbsp<textarea id='namebox2' class='areaname' spellcheck='false'></textarea>&nbsp&nbsp&nbsp&nbsp<div class='save button' onClick='savenode()'>Save</div><div class='cancel button' onClick='hidereplypanel()'>Cancel</div>";

var rightpanelhtmllink = "<center><br>Type of relation:&nbsp&nbsp<select id=\"replylinktype2\"> <option value=1>General</option><option value=6>Contradiction</option><option value=2>Consequence</option><option value=5>Related</option><option value=3>Agree</option> <option value=4>Disagree</option><option value=7>Alternative</option><option value=8>Answer</option> onClick='changelinktype()'</select>&nbsp&nbsp&nbsp&nbsp<div class='cancel button' onClick='cancellink()'>Cancel</div></center>";

// var rightpanelhtmlprereply = "<br><div class='showreplypanel' onClick='showreplypanel()'>Reply</div>";

// var rightpanelhtmllink = "<div class='showconnectpanel' onClick='showcreatelink()'>Connect</div>";

Visualisations.register(new ZoomOut());

function ZoomOut() {

    this.name = "Zoom Out",
    this.abstraction = new ZoomOut_Abstraction(this);
    this.presentation = new ZoomOut_Presentation(this, this.abstraction);
    this.control = new ZoomOut_Control(this, this.abstraction, this.presentation);

    this.init = function (html5node, model) {
        this.abstraction.init(model);
        this.presentation.init(html5node);
    }

    this.destroy = function () {}

}

// Start of this == abstraction = model and state of filters [abstraction initialized with (model)]

var creatinglink = false;
var replying = false;

function ZoomOut_Abstraction(VIS) {
    this.model = null;
    this.linkFilters = {
        1: {
            name: "General",
            state: true,
            typeId: 1
        },
        2: {
            name: "Consequence",
            state: true,
            typeId: 2
        },
        3: {
            name: "Agree",
            state: true,
            typeId: 3
        },
        4: {
            name: "Disagree",
            state: true,
            typeId: 4
        },
        5: {
            name: "Related",
            state: true,
            typeId: 5
        },
        6: {
            name: "Contradiction",
            state: true,
            typeId: 6
        },
        7: {
            name: "Alternative",
            state: true,
            typeId: 7
        },

        8: {
            name: "Answer",
            state: true,
            typeId: 8
        },
    };
    this.nodeFilters = {
        1: {
            name: "General",
            state: true,
            typeId: 1
        },
        2: {
            name: "Question",
            state: true,
            typeId: 2
        },
        3: {
            name: "Answer",
            state: true,
            typeId: 3
        },
        4: {
            name: "Proposal",
            state: true,
            typeId: 4
        },
        5: {
            name: "Info",
            state: true,
            typeId: 5
        },
    };
    this.sizeFilters = {
        nodes: {
            name: "Boxes",
            state: true
        },
        links: {
            name: "Threads",
            state: true
        },
    };
    this.init = function (model) {
        this.model = model;
    }
};

// End of this == abstraction

// Start of this == presentation [initialized with (html5node, abstraction)]

function ZoomOut_Presentation(VIS, ABSTR) {
    // public interface

    this.isclicked = 0;
    this.clickednodehash = "";
    this.container = null;
    this.width = $(window).width()-5;
    this.height = $(window).height()-40-19;
    this.bordercolor = {
        "normal": "#36c",
        "clicked": "#000",
        "over": "#c33",
		"origin": "#360"
    };

    this.showfilters = 0;
    this.showlegend = 1;

    this.svg = null;

//  this.color = d3.scale.category10();
//  alert(this.color(1) + this.color(2) + this.color(3) + this.color(4) + this.color(5) + this.color(6) + this.color(7) + this.color(8) + this.color(9) + this.color(10));                                                      
    this.color = ["#000000", "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
//alert(this.color[1] + this.color[2] + this.color[3] + this.color[4] + this.color[5] + this.color[6] + this.color[7] + this.color[8] + this.color[9] + this.color[10]);                                                      

    this.liveAttributes = new LiveAttributes(ABSTR, this);
    //    this.updateLinks = function() { this.definedBelow(); }
	
    this.update = function () {
        this.definedBelow();
    }
	
		
    this.init = function (html5node) {
        this.definedBelow();
    }
    // end of public interface

    // Start of init function = change the html code (.innerHTML) inside of the html5node (adding visualization, text areas, and filters) and calls with the abstraction as a parameter: initSVG, initLinkFilters, initNodeFilters, initSizeFilters (this four will create the filters and the svg and place it in the previous html code)

    this.init = function (html5node) {
        this.container = html5node;
        html5node.innerHTML =
            '   \
              <div class="svg_and_right_bar" >   \
   \
                  <div id="svg" style="Float:left">   \
                    <div class="svg">  </div>   \
                  </div>   \
	 \
                  <div id="right_bar" style="Float:right">   \
                    <div class="right_bar_header">   \
                      <div class="right_bar_title">   \
                        Content:\
						<div id="test1" class="evalpos" style = "background:#cce" onClick="test1()">1</div>	\
						<div id="test2" class="evalpos" style = "background:#cce" onClick="test2()">2</div>	\
						<div id="test3" class="evalpos" style = "background:#cce" onClick="test3()">3</div>	\
                      </div>   \
                    </div>   \
    \
                    <textarea id="contbox" class="areacontent" spellcheck="false" readonly></textarea>   \
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
						<div class="zoombutton noselect" onClick="zoomout()">-</div>   \
						&nbsp&nbspzoom&nbsp&nbsp \
						<div class="zoombutton noselect" onClick="zoomin()">+</div>   \
						<\center>  \
                    </div>   \
                  </div>   \
    \
             </div>   \
   \
             <div id= "legend_bar" class="legend_bar">   \
                  <div class="legend_bar_elems">   \
                    <div id="legend_title" class="legend_title" style="Float:left" >   \
                      <b>Legend</b>\
                    </div>   \
                    <div id="legend_nodes" class="legend_nodes" style="Float:left" >   \
                      <b>Boxes</b>             \
                    </div>   \
   \
                    <div id="legend_links" class="legend_links" style="Float:left">   \
                      <b>Connections</b>    \
                    </div>   \
                    <div id="legend_hide" class="legend_hide"  style="Float:left" >   \
                      <div class="legend_hide_button" onClick="hideshowlegend()">Hide/show legend</div>   \
                    </div>   \
                 </div>   \
             </div>   \
             <div id= "lower_bar" class="lower_bar">   \
   \
                  <div class="lower_bar_elems">   \
                    <div id="filters_title" class="filters_title" style="Float:left" >   \
                      <b>Filters</b>\
                    </div>   \
                    <div id="filt_nodes" class="filt_nodes" style="Float:left" >   \
                      <b>Boxes</b>             \
                    </div>   \
   \
                    <div id="filt_links" class="filt_links" style="Float:left">   \
                      <b>Connections</b>    \
                    </div>   \
   \
                    <div id="filt_sizes" class="filt_sizes" style="Float:left" >   \
                      <b>Evaluations</b>     \
                    </div>   \
                    <div id="filt_hide" class="filt_hide"  style="Float:left" >   \
                      <div class="filt_hide_button" onClick="hideshowfilters()">Hide/show filters</div>   \
                    </div>   \
                 </div>   \
   \
             </div>   \
        '; // end of innerHTML


        initSVG(this, ABSTR, this.width, this.height);
        // 712, 325 = width and height of the visualization

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
            .charge(-600)
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
			.call(d3.behavior.zoom().on("zoom", rescale))
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
		
        var graph = ABSTR.model;

        force
            .nodes(graph.nodes)
            .links(graph.links)
            .start();


        var link = svg.selectAll(".link")
            .data(graph.links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke", PRES.liveAttributes.linkStroke)
            .style("stroke-width", PRES.liveAttributes.linkStrokeWidth);
        //The attributes (as the strokewidth) are obtained from the fields of each node (as example d.evaluation) via functions (example linkStrokeWidth), taking in account if the filters are acting or not (this.abstraction.sizeFilter.links.state)


        var node = svg.selectAll(".node")
            .data(graph.nodes)
            .enter().append("rect")
            .attr("class", "node")
            .attr("width", PRES.liveAttributes.nodeWidth)
            .attr("height", PRES.liveAttributes.nodeHeight)
            .style("fill", PRES.liveAttributes.nodeFill)
            .on("mouseover", PRES.liveAttributes.mouseover)
            .on("click", PRES.liveAttributes.click)
            .call(force.drag);
			
		PRES.svg.selectAll(".node")
			.filter(function (d) {return d.origin == "1";})
			.style("stroke-width", 3)
			.style("stroke",PRES.bordercolor.origin);
			
		PRES.prelink = svg.append("line")
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", 0)
			.attr("y2", 0)
			.style("stroke-width", 2)
			.style("stroke", "black")
			.style("stroke-opacity",0.5);


        force.on("tick", function () {
		
            PRES.svg.selectAll(".link")
				.attr("x1", function (d) {return d.source.x+10;})
                .attr("y1", function (d) {return d.source.y+10;})
                .attr("x2", function (d) {return d.target.x+10;})
                .attr("y2", function (d) {return d.target.y+10;});

            PRES.svg.selectAll(".node")
				.attr("x", function (d) {return d.x;})
                .attr("y", function (d) {return d.y;});
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
	    threadslegend[i].style.backgroundColor  = PRES.color[i];
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
                updateLinks(PRES); 
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
	    threadslegend[i].style.backgroundColor  = PRES.color[i];
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
	    boxeslegend[i].style.backgroundColor  = PRES.color[i];
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
	    boxeslegend[i].style.backgroundColor  = PRES.color[i];
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
            return PRES.color[d.type];
        };

        this.nodeHeight = function (d) {
            if (ABSTR.sizeFilters.nodes.state && (d.evalpos-d.evalneg> 0)) {
                return 20 * Math.sqrt(Math.sqrt(1+d.evalpos-d.evalneg));
            } else {
                return 20;
            }
        };

        this.nodeWidth = function (d) {
            if (ABSTR.sizeFilters.nodes.state && (d.evalpos-d.evalneg> 0)) {
                return 20 * Math.sqrt(Math.sqrt(1+d.evalpos-d.evalneg));
            } else {
                return 20;
            }
        };

        this.nodeOpacityAndSetConnectedLinkOpacity = function (d) {
            if (ABSTR.nodeFilters[d.type].state) {

                return "1";
            } else {
                nodehash = d.hash;
                PRES.svg.selectAll(".link")
                    .filter(function (d) {
                    return d.source.hash == nodehash;
                })
                    .style("stroke-width", function (d) {
                    return 0;
                });
                PRES.svg.selectAll(".link")
                    .filter(function (d) {
                    return d.target.hash == nodehash;
                })
                    .style("stroke-width", function (d) {
                    return 0;
                });
                return "0";
            }
        };


        this.nodeStrokeWidth = function (d) {
            if (ABSTR.nodeFilters[d.type].state) {
                return "1.5px";
            } else {
                return "0px";
            }
        };


        this.linkStroke = function (d) {
            return PRES.color[d.type];
        };


        this.linkStrokeWidth = function (d) {
            if (ABSTR.linkFilters[d.type].state) {
                if (ABSTR.sizeFilters.links.state)
                    return Math.sqrt(d.evalpos-d.evalneg);
                else
                    return Math.sqrt(6);
            } else {
                return 0;
            }
        };


        this.mousemove = function (d) {
			if (creatinglink){
				var nodes = PRES.force.nodes();
				var index = searchhash(nodes,PRES.clickednodehash);
			    var linecolor = PRES.color[document.getElementById("replylinktype2").value];
				
				var x1 = nodes[index].x+10,
					y1 = nodes[index].y+10,
					x2 = (d3.mouse(svg)[0]-despx)/zoomval,
					y2 = (d3.mouse(svg)[1]-despy)/zoomval;
					
				var cutx = 5*(x2-x1)/(Math.abs(x2-x1)+1),
					cuty = 5*(y2-y1)/(Math.abs(y2-y1)+1);
				
				PRES.prelink
					.attr("x1", x1)
					.attr("y1", y1)
					.attr("x2", x2-cutx)
					.attr("y2", y2-cuty)
					.style("stroke", linecolor);
			}
			// TEST show coordinates in contbox
			// document.getElementById("contbox").value = 
				// "mouse: "+ d3.mouse(svg) + "\n"+
				 // "\n" +
				// "desp x p: " + Math.round(despxp) + "\n" +
				// "desp y p: " + Math.round(despyp) + "\n" +
				 // "\n" +
				// "trans 0: " + trans[0] + "\n" +
				// "trans 1: " + trans[1] + "\n" +
				 // "\n" +
				 // "desp x z: " + Math.round(despxz) + "\n" +
				// "desp y z: " + Math.round(despyz) + "\n" +
				// "\n" +
				// "scale: " + scale + "\n" +				
				// "oldscale: " + oldscale + "\n" +
				// "zoomval: " + zoomval + "\n"
				// ;  
			
		};

		
		
        this.mouseover = function (d) {

			var fillopacity = 	PRES.svg.selectAll(".node")
						.filter(function (e) {return e.hash == d.hash;})
						.style("fill-opacity");	
								
			if (fillopacity == 0){return};
			
			if (PRES.clickednodehash === "") {
                PRES.svg.selectAll(".node")
                    .style("stroke", PRES.bordercolor.normal);
				
				PRES.svg.selectAll(".node")
					.filter(function (d) {return d.origin == "1";})
					.style("stroke",PRES.bordercolor.origin);

				// this line below is the node where the mouse is over			
				d3.select(this)
//					.transition().duration(250)
					.style("stroke", PRES.bordercolor.over);
						
				document.getElementById("contbox").value = "[" + ABSTR.nodeFilters[d.type].name + "]" + "\n\n" + d.content + "\n\n" +"[by " +d.author+"]";
			}
        };

        this.mousedown = function (d) {
			if (!creatinglink){
				PRES.svg.selectAll(".node")
					.style("stroke", PRES.bordercolor.normal);
				
				PRES.svg.selectAll(".node")
					.filter(function (d) {return d.origin == "1";})
					.style("stroke",PRES.bordercolor.origin);
					
				PRES.clickednodehash = "";
				
				document.getElementById("contbox").value = "";
				$('#rightpaneleval').html(" ");
				$('#rightpanel').html(" ");
				replying = false;
			};
        };

        this.click = function (d) {
	    if (creatinglink){
			if (d.hash !== PRES.clickednodehash){
				savelink(d);
			}
		}else{
			var fillopacity = 	PRES.svg.selectAll(".node")
								.filter(function (e) {return e.hash == d.hash;})
								.style("fill-opacity");	
								
			if (fillopacity == 0){return};

			PRES.svg.selectAll(".node")
				.style("stroke", PRES.bordercolor.normal);
	
			PRES.svg.selectAll(".node")
				.filter(function (d) {return d.origin == "1";})
				.style("stroke",PRES.bordercolor.origin);
			
			// this line below is the clicked node
			d3.select(this)
				.style("stroke", PRES.bordercolor.clicked);
	
			PRES.clickednodehash = d.hash;
			
			$('#rightpaneleval').html(rightpanelhtmleval);
			$('#rightpanel').html(rightpanelhtmlreplyandlink);
			
			document.getElementById("contbox").value = "[" + ABSTR.nodeFilters[d.type].name + "]" + "\n\n" + d.content+"\n\n" + "[by " +d.author +"]";
			document.getElementById("posvotes").innerHTML = d.evalpos;
			document.getElementById("negvotes").innerHTML = d.evalneg;
			
		};
        
		};
    };
		// end of this == LiveAttributes

    // update functions (svg, nodes and links)

    function updateLinks(PRES) {
        PRES.svg.selectAll(".link").style("stroke-width", PRES.liveAttributes.linkStrokeWidth);
    };

    function updateNodes(PRES) {
        PRES.svg.selectAll(".node").style("fill-opacity", PRES.liveAttributes.nodeOpacityAndSetConnectedLinkOpacity);
        PRES.svg.selectAll(".node").style("stroke-width", PRES.liveAttributes.nodeStrokeWidth);
        PRES.svg.selectAll(".node").attr("width", PRES.liveAttributes.nodeWidth);
        PRES.svg.selectAll(".node").attr("height", PRES.liveAttributes.nodeHeight);
    };

    this.update = function () {
        updateLinks(this);
        updateNodes(this);
    };
	
};
// End of this == presentation

function savenode() {
	if (document.getElementById("replybox").value == ""){
		alert("An empty reply can not be saved");
		return;
	}
    var PRES = Visualisations.visualisations[0].presentation;
    createnode(PRES);
    //+ call to export fuctions
};


function hideshowlegend() {

    var PRES = Visualisations.visualisations[0].presentation;
    var legend_bar = document.getElementById("legend_bar");

    PRES.showlegend = !PRES.showlegend;

    this.legendfiltersupdate();

};


function hideshowfilters() {

    var PRES = Visualisations.visualisations[0].presentation;
    var lower_bar = document.getElementById("lower_bar");

    PRES.showfilters = !PRES.showfilters;

    this.legendfiltersupdate();
};

function legendfiltersupdate() {

    var PRES = Visualisations.visualisations[0].presentation;
    var lower_bar = document.getElementById("lower_bar");
    var legend_bar = document.getElementById("legend_bar");

    if (PRES.showfilters && PRES.showlegend) {
	legend_bar.style.height = "100px";
	lower_bar.style.height = "100px";
	legend_bar.style.bottom = "100px";
    } else if (!PRES.showfilters && PRES.showlegend) {    
	legend_bar.style.height = "100px";
	lower_bar.style.height = "19px";
	legend_bar.style.bottom = "19px";
    } else if (PRES.showfilters && !PRES.showlegend) {    
	legend_bar.style.height = "19px";
	lower_bar.style.height = "100px";
	legend_bar.style.bottom = "100px";
    } else  {   
	legend_bar.style.height = "19px";
	lower_bar.style.height = "19px";
	legend_bar.style.bottom = "19px";
    }

};

	
function createnode(PRES){
		    
    var nodes = PRES.force.nodes();
    var links = PRES.force.links();

    var content = document.getElementById("replybox").value;
    var nodetype = document.getElementById("replynodetype").value;
    var linktype = document.getElementById("replylinktype").value;
    
    var targetindex = searchhash(nodes, PRES.clickednodehash), 
    targetnode = nodes[targetindex];
	
	var author = document.getElementById("namebox").value;
	if (author == ""){author = "anonymous";};
    
    var newnode = {
 // elements and order adapted to be the same as in modelb.js
        "hash": nodes.length,
        "content": content,
        "evalpos": 0,
		"evalneg": 0,
        "evaluatedby": [],
        "type": nodetype,
        "author": author,
        "time": Date.now(),
        x: targetnode.x,
        y: targetnode.y
    };
    
    nodes.push(newnode);
	links.push({source: newnode, target: targetnode,"evalpos":6,"evalneg":0,"evaluatedby": [],"type":linktype,"author": author,"time": "17-abr-2013"});
    
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
	.style("stroke-width", PRES.liveAttributes.linkStrokeWidth);
    
    var node = PRES.svg.selectAll(".node")
        .data(nodes)
        .enter().append("rect")
        .attr("class", "node")
        .attr("x", function (d) {return d.x;})
        .attr("y", function (d) {return d.y;})
		.attr("width", PRES.liveAttributes.nodeWidth)
		.attr("height", PRES.liveAttributes.nodeHeight)
		.style("fill", PRES.liveAttributes.nodeFill)
		.on("mouseover", PRES.liveAttributes.mouseover)
		.on("click", PRES.liveAttributes.click)
        .call(PRES.force.drag)
    
    //PRES.svg.selectAll(".node").on('mousedown.drag', null);
    
    PRES.force.start();
};

function evalpos(){
	evalnode("pos");
}

function evalneg(){
	evalnode("neg");
}

function evalnode(vote) {
    var PRES = Visualisations.visualisations[0].presentation;   
	
	var nodes = PRES.force.nodes();
    var links = PRES.force.links();
  
    var targetindex = searchhash(nodes, PRES.clickednodehash);
    targetnode = nodes[targetindex];
	
    var name = document.getElementById("namebox").value;    
    if (name == ""){name = "anon";}
	
	if($.inArray(name, targetnode.evaluatedby) > -1){
	
		alert("You have already voted this node");
		
	} else{
	
		targetnode.evaluatedby.push(name);
		
		if (vote=="pos"){
			targetnode.evalpos = targetnode.evalpos+1; 
			document.getElementById("posvotes").innerHTML = targetnode.evalpos;
		}else{
			targetnode.evalneg = targetnode.evalneg+1;
			document.getElementById("negvotes").innerHTML = targetnode.evalneg;
		}
	
		PRES.svg.selectAll(".node")
			.filter(function (d) {return d.hash == PRES.clickednodehash;})
			.transition().duration(1000).ease("elastic")
			.attr("width", PRES.liveAttributes.nodeWidth)
			.attr("height", PRES.liveAttributes.nodeHeight);   
	}
};

function showreplypanel(){
	cancellink();

		$('#rightpanel').html(rightpanelhtmlreplyandlink + rightpanelhtmlreply);	
//		document.getElementById("replybox").value = ".";  //***** TEST LINE - to avoid de alert of empty reply
		replying = true;
		document.getElementById("namebox2").value = document.getElementById("namebox").value;
		button = document.getElementById("showreply");
		button.setAttribute("style", "box-shadow: inset 1px 1px 2px 1px rgba(0, 0, 0, 0.5);");
}

function hidereplypanel(){
	document.getElementById("replybox").value = "";  
	 replying = false; 
	 $('#rightpanel').html(rightpanelhtmlreplyandlink);	
}


function showcreatelink(){
	if (creatinglink){
		cancellink();
	}else{
		$('#rightpanel').html(rightpanelhtmlreplyandlink + rightpanelhtmllink);
		creatinglink = true;
		button = document.getElementById("showlink");
		button.setAttribute("style", "box-shadow: inset 1px 1px 2px 1px rgba(0, 0, 0, 0.5);");
	}
}

function cancellink(){
	$('#rightpanel').html(rightpanelhtmlreplyandlink);
	
	var PRES = Visualisations.visualisations[0].presentation;
	PRES.prelink 
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", 0)
		.attr("y2", 0);
		
	creatinglink = false;
}
	
function savelink(d){

    var PRES = Visualisations.visualisations[0].presentation;

    var nodes = PRES.force.nodes();
    var links = PRES.force.links();

    var linktype = document.getElementById("replylinktype2").value;
    
    var sourceindex = searchhash(nodes, PRES.clickednodehash);
    sourcenode = nodes[sourceindex];
	
    var author = document.getElementById("namebox").value;
    if (author == ""){author = "anonymous";};
	
    links.push({source: sourcenode, target: d, "evalpos":6, "evalneg":0,"evaluatedby": [],"type":linktype,"author": author,"time": Date.now()});
	
    var link = PRES.svg.selectAll(".link")
        .data(links)
        .enter().insert("line",".node")
        .attr("class", "link")
	.style("stroke", PRES.liveAttributes.linkStroke)
	.style("stroke-width", PRES.liveAttributes.linkStrokeWidth);
		
    cancellink();
		
    PRES.force.start();
		
}

function changelinktype(){

	var PRES = Visualisations.visualisations[0].presentation;
    var linecolor = PRES.color[document.getElementById("replylinktype2").value];

	PRES.prelink.style("stroke", linecolor);
}

// Start of control

function rescale() {
	
    var PRES = Visualisations.visualisations[0].presentation;
	
    trans=d3.event.translate;
    scale=d3.event.scale;
	
	if (scale == oldscale){  //no mousewheel movement
	
		despxp = trans[0]-transxz;
		despyp = trans[1]-transyz;
		
		var transtime = 0;
		
	} else {	
		if (scale > oldscale){
			if (zoomval*1.5 < zoommax){zoomval *= 1.5;}
		} else {
			if (zoomval/1.5 > zoommin){zoomval /= 1.5;}
		}
		
		despxz = PRES.width*(1-zoomval)/2;
		despyz = PRES.height*(1-zoomval)/2;
		
		transxz = trans[0]-despxp;
		transyz = trans[1]-despyp;
		
		oldscale = scale;
		var transtime = 200;
		
		console.log(d3.mouse(this));
	}
		
	despx = despxz + despxp;
	despy = despyz + despyp;
		

	PRES.svg
		.transition().duration(transtime)
		.attr("transform", "translate(" + despx + ',' + despy + ") scale(" + zoomval + ")");
}


function zoomin(){
	var PRES = Visualisations.visualisations[0].presentation;
	var nodes = PRES.force.nodes();
	
	zoomval *= 1.5;
	
	despxz = PRES.width*(1-zoomval)/2;
	despyz = PRES.height*(1-zoomval)/2;
	
	despx = despxz + despxp;
	despy = despyz + despyp;
	
    PRES.svg
	.transition().duration(200)
	.attr("transform","translate(" + despx + ',' + despy + ") scale(" + zoomval + ")");
}

function zoomout(){
	var PRES = Visualisations.visualisations[0].presentation;
	var nodes = PRES.force.nodes();
	
	zoomval /= 1.5;
	
	despxz = PRES.width*(1-zoomval)/2;
	despyz = PRES.height*(1-zoomval)/2;
	
	despx = despxz + despxp;
	despy = despyz + despyp;
	
    PRES.svg
	.transition().duration(200)
	.attr("transform","translate(" + despx + ',' + despy + ") scale(" + zoomval + ")");
}


function mousemove(){}

function mousedown(){}

function mouseup(){}

// **** TEST FUNCTIONS (triggered by test buttons in the right-bar-header) *****************

function test1(){
	//document.getElementById("contbox").value = "Holaa";
	
	var PRES = Visualisations.visualisations[0].presentation;
	
	var nodes = PRES.force.nodes();

    var content = document.getElementById("replybox").value;
    var nodetype = document.getElementById("replynodetype").value;
	
	var author = document.getElementById("namebox").value;
	if (author == ""){author = "anonymous";};
    
    var newnode = {
 // elements and order adapted to be the same as in modelb.js
        "hash": nodes.length,
        "content": content,
        "evalpos": 0,
		"evalneg": 0,
        "evaluatedby": "",
        "type": nodetype,
        "author": author,
        "time": Date.now(),
        x: 600,
        y: 300
    };
    
    nodes.push(newnode);
    
	hidereplypanel();
    
    drawnewnodes(PRES);
}

function test2(){}

function test3(){}

function ZoomOut_Control(VIS, ABSTR, PRES) {};
// End of var ZoomOut