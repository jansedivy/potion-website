webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Potion = __webpack_require__(1);
	
	Potion.init(document.querySelector(".game"), {
	  /**
	   * keyboard events
	   */
	  keydown: function keydown(key) {
	    this.log("keydown key: " + key);
	  },
	
	  keyup: function keyup(key) {
	    this.log("keyup key: " + key);
	  },
	
	  /**
	   * Mouse events
	   */
	  mousedown: function mousedown(x, y, button) {
	    this.log("mousedown x: " + x + ", y: " + y + ", button: " + button);
	  },
	
	  mouseup: function mouseup(x, y, button) {
	    this.log("mouseup x: " + x + ", y: " + y + ", button: " + button);
	  },
	
	  mousemove: function mousemove(x, y) {
	    this.log("mousemove x: " + x + ", y: " + y);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9leGFtcGxlcy8wMi1ldmVudHMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLEtBQUksTUFBTSxHQUFHLG1CQUFPLENBQUMsQ0FBUSxDQUFDLENBQUM7O0FBRS9CLE9BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRTs7OztBQUkzQyxVQUFPLEVBQUUsaUJBQVMsR0FBRyxFQUFFO0FBQ3JCLFNBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDOztBQUVELFFBQUssRUFBRSxlQUFTLEdBQUcsRUFBRTtBQUNuQixTQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUMvQjs7Ozs7QUFLRCxZQUFTLEVBQUUsbUJBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUU7QUFDaEMsU0FBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxHQUFHLE9BQU8sR0FBRyxDQUFDLEdBQUcsWUFBWSxHQUFHLE1BQU0sQ0FBQyxDQUFDO0lBQ3JFOztBQUVELFVBQU8sRUFBRSxpQkFBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRTtBQUM5QixTQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsR0FBRyxZQUFZLEdBQUcsTUFBTSxDQUFDLENBQUM7SUFDbkU7O0FBRUQsWUFBUyxFQUFFLG1CQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDeEIsU0FBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxHQUFHLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM3Qzs7O0FBR0QsTUFBRyxFQUFFLGFBQVMsT0FBTyxFQUFFO0FBQ3JCLFNBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEMsT0FBRSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7QUFDekIsU0FBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QyxVQUFLLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUM7RUFDRixDQUFDLEMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUG90aW9uID0gcmVxdWlyZSgncG90aW9uJyk7XG5cblBvdGlvbi5pbml0KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lJyksIHtcbiAgLyoqXG4gICAqIGtleWJvYXJkIGV2ZW50c1xuICAgKi9cbiAga2V5ZG93bjogZnVuY3Rpb24oa2V5KSB7XG4gICAgdGhpcy5sb2coJ2tleWRvd24ga2V5OiAnICsga2V5KTtcbiAgfSxcblxuICBrZXl1cDogZnVuY3Rpb24oa2V5KSB7XG4gICAgdGhpcy5sb2coJ2tleXVwIGtleTogJyArIGtleSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIE1vdXNlIGV2ZW50c1xuICAgKi9cbiAgbW91c2Vkb3duOiBmdW5jdGlvbih4LCB5LCBidXR0b24pIHtcbiAgICB0aGlzLmxvZygnbW91c2Vkb3duIHg6ICcgKyB4ICsgJywgeTogJyArIHkgKyAnLCBidXR0b246ICcgKyBidXR0b24pO1xuICB9LFxuXG4gIG1vdXNldXA6IGZ1bmN0aW9uKHgsIHksIGJ1dHRvbikge1xuICAgIHRoaXMubG9nKCdtb3VzZXVwIHg6ICcgKyB4ICsgJywgeTogJyArIHkgKyAnLCBidXR0b246ICcgKyBidXR0b24pO1xuICB9LFxuXG4gIG1vdXNlbW92ZTogZnVuY3Rpb24oeCwgeSkge1xuICAgIHRoaXMubG9nKCdtb3VzZW1vdmUgeDogJyArIHggKyAnLCB5OiAnICsgeSk7XG4gIH0sXG5cbiAgLy8gaGVscGVyIGZ1bmN0aW9uIChub3QgZGVmaW5lZCBpbiBwb3Rpb24pXG4gIGxvZzogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgIHZhciBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgbGkudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuICAgIHZhciBkZWJ1ZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZWJ1ZycpO1xuICAgIGRlYnVnLmluc2VydEJlZm9yZShsaSwgZGVidWcuZmlyc3RDaGlsZCk7XG4gIH1cbn0pO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9leGFtcGxlcy8wMi1ldmVudHMvYXBwLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIiLCJmaWxlIjoiMDItZXZlbnRzLmpzIn0=