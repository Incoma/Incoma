var Visualisation_Dummy = {
        name: "Dummy", 
        init: function(html5node, model) {
            html5node.innerHTML="Please choose a nickname and a visualisation!";
            }, 
        destroy: function(){} 
    };

var Visualisations = {
                
    visualisations: [Visualisation_Dummy],
                            
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
            
    makeOption: function(name, value) {
        var result = document.createElement("OPTION");
        result.value = value;
        result.appendChild(Visualisations.makeText(name));
        return result;
    },
            

}    