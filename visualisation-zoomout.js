Visualisations.register(new ZoomOut());

function ZoomOut() {

    this.name = "Zoom Out",
    this.abstraction = new ZoomOut_Abstraction(this);
    this.presentation = new ZoomOut_Presentation(this, this.abstraction);
    this.control = new ZoomOut_Control(this, this.abstraction, this.presentation);
    
    this.init = function(html5node, model) {
        this.abstraction.init(model);
        this.presentation.init(html5node);        
    }

    this.destroy = function() {}

}

// Start of this == abstraction = model and state of filters [abstraction initialized with (model)]
    
function ZoomOut_Abstraction(VIS) {
    this.model = null;
    this.linkFilters = { 
                   5: { name: "General", state: true, typeId: 5 },
                   4: { name: "Agree", state: true, typeId: 4 },
                   1: { name: "Disagree", state: true, typeId: 1 },
                   2: { name: "Question", state: true, typeId: 2 },
                   3: { name: "Answer", state: true, typeId: 3 },
                   6: { name: "Similar", state: true, typeId: 6 },
                 };
    this.nodeFilters = {
                   1: { name: "General", state: true, typeId: 1 },
                   2: { name: "Question", state: true, typeId: 2 },
                   3: { name: "Answer", state: true, typeId: 3 },
                 };
    this.sizeFilters = {
                   nodes: { name: "Boxes", state: true },
                   links: { name: "Threads", state: true },
                 };
    this.init = function(model) {
        this.model = model;
    }
};
    
// End of this == abstraction
    
// Start of this == presentation [initialized with (html5node, abstraction)]

