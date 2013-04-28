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

function ZoomOut_Abstraction(VIS) {
    this.model = null;
    this.linkFilters = {
        5: {
            name: "General",
            state: true,
            typeId: 5
        },
        4: {
            name: "Agree",
            state: true,
            typeId: 4
        },
        1: {
            name: "Disagree",
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
        6: {
            name: "Similar",
            state: true,
            typeId: 6
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
    this.width = 712;
    this.height = 325;
    this.nodeSizeDefault = 20;
    
    this.bordercolor = {
        "normal": "#af0",
        "clicked": "#255",
        "over": "#E9B"
    };

    this.svg = null;
    this.color = d3.scale.category20();
    this.liveAttributes = new LiveAttributes(ABSTR, this);
    //    this.updateLinks = function() { this.definedBelow(); }
    this.update = function () {
        this.definedBelow();
    }
	
	    function save2() {
			createnode(this);
			//+ call to export fuctions
        };
		
    this.init = function (html5node) {
        this.definedBelow();
    }
    // end of public interface

    // Start of init function = change the html code (.innerHTML) inside of the html5node (adding visualization, text areas, and filters) and calls with the abstraction as a parameter: initSVG, initLinkFilters, initNodeFilters, initSizeFilters (this four will create the filters and the svg and place it in the previous html code)

    this.init = function (html5node) {
        this.container = html5node;
        html5node.innerHTML =
            '   \
             <div class="mod_up">   \
   \
                  <div id="mod_vis" class="mod">   \
                    <div class="visualization">  </div>   \
                  </div>   \
   \
                  <div id="mod_spec" class="mod">   \
                    <div class="mod_header">   \
                      <div class="mod_title">   \
                        <a id="link_spec" class="active">Content:</a>           \
                      </div>   \
                    </div>   \
    \
                    <textarea id="spec" class="areacontent" spellcheck="false"></textarea>   \
     <div id="replybox"> \
</div> \
<div id="replybox2">  \
</div> \
                  </div>   \
    \
             </div>   \
   \
             <div class="mod_down">   \
   \
                  <div class="mod_down_elems">   \
                    <div id="mod_filt_links" class="mod_filt" style="Float:left">   \
                      <b>Threads</b>    \
                    </div>   \
   \
                    <div id="mod_filt_nodes" class="mod_filt_box" style="Float:left" >   \
                      <b>Boxes</b>             \
                    </div>   \
   \
                    <div id="mod_filt_sizes" class="mod_filt_size" style="Float:left" >   \
                      <b>Sizes</b>     \
                    </div>   \
                 </div>   \
   \
             </div>   \
        '; // end of innerHTML


        initSVG(this, ABSTR, this.width, this.height);
        // 712, 325 = width and height of the visualization

        initLinkFilters(this, "mod_filt_links", ABSTR.linkFilters);
        initNodeFilters(this, "mod_filt_nodes", ABSTR.nodeFilters);
        initSizeFilters(this, "mod_filt_sizes", ABSTR.sizeFilters);
        // The initfilters take as an input parameter the id of the div where they will be placed (e.g "#mod_filt_links1"), with appendChild.

    };
    // End of init function of presentation

    // Start of initSVG = create the svg from the abstraction, and place it into the "visualization" html div tag inserted on the html5node

    function initSVG(PRES, ABSTR, width, height) {


        PRES.force = d3.layout.force()
            .charge(-400)
            .linkDistance(40)
            .size([width, height]);
        var force = PRES.force;

        PRES.svg = d3.select(".visualization").append("svg")
            .attr("width", width)
            .attr("height", height)
			.on("mousedown", PRES.liveAttributes.mousedown);
			
        var svg = PRES.svg;
        // force and svg are local to "presentation" (defined as this.force); 
        // (but we define them locally as a shorthand)
        // graph and link are local only to "initSVG" (var graph)


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
            .on("mouseout", PRES.liveAttributes.mouseout)
            .on("mousedown", PRES.liveAttributes.mousedown)
            .on("click", PRES.liveAttributes.click)
            .call(force.drag);

        node.append("title")
            .text(function (d) {
            return d.content;
        });

        force.on("tick", function () {
		
			var zz = 5;
		
		    nodez = PRES.force.nodes();
            linkz = PRES.force.links();
				
            PRES.svg.selectAll(".link")
			.attr("x1", function (d) {
                return d.source.x + 10;
            })
                .attr("y1", function (d) {
                return d.source.y + 10;
            })
                .attr("x2", function (d) {
                return d.target.x + 10;
            })
                .attr("y2", function (d) {
                return d.target.y + 10;
            });

            PRES.svg.selectAll(".node")
			.attr("x", function (d) {
                return d.x;
            })
                .attr("y", function (d) {
                return d.y;
            });
        });

    };
    // End of initSVG

    // Start of initLinkFilters = create the html from the filters, appending it (appendChild) to the right div tags

    function initLinkFilters(PRES, columnId, filterlist) {

        var numfilts = 6 ;
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
        for (var i = 1; i < numfilts+1; ++i) {
            var filter = filterlist[i];
            checkbox[i] = Visualisations.makeFilterBox(filter); 
            if (i == 1 || i == 1+1*filtsperrow || i == 1+2*filtsperrow) {
		tr = document.createElement("tr");
	    }
	    tdname = document.createElement("td");
	    tdbox = document.createElement("td");
            tdname.appendChild(Visualisations.makeText(filter.name + ": "));
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
            if (i == 1*filtsperrow || i == 2*filtsperrow || i == 3*filtsperrow ) {
		tb.appendChild(tr);
		table.appendChild(tb);
	    }

        }

	column.appendChild(table);

    };


    // Start of initNodeFilters

    function initNodeFilters(PRES, columnId, filterlist) {

        var numfilts = 3 ;
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
        for (var i = 1; i < numfilts+1; ++i) {
            var filter = filterlist[i];
	    checkbox[i] = Visualisations.makeFilterBox(filter);                         
	    if (i == 1 || i == 1+1*filtsperrow || i == 1+2*filtsperrow) {
		tr = document.createElement("tr");
	    }
	    tdname = document.createElement("td");
	    tdbox = document.createElement("td");
            tdname.appendChild(Visualisations.makeText(filter.name + ": "));
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
            if (i == 1*filtsperrow || i == 2*filtsperrow || i == 3*filtsperrow ) {
		tb.appendChild(tr);
		table.appendChild(tb);
	    }

        }

	column.appendChild(table);

    };


    // Start of initNodeFilters

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
            return PRES.color(d.type);
        };

        this.nodeHeight = function (d) {
            if (ABSTR.sizeFilters.nodes.state) {
                return nodeSizeDefault * Math.sqrt(Math.sqrt(d.evaluation));
            } else {
                return nodeSizeDefault;
            }
        };

        this.nodeWidth = function (d) {
            if (ABSTR.sizeFilters.nodes.state) {
                return nodeSizeDefault * Math.sqrt(Math.sqrt(d.evaluation));
            } else {
                return nodeSizeDefault;
            }
        };

        this.nodeHeightLarge = function (d) {
            if (ABSTR.sizeFilters.nodes.state) {
                return 25 * Math.sqrt(Math.sqrt(d.evaluation));
            } else {
                return 25;
            }
        };

        this.nodeWidthLarge = function (d) {
            if (ABSTR.sizeFilters.nodes.state) {
                return 25 * Math.sqrt(Math.sqrt(d.evaluation));
            } else {
                return 25;
            }
        };


        this.nodeOpacityAndSetConnectedLinkOpacity = function (d) {
            if (ABSTR.nodeFilters[d.type].state) {

                return "1";
            } else {
                nodehash = d.hash;
                PRES.svg.selectAll(".link")
                    .filter(function (d) {
                    return d.ssource == nodehash;
                })
                    .style("stroke-width", function (d) {
                    return 0;
                });
                PRES.svg.selectAll(".link")
                    .filter(function (d) {
                    return d.ttarget == nodehash;
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
            return PRES.color(d.type);
        };


        this.linkStrokeWidth = function (d) {
            if (ABSTR.linkFilters[d.type].state) {
                if (ABSTR.sizeFilters.links.state)
                    return Math.sqrt(d.evaluation);
                else
                    return Math.sqrt(6);
            } else {
                return 0;
            }
        };



        this.mouseover = function (d) {

		    if (PRES.clickednodehash === "") {
                PRES.svg.selectAll(".node")
                    .style("stroke-width", function (d) {return "2px";})
                    .style("stroke", PRES.bordercolor.normal);
					
				d3.select(this)
//					.transition().duration(250)
					.style("stroke-width", function (d) {return "2px";})
                    .style("stroke", PRES.bordercolor.over);

                document.getElementById("spec").value = d.content;
            }
        };

        this.mousedown = function (d) {
			PRES.svg.selectAll(".node")
                .style("stroke", PRES.bordercolor.normal);
				
			PRES.clickednodehash = "";
			
			document.getElementById("spec").value = "";
           document.getElementById("spec2").value = "";
			$('#replybox2').html(" ");
        };

        this.mouseout = function (d) {};


        this.click = function (d) {
			PRES.svg.selectAll(".node")
                .filter(function (d) {return d.hash == PRES.clickednodehash;})
                .style("stroke", PRES.bordercolor.normal);
			
			d3.select(this)
                .style("stroke", PRES.bordercolor.clicked);
			
			PRES.clickednodehash = d.hash;

			document.getElementById("spec").value = d.content;
			
            $('#replybox2').html("Box type: <select id=\"replynodetype\"> <option value=1>General</option><option value=2>Question</option><option value=3>Answer</option> <option value=4>Opinion</option><option value=5>Proposal</option><option value=6>Info</option></select>    Thread: <select id=\"replylinktype\"> <option value=5>General</option><option value=4>Agree</option><option value=1>Disagree</option> <option value=2>Question</option><option value=3>Answer</option><option value=6>Similar</option></select><br><textarea id='spec2' class='areareply' spellcheck='false'></textarea><div class='save' onClick='save()'>Save</div>");
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
        function save() {
			var PRES = Visualisations.visualisations[0].presentation;
			createnode(PRES);
			//+ call to export fuctions
        };
		
		function createnode(PRES){
		    
			var nodes = PRES.force.nodes();
            var links = PRES.force.links();

            var content = document.getElementById("spec2").value;
			var nodetype = document.getElementById("replynodetype").value;
			var linktype = document.getElementById("replylinktype").value;
			
			var targetindex = searchhash(nodes, PRES.clickednodehash), 
				targetnode = nodes[targetindex];
				
            var newnode = {
                x: targetnode.x,
                y: targetnode.y,
                "hash": nodes.length + 2,
                "content": content,
                "evaluation": 1,
                "type": nodetype,
                "author": "Mike",
                "time": "17-abr-2013"
            };
			
            nodes.push(newnode);
            links.push({source: newnode, target: targetnode,"type":linktype,"evaluation":6});

			document.getElementById("spec2").value = "";
			
            restart(PRES);
		}
		
		function searchhash(elements, objective){
			for (i=0;i<elements.length;i++){
				if (elements[i].hash == objective){return i;}
			};
		}
		
		 function restart(PRES) {

			var nodes = PRES.force.nodes();
            var links = PRES.force.links();

            var link = PRES.svg.selectAll(".link")
                .data(links)
                .enter().append("line")
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
				.on("mouseout", PRES.liveAttributes.mouseout)
				.on("mousedown", PRES.liveAttributes.mousedown)
				.on("click", PRES.liveAttributes.click)
                .call(PRES.force.drag);
					
			PRES.svg.selectAll(".node")
				.on('mousedown.drag', null);

            PRES.force.start();
        };

// Start of control

function ZoomOut_Control(VIS, ABSTR, PRES) {};
// End of var ZoomOut