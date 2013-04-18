var ZoomOut = {
    name: "Zoom Out",
    
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
    
    presentation: { container: null, 
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
        ' ; // end of innerHTML
        
            initSVG(712, 325, abstraction);

            initLinkFilters( $( "#mod_filt_links1" ), $( "#mod_filt_links2" ), abstraction.linkFilters);
            initNodeFilters( $( "#mod_filt_nodes" ), abstraction.nodeFilters);
            initSizeFilters( $( "mod_filt_sizes" ), abstraction.sizeFilters);
        },
        
        initSVG: function(width, height) {
            this.force = d3.layout.force()
                .charge(-400)
                .linkDistance(40)
                .size([width, height]);
            this.svg = d3.select(".visualization").append("svg")
                    .attr("width", width)
                    .attr("height", height);
            
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
        
        // making HTML
        
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
            return docuemnt.createElement("BR");
        },
            
        color: d3.scale.category20();


        // update styles
        
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
        
        // update functions
        
        updateLinks: function() {
            this.svg.selectAll(".link").style("stroke-width", this.linkStrokeWidth);
        },
        
        update: function() {
            updateLinks();
            updateNodes();
        },
    },
    
    control: {
    }
    init: function(html5node, model) {
        abstraction.init(model);
        presentation.init(html5node, abstraction, control);
        
    }
    destroy: function() {}
};

Visualisations.register(ZoomOut);
