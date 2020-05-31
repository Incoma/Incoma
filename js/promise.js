define(function() {
	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	
	function Promise() {
		var state = PENDING;
		var value = null;
		var handlers = [];
		
		this.fulfill = function(result) {
			state = FULFILLED;
			value = result;
			handlers.forEach(handle);
			handlers = null;
		}
		
		this.reject = function(error) {
			state = REJECTED;
			value = error;
			handlers.forEach(handle);
			handlers = null;
		}
		
		this.applyPromise = function(other) {
			other
			.okay(function(value) { this.fulfill(value) })
			.fail(function(value) { this.reject(value) });
		}
		
		this.transferTo = function(other) {
			this
			.okay(function(value) { other.fulfill(value) })
			.fail(function(value) { other.reject(value) });
		}
		
		this.then = function(handler) {
			handle(handler);
			return this;
		}
		
		this.okay = function(onFulfilled) {
			handle({onFulfilled: onFulfilled});
			return this;
		}
		
		this.fail = function(onRejected) {
			handle({onRejected: onRejected});
			return this;
		}
		
		function handle(handler) {
			if(state === PENDING) handlers.push(handler);
			else if(state === FULFILLED) handler.onFulfilled && handler.onFulfilled(value);
			else if(state == REJECTED) handler.onRejected && handler.onRejected(value);
		}
	}
	
	return Promise;
});