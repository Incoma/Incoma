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

Model.nodeTypesArray = ["General", "Question", "Answer", "Proposal", "Info"];

Model.linkTypesArray = ["General", "Agreement", "Disagreement", "Consequence", "Alternative" , "Answer", "Related", "Contradiction", "Equivalence", "No relation"];

Model.linkConnectTypesArray = ["Related", "Consequence", "Agreement", "Disagreement", "Alternative" , "Answer", "Contradiction", "Equivalence"];

Model.nodeTypes = {
    "General" : {text: "General", value: 1, image: "img/node1.png"},
    "Question" : {text: "Question", value: 2, image: "img/node2.png"},
    "Answer" : {text: "Answer", value: 3, image: "img/node3.png"},
    "Proposal" : {text: "Proposal", value: 4, image: "img/node4.png"},
    "Info" : {text: "Info", value: 5, image: "img/node5.png"},
};

Model.linkTypes = {
    "General" : {text: "General", value: 1, image: "img/link1.png"}, 
    "Agreement" : {text: "Agreement", value: 3, image: "img/link3.png"},
    "Disagreement" : {text: "Disagreement", value: 4, image: "img/link4.png"}, 
    "Consequence" : {text: "Consequence", value: 2, image: "img/link2.png"}, 
    "Alternative" : {text: "Alternative", value: 7, image: "img/link7.png"},
    "Answer": {text: "Answer", value: 8, image: "img/link8.png"},
    "No relation": {text: "No relation", value: 0, image: "img/link0.png"},
    "Related": {text: "Related", value: 5, image: "img/link5.png"},   // legacy
    "Contradiction": {text: "Contradiction", value: 6, image: "img/link6.png"}, // legacy
	"Equivalence": {text: "Equivalence", value: 9, image: "img/link9.png"},
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
            return optionList( ["General", "Agreement", "Disagreement", "Consequence", "Alternative", "No relation"] );
        // 2 = Question
        case 2: 
            return optionList( ["General", "No relation"] );
        // 3 = Answer
        case 3: 
            return optionList( ["Answer"] );
        // 4 = Proposal
        case 4: 
            return optionList( ["General", "No relation"] );
        // 5 = Info
        case 5: 
            return optionList( ["General", "Agreement", "Disagreement", "Consequence", "Alternative",  "Contradiction", "Equivalence", "No relation"] );
        default:
            return [];
    }
};


Model.nodeFields = [ 
    "hash", "content", 
    "evalpos", "evalneg", "evaluatedby",
    "type", "author", "seed", "time"
];

Model.linkFields = [
    "source", "target", "direct", 
    "evalpos", "evalneg", "evaluatedby",
    "type", "author", "time"
];


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

Model.createNode = function(nodetype, content, author, seed, time) {

    var newHash = parseInt(hashit(content + nodetype + author + time));

    var newNode = {
        "hash": newHash,
        "content": content,
        "evalpos": 1,
		"evalneg": 0,
        "evaluatedby": [author],
        "type": nodetype,
        "author": (author || Model.model.currentAuthor),
		"seed": seed,
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
		"direct": 1, //...
        "evalpos": 1, 
        "evalneg": 0,
        "evaluatedby": [author],
        "type": linktype,
        "author": (author || Model.model.currentAuthor),
        "time": (time || Math.floor((new Date()).getTime() / 1000)),
    };
    Model.model.links.push(newLink);
};
    
    
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