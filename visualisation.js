
var Visualisations = {  
    visualisations: [],
                            
    register: function(obj) {
        this.visualisations.append(obj);
    },
    
    // functions that return the HTML (an input tag, a br tag, ...)
        
    makeFilterBox: function(filter) {
        var result = document.createElement("INPUT");
        result.type = "checkbox";
        result.checked = filter.state? "yes" : "no";
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