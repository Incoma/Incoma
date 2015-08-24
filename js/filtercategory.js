define(['event'], function(Events) {
	function SelectBase_Abstraction() {
		this.toggleItem = function(itemId) {
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
			if(_this.state == state) _this.state = _this.possibleStates.None;
			else _this.state = state;
			
			_this.stateChanged.raise({ state: _this.state });
		}
	}
	
	function MultiSelect_Presentation(ABSTR, items) {
		var _this = this;
		var core = new Select_PresentationCore(ABSTR, items);
		ABSTR.itemChanged.subscribe(function(args) { core.presentItemState(args.itemId, args.state) });
	}
	
	function SingleSelect_Presentation(ABSTR, items) {
		var _this = this;
		var core = new Select_PresentationCore(ABSTR, items);
		
		ABSTR.stateChanged.subscribe(function(args) { disableAllShowFilters(); core.presentItemState(args.state, true) });
		
		function disableAllShowFilters() {
			for(key in items) core.presentItemStateFromNode(items[key].node, false);
		}
	}
	
	function Select_PresentationCore(ABSTR, items) {
		var _this = this;
		
		for(key in items) {
			var item = items[key];
			item.node && item.node.click(ABSTR.toggleItem.bind(ABSTR, item.id));
		}
		
		this.presentItemState = function(itemId, state) {
			var item = items[itemId];
			item && _this.presentItemStateFromNode(item.node, state);
		}
		
		this.presentItemStateFromNode = function(node, value) {
			node && node.css("color", value ? "#000" : "#777");
		}
	}
	
	return {
		MultiSelect_Abstraction: MultiSelect_Abstraction,
		MultiSelect_Presentation: MultiSelect_Presentation,
		SingleSelect_Abstraction: SingleSelect_Abstraction,
		SingleSelect_Presentation: SingleSelect_Presentation,
	}
});