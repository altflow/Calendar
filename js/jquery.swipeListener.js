/**
 * jquery.swipeListener.js
 * jQuery plugin to detect swipe event and 
 * invoke the assigned callback function
 *
 */
(function($){
	
	$.fn.swipeListener = function(option){
		var config = {
			duration: 1000, // within this period
			minX: 20, // swipe L/R if touch position moved more than this horizontally
			minY: 20, // swipe U/D if touch position moved more than this vertically
			swipeUp: undefined,   // callback function invoked when swipe up
			swipeDown: undefined, // or swipe down,
			swipeLeft: undefined, // or swipe left,
			swipeRight: undefined // or swipe right
		};
		
		if (option) {
			$.extend(config, option);
		}
		
		this.each(function(){
			var start = undefined;
			var stop  = undefined;
			var $this = $(this);
			var isTouchDevice   = typeof this.ontouchstart !== "undefined";
			var touchStartEvent = isTouchDevice ? "touchstart" : "mousedown";
			var touchMoveEvent  = isTouchDevice ? "touchmove" : "mousemove";
			var touchEndEvent   = isTouchDevice ? "touchend" : "mouseup";
			
			$this.bind(touchStartEvent, touchStart);
			
			function touchStart(event){
				var e = isTouchDevice ? event.originalEvent.touches[0] : event;
				start = {
					x: e.pageX,
					y: e.pageY,
					time: (new Date()).getTime()
				};
				event.stopPropagation();
				
				$this.bind(touchMoveEvent, touchMove).one(touchEndEvent, touchEnd);
			};
			
			function touchMove(event){
				if (!start) {
					return;
				}
				
				event.preventDefault();
				
				var e = isTouchDevice ? event.originalEvent.touches[0] : event;
				stop = {
					x: e.pageX,
					y: e.pageY,
					time: (new Date()).getTime()
				};
			};
			
			function touchEnd(event){
				$this.unbind("touchmove mousemove", touchMove);
				
				if (start && stop && stop.time-start.time < config.duration) {
					diffX = start.x - stop.x;
					diffY = start.y - stop.y;

					if (Math.abs(diffX) > config.minX) {
						
						if (diffX > 0 && config.swipeLeft) {
							config.swipeLeft();
						} else if (config.swipeRight) {
							config.swipeRight();
						}
						
					} else if (Math.abs(diffY) > config.minY) {
						
						if (diffY > 0 && config.swipeUp) {
							config.swipeUp();
						} else if (config.swipeDown) {
							config.swipeDown();
						}
					}
				}
				
				start = stop = undefined;
			};
		});
		
		return this;
	};
		
})(jQuery);