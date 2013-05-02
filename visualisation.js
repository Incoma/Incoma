// module namespace:
var Visualisations = {};


(function() { // create anonymous namespace

var PIMPL = new Visualisations_Private();


Visualisations.register = function(obj) {
    PIMPL.visualisations.push(obj);
};

Visualisations.current = function() {
    return PIMPL.current;
};

Visualisations.options = function() {
    return PIMPL.options();
};

Visualisations.select = function(idx) {
    return PIMPL.select(idx);
};

// functions that return the HTML (an input tag, a br tag, ...)
    
/*
 * filter needs these fields:
 * "state": a boolean
 * "name": a string
 */
Visualisations.makeFilterBox = function(filter) {
    var result = document.createElement("INPUT");
    result.type = "checkbox";
    result.checked = filter.state;
    result.name = filter.name;
    return result;
};

Visualisations.makeText = function(txt) {
    return document.createTextNode(txt);
};

Visualisations.makeBR = function() {
    return document.createElement("BR");
};
        
Visualisations.makeNbSpaces = function(n) {
    var txt = "&nbsp;";
    while ( n > 1) {
        txt = txt + "&nbsp;";
        --n;
    }
    return document.createTextNode(txt);
};
        
Visualisations.makeColorRectangle = function(width, height, color) {
    var result = document.createElement("CANVAS");
    result.width  = width; // in pixels
	result.height = height;
	result.style.backgroundColor  = color;
    return result;
};
        
Visualisations.makeTable = function(width) {
    var table  = document.createElement("TABLE");
	table.style.width = width;
	table.setAttribute('border','0');
	table.setAttribute('cellpadding','0');
	table.setAttribute('cellspacing','0');
	var tbody = document.createElement("TBODY");
    table.appendChild(tbody);
    return table;
};

Visualisations.appendTableRow = function(table) {
	var tbody = table.getElementsByTagName("TBODY")[0];
    tbody.appendChild(document.createElement("TR"));
    return table;
}

Visualisations.appendTableCell = function(table, cellContent) {
    var tbody = table.getElementsByTagName("TBODY")[0];
	var trows = tbody.getElementsByTagName("TR");
    var lastrow = null;
    if (trows && trows.length >= 1) {
        lastrow = trows[trows.length-1];
    }
    else {
        lastrow = tbody.appendChild(document.createElement("TR"));
    }
    var tcell = document.createElement("TD");
    if (typeof cellContent == "string") {
        tcell.innerHTML = cellContent;
    }
    else {
        tcell.appendChild(cellContent);
    }
    lastrow.appendChild(tcell);
    return table;
}


Visualisations.makeOption = function(name, value) {
    var result = document.createElement("OPTION");
    result.value = value;
    result.appendChild(Visualisations.makeText(name));
    return result;
};

Visualisations.setOptions = function(selectnode, newOptions) {
     // remove the current options from the connections select object
    var len = selectnode.options.length; 
    while (selectnode.options.length > 0) { 
        selectnode.remove(0); 
    } 
     
    var newOption; 
    // create new options 
    for (var i=0; i < newOptions.length; i++) { 
        newOption = Visualisations.makeOption(newOptions[i].text, newOptions[i].value);
        // add the new option 
        try { 
            selectnode.add(newOption);  // this will fail in DOM browsers but is needed for IE 
        } 
        catch (selectnode) { 
            selectnode.appendChild(newOption); 
        } 
    };
    return selectnode;
};

// end of public part, below is just implementation

function Visualisations_Private() {

    this.current = null;
    
    this.visualisations = [new Visualisation_Dummy()];
    
    function Visualisation_Dummy() {
        this.name = "None"; 
        this.init = function(html5node, model) {
            html5node.innerHTML="<div style='position:relative;top:20px;left:20px;font-size:14pt;'>Please choose a nickname and a visualisation!</div>";
            };
        this.destroy = function(){} 
    };
    
    this.options = function() {
        var result = [];
        for (var i = 0; i < this.visualisations.length; ++i) {
            result.push( {text: this.visualisations[i].name, value: i} );
        }
        return result;
    };
    
    this.select = function(idx) {
        if (this.current) {
            this.current.destroy();
        }
        var newVisualisation = this.visualisations[idx]
        if (newVisualisation) {
            this.current = newVisualisation;
        }
        return this.current;
    };
}; //  Visualisations_Private

}()); // end anonymous namespace