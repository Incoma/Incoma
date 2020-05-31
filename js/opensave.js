define(function() {

	// module namespace:
	var OpenSave = {};
	
	/*
	    This module provides functions to load and save files.
	    Currently only local files, later also for load from/save to
	    the server
	 */
	 
	 
	(function() { // create anonymous namespace
	
	// browser differences
	var URL = window.URL || window.webkitURL;
	
	
	//blob : objects in memory
	//text : string of characters that are, or can be in a text file
	
	OpenSave.textToBlob = function (text, mime) {
	    return new window.Blob( [text], {type: (mime || "application/octed-stream") } );
	}
	
	/*
	    blob:    blob containg some text
	    onready: function(text) { ... } is called when ready
	 */
	OpenSave.blobToText = function (blob, onready, onerror) {
	    var reader = new FileReader();
	    reader.onerror = onerror;
	    reader.onload = function (evt) {
	        onready(evt.target.result);
	    };
	    reader.readAsText(blob);
	}
	
	
	/*
	    node: an HTML node, possibly an <INPUT> or containg an <INPUT>
	    accept: comma separated list of extensions and/or mime types
	    fileselect: function(file) is called when file is imported
	 */
	OpenSave.addImportListener = function (node, accept, fileselect, onerror) {
	   var control = node.nodeName == "INPUT"? [node] : node.getElementsByTagName("INPUT");
	    if (control && control.length >= 1) {
	        control = control[0];
	    }
	    else {
	        control = null;
	    }
	    if (!control) {
	        control = document.createElement("INPUT");
	        node.appendChild(control);
	    }
	    control.setAttribute("type", "file");
	    control.setAttribute("id", "inputimport");
	    if (accept) {
	        control.setAttribute("accept", accept);
	    }
	   
	    var handleFileSelect = function(evt) {
	        var file = evt.target.files[0];
	        fileselect(file);
	    };
	    control.addEventListener('change', handleFileSelect, false);
	}
	
	/*
	    node: an HTML element, possibly an anchor or containing an anchor
	    caption: what to display in the anchor
	    name: suggestion for the file name (browser might ignore that)
	    getText: function() should return the text to export or null to turn off export
	            if getText() is missing, just caption and name are changed for node
	 */
	OpenSave.addExportListener = function (node, caption, name, getText) {
	  // modified such that the model is saved when the caption is clicked on, instead of at the creation of the caption
	    var lnk = node.nodeName == "A"? [node] : node.getElementsByTagName("A");
	    if (lnk && lnk.length >= 1) {
	        lnk = lnk[0];
	    }
	    else {
	        lnk = null;
	    }
	    if (!lnk) {
	        lnk = document.createElement("A");
	        node.appendChild(lnk);
	    }
	    var oldHref = lnk.getAttribute("href");
	    if (oldHref && URL) {
	        URL.revokeObjectURL(oldHref);
	    }
	    lnk.innerHTML = caption;
	    lnk.setAttribute("download", name);
	    
	    node.onclick = function() { 
	        if (getText) {
	          var text = getText();
	          var mime = "application/octet-stream";
	          if (text && text.text && text.mime) {
	              mime = text.mime;
	              text = text.text;
	          }
	          var url = "";
	          if (text) {
	                if (URL) {
	                    var blob = OpenSave.textToBlob(text, mime);
	                    if (!blob)
	                        alert("blob is null or undefined");
	                    url = URL.createObjectURL(blob);
	                }
	                else {
	                    url = "data:" + mime + ";base64," + btoa(text);
	                }
	          }
	          lnk.setAttribute("href", url);
	        }
	    }
	}
	
	                            
	})(); // end anonymous namespace
	return OpenSave;
});