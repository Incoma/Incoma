define(['pac-builder', 'webtext', 'model', 'visualisation', 'event'], function(PacBuilder, Webtext, Model, Visualisations, Events) {
	
	function ConversationTools() {
		PacBuilder(this, ConversationTools_Presentation, ConversationTools_Abstraction, ConversationTools_Control);
		
		this.init = function() {
			this.abstraction.init();
			this.presentation.init();
			this.control.init();
		}
	}
	
	function ConversationTools_Abstraction() {
		var _this = this;
		
		this.init = function() {
			initState();
			initFilters();
		}
		
		function initState() {
			_this.filtershelp = true;
			_this.showfilters = false;
			
			_this.remainingNodes = [];
			_this.remainingLinks = [];
			
			_this.onNodesAndLinksChanged = function(nodes, links) {};
			_this.onLinksChanged = function(links) {};
			_this.onShowFilterChanged = function(filter) {};
			_this.onSizeFilterChanged = function(name) {};
			_this.onFilterChanged = function(filterListName, id) {};
			
			_this.filterChanged = new Events.EventImpl();
		}
		
		function initFilters() {
			_this.linkFilters = {
				1: {name: Webtext.tx_general,state: true, typeId: 1},
				2: {name: Webtext.tx_agreement, state: true, typeId: 2},
				3: {name: Webtext.tx_disagreement, state: true, typeId: 3},
				4: {name: Webtext.tx_consequence, state: true, typeId: 4},		
				5: {name: Webtext.tx_alternative, state: true, typeId: 5},
				6: {name: Webtext.tx_equivalence, state: true, typeId: 6},
			};
			
			_this.nodeFilters = {
				1: {name: Webtext.tx_general, state: true, typeId: 1},
				2: {name: Webtext.tx_question, state: true, typeId: 2},
				3: {name: Webtext.tx_proposal, state: true, typeId: 3},
				4: {name: Webtext.tx_info, state: true, typeId: 4},
			};
			
			
			_this.sizeFilters = {
				evaluations: {name: Webtext.tx_evaluations, state: true},
			};
			
			_this.showFilter = ShowFilters.None;
			
			_this.nodeEvalFilter = {
				value: 0,
				old: -1000,
			};
			
			_this.linkEvalFilter = {
				value: 0,
				old: -1000,
			};
		}
		
		_this.toggleShowFilterReturnResult = function(filter) {
			if(_this.showFilter == filter) _this.showFilter = ShowFilters.None;
			else _this.showFilter = filter;
			_this.onShowFilterChanged(_this.showFilter);
			
			return _this.showFilter == filter;
		}
		
		_this.toggleFilter = function(filterListName, id) {
			var list = _this[filterListName];
			var state = list[id].state;
			state = list[id].state = !state;
			
			_this.onFilterChanged(filterListName, id);
			_this.filterChanged.raise({ filterListName: filterListName, id: id, state: state });
		}
		
		function disableAllFilters(list) {
			var keys = Object.keys(list);
			keys.forEach(function(key) { list[key].state = false });
		}
		
		_this.toggleEvaluationsSizeFilter = function() {
			var state = _this.sizeFilters.evaluations.state = !_this.sizeFilters.evaluations.state;
			_this.onSizeFilterChanged(state ? 'evaluations' : 'none');
		}
		
		_this.nodeEvalFilterChanged = function(newValue) {
			_this.nodeEvalFilter.value = newValue;
			if ((_this.nodeEvalFilter.value == _this.nodeEvalFilter.old)) return;
			_this.nodeEvalFilter.old = _this.nodeEvalFilter.new;
			
			var nodes = Model.model.nodes;
		    var links = Model.model.links;
		
			_this.remainingNodes = [];
			_this.remainingLinks = [];
			
			nodes.forEach(function(d) {
				if ((d.evalpos-d.evalneg)>=_this.nodeEvalFilter.value){
					_this.remainingNodes.push(d);
				};
			});
		
			var nodesign = (_this.nodeEvalFilter.value>0) ? "+" : "";
		
			document.getElementById("handle1").innerHTML = nodesign + _this.nodeEvalFilter.value;
			
		    if (isNaN(_this.linkEvalFilter.value)) _this.remainingLinks = links.slice(); //TODO: is this correct - no filtering?
		    else {
		    	links.forEach(function(d) {
					if ((d.evalpos-d.evalneg)>=_this.linkEvalFilter.value && $.inArray(d.source, _this.remainingNodes)>=0 && $.inArray(d.target, _this.remainingNodes)>=0){
						_this.remainingLinks.push(d);
					};
				});
		    }
		    
		    _this.onNodesAndLinksChanged(_this.remainingNodes, _this.remainingLinks);
		}
		
		_this.linkEvalFilterChanged = function(newValue) {
			_this.linkEvalFilter.value = newValue;
			if (!(_this.nodeEvalFilter.value == _this.nodeEvalFilter.old)) return;
			_this.nodeEvalFilter.old = _this.nodeEvalFilter.new;
			
			var links = Model.model.links;
			_this.remainingLinks = [];
			
			if(isNaN(_this.linkEvalFilter.value)) _this.remainingLinks = links.slice(); //TODO: is this correct - no filtering?
		    else {
		    	links.forEach(function(d) {
					if ((d.evalpos-d.evalneg)>=_this.linkEvalFilter.value && $.inArray(d.source, _this.remainingNodes)>=0 && $.inArray(d.target, _this.remainingNodes)>=0){
						_this.remainingLinks.push(d);
					};
				});
		    }
		 	
		    _this.onLinksChanged(_this.remainingLinks);
		}
	}
	
	function ConversationTools_Presentation(ABSTR) {
		var _this = this;
		var showFilterInfo = null;
		this.init = function() {
			ABSTR.filterChanged.subscribe(presentFilterState);
			
			$('#lower_bar').html(getLowerBarHtml());
			
	        $('#filters_text').fadeOut(0);
			
			initShowFilters();
			
	        $( "#cmd_hideshowfilters" )[0].onclick = toggleFilterPanelVisibility;
	        $( "#filters_title" )[0].onclick = toggleFilterPanelVisibility;
	        
	        initSliders();
	        
			//Create the filters
	        initNodeFilters();
	        initLinkFilters();
	        initSizeFilters();
		}
		
		function initShowFilters() {
			showFilterInfo = [];
			showFilterInfo[ShowFilters.Tags] = { node: $("#showtags") };
			showFilterInfo[ShowFilters.Summaries] = { node: $("#showsums") };
			showFilterInfo[ShowFilters.Authors] = { node: $("#showauthors") };
			
			if (Model.tags == null)
				getShowFilterNode(ShowFilters.Tags).attr("style","visibility:hidden; cursor:default;");
			else
				getShowFilterNode(ShowFilters.Tags).click(toggleShowFilter.bind(_this, ShowFilters.Tags));
				
			getShowFilterNode(ShowFilters.Summaries).click(toggleShowFilter.bind(_this, ShowFilters.Summaries));
			getShowFilterNode(ShowFilters.Authors).click(toggleShowFilter.bind(_this, ShowFilters.Authors));
		}
		
		function initSliders() {
			setTimeout(function() { 
				new Dragdealer('slider1', { animationCallback: nodeslider });
				new Dragdealer('slider2', { animationCallback: linkslider });
			}, 0);
		}
		
		// Start of initNodeFilters = create the html from the filters, appending it (appendChild) to the right div tags
	    function initNodeFilters() {
			var filterlist = ABSTR.nodeFilters;
			
			// 4 filters with 2 per column for the nodes
	        var numFilts = 4;
	        var filtsPerCol = 2;
	        var filtsPerRow = Math.ceil(numFilts/filtsPerCol);
	        var cellsPerRow = filtsPerRow * 3;
	
			var tableBuilder = new TableBuilder(cellsPerRow);
	
			_this.nodeFilterTextDoms = {};
	        for (var i = 1; i <= numfilts; ++i) {
				var filter = filterlist[i];
				
				var nameCell;
				
	            initNodeImageCell(tableBuilder.newItem(), filter);
				initNodeNameCell(nameCell = tableBuilder.newItem(), filter);
				initNodeSpaceCell(tableBuilder.newItem());
				
				_this.nodeFilterTextDoms[i] = nameCell;
	        }
	
			var table = tableBuilder.getTableNode();
	    	var column = $('#filt_nodes')[0];
			column.appendChild(table);
	    };
	    
	    function initNodeImageCell(cell, filter) {
	    	cell.setAttribute("style","width: 32px; height: 20px; background:url('img/node" + filter.typeId + ".png') no-repeat;");
	    }
	    
	    function initNodeNameCell(cell, filter) {
	    	cell.setAttribute("style","cursor: pointer");
			cell.appendChild(Visualisations.makeText(filter.name));
			cell.onclick = function () {
				ABSTR.toggleFilter('nodeFilters', filter.typeId);
				
				ABSTR.filtershelp = false;
				updateFiltersHelpVisibility();
			};
	    }
	    
	    function initNodeSpaceCell(cell) {
			cell.style.width = "25px";
			cell.appendChild(Visualisations.makeText(' '));
	    }
	    
	    function TableBuilder(cellsPerRow) {
	    	var _this = this;
	    	var i = 0;
	    	var row = null;
	    	var table = document.createElement("table");
			table.style.width = "100%";
			table.setAttribute('border','0');
			table.setAttribute('cellpadding','1');
			table.setAttribute('cellspacing','2');
			table.setAttribute("style", "padding-right: -20px");
			
			body = document.createElement("tbody");
			table.appendChild(body);
			
			_this.newItem = function() {
				if(shallCreateNewRow()) {
					row = document.createElement('tr');
					body.appendChild(row);
				}
				
				var cell = document.createElement('td');
				row.appendChild(cell);
				
				++i;
				return cell;
			}
			
			function shallCreateNewRow() {
				return (i%cellsPerRow) == 0;
			}
			
			_this.getTableNode = function() {
		    	return table;
		    }
	    }
	    
	    /*function presentNodeFilterState(id, state) {
			var textcolor = (state) ? "#000" : "#777";	
			var domElement = getNodeFilterTextDom(id);
			domElement.setAttribute("style","cursor: pointer; color: " + textcolor);
	    }*/
	    
	    function presentFilterState(args) {
	    	var state = args.state;
	    	var id = args.id;
	    	var filterListName = args.filterListName;
	    	
			var textcolor = (state) ? "#000" : "#777";	
			var domElement = getFilterTextDom(filterListName, id);
			domElement.setAttribute("style","cursor: pointer; color: " + textcolor);
	    }
	    
	    function getFilterTextDom(filterListName, id) {
	    	if(filterListName == 'nodeFilters')
	    		return _this.nodeFilterTextDoms[id];
	    	else if(filterListName == 'linkFilters')
	    		return _this.linkFilterTextDoms[id];
	    }
		
	    function initLinkFilters() {
			var columnId = "filt_links";
			var filterlist = ABSTR.linkFilters;
			
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
			
			_this.linkFilterTextDoms = {};
	
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
					ABSTR.toggleFilter('linkFilters', this.id);	
					$("#filters_text").delay(300).fadeOut(600);
					ABSTR.filtershelp = false;
				};
				_this.linkFilterTextDoms[i] = tdname;
				
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
		
	    function initSizeFilters() {
			var columnId = "filt_sizes";
			var filterlist = ABSTR.sizeFilters;
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
				ABSTR.toggleEvaluationsSizeFilter();
		
				var textcolor = (filterlist.evaluations.state) ? "#000" : "#777";	
				this.setAttribute("style","cursor: pointer; color: " + textcolor);
				
				$("#filters_text").delay(300).fadeOut(600);
				ABSTR.filtershelp = false;		
			};	
			
			tdname.appendChild(Visualisations.makeText(filter.name));
			tr.appendChild(tdname);
			tb.appendChild(tr);
			
			table.appendChild(tb);
			column.appendChild(table);
	    };
		
		function nodeslider (x){
			console.log('nodeslider');
			var nodesdifevalarray = Model.model.nodes.map(function(e){return e.evalpos-e.evalneg;});
		
			var nodesmaxeval = d3.max(nodesdifevalarray);
			var nodesmineval = d3.min(nodesdifevalarray);
			
			var nodesCutValue = Math.ceil(nodesmineval + (nodesmaxeval-nodesmineval)*x);
			
			ABSTR.nodeEvalFilterChanged(nodesCutValue);
		}
	
		function linkslider (x){
			var linksdifevalarray = Model.model.links.map(function(e){return e.evalpos-e.evalneg;});
			
			var linksmaxeval = d3.max(linksdifevalarray);
			var linksmineval = d3.min(linksdifevalarray);
		
			var linksCutValue = Math.ceil(linksmineval + (linksmaxeval-linksmineval)*x);
			
			var linkSign = (linksCutValue>0) ? "+" : "";
		    
		    if(isNaN(linksCutValue)) {
		 		document.getElementById("slider2").setAttribute("style","visibility:hidden;");
		 	}
		    else {
		 		document.getElementById("slider2").setAttribute("style","visibility:visible;");
				document.getElementById("handle2").innerHTML = linkSign + linksCutValue;
		 	}
			
			ABSTR.linkEvalFilterChanged(linksCutValue);
		}
		
		function toggleFilterPanelVisibility() {
			ABSTR.showfilters = !ABSTR.showfilters;
		
		    updateFilterPanelVisibility();	
		    updateFiltersHelpVisibility();
			ABSTR.filtershelp = false;
		};
		
		function updateFiltersHelpVisibility() {
			if (ABSTR.filtershelp){ 
				$("#filters_text").show();
		    } else {
				$("#filters_text").delay(300).fadeOut(600);
		    };
		}
		
		function updateFilterPanelVisibility() {
		    var height = (ABSTR.showfilters) ? "105px" : "25px";
		    var arrowstr = (ABSTR.showfilters) ? "&#8681;" : "&#8679;" ;
		    $("#lower_bar").css("height", height);
			$("#legendarrow").html(arrowstr);
		};
		
		function toggleShowFilter(filter) {
			disableAllShowFilters();
			if(ABSTR.toggleShowFilterReturnResult(filter))
				presentShowFilterState(filter, true);
		}
		
		function disableAllShowFilters() {
			for(key in ShowFilters) presentShowFilterState(ShowFilters[key], false);
		}
		
		function presentShowFilterState(filter, state) {
			if(filter == 0) return;
			getShowFilterNode(filter).css("color", state ? "#000": "#777");
		}
		
		function getShowFilterNode(filter) {
			return showFilterInfo[filter].node;
		}
		
		function getLowerBarHtml() {
			return '<div class="lower_bar_elems">   \
				<div id="filters_title" class="lower_title" style="Float:left" >   \
					<b>  <div id="legendarrow" style="Float:left">&#8679;</div>  '+Webtext.tx_legend+'</b> \
				</div>   \
				<div id="filters_text" class="lower_text"  style="Float:right">  \
					('+Webtext.tx_click_hide_show+') \
				</div>   \
				<div id="filt_nodes" class="lower_nodes" style="Float:left;" >   \
					<u><b>'+Webtext.tx_thoughts+'</b></u>             \
			 	</div>   \
			   \
				<div id="filt_links" class="lower_links" style="Float:left; ">   \
					<u><b>'+Webtext.tx_connections+'</b></u>    \
				</div>   \
			   \
				<div id="filt_sizes" class="lower_sizes" style="Float:left;">   \
					<u><b>'+Webtext.tx_sizes+'</b></u>    \
				</div>   \
			   \
				<div id="filt_show" class="lower_show" style="Float:left;">   \
					<u><b>'+Webtext.tx_show+'</b></u>    \
					<div id="showtags" class="lower_showtexts noselect">   \
						'+Webtext.tx_tags+'    \
					</div>   \
					<div id="showauthors" class="lower_showauthors">   \
						'+Webtext.tx_authors+'    \
					</div>   \
					<div id="showsums" class="lower_showsums">   \
						'+Webtext.tx_summaries+'    \
					</div>   \
			    </div>   \
			\
				<div id="sliderpanel" class="sliderpanel noselect">  \
					<div class="slidercaption"><u><b>'+Webtext.tx_min_rating+'</b></u></div>  \
					<div id="slider1" class="dragdealer">  \
						<div id="handle1" class="red-bar handle" title="'+Webtext.tx_thoughts+'"></div>  \
					</div>  \
					<div id="slider2" class="dragdealer">  \
						<div id="handle2" class="red-bar handle" title="'+Webtext.tx_connections+'"></div>  \
					</div>  \
				</div>  \
			\
				<div id="filt_hide" class="lower_hide" style="Float:right">   \
					<div class="lower_hide_button" id="cmd_hideshowfilters"></div>   \
				</div>   \
			</div>';
		}
	}
	
	function ConversationTools_Control(abstraction, presentation) {
		var _this = this;
		
		this.init = function() {
			pipeEvent("onNodesAndLinksChanged", abstraction);
			pipeEvent("onLinksChanged", abstraction);
			pipeEvent("onShowFilterChanged", abstraction);
			pipeEvent("onSizeFilterChanged", abstraction);
			pipeEvent("onFilterChanged", abstraction);
		};
		
		function pipeEvent(name, parent, parentPropertyName) {
			_this[name] = function() {};
			if(parent[parentPropertyName || name])
				parent[parentPropertyName || name] = function() { _this[name].apply(_this, arguments) };
			else {
				console.log("error information", parent, parentPropertyName || name);
				throw new Error("pipeEvent: property does not exist");
			}
		}
	}
	
	var MultiSelectFilters = {
		Nodes: 0,
		Connections: 1,
	};
	
	var ShowFilters = {
		None: 0,
		Summaries: 1,
		Authors: 2,
		Tags: 3,
	};
	
	return { ConversationTools: ConversationTools, ShowFilters: ShowFilters };
});