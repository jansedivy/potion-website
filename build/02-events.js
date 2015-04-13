webpackJsonp([3],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Potion = __webpack_require__(1);
	
	Potion.init(document.querySelector(".game"), {
	  /**
	   * keyboard events
	   */
	  keydown: function keydown(value) {
	    this.log("keydown key: " + value.key + " name: " + value.name);
	  },
	
	  keyup: function keyup(value) {
	    this.log("keyup key: " + value.key + " name: " + value.name);
	  },
	
	  /**
	   * Mouse events
	   */
	  mousedown: function mousedown(value) {
	    this.log("mousedown x: " + value.x + ", y: " + value.y + ", button: " + value.button);
	  },
	
	  mouseup: function mouseup(value) {
	    this.log("mouseup x: " + value.x + ", y: " + value.y + ", button: " + value.button);
	  },
	
	  mousemove: function mousemove(value) {
	    this.log("mousemove x: " + value.x + ", y: " + value.y);
	  },
	
	  // helper function (not defined in potion)
	  log: function log(message) {
	    var li = document.createElement("li");
	    li.textContent = message;
	    var debug = document.querySelector(".debug");
	    debug.insertBefore(li, debug.firstChild);
	  }
	});

/***/ }
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9leGFtcGxlcy8wMi1ldmVudHMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLEtBQUksTUFBTSxHQUFHLG1CQUFPLENBQUMsQ0FBUSxDQUFDLENBQUM7O0FBRS9CLE9BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRTs7OztBQUkzQyxVQUFPLEVBQUUsaUJBQVMsS0FBSyxFQUFFO0FBQ3ZCLFNBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoRTs7QUFFRCxRQUFLLEVBQUUsZUFBUyxLQUFLLEVBQUU7QUFDckIsU0FBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlEOzs7OztBQUtELFlBQVMsRUFBRSxtQkFBUyxLQUFLLEVBQUU7QUFDekIsU0FBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxZQUFZLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZGOztBQUVELFVBQU8sRUFBRSxpQkFBUyxLQUFLLEVBQUU7QUFDdkIsU0FBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxZQUFZLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JGOztBQUVELFlBQVMsRUFBRSxtQkFBUyxLQUFLLEVBQUU7QUFDekIsU0FBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pEOzs7QUFHRCxNQUFHLEVBQUUsYUFBUyxPQUFPLEVBQUU7QUFDckIsU0FBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QyxPQUFFLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztBQUN6QixTQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdDLFVBQUssQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMxQztFQUNGLENBQUMsQyIsInNvdXJjZXNDb250ZW50IjpbInZhciBQb3Rpb24gPSByZXF1aXJlKCdwb3Rpb24nKTtcblxuUG90aW9uLmluaXQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUnKSwge1xuICAvKipcbiAgICoga2V5Ym9hcmQgZXZlbnRzXG4gICAqL1xuICBrZXlkb3duOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHRoaXMubG9nKCdrZXlkb3duIGtleTogJyArIHZhbHVlLmtleSArICcgbmFtZTogJyArIHZhbHVlLm5hbWUpO1xuICB9LFxuXG4gIGtleXVwOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHRoaXMubG9nKCdrZXl1cCBrZXk6ICcgKyB2YWx1ZS5rZXkgKyAnIG5hbWU6ICcgKyB2YWx1ZS5uYW1lKTtcbiAgfSxcblxuICAvKipcbiAgICogTW91c2UgZXZlbnRzXG4gICAqL1xuICBtb3VzZWRvd246IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy5sb2coJ21vdXNlZG93biB4OiAnICsgdmFsdWUueCArICcsIHk6ICcgKyB2YWx1ZS55ICsgJywgYnV0dG9uOiAnICsgdmFsdWUuYnV0dG9uKTtcbiAgfSxcblxuICBtb3VzZXVwOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHRoaXMubG9nKCdtb3VzZXVwIHg6ICcgKyB2YWx1ZS54ICsgJywgeTogJyArIHZhbHVlLnkgKyAnLCBidXR0b246ICcgKyB2YWx1ZS5idXR0b24pO1xuICB9LFxuXG4gIG1vdXNlbW92ZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICB0aGlzLmxvZygnbW91c2Vtb3ZlIHg6ICcgKyB2YWx1ZS54ICsgJywgeTogJyArIHZhbHVlLnkpO1xuICB9LFxuXG4gIC8vIGhlbHBlciBmdW5jdGlvbiAobm90IGRlZmluZWQgaW4gcG90aW9uKVxuICBsb2c6IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICB2YXIgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGxpLnRleHRDb250ZW50ID0gbWVzc2FnZTtcbiAgICB2YXIgZGVidWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGVidWcnKTtcbiAgICBkZWJ1Zy5pbnNlcnRCZWZvcmUobGksIGRlYnVnLmZpcnN0Q2hpbGQpO1xuICB9XG59KTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vZXhhbXBsZXMvMDItZXZlbnRzL2FwcC5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIiwiZmlsZSI6IjAyLWV2ZW50cy5qcyJ9