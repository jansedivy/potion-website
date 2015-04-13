webpackJsonp([1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Potion = __webpack_require__(1);
	
	var app = Potion.init(document.querySelector(".game"), {
	  init: function init() {
	    this.x = 0;
	    this.y = 0;
	    this.shift = false;
	  },
	
	  update: function update() {
	    if (app.input.isKeyDown("w")) {
	      this.y -= 10;
	    }
	    if (app.input.isKeyDown("d")) {
	      this.x += 10;
	    }
	    if (app.input.isKeyDown("s")) {
	      this.y += 10;
	    }
	    if (app.input.isKeyDown("a")) {
	      this.x -= 10;
	    }
	  },
	
	  render: function render() {
	    var color = "black";
	
	    if (app.input.isKeyDown("shift")) {
	      color = "red";
	    }
	
	    app.video.ctx.fillStyle = color;
	    app.video.ctx.fillRect(this.x, this.y, 40, 40);
	  }
	});

/***/ }
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9leGFtcGxlcy8wMy1rZXlib2FyZC9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsS0FBSSxNQUFNLEdBQUcsbUJBQU8sQ0FBQyxDQUFRLENBQUMsQ0FBQzs7QUFFL0IsS0FBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3JELE9BQUksRUFBRSxnQkFBVztBQUNmLFNBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1gsU0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDWCxTQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNwQjs7QUFFRCxTQUFNLEVBQUUsa0JBQVc7QUFDakIsU0FBSSxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUFFLFdBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO01BQUU7QUFDL0MsU0FBSSxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUFFLFdBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO01BQUU7QUFDL0MsU0FBSSxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUFFLFdBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO01BQUU7QUFDL0MsU0FBSSxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUFFLFdBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO01BQUU7SUFDaEQ7O0FBRUQsU0FBTSxFQUFFLGtCQUFXO0FBQ2pCLFNBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQzs7QUFFcEIsU0FBSSxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUFFLFlBQUssR0FBRyxLQUFLLENBQUM7TUFBRTs7QUFFcEQsUUFBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUNoQyxRQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNoRDtFQUNGLENBQUMsQyIsInNvdXJjZXNDb250ZW50IjpbInZhciBQb3Rpb24gPSByZXF1aXJlKCdwb3Rpb24nKTtcblxudmFyIGFwcCA9IFBvdGlvbi5pbml0KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lJyksIHtcbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy54ID0gMDtcbiAgICB0aGlzLnkgPSAwO1xuICAgIHRoaXMuc2hpZnQgPSBmYWxzZTtcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgIGlmIChhcHAuaW5wdXQuaXNLZXlEb3duKCd3JykpIHsgdGhpcy55IC09IDEwOyB9XG4gICAgaWYgKGFwcC5pbnB1dC5pc0tleURvd24oJ2QnKSkgeyB0aGlzLnggKz0gMTA7IH1cbiAgICBpZiAoYXBwLmlucHV0LmlzS2V5RG93bigncycpKSB7IHRoaXMueSArPSAxMDsgfVxuICAgIGlmIChhcHAuaW5wdXQuaXNLZXlEb3duKCdhJykpIHsgdGhpcy54IC09IDEwOyB9XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29sb3IgPSAnYmxhY2snO1xuXG4gICAgaWYgKGFwcC5pbnB1dC5pc0tleURvd24oJ3NoaWZ0JykpIHsgY29sb3IgPSAncmVkJzsgfVxuXG4gICAgYXBwLnZpZGVvLmN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICBhcHAudmlkZW8uY3R4LmZpbGxSZWN0KHRoaXMueCwgdGhpcy55LCA0MCwgNDApO1xuICB9XG59KTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vZXhhbXBsZXMvMDMta2V5Ym9hcmQvYXBwLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIiLCJmaWxlIjoiMDMta2V5Ym9hcmQuanMifQ==