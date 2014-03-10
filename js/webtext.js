	var webtext = "";
	var webtextaux = "";
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
/////////


//	for(var i=0; i<webtext.length; i++){
//             webtext.splice(i, 1, "X"+webtext[i]);
//             webtextaux.splice(i, 1, "X"+webtextaux[i]);
//	};


// Remove line breaks from all strings!
	for(var i=0; i<webtext.length; i++){
             webtext.splice(i, 1, webtext[i].replace(/(\r\n|\n|\r)/gm,""));
             webtextaux.splice(i, 1, webtextaux[i].replace(/(\r\n|\n|\r)/gm,""));
	};


        gettxvariables();
				       

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
this.tx_sandbox=webtext[1];
this.tx_learn=webtext[2];
this.tx_create=webtext[3];
this.tx_start=webtext[4];
this.tx_participate=webtext[5];
this.tx_join=webtext[6];
this.tx_no_conversation=webtext[7];
this.tx_goto_menu=webtext[8];
this.tx_introduce_title=webtext[9];
this.tx_write_first_thought=webtext[10];
this.tx_summary_thought=webtext[11];
this.tx_your_name=webtext[12];
this.tx_select_language=webtext[13];
this.tx_private=webtext[14];
this.tx_public=webtext[15];
this.tx_ok=webtext[16];
this.tx_cancel=webtext[17];
this.tx_order_by=webtext[18];
this.tx_activity=webtext[19];
this.tx_creation=webtext[20];
this.tx_number_thoughts=webtext[21];
this.tx_title=webtext[22];
this.tx_language=webtext[23];
this.tx_select_order=webtext[24];
this.tx_select_conv=webtext[25];
this.tx_filter_lang=webtext[26];
this.tx_all_lang=webtext[27];
this.tx_menu=webtext[28];
this.tx_name=webtext[29];
this.tx_export=webtext[30];
this.tx_import=webtext[31];
this.tx_timeline=webtext[32];
this.tx_reply=webtext[33];
this.tx_connect=webtext[34];
this.tx_type_reply=webtext[35];
this.tx_type_connection=webtext[36];
this.tx_type_relation=webtext[37];
this.tx_summary_reply=webtext[38];
this.tx_save=webtext[39];
this.tx_an_error=webtext[40];
this.tx_loading=webtext[41];
this.tx_legend=webtext[42];
this.tx_hide=webtext[43];
this.tx_show=webtext[44];
this.tx_thoughts=webtext[45];
this.tx_general=String(webtext[46]);
this.tx_question=webtext[47];
this.tx_proposal=webtext[48];
this.tx_info=webtext[49];
this.tx_connections=webtext[50];
this.tx_consequence=webtext[51];
this.tx_agreement=webtext[52];
this.tx_disagreement=webtext[53];
this.tx_alternative=webtext[54];
this.tx_equivalence=webtext[55];
this.tx_norelation=webtext[56];
this.tx_sizes=webtext[57];
this.tx_evaluations=webtext[58];
this.tx_show_tags=webtext[59];
this.tx_show_summaries=webtext[60];
this.tx_already_rated=webtext[61];
this.tx_write_something=webtext[62];
this.tx_write_title=webtext[63];
this.tx_click_hide_show=webtext[64];
this.tx_if_editable=webtext[65];
this.tx_1sec=webtext[66];
this.tx_2sec=webtext[67];
this.tx_2min=webtext[68];
this.tx_2hour=webtext[69];
this.tx_2day=webtext[70];
this.tx_2month=webtext[71];
this.tx_2year=webtext[72];
this.tx_watch_tutorial=webtext[73];
this.tx_want_editable=webtext[74];
this.tx_no_more_lang=webtext[75];
this.tx_help_translate=webtext[76];
this.tx_select_conseq_thought=webtext[77];
this.tx_select_agree_thought=webtext[78];
this.tx_select_disagree_thought=webtext[79];
this.tx_select_related_thought=webtext[80];
this.tx_select_contrad_thought=webtext[81];
this.tx_select_alternat_thought=webtext[82];
this.tx_select_answer_thought=webtext[83];
this.tx_select_equiv_thought=webtext[84];
this.tx_help_translate1=webtext[85];
this.tx_help_translate2=webtext[86];
this.tx_created=webtext[87];
this.tx_1year=webtext[88];
this.tx_1day=webtext[89];
this.tx_1hour=webtext[90];
this.tx_1min=webtext[91];
this.tx_justnow=webtext[92];
this.tx_show_timeline=webtext[93];
this.tx_expand=webtext[94];
this.tx_hide_timeline=webtext[95];
this.tx_show_all_connections=webtext[96];
this.tx_tags=webtext[97];
this.tx_summaries=webtext[98];
this.tx_min_rating=webtext[99];
this.tx_intro_username=webtext[100];
this.tx_connection_by=webtext[101];
this.tx_connection=webtext[102];
this.tx_by=webtext[103];
this.tx_you_already_rated=webtext[104];
this.tx_you_already_rated1=webtext[105];
this.tx_you_already_rated2=webtext[106];
this.tx_you_already_rated_con=webtext[107];
this.tx_you_already_rated_con1=webtext[108];
this.tx_you_already_rated_con2=webtext[109];
this.tx_click_cont=webtext[110];
this.tx_show_direct_connections=webtext[111];
this.tx_tut1=webtext[112];
this.tx_tut2=webtext[113];
this.tx_tut3=webtext[114];
this.tx_tut4=webtext[115];
this.tx_tut5=webtext[116];
this.tx_tut6=webtext[117];
this.tx_tut7=webtext[118];
this.tx_tut8=webtext[119];
this.tx_tut9=webtext[120];
this.tx_tut10=webtext[121];
this.tx_tut11=webtext[122];
this.tx_tut12=webtext[123];
this.tx_tut13=webtext[124];
this.tx_tut14=webtext[125];
this.tx_tut15=webtext[126];
this.tx_tut16=webtext[127];
this.tx_tut17=webtext[128];
this.tx_tut18=webtext[129];
this.tx_tut19=webtext[130];
this.tx_tut20=webtext[131];
this.tx_tut21=webtext[132];
this.tx_tut22=webtext[133];
this.tx_tut23=webtext[134];
this.tx_tut24=webtext[135];
this.tx_tut25=webtext[136];
this.tx_tut26=webtext[137];
this.tx_tut27=webtext[138];
this.tx_blog=webtext[139];
this.tx_morelang=webtext[140];
this.tx_initial_thought=webtext[141];
this.tx_authors=webtext[142];
this.tx_write_your_name=webtext[143];
this.tx_yes=webtext[144];
this.tx_no=webtext[145];
this.tx_edit_thought=webtext[146];
this.tx_change_category=webtext[147];
this.tx_watch_the_evol=webtext[148];
this.tx_saving=webtext[149];
this.tx_change_of_cat=webtext[150];
this.tx_propose_new_node=webtext[151];
this.tx_propose_new_link=webtext[152];
this.tx_changed_after=webtext[153];
this.tx_change=webtext[154];
this.tx_already_propos_node=webtext[155];
this.tx_already_propos_link=webtext[156];
this.tx_new_cat_thought=webtext[157];
this.tx_new_cat_link=webtext[158];
this.tx_select_first_cat=webtext[159];
	}
