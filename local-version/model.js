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
    "General" : {text: "General", value: 1},
    "Question" : {text: "Question", value: 2},
    "Answer" : {text: "Answer", value: 3},
    "Proposal" : {text: "Proposal", value: 4},
    "Info" : {text: "Info", value: 5},
};

Model.connectionTypes = {
    "General" : {text: "General", value: 1}, 
    "Agree" : {text: "Agree", value: 3},
    "Disagree" : {text: "Disagree", value: 4}, 
    "Consequence" : {text: "Consequence", value: 2}, 
    "Alternative" : {text: "Alternative", value: 7},
    "Answer": {text: "Answer", value: 8},
    "No relation": {text: "No relation", value: 0},
    "Related": {text: "Related", value: 5},   // legacy
    "Contradiction": {text: "Contradiction", value: 6}, // legacy
};


function optionList(connectionNames) {
    result = [];
    for (var i=0; i < connectionNames.length; ++i) {
        result.push(Model.connectionTypes[connectionNames[i]]);
    };
    return result;
};


Model.connectionList = function(nodeType) {
    switch(nodeType) {
        // 1 = General
        case "1": 
            return optionList( ["General", "Agree", "Disagree", "Consequence", "Alternative", "No relation"] );
        // 2 = Question
        case "2": 
            return optionList( ["General", "No relation"] );
        // 3 = Answer
        case "3": 
            return optionList( ["Answer", "No relation"] );
        // 4 = Proposal
        case "4": 
            return optionList( ["General", "Agree", "Disagree", "Alternative", "No relation"] );
        // 5 = Info
        case "5": 
            return optionList( ["General", "Agree", "Disagree", "Consequence", "Alternative", "No relation"] );
        default:
            return [];
    }
};


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
Model._currentAuthor = null;

Model.currentAuthor = function(name) {
    if(name || name === null)
        Model._currentAuthor = name;
    return Model._currentAuthor || "anonymous";
};

Model.clear = function(model) {
    this.model = model || { nodes: [], links: [], authors: [Model.currentAuthor]}
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