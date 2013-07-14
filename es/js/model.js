// module namespace:
var Model = {};

/*
    This module stores the data of a debate in Model.model and
    provides methods for loading, saving and editing it.
    It also defines lists of known node/link types and fields.
    The current author is stored in Model.currentAuthor.
    
    This module must be kept independent of any visualisations.    
*/

(function() { // create anonymous namespace

// some static information

Model.nodeTypesArray = ["General", "Pregunta", "Propuesta", "Información"];

Model.linkTypesArray = ["General", "Acuerdo", "Desacuerdo", "Consecuencia", "Alternativa", "Equivalencia", "Sin relación"];

Model.linkConnectTypesArray = ["General", "Consecuencia", "Acuerdo", "Desacuerdo", "Alternativa" , "Equivalencia"];

Model.nodeTypes = {
    "General" : {text: "General", value: 1, image: "img/node1.png"},
    "Pregunta" : {text: "Pregunta", value: 2, image: "img/node2.png"},
    "Propuesta" : {text: "Propuesta", value: 3, image: "img/node3.png"},
    "Información" : {text: "Información", value: 4, image: "img/node4.png"},
};

Model.linkTypes = {
    "General" : {text: "General", value: 1, image: "img/link1.png"}, 
    "Acuerdo" : {text: "Acuerdo", value: 2, image: "img/link2.png"},
    "Desacuerdo" : {text: "Desacuerdo", value: 3, image: "img/link3.png"}, 
    "Consecuencia" : {text: "Consecuencia", value: 4, image: "img/link4.png"}, 
    "Alternativa" : {text: "Alternativa", value: 5, image: "img/link5.png"},
	"Equivalencia": {text: "Equivalencia", value: 6, image: "img/link6.png"},
    "Sin relación": {text: "Sin relación", value: 0, image: "img/link0.png"},
};


function optionList(linkNames) {
    result = [];
    for (var i=0; i < linkNames.length; ++i) {
        result.push(Model.linkTypes[linkNames[i]]);
    };
    return result;
};


Model.connectionList = function(nodeType) {
    switch(nodeType) {
        // 1 = General
        case 1: 
	//************************************
	return optionList( ["General", "Acuerdo", "Desacuerdo", "Consecuencia", "Alternativa", "Equivalencia", "Sin relación"] );
	//************************************
        // 2 = Question
        case 2: 
            return optionList( ["General", "Sin relación"] );
        // 3 = Proposal
        case 3: 
	//***************
	return optionList( ["General", "Alternativa", "Sin relación"] );
	//***************
        // 4 = Info
        case 4: 
            return optionList( ["General", "Acuerdo", "Desacuerdo", "Consecuencia", "Alternativa", "Equivalencia", "Sin relación"] );
        default:
            return [];
    }
};

//*****************
Model.nodeFields = [ 
		    "hash", "content", "contentsum",
    "evalpos", "evalneg", "evaluatedby",
    "type", "author", "seed", "time"
];

Model.linkFields = [
    "hash", "source", "target", "direct", 
    "evalpos", "evalneg", "evaluatedby",
    "type", "author", "time"
];
//*******************

// dynamic information:

Model.model = null;

Model.currentAuthor = null;

Model.currentAuthor = function(name) {
    if(name || name === null)
        Model._currentAuthor = name;
    return Model._currentAuthor || "anonymous";
};

Model.clear = function(model) {
    this.model = model || { nodes: [], links: [], authors: [Model.currentAuthor]}
};


//*************************
Model.createNode = function(nodetype, content, contentsum, author, seed, time) {

    var newHash = parseInt(nodehashit(content + contentsum + nodetype + author + time));
    
   var newNode = {
        "hash": newHash,
        "content": content,
        "contentsum": contentsum,
        "evalpos": 1,
		"evalneg": 0,
        "evaluatedby": [author],
        "type": nodetype,
        "author":  (author || Model.model.currentAuthor),
		"seed":seed,
        "time": (time || Math.floor((new Date()).getTime() / 1000)),
  };
  Model.model.nodes.push(newNode);
};


Model.createLink = function(linktype, source, target, author, time) {

  var hash = hashit(source + target + author + linktype + time);

  var newLink = {
"hash": hash, 
      "source": source, 
      "target": target,
	"direct": 1, 
	"evalpos": 1, 
        "evalneg": 0,
      "evaluatedby": [author],
      "type": linktype,
      "author": (author || Model.model.currentAuthor),
      "time": (time || Math.floor((new Date()).getTime() / 1000)),
  };
  Model.model.links.push(newLink);
};
//*************************    
    
Model.importFile = function(text, mime) {
    // TODO: check mime for other formats
    switch (mime) {
        case "application/x-incoma+json":
        default:
            this.model = JSON.parse(text);
    }
};
    
Model.exportFile = function() {
    return { text: JSON.stringify(Model.cleanModel()),
             mime: "application/x-incoma+json" };
};
       
Model.cleanModel = function(old) {
    if (!old) {
        old = Model.model;
    };
    var rplHash = function(obj) {
        obj.source = obj.source.hash;
        obj.target = obj.target.hash;
    };
    return { nodes:   cleanArray(old.nodes, Model.nodeFields), 
             links:   cleanArray(old.links, Model.linkFields, rplHash), 
             authors: old.authors };
};

// anonymous helper functions:

function cleanArray(oldArray, objectFields, fn) {
    var result = [];
    for (var i = 0; i < oldArray.length; ++i) {
        var newObj = cleanObject(oldArray[i], objectFields, fn);
        result.push(newObj);
    };
    return result;
};

function cleanObject(obj, fields, cleanUp) {
    var cleanObject = {};
    for (var i = 0; i < fields.length; ++i) {
        var f = fields[i];
        cleanObject[f] = obj[f];
    };
    if (cleanUp) {
        cleanUp(cleanObject);
    }
    return cleanObject;
};
                            
})(); // end anonymous namespace