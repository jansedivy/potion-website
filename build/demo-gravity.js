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
	  this.object.scale.set(this.r / 10);
	  this.object.position.x = this.x;
	  this.object.position.y = this.y;
	
	  this.object.blendMode = PIXI.blendModes.ADD;
	
	  app.stage.addChild(this.object);
	};
	
	Particle.prototype.update = function (time) {
	  var angle = Math.atan2(app.centerY - this.y, app.centerX - this.x);
	
	  this.dx += Math.cos(angle) * 5 * this.speed * time;
	  this.dy += Math.sin(angle) * 5 * this.speed * time;
	
	  this.dx = this.dx + (0 - this.dx) * time / 2;
	  this.dy = this.dy + (0 - this.dy) * time / 2;
	
	  var speed = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2));
	  var distance = Math.sqrt(Math.pow(app.centerX - this.x, 2) + Math.pow(app.centerY - this.y, 2));
	
	  this.r = speed / 200 + 0.2;
	
	  this.x += this.dx * time;
	  this.y += this.dy * time;
	
	  this.object.scale.set(this.r / 10);
	  this.object.position.x = this.x;
	  this.object.position.y = this.y;
	
	  if (speed < 100 && distance < 100) {
	    app.stage.removeChild(this.object);
	    return true;
	  }
	};
	
	app = Potion.init(document.querySelector(".game"), {
	  configure: function configure() {
	    this.setSize(document.body.clientWidth, document.body.clientHeight);
	    this.config.allowHiDPI = false;
	    this.config.getCanvasContext = false;
	
	    this.renderer = new PIXI.WebGLRenderer(this.width, this.height, { view: this.canvas });
	
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
	
	    window.addEventListener("resize", (function () {
	      this.setSize(document.body.clientWidth, document.body.clientHeight);
	    }).bind(this));
	  },
	
	  resize: function resize() {
	    this.centerX = this.width / 2;
	    this.centerY = this.height / 2;
	
	    this.renderer.resize(this.width, this.height);
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
	    } else {
	      this.prevX = null;
	      this.prevX = null;
	    }
	
	    for (var i = 0, len = this.particles.length; i < len; i++) {
	      var particle = this.particles[i];
	      if (particle && particle.update(time)) {
	        this.particles.splice(i, 1);
	      }
	    }
	  },
	
	  render: function render() {
	    this.renderer.render(this.stage);
	  }
	});