function ZoomOut_Presentation(VIS, ABSTR) {
    // public interface
    this.container = null;
    this.width = 712;
    this.height = 325;
    this.svg = null;
    this.color = d3.scale.category20();
    this.liveAttributes = new LiveAttributes(ABSTR, this);
    this.updateLinks = function() { this.definedBelow(); }
    this.update = function() { this.definedBelow(); }
    this.init = function(html5node) { this.definedBelow(); }
    // end of public interface

        // Start of init function = change the html code (.innerHTML) inside of the html5node (adding visualization, text areas, and filters) and calls with the abstraction as a parameter: initSVG, initLinkFilters, initNodeFilters, initSizeFilters (this four will create the filters and the svg and place it in the previous html code)

    this.init = function(html5node) {
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
                      <div class="mod_ctrls">   \
                        <input type="button" value="Clear" onclick="javascript:eraseText();"> </input>   \
                      </div>   \
                      <div class="mod_title">   \
                        <a id="link_spec" class="active">Content:</a>           \
                      </div>   \
                    </div>   \
    \
                    <textarea id="spec" class="areacontent" spellcheck="false"></textarea>   \
    \
                  </div>   \
    \
             </div>   \
   \
             <div class="mod_down">   \
   \
                  <div class="mod_down_elems">   \
                    <div id="mod_filt_links1" class="mod_filt" style="Float:left">   \
                      <b>Threads</b> <br />   \
                    </div>   \
   \
                    <div id="mod_filt_links2" class="mod_filt" style="Float:left" >   \
                      </br>            \
                    </div>   \
   \
                    <div id="mod_filt_nodes" class="mod_filt_box" style="Float:left" >   \
                      <b>Boxes</b> <br />            \
                    </div>   \
   \
                    <div id="mod_filt_sizes" class="mod_filt_size" style="Float:left" >   \
                      <b>Sizes</b> <br />    \
                    </div>   \
                 </div>   \
   \
             </div>   \
        ' ;   // end of innerHTML
        
            initSVG(this, ABSTR, this.width, this.height);
              // 712, 325 = width and height of the visualization

            initLinkFilters(this, $( "#mod_filt_links1" ), $( "#mod_filt_links2" ), ABSTR.linkFilters);
            initNodeFilters(this, $( "#mod_filt_nodes" ), ABSTR.nodeFilters);
            initSizeFilters(this, $( "#mod_filt_sizes" ), ABSTR.sizeFilters);
              // The initfilters take as an input parameter the id of the div where they will be placed (e.g "#mod_filt_links1"), with appendChild.

        };
        // End of init function of presentation
        
        // Start of initSVG = create the svg from the abstraction, and place it into the "visualization" html div tag inserted on the html5node
        function initSVG (PRES, ABSTR, width, height) {

            PRES.force = d3.layout.force()
                .charge(-400)
                .linkDistance(40)
                .size([width, height]);
            var force = PRES.force;

            PRES.svg = d3.select(".visualization").append("svg")
                    .attr("width", width)
                    .attr("height", height);
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
//                    .on("mouseover", mouseover)
//                    .on("mouseout", mouseout)
                    .call(force.drag);

            node.append("title")
                .text(function(d) { return d.content; });

            force.on("tick", function() {
                link.attr("x1", function(d) { return d.source.x+10; })
                    .attr("y1", function(d) { return d.source.y+10; })
                    .attr("x2", function(d) { return d.target.x+10; })
                    .attr("y2", function(d) { return d.target.y+10; });

                node.attr("x", function(d) { return d.x; })
                    .attr("y", function(d) { return d.y; });
            });
        };
        // End of initSVG

        // Start of initLinkFilters = create the html from the filters, appending it (appendChild) to the right div tags
        function initLinkFilters(PRES, columnLeft, columnRight, filterlist) {
            var half = (filterlist.length+1) / 2;
            for (var i = 0; i < filterlist.length; ++i) {
                var filter = filterlist[i];
                var checkbox = makeFilterBox(filter);
                if (i < half) {
                    columnLeft.appendChild(Visualisations.makeBR());
                    columnLeft.appendChild(Visualisations.makeText(filter.name + ": "));
                    columnLeft.appendChild(checkbox);
                }
                else {
                    columnRight.appendChild(Visualisations.makeBR());
                    columnRight.appendChild(Visualisations.makeText(filter.name + ": "));
                    columnRight.appendChild(checkbox);
                }
                checkbox.click = function(e) { filter.state = !filter.state; 
                                               PRES.updateLinks(); }
            }
        };
        

        
        // functions that return the right style of each element (considering filters)
        
        function LiveAttributes(ABSTR, PRES) {

            this.nodeFill = 
                function(d) {
                    return PRES.color(d.type);
                };
                
            this.nodeHeight =
                function(d) {
                    if (ABSTR.sizeFilters.nodes.state) {
                        return 20 * Math.sqrt(Math.sqrt(d.evaluation));
                    }
                    else {
                        return 20;
                    }
                }; 
                
            this.nodeWidth =
                function(d) {
                    if (ABSTR.sizeFilters.nodes.state) {
                        return 20 * Math.sqrt(Math.sqrt(d.evaluation));
                    }
                    else {
                        return 20;
                    }
                };
                        
            this.linkStroke =
                function(d) {
                    return PRES.color(d.type);
                };
                       
 
            this.linkStrokeWidth =
                function(d) {
                    if (ABSTR.linkFilters[d.type].state) {
                        if (ABSTR.sizeFilters.links.state)
                            return Math.sqrt(d.evaluation);
                        else
                            return Math.sqrt(6);
                    }
                    else
                    {
                        return 0;
                    }
                };
        };
        // end of this == LiveAttributes
        
        // update functions (svg, nodes and links)
        
        this.updateLinks = function() {
            this.svg.selectAll(".link").style("stroke-width", this.liveAttributes.linkStrokeWidth);
        };
        
        this.update = function() {
            this.updateLinks();
            this.updateNodes();
        };
    };
// End of this == presentation
    
// Start of control

function ZoomOut_Control(VIS, ABSTR, PRES) {
};
// End of var ZoomOut


//// functions erasetext, mouseover, mouseout, hideboxes, showboxes, hidelinks, showlinks
////  initNodeFilters, initSizeFilters
           