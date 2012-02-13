/**
 * initialize page of the calendar
 * CalendarPage
 */
$(document).ready(function(){
	/**
	 * create background in canvas
	 * @method _createNoise
	 * @private
	 * @param {object} Parameters
	 * @return {object} Canvas
	 */
	var _createNoise = function(oParams){
		if (!document.createElement("canvas").getContext) {
			return;
		}
		var r, g, b;
		var opacity  = oParams && oParams.opacity ? oParams.opacity : 0.15;
		var strength = oParams && oParams.strength ? oParams.strength : 80;
		var canvas   = document.createElement("canvas");
		var context  = canvas.getContext("2d");
		
		canvas.width  = 100;
		canvas.height = 100;
		
		for ( var x=0; x<canvas.width; x++) {
			for (var y=0; y<canvas.height; y++) {
				r = Math.floor( Math.random() * strength );
				g = Math.floor( Math.random() * strength );
				b = Math.floor( Math.random() * strength );
				
				context.fillStyle = "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
				context.fillRect(x, y, 1, 1);
			}
		}
		return canvas;
	};

	// initialize look & feel
	var oCanvas       = _createNoise({"opacity":0.05, "strength":255});
	$("body").css("background-image", "url(" + oCanvas.toDataURL("image/png") + ")");
	setTimeout(scrollTo(0,1), 500); // scroll to hide address bar
});