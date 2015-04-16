webpackJsonp([8],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Potion = __webpack_require__(1);
	
	var app = Potion.init(document.querySelector(".game"), {
	  configure: function configure() {
	    this.setSize(document.body.clientWidth, document.body.clientHeight);
	    this.config.allowHiDPI = true;
	  },
	
	  init: function init() {
	    this.particles = [];
	    this.lastPosition = { x: null, y: null };
	
	    window.addEventListener("resize", (function () {
	      this.setSize(document.body.clientWidth, document.body.clientHeight);
	    }).bind(this));
	  },
	
	  mousemove: function mousemove(value) {
	    if (this.lastPosition.x && this.lastPosition.y) {
	      var dx = (value.x - this.lastPosition.x) * 20;
	      var dy = (value.y - this.lastPosition.y) * 20;
	      this.particles.push(new Particle(value.x, value.y, dx, dy));
	    }
	
	    this.lastPosition.x = this.input.mouse.x;
	    this.lastPosition.y = this.input.mouse.y;
	  },
	
	  update: function update(time) {
	    for (var i = 0, len = this.particles.length; i < len; i++) {
	      var particle = this.particles[i];
	      if (particle) {
	        particle.update(time);
	      }
	    }
	  },
	
	  render: function render() {
	    for (var i = 0, len = this.particles.length; i < len; i++) {
	      var particle = this.particles[i];
	      if (particle) {
	        particle.render();
	      }
	    }
	  }
	});
	
	var Particle = function Particle(x, y, dx, dy) {
	  this.x = x;
	  this.y = y;
	  this.r = Math.random() * 20 + 5;
	  this.dx = dx;
	  this.dy = dy;
	
	  var colors = ["#04819e", "#38b2ce", "#60b9ce", "#015367", "#ff9900"];
	  this.color = colors[Math.floor(colors.length * Math.random())];
	};
	
	Particle.prototype.update = function (time) {
	  this.dx = this.dx + (0 - this.dx) * time;
	  this.dy = this.dy + (0 - this.dy) * time;
	
	  this.r = this.r + (0 - this.r) * time;
	
	  if (this.r <= 0.5) {
	    app.particles.splice(app.particles.indexOf(this), 1);
	  }
	
	  this.x += this.dx * time;
	  this.y += this.dy * time;
	};
	
	Particle.prototype.render = function () {
	  app.video.ctx.beginPath();
	  app.video.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
	  app.video.ctx.strokeStyle = this.color;
	  app.video.ctx.stroke();
	  app.video.ctx.closePath();
	};

/***/ }
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9leGFtcGxlcy9kZW1vLXBhcnRpY2xlcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsS0FBSSxNQUFNLEdBQUcsbUJBQU8sQ0FBQyxDQUFRLENBQUMsQ0FBQzs7QUFFL0IsS0FBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3JELFlBQVMsRUFBRSxxQkFBVztBQUNwQixTQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDcEUsU0FBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQy9COztBQUVELE9BQUksRUFBRSxnQkFBVztBQUNmLFNBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFNBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7QUFFekMsV0FBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxhQUFXO0FBQzNDLFdBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztNQUNyRSxFQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2Y7O0FBRUQsWUFBUyxFQUFFLG1CQUFTLEtBQUssRUFBRTtBQUN6QixTQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFO0FBQzlDLFdBQUksRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDOUMsV0FBSSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM5QyxXQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7TUFDN0Q7O0FBRUQsU0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLFNBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMxQzs7QUFFRCxTQUFNLEVBQUUsZ0JBQVMsSUFBSSxFQUFFO0FBQ3JCLFVBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ25ELFdBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakMsV0FBSSxRQUFRLEVBQUU7QUFBRSxpQkFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUFFO01BQ3pDO0lBQ0Y7O0FBRUQsU0FBTSxFQUFFLGtCQUFXO0FBQ2pCLFVBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ25ELFdBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakMsV0FBSSxRQUFRLEVBQUU7QUFBRSxpQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQUU7TUFDckM7SUFDRjtFQUNGLENBQUMsQ0FBQzs7QUFFSCxLQUFJLFFBQVEsR0FBRyxrQkFBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDcEMsT0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDWCxPQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNYLE9BQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDaEMsT0FBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDYixPQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQzs7QUFFYixPQUFJLE1BQU0sR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyRSxPQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztFQUNoRSxDQUFDOztBQUVGLFNBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFVBQVMsSUFBSSxFQUFFO0FBQ3pDLE9BQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQztBQUN6QyxPQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUM7O0FBRXpDLE9BQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQzs7QUFFdEMsT0FBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRTtBQUNqQixRQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN0RDs7QUFFRCxPQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLE9BQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7RUFDMUIsQ0FBQzs7QUFFRixTQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxZQUFXO0FBQ3JDLE1BQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQzFCLE1BQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDL0QsTUFBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDdkMsTUFBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDdkIsTUFBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7RUFDM0IsQyIsInNvdXJjZXNDb250ZW50IjpbInZhciBQb3Rpb24gPSByZXF1aXJlKCdwb3Rpb24nKTtcblxudmFyIGFwcCA9IFBvdGlvbi5pbml0KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lJyksIHtcbiAgY29uZmlndXJlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFNpemUoZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCwgZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQpO1xuICAgIHRoaXMuY29uZmlnLmFsbG93SGlEUEkgPSB0cnVlO1xuICB9LFxuXG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucGFydGljbGVzID0gW107XG4gICAgdGhpcy5sYXN0UG9zaXRpb24gPSB7IHg6IG51bGwsIHk6IG51bGwgfTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuc2V0U2l6ZShkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoLCBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcblxuICBtb3VzZW1vdmU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMubGFzdFBvc2l0aW9uLnggJiYgdGhpcy5sYXN0UG9zaXRpb24ueSkge1xuICAgICAgdmFyIGR4ID0gKHZhbHVlLnggLSB0aGlzLmxhc3RQb3NpdGlvbi54KSAqIDIwO1xuICAgICAgdmFyIGR5ID0gKHZhbHVlLnkgLSB0aGlzLmxhc3RQb3NpdGlvbi55KSAqIDIwO1xuICAgICAgdGhpcy5wYXJ0aWNsZXMucHVzaChuZXcgUGFydGljbGUodmFsdWUueCwgdmFsdWUueSwgZHgsIGR5KSk7XG4gICAgfVxuXG4gICAgdGhpcy5sYXN0UG9zaXRpb24ueCA9IHRoaXMuaW5wdXQubW91c2UueDtcbiAgICB0aGlzLmxhc3RQb3NpdGlvbi55ID0gdGhpcy5pbnB1dC5tb3VzZS55O1xuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24odGltZSkge1xuICAgIGZvciAodmFyIGk9MCwgbGVuPXRoaXMucGFydGljbGVzLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgICAgdmFyIHBhcnRpY2xlID0gdGhpcy5wYXJ0aWNsZXNbaV07XG4gICAgICBpZiAocGFydGljbGUpIHsgcGFydGljbGUudXBkYXRlKHRpbWUpOyB9XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy5wYXJ0aWNsZXMubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgICB2YXIgcGFydGljbGUgPSB0aGlzLnBhcnRpY2xlc1tpXTtcbiAgICAgIGlmIChwYXJ0aWNsZSkgeyBwYXJ0aWNsZS5yZW5kZXIoKTsgfVxuICAgIH1cbiAgfVxufSk7XG5cbnZhciBQYXJ0aWNsZSA9IGZ1bmN0aW9uKHgsIHksIGR4LCBkeSkge1xuICB0aGlzLnggPSB4O1xuICB0aGlzLnkgPSB5O1xuICB0aGlzLnIgPSBNYXRoLnJhbmRvbSgpICogMjAgKyA1O1xuICB0aGlzLmR4ID0gZHg7XG4gIHRoaXMuZHkgPSBkeTtcblxuICB2YXIgY29sb3JzID0gWycjMDQ4MTllJywgJyMzOGIyY2UnLCAnIzYwYjljZScsICcjMDE1MzY3JywgJyNmZjk5MDAnXTtcbiAgdGhpcy5jb2xvciA9IGNvbG9yc1tNYXRoLmZsb29yKGNvbG9ycy5sZW5ndGggKiBNYXRoLnJhbmRvbSgpKV07XG59O1xuXG5QYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICB0aGlzLmR4ID0gdGhpcy5keCArICgwIC0gdGhpcy5keCkgKiB0aW1lO1xuICB0aGlzLmR5ID0gdGhpcy5keSArICgwIC0gdGhpcy5keSkgKiB0aW1lO1xuXG4gIHRoaXMuciA9IHRoaXMuciArICgwIC0gdGhpcy5yKSAqIHRpbWU7XG5cbiAgaWYgKHRoaXMuciA8PSAwLjUpIHtcbiAgICBhcHAucGFydGljbGVzLnNwbGljZShhcHAucGFydGljbGVzLmluZGV4T2YodGhpcyksIDEpO1xuICB9XG5cbiAgdGhpcy54ICs9IHRoaXMuZHggKiB0aW1lO1xuICB0aGlzLnkgKz0gdGhpcy5keSAqIHRpbWU7XG59O1xuXG5QYXJ0aWNsZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gIGFwcC52aWRlby5jdHguYmVnaW5QYXRoKCk7XG4gIGFwcC52aWRlby5jdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLnIsIDAsIE1hdGguUEkqMiwgZmFsc2UpO1xuICBhcHAudmlkZW8uY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5jb2xvcjtcbiAgYXBwLnZpZGVvLmN0eC5zdHJva2UoKTtcbiAgYXBwLnZpZGVvLmN0eC5jbG9zZVBhdGgoKTtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2V4YW1wbGVzL2RlbW8tcGFydGljbGVzL2FwcC5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIiwiZmlsZSI6ImRlbW8tcGFydGljbGVzLmpzIn0=