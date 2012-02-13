/**
 * calendar.js
 * simple calendar
 */

/**
 * calendar view
 * @class Calendar
 * @requires jQuery
 */
var Calendar = function(){
	var oTargetEl      = $("#container");
	var oYearEl        = $("#year");
	var aEndDates      = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	var aMonths        = ["January", "February", "March", "April", "May", "June",
					      "July", "August", "Septembar", "October", "November", "December"];
	var aDays          = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
	var sAnimNextCN    = "movenext";
	var sAnimPrevCN    = "moveprev";
	var bIsTouchDevice = typeof this.ontouchstart !== "undefined";
	var sColorCNs      = "red yellow green"; // class names of date bg color.
											 // using this string to remove class name
											 // when click date
	var nCurrentYear   = null;
	var nCurrentMonth  = null;
	
	
	/**
	 * returns calendar table for the month
	 * @method _createCalendarTable
	 * @private
	 * @param {number} Year
	 * @param {number} Month
	 * @return {object} TableElement
	 */
	var _createCalendarTable = function(nYear, nMonth){
		var aHolidays  = CalendarData.getHolidays(nYear, nMonth+1);
		var aMarkDates = CalendarData.getMarkDates(nYear, nMonth+1);
		var oTableEl   = $("<table id=y" + nYear + "m" + nMonth + "/>");
		var aDates     = [];
		
		aEndDates[1] = new Date(nYear, 2, 0).getDate(); // set end date of Feb for the year
		nFirstDay    = new Date(nYear, nMonth, 1).getDay();
		nEndDay      = new Date(nYear, nMonth, aEndDates[nMonth]).getDay();
		
		for (var i=0; i<nFirstDay; i++) {
			aDates.unshift("");
		}
		for (var i=1; i<=aEndDates[nMonth]; i++) {
			aDates.push(i);
		}
		for (var i=nEndDay; i<6; i++) {
			aDates.push("");
		}
		
		// create table elements
		// Month (Caption)
		oTableEl.append("<caption>" + aMonths[nMonth] + "</caption>");
		
		// Day (Header)
		var oTr = $("<tr/>");
		for (var i=0; i<7; i++) {
			oTr.append("<th>"+aDays[i]+"</th>");
		}
		oTableEl.append(oTr);
		
		// Date (Body)
		oTr = $("<tr/>");
		for (var i=0, l=aDates.length; i<l; i++) {
			var oTd = $("<td class='d" + i%7 + "'>" + aDates[i] + "</td>");
			if (aHolidays[aDates[i]]) {
				oTd.addClass("holiday");
			}
			if (aMarkDates[aDates[i]]) {
				oTd.addClass(aMarkDates[aDates[i]]);
			}
			oTr.append(oTd);
			if ( (i+1)%7 == 0 ) {
				oTableEl.append(oTr);
				oTr = $("<tr/>");
			}
		}
		
		return oTableEl;
	};
	
	/**
	 * create calendar in #container
	 * @method _createCalendar
	 * @private
	 * @param {number} Year
	 * @param {number} Month
	 * @param {string} Direction
	 * @return {void}
	 */
	var _createCalendar = function(nYear, nMonth, sDirection){
		var nPrevCalYear  = nMonth == 0 ? nYear-1 : nYear;
		var nPrevCalMonth = nMonth == 0 ? 11 : nMonth-1;
		var nNextCalYear  = nMonth == 11 ? nYear+1 : nYear;
		var nNextCalMonth = nMonth == 11 ? 0 : nMonth+1;
		var oCalendar     = _createCalendarTable(nYear, nMonth);

		nCurrentYear  = nYear;
		nCurrentMonth = nMonth+1;
		
		oYearEl.text(nYear);
		if (sDirection && sDirection == sAnimPrevCN) {
			oTargetEl.addClass("prepend");
			oTargetEl.prepend(oCalendar);
		} else {
			oTargetEl.append(oCalendar);
		}
		
		oCalendar.swipeListener({
			minX: 60,
			swipeLeft: function(){
				_createCalendar(nNextCalYear, nNextCalMonth, sAnimNextCN);
				oTargetEl.addClass(sAnimNextCN);
			},
			swipeRight: function(){
				_createCalendar(nPrevCalYear, nPrevCalMonth, sAnimPrevCN);
				oTargetEl.addClass(sAnimPrevCN);
			}
		});
	};
	
	/**
	 * post process for transition end
	 * @method _transitionEnd
	 * @private
	 * @returns {void}
	 */
	var _transitionEnd = function(){
		if (oTargetEl.hasClass(sAnimNextCN)) {
			oTargetEl.children().first().remove();
			oTargetEl.removeClass(sAnimNextCN);
			
		} else if (oTargetEl.hasClass(sAnimPrevCN)) {
			oTargetEl.children().last().remove();
			oTargetEl.removeClass(sAnimPrevCN + " prepend");
		}
	};
	
	/**
	 * mark a clicked date with the given color and
	 * request to save the date marker
	 * @method _markDate
	 * @private
	 * @param {object} Event
	 * @return {void}
	 */
	var _markDate = function(oEvent){
		var sColor     = oEvent.data.color;
		var oClickedEl = $(oEvent.target);
		
		if (oClickedEl[0].nodeName.toLowerCase() === "td") {
			if ( oClickedEl.hasClass(sColor) ) {
				oClickedEl.toggleClass(sColor);
				sColor = null;
			} else {
				oClickedEl.removeClass(sColorCNs);
				oClickedEl.addClass(sColor);
			}
			
			var nDate = parseInt(oClickedEl.text(), 10);
			CalendarData.recordMarkDate(nCurrentYear, nCurrentMonth, nDate, sColor);
		}
	};
	
	/**
	 * initialize
	 * @method _init
	 * @private
	 * @return {void}
	 */
	var _init = function(){
		var oDate         = new Date();
		var nCurrentYear  = oDate.getFullYear();
		var nCurrentMonth = oDate.getMonth();
		
		$(applicationCache).bind("updateready", function(oEvent){
			applicationCache.swapCache();
		})
		
		oTargetEl.empty();
		oTargetEl.bind("webkitTransitionEnd", _transitionEnd);
		oYearEl.bind("click", _init);
		_createCalendar(nCurrentYear, nCurrentMonth);
	};
	
	$(document).ready(_init);
	
	return {
		/**
		 * assign event listener to mark day(s)
		 * @method changeMode
		 * @public
		 * @param {boolean} Edit
		 * @param {strong} Color (required if bEdit = true)
		 * @return {void}
		 */
		changeMode: function(bEdit, sColor){
			oTargetEl.unbind("click");
			
			if (bEdit && sColor) {
				oTargetEl.bind("click", {color: sColor}, _markDate);
			}
		}
	}
}();