
var Visualisations = {  
    visualisations: [],
                            
    register: function(obj) {
        this.visualisations.push(obj);
    },
    
    // functions that return the HTML (an input tag, a br tag, ...)
        
    /*
     * filter needs these fields:
     * "state": a boolean
     * "name": a string
     */


    makeFilterBox: function(filter) {
        var result = document.createElement("INPUT");
        result.type = "checkbox";
        result.checked = filter.state;
        result.name = filter.name;
        return result;
    },
    
    makeText: function(txt) {
        return document.createTextNode(txt);
    },
    
    makeBR: function() {
        return document.createElement("BR");
    },
            

}    