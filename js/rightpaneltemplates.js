//definition of the html code of the right panel bar for different situations:
// Reply and Connect buttons
// Eval buttons
// Eval buttons with a message
// Reply button clicked
// Connect button clicked
// No buttons

rightpanelhtmlreplyandlink = "<div id='showreply' class='showreplypanel button' onClick='showreplypanel(false)'>"+tx_reply+"</div><div id='showconnect' class='showconnectpanel button' onClick='showcreatelink(false)'>"+tx_connect+"</div><div id='showeditnode' class='button showedit' onClick='showreplypanel(true)' title='"+tx_edit_thought+"'><div id='showediticon'></div></div>";

rightpanelhtmleval = "<div style='float:right; width: 105px;'><div style='float:right;'><div id='nodepos' class='evalpos' onClick='evalpos()'>+</div><div id='nodeneg' class='evalneg' onClick='evalneg()'>-</div></div><br><div id='evalalert' class='linkalerttext noselect' style='float:right;'></div><div id='arrowadveval' style='background-image: url(img/nodechangelight.png)'; class='advevalicon' title='"+tx_change_category+"' onClick='openadvevalnodepanel()';></div></div>";

rightpanelhtmlevalover = "<div style='float:right; width: 105px;'><div style='float:right;'><div id='nodepos' class='evalpos' onClick='evalpos()'>+</div><div id='nodeneg' class='evalneg' onClick='evalneg()'>-</div></div><br><div id='evalalert' class='linkalerttext noselect' style='float:right;'></div></div>";

//rightpanelhtmleval = "<div style='float:right;'><div style='float:right;'><div id='nodepos' class='evalpos' onClick='evalpos()'>+</div><div id='nodeneg' class='evalneg' onClick='evalneg()'>-</div></div><br><div id='arrowadveval' style='background-image: url(img/nodechangelight.png)'; class='advevalicon' title='"+tx_change_category+"' onClick='openadvevalnodepanel()';></div><div id='evalalert' class='linkalerttext noselect' style='float:right;'></div></div>";

rightpanelhtmllinkeval = "<div id='showeditlink' class='button showedit' onClick='showeditlink()' style='margin-top:4px;' title='"+tx_edit_thought+"'><div id='showediticon'></div></div><div style='float:right;'><div id='evalalert' class='alerttext noselect'></div><div id='linkpos' class='evalpos' onClick='linkevalpos()'>+</div><div id='linkneg' class='evalneg' onClick='linkevalneg()'>-</div></div><br><div id='arrowadveval' style='background-image: url(img/nodechangelight.png)'; class='advevaliconlink' title='"+tx_change_category+"' onClick='openadvevallinkpanel()';></div><div id='evalalert' class='linkalerttext noselect' style='float:right;'></div></div>";

rightpanelhtmllinkevalover = "<div id='showeditlink' class='button showedit' style='margin-top:4px;' onClick='showeditlink()' title='"+tx_edit_thought+"'><div id='showediticon'></div></div><div style='float:right;'><div id='evalalert' class='alerttext noselect'></div><div id='linkpos' class='evalpos' onClick='linkevalpos()'>+</div><div id='linkneg' class='evalneg' onClick='linkevalneg()'>-</div></div><br><div id='evalalert' class='linkalerttext noselect' style='float:right;'></div></div>";

rightpanelhtmlreply = "<table><tr><td id='tdnodetype'>"+tx_type_reply+":&nbsp<select id='replynodetype'></select></td><td>&nbsp&nbsp&nbsp&nbsp</td><td id='tdlinktype'>"+tx_type_connection+":&nbsp<select id=\"replylinktype\" style='display:inline-block;'></select></td></tr></table><textarea id='replybox' class='areareply' spellcheck='false' maxlength='5000'></textarea>"+tx_summary_reply+":<textarea id='replyboxsum' class='areareplysum' spellcheck='false' maxlength='100'></textarea>&nbsp&nbsp&nbsp&nbsp<div class='replysavecancel'><center><div class='save button' onClick='savenode()'>"+tx_save+"</div><div class='cancel button' onClick='hidereplypanel()'>"+tx_cancel+"</div></center><div id='replyalert' class='alerttext noselect' style='text-align:right;'>&nbsp</div></div>";

rightpanelhtmllink = "<table><tr><td id='tdconnect'><select id='connectlinktype'></select></td><td><p>&nbsp&nbsp</p></td><td><div class='cancel button' onClick='cancellink()'>"+tx_cancel+"</div></td></tr></table><br><div id='connecttext' class='connecttext'>&nbsp</div>";

rightpaneleditlink = "<table><tr><td id='tdconnect'><select id='connectlinktype'></select></td><td><p>&nbsp&nbsp</p></td><td><div class='save button' onClick='editlink()'>"+tx_save+"</div></td></tr></table><br>";

rightpanelhtmlspace = "<div style='float:left;visibility:hidden;'><div style='float:right;'><div id='nodepos' class='evalpos'>+</div></div><br></div>"; 


rightbarhtml = '<center><div id="changevisualization" class="changevisualization justbutton" onclick="changevisualization();">'+tx_show_timeline+'</div></center><div id="right_bar_header" class="right_bar_header "><div id="contentlabel" class="right_bar_title" ondblclick="rbexpand()">&nbsp</div></div><div id="contbox" class="divareacontent"></div><div id="rightpaneleval"></div><div id="rightpanel"></div><div id="rightpanelspace"></div>';

// var timevisrightbarhtml = '<center><div id="changevisualization" class="changevisualization justbutton" onclick="changevisualization();">'+tx_hide_timeline+'</div></center><div id="timevisdiv" class="timevisdiv"></div>';

//timevisrightbarhtml = '<center><div id="changevisualization" class="changevisualization justbutton" onclick="changevisualization();">'+tx_hide_timeline+'</div></center><div id="timevisdiv" class="timevisdiv"></div>';

timevisrightbarhtml = '<div id="saving" style="display:none;"><div id="savingicon"></div><div id="savingtext">'+tx_saving+'</div></div><center><div id="changevisualization" class="changevisualization justbutton" onclick="changevisualization();">'+tx_hide_timeline+'</div></center><div id="timevisdiv" class="timevisdiv"></div>';
                        
timevisinteracthtml = "<div id='evalalert' class='linkalerttext noselect' style='float:left;'></div><div style='float:right;'><div id='showreply' class='smallshowreplypanel justbutton' onClick='showreplypanel(false)'>"+tx_reply+"</div><div id='showconnect' class='smallshowconnectpanel justbutton' onClick='showcreatelink(false)'>"+tx_connect+"</div><div id='nodepos' class='smallevalpos justbutton' onClick='evalpos()'>+</div><div id='nodeneg' class='smallevalneg justbutton' onClick='evalneg()'>-</div></div>";

  