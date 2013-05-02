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

Model.nodeTypes = {
    "General": 1,
    "Question": 2,
    "Answer": 3,
    "Proposal": 4,
    "Info": 5,
};

Model.connectionTypes = {
    "General" : 1, 
    "Agree" : 3,
    "Disagree" : 4, 
    "Consequence" : 2, 
    "Alternative" : 7,
    "Answer": 8,
    "Related": 5,   // legacy
    "Contradiction": 6, // legacy
};

Model.connectionlist = new Array(4) ;
// 1 = General
Model.connectionlist["1"] = ["General", "Agree", "Disagree", "Consequence", "Alternative"]; 
// 2 = Question
Model.connectionlist["2"] = ["General"]; 
// 3 = Answer
Model.connectionlist["3"] = ["Answer"]; 
// 4 = Proposal
Model.connectionlist["4"]= ["General", "Agree", "Disagree", "Alternative"]; 
// 5 = Info
Model.connectionlist["5"]= ["General", "Agree", "Disagree", "Consequence", "Alternative"]; 


Model.nodeFields = [ 
    "hash", "content", 
    "evalpos", "evalneg", "evaluatedby",
    "type", "author", "time"
];

Model.linkFields = [
    "source", "target", 
    "evalpos", "evalneg", "evaluatedby",
    "type", "author", "time"
];


// dynamic information:

Model.model = null;
Model.currentAuthor = "anonymous";

Model.clear = function() {
    this.model = IncomaDefaultModel || { nodes: [], links: [], authors: [Model.currentAuthor]}
};


Model.createNode = function(nodetype, content, author, time) {
    var newHash = Model.model.nodes.length;
    var newNode = {
        "hash": newHash,
        "content": content,
        "evalpos": 0,
		"evalneg": 0,
        "evaluatedby": [],
        "type": nodetype,
        "author": (author || Model.model.currentAuthor),
        "time": (time || Date.now()),
    };
    Model.model.nodes.push(newNode);
};


Model.createLink = function(linktype, source, target, author, time) {
    var newLink = {
        "source": source, 
        "target": target,
        "evalpos": 0, 
        "evalneg": 0,
        "evaluatedby": [],
        "type": linktype,
        "author": (author || Model.model.currentAuthor),
        "time": (time || Date.now()),
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