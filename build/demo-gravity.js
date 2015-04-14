webpackJsonp([9],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* global PIXI */
	
	"use strict";
	
	var Potion = __webpack_require__(1);
	
	var app;
	
	var Particle = function Particle(x, y) {
	  this.x = x;
	  this.y = y;
	
	  this.r = 1;
	
	  this.dx = Math.random() * 100 - 50;
	  this.dy = Math.random() * 100 - 50;
	
	  this.speed = 250;
	
	  this.object = new PIXI.Sprite(app.assets.get("particle.png"));
	  this.object.tint = 16777215 * Math.random();
	
	  this.object.blendMode = PIXI.blendModes.ADD;
	
	  app.stage.addChild(this.object);
	};
	
	Particle.prototype.update = function (time) {
	  var angle = Math.atan2(app.centerY - this.y, app.centerX - this.x);
	
	  this.dx += Math.cos(angle) * 5 * this.speed * time;
	  this.dy += Math.sin(angle) * 5 * this.speed * time;
	
	  this.dx = this.dx + (0 - this.dx) * time / 2;
	  this.dy = this.dy + (0 - this.dy) * time / 2;
	
	  this.r = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2)) / 200 + 0.2;
	
	  this.x += this.dx * time;
	  this.y += this.dy * time;
	
	  this.object.scale.set(this.r / 10);
	  this.object.position.x = this.x;
	  this.object.position.y = this.y;
	};
	
	app = Potion.init(document.querySelector(".game"), {
	  configure: function configure() {
	    this.setSize(document.body.clientWidth, document.body.clientHeight);
	    this.config.allowHiDPI = false;
	    this.config.getCanvasContext = false;
	
	    this.renderer = new PIXI.WebGLRenderer(this.width, this.height, { resolution: this.config.allowHiDPI ? 2 : 1, view: this.canvas });
	
	    this.assets.addLoader("pixi", (function (url, callback) {
	      this.assets._loaders.image(url, function (image) {
	        callback(new PIXI.Texture(new PIXI.BaseTexture(image)));
	      });
	    }).bind(this));
	
	    this.assets.load("pixi", "particle.png");
	  },
	
	  init: function init() {
	    this.centerX = this.width / 2;
	    this.centerY = this.height / 2;
	
	    this.prevX = null;
	    this.prevY = null;
	
	    this.particles = [];
	    this.stage = new PIXI.Stage(526885);
	  },
	
	  mouseup: function mouseup() {
	    this.prevX = null;
	    this.prevY = null;
	  },
	
	  update: function update(time) {
	    if (app.input.mouse.isDown) {
	      if (this.prevX == null || this.prevY == null) {
	        this.prevX = app.input.mouse.x;
	        this.prevY = app.input.mouse.y;
	      }
	
	      for (var i = 0; i < 100; i++) {
	        var angle = Math.random() * Math.PI * 2;
	        var distance = Math.random() * 40;
	
	        var particle = new Particle(Math.cos(angle) * distance + app.input.mouse.x, Math.sin(angle) * distance + app.input.mouse.y);
	
	        particle.dx += (app.input.mouse.x - this.prevX) * Math.random() * 40;
	        particle.dy += (app.input.mouse.y - this.prevY) * Math.random() * 40;
	
	        this.particles.push(particle);
	      }
	
	      this.prevX = app.input.mouse.x;
	      this.prevY = app.input.mouse.y;
	    }
	
	    for (var i = 0, len = this.particles.length; i < len; i++) {
	      this.particles[i].update(time);
	    }
	  },
	
	  render: function render() {
	    this.renderer.render(this.stage);
	  }
	});

