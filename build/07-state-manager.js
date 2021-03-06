webpackJsonp([6],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Potion = __webpack_require__(1);
	
	var app;
	
	var GameState = function GameState() {};
	
	GameState.prototype.init = function () {
	  this.position = 0;
	  this.totalTime = 0;
	};
	
	GameState.prototype.update = function (time) {
	  this.totalTime += time;
	  this.position = Math.sin(this.totalTime) * (app.width - 80) / 2 + (app.width - 80) / 2;
	};
	
	GameState.prototype.render = function () {
	  app.video.ctx.fillStyle = "#bada55";
	  app.video.ctx.fillRect(this.position, app.height - 100, 80, 100);
	
	  app.video.ctx.fillStyle = "black";
	  app.video.ctx.font = "20px sans-serif";
	  app.video.ctx.textAlign = "left";
	  app.video.ctx.textBaseline = "top";
	  app.video.ctx.fillText("Esc to pause", 10, 10);
	};
	
	GameState.prototype.keydown = function (value) {
	  if (value.name === "esc") {
	    app.states.pause("game");
	    app.states.enable("pause");
	  }
	};
	
	var PauseState = function PauseState() {};
	
	PauseState.prototype.render = function () {
	  app.video.ctx.fillStyle = "black";
	  app.video.ctx.font = "20px sans-serif";
	  app.video.ctx.textAlign = "center";
	  app.video.ctx.textBaseline = "middle";
	  app.video.ctx.fillText("Pause", app.width / 2, 100);
	
	  app.video.ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
	  app.video.ctx.fillRect(0, 0, app.width, app.height);
	};
	
	PauseState.prototype.keydown = function (value) {
	  if (value.name === "esc") {
	    app.states.disable("pause");
	    app.states.unpause("game");
	  }
	};
	
	var MenuState = function MenuState() {};
	
	MenuState.prototype.render = function () {
	  app.video.ctx.fillStyle = "black";
	  app.video.ctx.font = "20px sans-serif";
	  app.video.ctx.textAlign = "center";
	  app.video.ctx.textBaseline = "middle";
	  app.video.ctx.fillText("Main Menu", app.width / 2, 100);
	
	  app.video.ctx.font = "14px sans-serif";
	  app.video.ctx.fillText("Press any key to start the game", app.width / 2, 160);
	};
	
	MenuState.prototype.keyup = function () {
	  app.states.enable("game");
	  app.states.disable("menu");
	};
	
	app = Potion.init(document.querySelector(".game"), {
	  init: function init() {
	    app.states.add("game", new GameState());
	    app.states.add("pause", new PauseState());
	    app.states.add("menu", new MenuState());
	
	    app.states.disable("game");
	    app.states.disable("pause");
	  }
	});

/***/ }
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9leGFtcGxlcy8wNy1zdGF0ZS1tYW5hZ2VyL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxLQUFJLE1BQU0sR0FBRyxtQkFBTyxDQUFDLENBQVEsQ0FBQyxDQUFDOztBQUUvQixLQUFJLEdBQUcsQ0FBQzs7QUFFUixLQUFJLFNBQVMsR0FBRyxxQkFBVyxFQUFFLENBQUM7O0FBRTlCLFVBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFlBQVc7QUFDcEMsT0FBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDbEIsT0FBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7RUFDcEIsQ0FBQzs7QUFFRixVQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFTLElBQUksRUFBRTtBQUMxQyxPQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQztBQUN2QixPQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLElBQUUsQ0FBQyxDQUFDO0VBQ3BGLENBQUM7O0FBRUYsVUFBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsWUFBVztBQUN0QyxNQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQ3BDLE1BQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEdBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFL0QsTUFBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztBQUNsQyxNQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FB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QUM7RUFDN0UsQ0FBQzs7QUFFRixVQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxZQUFXO0FBQ3JDLE1BQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzFCLE1BQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQzVCLENBQUM7O0FBRUYsSUFBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNqRCxPQUFJLEVBQUUsZ0JBQVc7QUFDZixRQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxTQUFTLEVBQUUsQ0FBQyxDQUFDO0FBQ3hDLFFBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLFVBQVUsRUFBRSxDQUFDLENBQUM7QUFDMUMsUUFBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksU0FBUyxFQUFFLENBQUMsQ0FBQzs7QUFFeEMsUUFBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsUUFBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0I7RUFDRixDQUFDLEMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUG90aW9uID0gcmVxdWlyZSgncG90aW9uJyk7XG5cbnZhciBhcHA7XG5cbnZhciBHYW1lU3RhdGUgPSBmdW5jdGlvbigpIHt9O1xuXG5HYW1lU3RhdGUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5wb3NpdGlvbiA9IDA7XG4gIHRoaXMudG90YWxUaW1lID0gMDtcbn07XG5cbkdhbWVTdGF0ZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICB0aGlzLnRvdGFsVGltZSArPSB0aW1lO1xuICB0aGlzLnBvc2l0aW9uID0gTWF0aC5zaW4odGhpcy50b3RhbFRpbWUpICogKGFwcC53aWR0aCAtIDgwKS8yICsgKGFwcC53aWR0aCAtIDgwKS8yO1xufTtcblxuR2FtZVN0YXRlLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgYXBwLnZpZGVvLmN0eC5maWxsU3R5bGUgPSAnI2JhZGE1NSc7XG4gIGFwcC52aWRlby5jdHguZmlsbFJlY3QodGhpcy5wb3NpdGlvbiwgYXBwLmhlaWdodC0xMDAsIDgwLCAxMDApO1xuXG4gIGFwcC52aWRlby5jdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgYXBwLnZpZGVvLmN0eC5mb250ID0gJzIwcHggc2Fucy1zZXJpZic7XG4gIGFwcC52aWRlby5jdHgudGV4dEFsaWduID0gJ2xlZnQnO1xuICBhcHAudmlkZW8uY3R4LnRleHRCYXNlbGluZSA9ICd0b3AnO1xuICBhcHAudmlkZW8uY3R4LmZpbGxUZXh0KCdFc2MgdG8gcGF1c2UnLCAxMCwgMTApO1xufTtcblxuR2FtZVN0YXRlLnByb3RvdHlwZS5rZXlkb3duID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKHZhbHVlLm5hbWUgPT09ICdlc2MnKSB7XG4gICAgYXBwLnN0YXRlcy5wYXVzZSgnZ2FtZScpO1xuICAgIGFwcC5zdGF0ZXMuZW5hYmxlKCdwYXVzZScpO1xuICB9XG59O1xuXG52YXIgUGF1c2VTdGF0ZSA9IGZ1bmN0aW9uKCkge307XG5cblBhdXNlU3RhdGUucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICBhcHAudmlkZW8uY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gIGFwcC52aWRlby5jdHguZm9udCA9ICcyMHB4IHNhbnMtc2VyaWYnO1xuICBhcHAudmlkZW8uY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICBhcHAudmlkZW8uY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xuICBhcHAudmlkZW8uY3R4LmZpbGxUZXh0KCdQYXVzZScsIGFwcC53aWR0aC8yLCAxMDApO1xuXG4gIGFwcC52aWRlby5jdHguZmlsbFN0eWxlID0gJ3JnYmEoMCwgMCwgMCwgMC40KSc7XG4gIGFwcC52aWRlby5jdHguZmlsbFJlY3QoMCwgMCwgYXBwLndpZHRoLCBhcHAuaGVpZ2h0KTtcbn07XG5cblxuUGF1c2VTdGF0ZS5wcm90b3R5cGUua2V5ZG93biA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICh2YWx1ZS5uYW1lID09PSAnZXNjJykge1xuICAgIGFwcC5zdGF0ZXMuZGlzYWJsZSgncGF1c2UnKTtcbiAgICBhcHAuc3RhdGVzLnVucGF1c2UoJ2dhbWUnKTtcbiAgfVxufTtcblxudmFyIE1lbnVTdGF0ZSA9IGZ1bmN0aW9uKCkge307XG5cbk1lbnVTdGF0ZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gIGFwcC52aWRlby5jdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgYXBwLnZpZGVvLmN0eC5mb250ID0gJzIwcHggc2Fucy1zZXJpZic7XG4gIGFwcC52aWRlby5jdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gIGFwcC52aWRlby5jdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XG4gIGFwcC52aWRlby5jdHguZmlsbFRleHQoJ01haW4gTWVudScsIGFwcC53aWR0aC8yLCAxMDApO1xuXG4gIGFwcC52aWRlby5jdHguZm9udCA9ICcxNHB4IHNhbnMtc2VyaWYnO1xuICBhcHAudmlkZW8uY3R4LmZpbGxUZXh0KCdQcmVzcyBhbnkga2V5IHRvIHN0YXJ0IHRoZSBnYW1lJywgYXBwLndpZHRoLzIsIDE2MCk7XG59O1xuXG5NZW51U3RhdGUucHJvdG90eXBlLmtleXVwID0gZnVuY3Rpb24oKSB7XG4gIGFwcC5zdGF0ZXMuZW5hYmxlKCdnYW1lJyk7XG4gIGFwcC5zdGF0ZXMuZGlzYWJsZSgnbWVudScpO1xufTtcblxuYXBwID0gUG90aW9uLmluaXQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUnKSwge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICBhcHAuc3RhdGVzLmFkZCgnZ2FtZScsIG5ldyBHYW1lU3RhdGUoKSk7XG4gICAgYXBwLnN0YXRlcy5hZGQoJ3BhdXNlJywgbmV3IFBhdXNlU3RhdGUoKSk7XG4gICAgYXBwLnN0YXRlcy5hZGQoJ21lbnUnLCBuZXcgTWVudVN0YXRlKCkpO1xuXG4gICAgYXBwLnN0YXRlcy5kaXNhYmxlKCdnYW1lJyk7XG4gICAgYXBwLnN0YXRlcy5kaXNhYmxlKCdwYXVzZScpO1xuICB9XG59KTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vZXhhbXBsZXMvMDctc3RhdGUtbWFuYWdlci9hcHAuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiIsImZpbGUiOiIwNy1zdGF0ZS1tYW5hZ2VyLmpzIn0=