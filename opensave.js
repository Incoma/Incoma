
var URL = window.URL || window.webkitURL;


function addImportListener(node, accept, fileselect, onerror) {
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
    if (accept) {
        control.setAttribute("accept", accept);
    }
    var handleFileSelect = function(evt) {
        var file = evt.target.files[0];
        fileselect(file);
    };
    control.addEventListener('change', handleFileSelect, false);
}

function addExportListener(node, caption, name, getXml) {
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
    if (oldHref) {
        URL.revokeObjectURL(oldHref);
    }
    lnk.innerHTML = caption;
    lnk.setAttribute("download", name);
    if (getXml) {
        var url = "";
        if (URL) {
            var blob = domToBlob(getXml());
            url = URL.createObjectURL(blob);
        }
        else {
            url = "data:application/x-incoma;charset=UTF8;base64," + btoa(domToText(getXml()));
        }
        alert(url);
        lnk.setAttribute("href", url);
    }
    else {
        lnk.setAttribute("href", "");
    }
//    lnk.addEventListener('click',         function(e) { lnk.setAttribute(); }, false);
}

