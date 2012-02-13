/**
 * calendarmenu.js
 * handle action menu of calendar
 */

/**
 * calendar menu
 * @class CalendarMenu
 * @requires jQuery
 */
var CalendarMenu = function(){
	var oMenuButtonEl = $("#menu");
	var oMenuItemsEl  = $("#menuitems");
	var bEdit         = false;
	var sColorCNs     = "red yellow green"; // class names of date bg color.
											 // using this string to remove class name
											 // when toggle menu
	
	/**
	 * show/hide menu items
	 * @method _toggleMenu
	 * @private
	 * @return {void}
	 */
	var _toggleMenu = function(){
		oMenuItemsEl.children().first().one("webkitAnimationEnd", _animEnd);
		oMenuButtonEl.toggleClass("opened");
		oMenuItemsEl.toggleClass("appeared disappeared anim");
	};
	
	/**
	 * reset classes when animation end
	 * @method _animEnd
	 * @private
	 * @return {void}
	 */
	var _animEnd = function(){
		oMenuItemsEl.toggleClass("anim");
	};
	
	/**
	 * change edit mode with the selected color
	 * @method _changeEditMode
	 * @private
	 * @param {object} Event
	 * @return {void}
	 */
	var _changeEditMode = function(oEvent){
		var sColor   = oEvent.target.id;
		
		oMenuButtonEl.removeClass(sColorCNs);
		
		if (sColor === "exit") {
			bEdit  = false;
			sColor = null;
		} else {
			bEdit  = true;
			oMenuButtonEl.addClass(sColor);
		}
		
		Calendar.changeMode(bEdit, sColor);
		_toggleMenu();
	};
	
	/**
	 * initializing
	 * @method _init
	 * @private
	 * @return {void}
	 */
	var _init = function(){
		oMenuButtonEl.bind("click", _toggleMenu);
		oMenuItemsEl.bind("click", _changeEditMode);
	};
	
	$(document).ready(_init);
}();