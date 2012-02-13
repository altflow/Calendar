/**
 * handle data of calendar
 */

/**
 * Calendar data
 * @class CalendarData
 */
var CalendarData = function(){
	var sApiKey    = "PUT_YOUR_API_KEY_HERE";
	//var sCalId    = "ja.japanese%23holiday@group.v.calendar.google.com";
	var sCalId     = "outid3el0qkcrsuf89fltf7a4qbacgt9@import.calendar.google.com";
	var sGCalUrl   = "https://www.googleapis.com/calendar/v3/calendars/"
				   + sCalId
				   + "/events?orderBy=startTime&singleEvents=true&maxResults=1000"
				   + "&key=" + sApiKey;
				   // &timeMin=2011-01-01T00%3A00%3A00Z&timeMax=2012-01-01T00%3A00%3A00Z;
	/*
	 Example data
	 oHolidays = {
		"2011-1":[true, null, null, ....],
		"2011-2":[null, null, null, ... true, null,...]
	 }
	 oMarkDates = {
		"2011-1":["red", null, null, "yellow"],
		"2011-2":[null, null, "green"]
	 }
	*/
	var oHolidays  = {};
	var oMarkDates = {}; // date(s) that are marked by a user
	
	if (localStorage) {
		var oHData = $.parseJSON(localStorage.getItem("holidays"));
		var oMData = $.parseJSON(localStorage.getItem("markdates"));
		oHolidays  = oHData ? oHData : oHolidays;
		oMarkDates = oMData ? oMData : oMarkDates;
	}
	
	$(document).ready(function(){
		var oDate  = new Date();
		var nYear  = oDate.getFullYear();
		var nMonth = oDate.getMonth() + 1;
		var sMonth = nMonth < 10 ? "0"+nMonth : ""+nMonth;
		
		if (oHolidays && $.isArray(oHolidays[(nYear+1) + "-" + nMonth])) {
			return;
		}
		
		var sUrl   = sGCalUrl
				   + "&timeMin=" + (nYear-1) + "-" + sMonth + "-01T00%3A00%3A00Z"
				   + "&timeMax=" + (nYear+2) + "-" + sMonth + "-01T00%3A00%3A00Z"
				   + "&callback=?";

		$.getJSON(sUrl, CalendarData.recordHolidays);
	});
	
	return {
		/**
		 * returns holiday data for specified month
		 * @method getHolidays
		 * @public
		 * @param {number} Year
		 * @param {number} Month
		 * @return {array} Holidays
		 */
		getHolidays: function(nYear, nMonth){
			var aHolidays = oHolidays[nYear+"-"+nMonth];
			return aHolidays ? aHolidays : [];
		},
		/**
		 * returns marked date for specified month
		 * @method getMarkDates
		 * @public
		 * @param {number} Year
		 * @param {number} Month
		 * @return {array} MarkDates
		 */
		getMarkDates: function(nYear, nMonth){
			var aMarkDates = oMarkDates[nYear+"-"+nMonth];
			return aMarkDates ? aMarkDates : [];
		},
		/**
		 * record holiday data that is returned from google calenda API
		 * to localStorage
		 * @method recordHolidays
		 * @public
		 * @param {object} Json
		 * @return {void}
		 */
		recordHolidays: function(oJson){
			if (!oJson || !$.isArray(oJson.items)) {
				return;
			}
			$.each(oJson.items, function(i, oData){
				var sDate  = oData.start.date;
				var aYMD   = sDate.split("-");
				var sYearMonth  = aYMD[0] + "-" + parseInt(aYMD[1], 10);
				var nDate       = parseInt(aYMD[2], 10);
				
				if (!oHolidays[sYearMonth]) {
					oHolidays[sYearMonth] = [];
				}
				oHolidays[sYearMonth][nDate] = true;
			});
			
			if (localStorage) {
				localStorage.setItem("holidays", JSON.stringify(oHolidays));
			}
		},
		/**
		 * record a marked date to localStorage
		 * @method recordMarkDate
		 * @public
		 * @param {number} Year
		 * @param {number} Month
		 * @param {number} Date
		 * @param {string} Color
		 * @return {void}
		 */
		recordMarkDate: function(nYear, nMonth, nDate, sColor){
			var sYearMonth = nYear + "-" + nMonth;
			if (!oMarkDates[sYearMonth]) {
				oMarkDates[sYearMonth] = [];
			}
			oMarkDates[sYearMonth][nDate] = sColor;
			
			if (localStorage) {
				localStorage.setItem("markdates", JSON.stringify(oMarkDates));
			}
		}
	};
}();