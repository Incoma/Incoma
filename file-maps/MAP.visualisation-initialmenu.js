// ************
// ************ Here you can find the functions defined in visualisation-initialmenu.js with some of the calls 
// ************ The Presentation and Abstraction code is better explained in MAP.visualisation-zoomout.js
// ************ We hope this helps you to understand better the code
// ************

//Contains the html code of the initial menu and the visualization for the background graph animation, with the same structure than "visualization-zoomout.js" (although not the last version) (look this for more details)
Visualisations.register(new InitialMenu()); //adds the InitialMenu visualization to the Visualizations array

//stablishes the name and defines the Abstraction and Presentation modules of the visualization
function InitialMenu() {
    this.name = "Initial Menu",
    this.abstraction = new InitialMenu_Abstraction();
    this.presentation = new InitialMenu_Presentation(this, this.abstraction);
    this.init = function (html5node, model) {
        this.abstraction.init(model);
        this.presentation.init(html5node);
    }
    this.destroy = function () {}
}

//defines arrays and parameters needed for the Abstraction module
function InitialMenu_Abstraction() {
};


//defines the parameters and elements of the Presentation module
function InitialMenu_Presentation(VIS, ABSTR) {
	//defines the html content of the visualization (except the header, defined in index)
    this.init = function (html5node) {
        html5node.innerHTML =;	
        initSVG(this, ABSTR, this.width, this.height);		
		//updates and loads the list of conversations	
		db_update_public_conv();
		db_getconversations();
		conversationlist = completeconversationlist;
		prepareorderselect();
		preparelangselect();
		preparelangfilter();
		prepareconvlistselect();
    };

	//initialization and definition of the SVG and its elements (the graph with nodes, links, prelink line, the force)
    function initSVG(PRES, ABSTR, width, height) {
    };
    
	//the attributes for the nodes and links
    function LiveAttributes(ABSTR, PRES) {
};


function bt_menu(){
    Model.clear(IncomaMenuModel);
	loadmenu();
}

//Functions for the different buttons of the initial menu

//shows the 'create new conversation' panel
function bt_create(){
}

//shows the 'join conversation' panel
function bt_join(){
}

//returns to the initial screen
function bt_cancel(){
}

//loads the sandbox model and the zoom-out visualization
function bt_sandbox(){
	loadsandbox();
}

//loads an existing conversation
function bt_join_ok(){
}

//creates a new conversation
function bt_new_ok(){
	Model.clear(IncomaEmptyModel);
	Model.currentAuthor(author);	
	Model.createNode(1, content, author, 2, time); //creates the initial node, type="general", seed=2
	Model.title = title;
	db_createconversation(conversation,title,time,ispublic, convlanguage);
	db_savenode(Model.model.nodes[0]);
	db_reloadconversation();
}

function prepareconvlistselect(){
}

function orderconversationlist(){
	prepareconvlistselect();	
}

function preparelangselect(){
}

function preparelangfilter(){
}

function prepareorderselect(){
}

function filterbylanguage(){
	orderconversationlist();
	prepareconvlistselect();
}

// Search in the zoomout css file for the value of a property inside a field
function searchCssProp(selector,prop) {
}

