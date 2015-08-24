define(['event', 'visualisation'], function(Events, Visualisations) {
	function SelectBase_Abstraction() {
		this.toggleItem = function(itemId) {
			throw new Error('not implemented');
		}
		
		this.getItemState = function(itemId) {
			throw new Error('not implemented');
		}
	}
	
	function MultiSelect_Abstraction(args) {
		SelectBase_Abstraction.call(this);
		var _this = this;
		var state;
		var itemIds;
		
		this.itemChanged = new Events.EventImpl();
		init(args);
		
		function init(args) {
			state = args.initState.slice(); //state[id] = boolean
			itemIds = args.itemIds; //itemIds[name] = id
		}
		
		this.toggleItem = function(itemId) {
			state[itemId] = !state[itemId];
			_this.itemChanged.raise({ itemId: itemId, state: state[itemId] });
		}
		
		this.getItemState = function(itemId) {
			return state[itemId];
		}
	}
	
	function SingleSelect_Abstraction(args) {
		SelectBase_Abstraction.call(this);
		var _this = this;
		
		this.stateChanged = new Events.EventImpl();
		init(args);
		
		function init(args) {
			_this.possibleStates = args.possibleStates;
			_this.state = args.initState;
		}
		
		this.toggleItem = function(item) {
			if(_this.state == item) _this.state = _this.possibleStates.None;
			else _this.state = item;
			
			_this.stateChanged.raise({ state: _this.state });
		}
		
		this.getItemState = function(itemId) {
			return _this.state == itemId;
		}
	}
	
	function MultiSelect_Presentation(ABSTR, items, tableArgs) {
		var _this = this;
		var core = new Select_PresentationCore(ABSTR, items, tableArgs);
		ABSTR.itemChanged.subscribe(function(args) { core.presentItemState(args.itemId, args.state) });
	}
	
	function SingleSelect_Presentation(ABSTR, items, tableArgs) {
		var _this = this;
		var core = new Select_PresentationCore(ABSTR, items, tableArgs);
		
		ABSTR.stateChanged.subscribe(function(args) { disableAllShowFilters(); core.presentItemState(args.state, true) });
		
		function disableAllShowFilters() {
			for(key in items) core.presentItemStateFromNode(items[key].node, false);
		}
	}
	
	function Select_PresentationCore(ABSTR, items, tableArgs) {
		var _this = this;
		
		function createTable() {
			var colsPerItem = tableArgs.useImages ? 3 : 1;
			var colsPerRow = tableArgs.itemsPerRow * colsPerItem;
			var tableBuilder = new TableBuilder(colsPerRow);
			
			for(var key in items) {
				var item = items[key];
				
				if(tableArgs.useImages) initImageCell(tableBuilder.newItem(), item.getImagePath(), item.imageWidth);
				item.node = initNameCell(tableBuilder.newItem(), item.name, item.onClick);
				if(tableArgs.useImages) initSpaceCell(tableBuilder.newItem());
			}
			
			tableArgs.parent.appendChild(tableBuilder.getTableNode());
		}
		
		function initImageCell(cell, path, width) { //args: { url; width (don't forget 'px'!); }
	    	cell.setAttribute("style","width: " + width + "; height: 20px; background:url('" + path + "') no-repeat;");
	    }
	    
	    function initNameCell(cell, caption, onClick) {
	    	cell.setAttribute("style","cursor: pointer");
			cell.appendChild(Visualisations.makeText(caption));
			$(cell).click(function () {
				onClick();
				//ABSTR.filtershelp = false;
				//updateFiltersHelpVisibility();
			});
			return $(cell);
	    }

	    function initSpaceCell(cell) {
			cell.style.width = "25px";
			cell.appendChild(Visualisations.makeText(' '));
	    }
		
		function registerDomEvents() {
			for(var key in items) {
				var item = items[key];
				item.node && item.node.click(ABSTR.toggleItem.bind(ABSTR, item.id));
			}
		}
		
		function presentItemStates() {
			for(var key in items) {
				var item = items[key];
				_this.presentItemState(item.id, ABSTR.getItemState(item.id));
			}
		}
		
		this.presentItemState = function(itemId, state) {
			var item = items[itemId];
			item && _this.presentItemStateFromNode(item.node, state);
		}
		
		this.presentItemStateFromNode = function(node, value) {
			node && node.css("color", value ? "#000" : "#777");
		}
		
		createTable();
		registerDomEvents();
		presentItemStates();
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
	
	return {
		MultiSelect_Abstraction: MultiSelect_Abstraction,
		MultiSelect_Presentation: MultiSelect_Presentation,
		SingleSelect_Abstraction: SingleSelect_Abstraction,
		SingleSelect_Presentation: SingleSelect_Presentation,
	}
});