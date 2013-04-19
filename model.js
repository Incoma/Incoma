
var Model = { 
    model: null,

    clear: function() {
        this.model = { nodes: [], links: [], authors: []}
    },
    
    importFile: function(text, mime) {
        // TODO: check mime for other formats
        switch (mime) {
            case "application/x-incoma+json":
            default:
                this.model = JSON.parse(text);
        }
    }, 
    
    exportFile: function() {
        alert("exportFile: " + this.model.nodes + "-" + this.model.links);
        return { text: JSON.stringify(this.model),
                 mime: "application/x-incoma+json" };
    },
        
};