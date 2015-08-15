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
		
		this.updateConversation = function() {
			//Compares the DB conversation with the one showed, and updates this last one (only the new nodes and links) if there are changes

			var ABSTR = Visualisations.current().abstraction;
			var PRES = Visualisations.current().presentation;
			
			if (ABSTR.showingevolution){return;}
			
			nodes = PRES.force.nodes();
			links = PRES.force.links();
			
			var old_model = Model.model;
			
			Db.getmodel();
			Db.generatemodel();
			
			var new_model = modeldb;
		
				
			updatednodes = [];
			old_nodeshash = [];
			
			for (var i=0;i<old_model.nodes.length;i++){	
				old_nodeshash.push(old_model.nodes[i].hash);
			}
			
			for (var i=0;i<new_model.nodes.length;i++){		
				if($.inArray(new_model.nodes[i].hash, old_nodeshash) < 0){
					updatednodes.push(new_model.nodes[i]);
				}
			}		
			
	
			updatedlinks = [];
			old_linkshash = [];
			
			for (var i=0;i<old_model.links.length;i++){		
				old_linkshash.push(old_model.links[i].hash);
			}
			
			for (var i=0;i<new_model.links.length;i++){		
				if($.inArray(new_model.links[i].hash, old_linkshash) < 0){
					updatedlinks.push(new_model.links[i]);
				}
			}		
	
			
			if (updatedlinks.length>0 || updatednodes.length>0){
			
				update_hash_lookup(updatednodes, updatedlinks);
				
				for (var i=0;i<updatednodes.length;i++){
					nodes.push(updatednodes[i]);
	                Model.model.nodes.push(updatednodes[i]);
					
					var linkednode = "";
					
					for (j=0;j<updatedlinks.length;j++){
						if (updatedlinks[j].source.hash == updatednodes[i].hash){
							linkednode = updatedlinks[j].target;
						} else if(updatedlinks[j].target.hash == updatednodes[i].hash){
							linkednode = updatedlinks[j].source;
						}
					}				
					
					if (typeof linkednode.x !="undefined"){
						updatednodes[i].x = linkednode.x;
						updatednodes[i].y = linkednode.y;
					} else {
						updatednodes[i].x = PRES.scaler.midx;
						updatednodes[i].y = PRES.scaler.midy;
					}
					
					var randomplusminus = Math.random() < 0.5 ? -1 : 1;
					updatednodes[i].x += randomplusminus*10*(Math.random()+1);
					updatednodes[i].y += randomplusminus*10*(Math.random()+1);
					
					drawnewnodes();
					
					if (updatednodes[i].seed > 0){
						addseed(updatednodes[i]);
					}
				}	
				
				for (var i=0;i<updatedlinks.length;i++){
					links.push(updatedlinks[i]);
	                Model.model.links.push(updatedlinks[i]);
	
					drawnewlinks();
					
					if (updatedlinks[i].direct == 1){
						var coordx = (updatedlinks[i].source.x + updatedlinks[i].target.x)/2;
						var coordy = (updatedlinks[i].source.y + updatedlinks[i].target.y)/2;
						var expcolor = PRES.linkcolor[updatedlinks[i].type];
						explode(coordx, coordy, expcolor);
					}
				}
			}
		}
	}
	return new ConversationManager();
});