/***/ }
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9leGFtcGxlcy9kZW1vLWdyYXZpdHkvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUEsS0FBSSxNQUFNLEdBQUcsbUJBQU8sQ0FBQyxDQUFRLENBQUMsQ0FBQzs7QUFFL0IsS0FBSSxHQUFHLENBQUM7O0FBRVIsS0FBSSxRQUFRLEdBQUcsa0JBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUM1QixPQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNYLE9BQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVYLE9BQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVYLE9BQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDbkMsT0FBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQzs7QUFFbkMsT0FBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7O0FBRWpCLE9BQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7QUFDOUQsT0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7QUFFNUMsT0FBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7O0FBRTVDLE1BQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUNqQyxDQUFDOztBQUVGLFNBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFVBQVMsSUFBSSxFQUFFO0FBQ3pDLE9BQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVuRSxPQUFJLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ25ELE9BQUksQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRW5ELE9BQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxJQUFJLElBQUksR0FBQyxDQUFDLENBQUM7QUFDM0MsT0FBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLElBQUksSUFBSSxHQUFDLENBQUMsQ0FBQzs7QUFFM0MsT0FBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDOztBQUU1RSxPQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLE9BQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7O0FBRXpCLE9BQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ25DLE9BQUksQ0FBQyxNQUFNLENBQUMs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QUFDO0FBQ3RDLGFBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7O0FBRWxDLGFBQUksUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBUSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLFFBQVEsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFNUgsaUJBQVEsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ3JFLGlCQUFRLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQzs7QUFFckUsYUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0I7O0FBRUQsV0FBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDL0IsV0FBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7TUFDaEM7O0FBR0QsVUFBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbkQsV0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDaEM7SUFDRjs7QUFFRCxTQUFNLEVBQUUsa0JBQVc7QUFDakIsU0FBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xDO0VBQ0YsQ0FBQyxDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZ2xvYmFsIFBJWEkgKi9cblxudmFyIFBvdGlvbiA9IHJlcXVpcmUoJ3BvdGlvbicpO1xuXG52YXIgYXBwO1xuXG52YXIgUGFydGljbGUgPSBmdW5jdGlvbih4LCB5KSB7XG4gIHRoaXMueCA9IHg7XG4gIHRoaXMueSA9IHk7XG5cbiAgdGhpcy5yID0gMTtcblxuICB0aGlzLmR4ID0gTWF0aC5yYW5kb20oKSAqIDEwMCAtIDUwO1xuICB0aGlzLmR5ID0gTWF0aC5yYW5kb20oKSAqIDEwMCAtIDUwO1xuXG4gIHRoaXMuc3BlZWQgPSAyNTA7XG5cbiAgdGhpcy5vYmplY3QgPSBuZXcgUElYSS5TcHJpdGUoYXBwLmFzc2V0cy5nZXQoJ3BhcnRpY2xlLnBuZycpKTtcbiAgdGhpcy5vYmplY3QudGludCA9IDB4ZmZmZmZmICogTWF0aC5yYW5kb20oKTtcblxuICB0aGlzLm9iamVjdC5ibGVuZE1vZGUgPSBQSVhJLmJsZW5kTW9kZXMuQUREO1xuXG4gIGFwcC5zdGFnZS5hZGRDaGlsZCh0aGlzLm9iamVjdCk7XG59O1xuXG5QYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICB2YXIgYW5nbGUgPSBNYXRoLmF0YW4yKGFwcC5jZW50ZXJZIC0gdGhpcy55LCBhcHAuY2VudGVyWCAtIHRoaXMueCk7XG5cbiAgdGhpcy5keCArPSBNYXRoLmNvcyhhbmdsZSkgKiA1ICogdGhpcy5zcGVlZCAqIHRpbWU7XG4gIHRoaXMuZHkgKz0gTWF0aC5zaW4oYW5nbGUpICogNSAqIHRoaXMuc3BlZWQgKiB0aW1lO1xuXG4gIHRoaXMuZHggPSB0aGlzLmR4ICsgKDAgLSB0aGlzLmR4KSAqIHRpbWUvMjtcbiAgdGhpcy5keSA9IHRoaXMuZHkgKyAoMCAtIHRoaXMuZHkpICogdGltZS8yO1xuXG4gIHRoaXMuciA9IE1hdGguc3FydChNYXRoLnBvdyh0aGlzLmR4LCAyKSArIE1hdGgucG93KHRoaXMuZHksIDIpKSAvIDIwMCArIDAuMjtcblxuICB0aGlzLnggKz0gdGhpcy5keCAqIHRpbWU7XG4gIHRoaXMueSArPSB0aGlzLmR5ICogdGltZTtcblxuICB0aGlzLm9iamVjdC5zY2FsZS5zZXQodGhpcy5yIC8gMTApO1xuICB0aGlzLm9iamVjdC5wb3NpdGlvbi54ID0gdGhpcy54O1xuICB0aGlzLm9iamVjdC5wb3NpdGlvbi55ID0gdGhpcy55O1xufTtcblxuYXBwID0gUG90aW9uLmluaXQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUnKSwge1xuICBjb25maWd1cmU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0U2l6ZShkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoLCBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodCk7XG4gICAgdGhpcy5jb25maWcuYWxsb3dIaURQSSA9IGZhbHNlO1xuICAgIHRoaXMuY29uZmlnLmdldENhbnZhc0NvbnRleHQgPSBmYWxzZTtcblxuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgUElYSS5XZWJHTFJlbmRlcmVyKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCB7IHJlc29sdXRpb246IHRoaXMuY29uZmlnLmFsbG93SGlEUEkgPyAyIDogMSwgdmlldzogdGhpcy5jYW52YXMgfSk7XG5cbiAgICB0aGlzLmFzc2V0cy5hZGRMb2FkZXIoJ3BpeGknLCBmdW5jdGlvbih1cmwsIGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLmFzc2V0cy5fbG9hZGVycy5pbWFnZSh1cmwsIGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBQSVhJLlRleHR1cmUobmV3IFBJWEkuQmFzZVRleHR1cmUoaW1hZ2UpKSk7XG4gICAgICB9KTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5hc3NldHMubG9hZCgncGl4aScsICdwYXJ0aWNsZS5wbmcnKTtcbiAgfSxcblxuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNlbnRlclggPSB0aGlzLndpZHRoLzI7XG4gICAgdGhpcy5jZW50ZXJZID0gdGhpcy5oZWlnaHQvMjtcblxuICAgIHRoaXMucHJldlggPSBudWxsO1xuICAgIHRoaXMucHJldlkgPSBudWxsO1xuXG4gICAgdGhpcy5wYXJ0aWNsZXMgPSBbXTtcbiAgICB0aGlzLnN0YWdlID0gbmV3IFBJWEkuU3RhZ2UoMHgwODBhMjUpO1xuICB9LFxuXG4gIG1vdXNldXA6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucHJldlggPSBudWxsO1xuICAgIHRoaXMucHJldlkgPSBudWxsO1xuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24odGltZSkge1xuICAgIGlmIChhcHAuaW5wdXQubW91c2UuaXNEb3duKSB7XG4gICAgICBpZiAodGhpcy5wcmV2WCA9PSBudWxsIHx8IHRoaXMucHJldlkgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnByZXZYID0gYXBwLmlucHV0Lm1vdXNlLng7XG4gICAgICAgIHRoaXMucHJldlkgPSBhcHAuaW5wdXQubW91c2UueTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaT0wOyBpPDEwMDsgaSsrKSB7XG4gICAgICAgIHZhciBhbmdsZSA9IE1hdGgucmFuZG9tKCkgKiBNYXRoLlBJKjI7XG4gICAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGgucmFuZG9tKCkgKiA0MDtcblxuICAgICAgICB2YXIgcGFydGljbGUgPSBuZXcgUGFydGljbGUoTWF0aC5jb3MoYW5nbGUpICogZGlzdGFuY2UgKyBhcHAuaW5wdXQubW91c2UueCwgTWF0aC5zaW4oYW5nbGUpICogZGlzdGFuY2UgKyBhcHAuaW5wdXQubW91c2UueSk7XG5cbiAgICAgICAgcGFydGljbGUuZHggKz0gKGFwcC5pbnB1dC5tb3VzZS54IC0gdGhpcy5wcmV2WCkgKiBNYXRoLnJhbmRvbSgpICogNDA7XG4gICAgICAgIHBhcnRpY2xlLmR5ICs9IChhcHAuaW5wdXQubW91c2UueSAtIHRoaXMucHJldlkpICogTWF0aC5yYW5kb20oKSAqIDQwO1xuXG4gICAgICAgIHRoaXMucGFydGljbGVzLnB1c2gocGFydGljbGUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnByZXZYID0gYXBwLmlucHV0Lm1vdXNlLng7XG4gICAgICB0aGlzLnByZXZZID0gYXBwLmlucHV0Lm1vdXNlLnk7XG4gICAgfVxuXG5cbiAgICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLnBhcnRpY2xlcy5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICAgIHRoaXMucGFydGljbGVzW2ldLnVwZGF0ZSh0aW1lKTtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnN0YWdlKTtcbiAgfVxufSk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2V4YW1wbGVzL2RlbW8tZ3Jhdml0eS9hcHAuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiIsImZpbGUiOiJkZW1vLWdyYXZpdHkuanMifQ==