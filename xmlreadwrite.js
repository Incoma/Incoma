window.myBlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder || window.WebKitBlobBuilder;

var textToDom;

if (typeof window.DOMParser != "undefined") {
    textToDom = function(xmlStr) {
        return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
    };
} else if (typeof window.ActiveXObject != "undefined" &&
       new window.ActiveXObject("Microsoft.XMLDOM")) {
    textToDom = function(xmlStr) {
        var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlStr);
        return xmlDoc;
    };
} else {
    throw new Error("No XML parser found");
}

function domToText(dom) {
    var serializer = new XMLSerializer();
    return serializer.serializeToString(dom);
}


function blobToDom(blob, onready, onerror) {
    
    var reader = new FileReader();
    reader.onerror = onerror;
    reader.onload = function (evt) {
        onready(textToDom( evt.target.result ));
    };
    reader.readAsText(blob);
}


function domToBlob(dom) {
    /*try {
        var builder = new myBlobBuilder();
        builder.append((new XMLSerializer()).serializeToString(dom));
        onready(builder.getBlob("text/xml"));
    /*}
    catch (e) {
        onerror(e);
    }*/
    return new window.Blob( [domToText(dom)], {type: "application/x-incoma"} );
}

