webpackJsonp([11],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Potion = __webpack_require__(1);
	
	var app = Potion.init(document.querySelector(".game"), {
	  init: function init() {
	    this.size = 10;
	  },
	
	  update: function update(time) {
	    this.size += 100 * time;
	  },
	
	  render: function render() {
	    app.video.ctx.fillStyle = "#bada55";
	    app.video.ctx.fillRect(10, 10, this.size, this.size);
	  }
	});

/***/ }
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9leGFtcGxlcy8wMS1nYW1lbG9vcC9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsS0FBSSxNQUFNLEdBQUcsbUJBQU8sQ0FBQyxDQUFRLENBQUMsQ0FBQzs7QUFFL0IsS0FBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3JELE9BQUksRUFBRSxnQkFBVztBQUNmLFNBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ2hCOztBQUVELFNBQU0sRUFBRSxnQkFBUyxJQUFJLEVBQUU7QUFDckIsU0FBSSxDQUFDLElBQUksSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDO0lBQ3pCOztBQUVELFNBQU0sRUFBRSxrQkFBVztBQUNqQixRQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQ3BDLFFBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3REO0VBQ0YsQ0FBQyxDIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFBvdGlvbiA9IHJlcXVpcmUoJ3BvdGlvbicpO1xuXG52YXIgYXBwID0gUG90aW9uLmluaXQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUnKSwge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNpemUgPSAxMDtcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB0aGlzLnNpemUgKz0gMTAwICogdGltZTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIGFwcC52aWRlby5jdHguZmlsbFN0eWxlID0gJyNiYWRhNTUnO1xuICAgIGFwcC52aWRlby5jdHguZmlsbFJlY3QoMTAsIDEwLCB0aGlzLnNpemUsIHRoaXMuc2l6ZSk7XG4gIH1cbn0pO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9leGFtcGxlcy8wMS1nYW1lbG9vcC9hcHAuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiIsImZpbGUiOiIwMS1nYW1lbG9vcC5qcyJ9