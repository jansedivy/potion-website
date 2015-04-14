webpackJsonp([3],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Potion = __webpack_require__(1);
	
	var app = Potion.init(document.querySelector(".game"), {
	  render: function render() {
	    app.video.ctx.fillStyle = "black";
	    app.video.ctx.font = "20px sans-serif";
	    app.video.ctx.textAlign = "left";
	    app.video.ctx.textBaseline = "top";
	
	    if (app.input.mouse.isDown) {
	      app.video.ctx.fillText("Any button is down", 10, 10);
	    }
	
	    if (app.input.mouse.isLeftDown) {
	      app.video.ctx.fillText("Left button is down", 10, 30);
	    }
	
	    if (app.input.mouse.isMiddleDown) {
	      app.video.ctx.fillText("Middle button is down", 10, 50);
	    }
	
	    if (app.input.mouse.isRightDown) {
	      app.video.ctx.fillText("Right button is down", 10, 70);
	    }
	
	    app.video.ctx.fillStyle = "#68B4FF";
	    app.video.ctx.fillRect(app.input.mouse.x - 15, app.input.mouse.y - 15, 30, 30);
	  }
	});

/***/ }
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9leGFtcGxlcy8wNC1tb3VzZS9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsS0FBSSxNQUFNLEdBQUcsbUJBQU8sQ0FBQyxDQUFRLENBQUMsQ0FBQzs7QUFFL0IsS0FBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3JELFNBQU0sRUFBRSxrQkFBVztBQUNqQixRQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0FBQ2xDLFFBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQztBQUN2QyxRQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO0FBQ2pDLFFBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7O0FBRW5DLFNBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQzFCLFVBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7TUFDdEQ7O0FBRUQsU0FBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUU7QUFDOUIsVUFBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLHFCQUFxQixFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztNQUN2RDs7QUFFRCxTQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRTtBQUNoQyxVQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsdUJBQXVCLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO01BQ3pEOztBQUVELFNBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFO0FBQy9CLFVBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7TUFDeEQ7O0FBRUQsUUFBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUNwQyxRQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNoRjtFQUNGLENBQUMsQyIsInNvdXJjZXNDb250ZW50IjpbInZhciBQb3Rpb24gPSByZXF1aXJlKCdwb3Rpb24nKTtcblxudmFyIGFwcCA9IFBvdGlvbi5pbml0KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lJyksIHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICBhcHAudmlkZW8uY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgYXBwLnZpZGVvLmN0eC5mb250ID0gJzIwcHggc2Fucy1zZXJpZic7XG4gICAgYXBwLnZpZGVvLmN0eC50ZXh0QWxpZ24gPSAnbGVmdCc7XG4gICAgYXBwLnZpZGVvLmN0eC50ZXh0QmFzZWxpbmUgPSAndG9wJztcblxuICAgIGlmIChhcHAuaW5wdXQubW91c2UuaXNEb3duKSB7XG4gICAgICBhcHAudmlkZW8uY3R4LmZpbGxUZXh0KCdBbnkgYnV0dG9uIGlzIGRvd24nLCAxMCwgMTApO1xuICAgIH1cblxuICAgIGlmIChhcHAuaW5wdXQubW91c2UuaXNMZWZ0RG93bikge1xuICAgICAgYXBwLnZpZGVvLmN0eC5maWxsVGV4dCgnTGVmdCBidXR0b24gaXMgZG93bicsIDEwLCAzMCk7XG4gICAgfVxuXG4gICAgaWYgKGFwcC5pbnB1dC5tb3VzZS5pc01pZGRsZURvd24pIHtcbiAgICAgIGFwcC52aWRlby5jdHguZmlsbFRleHQoJ01pZGRsZSBidXR0b24gaXMgZG93bicsIDEwLCA1MCk7XG4gICAgfVxuXG4gICAgaWYgKGFwcC5pbnB1dC5tb3VzZS5pc1JpZ2h0RG93bikge1xuICAgICAgYXBwLnZpZGVvLmN0eC5maWxsVGV4dCgnUmlnaHQgYnV0dG9uIGlzIGRvd24nLCAxMCwgNzApO1xuICAgIH1cblxuICAgIGFwcC52aWRlby5jdHguZmlsbFN0eWxlID0gJyM2OEI0RkYnO1xuICAgIGFwcC52aWRlby5jdHguZmlsbFJlY3QoYXBwLmlucHV0Lm1vdXNlLnggLSAxNSwgYXBwLmlucHV0Lm1vdXNlLnkgLSAxNSwgMzAsIDMwKTtcbiAgfVxufSk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2V4YW1wbGVzLzA0LW1vdXNlL2FwcC5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIiwiZmlsZSI6IjA0LW1vdXNlLmpzIn0=