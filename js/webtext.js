define([], function() {
	getwebsitetext();
	webtext.unshift("0.");
	webtextaux.unshift("0.");
	for(var i=0; i<webtext.length; i++){
             webtext.splice(i, 1, webtext[i].slice(webtext[i].search(/\./g)+2));
             webtextaux.splice(i, 1, webtextaux[i].slice(webtextaux[i].search(/\./g)+2));
	};
	
	/////////
	/// The lines of "time ago" are modified!
	/////////
	webtextaux.splice(66, 1, webtextaux[66].slice(0,webtextaux[66].search(/[0-9]/g)));
	webtextaux.splice(67, 1, webtextaux[67].slice(0,webtextaux[67].search(/[0-9]/g)));
	webtextaux.splice(68, 1, webtextaux[68].slice(0,webtextaux[68].search(/[0-9]/g)));
	webtextaux.splice(69, 1, webtextaux[69].slice(0,webtextaux[69].search(/[0-9]/g)));
	webtextaux.splice(70, 1, webtextaux[70].slice(0,webtextaux[70].search(/[0-9]/g)));
	webtextaux.splice(71, 1, webtextaux[71].slice(0,webtextaux[71].search(/[0-9]/g)));
	webtextaux.splice(72, 1, webtextaux[72].slice(0,webtextaux[72].search(/[0-9]/g)));
	webtextaux.splice(88, 1, webtextaux[88].slice(0,webtextaux[88].search(/[0-9]/g)));
	webtextaux.splice(89, 1, webtextaux[89].slice(0,webtextaux[89].search(/[0-9]/g)));
	webtextaux.splice(90, 1, webtextaux[90].slice(0,webtextaux[90].search(/[0-9]/g)));
	webtextaux.splice(91, 1, webtextaux[91].slice(0,webtextaux[91].search(/[0-9]/g)));
	webtext.splice(66, 1, webtext[66].slice(webtext[66].search(/[0-9]/g)+2));
	webtext.splice(67, 1, webtext[67].slice(webtext[67].search(/[0-9]/g)+2));
	webtext.splice(68, 1, webtext[68].slice(webtext[68].search(/[0-9]/g)+2));
	webtext.splice(69, 1, webtext[69].slice(webtext[69].search(/[0-9]/g)+2));
	webtext.splice(70, 1, webtext[70].slice(webtext[70].search(/[0-9]/g)+2));
	webtext.splice(71, 1, webtext[71].slice(webtext[71].search(/[0-9]/g)+2));
	webtext.splice(72, 1, webtext[72].slice(webtext[72].search(/[0-9]/g)+2));
	webtext.splice(88, 1, webtext[88].slice(webtext[88].search(/[0-9]/g)+2));
	webtext.splice(89, 1, webtext[89].slice(webtext[89].search(/[0-9]/g)+2));
	webtext.splice(90, 1, webtext[90].slice(webtext[90].search(/[0-9]/g)+2));
	webtext.splice(91, 1, webtext[91].slice(webtext[91].search(/[0-9]/g)+2));
	
	// Remove line breaks from all strings!
	for(var i=0; i<webtext.length; i++){
             webtext.splice(i, 1, webtext[i].replace(/(\r\n|\n|\r)/gm,""));
             webtextaux.splice(i, 1, webtextaux[i].replace(/(\r\n|\n|\r)/gm,""));
	};
   return gettxvariables(webtext);
});

	



	


				       

	function getwebsitetext(){

//		var lang = "eng";
	
		$.ajax({
		dataType: 'json',
		url: 'php/getwebsitetext.php',
		data: { weblang: weblang},
		async: false,
		}).done(function(langfile) {
		webtext=langfile;
		webtextaux=webtext.slice();
		});

	}


