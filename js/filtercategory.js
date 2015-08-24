define(['event'], function(Events) {
	function MultiSelect_Abstraction(args) {
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
	}
	
	function MultiSelect_Presentation(ABSTR, items) {
		var _this = this;
		
		for(key in items) {
			var item = items[key];
			item.node && item.node.click(ABSTR.toggleItem.bind(ABSTR, item.id));
		}
		
		ABSTR.itemChanged.subscribe(function(args) { presentItemState(args.itemId, args.state) });
		
		function presentItemState(itemId, state) {
			var item = items[itemId];
			item && presentItemStateFromNode(item.node, state);
		}
		
		function presentItemStateFromNode(node, value) {
			node && node.css("color", value ? "#000" : "#777");
		}
	}
	
	function SingleSelect_Abstraction(args) {
		var _this = this;
		
		this.stateChanged = new Events.EventImpl();
		init(args);
		
		function init(args) {
			_this.possibleStates = args.possibleStates;
			_this.state = args.initState;
		}
		
		this.toggleState = function(state) {
			if(_this.state == state) _this.state = _this.possibleStates.None;
			else _this.state = state;
			
			_this.stateChanged.raise({ state: _this.state });
		}
	}
	
	function SingleSelect_Presentation(ABSTR, filterInfos) {
		var _this = this;
		
		for(key in filterInfos) {
			var filterItem = filterInfos[key];
			filterItem.node && filterItem.node.click(ABSTR.toggleState.bind(ABSTR, filterItem.id));
		}
		
		ABSTR.stateChanged.subscribe(function(args) { disableAllShowFilters(); presentItemState(args.state, true) });
		
		function presentItemState(state, value) {
			var filterItem = filterInfos[state];
			if(filterItem != null && filterItem.node != null)
				presentItemStateFromNode(filterItem.node, value);
		}
		
		function presentItemStateFromNode(node, value) {
			node && node.css("color", value ? "#000" : "#777");
		}
		
		function disableAllShowFilters() {
			for(key in filterInfos) presentItemStateFromNode(filterInfos[key].node, false);
		}
	}
	
	return {
		MultiSelect_Abstraction: MultiSelect_Abstraction,
		MultiSelect_Presentation: MultiSelect_Presentation,
		SingleSelect_Abstraction: SingleSelect_Abstraction,
		SingleSelect_Presentation: SingleSelect_Presentation,
	}
});