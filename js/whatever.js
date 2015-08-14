define(function() {

//defines the Scaler method, for panning and zooming
	function Scaler(PRES) {
	
		// despxp : "pan displacement", the movement produced by mouse dragging
		// despxz : "zoom displacement", the movement that is produced when zooming, to maintain the correct position of the svg
		// despx0 : the rest of movements, like the initial movement, or the one produced when focusing in a node (with the dblclick function)
		// transxz : a memory used to obtain the real mouse dragging displacement from d3.event.translate, that accumulates the "aditional" movement produced when zooming
	
	    this.oldscale = 1;
	    this.scale = 1;
	    this.trans = [0,0];
	
	    this.zoomval = 1;
	    this.zoommax = 8;
	    this.zoommin = 0.1;
		
		this.zoomincrement = 1.3;
		this.zoomduration = 300;
	
		this.despx0 = -400/2;
		if (conversation === "sandbox" || conversation === "sandbox_es"){this.despx0 = -(400-280)/2;}
		this.despy0 = -(180-50)/2;
			
		this.despx = this.despx0;
		this.despy = this.despy0;
	
	    this.despxp = 0;
	    this.despyp = 0;
	
	    this.transxz = 0;
	    this.transyz = 0;
		
		this.midx = $(window).width()/2 + this.despx0;
		this.midy = $(window).height()/2 + this.despy0;
	
	    var THIS = this;
	    
		
	    this.translate = function(point) {
	        return [ (point[0]-THIS.despx) / THIS.zoomval, (point[1]-THIS.despy) / THIS.zoomval ];
	    };
	
	    
	    this.rescale = function() {
			
	        THIS.trans=d3.event.translate;
	        THIS.scale=d3.event.scale;
	        
	        if (THIS.scale == THIS.oldscale){  //no mousewheel movement, just translation
	        
	            THIS.despxp = THIS.trans[0]-THIS.transxz;
	            THIS.despyp = THIS.trans[1]-THIS.transyz;
				
				THIS.despx = THIS.despx0 + THIS.despxp;
				THIS.despy = THIS.despy0 + THIS.despyp;
				
				// making the transformation directly instead of calling setViewport to avoid a problem caused by transitionTime = 0
				PRES.svg
					.attr("transform","translate(" + THIS.despx + ',' + THIS.despy + ") scale(" + THIS.zoomval + ")"); 
	            
	        } else {	
			
				THIS.oldzoomval = THIS.zoomval;
	            if (THIS.scale > THIS.oldscale){
	                if (THIS.zoomval*1.5 < THIS.zoommax){THIS.zoomval *= THIS.zoomincrement;}
	            } else {
	                if (THIS.zoomval/1.5 > THIS.zoommin){THIS.zoomval /= THIS.zoomincrement;}
	            }
	            
				THIS.despx0 = d3.mouse(this)[0]-(d3.mouse(this)[0]-THIS.despx)*THIS.zoomval/THIS.oldzoomval-THIS.despxp;
				THIS.despy0 = d3.mouse(this)[1]-(d3.mouse(this)[1]-THIS.despy)*THIS.zoomval/THIS.oldzoomval-THIS.despyp;
	            
	            THIS.transxz = THIS.trans[0]-THIS.despxp;
	            THIS.transyz = THIS.trans[1]-THIS.despyp;
	            
	            THIS.oldscale = THIS.scale;
	            var transtime = THIS.zoomduration;
				
				THIS.despx = THIS.despx0 + THIS.despxp;
				THIS.despy = THIS.despy0 + THIS.despyp;
	            
				PRES.setViewport(THIS.despx, THIS.despy, THIS.zoomval, transtime);
			}
		};
			
	      
	
	
	    this.zoomin = function() {
		
			THIS.oldzoomval = THIS.zoomval;
			
	        if (THIS.zoomval*1.5 < THIS.zoommax){THIS.zoomval *=  THIS.zoomincrement;};
		
	        THIS.despx0 = THIS.midx-(THIS.midx-THIS.despx)*THIS.zoomval/THIS.oldzoomval-THIS.despxp;
	        THIS.despy0 = THIS.midy-(THIS.midy-THIS.despy)*THIS.zoomval/THIS.oldzoomval-THIS.despyp;
		
	        THIS.despx = THIS.despx0 + THIS.despxp;
	        THIS.despy = THIS.despy0 + THIS.despyp;
		
	        PRES.setViewport(THIS.despx, THIS.despy, THIS.zoomval, THIS.zoomduration);
	    };
		
	
	    this.zoomout = function() {
		
			THIS.oldzoomval = THIS.zoomval;
			
	        if (THIS.zoomval/1.5 > THIS.zoommin){THIS.zoomval /=  THIS.zoomincrement;};
		
	        THIS.despx0 = THIS.midx-(THIS.midx-THIS.despx)*THIS.zoomval/THIS.oldzoomval-THIS.despxp;
	        THIS.despy0 = THIS.midy-(THIS.midy-THIS.despy)*THIS.zoomval/THIS.oldzoomval-THIS.despyp;
		
	        THIS.despx = THIS.despx0 + THIS.despxp;
	        THIS.despy = THIS.despy0 + THIS.despyp;
		
	        PRES.setViewport(THIS.despx, THIS.despy, THIS.zoomval, THIS.zoomduration);
	   };
	}
	return Scaler;
});