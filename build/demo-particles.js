webpackJsonp([7],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Potion = __webpack_require__(1);
	
	var app = Potion.init(document.querySelector(".game"), {
	  configure: function configure() {
	    this.setSize(document.body.clientWidth, document.body.clientHeight);
	    this.config.allowHiDPI = false;
	  },
	
	  init: function init() {
	    this.particles = [];
	    this.lastPosition = { x: null, y: null };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9leGFtcGxlcy9kZW1vLXBhcnRpY2xlcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsS0FBSSxNQUFNLEdBQUcsbUJBQU8sQ0FBQyxDQUFRLENBQUMsQ0FBQzs7QUFFL0IsS0FBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3JELFlBQVMsRUFBRSxxQkFBVztBQUNwQixTQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDcEUsU0FBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQ2hDOztBQUVELE9BQUksRUFBRSxnQkFBVztBQUNmLFNBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFNBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUMxQzs7QUFFRCxZQUFTLEVBQUUsbUJBQVMsS0FBSyxFQUFFO0FBQ3pCLFNBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUU7QUFDOUMsV0FBSSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM5QyxXQUFJLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzlDLFdBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLEVB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QUMxQixDQUFDOztBQUVGLFNBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFlBQVc7QUFDckMsTUFBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDMUIsTUFBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMvRCxNQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUN2QyxNQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN2QixNQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztFQUMzQixDIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFBvdGlvbiA9IHJlcXVpcmUoJ3BvdGlvbicpO1xuXG52YXIgYXBwID0gUG90aW9uLmluaXQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUnKSwge1xuICBjb25maWd1cmU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0U2l6ZShkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoLCBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodCk7XG4gICAgdGhpcy5jb25maWcuYWxsb3dIaURQSSA9IGZhbHNlO1xuICB9LFxuXG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucGFydGljbGVzID0gW107XG4gICAgdGhpcy5sYXN0UG9zaXRpb24gPSB7IHg6IG51bGwsIHk6IG51bGwgfTtcbiAgfSxcblxuICBtb3VzZW1vdmU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMubGFzdFBvc2l0aW9uLnggJiYgdGhpcy5sYXN0UG9zaXRpb24ueSkge1xuICAgICAgdmFyIGR4ID0gKHZhbHVlLnggLSB0aGlzLmxhc3RQb3NpdGlvbi54KSAqIDIwO1xuICAgICAgdmFyIGR5ID0gKHZhbHVlLnkgLSB0aGlzLmxhc3RQb3NpdGlvbi55KSAqIDIwO1xuICAgICAgdGhpcy5wYXJ0aWNsZXMucHVzaChuZXcgUGFydGljbGUodmFsdWUueCwgdmFsdWUueSwgZHgsIGR5KSk7XG4gICAgfVxuXG4gICAgdGhpcy5sYXN0UG9zaXRpb24ueCA9IHRoaXMuaW5wdXQubW91c2UueDtcbiAgICB0aGlzLmxhc3RQb3NpdGlvbi55ID0gdGhpcy5pbnB1dC5tb3VzZS55O1xuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24odGltZSkge1xuICAgIGZvciAodmFyIGk9MCwgbGVuPXRoaXMucGFydGljbGVzLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgICAgdmFyIHBhcnRpY2xlID0gdGhpcy5wYXJ0aWNsZXNbaV07XG4gICAgICBpZiAocGFydGljbGUpIHsgcGFydGljbGUudXBkYXRlKHRpbWUpOyB9XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy5wYXJ0aWNsZXMubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgICB2YXIgcGFydGljbGUgPSB0aGlzLnBhcnRpY2xlc1tpXTtcbiAgICAgIGlmIChwYXJ0aWNsZSkgeyBwYXJ0aWNsZS5yZW5kZXIoKTsgfVxuICAgIH1cbiAgfVxufSk7XG5cbnZhciBQYXJ0aWNsZSA9IGZ1bmN0aW9uKHgsIHksIGR4LCBkeSkge1xuICB0aGlzLnggPSB4O1xuICB0aGlzLnkgPSB5O1xuICB0aGlzLnIgPSBNYXRoLnJhbmRvbSgpICogMjAgKyA1O1xuICB0aGlzLmR4ID0gZHg7XG4gIHRoaXMuZHkgPSBkeTtcblxuICB2YXIgY29sb3JzID0gWycjMDQ4MTllJywgJyMzOGIyY2UnLCAnIzYwYjljZScsICcjMDE1MzY3JywgJyNmZjk5MDAnXTtcbiAgdGhpcy5jb2xvciA9IGNvbG9yc1tNYXRoLmZsb29yKGNvbG9ycy5sZW5ndGggKiBNYXRoLnJhbmRvbSgpKV07XG59O1xuXG5QYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICB0aGlzLmR4ID0gdGhpcy5keCArICgwIC0gdGhpcy5keCkgKiB0aW1lO1xuICB0aGlzLmR5ID0gdGhpcy5keSArICgwIC0gdGhpcy5keSkgKiB0aW1lO1xuXG4gIHRoaXMuciA9IHRoaXMuciArICgwIC0gdGhpcy5yKSAqIHRpbWU7XG5cbiAgaWYgKHRoaXMuciA8PSAwLjUpIHtcbiAgICBhcHAucGFydGljbGVzLnNwbGljZShhcHAucGFydGljbGVzLmluZGV4T2YodGhpcyksIDEpO1xuICB9XG5cbiAgdGhpcy54ICs9IHRoaXMuZHggKiB0aW1lO1xuICB0aGlzLnkgKz0gdGhpcy5keSAqIHRpbWU7XG59O1xuXG5QYXJ0aWNsZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gIGFwcC52aWRlby5jdHguYmVnaW5QYXRoKCk7XG4gIGFwcC52aWRlby5jdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLnIsIDAsIE1hdGguUEkqMiwgZmFsc2UpO1xuICBhcHAudmlkZW8uY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5jb2xvcjtcbiAgYXBwLnZpZGVvLmN0eC5zdHJva2UoKTtcbiAgYXBwLnZpZGVvLmN0eC5jbG9zZVBhdGgoKTtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2V4YW1wbGVzL2RlbW8tcGFydGljbGVzL2FwcC5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIiwiZmlsZSI6ImRlbW8tcGFydGljbGVzLmpzIn0=