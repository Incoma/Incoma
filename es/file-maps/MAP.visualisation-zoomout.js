// ************
// ************ Here you can find the functions defined in visualisation-zoomout.js with some of the calls 
// ************ We hope this helps you to understand better the code
// ************

Visualisations.register(new ZoomOut()); //adds the ZoomOut visualization to the Visualizations array
/*
    ZoomOut follows the Presentation/Abstraction/Control pattern:
    * Abstraction: 
            This object keeps all data that is needed for the presentation. If it refers to an external model, it is also responsible
            for updating itself when the external data changes, for example by registering appropiate listeners with the external model.
            The Abstraction also stores the current selection, current zoom state and edit modes (for example "creatinglink")
            Lastly the abstraction provides methods for manipulating its data.
    * Presentation:
            The single main responsibility of the presentation is to take the data from the abstraction and put it on screen.
            It usually provides an update() method that refreshes the screen from the data.
            It should also provide methods for translating screen coordinates to objects from the abstraction (selecting) and for
            registering callbacks for mouseclicks, textedits etc.
            Methods in Presentation never change data directly!
    * Control:
[Not yet implemented]
            This object provides methods for all possible user interactions: editing, creating, deleting, selecting, ...
            These methods receive some parameters and then change the data in the abstraction and the model.
            It also registers callbacks with the presentation for events it wants to interpret. 
 */
//*****************************************************************************************************************************
//stablishes the name and defines the Abstraction, Presentation and Control modules of the visualization
function ZoomOut() {
    this.abstraction = new ZoomOut_Abstraction();
    this.presentation = new ZoomOut_Presentation(this, this.abstraction);
    this.control = new ZoomOut_Control(this, this.abstraction, this.presentation);
    this.init = function (html5node, model) {
        this.abstraction.init(model);
        this.presentation.init(html5node);
    }
    this.destroy = function () {}
}
//*****************************************************************************************************************************
// Start of this == abstraction = model and state of filters [abstraction initialized passing to it a (model)]
function ZoomOut_Abstraction() {
    this.linkFilters = ;
    this.nodeFilters = ;
    this.sizeFilters = ;
    this.init = function (model) {
        this.model = model;      
    }
};
// End of this == abstraction

//*****************************************************************************************************************************
// Start of this == presentation [initialized passing it (html5node, abstraction)]
function ZoomOut_Presentation(VIS, ABSTR) {    
    this.nodecolor =;
    this.linkcolor =;
    this.liveAttributes = new LiveAttributes(ABSTR, this);		    
    this.setViewport = function(tx, ty, zoom, transitionTime) {
    };
	
    // Start of init function = change the html code (.innerHTML) inside of the html5node (adding visualization, text areas, and filters) and calls with the abstraction as a parameter: initSVG, initLinkFilters, initNodeFilters, initSizeFilters (this four will create the filters and the svg and place it in the previous html code)	
    this.init = function (html5node) {		
        html5node.innerHTML =;
	//Create the svg
        initSVG(this, ABSTR, this.width, this.height);
	//Create the legend
        initNodeLegend(this, "legend_nodes", ABSTR.nodeFilters);
        initLinkLegend(this, "legend_links", ABSTR.linkFilters);
	//Create the filters
        initNodeFilters(this, "filt_nodes", ABSTR.nodeFilters);
        initLinkFilters(this, "filt_links", ABSTR.linkFilters);
        initSizeFilters(this, "filt_sizes", ABSTR.sizeFilters);
        // The initfilters take as an input parameter the id of the div where they will be placed (e.g "filt_links"), with appendChild.
    };
	
    // Start of initSVG = create the svg from the abstraction, and place it into the "visualization" html div tag inserted on the html5node	
    function initSVG(PRES, ABSTR, width, height) {
        PRES.force = d3.layout.force();
        var graph = ABSTR.model;
    };
	
    // Start of initLinkFilters = create the html from the filters, appending it (appendChild) to the right div tags
    function initNodeFilters(PRES, columnId, filterlist) {
    };	
	
    function initLinkFilters(PRES, columnId, filterlist) {
    };
		
    function initSizeFilters(PRES, columnId, filterlist) {
    };

	
    function initNodeLegend(PRES, columnId, filterlist) {
	//
    };	

    function initLinkLegend(PRES, columnId, filterlist) {
	//
    };	
	   
	//functions that define the attributes for nodes and links, depending on the filter states.
	//(and functions for user interaction events, they should go in the Control module....)	
    function LiveAttributes(ABSTR, PRES) {
    };
	
    // update functions (svg, nodes and links)
    this.update = function () {
        updateLinks(this);
        updateNodes(this);
	updateRelatedOpacity(this);
    };	
	
    function updateLinks(PRES) {
    };

    function updateNodes(PRES) {
    };

    function updateRelatedOpacity(PRES) {
    };
	
};
// End of this == presentation
//*****************************************************************************************************************************

//shows or hides the filters and legend bars
function hideshowlegend() {
    //
};

function hideshowfilters() {
};

function legendfiltersupdate() {
};

//functions for the rating of nodes and links
function evalpos(){
}

function evalneg(){
}

function linkevalpos(){
}

function linkevalneg(){
}

function evalnode(vote) {
};

function evallink(vote) {
};

//shows the reply options and cancel the creation of a new link, or hides the options if they are already showed
function showreplypanel(){
}

function hidereplypanel(){
}

//shows the create link options
function showcreatelink(){
}

function cancellink(){
}

//creation of a new node
function savenode() {
};
	
function createnode(PRES){
}

function drawnewlinks() {
}

function drawnewnodes() {
};

function addseed(newnode){
}

//creation of a new link
function savelink(d){
}

//changes the color of the prelink line when a new type of link is selected
function changelinktype(){
} 

//defines the Scaler method, for panning and zooming
function Scaler(PRES) {
	// despxp : "pan displacement", the movement produced by mouse dragging
	// despxz : "zoom displacement", the movement that is produced when zooming, to maintain the correct position of the svg
	// despx0 : the rest of movements, like the initial movement, or the one produced when focusing in a node (with the dblclick function)
	// transxz : a memory used to obtain the real mouse dragging displacement from d3.event.translate, that accumulates the "aditional" movement produced when zooming
}

function explode(cx, cy, color){ 
}

function rbexpand(){
}

function drawlinkselect(link, color, delay, time){
}

function hidelinkselect(){
}

function updatecontentlabel(d, time, votes){
}

function clearcontentlabel(){
}

function preparereplynodetype(){
}

function preparereplylinktype(){
}

function showconnecttext(){
}

function mousemove(){}

function mousedown(){}

function mouseup(){}

//given some elements, searchs the ones that has a concrete hash (objective), and returns its index
function searchhash(elements, objective){
}

function existingconnection(sourcehash, targethash){
}

function update_hash_lookup(newnodes, newlinks){
}

//Defines the tutorial of the Sandbox
function changetutorialpanel(){
}

function closetutorialpanel(){
}

function opentutorialpanel(){
}

// Search in the zoomout css file for the value of a property inside a field
function searchCssProp(selector,prop) {
}

// Defines the size of the nodes and links depending on the votes of all of them
function definerenormalization(){
}

//converts from hex color to rgba color
function hex2rgb(hex, opacity) {
}

//replace multiple URLs inside a string in html links
function URLlinks(text) {
}

//replace line breaks with <br> html tags
function nl2br (str, is_xhtml) {   
}

function ZoomOut_Control(VIS, ABSTR, PRES) {};
// End of var ZoomOut