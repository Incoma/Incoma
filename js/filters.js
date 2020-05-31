define(['pac-builder', 'webtext', 'model', 'visualisation', 'event', 'filtercategory'], function(PacBuilder, Webtext, Model, Visualisations, Events, FilterCategories) {
	
	function FilterPanel() {
		PacBuilder(this, FilterPanel_Presentation, FilterPanel_Abstraction, FilterPanel_Control);
		
		this.init = function() {
			this.abstraction.init();
			this.presentation.init();
			this.control.init();
		}
	}
	
	function FilterPanel_Abstraction() {
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
			_this.onFilterChanged = function(filterListName, id) {}; //TODO: replace it with the Event
			
			//_this.filterChanged = new Events.EventImpl(); //TODO: disposing routines
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
			
			var initState = [];
			for(id in NodeFilters) initState[NodeFilters[id]] = true;
			_this.nodeFilterCategory = new FilterCategories.MultiSelect_Abstraction({
				itemIds: NodeFilters,
				initState: initState,
			});
			
			initState = [];
			for(id in LinkFilters) initState[LinkFilters[id]] = true;
			_this.linkFilterCategory = new FilterCategories.MultiSelect_Abstraction({
				itemIds: LinkFilters,
				initState: initState,
			});
			
			_this.showFilterCategory = new FilterCategories.SingleSelect_Abstraction({
				possibleStates: ShowFilters,
				initState: ShowFilters.None,
			});
			_this.sizeFilterCategory = new FilterCategories.SingleSelect_Abstraction({
				possibleStates: SizeFilters,
				initState: SizeFilters.Evaluations,
			});
			
			_this.nodeEvalFilter = {
				value: 0,
				old: -1000,
			};
			
			_this.linkEvalFilter = {
				value: 0,
				old: -1000,
			};
		}
		
		function disableAllFilters(list) {
			var keys = Object.keys(list);
			keys.forEach(function(key) { list[key].state = false });
		}
		
		_this.nodeEvalFilterChanged = function(newValue) {
			//TODO: hidenodetexts!!!
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
	
	function FilterPanel_Presentation(ABSTR) {
		var _this = this;
		
		this.init = function() {
			//ABSTR.filterChanged.subscribe(presentFilterState);
			
			$('#lower_bar').html(getLowerBarHtml());
			
	        $('#filters_text').fadeOut(0);
	        $( "#cmd_hideshowfilters" )[0].onclick = toggleFilterPanelVisibility;
	        $( "#filters_title" )[0].onclick = toggleFilterPanelVisibility;
	        
	        initSliders();
	        
			//Create the filters
	        initNodeFilters();
	        initLinkFilters();
			initShowFilters();
	        initSizeFilters();
		}
		
		function initSliders() {
			setTimeout(function() { 
				new Dragdealer('slider1', { animationCallback: nodeslider });
				new Dragdealer('slider2', { animationCallback: linkslider });
			}, 0);
		}
		
		// Start of initNodeFilters = create the html from the filters, appending it (appendChild) to the right div tags
	    function initNodeFilters() {
			var filterItems = [];
			for(var key in NodeFilters) {
				var id = NodeFilters[key];
				filterItems[id] = {
					//node: _this.nodeFilterTextDoms[id], 
					id: id, name: ABSTR.nodeFilters[id].name, imageWidth: '32px', onClick: onClickFilterItem, 
					getImagePath: function() { return "img/node" + this.id + ".png"},
				};
			}
			
			// 4 filters with 2 per column for the nodes
	        var numFilts = 4;
	        var filtsPerCol = 2;
	        var filtsPerRow = Math.ceil(numFilts/filtsPerCol);
			_this.nodeFilterCategory = new FilterCategories.MultiSelect_Presentation(ABSTR.nodeFilterCategory, filterItems, {
				itemsPerRow: filtsPerRow,
				useImages: true,
				parent: $('#filt_nodes')[0]
			});
	    }
		
		function initShowFilters() {
			var showFilterInfo = [];
			showFilterInfo[ShowFilters.Tags] = { /*node: $("#showtags"),*/ id: ShowFilters.Tags, name: Webtext.tx_tags, onClick: onClickFilterItem };
			showFilterInfo[ShowFilters.Summaries] = { /*node: $("#showsums"),*/ id: ShowFilters.Summaries, name: Webtext.tx_summaries, onClick: onClickFilterItem };
			showFilterInfo[ShowFilters.Authors] = { /*node: $("#showauthors"),*/ id: ShowFilters.Authors, name: Webtext.tx_authors, onClick: onClickFilterItem };
			
			if (Model.tags == null)
				delete showFilterInfo[ShowFilters.Tags];
				
			_this.showFilter = new FilterCategories.SingleSelect_Presentation(ABSTR.showFilterCategory, showFilterInfo, {
				itemsPerRow: 1,
				useImages: false,
				parent: $('#filt_show')[0]
			});
		}
		
	    function initLinkFilters() {
			// 6 filters with 2 per column for the links
	        var numFilts = 6 ;
	        var filtsPerCol = 2 ;
	        var filtsPerRow = Math.ceil(numFilts/filtsPerCol);
	        var cellsPerRow = filtsPerRow * 3;
			
			var filterItems = [];
			for(var key in LinkFilters) {
				var id = LinkFilters[key];
				filterItems[id] = {
					//node: _this.linkFilterTextDoms[id],
					id: id, name: ABSTR.linkFilters[id].name, onClick: onClickFilterItem, imageWidth: '20px',
					getImagePath: function() { return "img/link" + this.id + ".png"},
				};
			}
			_this.linkFilterCategory = new FilterCategories.MultiSelect_Presentation(ABSTR.linkFilterCategory, filterItems, {
				itemsPerRow: filtsPerRow,
				useImages: true,
				parent: $('#filt_links')[0]
			});
	    };
		
	    function initSizeFilters() {
	    	var sizeFilterInfo = [];
	    	sizeFilterInfo[SizeFilters.Evaluations] = 
	    		{ name: Webtext.tx_evaluations, id: SizeFilters.Evaluations, onClick: onClickFilterItem };
			
			_this.sizeFilter = new FilterCategories.SingleSelect_Presentation(ABSTR.sizeFilterCategory, sizeFilterInfo, {
				itemsPerRow: 1,
				useImages: false,
				parent: $('#filt_sizes')[0]
			});
	    };
	    
	    function onClickFilterItem() {
			ABSTR.filtershelp = false;
			updateFiltersHelpVisibility();
	    }
	    
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
		
			console.log('filtershelp', ABSTR.filtershelp);
		    updateFilterPanelVisibility();	
		    updateFiltersHelpVisibility();
			ABSTR.filtershelp = false;
		};
		_this.toggleFilterPanelVisibility = toggleFilterPanelVisibility;
		
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
	
	function FilterPanel_Control(abstraction, presentation) {
		var _this = this;
		
		this.init = function() {
			pipeEvent("onNodesAndLinksChanged", abstraction);
			pipeEvent("onLinksChanged", abstraction);
			//pipeEvent("onFilterChanged", abstraction);
			
			_this.nodeFilterChanged = abstraction.nodeFilterCategory.itemChanged;
			_this.linkFilterChanged = abstraction.linkFilterCategory.itemChanged;
			_this.showFilterChanged = abstraction.showFilterCategory.stateChanged;
			_this.sizeFilterChanged = abstraction.sizeFilterCategory.stateChanged;
		};
		
		this.hideShowFilters = presentation.toggleFilterPanelVisibility;
		
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
	
	var ShowFilters = {
		None: 0,
		Summaries: 1,
		Authors: 2,
		Tags: 3,
	};
	
	var SizeFilters = {
		None: 0,
		Evaluations: 1,
	};
	
	var NodeFilters = {
		General: 1,
		Question: 2,
		Proposal: 3,
		Info: 4,
	};
	
	var LinkFilters = {
		General: 1,
		Agreement: 2,
		Disagreement: 3,
		Consequence: 4,
		Alternative: 5,
		Equivalence: 6,
	};
	
	return { 
		FilterPanel: FilterPanel, 
		ShowFilters: ShowFilters, 
		SizeFilters: SizeFilters, 
		NodeFilters: NodeFilters, 
		LinkFilters: LinkFilters
	};
});