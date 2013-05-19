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
     

	//defines the html content of the visualization (except the header, defined in index-main)
    this.init = function (html5node) {
        this.scaler = new Scaler(this);
        this.container = html5node;
		
//**different tries of inserting the html content from an external file....
//		var html = document.open('initialmenu.html');
//		html5node.innerHTML = html;
		
//		html5node.innerHTML ='<object type="html" data="initialmenu.html"></object>';

// 		$('#html5node').load('initialmenu.html');
		
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
								<div class="big_button" onclick="bt_sandbox()">Sandbox</div>   \
								<div class="big_label noselect">Learn, explore, experiment</div>   \
							   </center>   \
							 </div>   \
							<div class="big_panel noselect">    \
							  <center>  \
								<div class="big_button" onclick="bt_create()">Create</div>   \
								<div class="big_label noselect">Start a new conversation</div>   \
							  </center>   \
							</div>   \
							<div class="big_panel noselect">    \
							  <center>  \
								<div class="big_button" onclick="bt_join()">Participate</div>   \
								<div class="big_label noselect">Join an existing conversation</div>   \
							  </center>   \
							</div>   \
						 </center>   \
					  </div>  \
						\
						  <div id="join_panel" class="huge_panel_2 noselect">   \
							<div class="conv_select_panel noselect">  \
							  <div id="selectconversation"></div>  \
							</div>  \
						  <center>   \
							<br><br><br>-OR- \
							<br><br><b>Insert a conversation code:</b>&nbsp<textarea id="conv_code" class="areaname"></textarea>  \
							<br><br>-OR-  \
							<br><br><b>Import a local conversation:</b>&nbsp<div id="convImport"></div>  \
						  </center>   \
							<div class="bt_panel noselect">  \
								<center>  \
									<div id="bt_join_ok" onclick="bt_join_ok()" class="conv_ok button">OK</div>  \
									<div id="bt_join_cancel" onclick="bt_cancel()" class="conv_cancel button">Cancel</div>  \
								</center>  \
							</div>  \
						  </div>   \
						  \
						  <div id="new_panel" class="huge_panel_3 noselect">   \
						    <div class="new_header noselect">Introduce a title for the conversation</div>  \
							<textarea id="new_title" class="new_title" spellcheck="false"></textarea> \
							<br>  \
							<br>  \
							<div class="new_header noselect">Write your first thought about it</div>  \
							<textarea id="new_firstcomment" class="new_first" spellcheck="false"></textarea> \
							<br>  \
							<br>  \
							<center>  \
								<div class="new_name_header noselect">Your name</div>  \
								<textarea id="new_name" class="new_name" spellcheck="false"></textarea> \
							</center>  \
							<div class="bt_panel noselect">  \
								<center>  \
									<div id="bt_new_vok" onclick="bt_new_ok()" class="conv_ok button">OK</div>  \
									<div id="bt_new_cancel" onclick="bt_cancel()" class="conv_cancel button">Cancel</div>  \
								</center>  \
							</div>  \
						  </div>   \
                  </div>   \
             </div>  \
			 ' 
			 
		OpenSave.addImportListener( $( "#convImport" )[0], ".xml,.json,application/x-incoma", loadModelFile );
		
		//hides the "menu" and "export" options from the header
	 	document.getElementById("headerMenu").setAttribute("style","visibility:hidden;");
	 	document.getElementById("headerExport").setAttribute("style","visibility:hidden;");
		
		//move all the menu panels to their initial position
		document.getElementById("menu_panel").setAttribute("style", "left: 0%");
		document.getElementById("join_panel").setAttribute("style", "left: 130%");
		document.getElementById("new_panel").setAttribute("style", "left: 135%");
	
		// example data for the select control of the ddslick pluging
		var ddData = [
			{
				text: "Title of the conversation 1",
				value: 1,
				selected: false,
				description: "Rating: -- &nbsp&nbsp Number of thoughts: -- &nbsp&nbsp Last activity: --",
			},
			{
				text: "Title of the conversation 2",
				value: 2,
				selected: false,
				description: "Rating: -- &nbsp&nbsp Number of thoughts: -- &nbsp&nbsp Last activity: --",
			},
			{
				text: "Title of the conversation 3",
				value: 3,
				selected: false,
				description: "Rating: -- &nbsp&nbsp Number of thoughts: -- &nbsp&nbsp Last activity: --",
			},
			{
				text: "Title of the conversation 4",
				value: 4,
				selected: false,
				description: "Rating: -- &nbsp&nbsp Number of thoughts: -- &nbsp&nbsp Last activity: --",
			},
			{
				text: "Title of the conversation 5",
				value: 5,
				selected: false,
				description: "Rating: -- &nbsp&nbsp Number of thoughts: -- &nbsp&nbsp Last activity: --",
			},
			{
				text: "Title of the conversation 6",
				value: 6,
				selected: false,
				description: "Rating: -- &nbsp&nbsp Number of thoughts: -- &nbsp&nbsp Last activity: --",
			},
			{
				text: "Title of the conversation 7",
				value: 7,
				selected: false,
				description: "Rating: -- &nbsp&nbsp Number of thoughts: -- &nbsp&nbsp Last activity: --",
			},
			{
				text: "Title of the conversation 8",
				value: 8,
				selected: false,
				description: "Rating: -- &nbsp&nbsp Number of thoughts: -- &nbsp&nbsp Last activity: --",
			}
		];

			//obtains the width of join_panel (where the 'join' menu elements are) to adapt the width of the ddslick select control
			element = document.getElementById('join_panel');
			style = window.getComputedStyle(element);
			panelwidth = parseInt(style.getPropertyValue('width'))*.99;

		$('#selectconversation').ddslick({
	
		    data: ddData,
			selectText: "Select a conversation...",
			width: panelwidth,
			height:panelwidth*0.82,
			background: "#fff",
			onSelected: function(selectedData){
			//	document.getElementById("conv_info").innerHTML = "[info about conversation number " + (selectedData.selectedIndex + 1) + "]";
			}
		});
        initSVG(this, ABSTR, this.width, this.height);
    };

	//initialization and definition of the SVG and its elements (the graph with nodes, links, prelink line, the force)
    function initSVG(PRES, ABSTR, width, height) {

        PRES.force = d3.layout.force()
            .charge(-600)
			.gravity(0.1)
            .linkDistance(40)
			.theta(0.95)
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


        var graph = ABSTR.model;

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
			.transition().delay(800).duration(1000)
			.style("fill-opacity",1);
			
		PRES.links
			.style("stroke-opacity",0)
			.transition().delay(800).duration(1500)
			.style("stroke-opacity",1);	
			
		//call to force.resume() each 3 seconds in order to animate the graph
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

//functions for the different buttons of the initial menu
function bt_menu(){
    Model.clear(IncomaMenuModel);
	reInit(Visualisations.select(2));
	
	bt_cancel();
	}

function bt_sandbox(){
	clearTimeout(pulses);
    Model.clear(IncomaSandboxModel);
	document.getElementById("menu_panel").setAttribute("style", "left: 100%");
	setTimeout(function(){reInit(Visualisations.select(1));},700);
}

function bt_create(){
	document.getElementById("menu_panel").setAttribute("style", "left: -100%");
	document.getElementById("join_panel").setAttribute("style", "left: 130%");
	document.getElementById("new_panel").setAttribute("style", "left: 35%");
	
	document.getElementById("new_title").focus();
}

function bt_join(){
	document.getElementById("menu_panel").setAttribute("style", "left: -100%");
	document.getElementById("join_panel").setAttribute("style", "left: 30%");
	document.getElementById("new_panel").setAttribute("style", "left: 135%");
}

function bt_cancel(){
	document.getElementById("menu_panel").setAttribute("style", "left: 0%");
	document.getElementById("join_panel").setAttribute("style", "left: 130%");
	document.getElementById("new_panel").setAttribute("style", "left: 135%");
}

function bt_new_ok(){
	document.getElementById("new_panel").setAttribute("style", "left: -65%");
	
	clearTimeout(pulses);
	
    Model.clear(IncomaEmptyModel);
	
	content = document.getElementById("new_firstcomment").value;
	author = document.getElementById("new_name").value;
	if (author == ""){author = "anonymous"};
	
	Model.createNode(1, content, author, Date.now());
	
	setTimeout(function(){reInit(Visualisations.select(1));},700);
}


