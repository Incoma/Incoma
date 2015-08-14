define(["webtext"], function(Webtext) {
	function DateTime() {
		this.timeAgo = function(date) {
			// Transform Epoch timestamp in human time
			var seconds = Math.floor(Date.now()/1000) - date;
			var interval = Math.floor(seconds / 31536000);
	
			if (interval > 1) {
				return webtextaux[72] + " " + interval + " " + Webtext.tx_2year;
			}
			if (interval > 0) {
				return webtextaux[88] + " " + interval + " " + Webtext.tx_1year;
			}
			interval = Math.floor(seconds / 2592000);
			if (interval > 1) {
				return webtextaux[71] + " " + interval + " " + Webtext.tx_2month;
			}
			interval = Math.floor(seconds / 86400);
			if (interval > 1) {
				return webtextaux[70] + " " + interval + " " + Webtext.tx_2day;
			}
			if (interval > 0) {
				return webtextaux[89] + " " + interval + " " + Webtext.tx_1day;
			}
			interval = Math.floor(seconds / 3600);
			if (interval > 1) {
				return webtextaux[69] + " " + interval + " " + Webtext.tx_2hour;
			}
			if (interval > 0) {
				return webtextaux[90] + " " + interval + " " + Webtext.tx_1hour;
			}
			interval = Math.floor(seconds / 60);
			if (interval > 1) {
				return webtextaux[68] + " " + interval + " " + Webtext.tx_2min;
			}
			if (interval > 0) {
				return webtextaux[91] + " " + interval + " " + Webtext.tx_1min;
			}
			if (seconds > 1) {
				return webtextaux[67] + " " + seconds + " " + Webtext.tx_2sec;
			}
			return " " + Webtext.tx_justnow;
		}
	}
	return new DateTime();
});