function gettxvariables(){
	var ret = {};
	ret.tx_sandbox=webtext[1];
	ret.tx_learn=webtext[2];
	ret.tx_create=webtext[3];
	ret.tx_start=webtext[4];
	ret.tx_participate=webtext[5];
	ret.tx_join=webtext[6];
	ret.tx_no_conversation=webtext[7];
	ret.tx_goto_menu=webtext[8];
	ret.tx_introduce_title=webtext[9];
	ret.tx_write_first_thought=webtext[10];
	ret.tx_summary_thought=webtext[11];
	ret.tx_your_name=webtext[12];
	ret.tx_select_language=webtext[13];
	ret.tx_private=webtext[14];
	ret.tx_public=webtext[15];
	ret.tx_ok=webtext[16];
	ret.tx_cancel=webtext[17];
	ret.tx_order_by=webtext[18];
	ret.tx_activity=webtext[19];
	ret.tx_creation=webtext[20];
	ret.tx_number_thoughts=webtext[21];
	ret.tx_title=webtext[22];
	ret.tx_language=webtext[23];
	ret.tx_select_order=webtext[24];
	ret.tx_select_conv=webtext[25];
	ret.tx_filter_lang=webtext[26];
	ret.tx_all_lang=webtext[27];
	ret.tx_menu=webtext[28];
	ret.tx_name=webtext[29];
	ret.tx_export=webtext[30];
	ret.tx_import=webtext[31];
	ret.tx_timeline=webtext[32];
	ret.tx_reply=webtext[33];
	ret.tx_connect=webtext[34];
	ret.tx_type_reply=webtext[35];
	ret.tx_type_connection=webtext[36];
	ret.tx_type_relation=webtext[37];
	ret.tx_summary_reply=webtext[38];
	ret.tx_save=webtext[39];
	ret.tx_an_error=webtext[40];
	ret.tx_loading=webtext[41];
	ret.tx_legend=webtext[42];
	ret.tx_hide=webtext[43];
	ret.tx_show=webtext[44];
	ret.tx_thoughts=webtext[45];
	ret.tx_general=String(webtext[46]);
	ret.tx_question=webtext[47];
	ret.tx_proposal=webtext[48];
	ret.tx_info=webtext[49];
	ret.tx_connections=webtext[50];
	ret.tx_consequence=webtext[51];
	ret.tx_agreement=webtext[52];
	ret.tx_disagreement=webtext[53];
	ret.tx_alternative=webtext[54];
	ret.tx_equivalence=webtext[55];
	ret.tx_norelation=webtext[56];
	ret.tx_sizes=webtext[57];
	ret.tx_evaluations=webtext[58];
	ret.tx_show_tags=webtext[59];
	ret.tx_show_summaries=webtext[60];
	ret.tx_already_rated=webtext[61];
	ret.tx_write_something=webtext[62];
	ret.tx_write_title=webtext[63];
	ret.tx_click_hide_show=webtext[64];
	ret.tx_if_editable=webtext[65];
	ret.tx_1sec=webtext[66];
	ret.tx_2sec=webtext[67];
	ret.tx_2min=webtext[68];
	ret.tx_2hour=webtext[69];
	ret.tx_2day=webtext[70];
	ret.tx_2month=webtext[71];
	ret.tx_2year=webtext[72];
	ret.tx_watch_tutorial=webtext[73];
	ret.tx_want_editable=webtext[74];
	ret.tx_no_more_lang=webtext[75];
	ret.tx_help_translate=webtext[76];
	ret.tx_select_conseq_thought=webtext[77];
	ret.tx_select_agree_thought=webtext[78];
	ret.tx_select_disagree_thought=webtext[79];
	ret.tx_select_related_thought=webtext[80];
	ret.tx_select_contrad_thought=webtext[81];
	ret.tx_select_alternat_thought=webtext[82];
	ret.tx_select_answer_thought=webtext[83];
	ret.tx_select_equiv_thought=webtext[84];
	ret.tx_help_translate1=webtext[85];
	ret.tx_help_translate2=webtext[86];
	ret.tx_created=webtext[87];
	ret.tx_1year=webtext[88];
	ret.tx_1day=webtext[89];
	ret.tx_1hour=webtext[90];
	ret.tx_1min=webtext[91];
	ret.tx_justnow=webtext[92];
	ret.tx_show_timeline=webtext[93];
	ret.tx_expand=webtext[94];
	ret.tx_hide_timeline=webtext[95];
	ret.tx_show_all_connections=webtext[96];
	ret.tx_tags=webtext[97];
	ret.tx_summaries=webtext[98];
	ret.tx_min_rating=webtext[99];
	ret.tx_intro_username=webtext[100];
	ret.tx_connection_by=webtext[101];
	ret.tx_connection=webtext[102];
	ret.tx_by=webtext[103];
	ret.tx_you_already_rated=webtext[104];
	ret.tx_you_already_rated1=webtext[105];
	ret.tx_you_already_rated2=webtext[106];
	ret.tx_you_already_rated_con=webtext[107];
	ret.tx_you_already_rated_con1=webtext[108];
	ret.tx_you_already_rated_con2=webtext[109];
	ret.tx_click_cont=webtext[110];
	ret.tx_show_direct_connections=webtext[111];
	ret.tx_tut1=webtext[112];
	ret.tx_tut2=webtext[113];
	ret.tx_tut3=webtext[114];
	ret.tx_tut4=webtext[115];
	ret.tx_tut5=webtext[116];
	ret.tx_tut6=webtext[117];
	ret.tx_tut7=webtext[118];
	ret.tx_tut8=webtext[119];
	ret.tx_tut9=webtext[120];
	ret.tx_tut10=webtext[121];
	ret.tx_tut11=webtext[122];
	ret.tx_tut12=webtext[123];
	ret.tx_tut13=webtext[124];
	ret.tx_tut14=webtext[125];
	ret.tx_tut15=webtext[126];
	ret.tx_tut16=webtext[127];
	ret.tx_tut17=webtext[128];
	ret.tx_tut18=webtext[129];
	ret.tx_tut19=webtext[130];
	ret.tx_tut20=webtext[131];
	ret.tx_tut21=webtext[132];
	ret.tx_tut22=webtext[133];
	ret.tx_tut23=webtext[134];
	ret.tx_tut24=webtext[135];
	ret.tx_tut25=webtext[136];
	ret.tx_tut26=webtext[137];
	ret.tx_tut27=webtext[138];
	ret.tx_blog=webtext[139];
	ret.tx_morelang=webtext[140];
	ret.tx_initial_thought=webtext[141];
	ret.tx_authors=webtext[142];
	ret.tx_write_your_name=webtext[143];
	ret.tx_yes=webtext[144];
	ret.tx_no=webtext[145];
	ret.tx_edit_thought=webtext[146];
	ret.tx_change_category=webtext[147];
	ret.tx_watch_the_evol=webtext[148];
	ret.tx_saving=webtext[149];
	ret.tx_change_of_cat=webtext[150];
	ret.tx_propose_new_node=webtext[151];
	ret.tx_propose_new_link=webtext[152];
	ret.tx_changed_after=webtext[153];
	ret.tx_change=webtext[154];
	ret.tx_already_propos_node=webtext[155];
	ret.tx_already_propos_link=webtext[156];
	ret.tx_new_cat_thought=webtext[157];
	ret.tx_new_cat_link=webtext[158];
	ret.tx_select_first_cat=webtext[159];
	return ret;
}