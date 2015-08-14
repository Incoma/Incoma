define(['model', 'visualisation', 'db', 'webtext'], function(Model, Visualisations, Db, Webtext) {
	function ConversationManager() {
		var self = this;
		var conversationList;
		var completeConversationList;
		
		this.reInit = function(newVisualisation) {
	    	if (newVisualisation) {
	        	newVisualisation.init( $( "#visualisationMain" )[0], Model.model);
	    	}
   	};
		this.reInit1 = function() {
			this.reInit(Visualisations.select(1));
		};
		this.loadConversation = function() {
			Db.loadconversation();
			this.reInit1();
		};
		this.reloadConversation = function() {
			Db.reloadconversation();
			this.reInit1();
		};
		this.loadSandbox = function() {
			if(weblang == "es")
             conversation = "sandbox_es";
         else
             conversation = "sandbox";
         this.reloadConversation();
		};
		this.create = function(conversation,title,time,isPublic, language, editable) {
			Db.createconversation(conversation, title, time, isPublic, language, editable)
			.okay(function() {
				self.reloadConversation();
			})
			.fail(function() {
				alert(Webtext.tx_an_error); //TODO: other module?
				location.reload(true);
			});
		};
   	this.createconvhash = function(string){
			// Create a hash to identify the conversation
			var temphash = this.hashit(string);
			var hashlist=[];
			
			for (var i=0;i<conversationlist.length;i++){
				hashlist.push(conversationlist[i].hash);
			}
			
			if($.inArray(temphash, hashlist) < 0){
				return temphash;
			}
			
			var newstring = string + Date.now();
			createconvhash(newstring);
		};
		this.hashit = function(str){
			// Generate a hash from a string (v2)
			var rotateBy = function(s,N) { for (var i = 0; i < N; i++) s.unshift(s.pop()); }
	
			// take a random string and convert it to char array
			var alphabet = "1LacGbJDd6f7QYC02MghijB3kAUFqwVT8HeROrt45yNXZu2KESiopI6z9".split(""); //THIS WILL BE THE CHARACTERS RANDOMLY USED
	
			var hash = alphabet.slice(0,10); //THE SECOND DIGIT IS THE LENGTH OF THE RESULTING HASH
	
			for (var i = 0; i < str.length; i++){
				var i_mod = i % hash.length;
				// cyclically shift the alphabet, to make it dependend from every char of the original string
				rotateBy(alphabet,str.charCodeAt(i) % alphabet.length + 1);
				// assign cyclically to char with index (i % hash.length) the char of the alphabet with an index depending on the i'th char of the original string and the i'th char value of the hash, which is dependend on the previous assignment...
				hash[i_mod] = alphabet[str.charCodeAt(i) * hash[i_mod].charCodeAt() % alphabet.length];
				// rotate hash to make it dependend from every new assignment
				rotateBy(hash,hash[i_mod].charCodeAt() % hash.length + 1);
			}
	
			return hash.join("");
		}
		
		this.getCompleteConversationList = function() {
			return completeConversationList;
		}
		
		this.loadCompleteConversationList = function() {
			Db.getconversations(function(list) { completeConversationList = list });
		};
	}
	return new ConversationManager();
});