define(['promise', 'model', 'webtext'], function(Promise, Model, webtextModule) { //TODO: remove Model dependency!!!
	var Db = {};
	
	Db.loadconversation = function(){
		//Update the tags from the conversation
        $.post("php/updatetags.php", {conversation: conversation});


		//Get the conversation from the DB
		Db.getmodel();
      Db.getinfo();
		Db.gettags();
        
		//From the previous DB conversation generate a valid JS conversation
		Db.generatemodel();

		//loads the 'zoom-out' visualization with the conversation data loaded from the db and converted to the js format
		Model.clear(modeldb);
	}


	Db.getconversations = function(done){

	//Get the list of conversations (shown in Participate)
		$.ajax({
			dataType: 'json',
			url: 'php/getconversations.php',
			async: false,
			}).done(function(data) {
			data.conversations.pop();
			completeconversationlist =  data.conversations; //<-- deprecated
			done && done(data.conversations);
		});

	}


	Db.createconversation = function(conversation,title,time,ispublic, language, editable){
		//Create a conversation in the DB list of conversations
		_this = this;
		var promise = new Promise();
		$.post("php/createconversation.php", {conversation: conversation, title:safejstringsfordb(title), time:time, ispublic:ispublic, language:language, editable: editable})
			.done(function(){
				setTimeout(function(){
					console.log('step 3');
					_this.saveinitialnode(Model.model.nodes[0]).transferTo(promise);
				},200);
			});
		
		return promise;
	}

	Db.saveinitialnode = function(newnode){
		if(conversation != "sandbox" && conversation != "sandbox_es"){
			var newnodejs = ["hash",newnode.hash,"content",safejstringsfordb(newnode.content),"contentsum",safejstringsfordb(newnode.contentsum),"evalpos",newnode.evalpos,"evalneg",newnode.evalneg,"evaluatedby",(newnode.evaluatedby).join("@@@@"),"adveval",(newnode.adveval).join("@@@@"),"advevalby",(newnode.advevalby[0]).join("@@@@")+'$$$$'+(newnode.advevalby[1]).join("@@@@")+'$$$$'+(newnode.advevalby[2]).join("@@@@")+'$$$$'+(newnode.advevalby[3]).join("@@@@"),"type",newnode.type,"author",newnode.author,"seed",newnode.seed,"time",newnode.time];
			
			newnodestring = newnodejs.join('####');

			$.post("php/savenode.php", {newnodephp: newnodestring, conversation: conversation});

			var actualtime = new Date().getTime();
			return this.checkifsavedinitialnode(newnode.hash, actualtime, newnode);
		}
		else {
			console.log('reject 2');
			return (new Promise()).reject();
		}
	}    
	
	function checkifsaved(type, hash, checktime, newlink){
        $.post("php/checkifsaved.php", {conversation: conversation, type: type, hash: hash}, function(data){
            if (data == hash){
                if (typeof newlink != "undefined") {
                    Db.savelink(newlink);
                } else {
                    if (showingsavingicon) setTimeout( function() {$("#saving").fadeOut(300)}, 400);
                    showingsavingicon = false;
                }
            } else {
                var actualtime = new Date().getTime();
                if (actualtime - checktime < 10000){
                    setTimeout(function(){checkifsaved(type, hash, checktime, newlink)}, 400);
                } else {
                    alert(webtextModule.tx_an_error);
                    location.reload(true);
                }
            }
        });
    }

    function checkifsavedonlynode(type, hash, checktime){
        $.post("php/checkifsaved.php", {conversation: conversation, type: type, hash: hash}, function(data){
            if (data == hash){
                if (showingsavingicon) setTimeout( function() {$("#saving").fadeOut(300)}, 400);
                showingsavingicon = false;
            } else {
                var actualtime = new Date().getTime();
                if (actualtime - checktime < 10000){
                    setTimeout(function(){checkifsavedonlynode(type, hash, checktime)}, 200);
                } else {
                    alert(webtextModule.tx_an_error);
                    location.reload(true);
                }
            }
        });
    }
	
    Db.checkifsavedinitialnode = function(hash, checktime, newnode){
    	var promise = new Promise();
        $.post("php/checkifsaved.php", {conversation: conversation, type: "node", hash: hash}, function(data){
            if (data == hash){
            	console.log('fulfill');
                promise.fulfill();
            } else {
                var actualtime = new Date().getTime();
                if (actualtime - checktime < 10000){
                    setTimeout(function(){this.checkifsavedinitialnode(hash, checktime, newnode).transferTo(promise)}, 400);
                } else {
                	console.log('reject');
                    promise.reject();
                }
            }
        });
        return promise;
    }
	
    /*Db.checkifsavedinitialnode = function(hash, checktime, newnode){
    	var promise = new Promise();
        $.post("php/checkifsaved.php", {conversation: conversation, type: "node", hash: hash}, function(data){
            if (data == hash){
                ConversationManager.reloadconversation();
            } else {
                
                var actualtime = new Date().getTime();
                if (actualtime - checktime < 10000){
                    setTimeout(function(){checkifsavedinitialnode(hash, checktime, newnode)}, 400);
                } else {
                    alert(webtextModule.tx_an_error);
                    location.reload(true);
                }
            }
        });
    }*/
	
	Db.reloadconversation = function(){
		//setTimeout(function(){ //TODO: this is not part of the Db logic
			window.history.pushState("", "", "?c=" + conversation); //with this alternative two lines, the page is not refreshed
            this.loadconversation();
            try {
            	clearInterval(pulses); //TODO: ERROR pulses undefined
            } catch(e) {}
		//},0);
	}
	
	Db.getinfo = function(){
		$.ajax({
		dataType: 'json',
		url: 'php/getinfo.php',
		data: { conversation: conversation},
		async: false,
		}).done(function(data) {
			if (typeof data.title[0].title == "undefined") {
				opennoconversationpanel();
				return;
			}
			data.title.pop()
			data.editable.pop()
			Model.title = data.title[0].title;
			Model.editable = data.editable[0].editable;
		});
	}
	
	
	Db.gettags = function(){

        $.ajax({
        dataType: 'json',
        url: 'php/gettags.php',
        data: { conversation: conversation},
        async: false,
        }).done(function(data) {
        data.tags.pop()
        Model.tags = data.tags[0].tags;
        });

    }

	
	Db.getmodel = function(){
	//Get the conversation from the DB

		$.ajax({
		dataType: 'json',
		url: 'php/getmodel.php',
		data: { conversation: conversation},
		async: false,
		}).done(function(data) {

		data.nodes.pop();
		data.links.pop();
            
        if (data.nodes == ""){
			opennoconversationpanel();
			return;
		}
		modelfromdb =  { nodes: data.nodes, links: data.links, authors: []};
		}).fail(function(data) {
	    });
	}
	
	
	Db.generatemodel = function(){
	//From the previous DB conversation generate a valid JS conversation
	
		var nodesjs=modelfromdb.nodes;
		var linksjs=modelfromdb.links;
		var numnodesdb=modelfromdb.nodes.length;
		var numlinksdb=modelfromdb.links.length;
		
		var nodeslist = [];

		for (var i=0; i<numnodesdb; i++) {

			var tempadvevalby=(nodesjs[i]['advevalby']).split("$$$$");

			onenodedb = {"hash":parseInt(nodesjs[i]['hash']),"content":nodesjs[i]['content'],"contentsum":nodesjs[i]['contentsum'],"evalpos":parseInt(nodesjs[i]['evalpos']),"evalneg":parseInt(nodesjs[i]['evalneg']),"evaluatedby":(nodesjs[i]['evaluatedby']).split("@@@@"),"adveval":(nodesjs[i]['adveval']).split("@@@@").map(Number),"advevalby":[tempadvevalby[0].split("@@@@"),tempadvevalby[1].split("@@@@"),tempadvevalby[2].split("@@@@"),tempadvevalby[3].split("@@@@")],"type":parseInt(nodesjs[i]['type']),"author":nodesjs[i]['author'],"seed":parseInt(nodesjs[i]['seed']),"time":parseInt(nodesjs[i]['time'])};
	

			nodeslist.push(onenodedb);
		}

		var linkslist = [];
		
		for (var i=0; i<numlinksdb; i++) {
	
			var tempadvevalby=(linksjs[i]['advevalby']).split("$$$$");

			onelinkdb = {"hash":parseInt(linksjs[i]['hash']),"source":parseInt(linksjs[i]['source']),"target":parseInt(linksjs[i]['target']),"direct":parseInt(linksjs[i]['direct']),"evalpos":parseInt(linksjs[i]['evalpos']),"evalneg":parseInt(linksjs[i]['evalneg']),"evaluatedby":(linksjs[i]['evaluatedby']).split("@@@@"),"adveval":(linksjs[i]['adveval']).split("@@@@").map(Number),"advevalby":[tempadvevalby[0].split("@@@@"),tempadvevalby[1].split("@@@@"),tempadvevalby[2].split("@@@@"),tempadvevalby[3].split("@@@@"),tempadvevalby[4].split("@@@@"),tempadvevalby[5].split("@@@@")],"type":linksjs[i]['type'],"author":linksjs[i]['author'],"time":parseInt(linksjs[i]['time'])};

			linkslist.push(onelinkdb);
		}

		modeldb = { nodes: nodeslist, links: linkslist, authors: []};	
	}


    Db.saveandchecknode = function(newnode, newlink){
        if(conversation == "sandbox" || conversation == "sandbox_es") return;
        showingsavingicon = true;
        $("#saving").show();
        Db.savenode(newnode);
        var actualtime = new Date().getTime();
        setTimeout(function(){checkifsaved("node", newnode.hash, actualtime, newlink)}, 300);
    }

    Db.saveandcheckonlynode = function(newnode){
        if(conversation == "sandbox" || conversation == "sandbox_es") return;
        showingsavingicon = true;
        $("#saving").show();
        Db.savenode(newnode);
        var actualtime = new Date().getTime();
        setTimeout(function(){checkifsavedonlynode("node", newnode.hash, actualtime)}, 300);
    }

    Db.saveandchecklink = function(newlink){
        if(conversation == "sandbox" || conversation == "sandbox_es") return;
        $("#saving").show();
        showingsavingicon = true;
        Db.savelink(newlink);
    }

    
	function safejstringsfordb(text){
	    return text.replace(/\\/g,"\\\\").replace(/"/g,'\\"');
	}


	Db.savenode = function(newnode){
	    if(conversation != "sandbox" && conversation != "sandbox_es"){
			var newnodejs = ["hash",newnode.hash,"content",safejstringsfordb(newnode.content),"contentsum",safejstringsfordb(newnode.contentsum),"evalpos",newnode.evalpos,"evalneg",newnode.evalneg,"evaluatedby",(newnode.evaluatedby).join("@@@@"),"adveval",(newnode.adveval).join("@@@@"),"advevalby",(newnode.advevalby[0]).join("@@@@")+'$$$$'+(newnode.advevalby[1]).join("@@@@")+'$$$$'+(newnode.advevalby[2]).join("@@@@")+'$$$$'+(newnode.advevalby[3]).join("@@@@"),"type",newnode.type,"author",newnode.author,"seed",newnode.seed,"time",newnode.time];
			
			newnodestring = newnodejs.join('####');
            
			$.post("php/savenode.php", {newnodephp: newnodestring, conversation: conversation});            
		}
	}


	Db.savelink = function(newlink){
	    if(conversation != "sandbox" && conversation != "sandbox_es"){
			var newlinkjs = ["hash",newlink.hash,"source",newlink.source,"target",newlink.target,"direct", newlink.direct, "evalpos",newlink.evalpos,"evalneg",newlink.evalneg,"evaluatedby",(newlink.evaluatedby).join("@@@@"),"adveval",(newlink.adveval).join("@@@@"),"advevalby",(newlink.advevalby[0]).join("@@@@")+'$$$$'+(newlink.advevalby[1]).join("@@@@")+'$$$$'+(newlink.advevalby[2]).join("@@@@")+'$$$$'+(newlink.advevalby[3]).join("@@@@")+'$$$$'+(newlink.advevalby[4]).join("@@@@")+'$$$$'+(newlink.advevalby[5]).join("@@@@"),"type",newlink.type,"author",newlink.author,"time",newlink.time];
					
			newlinkstring = newlinkjs.join('####');
            
            $.post("php/savelink.php", {newlinkphp: newlinkstring, conversation: conversation});
            
            var actualtime = new Date().getTime();
            checkifsaved("link", newlink.hash, actualtime);

        }
	}
	
	Db.editnode = function(hash, content, contentsum, type){
        
        $.post("php/editnode.php", {conversation:conversation, content:safejstringsfordb(content), contentsum:safejstringsfordb(contentsum), type:type, hash:hash}, function(data){
        });
    }

    Db.editlink = function(hash, type){
        
        $.post("php/editlink.php", {conversation:conversation, type:type, hash:hash}, function(data){
        });
    }

	Db.update_adveval_node = function(){
	    if(conversation != "sandbox" && conversation != "sandbox_es"){
			var table="nodes_" + conversation,
				hash = parseInt(targetnode.hash);

			var value = (targetnode.adveval).join("@@@@");
		

			$.post("php/updateadveval.php", {conversation:conversation, table:table, variable:"adveval", value:value, hash:hash});
			var variable = "advevalby";
			var value = "";

			for (var i=0;i<targetnode.advevalby.length;i++){
			var tempvalue = (targetnode.advevalby[i]).join("@@@@");
			value = value+tempvalue+"$$$$";
			};
		
			value = value.substring(0, value.length - 4);

			$.post("php/updateadvevalby.php", {conversation:conversation, table:table, variable:variable, value:value, hash:hash});


        }
	}


	Db.update_eval_node = function(variable,value){

	    if(conversation != "sandbox" && conversation != "sandbox_es"){
			var table="nodes_" + conversation,
				hash = parseInt(targetnode.hash);
		
			$.post("php/updateeval.php", {conversation:conversation, table:table, variable:variable, value:value, hash:hash});
			var variable = "evaluatedby",
				value = (targetnode.evaluatedby).join("@@@@");
				
			$.post("php/updateevaluatedby.php", {conversation:conversation, table:table, variable:variable, value:value, hash:hash});
        }
	}


	Db.update_eval_link = function(variable,value){

	    if(conversation != "sandbox" && conversation != "sandbox_es"){
			var table="links_" + conversation,
				hash = parseInt(targetlink.hash);
		
			$.post("php/updateeval.php", {conversation:conversation, table:table, variable:variable, value:value, hash:hash});
			var variable = "evaluatedby",
				value = (targetlink.evaluatedby).join("@@@@");
				
			$.post("php/updateevaluatedby.php", {conversation:conversation, table:table, variable:variable, value:value, hash:hash});
        } 
	}


	Db.update_adveval_link = function(){
	    if(conversation != "sandbox" && conversation != "sandbox_es"){
			var table="links_" + conversation,
				hash = parseInt(targetlink.hash);

			var value = (targetlink.adveval).join("@@@@");
		
			$.post("php/updateadveval.php", {conversation:conversation, table:table, variable:"adveval", value:value, hash:hash});
			var variable = "advevalby";
			var value = "";

			for (var i=0;i<targetlink.advevalby.length;i++){
			var tempvalue = (targetlink.advevalby[i]).join("@@@@");
			value = value+tempvalue+"$$$$";
			};
				
			value = value.substring(0, value.length - 4);

			$.post("php/updateadvevalby.php", {conversation:conversation, table:table, variable:variable, value:value, hash:hash});


        }
	}

	Db.update_public_conv = function(){
	//Update the list of conversations in Participate from the DB list
			$.post("php/updatepublicconv.php");
			return false;
	}
	return Db;
});