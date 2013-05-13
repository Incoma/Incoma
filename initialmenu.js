Visualisations.register(new InitialMenu());

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
                                               
    this.color = ["#000000", "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
                                                    
    this.liveAttributes = new LiveAttributes(ABSTR, this);
	
    this.update = function () {
        this.definedBelow();
    }
	
		
    this.init = function (html5node) {
        this.definedBelow();
    }
     

    this.init = function (html5node) {
        this.scaler = new Scaler(this);
        this.container = html5node;
		
//		var html = document.open('initialmenu.html');
//		html5node.innerHTML = html;
		
//		html5node.innerHTML ='<object type="html" data="initialmenu.html"></object>';

// 		$('#html5node').load('initialmenu.html');
		
        html5node.innerHTML =
            '   \
              <div class="svg_and_right_bar" >   \
			  \
				  <div id="svg" style="Float:left">   \
                    <div class="svg">  </div>   \
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
							<div id="conv_info" class = "conv_info noselect"></div>  \
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

		
		// example data for the select conversation
		var ddData = [
			{
				text: "Title of the conversation 1",
				value: 1,
				selected: false,
				description: "Rating: -- &nbsp&nbsp Number of thoughts: -- &nbsp&nbsp Last activity: --",
				imageSrc: "http://dl.dropbox.com/u/40036711/Images/facebook-icon-32.png"
			},
			{
				text: "Title of the conversation 2",
				value: 2,
				selected: false,
				description: "Rating: -- &nbsp&nbsp Number of thoughts: -- &nbsp&nbsp Last activity: --",
				imageSrc: "http://dl.dropbox.com/u/40036711/Images/twitter-icon-32.png"
			},
			{
				text: "Title of the conversation 3",
				value: 3,
				selected: false,
				description: "Rating: -- &nbsp&nbsp Number of thoughts: -- &nbsp&nbsp Last activity: --",
				imageSrc: "http://dl.dropbox.com/u/40036711/Images/linkedin-icon-32.png"
			},
			{
				text: "Title of the conversation 4",
				value: 4,
				selected: false,
				description: "Rating: -- &nbsp&nbsp Number of thoughts: -- &nbsp&nbsp Last activity: --",
				imageSrc: "http://dl.dropbox.com/u/40036711/Images/foursquare-icon-32.png"
			},
			{
				text: "Title of the conversation 5",
				value: 5,
				selected: false,
				description: "Rating: -- &nbsp&nbsp Number of thoughts: -- &nbsp&nbsp Last activity: --",
				imageSrc: "http://dl.dropbox.com/u/40036711/Images/facebook-icon-32.png"
			},
			{
				text: "Title of the conversation 6",
				value: 6,
				selected: false,
				description: "Rating: -- &nbsp&nbsp Number of thoughts: -- &nbsp&nbsp Last activity: --",
				imageSrc: "http://dl.dropbox.com/u/40036711/Images/twitter-icon-32.png"
			},
			{
				text: "Title of the conversation 7",
				value: 7,
				selected: false,
				description: "Rating: -- &nbsp&nbsp Number of thoughts: -- &nbsp&nbsp Last activity: --",
				imageSrc: "http://dl.dropbox.com/u/40036711/Images/linkedin-icon-32.png"
			},
			{
				text: "Title of the conversation 8",
				value: 8,
				selected: false,
				description: "Rating: -- &nbsp&nbsp Number of thoughts: -- &nbsp&nbsp Last activity: --",
				imageSrc: "http://dl.dropbox.com/u/40036711/Images/foursquare-icon-32.png"
			}
		];

		$('#selectconversation').ddslick({
		    data: ddData,
			selectText: "Select a conversation...",
			width:475,
			height:380,
			background: "#fff",
			onSelected: function(selectedData){
				document.getElementById("conv_info").innerHTML = "[info about conversation number " + (selectedData.selectedIndex + 1) + "]";
			}
		});

        initSVG(this, ABSTR, this.width, this.height);


    };


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
			.transition().delay(1000).duration(1500)
			.style("fill-opacity",1);
			
		PRES.links
			.style("stroke-opacity",0)
			.transition().delay(1000).duration(2000)
			.style("stroke-opacity",1);	
			
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

function bt_menu(){
    Model.clear(IncomaMenuModel);
	reInit(Visualisations.select(2));
	
	bt_cancel();
	}

function bt_sandbox(){
	clearTimeout(pulses);
    Model.clear(IncomaSandboxModel);
	reInit(Visualisations.select(1));
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
	document.getElementById("menu_panel").setAttribute("style", "left: 0%");
	document.getElementById("join_panel").setAttribute("style", "left: 130%");
	document.getElementById("new_panel").setAttribute("style", "left: 135%");
	
	clearTimeout(pulses);
	
    Model.clear(IncomaEmptyModel);
	
	content = document.getElementById("new_firstcomment").value;
	author = document.getElementById("new_name").value;
	if (author == ""){author = "anonymous"};
	
	Model.createNode(1, content, author, Date.now());
	
	reInit(Visualisations.select(1));
}


