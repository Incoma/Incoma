//UNUSED

define(function() {
	//functions that define the attributes for nodes and links, depending on the filter states.
    function LiveAttributes(ABSTR, PRES) {

        this.nodeRadius = function (d) {
            if (ABSTR.sizeFilters.evaluations.state) {
				return PRES.renormalizednode(d.evalpos-d.evalneg);
            } else {
                return PRES.nodeSizeDefault;
            }
        };
	
        this.nodeRadiusCount = function (d) {
            if (ABSTR.sizeFilters.evaluations.state) {
				return PRES.renormalizednode(d.evalpos-d.evalneg);
            } else {
                return PRES.nodeSizeDefault;
            }
        };

        this.nodeFill = function (d) {
			if($.inArray(d.hash, PRES.readnodes) < 0){
				return PRES.nodecolor[d.type];
			} else {
				return d3.rgb(PRES.nodecolor[d.type]).darker(PRES.darkernodes).toString();
			}
        };
		
        this.nodeStroke = function (d) {
			if (ABSTR.clickednodehash == d.hash){return PRES.bordercolor.clicked;}
			if (ABSTR.overnodehash == d.hash){return PRES.bordercolor.over;}
			return PRES.bordercolor.normal;
        };		

        this.nodeStrokeWidth = function (d) {
            if (ABSTR.nodeFilters[d.type].state) {
				if ((ABSTR.clickednodehash == d.hash) || (ABSTR.overnodehash == d.hash)){
					return "3px";
				} else {
					return "1px";
				}
            } else {
                return "0px";
            }
        };
		
		this.nodeFillOpacity = function (d) {
            if (ABSTR.nodeFilters[d.type].state) {
                return PRES.nodeOpacityDefault;
            } else {
				return "0";
            }
        };

		this.textFillOpacity = function (d) {
            if (ABSTR.nodeFilters[d.node.type].state) {
                return "1";
            } else {
				return "0";
            }
        };
		
        this.linkStroke = function (d) {
            return PRES.linkcolor[d.type];
        };
		

        this.seedRadius = function (d) {

		            if (ABSTR.nodeFilters[d.homenode.type].state) {
				return PRES.seedSizeDefault *d.seedtype;
		            } else {
		                return 0;
		            }
        };

        this.seedColor = function (d) {
			return d3.rgb(PRES.nodecolor[d.homenode.type]).darker(PRES.darkerarrowsseeds).toString();
        };
		
		
        this.linkArrow = function (d) {
            if (ABSTR.linkFilters[d.type].state && !(ABSTR.treeview && d.direct == 1)) {
				if ( d.type != 5 && d.type != 6 ) {                
					//  alternative and equivalence have no direction
					if (d.type == 2 && d.direct==1){
						return "";
						// agree and disagree have no direction if it is a connection
					} else if (d.type == 3 && d.direct==1) {
						return "";
						// general have no direction if it is a connection
					} else if (d.type == 1 && d.direct==1) {
						return "";
					} else {
						
						if (d.direct==1) {			
							//created by connection
							return "url(#inversearrow"+(d.type)+")";
						} else {
							// created by reply
							return "url(#arrow"+(d.type)+")";
						}
					}
				} else {
					return "";
				}

	        } else {
	            return "";
	        }

        };
		
		
		this.arrowColor = function(type){
			return d3.rgb(PRES.linkcolor[type]).darker(PRES.darkerarrowsseeds).toString();
		}
			

        this.linkStrokeWidth = function (d) {
            if (ABSTR.linkFilters[d.type].state) {
                if (ABSTR.sizeFilters.evaluations.state){
					return PRES.renormalizedlink(d.evalpos-d.evalneg);
				}else{
                    return PRES.linkStrokeWidthDefault;
				}
            } else {
                return 0;
            }
        };
		
		
		this.linkStrokeDashArray = function (d) {
			if (d.direct==1){
				return "8,6";
			} else {
				return "0,0";
			}
		}
		

		this.linkStrokeOpacity = function (d) {
            if ((!ABSTR.linkFilters[d.type].state) || (ABSTR.treeview && d.direct == 1 && d.source.hash != ABSTR.overnodehash && d.target.hash != ABSTR.overnodehash && d.source.hash != ABSTR.clickednodehash && d.target.hash != ABSTR.clickednodehash)) {
                if (ABSTR.selectedlink == d) hidelinkselect();
                return "0";
            } else {
				return (ABSTR.treeview && d.direct == 1) ? PRES.linkOpacityDefault*0.7 : PRES.linkOpacityDefault;
            }
        };
		
		
        this.relatedNodesOpacity = function (d) {
            if (!ABSTR.linkFilters[d.type].state) {		
				affectednodes = PRES.svg.selectAll(".node")
								.filter(function(e){return ((e.hash == d.source.hash)||(e.hash == d.target.hash));})
				for (i=0;i<affectednodes[0].length;i++){
					var showedlinks = false;
					linkofaffectednodes = PRES.svg.selectAll(".link")
								.filter(function(e){return ((affectednodes[0][i].__data__.hash == e.source.hash)||(affectednodes[0][i].__data__.hash == e.target.hash));})
					
					for (j=0;j<linkofaffectednodes[0].length;j++){
						linkopacity = PRES.svg.selectAll(".link")
										.filter(function(e){return e.hash == linkofaffectednodes[0][j].__data__.hash;})
										.style("stroke-opacity");
						if (linkopacity > 0){showedlinks = true};
					};
					
					if (!showedlinks){
						PRES.svg.selectAll(".node")
								.filter(function(e){return e.hash == affectednodes[0][i].__data__.hash;})
								.style("fill-opacity",0)
								.style("stroke-opacity",0);
								
						PRES.svg.selectAll("text")
							.filter(function(e){return e.node.hash == affectednodes[0][i].__data__.hash;})
							.style("fill-opacity",0);
					};
				};
			};
			return PRES.linkcolor[d.type];
		}; 


        this.relatedSeedRadius = function (d) {
            if (!ABSTR.linkFilters[d.type].state) {		
			// Look for all the seeds in nodes connected to the link that is going to be hidden
				affectedseeds = PRES.svg.selectAll(".seed")
								.filter(function(e){return ((e.homenode.hash == d.source.hash)||(e.homenode.hash == d.target.hash));})
				for (i=0;i<affectedseeds[0].length;i++){
				        var showedlinks = false;
					//For each of these seeds, look for other links connected to the same node
					linkofaffectedseeds = PRES.svg.selectAll(".link")
								.filter(function(e){return ((affectedseeds[0][i].__data__.homenode.hash == e.source.hash)||(affectedseeds[0][i].__data__.homenode.hash == e.target.hash));})
					//If any of these other links is visible (opacity not 0), then the variable showedlinks turns to true
					for (j=0;j<linkofaffectedseeds[0].length;j++){
						linkopacity = PRES.svg.selectAll(".link")
										.filter(function(e){return e.hash == linkofaffectedseeds[0][j].__data__.hash;})
										.style("stroke-opacity");
						if (linkopacity > 0){showedlinks = true};
					};
					//If the variable showedlinks is false (all the links of the node are hidden), then it hiddes the seed
					if (!showedlinks){
						PRES.svg.selectAll(".seed")
							.filter(function(e){return e.homenode.hash == affectedseeds[0][i].__data__.homenode.hash;})
				            .attr("r", 0);			
					};
				};

			};
			return PRES.linkcolor[d.type];
		}; 


        this.relatedLinksOpacity = function (d) {
            if (!ABSTR.nodeFilters[d.type].state) {
			
				PRES.svg.selectAll(".link")
                    .filter(function (e) {return e.source.hash == d.hash;})
                    .style("stroke-opacity", 0);

				PRES.svg.selectAll(".link")
					.filter(function (e) {return e.source.hash == d.hash;})
					.attr("marker-start", "");

				PRES.svg.selectAll(".link")
					.filter(function (e) {return e.target.hash == d.hash;})
					.style("stroke-opacity", 0);

				PRES.svg.selectAll(".link")
					.filter(function (e) {return e.target.hash == d.hash;})
					.attr("marker-start", "");

            }
			return PRES.nodecolor[d.type];
        };		

	
	
//functions for user interaction events	

		//if the user is creating a new link, updates the prelink line position and color
        this.mousemove = function (d) {
			if (ABSTR.creatinglink && selectedconnectlinktype != 0 && !ABSTR.freezelink){
                var nodes = PRES.force.nodes();
                var index = searchhash(nodes, ABSTR.clickednodehash);
                PRES.linecolor = PRES.linkcolor[selectedconnectlinktype];
				
				var x1 = nodes[index].x,
					y1 = nodes[index].y,
                    p2 = PRES.scaler.translate(d3.mouse(svg)),
                    x2 = p2[0],
                    y2 = p2[1];
				
				PRES.prelink
					.attr("x1", x1)
					.attr("y1", y1)
					.attr("x2", x2)
					.attr("y2", y2)
					.style("stroke", PRES.linecolor);
			}
		};

		
        this.mouseover = function (d) {
		
			if (ABSTR.overnode || !ABSTR.letmouseover){return;}
			
			var fillopacity = PRES.svg.selectAll(".node")
						.filter(function (e) {return e.hash == d.hash;})
						.style("fill-opacity");	
								
			if (fillopacity == 0){return};
			
			ABSTR.overnode = true;
						
			//if ((ABSTR.clickednodehash === "" && ABSTR.clickedlinkhash === "") || (ABSTR.creatinglink && (ABSTR.clickednodehash != d.hash || ABSTR.timevisualization))){
								
				ABSTR.overnodehash = d.hash;
				
				PRES.svg.selectAll(".node")
					.transition().delay(100).duration(0)
					.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
					.style("stroke", PRES.liveAttributes.nodeStroke);
				
				PRES.svg.selectAll(".link")
					.transition().delay(100).duration(0)
					.style("stroke-opacity", PRES.liveAttributes.linkStrokeOpacity);
				
				timednodecontentlabel = setTimeout(function(){

					if (ABSTR.timevisualization){
					
						overindex = $.inArray(d, timednodes);
						var id = "nodecontent"+overindex;
						overdivcontent(id);
						
						$('#timevisdiv').animate({
							scrollTop: $('#timevisdiv').scrollTop()+$("#"+id).position().top-60
						}, 400);
					
					} else {
					
						$("#right_bar").height('auto');
						$('#rightpaneleval').html(rightpanelhtmlevalover);
						$('#rightpanelspace').html("");
						document.getElementById("nodepos").innerHTML = "+" + d.evalpos;
						document.getElementById("nodeneg").innerHTML = ((d.evalneg===0) ? "" : "-") + d.evalneg;	
						
						$("#contbox").stop().slideDown(0);
						document.getElementById("contentlabel").setAttribute ("style", "border: solid 3px " + hex2rgb(PRES.bordercolor.over, 0.6) + "; background: "+  hex2rgb(PRES.nodecolor[ABSTR.nodeFilters[d.type].typeId],0.5) +";");
					    if (d.seed == 2){
				 	              document.getElementById("contentlabel").innerHTML = "<b>" +Webtext.tx_initial_thought+ "</b>" + "&nbsp&nbsp" + " ("+Webtext.tx_by+" " +d.author + " - "+DateTime.timeAgo(d.time)+")";			
					    } else {
	    				document.getElementById("contentlabel").innerHTML = "<b>" + ABSTR.nodeFilters[d.type].name + "</b>" + "&nbsp&nbsp" + " ("+Webtext.tx_by+" " +d.author + " - "+DateTime.timeAgo(d.time)+")";
					    };
					
						document.getElementById("contbox").innerHTML = URLlinks(nl2br(d.content));
					}
				},150);
			//}
        };
		
		
        this.mouseoverseed = function (e) {
			clearTimeout(timedmouseout);
			ABSTR.overseed = true;
        };


        this.mouseoverlink = function (d) {
		
	    if (ABSTR.treeview && d.direct == 1){return;}

			ABSTR.overlink = true;
			
			var strokeopacity = PRES.svg.selectAll(".link")
						.filter(function (e) {return e.hash == d.hash;})
						.style("stroke-opacity");	
								
			if (strokeopacity == 0){return};
			
			if (ABSTR.clickednodehash === "" && ABSTR.clickedlinkhash === ""){          
				
				drawlinkselect(d, PRES.bordercolor.over, 100, 0);

				ABSTR.selectedlink = d;
				
				timedlinkcontentlabel = setTimeout(function(){
				
					if (ABSTR.timevisualization){return;}
					
					$('#rightpaneleval').html(rightpanelhtmllinkevalover);
                    $("#showeditlink").hide();
					$('#rightpanelspace').html("");
					document.getElementById("linkpos").innerHTML = "+" + d.evalpos;
					document.getElementById("linkneg").innerHTML = ((d.evalneg===0) ? "" : "-") + d.evalneg;	

					
					document.getElementById("contentlabel").setAttribute ("style", "border: solid 3px " + hex2rgb(PRES.bordercolor.over, 0.6) + "; background: "+  hex2rgb(PRES.linkcolor[ABSTR.linkFilters[d.type].typeId],0.5) +";");

				        document.getElementById("contentlabel").innerHTML = "<b>" + ABSTR.linkFilters[d.type].name + "</b>" + "&nbsp&nbsp" + " ("+Webtext.tx_by+" " +d.author + " - "+DateTime.timeAgo(d.time)+")";

					
					$("#right_bar").height($("#right_bar").height());
					$("#contbox").stop().slideUp(0);
					
				},150);

			}
        };
		

        this.mouseout = function (d) {
		
			if (!ABSTR.letmouseover){return;};
			
			timedmouseout = setTimeout(function(){
			
				ABSTR.overnode = false;
				ABSTR.overnodehash = "";
				
				clearTimeout(timednodecontentlabel);
				
				
				PRES.svg.selectAll(".node")
					.transition().duration(1)
					.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
					.style("stroke", PRES.liveAttributes.nodeStroke);
					
				PRES.svg.selectAll(".link")
					.transition().duration(1)
					.style("stroke-opacity", PRES.liveAttributes.linkStrokeOpacity);
				
					
				if(ABSTR.clickednodehash === "" && ABSTR.clickedlinkhash === ""){

					if (ABSTR.timevisualization){
					
						var index = $.inArray(d, timednodes);
						var id = "nodecontent"+index;
						outdivcontent(id);
						
					} else {
						clearcontentlabel();
					}
				}
				
				//if(ABSTR.creatinglink){
				
					timednodecontentlabel = setTimeout(function(){
						
						if (ABSTR.timevisualization){
							var index = $.inArray(d, timednodes);
							var id = "nodecontent"+index;
							outdivcontent(id);
                            return;
						}
		
				
				if(ABSTR.clickednodehash !== ""){
						document.getElementById("contentlabel").setAttribute ("style", "border: solid 3px " + hex2rgb(PRES.bordercolor.clicked, 0.7) + "; background: "+  hex2rgb(PRES.nodecolor[ABSTR.nodeFilters[ABSTR.clickednode.type].typeId],0.5) +";");
					    if (ABSTR.clickednode.seed == 2){
					                                 document.getElementById("contentlabel").innerHTML = "<b>"  +Webtext.tx_initial_thought+ "</b>" + "&nbsp&nbsp" + " ("+Webtext.tx_by+" " +ABSTR.clickednode.author + " - "+DateTime.timeAgo(ABSTR.clickednode.time)+")";
					    } else {
					    document.getElementById("contentlabel").innerHTML = "<b>" + ABSTR.nodeFilters[ABSTR.clickednode.type].name + "</b>" + "&nbsp&nbsp" + " ("+Webtext.tx_by+" " +ABSTR.clickednode.author + " - "+DateTime.timeAgo(ABSTR.clickednode.time)+")";
					    };

						document.getElementById("contbox").innerHTML = URLlinks(nl2br(ABSTR.clickednode.content));
						
						document.getElementById("nodepos").innerHTML = "+" + ABSTR.clickednode.evalpos;
						document.getElementById("nodeneg").innerHTML = ((ABSTR.clickednode.evalneg===0) ? "" : "-") + ABSTR.clickednode.evalneg;	
		
				};



				if(ABSTR.clickedlinkhash !== ""){

                var links2 = PRES.force.links();
                var targetindex2 = searchhash(links2, ABSTR.clickedlinkhash);
                clickedlink2 = links2[targetindex2];
				$('#rightpaneleval').html(rightpanelhtmllinkeval);
				$('#rightpanel').html("");
				$('#rightpanelspace').html("");
                var elapsedtime = (new Date().getTime() / 1000) - ABSTR.selectedlink.time;
                var recentnewlink = ($.inArray(ABSTR.selectedlink, PRES.sessionlinks) > -1 && elapsedtime < 300);
                (recentnewlink || Model.editable == "1") ? $("#showeditlink").show() : $("#showeditlink").hide();

			document.getElementById("contentlabel").setAttribute ("style", "border: solid 3px " + hex2rgb(PRES.bordercolor.clicked, 0.7) + "; background: "+  hex2rgb(PRES.linkcolor[ABSTR.linkFilters[clickedlink2.type].typeId],0.5) +";");

		document.getElementById("contentlabel").innerHTML = "<b>" + ABSTR.linkFilters[clickedlink2.type].name + " " + "</b>" + "&nbsp&nbsp" + " ("+Webtext.tx_by+" " +clickedlink2.author + " - "+DateTime.timeAgo(clickedlink2.time)+")";

					
					document.getElementById("linkpos").innerHTML = "+" + clickedlink2.evalpos;
					document.getElementById("linkneg").innerHTML = ((clickedlink2.evalneg===0) ? "" : "-") + clickedlink2.evalneg;	
					$('#nodepos').addClass('evalbutton').css("border-color", "#888");
					$('#nodeneg').addClass('evalbutton').css("border-color", "#888");
			
					$("#right_bar").height($("#right_bar").height());
					$('#right_bar').stop().fadeTo(200,1);
					$("#contbox").stop().slideUp(0);
				};
					
					},0);				
				
				//}
				
			},10);
        };
		

        this.mouseoutlink = function (d) {
			
			ABSTR.overlink = false;
			
			if (typeof timedlinkcontentlabel != "undefined") clearTimeout(timedlinkcontentlabel);
			
			if (ABSTR.clickedlinkhash === ""){
			
				hidelinkselect(); //TODO: why is this in LiveAttributes?!
				
				if (ABSTR.clickednodehash === "" && ABSTR.overnodehash === ""){	
					if (ABSTR.timevisualization){return;}
					
					clearcontentlabel();

				}
			} 
        };
		
		
        this.mouseoutseed = function (e) {
			ABSTR.overseed = false;
        };
		
		
        this.backgroundclick = function (d) {
		
			clearSelection();

			if (!ABSTR.creatinglink && !ABSTR.overnode && !ABSTR.overlink){
			
				hidelinkselect();
				
				if (ABSTR.timevisualization){
                    
                    if (oldindex != ""){
                        var color = d3.rgb(PRES.nodecolor[timednodes[oldindex].type]).darker(0).toString();
                        $("#nodecontent"+oldindex).css({"border": "solid 1px "+color});
                        $("#nodeinteract"+oldindex).height("24px");
                        $("#nodeinteract"+oldindex).html("");
                        oldindex = "";
                    }
					
				}else{
					clearcontentlabel();
				}
				
				ABSTR.clickednode = "";
				ABSTR.clickednodehash = "";
				ABSTR.clickedlinkhash = "";
				ABSTR.overnodehash = "";
				ABSTR.replying = false;
                if (ABSTR.advevalnode){
                    advevalnodepanelcancel();
                };
                if (ABSTR.advevallink){
                    advevallinkpanelcancel();
                };
				ABSTR.advevalnode = false;
				ABSTR.advevallink = false;
				
				PRES.svg.selectAll(".node")
					.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
					.style("stroke", PRES.liveAttributes.nodeStroke);
				
				PRES.svg.selectAll(".link")
					.style("stroke", PRES.liveAttributes.linkStroke)
					.style("stroke-opacity", PRES.liveAttributes.linkStrokeOpacity);
				
				

			};
        };		

		
        this.click = function (d) {
		
	    if (ABSTR.advevalnode){
		advevalnodepanelcancel();
	    };
	    if (ABSTR.advevallink){
		advevallinkpanelcancel();
	    };
	    ABSTR.advevalnode = false;
	    ABSTR.advevallink = false;

			var fillopacity = PRES.svg.selectAll(".node")
									.filter(function (e) {return e.hash == d.hash;})
									.style("fill-opacity");	
									
			if (fillopacity == 0){
				PRES.liveAttributes.backgroundclick();
				return;
			};
				
			if (ABSTR.creatinglink && selectedconnectlinktype != 0){
				if (d.hash != ABSTR.clickednodehash && !existingconnection(ABSTR.clickednodehash,d.hash)){
					savelink(d);
				}
				
			}else{
			
				hidelinkselect();
				
				ABSTR.clickednodehash = d.hash;
				ABSTR.clickednode = d;
				ABSTR.clickedlinkhash = "";
				ABSTR.replying = false;
                
                if (ABSTR.advevalnode){
                    advevalnodepanelcancel();
                };
                if (ABSTR.advevallink){
                    advevallinkpanelcancel();
                };
                
                ABSTR.advevalnode = false;
				ABSTR.advevallink = false;

				if($.inArray(d.hash, PRES.readnodes) < 0){
					PRES.readnodes.push(d.hash);
				}
				
				
				PRES.svg.selectAll(".node")
					.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
					.style("stroke", PRES.liveAttributes.nodeStroke)
					.style("fill",PRES.liveAttributes.nodeFill);
					
				PRES.svg.selectAll(".link")
					.style("stroke-opacity", PRES.liveAttributes.linkStrokeOpacity);
		
				if (!ABSTR.timevisualization){
					$("#right_bar").height('auto');
					$('#rightpaneleval').html(rightpanelhtmleval);
					$('#rightpanel').html(rightpanelhtmlreplyandlink);
                    var elapsedtime = (new Date().getTime() / 1000) - ABSTR.clickednode.time;
                    var recentnewnode = ($.inArray(ABSTR.clickednode, PRES.sessionnodes) > -1 && elapsedtime < 300);
                    (recentnewnode || Model.editable == "1") ? $("#showeditnode").show() : $("#showeditnode").hide();
					$('#rightpanelspace').html("");
					$('#nodepos').addClass('evalbutton').css("border-color", "#888");
					$('#nodeneg').addClass('evalbutton').css("border-color", "#888");
				}
				
				timedcontentlabel = setTimeout(function(){
				
					if (ABSTR.timevisualization){
						index = $.inArray(d, timednodes);
						var id = "nodecontent"+index;
						
						selectdivcontent(index);
						$('#timevisdiv').animate({
							scrollTop: $('#timevisdiv').scrollTop()+$("#"+id).position().top-60
						}, 400);
						
					} else{
				
						$('#right_bar').stop().fadeTo(200, 1);
							$("#contbox").stop().slideDown(0);
							
                        document.getElementById("contentlabel").setAttribute ("style", "border: solid 3px " + hex2rgb(PRES.bordercolor.clicked, 0.7) + "; background: "+  hex2rgb(PRES.nodecolor[ABSTR.nodeFilters[d.type].typeId],0.5) +";");	
					   if (d.seed == 2){
						  document.getElementById("contentlabel").innerHTML = "<b>" +Webtext.tx_initial_thought+ "</b>" + "&nbsp&nbsp" + " ("+Webtext.tx_by+" " +d.author + " - "+DateTime.timeAgo(d.time)+")";			
					   } else {
				            document.getElementById("contentlabel").innerHTML = "<b>" + ABSTR.nodeFilters[d.type].name + "</b>" + "&nbsp&nbsp" + " ("+Webtext.tx_by+" " +d.author + " - "+DateTime.timeAgo(d.time)+")";
					   };
                        document.getElementById("contbox").innerHTML = URLlinks(nl2br(d.content));
                        
                        document.getElementById("nodepos").innerHTML = "+" + d.evalpos;
                        document.getElementById("nodeneg").innerHTML = ((d.evalneg===0) ? "" : "-") + d.evalneg;	
					}	
				},0);
				
			};			
		};
		
		
		//focus on the double clicked node
		this.dblclick = function (d) {
			nodefocus(d, 2);
		};

		
		//if the user is not creating a new link, selects the clicked link, changing its stroke color and showing its information in the content label
        this.clicklink = function (d) {

	    if (ABSTR.advevalnode){
		advevalnodepanelcancel();
	    };
	    if (ABSTR.advevallink){
		advevallinkpanelcancel();
	    };
	    ABSTR.advevalnode = false;
	    ABSTR.advevallink = false;

            //if (!ABSTR.creatinglink && !(ABSTR.treeview && d.direct == 1)){
			if (!ABSTR.creatinglink && PRES.liveAttributes.linkStrokeOpacity(d) != 0){
				
				drawlinkselect(d, PRES.bordercolor.clicked, 0, 0);
				
				ABSTR.clickednodehash = "";
				ABSTR.clickedlinkhash = d.hash;
				ABSTR.selectedlink = d;
				
				PRES.svg.selectAll(".node")
					.style("stroke-width", PRES.liveAttributes.nodeStrokeWidth)
					.style("stroke", PRES.liveAttributes.nodeStroke);
					
				
				$('#rightpaneleval').html(rightpanelhtmllinkeval);
				$('#rightpanel').html("");
				$('#rightpanelspace').html("");
                var elapsedtime = (new Date().getTime() / 1000) - ABSTR.selectedlink.time;
                var recentnewlink = ($.inArray(ABSTR.selectedlink, PRES.sessionlinks) > -1 && elapsedtime < 300);
                (recentnewlink || Model.editable == "1") ? $("#showeditlink").show() : $("#showeditlink").hide();
                
				
				timedcontentlabel = setTimeout(function(){
				
					if (ABSTR.timevisualization){return;}
					
					document.getElementById("contentlabel").setAttribute ("style", "border: solid 3px " + hex2rgb(PRES.bordercolor.clicked, 0.7) + "; background: "+  hex2rgb(PRES.linkcolor[ABSTR.linkFilters[d.type].typeId],0.5) +";");
		document.getElementById("contentlabel").innerHTML = "<b>" + ABSTR.linkFilters[d.type].name + " " + "</b>" + "&nbsp&nbsp" + " ("+Webtext.tx_by+" " +d.author + " - "+DateTime.timeAgo(d.time)+")";

					
					document.getElementById("linkpos").innerHTML = "+" + d.evalpos;
					document.getElementById("linkneg").innerHTML = ((d.evalneg===0) ? "" : "-") + d.evalneg;	
					$('#nodepos').addClass('evalbutton').css("border-color", "#888");
					$('#nodeneg').addClass('evalbutton').css("border-color", "#888");
					
					$("#right_bar").height($("#right_bar").height());
					$('#right_bar').stop().fadeTo(200,1);
					$("#contbox").stop().slideUp(0);
				},0);
		
			};
		};

    };
    
    
	function clearSelection() {
	    if ( document.selection ) {
	        document.selection.empty();
	    } else if ( window.getSelection ) {
	        window.getSelection().removeAllRanges();
	    }
	}
	
	return LiveAttributes;
});