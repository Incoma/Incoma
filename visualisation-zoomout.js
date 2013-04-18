var ZoomOut = {
    name: "Zoom Out",


// Start of abstraction = model and state of filters [abstraction initialized with (model)]
    
    abstraction: { model: null,
        linkFilters: { 
                       5: { name: "General", state: true, typeId: 5 },
                       4: { name: "Agree", state: true, typeId: 4 },
                     },
        nodeFilters: {
                       1: { name: "General", state: true, typeId: 1 },
                       2: { name: "Question", state: true, typeId: 2 },
                     },
        sizes:       {
                       nodes: { name: "Boxes", state: true },
                       links: { name: "Threads", state: true },
                     },
        init: function(model) {
            this.model = model;
        }
                     
    },

// End of abstraction
    
// Start of presentation [initialized with (html5node, abstraction, control)]

    presentation: { container: null, 

        // Start of init function = change the html code (.innerHTML) inside of the html5node (adding visualization, text areas, and filters) and calls with the abstraction as a parameter: initSVG, initLinkFilters, initNodeFilters, initSizeFilters (this four will create the filters and the svg and place it in the previous html code)

        init: function(html5node, abstraction, control) {
            this.container = html5node;
            this.abstraction = abstraction;
            html5node.innerHTML = '
             <div class="mod_up">

                  <div id="mod_vis" class="mod">
                    <div class="visualization">  </div>
                  </div>

                  <div id="mod_spec" class="mod">
                    <div class="mod_header">
                      <div class="mod_ctrls">
                        <input type="button" value="Clear" onclick="javascript:eraseText();"> </input>
                      </div>
                      <div class="mod_title">
                        <a id="link_spec" class="active">Content:</a>         
                      </div>
                    </div>
 
                    <textarea id="spec" class="areacontent" spellcheck="false"></textarea>
 
                  </div>
 
             </div>

             <div class="mod_down">

                  <div class="mod_down_elems">
                    <div id="mod_filt_links1" class="mod_filt" style="Float:left">
                      <b>Threads</b> <br />
                    </div>

                    <div id="mod_filt_links2" class="mod_filt" style="Float:left" >
                      </br>         
                    </div>

                    <div id="mod_filt_nodes" class="mod_filt_box" style="Float:left" >
                      <b>Boxes</b> <br />         
                    </div>

                    <div id="mod_filt_sizes" class="mod_filt_size" style="Float:left" >
                      <b>Sizes</b> <br /> 
                    </div>
                 </div>

             </div>

        ' ;   // end of innerHTML
        
            initSVG(712, 325, abstraction);
              // 712, 325 = width and height of the visualization

            initLinkFilters( $( "#mod_filt_links1" ), $( "#mod_filt_links2" ), abstraction.linkFilters);
            initNodeFilters( $( "#mod_filt_nodes" ), abstraction.nodeFilters);
            initSizeFilters( $( "#mod_filt_sizes" ), abstraction.sizeFilters);
              // The initfilters take as an input parameter the id of the div where they will be placed (e.g "#mod_filt_links1"), with appendChild.

        },
        // End of init function of presentation
        
        // Start of initSVG = create the svg from the abstraction, and place it into the "visualization" html div tag inserted on the html5node
        initSVG: function(width, height) {

            this.force = d3.layout.force()
                .charge(-400)
                .linkDistance(40)
                .size([width, height]);
            this.svg = d3.select(".visualization").append("svg")
                    .attr("width", width)
                    .attr("height", height);
            // force and svg are local to "presentation" (defined as this.force); graph and link are local only to "initSVG" (var graph)             
            var graph = this.abstraction.model;
            
            this.force
                .nodes(graph.nodes)
                .links(graph.links)
                .start();

            var link = svg.selectAll(".link")
                .data(graph.links)
                .enter().append("line")
                .attr("class", "link")
                .style("stroke", this.linkStroke)
                .style("stroke-width", this.linkStrokeWidth);          
                //The attributes (as the strokewidth) are obtained from the fields of each node (as example d.evaluation) via functions (example linkStrokeWidth), taking in account if the filters are acting or not (this.abstraction.sizeFilter.links.state)

            var node = svg.selectAll(".node")
                .data(graph.nodes)
                .enter().append("rect")
                    .attr("class", "node")
                    .attr("width", this.nodeWidth)
                    .attr("height", this.nodeHeight)
                    .style("fill", this.nodeFill)
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
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
        },
        // End of initSVG

        // Start of initLinkFilters = create the html from the filters, appending it (appendChild) to the right div tags
        initLinkFilters: function(columnLeft, columnRight, filterlist) {
            var half = (filterlist.length+1) / 2;
            for (var i = 0; i < filterlist.length; ++i) {
                var filter = filterlist[i];
                var checkbox = makeFilterBox(filter);
                if (i < half) {
                    columnLeft.appendChild(makeBR());
                    columnLeft.appendChild(makeText(filter.name + ": "));
                    columnLeft.appendChild(checkbox);
                }
                else {
                    columnRight.appendChild(makeBR());
                    columnRight.appendChild(makeText(filter.name + ": "));
                    columnRight.appendChild(checkbox);
                }
                checkbox.click = function(e) { filter.state = !filter.state; 
                                               this.updateLinks(); }
            }
        },
        

        // functions that return the HTML (an input tag, a br tag, ...)
        
        makeFilterBox: function(filter) {
            var result = document.createElement("INPUT");
            result.type = "checkbox";
            result.checked = filter.state? "yes" : "no";
            result.name = filter.name;
            return result;
        },
        
        makeText: function(txt) {
            return document.createTextNode(txt);
        },
        
        makeBR: function() {
            return document.createElement("BR");
        },
            
        color: d3.scale.category20();


        // functions that return the right style of each element (considering filters)
        
        nodeFill: function(d) {
            return this.color(d.type);
        },
        
        nodeHeight: function(d) {
                if (this.abstraction.sizeFilter.nodes.state) {
                    return 20 * Math.sqrt(Math.sqrt(d.evaluation));
                }
                else {
                    return 20;
                }
        },  
        
        nodeWidth: function(d) {
                if (this.abstraction.sizeFilter.nodes.state) {
                    return 20 * Math.sqrt(Math.sqrt(d.evaluation));
                }
                else {
                    return 20;
                }
        },
                
        linkStroke: function(d) {
            return this.color(d.type);
        },
                
        linkStrokeWidth: function(d) {
            if (this.abstraction.linkFilters[d.type].state) {
                if (this.abstraction.sizeFilter.links.state)
                    return Math.sqrt(d.evaluation);
                else
                    return Math.sqrt(6);
            }
            else
            {
                return 0;
            }
        },
        
        // update functions (svg, nodes and links)
        
        updateLinks: function() {
            this.svg.selectAll(".link").style("stroke-width", this.linkStrokeWidth);
        },
        
        update: function() {
            updateLinks();
            updateNodes();
        },
    },
// End of presentation
    
// Start of control
// ???????????????????? Check the brackets below
    control: {
    }
    init: function(html5node, model) {
        abstraction.init(model);
        presentation.init(html5node, abstraction, control);        
    }

    destroy: function() {}
};
// End of var ZoomOut

Visualisations.register(ZoomOut);

//// functions erasetext, mouseover, mouseout, hideboxes, showboxes, hidelinks, showlinks
////  initNodeFilters, initSizeFilters
           