/***/ }
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9leGFtcGxlcy9kZW1vLWdyYXZpdHkvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUEsS0FBSSxNQUFNLEdBQUcsbUJBQU8sQ0FBQyxDQUFRLENBQUMsQ0FBQzs7QUFFL0IsS0FBSSxHQUFHLENBQUM7O0FBRVIsS0FBSSxRQUFRLEdBQUcsa0JBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUM1QixPQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNYLE9BQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVYLE9BQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVYLE9BQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDbkMsT0FBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQzs7QUFFbkMsT0FBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7O0FBRWpCLE9BQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7QUFDOUQsT0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUM1QyxPQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNuQyxPQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNoQyxPQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFaEMsT0FBSSxD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QUksUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBUSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLFFBQVEsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFNUgsaUJBQVEsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ3JFLGlCQUFRLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQzs7QUFFckUsYUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0I7O0FBRUQsV0FBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDL0IsV0FBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7TUFDaEMsTUFBTTtBQUNMLFdBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFdBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO01BQ25COztBQUVELFVBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ25ELFdBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakMsV0FBSSxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUNyQyxhQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0I7TUFDRjtJQUNGOztBQUVELFNBQU0sRUFBRSxrQkFBVztBQUNqQixTQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEM7RUFDRixDQUFDLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgUElYSSAqL1xuXG52YXIgUG90aW9uID0gcmVxdWlyZSgncG90aW9uJyk7XG5cbnZhciBhcHA7XG5cbnZhciBQYXJ0aWNsZSA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgdGhpcy54ID0geDtcbiAgdGhpcy55ID0geTtcblxuICB0aGlzLnIgPSAxO1xuXG4gIHRoaXMuZHggPSBNYXRoLnJhbmRvbSgpICogMTAwIC0gNTA7XG4gIHRoaXMuZHkgPSBNYXRoLnJhbmRvbSgpICogMTAwIC0gNTA7XG5cbiAgdGhpcy5zcGVlZCA9IDI1MDtcblxuICB0aGlzLm9iamVjdCA9IG5ldyBQSVhJLlNwcml0ZShhcHAuYXNzZXRzLmdldCgncGFydGljbGUucG5nJykpO1xuICB0aGlzLm9iamVjdC50aW50ID0gMHhmZmZmZmYgKiBNYXRoLnJhbmRvbSgpO1xuICB0aGlzLm9iamVjdC5zY2FsZS5zZXQodGhpcy5yIC8gMTApO1xuICB0aGlzLm9iamVjdC5wb3NpdGlvbi54ID0gdGhpcy54O1xuICB0aGlzLm9iamVjdC5wb3NpdGlvbi55ID0gdGhpcy55O1xuXG4gIHRoaXMub2JqZWN0LmJsZW5kTW9kZSA9IFBJWEkuYmxlbmRNb2Rlcy5BREQ7XG5cbiAgYXBwLnN0YWdlLmFkZENoaWxkKHRoaXMub2JqZWN0KTtcbn07XG5cblBhcnRpY2xlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbih0aW1lKSB7XG4gIHZhciBhbmdsZSA9IE1hdGguYXRhbjIoYXBwLmNlbnRlclkgLSB0aGlzLnksIGFwcC5jZW50ZXJYIC0gdGhpcy54KTtcblxuICB0aGlzLmR4ICs9IE1hdGguY29zKGFuZ2xlKSAqIDUgKiB0aGlzLnNwZWVkICogdGltZTtcbiAgdGhpcy5keSArPSBNYXRoLnNpbihhbmdsZSkgKiA1ICogdGhpcy5zcGVlZCAqIHRpbWU7XG5cbiAgdGhpcy5keCA9IHRoaXMuZHggKyAoMCAtIHRoaXMuZHgpICogdGltZS8yO1xuICB0aGlzLmR5ID0gdGhpcy5keSArICgwIC0gdGhpcy5keSkgKiB0aW1lLzI7XG5cbiAgdmFyIHNwZWVkID0gTWF0aC5zcXJ0KE1hdGgucG93KHRoaXMuZHgsIDIpICsgTWF0aC5wb3codGhpcy5keSwgMikpO1xuICB2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coYXBwLmNlbnRlclggLSB0aGlzLngsIDIpICsgTWF0aC5wb3coYXBwLmNlbnRlclkgLSB0aGlzLnksIDIpKTtcblxuICB0aGlzLnIgPSBzcGVlZCAvIDIwMCArIDAuMjtcblxuICB0aGlzLnggKz0gdGhpcy5keCAqIHRpbWU7XG4gIHRoaXMueSArPSB0aGlzLmR5ICogdGltZTtcblxuICB0aGlzLm9iamVjdC5zY2FsZS5zZXQodGhpcy5yIC8gMTApO1xuICB0aGlzLm9iamVjdC5wb3NpdGlvbi54ID0gdGhpcy54O1xuICB0aGlzLm9iamVjdC5wb3NpdGlvbi55ID0gdGhpcy55O1xuXG4gIGlmIChzcGVlZCA8IDEwMCAmJiBkaXN0YW5jZSA8IDEwMCkge1xuICAgIGFwcC5zdGFnZS5yZW1vdmVDaGlsZCh0aGlzLm9iamVjdCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cbmFwcCA9IFBvdGlvbi5pbml0KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lJyksIHtcbiAgY29uZmlndXJlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFNpemUoZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCwgZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQpO1xuICAgIHRoaXMuY29uZmlnLmFsbG93SGlEUEkgPSBmYWxzZTtcbiAgICB0aGlzLmNvbmZpZy5nZXRDYW52YXNDb250ZXh0ID0gZmFsc2U7XG5cbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFBJWEkuV2ViR0xSZW5kZXJlcih0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgeyB2aWV3OiB0aGlzLmNhbnZhcyB9KTtcblxuICAgIHRoaXMuYXNzZXRzLmFkZExvYWRlcigncGl4aScsIGZ1bmN0aW9uKHVybCwgY2FsbGJhY2spIHtcbiAgICAgIHRoaXMuYXNzZXRzLl9sb2FkZXJzLmltYWdlKHVybCwgZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgICAgY2FsbGJhY2sobmV3IFBJWEkuVGV4dHVyZShuZXcgUElYSS5CYXNlVGV4dHVyZShpbWFnZSkpKTtcbiAgICAgIH0pO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLmFzc2V0cy5sb2FkKCdwaXhpJywgJ3BhcnRpY2xlLnBuZycpO1xuICB9LFxuXG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY2VudGVyWCA9IHRoaXMud2lkdGgvMjtcbiAgICB0aGlzLmNlbnRlclkgPSB0aGlzLmhlaWdodC8yO1xuXG4gICAgdGhpcy5wcmV2WCA9IG51bGw7XG4gICAgdGhpcy5wcmV2WSA9IG51bGw7XG5cbiAgICB0aGlzLnBhcnRpY2xlcyA9IFtdO1xuICAgIHRoaXMuc3RhZ2UgPSBuZXcgUElYSS5TdGFnZSgweDA4MGEyNSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnNldFNpemUoZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCwgZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgcmVzaXplOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNlbnRlclggPSB0aGlzLndpZHRoLzI7XG4gICAgdGhpcy5jZW50ZXJZID0gdGhpcy5oZWlnaHQvMjtcblxuICAgIHRoaXMucmVuZGVyZXIucmVzaXplKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICBpZiAoYXBwLmlucHV0Lm1vdXNlLmlzRG93bikge1xuICAgICAgaWYgKHRoaXMucHJldlggPT0gbnVsbCB8fCB0aGlzLnByZXZZID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5wcmV2WCA9IGFwcC5pbnB1dC5tb3VzZS54O1xuICAgICAgICB0aGlzLnByZXZZID0gYXBwLmlucHV0Lm1vdXNlLnk7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGk9MDsgaTwxMDA7IGkrKykge1xuICAgICAgICB2YXIgYW5nbGUgPSBNYXRoLnJhbmRvbSgpICogTWF0aC5QSSoyO1xuICAgICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnJhbmRvbSgpICogNDA7XG5cbiAgICAgICAgdmFyIHBhcnRpY2xlID0gbmV3IFBhcnRpY2xlKE1hdGguY29zKGFuZ2xlKSAqIGRpc3RhbmNlICsgYXBwLmlucHV0Lm1vdXNlLngsIE1hdGguc2luKGFuZ2xlKSAqIGRpc3RhbmNlICsgYXBwLmlucHV0Lm1vdXNlLnkpO1xuXG4gICAgICAgIHBhcnRpY2xlLmR4ICs9IChhcHAuaW5wdXQubW91c2UueCAtIHRoaXMucHJldlgpICogTWF0aC5yYW5kb20oKSAqIDQwO1xuICAgICAgICBwYXJ0aWNsZS5keSArPSAoYXBwLmlucHV0Lm1vdXNlLnkgLSB0aGlzLnByZXZZKSAqIE1hdGgucmFuZG9tKCkgKiA0MDtcblxuICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHBhcnRpY2xlKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wcmV2WCA9IGFwcC5pbnB1dC5tb3VzZS54O1xuICAgICAgdGhpcy5wcmV2WSA9IGFwcC5pbnB1dC5tb3VzZS55O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByZXZYID0gbnVsbDtcbiAgICAgIHRoaXMucHJldlggPSBudWxsO1xuICAgIH1cblxuICAgIGZvciAodmFyIGk9MCwgbGVuPXRoaXMucGFydGljbGVzLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgICAgdmFyIHBhcnRpY2xlID0gdGhpcy5wYXJ0aWNsZXNbaV07XG4gICAgICBpZiAocGFydGljbGUgJiYgcGFydGljbGUudXBkYXRlKHRpbWUpKSB7XG4gICAgICAgIHRoaXMucGFydGljbGVzLnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnN0YWdlKTtcbiAgfVxufSk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2V4YW1wbGVzL2RlbW8tZ3Jhdml0eS9hcHAuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiIsImZpbGUiOiJkZW1vLWdyYXZpdHkuanMifQ==