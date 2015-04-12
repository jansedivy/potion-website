/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			modules[moduleId] = moreModules[moduleId];
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);
/******/ 		if(moreModules[0]) {
/******/ 			installedModules[0] = 0;
/******/ 			return __webpack_require__(0);
/******/ 		}
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		12:0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);
/******/
/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;
/******/ 			script.src = __webpack_require__.p + "" + chunkId + ".chunk.js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/__build__/";
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Engine = __webpack_require__(2);
	
	module.exports = {
	  init: function init(canvas, methods) {
	    var engine = new Engine(canvas, methods);
	    return engine.game;
	  }
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	__webpack_require__(3)();
	
	var Game = __webpack_require__(4);
	
	var Time = __webpack_require__(5);
	
	var Debugger = __webpack_require__(7);
	
	var StateManager = __webpack_require__(6);
	
	/**
	 * Main Engine class which calls the game methods
	 * @constructor
	 */
	var Engine = function Engine(container, methods) {
	  var GameClass = this._subclassGame(container, methods);
	
	  container.style.position = "relative";
	
	  var canvas = document.createElement("canvas");
	  canvas.style.display = "block";
	  container.appendChild(canvas);
	
	  this.game = new GameClass(canvas);
	  this.game.debug = new Debugger(this.game);
	
	  this._setDefaultStates();
	
	  this.tickFunc = (function (self) {
	    return function () {
	      self.tick();
	    };
	  })(this);
	  this.preloaderTickFunc = (function (self) {
	    return function () {
	      self._preloaderTick();
	    };
	  })(this);
	
	  this.strayTime = 0;
	
	  this._time = Time.now();
	
	  this.game.assets.onload((function () {
	    this.start();
	
	    window.cancelAnimationFrame(this.preloaderId);
	    window.requestAnimationFrame(this.tickFunc);
	  }).bind(this));
	
	  if (this.game.assets.isLoading) {
	    this.preloaderId = window.requestAnimationFrame(this.preloaderTickFunc);
	  }
	};
	
	/**
	 * Add event listener for window events
	 * @private
	 */
	Engine.prototype.addEvents = function () {
	  var self = this;
	
	  var game = self.game;
	  window.addEventListener("blur", function () {
	    self.game.input.resetKeys();
	    self.game.blur();
	  });
	
	  window.addEventListener("focus", function () {
	    self.game.input.resetKeys();
	    self.game.focus();
	  });
	};
	
	/**
	 * Starts the game, adds events and run first frame
	 * @private
	 */
	Engine.prototype.start = function () {
	  if (this.game.config.addInputEvents) {
	    this.addEvents();
	  }
	};
	
	/**
	 * Main tick function in game loop
	 * @private
	 */
	Engine.prototype.tick = function () {
	  this.game.debug.begin();
	
	  window.requestAnimationFrame(this.tickFunc);
	
	  var now = Time.now();
	  var time = (now - this._time) / 1000;
	  this._time = now;
	
	  this.game.debug.perf("update");
	  this.update(time);
	  this.game.debug.stopPerf("update");
	
	  this.game.states.exitUpdate(time);
	
	  this.game.debug.perf("render");
	  this.render();
	  this.game.debug.stopPerf("render");
	
	  this.game.debug.render();
	
	  this.game.debug.end();
	};
	
	/**
	 * Updates the game
	 * @param {number} time - time in seconds since last frame
	 * @private
	 */
	Engine.prototype.update = function (time) {
	  if (time > this.game.config.maxStepTime) {
	    time = this.game.config.maxStepTime;
	  }
	
	  if (this.game.config.fixedStep) {
	    this.strayTime = this.strayTime + time;
	    while (this.strayTime >= this.game.config.stepTime) {
	      this.strayTime = this.strayTime - this.game.config.stepTime;
	      this.game.states.update(this.game.config.stepTime);
	    }
	  } else {
	    this.game.states.update(time);
	  }
	};
	
	/**
	 * Renders the game
	 * @private
	 */
	Engine.prototype.render = function () {
	  this.game.video.beginFrame();
	
	  this.game.video.clear();
	
	  this.game.states.render();
	
	  this.game.video.endFrame();
	};
	
	/**
	 * Main tick function in preloader loop
	 * @private
	 */
	Engine.prototype._preloaderTick = function () {
	  this.preloaderId = window.requestAnimationFrame(this.preloaderTickFunc);
	
	  var now = Time.now();
	  var time = (now - this._time) / 1000;
	  this._time = now;
	
	  if (this.game.config.showPreloader) {
	    this.game.video.clear();
	    this.game.preloading(time);
	  }
	};
	
	Engine.prototype._setDefaultStates = function () {
	  var states = new StateManager();
	  states.add("app", this.game);
	  states.add("debug", this.game.debug);
	
	  states.protect("app");
	  states.protect("debug");
	  states.hide("debug");
	
	  this.game.states = states;
	};
	
	Engine.prototype._subclassGame = function (container, methods) {
	  var GameClass = function GameClass(container) {
	    Game.call(this, container);
	  };
	
	  GameClass.prototype = Object.create(Game.prototype);
	
	  for (var method in methods) {
	    GameClass.prototype[method] = methods[method];
	  }
	
	  return GameClass;
	};
	
	module.exports = Engine;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = function () {
	  var lastTime = 0;
	  var vendors = ["ms", "moz", "webkit", "o"];
	
	  for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
	    window.requestAnimationFrame = window[vendors[i] + "RequestAnimationFrame"];
	    window.cancelAnimationFrame = window[vendors[i] + "CancelAnimationFrame"] || window[vendors[i] + "CancelRequestAnimationFrame"];
	  }
	
	  if (!window.requestAnimationFrame) {
	    window.requestAnimationFrame = function (callback) {
	      var currTime = new Date().getTime();
	      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	
	      var id = window.setTimeout(function () {
	        callback(currTime + timeToCall);
	      }, timeToCall);
	
	      lastTime = currTime + timeToCall;
	      return id;
	    };
	  }
	
	  if (!window.cancelAnimationFrame) {
	    window.cancelAnimationFrame = function (id) {
	      clearTimeout(id);
	    };
	  }
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Video = __webpack_require__(8);
	var Assets = __webpack_require__(9);
	var Input = __webpack_require__(10);
	
	var Game = function Game(canvas) {
	  this.canvas = canvas;
	
	  this.width = 300;
	
	  this.height = 300;
	
	  this.assets = new Assets();
	
	  this.states = null;
	  this.debug = null;
	  this.input = null;
	  this.video = null;
	
	  this.config = {
	    useRetina: true,
	    initializeCanvas: true,
	    initializeVideo: true,
	    addInputEvents: true,
	    showPreloader: true,
	    fixedStep: false,
	    stepTime: 0.01666,
	    maxStepTime: 0.01666
	  };
	
	  this.configure();
	
	  if (this.config.initializeVideo) {
	    this.video = new Video(this, canvas, this.config);
	  }
	
	  if (this.config.addInputEvents) {
	    this.input = new Input(this, canvas.parentElement);
	  }
	};
	
	Game.prototype.setSize = function (width, height) {
	  this.width = width;
	  this.height = height;
	
	  if (this.video) {
	    this.video.setSize(width, height);
	  }
	};
	
	Game.prototype.preloading = function (time) {
	  if (!this.config.showPreloader && !(this.video && this.video.ctx)) {
	    return;
	  }
	
	  if (this.video.ctx) {
	    var color1 = "#b9ff71";
	    var color2 = "#8ac250";
	    var color3 = "#648e38";
	
	    if (this._preloaderWidth === undefined) {
	      this._preloaderWidth = 0;
	    }
	
	    var width = Math.min(this.width * 2 / 3, 300);
	    var height = 20;
	
	    var y = (this.height - height) / 2;
	    var x = (this.width - width) / 2;
	
	    var currentWidth = width * this.assets.progress;
	    this._preloaderWidth = this._preloaderWidth + (currentWidth - this._preloaderWidth) * time * 10;
	
	    this.video.ctx.save();
	
	    this.video.ctx.fillStyle = color2;
	    this.video.ctx.fillRect(0, 0, this.width, this.height);
	
	    this.video.ctx.font = "400 40px sans-serif";
	    this.video.ctx.textAlign = "center";
	    this.video.ctx.textBaseline = "bottom";
	
	    this.video.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
	    this.video.ctx.fillText("Potion.js", this.width / 2, y + 2);
	
	    this.video.ctx.fillStyle = "#d1ffa1";
	    this.video.ctx.fillText("Potion.js", this.width / 2, y);
	
	    this.video.ctx.strokeStyle = this.video.ctx.fillStyle = color3;
	    this.video.ctx.fillRect(x, y + 15, width, height);
	
	    this.video.ctx.lineWidth = 2;
	    this.video.ctx.beginPath();
	    this.video.ctx.rect(x - 5, y + 10, width + 10, height + 10);
	    this.video.ctx.closePath();
	    this.video.ctx.stroke();
	
	    this.video.ctx.strokeStyle = this.video.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
	    this.video.ctx.fillRect(x, y + 15, this._preloaderWidth, height + 2);
	
	    this.video.ctx.lineWidth = 2;
	    this.video.ctx.beginPath();
	
	    this.video.ctx.moveTo(x + this._preloaderWidth, y + 12);
	    this.video.ctx.lineTo(x - 5, y + 12);
	    this.video.ctx.lineTo(x - 5, y + 10 + height + 12);
	    this.video.ctx.lineTo(x + this._preloaderWidth, y + 10 + height + 12);
	
	    this.video.ctx.stroke();
	    this.video.ctx.closePath();
	
	    this.video.ctx.strokeStyle = this.video.ctx.fillStyle = color1;
	    this.video.ctx.fillRect(x, y + 15, this._preloaderWidth, height);
	
	    this.video.ctx.lineWidth = 2;
	    this.video.ctx.beginPath();
	
	    this.video.ctx.moveTo(x + this._preloaderWidth, y + 10);
	    this.video.ctx.lineTo(x - 5, y + 10);
	    this.video.ctx.lineTo(x - 5, y + 10 + height + 10);
	    this.video.ctx.lineTo(x + this._preloaderWidth, y + 10 + height + 10);
	
	    this.video.ctx.stroke();
	    this.video.ctx.closePath();
	
	    this.video.ctx.restore();
	  }
	};
	
	Game.prototype.configure = function () {};
	
	Game.prototype.focus = function () {};
	
	Game.prototype.blur = function () {};
	
	module.exports = Game;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = (function () {
	  return window.performance || Date;
	})();

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var renderOrderSort = function renderOrderSort(a, b) {
	  return a.renderOrder < b.renderOrder;
	};
	
	var updateOrderSort = function updateOrderSort(a, b) {
	  return a.updateOrder < b.updateOrder;
	};
	
	var StateManager = function StateManager() {
	  this.states = {};
	  this.renderOrder = [];
	  this.updateOrder = [];
	
	  this._preventEvent = false;
	};
	
	StateManager.prototype.add = function (name, state) {
	  this.states[name] = this._newStateHolder(name, state);
	  this.refreshOrder();
	  return state;
	};
	
	StateManager.prototype.enable = function (name) {
	  var holder = this.get(name);
	  if (holder) {
	    if (!holder.enabled) {
	      if (holder.state.enable) {
	        holder.state.enable();
	      }
	      holder.enabled = true;
	      holder.changed = true;
	
	      if (holder.paused) {
	        this.unpause(name);
	      }
	    }
	  }
	};
	
	StateManager.prototype.disable = function (name) {
	  var holder = this.get(name);
	  if (holder) {
	    if (holder.enabled) {
	      if (holder.state.disable) {
	        holder.state.disable();
	      }
	      holder.changed = true;
	      holder.enabled = false;
	    }
	  }
	};
	
	StateManager.prototype.hide = function (name) {
	  var holder = this.get(name);
	  if (holder) {
	    if (holder.enabled) {
	      holder.changed = true;
	      holder.render = false;
	    }
	  }
	};
	
	StateManager.prototype.show = function (name) {
	  var holder = this.get(name);
	  if (holder) {
	    if (holder.enabled) {
	      holder.changed = true;
	      holder.render = true;
	    }
	  }
	};
	
	StateManager.prototype.pause = function (name) {
	  var holder = this.get(name);
	  if (holder) {
	    if (holder.state.pause) {
	      holder.state.pause();
	    }
	
	    holder.changed = true;
	    holder.paused = true;
	  }
	};
	
	StateManager.prototype.unpause = function (name) {
	  var holder = this.get(name);
	  if (holder) {
	    if (holder.state.unpause) {
	      holder.state.unpause();
	    }
	
	    holder.changed = true;
	    holder.paused = false;
	  }
	};
	
	StateManager.prototype.protect = function (name) {
	  var holder = this.get(name);
	  if (holder) {
	    holder.protect = true;
	  }
	};
	
	StateManager.prototype.unprotect = function (name) {
	  var holder = this.get(name);
	  if (holder) {
	    holder.protect = false;
	  }
	};
	
	StateManager.prototype.refreshOrder = function () {
	  this.renderOrder.length = 0;
	  this.updateOrder.length = 0;
	
	  for (var name in this.states) {
	    var holder = this.states[name];
	    if (holder) {
	      this.renderOrder.push(holder);
	      this.updateOrder.push(holder);
	    }
	  }
	
	  this.renderOrder.sort(renderOrderSort);
	  this.updateOrder.sort(updateOrderSort);
	};
	
	StateManager.prototype._newStateHolder = function (name, state) {
	  var holder = {};
	  holder.name = name;
	  holder.state = state;
	
	  holder.protect = false;
	
	  holder.enabled = true;
	  holder.paused = false;
	
	  holder.render = true;
	
	  holder.initialized = false;
	  holder.updated = false;
	  holder.changed = true;
	
	  holder.updateOrder = 0;
	  holder.renderOrder = 0;
	
	  return holder;
	};
	
	StateManager.prototype.setUpdateOrder = function (name, order) {
	  var holder = this.get(name);
	  if (holder) {
	    holder.updateOrder = order;
	    this.refreshOrder();
	  }
	};
	
	StateManager.prototype.setRenderOrder = function (name, order) {
	  var holder = this.get(name);
	  if (holder) {
	    holder.renderOrder = order;
	    this.refreshOrder();
	  }
	};
	
	StateManager.prototype.destroy = function (name) {
	  var state = this.get(name);
	  if (state && !state.protect) {
	    if (state.state.close) {
	      state.state.close();
	    }
	    delete this.states[name];
	    this.refreshOrder();
	  }
	};
	
	StateManager.prototype.destroyAll = function () {
	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];
	    if (!state.protect) {
	      if (state.state.close) {
	        state.state.close();
	      }
	      delete this.states[state.name];
	    }
	  }
	
	  this.refreshOrder();
	};
	
	StateManager.prototype.get = function (name) {
	  return this.states[name];
	};
	
	StateManager.prototype.update = function (time) {
	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];
	
	    if (state) {
	      state.changed = false;
	
	      if (state.enabled) {
	        if (!state.initialized && state.state.init) {
	          state.initialized = true;
	          state.state.init();
	        }
	
	        if (state.state.update && !state.paused) {
	          state.state.update(time);
	          state.updated = true;
	        }
	      }
	    }
	  }
	};
	
	StateManager.prototype.exitUpdate = function (time) {
	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];
	
	    if (state && state.enabled && state.state.exitUpdate && !state.paused) {
	      state.state.exitUpdate(time);
	    }
	  }
	};
	
	StateManager.prototype.render = function () {
	  for (var i = 0, len = this.renderOrder.length; i < len; i++) {
	    var state = this.renderOrder[i];
	    if (state && state.enabled && (state.updated || !state.state.update) && state.render && state.state.render) {
	      state.state.render();
	    }
	  }
	};
	StateManager.prototype.mousemove = function (value) {
	  this._preventEvent = false;
	
	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];
	    if (state && state.enabled && !state.changed && state.state.mousemove && !state.paused) {
	      state.state.mousemove(value);
	    }
	
	    if (this._preventEvent) {
	      break;
	    }
	  }
	};
	
	StateManager.prototype.mouseup = function (value) {
	  this._preventEvent = false;
	
	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];
	    if (state && state.enabled && !state.changed && state.state.mouseup && !state.paused) {
	      state.state.mouseup(value);
	    }
	
	    if (this._preventEvent) {
	      break;
	    }
	  }
	};
	
	StateManager.prototype.mousedown = function (value) {
	  this._preventEvent = false;
	
	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];
	    if (state && state.enabled && !state.changed && state.state.mousedown && !state.paused) {
	      state.state.mousedown(value);
	    }
	
	    if (this._preventEvent) {
	      break;
	    }
	  }
	};
	
	StateManager.prototype.keyup = function (value) {
	  this._preventEvent = false;
	
	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];
	    if (state && state.enabled && !state.changed && state.state.keyup && !state.paused) {
	      state.state.keyup(value);
	    }
	
	    if (this._preventEvent) {
	      break;
	    }
	  }
	};
	
	StateManager.prototype.keydown = function (value) {
	  this._preventEvent = false;
	
	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];
	    if (state && state.enabled && !state.changed && state.state.keydown && !state.paused) {
	      state.state.keydown(value);
	    }
	
	    if (this._preventEvent) {
	      break;
	    }
	  }
	};
	
	module.exports = StateManager;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(12);
	var DirtyManager = __webpack_require__(11);
	
	var ObjectPool = [];
	
	var GetObjectFromPool = function() {
	  var result = ObjectPool.pop();
	
	  if (result) {
	    return result;
	  }
	
	  return {};
	};
	
	var indexToNumberAndLowerCaseKey = function(index) {
	  if (index <= 9) {
	    return 48 + index;
	  } else if (index === 10) {
	    return 48;
	  } else if (index > 10 && index <= 36) {
	    return 64 + (index-10);
	  } else {
	    return null;
	  }
	};
	
	var defaults = [
	  { name: 'Show FPS', entry: 'showFps', defaults: true },
	  { name: 'Show Key Codes', entry: 'showKeyCodes', defaults: true }
	];
	
	var Debugger = function(app) {
	  this.video = app.video.createLayer({
	    useRetina: true,
	    initializeCanvas: true
	  });
	
	  this.graph = app.video.createLayer({
	    useRetina: false,
	    initializeCanvas: true
	  });
	
	  this._graphHeight = 100;
	  this._60fpsMark = this._graphHeight * 0.8;
	  this._msToPx = this._60fpsMark/16.66;
	
	  this.app = app;
	
	  this.options = defaults;
	  this._maxLogsCounts = 10;
	
	  for (var i=0; i<this.options.length; i++) {
	    var option = this.options[i];
	    this._initOption(option);
	  }
	
	  this.disabled = false;
	
	  this.fps = 0;
	  this.fpsCount = 0;
	  this.fpsElapsedTime = 0;
	  this.fpsUpdateInterval = 0.5;
	  this._framePerf = [];
	
	  this._fontSize = 0;
	  this._dirtyManager = new DirtyManager(this.video.canvas, this.video.ctx);
	
	  this.logs = [];
	
	  this._perfValues = {};
	  this._perfNames = [];
	
	  this.showDebug = false;
	  this.enableDebugKeys = true;
	  this.enableShortcuts = false;
	
	  this.enableShortcutsKey = 220;
	
	  this.lastKey = null;
	
	  this._load();
	
	  this.keyShortcuts = [
	    { key: 123, entry: 'showDebug', type: 'toggle' }
	  ];
	
	
	  var self = this;
	  this.addConfig({ name: 'Show Performance Graph', entry: 'showGraph', defaults: false, call: function() { self.graph.clear(); } });
	
	  this._diff = 0;
	  this._frameStart = 0;
	};
	
	Debugger.prototype.begin = function() {
	  if (this.showDebug) {
	    this._frameStart = window.performance.now();
	  }
	};
	
	Debugger.prototype.end = function() {
	  if (this.showDebug) {
	    this._diff = window.performance.now() - this._frameStart;
	  }
	};
	
	Debugger.prototype._setFont = function(px, font) {
	  this._fontSize = px;
	  this.video.ctx.font = px + 'px ' + font;
	};
	
	Debugger.prototype.resize = function() {
	  this.video.setSize(this.app.width, this.app.height);
	};
	
	Debugger.prototype.addConfig = function(option) {
	  this.options.push(option);
	  this._initOption(option);
	};
	
	Debugger.prototype._initOption = function(option) {
	  option.type = option.type || 'toggle';
	  option.defaults = option.defaults == null ? false : option.defaults;
	
	  if (option.type === 'toggle') {
	    this[option.entry] = option.defaults;
	  }
	};
	
	Debugger.prototype.clear = function() {
	  this.logs.length = 0;
	};
	
	Debugger.prototype.log = function(message, color) {
	  color = color || 'white';
	  message = typeof message === 'string' ? message : util.inspect(message);
	
	  var messages = message.replace(/\\'/g, "'").split('\n');
	
	  for (var i=0; i<messages.length; i++) {
	    var msg = messages[i];
	    if (this.logs.length >= this._maxLogsCounts) {
	      ObjectPool.push(this.logs.shift());
	    }
	
	    var messageObject = GetObjectFromPool();
	    messageObject.text = msg;
	    messageObject.life = 10;
	    messageObject.color = color;
	
	    this.logs.push(messageObject);
	  }
	};
	
	Debugger.prototype.update = function() {};
	
	Debugger.prototype.exitUpdate = function(time) {
	  if (this.disabled) { return; }
	
	  if (this.showDebug) {
	    this._maxLogsCounts = Math.ceil((this.app.height + 20)/20);
	    this.fpsCount += 1;
	    this.fpsElapsedTime += time;
	
	    if (this.fpsElapsedTime > this.fpsUpdateInterval) {
	      var fps = this.fpsCount/this.fpsElapsedTime;
	
	      if (this.showFps) {
	        this.fps = this.fps * (1-0.8) + 0.8 * fps;
	      }
	
	      this.fpsCount = 0;
	      this.fpsElapsedTime = 0;
	    }
	
	    for (var i=0, len=this.logs.length; i<len; i++) {
	      var log = this.logs[i];
	      if (log) {
	        log.life -= time;
	        if (log.life <= 0) {
	          var index = this.logs.indexOf(log);
	          if (index > -1) { this.logs.splice(index, 1); }
	        }
	      }
	    }
	  }
	};
	
	Debugger.prototype.keydown = function(value) {
	  if (this.disabled) { return; }
	
	  this.lastKey = value.key;
	
	  var i;
	
	  if (this.enableDebugKeys) {
	    if (value.key === this.enableShortcutsKey) {
	      value.event.preventDefault();
	
	      this.enableShortcuts = !this.enableShortcuts;
	      return true;
	    }
	
	    if (this.enableShortcuts) {
	      for (i=0; i<this.options.length; i++) {
	        var option = this.options[i];
	        var keyIndex = i + 1;
	
	        if (this.app.input.isKeyDown('ctrl')) {
	          keyIndex -= 36;
	        }
	
	        var charId = indexToNumberAndLowerCaseKey(keyIndex);
	
	        if (charId && value.key === charId) {
	          value.event.preventDefault();
	
	          if (option.type === 'toggle') {
	
	            this[option.entry] = !this[option.entry];
	            if (option.call) {
	              option.call();
	            }
	
	            this._save();
	          } else if (option.type === 'call') {
	            option.entry();
	          }
	
	          return true;
	        }
	      }
	    }
	  }
	
	  for (i=0; i<this.keyShortcuts.length; i++) {
	    var keyShortcut = this.keyShortcuts[i];
	    if (keyShortcut.key === value.key) {
	      value.event.preventDefault();
	
	      if (keyShortcut.type === 'toggle') {
	        this[keyShortcut.entry] = !this[keyShortcut.entry];
	        this._save();
	      } else if (keyShortcut.type === 'call') {
	        this[keyShortcut.entry]();
	      }
	
	      return true;
	    }
	  }
	
	  return false;
	};
	
	Debugger.prototype._save = function() {
	  var data = {
	    showDebug: this.showDebug,
	    options: {}
	  };
	
	  for (var i=0; i<this.options.length; i++) {
	    var option = this.options[i];
	    var value = this[option.entry];
	    data.options[option.entry] = value;
	  }
	
	  window.localStorage.__potionDebug = JSON.stringify(data);
	};
	
	Debugger.prototype._load = function() {
	  if (window.localStorage && window.localStorage.__potionDebug) {
	    var data = JSON.parse(window.localStorage.__potionDebug);
	    this.showDebug = data.showDebug;
	
	    for (var name in data.options) {
	      this[name] = data.options[name];
	    }
	  }
	};
	
	Debugger.prototype.render = function() {
	  if (this.disabled) { return; }
	
	  this._dirtyManager.clear();
	
	  if (this.showDebug) {
	    this.video.ctx.save();
	    this._setFont(15, 'sans-serif');
	
	    this._renderLogs();
	    this._renderData();
	    this._renderShortcuts();
	
	    this.video.ctx.restore();
	
	    if (this.showGraph) {
	      this.graph.ctx.drawImage(this.graph.canvas, 0, this.app.height - this._graphHeight, this.app.width, this._graphHeight, -2, this.app.height - this._graphHeight, this.app.width, this._graphHeight);
	
	      this.graph.ctx.fillStyle = '#F2F0D8';
	      this.graph.ctx.fillRect(this.app.width - 2, this.app.height - this._graphHeight, 2, this._graphHeight);
	
	      this.graph.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	      this.graph.ctx.fillRect(this.app.width - 2, this.app.height - this._60fpsMark, 2, 1);
	
	      var last = 0;
	      for (var i=0; i<this._framePerf.length; i++) {
	        var item = this._framePerf[i];
	        var name = this._perfNames[i];
	
	        this._drawFrameLine(item, name, last);
	
	        last += item;
	      }
	
	      this._drawFrameLine(this._diff - last, 'lag', last);
	      this._framePerf.length = 0;
	    }
	  }
	};
	
	Debugger.prototype._drawFrameLine = function(value, name, last) {
	  var background = 'black';
	  if (name === 'update') {
	    background = '#6BA5F2';
	  } else if (name === 'render') {
	    background = '#F27830';
	  } else if (name === 'lag') {
	    background = '#91f682';
	  }
	  this.graph.ctx.fillStyle = background;
	
	  var height = (value + last) * this._msToPx
	
	  var x = this.app.width - 2;
	  var y = this.app.height - height;
	
	  this.graph.ctx.fillRect(x, y, 2, height - (last * this._msToPx));
	};
	
	Debugger.prototype._renderLogs = function() {
	  this.video.ctx.textAlign = 'left';
	  this.video.ctx.textBaseline = 'bottom';
	
	  for (var i=0, len=this.logs.length; i<len; i++) {
	    var log = this.logs[i];
	
	    var y = -10 + this.app.height + (i - this.logs.length + 1) * 20;
	    this._renderText(log.text, 10, y, log.color);
	  }
	};
	
	Debugger.prototype.disable = function() {
	  this.disabled = true;
	};
	
	Debugger.prototype.perf = function(name) {
	  if (!this.showDebug) { return; }
	
	  var exists = this._perfValues[name];
	
	  if (exists == null) {
	    this._perfNames.push(name);
	
	    this._perfValues[name] = {
	      name: name,
	      value: 0,
	      records: []
	    };
	  }
	
	  var time = window.performance.now();
	
	  var record = this._perfValues[name];
	
	  record.value = time;
	};
	
	Debugger.prototype.stopPerf = function(name) {
	  if (!this.showDebug) { return; }
	
	  var record = this._perfValues[name];
	
	  var time = window.performance.now();
	  var diff = time - record.value;
	
	  record.records.push(diff);
	  if (record.records.length > 10) {
	    record.records.shift();
	  }
	
	  var sum = 0;
	  for (var i=0; i<record.records.length; i++) {
	    sum += record.records[i];
	  }
	
	  var avg = sum/record.records.length;
	
	  record.value = avg;
	  this._framePerf.push(diff);
	};
	
	Debugger.prototype._renderData = function() {
	  this.video.ctx.textAlign = 'right';
	  this.video.ctx.textBaseline = 'top';
	
	  var x = this.app.width - 14;
	  var y = 14;
	
	  if (this.showFps) {
	    this._renderText(Math.round(this.fps) + ' fps', x, y);
	  }
	
	  y += 24;
	
	  this._setFont(15, 'sans-serif');
	
	  if (this.showKeyCodes) {
	    var buttonName = '';
	    if (this.app.input.mouse.isLeftDown) {
	      buttonName = 'left';
	    } else if (this.app.input.mouse.isRightDown) {
	      buttonName = 'right';
	    } else if (this.app.input.mouse.isMiddleDown) {
	      buttonName = 'middle';
	    }
	
	    this._renderText('key ' + this.lastKey, x, y, this.app.input.isKeyDown(this.lastKey) ? '#e9dc7c' : 'white');
	    this._renderText('btn ' + buttonName, x - 60, y, this.app.input.mouse.isDown ? '#e9dc7c' : 'white');
	
	    for (var i=0; i<this._perfNames.length; i++) {
	      var name = this._perfNames[i];
	      var value = this._perfValues[name];
	
	      y += 24;
	      this._renderText(name + ': ' +  value.value.toFixed(3) + 'ms', x, y);
	    }
	  }
	};
	
	
	Debugger.prototype._renderShortcuts = function() {
	  if (this.enableShortcuts) {
	    var height = 28;
	
	    this._setFont(20, 'Helvetica Neue, sans-serif');
	    this.video.ctx.textAlign = 'left';
	    this.video.ctx.textBaseline = 'top';
	    var maxPerCollumn = Math.floor((this.app.height - 14)/height);
	
	    for (var i=0; i<this.options.length; i++) {
	      var option = this.options[i];
	      var x = 14 + Math.floor(i/maxPerCollumn) * 320;
	      var y = 14 + i%maxPerCollumn * height;
	
	      var keyIndex = i + 1;
	      var charId = indexToNumberAndLowerCaseKey(keyIndex);
	
	      var isOn = this[option.entry];
	
	      var shortcut = String.fromCharCode(charId);
	
	      if (!charId) {
	        shortcut = '^+' + String.fromCharCode(indexToNumberAndLowerCaseKey(keyIndex - 36));
	      }
	
	      var text = '[' + shortcut + '] ' + option.name;
	      if (option.type === 'toggle') {
	        text += ' (' + (isOn ? 'ON' : 'OFF') + ')';
	      } else if (option.type === 'call') {
	        text += ' (CALL)';
	      }
	
	      var color = 'rgba(255, 255, 255, 1)';
	      var outline = 'rgba(0, 0, 0, 1)';
	
	      if (!isOn) {
	        color = 'rgba(255, 255, 255, .7)';
	        outline = 'rgba(0, 0, 0, .7)';
	      }
	
	      this._renderText(text, x, y, color, outline);
	    }
	  }
	};
	
	Debugger.prototype._renderText = function(text, x, y, color, outline) {
	  color = color || 'white';
	  outline = outline || 'black';
	  this.video.ctx.fillStyle = color;
	  this.video.ctx.lineJoin = 'round';
	  this.video.ctx.strokeStyle = outline;
	  this.video.ctx.lineWidth = 3;
	  this.video.ctx.strokeText(text, x, y);
	  this.video.ctx.fillText(text, x, y);
	
	  var width = this.video.ctx.measureText(text).width;
	
	  var dx = x - 5;
	  var dy = y;
	  var dwidth = width + 10;
	  var dheight = this._fontSize + 10;
	
	  if (this.video.ctx.textAlign === 'right') {
	    dx = x - 5 - width;
	  }
	
	  this._dirtyManager.addRect(dx, dy, dwidth, dheight);
	};
	
	module.exports = Debugger;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var isRetina = __webpack_require__(13)();
	
	/**
	 * @constructor
	 * @param {HTMLCanvasElement} canvas - Canvas DOM element
	 */
	var Video = function Video(game, canvas, config) {
	  this.game = game;
	
	  this.config = config;
	
	  this.canvas = canvas;
	
	  this.width = game.width;
	
	  this.height = game.height;
	
	  if (config.initializeCanvas) {
	    this.ctx = canvas.getContext("2d");
	  }
	
	  this._applySizeToCanvas();
	};
	
	/**
	 * Includes mixins into Video library
	 * @param {object} methods - object of methods that will included in Video
	 */
	Video.prototype.include = function (methods) {
	  for (var method in methods) {
	    this[method] = methods[method];
	  }
	};
	
	Video.prototype.beginFrame = function () {};
	
	Video.prototype.endFrame = function () {};
	
	Video.prototype.scaleCanvas = function (scale) {
	  this.canvas.style.width = this.canvas.width + "px";
	  this.canvas.style.height = this.canvas.height + "px";
	
	  this.canvas.width *= scale;
	  this.canvas.height *= scale;
	
	  if (this.ctx) {
	    this.ctx.scale(scale, scale);
	  }
	};
	
	Video.prototype.setSize = function (width, height) {
	  this.width = width;
	  this.height = height;
	
	  this._applySizeToCanvas();
	};
	
	Video.prototype._applySizeToCanvas = function () {
	  this.canvas.width = this.width;
	  this.canvas.height = this.height;
	
	  var container = this.canvas.parentElement;
	  container.style.width = this.width + "px";
	  container.style.height = this.height + "px";
	
	  if (this.config.useRetina && isRetina) {
	    this.scaleCanvas(2);
	  }
	};
	
	Video.prototype.clear = function () {
	  if (this.ctx) {
	    this.ctx.clearRect(0, 0, this.width, this.height);
	  }
	};
	
	Video.prototype.createLayer = function (config) {
	  config = config || {};
	
	  var container = this.canvas.parentElement;
	  var canvas = document.createElement("canvas");
	  canvas.width = this.width;
	  canvas.height = this.height;
	  canvas.style.position = "absolute";
	  canvas.style.top = "0px";
	  canvas.style.left = "0px";
	  container.appendChild(canvas);
	
	  var video = new Video(this.game, canvas, config);
	
	  return video;
	};
	
	module.exports = Video;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";
	
	var util = __webpack_require__(12);
	var path = __webpack_require__(18);
	
	var PotionAudio = __webpack_require__(19);
	
	var JsonLoader = __webpack_require__(14);
	var imageLoader = __webpack_require__(15);
	var textLoader = __webpack_require__(16);
	
	/**
	 * Class for managing and loading asset files
	 * @constructor
	 */
	var Assets = function Assets() {
	  /**
	   * Is currently loading any assets
	   * @type {boolean}
	   */
	  this.isLoading = false;
	
	  this.itemsCount = 0;
	  this.loadedItemsCount = 0;
	  this.progress = 0;
	
	  this._thingsToLoad = 0;
	  this._data = {};
	  this._preloading = true;
	
	  this._callback = null;
	
	  this._toLoad = [];
	
	  this._loaders = {};
	
	  this.audio = new PotionAudio();
	
	  this.addLoader("json", JsonLoader);
	
	  this.addLoader("mp3", this.audio.load.bind(this.audio));
	  this.addLoader("music", this.audio.load.bind(this.audio));
	  this.addLoader("sound", this.audio.load.bind(this.audio));
	
	  this.addLoader("image", imageLoader);
	  this.addLoader("texture", imageLoader);
	  this.addLoader("sprite", imageLoader);
	};
	
	Assets.prototype.addLoader = function (name, fn) {
	  this._loaders[name] = fn;
	};
	
	/**
	 * Starts loading stored assets urls and runs given callback after everything is loaded
	 * @param {function} callback - callback function
	 */
	Assets.prototype.onload = function (callback) {
	  this._callback = callback;
	
	  if (this._thingsToLoad === 0) {
	    this.isLoading = false;
	    this._preloading = false;
	    process.nextTick(function () {
	      callback();
	    });
	  } else {
	    this._nextFile();
	  }
	};
	
	/**
	 * Getter for loaded assets
	 * @param {string} name - url of stored asset
	 */
	Assets.prototype.get = function (name) {
	  return this._data[path.normalize(name)];
	};
	
	Assets.prototype.remove = function (name) {
	  this.set(name, null);
	};
	
	/**
	 * Used for storing some value in assets module
	 * useful for overrating values
	 * @param {string} name - url of the asset
	 * @param {any} value - value to be stored
	 */
	Assets.prototype.set = function (name, value) {
	  this._data[path.normalize(name)] = value;
	};
	
	/**
	 * Stores url so it can be loaded later
	 * @param {string} type - type of asset
	 * @param {string} url - url of given asset
	 * @param {function} callback - callback function
	 */
	Assets.prototype.load = function (type, url, callback) {
	  var loadObject = { type: type, url: url != null ? path.normalize(url) : null, callback: callback };
	
	  if (this._preloading) {
	    this.isLoading = true;
	    this.itemsCount += 1;
	    this._thingsToLoad += 1;
	
	    this._toLoad.push(loadObject);
	  } else {
	    var self = this;
	    this._loadAssetFile(loadObject, function (data) {
	      self.set(loadObject.url, data);
	      if (callback) {
	        callback(data);
	      }
	    });
	  }
	};
	
	Assets.prototype._finishedOneFile = function () {
	  this._nextFile();
	  this.progress = this.loadedItemsCount / this.itemsCount;
	  this._thingsToLoad -= 1;
	  this.loadedItemsCount += 1;
	
	  if (this._thingsToLoad === 0) {
	    var self = this;
	    setTimeout(function () {
	      self._callback();
	      self._preloading = false;
	      self.isLoading = false;
	    }, 0);
	  }
	};
	
	Assets.prototype._error = function (url) {
	  console.warn("Error loading \"" + url + "\" asset");
	  this._nextFile();
	};
	
	Assets.prototype._save = function (url, data, callback) {
	  this.set(url, data);
	  if (callback) {
	    callback(data);
	  }
	  this._finishedOneFile();
	};
	
	Assets.prototype._handleCustomLoading = function (loading) {
	  var self = this;
	  var done = function done(name, value) {
	    self._save(name, value);
	  };
	  loading(done);
	};
	
	Assets.prototype._nextFile = function () {
	  var current = this._toLoad.shift();
	
	  if (!current) {
	    return;
	  }
	
	  var self = this;
	  this._loadAssetFile(current, function (data) {
	    self._save(current.url, data, current.callback);
	  });
	};
	
	Assets.prototype._loadAssetFile = function (file, callback) {
	  var type = file.type;
	  var url = file.url;
	
	  if (util.isFunction(type)) {
	    this._handleCustomLoading(type);
	    return;
	  }
	
	  type = type.toLowerCase();
	
	  var loader = this._loaders[type] || textLoader;
	  loader(url, callback, this._error.bind(this));
	};
	
	module.exports = Assets;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20)))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var keys = __webpack_require__(17);
	
	var invKeys = {};
	for (var keyName in keys) {
	  invKeys[keys[keyName]] = keyName;
	}
	
	var Input = function Input(game, container) {
	  this._container = container;
	  this._keys = {};
	
	  this.canControlKeys = true;
	
	  this.mouse = {
	    isDown: false,
	    isLeftDown: false,
	    isMiddleDown: false,
	    isRightDown: false,
	    x: null,
	    y: null
	  };
	
	  this._addEvents(game);
	};
	
	Input.prototype.resetKeys = function () {
	  this._keys = {};
	};
	
	Input.prototype.isKeyDown = function (key) {
	  if (key == null) {
	    return false;
	  }
	
	  if (this.canControlKeys) {
	    var code = typeof key === "number" ? key : keys[key.toLowerCase()];
	    return this._keys[code];
	  }
	};
	
	Input.prototype._addEvents = function (game) {
	  var self = this;
	
	  var mouseEvent = {
	    x: null,
	    y: null,
	    button: null,
	    event: null,
	    statePreventDefault: function statePreventDefault() {
	      game.states._preventEvent = true;
	    }
	  };
	
	  var keyboardEvent = {
	    key: null,
	    name: null,
	    event: null,
	    statePreventDefault: function statePreventDefault() {
	      game.states._preventEvent = true;
	    }
	  };
	
	  self._container.addEventListener("mousemove", function (e) {
	    var x = e.offsetX === undefined ? e.layerX - self._container.offsetLeft : e.offsetX;
	    var y = e.offsetY === undefined ? e.layerY - self._container.offsetTop : e.offsetY;
	
	    self.mouse.x = x;
	    self.mouse.y = y;
	
	    mouseEvent.x = x;
	    mouseEvent.y = y;
	    mouseEvent.button = null;
	    mouseEvent.event = e;
	
	    game.states.mousemove(mouseEvent);
	  });
	
	  self._container.addEventListener("mouseup", function (e) {
	    e.preventDefault();
	
	    var x = e.offsetX === undefined ? e.layerX - self._container.offsetLeft : e.offsetX;
	    var y = e.offsetY === undefined ? e.layerY - self._container.offsetTop : e.offsetY;
	
	    self.mouse.isDown = false;
	
	    switch (e.button) {
	      case 0:
	        self.mouse.isLeftDown = false;
	        break;
	      case 1:
	        self.mouse.isMiddleDown = false;
	        break;
	      case 2:
	        self.mouse.isRightDown = false;
	        break;
	    }
	
	    mouseEvent.x = x;
	    mouseEvent.y = y;
	    mouseEvent.button = e.button;
	    mouseEvent.event = e;
	
	    game.states.mouseup(mouseEvent);
	  }, false);
	
	  self._container.addEventListener("mousedown", function (e) {
	    e.preventDefault();
	
	    var x = e.offsetX === undefined ? e.layerX - self._container.offsetLeft : e.offsetX;
	    var y = e.offsetY === undefined ? e.layerY - self._container.offsetTop : e.offsetY;
	
	    self.mouse.x = x;
	    self.mouse.y = y;
	    self.mouse.isDown = true;
	
	    switch (e.button) {
	      case 0:
	        self.mouse.isLeftDown = true;
	        break;
	      case 1:
	        self.mouse.isMiddleDown = true;
	        break;
	      case 2:
	        self.mouse.isRightDown = true;
	        break;
	    }
	
	    mouseEvent.x = x;
	    mouseEvent.y = y;
	    mouseEvent.button = e.button;
	    mouseEvent.event = e;
	
	    game.states.mousedown(mouseEvent);
	  }, false);
	
	  self._container.addEventListener("touchstart", function (e) {
	    e.preventDefault();
	
	    for (var i = 0; i < e.touches.length; i++) {
	      var touch = e.touches[i];
	
	      var x = touch.pageX - self._container.offsetLeft;
	      var y = touch.pageY - self._container.offsetTop;
	
	      self.mouse.x = x;
	      self.mouse.y = y;
	      self.mouse.isDown = true;
	      self.mouse.isLeftDown = true;
	
	      mouseEvent.x = x;
	      mouseEvent.y = y;
	      mouseEvent.button = 1;
	      mouseEvent.event = e;
	
	      game.states.mousedown(e);
	    }
	  });
	
	  self._container.addEventListener("touchmove", function (e) {
	    e.preventDefault();
	
	    for (var i = 0; i < e.touches.length; i++) {
	      var touch = e.touches[i];
	
	      var x = touch.pageX - self._container.offsetLeft;
	      var y = touch.pageY - self._container.offsetTop;
	
	      self.mouse.x = x;
	      self.mouse.y = y;
	      self.mouse.isDown = true;
	      self.mouse.isLeftDown = true;
	
	      mouseEvent.x = x;
	      mouseEvent.y = y;
	      mouseEvent.event = e;
	
	      game.states.mousemove(e);
	    }
	  });
	
	  self._container.addEventListener("touchend", function (e) {
	    e.preventDefault();
	
	    var touch = e.changedTouches[0];
	
	    var x = touch.pageX - self._container.offsetLeft;
	    var y = touch.pageY - self._container.offsetTop;
	
	    self.mouse.x = x;
	    self.mouse.y = y;
	    self.mouse.isDown = false;
	    self.mouse.isLeftDown = false;
	
	    mouseEvent.x = x;
	    mouseEvent.y = y;
	    mouseEvent.event = e;
	
	    game.states.mouseup(e);
	  });
	
	  self._container.addEventListener("contextmenu", function (e) {
	    e.preventDefault();
	  });
	
	  document.addEventListener("keydown", function (e) {
	    self._keys[e.keyCode] = true;
	
	    keyboardEvent.key = e.which;
	    keyboardEvent.name = invKeys[e.which];
	    keyboardEvent.event = e;
	
	    game.states.keydown(keyboardEvent);
	  });
	
	  document.addEventListener("keyup", function (e) {
	    self._keys[e.keyCode] = false;
	
	    keyboardEvent.key = e.which;
	    keyboardEvent.name = invKeys[e.which];
	    keyboardEvent.event = e;
	
	    game.states.keyup(keyboardEvent);
	  });
	};
	
	module.exports = Input;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var DirtyManager = function(canvas, ctx) {
	  this.ctx = ctx;
	  this.canvas = canvas;
	
	  this.top = canvas.height;
	  this.left = canvas.width;
	  this.bottom = 0;
	  this.right = 0;
	
	  this.isDirty = false;
	};
	
	DirtyManager.prototype.addRect = function(left, top, width, height) {
	  var right  = left + width;
	  var bottom = top + height;
	
	  this.top    = top < this.top       ? top    : this.top;
	  this.left   = left < this.left     ? left   : this.left;
	  this.bottom = bottom > this.bottom ? bottom : this.bottom;
	  this.right  = right > this.right   ? right  : this.right;
	
	  this.isDirty = true;
	};
	
	DirtyManager.prototype.clear = function() {
	  if (!this.isDirty) { return; }
	
	  this.ctx.clearRect(this.left,
	                     this.top,
	                     this.right - this.left,
	                     this.bottom - this.top);
	
	  this.left = this.canvas.width;
	  this.top = this.canvas.height;
	  this.right = 0;
	  this.bottom = 0;
	
	  this.isDirty = false;
	};
	
	module.exports = DirtyManager;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }
	
	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};
	
	
	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }
	
	  if (process.noDeprecation === true) {
	    return fn;
	  }
	
	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }
	
	  return deprecated;
	};
	
	
	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};
	
	
	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;
	
	
	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};
	
	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};
	
	
	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];
	
	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}
	
	
	function stylizeNoColor(str, styleType) {
	  return str;
	}
	
	
	function arrayToHash(array) {
	  var hash = {};
	
	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });
	
	  return hash;
	}
	
	
	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }
	
	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }
	
	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);
	
	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }
	
	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }
	
	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }
	
	  var base = '', array = false, braces = ['{', '}'];
	
	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }
	
	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }
	
	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }
	
	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }
	
	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }
	
	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }
	
	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }
	
	  ctx.seen.push(value);
	
	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }
	
	  ctx.seen.pop();
	
	  return reduceToSingleString(output, base, braces);
	}
	
	
	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}
	
	
	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}
	
	
	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}
	
	
	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }
	
	  return name + ': ' + str;
	}
	
	
	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);
	
	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }
	
	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}
	
	
	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;
	
	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;
	
	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;
	
	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;
	
	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;
	
	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;
	
	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;
	
	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;
	
	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;
	
	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;
	
	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;
	
	exports.isBuffer = __webpack_require__(21);
	
	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}
	
	
	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}
	
	
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];
	
	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}
	
	
	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};
	
	
	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(23);
	
	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;
	
	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};
	
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(20)))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var isRetina = function isRetina() {
	  var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),  (min--moz-device-pixel-ratio: 1.5),  (-o-min-device-pixel-ratio: 3/2),  (min-resolution: 1.5dppx)";
	
	  if (window.devicePixelRatio > 1) {
	    return true;
	  }if (window.matchMedia && window.matchMedia(mediaQuery).matches) {
	    return true;
	  }return false;
	};
	
	module.exports = isRetina;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = function (url, callback, error) {
	  var request = new XMLHttpRequest();
	
	  request.open("GET", url, true);
	  request.responseType = "text";
	  request.onload = function () {
	    if (request.status !== 200) {
	      return error(url);
	    }
	
	    var data = JSON.parse(this.response);
	    callback(data);
	  };
	  request.send();
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = function (url, callback, error) {
	  var image = new Image();
	  image.onload = function () {
	    callback(image);
	  };
	  image.onerror = function () {
	    error(url);
	  };
	  image.src = url;
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = function (url, callback, error) {
	  var request = new XMLHttpRequest();
	
	  request.open("GET", url, true);
	  request.responseType = "text";
	  request.onload = function () {
	    if (request.status !== 200) {
	      return error(url);
	    }
	
	    var data = this.response;
	    callback(data);
	  };
	  request.send();
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = {
	  backspace: 8,
	  tab: 9,
	  enter: 13,
	  pause: 19,
	  caps: 20,
	  esc: 27,
	  space: 32,
	  page_up: 33,
	  page_down: 34,
	  end: 35,
	  home: 36,
	  left: 37,
	  up: 38,
	  right: 39,
	  down: 40,
	  insert: 45,
	  "delete": 46,
	  "0": 48,
	  "1": 49,
	  "2": 50,
	  "3": 51,
	  "4": 52,
	  "5": 53,
	  "6": 54,
	  "7": 55,
	  "8": 56,
	  "9": 57,
	  a: 65,
	  b: 66,
	  c: 67,
	  d: 68,
	  e: 69,
	  f: 70,
	  g: 71,
	  h: 72,
	  i: 73,
	  j: 74,
	  k: 75,
	  l: 76,
	  m: 77,
	  n: 78,
	  o: 79,
	  p: 80,
	  q: 81,
	  r: 82,
	  s: 83,
	  t: 84,
	  u: 85,
	  v: 86,
	  w: 87,
	  x: 88,
	  y: 89,
	  z: 90,
	  numpad_0: 96,
	  numpad_1: 97,
	  numpad_2: 98,
	  numpad_3: 99,
	  numpad_4: 100,
	  numpad_5: 101,
	  numpad_6: 102,
	  numpad_7: 103,
	  numpad_8: 104,
	  numpad_9: 105,
	  multiply: 106,
	  add: 107,
	  substract: 109,
	  decimal: 110,
	  divide: 111,
	  f1: 112,
	  f2: 113,
	  f3: 114,
	  f4: 115,
	  f5: 116,
	  f6: 117,
	  f7: 118,
	  f8: 119,
	  f9: 120,
	  f10: 121,
	  f11: 122,
	  f12: 123,
	  shift: 16,
	  ctrl: 17,
	  alt: 18,
	  plus: 187,
	  comma: 188,
	  minus: 189,
	  period: 190
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }
	
	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }
	
	  return parts;
	}
	
	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};
	
	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;
	
	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();
	
	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }
	
	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }
	
	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)
	
	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');
	
	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};
	
	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';
	
	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');
	
	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }
	
	  return (isAbsolute ? '/' : '') + path;
	};
	
	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};
	
	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};
	
	
	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);
	
	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }
	
	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }
	
	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }
	
	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));
	
	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }
	
	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }
	
	  outputParts = outputParts.concat(toParts.slice(samePartsLength));
	
	  return outputParts.join('/');
	};
	
	exports.sep = '/';
	exports.delimiter = ':';
	
	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];
	
	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }
	
	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }
	
	  return root + dir;
	};
	
	
	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};
	
	
	exports.extname = function(path) {
	  return splitPath(path)[3];
	};
	
	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}
	
	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20)))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(22);


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    draining = true;
	    var currentQueue;
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        var i = -1;
	        while (++i < len) {
	            currentQueue[i]();
	        }
	        len = queue.length;
	    }
	    draining = false;
	}
	process.nextTick = function (fun) {
	    queue.push(fun);
	    if (!draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var LoadedAudio = __webpack_require__(24);
	
	var AudioManager = function() {
	  var AudioContext = window.AudioContext || window.webkitAudioContext;
	
	  this.ctx = new AudioContext();
	  this.masterGain = this.ctx.createGain();
	  this._volume = 1;
	
	  var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
	  if (iOS) {
	    this._enableiOS();
	  }
	};
	
	AudioManager.prototype._enableiOS = function() {
	  var self = this;
	
	  var touch = function() {
	    var buffer = self.ctx.createBuffer(1, 1, 22050);
	    var source = self.ctx.createBufferSource();
	    source.buffer = buffer;
	    source.connect(self.ctx.destination);
	    source.start(0);
	
	    window.removeEventListener('touchstart', touch, false);
	  };
	
	  window.addEventListener('touchstart', touch, false);
	};
	
	AudioManager.prototype.setVolume = function(volume) {
	  this._volume = volume;
	  this.masterGain.gain.value = volume;
	};
	
	AudioManager.prototype.load = function(url, callback) {
	  var self = this;
	
	  var request = new XMLHttpRequest();
	  request.open('GET', url, true);
	  request.responseType = 'arraybuffer';
	  request.onload = function() {
	    self.decodeAudioData(request.response, function(source) {
	      callback(source);
	    });
	  };
	  request.send();
	};
	
	AudioManager.prototype.decodeAudioData = function(data, callback) {
	  var self = this;
	
	  this.ctx.decodeAudioData(data, function(result) {
	    var audio = new LoadedAudio(self.ctx, result, self.masterGain);
	
	    callback(audio);
	  });
	};
	
	module.exports = AudioManager;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var PlayingAudio = __webpack_require__(25);
	
	var LoadedAudio = function(ctx, buffer, masterGain) {
	  this._ctx = ctx;
	  this._masterGain = masterGain;
	  this._buffer = buffer;
	  this._buffer.loop = false;
	};
	
	LoadedAudio.prototype._createSound = function(gain) {
	  var source = this._ctx.createBufferSource();
	  source.buffer = this._buffer;
	
	  this._masterGain.connect(this._ctx.destination);
	
	  gain.connect(this._masterGain);
	
	  source.connect(gain);
	
	  return source;
	};
	
	LoadedAudio.prototype.play = function() {
	  var gain = this._ctx.createGain();
	
	  var sound = this._createSound(gain);
	
	  sound.start(0);
	
	  return new PlayingAudio(sound, gain);
	};
	
	LoadedAudio.prototype.fadeIn = function(value, time) {
	  var gain = this._ctx.createGain();
	
	  var sound = this._createSound(gain);
	
	  gain.gain.setValueAtTime(0, 0);
	  gain.gain.linearRampToValueAtTime(0.01, 0);
	  gain.gain.linearRampToValueAtTime(value, time);
	
	  sound.start(0);
	
	  return new PlayingAudio(sound, gain);
	};
	
	LoadedAudio.prototype.loop = function() {
	  var gain = this._ctx.createGain();
	
	  var sound = this._createSound(gain);
	
	  sound.loop = true;
	  sound.start(0);
	
	  return new PlayingAudio(sound, gain);
	};
	
	module.exports = LoadedAudio;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var PlayingAudio = function(source, gain) {
	  this._gain = gain;
	  this._source = source;
	};
	
	PlayingAudio.prototype.setVolume = function(volume) {
	  this._gain.gain.value = volume;
	};
	
	PlayingAudio.prototype.stop = function() {
	  this._source.stop(0);
	};
	
	module.exports = PlayingAudio;


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOGUwMDRkNmNjZTY2OTRjM2UwZDUiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VuZ2luZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmFmLXBvbHlmaWxsLmpzIiwid2VicGFjazovLy8uL3NyYy9nYW1lLmpzIiwid2VicGFjazovLy8uL3NyYy90aW1lLmpzIiwid2VicGFjazovLy8uL3NyYy9zdGF0ZS1tYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL34vcG90aW9uLWRlYnVnZ2VyL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy92aWRlby5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzLmpzIiwid2VicGFjazovLy8uL3NyYy9pbnB1dC5qcyIsIndlYnBhY2s6Ly8vLi9+L3BvdGlvbi1kZWJ1Z2dlci9kaXJ0eS1tYW5hZ2VyLmpzIiwid2VicGFjazovLy8od2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3V0aWwvdXRpbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmV0aW5hLmpzIiwid2VicGFjazovLy8uL3NyYy9sb2FkZXIvanNvbi1sb2FkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xvYWRlci9pbWFnZS1sb2FkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xvYWRlci90ZXh0LWxvYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMva2V5cy5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9wYXRoLWJyb3dzZXJpZnkvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9wb3Rpb24tYXVkaW8vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8od2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wb3Rpb24tYXVkaW8vc3JjL2F1ZGlvLW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC9+L2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wb3Rpb24tYXVkaW8vc3JjL2xvYWRlZC1hdWRpby5qcyIsIndlYnBhY2s6Ly8vLi9+L3BvdGlvbi1hdWRpby9zcmMvcGxheWluZy1hdWRpby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQVEsb0JBQW9CO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxnRDs7Ozs7Ozs7OztBQ3hGQSxLQUFJLE1BQU0sR0FBRyxtQkFBTyxDQUFDLENBQWMsQ0FBQyxDQUFDOztBQUVyQyxPQUFNLENBQUMsT0FBTyxHQUFHO0FBQ2YsT0FBSSxFQUFFLGNBQVMsTUFBTSxFQUFFLE9BQU8sRUFBRTtBQUM5QixTQUFJLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDekMsWUFBTyxNQUFNLENB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QUcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO0FBQ2xDLFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUV2RCxTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcscUJBQXFCLENBQUM7QUFDNUMsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztBQUNwQyxTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDOztBQUV2QyxTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsb0JBQW9CLENBQUM7QUFDaEQsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0FBRTFELFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDckMsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFdEQsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7QUFDL0QsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFbEQsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUM3QixTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUMzQixTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEtBQUssR0FBRyxFQUFFLEVBQUUsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQzVELFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQzNCLFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDOztBQUV4QixTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLG9CQUFvQixDQUFDO0FBQzdFLFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFckUsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUM3QixTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFM0IsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUN4RCxTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDckMsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxNQUFNLEdBQUcsRUFBRSxD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QUU7QUFDakQsT0FBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7O0FBRTNCLFFBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3JELFNBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEMsU0FBSSxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQ3RGLFlBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQzlCOztBQUVELFNBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUFFLGFBQU07TUFBRTtJQUNuQztFQUNGLENBQUM7O0FBRUYsYUFBWSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsVUFBUyxLQUFLLEVBQUU7QUFDL0MsT0FBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7O0FBRTNCLFFBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3JELFNBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEMsU0FBSSxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQ3BGLFlBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQzVCOztBQUVELFNBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUFFLGFBQU07TUFBRTtJQUNuQztFQUNGLENBQUM7O0FBRUYsYUFBWSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsVUFBUyxLQUFLLEVBQUU7QUFDakQsT0FBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7O0FBRTNCLFFBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3JELFNBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEMsU0FBSSxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQ3RGLFlBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQzlCOztBQUVELFNBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUFFLGFBQU07TUFBRTtJQUNuQztFQUNGLENBQUM7O0FBRUYsYUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsVUFBUyxLQUFLLEVBQUU7QUFDN0MsT0FBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7O0FBRTNCLFFBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3JELFNBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEMsU0FBSSxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZDQUE0QyxLQUFLOztBQUVqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0Esb0NBQW1DLE9BQU87QUFDMUM7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLDBEQUF5RDtBQUN6RDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWCxVQUFTO0FBQ1Q7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsU0FBUztBQUNwQjtBQUNBLFlBQVcsU0FBUztBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUN6a0JBLEtBQUksUUFBUSxHQUFHLG9CQUFXO0FBQ3hCLE9BQUksVUFBVSxHQUFHLDJJQUdTLENBQUM7O0FBRTNCLE9BQUksTUFBTSxDQUFDLGdCQUFnQixHQUFHLENBQUM7QUFDN0IsWUFBTyxJQUFJLENBQUM7SUFFZCxJQUFJLE1BQU0sQ0FBQyxVQUFVLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPO0FBQzVELFlBQU8sSUFBSSxDQUFDO0lBRWQsT0FBTyxLQUFLLENBQUM7RUFDZCxDQUFDOztBQUVGLE9BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDOzs7Ozs7OztBQ2Z6QixPQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7QUFDOUMsT0FBSSxPQUFPLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQzs7QUFFbkMsVUFBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQy9CLFVBQU8sQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDO0FBQzlCLFVBQU8sQ0FBQyxNQUFNLEdBQUcsWUFBVztBQUMxQixTQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFO0FBQzFCLGNBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ25COztBQUVELFNBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3JDLGFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQixDQUFDO0FBQ0YsVUFBTyxDQUFDLElBQUksRUFBRSxDQUFDO0VBQ2hCLEM7Ozs7Ozs7O0FDZEQsT0FBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO0FBQzlDLE9BQUksS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDeEIsUUFBSyxDQUFDLE1BQU0sR0FBRyxZQUFXO0FBQ3hCLGFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQixDQUFDO0FBQ0YsUUFBSyxDQUFDLE9BQU8sR0FBRyxZQUFXO0FBQ3pCLFVBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNaLENBQUM7QUFDRixRQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztFQUNqQixDOzs7Ozs7OztBQ1RELE9BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtBQUM5QyxPQUFJLE9BQU8sR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDOztBQUVuQyxVQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDL0IsVUFBTyxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUM7QUFDOUIsVUFBTyxDQUFDLE1BQU0sR0FBRyxZQUFXO0FBQzFCLFNBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUU7QUFDMUIsY0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDbkI7O0FBRUQsU0FBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUN6QixhQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEIsQ0FBQztBQUNGLFVBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztFQUNoQixDOzs7Ozs7OztBQ2RELE9BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixjQUFhLENBQUM7QUFDZCxRQUFPLENBQUM7QUFDUixVQUFTLEVBQUU7QUFDWCxVQUFTLEVBQUU7QUFDWCxTQUFRLEVBQUU7QUFDVixRQUFPLEVBQUU7QUFDVCxVQUFTLEVBQUU7QUFDWCxZQUFXLEVBQUU7QUFDYixjQUFhLEVBQUU7QUFDZixRQUFPLEVBQUU7QUFDVCxTQUFRLEVBQUU7QUFDVixTQUFRLEVBQUU7QUFDVixPQUFNLEVBQUU7QUFDUixVQUFTLEVBQUU7QUFDWCxTQUFRLEVBQUU7QUFDVixXQUFVLEVBQUU7QUFDWixXQUFRLEVBQUUsRUFBRTtBQUNaLE1BQUcsRUFBRSxFQUFFO0FBQ1AsTUFBRyxFQUFFLEVBQUU7QUFDUCxNQUFHLEVBQUUsRUFBRTtBQUNQLE1BQUcsRUFBRSxFQUFFO0FBQ1AsTUFBRyxFQUFFLEVBQUU7QUFDUCxNQUFHLEVBQUUsRUFBRTtBQUNQLE1BQUcsRUFBRSxFQUFFO0FBQ1AsTUFBRyxFQUFFLEVBQUU7QUFDUCxNQUFHLEVBQUUsRUFBRTtBQUNQLE1BQUcsRUFBRSxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsYUFBWSxFQUFFO0FBQ2QsYUFBWSxFQUFFO0FBQ2QsYUFBWSxFQUFFO0FBQ2QsYUFBWSxFQUFFO0FBQ2QsYUFBWSxHQUFHO0FBQ2YsYUFBWSxHQUFHO0FBQ2YsYUFBWSxHQUFHO0FBQ2YsYUFBWSxHQUFHO0FBQ2YsYUFBWSxHQUFHO0FBQ2YsYUFBWSxHQUFHO0FBQ2YsYUFBWSxHQUFHO0FBQ2YsUUFBTyxHQUFHO0FBQ1YsY0FBYSxHQUFHO0FBQ2hCLFlBQVcsR0FBRztBQUNkLFdBQVUsR0FBRztBQUNiLE9BQU0sR0FBRztBQUNULE9BQU0sR0FBRztBQUNULE9BQU0sR0FBRztBQUNULE9BQU0sR0FBRztBQUNULE9BQU0sR0FBRztBQUNULE9BQU0sR0FBRztBQUNULE9BQU0sR0FBRztBQUNULE9BQU0sR0FBRztBQUNULE9BQU0sR0FBRztBQUNULFFBQU8sR0FBRztBQUNWLFFBQU8sR0FBRztBQUNWLFFBQU8sR0FBRztBQUNWLFVBQVMsRUFBRTtBQUNYLFNBQVEsRUFBRTtBQUNWLFFBQU8sRUFBRTtBQUNULFNBQVEsR0FBRztBQUNYLFVBQVMsR0FBRztBQUNaLFVBQVMsR0FBRztBQUNaLFdBQVUsR0FBRztFQUNkLEM7Ozs7OztBQ3hGRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWdDLFFBQVE7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVUsTUFBTTtBQUNoQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4QkFBNkIsSUFBSTtBQUNqQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBb0MsOEJBQThCO0FBQ2xFOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVSxvQkFBb0I7QUFDOUI7QUFDQTs7QUFFQTtBQUNBLFdBQVUsVUFBVTtBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBaUIsWUFBWTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0NBQStCLHNCQUFzQjtBQUNyRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLGVBQWU7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1DQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQy9OQTs7Ozs7OztBQ0FBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNEJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLDZCQUE0QixVQUFVOzs7Ozs7O0FDekR0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRTs7Ozs7O0FDTEE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLElBQUc7QUFDSDs7QUFFQTs7Ozs7OztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0EsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3RCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xuIFx0dmFyIHBhcmVudEpzb25wRnVuY3Rpb24gPSB3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl07XG4gXHR3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl0gPSBmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhjaHVua0lkcywgbW9yZU1vZHVsZXMpIHtcbiBcdFx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG4gXHRcdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuIFx0XHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwLCBjYWxsYmFja3MgPSBbXTtcbiBcdFx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG4gXHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKVxuIFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2guYXBwbHkoY2FsbGJhY2tzLCBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pO1xuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG4gXHRcdH1cbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdH1cbiBcdFx0aWYocGFyZW50SnNvbnBGdW5jdGlvbikgcGFyZW50SnNvbnBGdW5jdGlvbihjaHVua0lkcywgbW9yZU1vZHVsZXMpO1xuIFx0XHR3aGlsZShjYWxsYmFja3MubGVuZ3RoKVxuIFx0XHRcdGNhbGxiYWNrcy5zaGlmdCgpLmNhbGwobnVsbCwgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4gXHRcdGlmKG1vcmVNb2R1bGVzWzBdKSB7XG4gXHRcdFx0aW5zdGFsbGVkTW9kdWxlc1swXSA9IDA7XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4gXHQvLyBcIjBcIiBtZWFucyBcImFscmVhZHkgbG9hZGVkXCJcbiBcdC8vIEFycmF5IG1lYW5zIFwibG9hZGluZ1wiLCBhcnJheSBjb250YWlucyBjYWxsYmFja3NcbiBcdHZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG4gXHRcdDEyOjBcbiBcdH07XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuIFx0Ly8gVGhpcyBmaWxlIGNvbnRhaW5zIG9ubHkgdGhlIGVudHJ5IGNodW5rLlxuIFx0Ly8gVGhlIGNodW5rIGxvYWRpbmcgZnVuY3Rpb24gZm9yIGFkZGl0aW9uYWwgY2h1bmtzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmUgPSBmdW5jdGlvbiByZXF1aXJlRW5zdXJlKGNodW5rSWQsIGNhbGxiYWNrKSB7XG4gXHRcdC8vIFwiMFwiIGlzIHRoZSBzaWduYWwgZm9yIFwiYWxyZWFkeSBsb2FkZWRcIlxuIFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApXG4gXHRcdFx0cmV0dXJuIGNhbGxiYWNrLmNhbGwobnVsbCwgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gYW4gYXJyYXkgbWVhbnMgXCJjdXJyZW50bHkgbG9hZGluZ1wiLlxuIFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gIT09IHVuZGVmaW5lZCkge1xuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXS5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHQvLyBzdGFydCBjaHVuayBsb2FkaW5nXG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gW2NhbGxiYWNrXTtcbiBcdFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gXHRcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuIFx0XHRcdHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gXHRcdFx0c2NyaXB0LmNoYXJzZXQgPSAndXRmLTgnO1xuIFx0XHRcdHNjcmlwdC5hc3luYyA9IHRydWU7XG4gXHRcdFx0c2NyaXB0LnNyYyA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBjaHVua0lkICsgXCIuY2h1bmsuanNcIjtcbiBcdFx0XHRoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL19fYnVpbGRfXy9cIjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA4ZTAwNGQ2Y2NlNjY5NGMzZTBkNVxuICoqLyIsInZhciBFbmdpbmUgPSByZXF1aXJlKCcuL3NyYy9lbmdpbmUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKGNhbnZhcywgbWV0aG9kcykge1xuICAgIHZhciBlbmdpbmUgPSBuZXcgRW5naW5lKGNhbnZhcywgbWV0aG9kcyk7XG4gICAgcmV0dXJuIGVuZ2luZS5nYW1lO1xuICB9XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9pbmRleC5qc1xuICoqLyIsInJlcXVpcmUoJy4vcmFmLXBvbHlmaWxsJykoKTtcblxudmFyIEdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKTtcblxudmFyIFRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKTtcblxudmFyIERlYnVnZ2VyID0gcmVxdWlyZSgncG90aW9uLWRlYnVnZ2VyJyk7XG5cbnZhciBTdGF0ZU1hbmFnZXIgPSByZXF1aXJlKCcuL3N0YXRlLW1hbmFnZXInKTtcblxuLyoqXG4gKiBNYWluIEVuZ2luZSBjbGFzcyB3aGljaCBjYWxscyB0aGUgZ2FtZSBtZXRob2RzXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIEVuZ2luZSA9IGZ1bmN0aW9uKGNvbnRhaW5lciwgbWV0aG9kcykge1xuICB2YXIgR2FtZUNsYXNzID0gdGhpcy5fc3ViY2xhc3NHYW1lKGNvbnRhaW5lciwgbWV0aG9kcyk7XG5cbiAgY29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcblxuICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gIGNhbnZhcy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNhbnZhcyk7XG5cbiAgdGhpcy5nYW1lID0gbmV3IEdhbWVDbGFzcyhjYW52YXMpO1xuICB0aGlzLmdhbWUuZGVidWcgPSBuZXcgRGVidWdnZXIodGhpcy5nYW1lKTtcblxuICB0aGlzLl9zZXREZWZhdWx0U3RhdGVzKCk7XG5cbiAgdGhpcy50aWNrRnVuYyA9IChmdW5jdGlvbiAoc2VsZikgeyByZXR1cm4gZnVuY3Rpb24oKSB7IHNlbGYudGljaygpOyB9OyB9KSh0aGlzKTtcbiAgdGhpcy5wcmVsb2FkZXJUaWNrRnVuYyA9IChmdW5jdGlvbiAoc2VsZikgeyByZXR1cm4gZnVuY3Rpb24oKSB7IHNlbGYuX3ByZWxvYWRlclRpY2soKTsgfTsgfSkodGhpcyk7XG5cbiAgdGhpcy5zdHJheVRpbWUgPSAwO1xuXG4gIHRoaXMuX3RpbWUgPSBUaW1lLm5vdygpO1xuXG4gIHRoaXMuZ2FtZS5hc3NldHMub25sb2FkKGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc3RhcnQoKTtcblxuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnByZWxvYWRlcklkKTtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGlja0Z1bmMpO1xuICB9LmJpbmQodGhpcykpO1xuXG4gIGlmICh0aGlzLmdhbWUuYXNzZXRzLmlzTG9hZGluZykge1xuICAgIHRoaXMucHJlbG9hZGVySWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucHJlbG9hZGVyVGlja0Z1bmMpO1xuICB9XG59O1xuXG4vKipcbiAqIEFkZCBldmVudCBsaXN0ZW5lciBmb3Igd2luZG93IGV2ZW50c1xuICogQHByaXZhdGVcbiAqL1xuRW5naW5lLnByb3RvdHlwZS5hZGRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciBnYW1lID0gc2VsZi5nYW1lO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uKCkge1xuICAgIHNlbGYuZ2FtZS5pbnB1dC5yZXNldEtleXMoKTtcbiAgICBzZWxmLmdhbWUuYmx1cigpO1xuICB9KTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbigpIHtcbiAgICBzZWxmLmdhbWUuaW5wdXQucmVzZXRLZXlzKCk7XG4gICAgc2VsZi5nYW1lLmZvY3VzKCk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBTdGFydHMgdGhlIGdhbWUsIGFkZHMgZXZlbnRzIGFuZCBydW4gZmlyc3QgZnJhbWVcbiAqIEBwcml2YXRlXG4gKi9cbkVuZ2luZS5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuZ2FtZS5jb25maWcuYWRkSW5wdXRFdmVudHMpIHtcbiAgICB0aGlzLmFkZEV2ZW50cygpO1xuICB9XG59O1xuXG4vKipcbiAqIE1haW4gdGljayBmdW5jdGlvbiBpbiBnYW1lIGxvb3BcbiAqIEBwcml2YXRlXG4gKi9cbkVuZ2luZS5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmdhbWUuZGVidWcuYmVnaW4oKTtcblxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGlja0Z1bmMpO1xuXG4gIHZhciBub3cgPSBUaW1lLm5vdygpO1xuICB2YXIgdGltZSA9IChub3cgLSB0aGlzLl90aW1lKSAvIDEwMDA7XG4gIHRoaXMuX3RpbWUgPSBub3c7XG5cbiAgdGhpcy5nYW1lLmRlYnVnLnBlcmYoJ3VwZGF0ZScpO1xuICB0aGlzLnVwZGF0ZSh0aW1lKTtcbiAgdGhpcy5nYW1lLmRlYnVnLnN0b3BQZXJmKCd1cGRhdGUnKTtcblxuICB0aGlzLmdhbWUuc3RhdGVzLmV4aXRVcGRhdGUodGltZSk7XG5cbiAgdGhpcy5nYW1lLmRlYnVnLnBlcmYoJ3JlbmRlcicpO1xuICB0aGlzLnJlbmRlcigpO1xuICB0aGlzLmdhbWUuZGVidWcuc3RvcFBlcmYoJ3JlbmRlcicpO1xuXG4gIHRoaXMuZ2FtZS5kZWJ1Zy5yZW5kZXIoKTtcblxuICB0aGlzLmdhbWUuZGVidWcuZW5kKCk7XG59O1xuXG4vKipcbiAqIFVwZGF0ZXMgdGhlIGdhbWVcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lIC0gdGltZSBpbiBzZWNvbmRzIHNpbmNlIGxhc3QgZnJhbWVcbiAqIEBwcml2YXRlXG4gKi9cbkVuZ2luZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICBpZiAodGltZSA+IHRoaXMuZ2FtZS5jb25maWcubWF4U3RlcFRpbWUpIHsgdGltZSA9IHRoaXMuZ2FtZS5jb25maWcubWF4U3RlcFRpbWU7IH1cblxuICBpZiAodGhpcy5nYW1lLmNvbmZpZy5maXhlZFN0ZXApIHtcbiAgICB0aGlzLnN0cmF5VGltZSA9IHRoaXMuc3RyYXlUaW1lICsgdGltZTtcbiAgICB3aGlsZSAodGhpcy5zdHJheVRpbWUgPj0gdGhpcy5nYW1lLmNvbmZpZy5zdGVwVGltZSkge1xuICAgICAgdGhpcy5zdHJheVRpbWUgPSB0aGlzLnN0cmF5VGltZSAtIHRoaXMuZ2FtZS5jb25maWcuc3RlcFRpbWU7XG4gICAgICB0aGlzLmdhbWUuc3RhdGVzLnVwZGF0ZSh0aGlzLmdhbWUuY29uZmlnLnN0ZXBUaW1lKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5nYW1lLnN0YXRlcy51cGRhdGUodGltZSk7XG4gIH1cbn07XG5cbi8qKlxuICogUmVuZGVycyB0aGUgZ2FtZVxuICogQHByaXZhdGVcbiAqL1xuRW5naW5lLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5nYW1lLnZpZGVvLmJlZ2luRnJhbWUoKTtcblxuICB0aGlzLmdhbWUudmlkZW8uY2xlYXIoKTtcblxuICB0aGlzLmdhbWUuc3RhdGVzLnJlbmRlcigpO1xuXG4gIHRoaXMuZ2FtZS52aWRlby5lbmRGcmFtZSgpO1xufTtcblxuLyoqXG4gKiBNYWluIHRpY2sgZnVuY3Rpb24gaW4gcHJlbG9hZGVyIGxvb3BcbiAqIEBwcml2YXRlXG4gKi9cbkVuZ2luZS5wcm90b3R5cGUuX3ByZWxvYWRlclRpY2sgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5wcmVsb2FkZXJJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5wcmVsb2FkZXJUaWNrRnVuYyk7XG5cbiAgdmFyIG5vdyA9IFRpbWUubm93KCk7XG4gIHZhciB0aW1lID0gKG5vdyAtIHRoaXMuX3RpbWUpIC8gMTAwMDtcbiAgdGhpcy5fdGltZSA9IG5vdztcblxuICBpZiAodGhpcy5nYW1lLmNvbmZpZy5zaG93UHJlbG9hZGVyKSB7XG4gICAgdGhpcy5nYW1lLnZpZGVvLmNsZWFyKCk7XG4gICAgdGhpcy5nYW1lLnByZWxvYWRpbmcodGltZSk7XG4gIH1cbn07XG5cbkVuZ2luZS5wcm90b3R5cGUuX3NldERlZmF1bHRTdGF0ZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHN0YXRlcyA9IG5ldyBTdGF0ZU1hbmFnZXIoKTtcbiAgc3RhdGVzLmFkZCgnYXBwJywgdGhpcy5nYW1lKTtcbiAgc3RhdGVzLmFkZCgnZGVidWcnLCB0aGlzLmdhbWUuZGVidWcpO1xuXG4gIHN0YXRlcy5wcm90ZWN0KCdhcHAnKTtcbiAgc3RhdGVzLnByb3RlY3QoJ2RlYnVnJyk7XG4gIHN0YXRlcy5oaWRlKCdkZWJ1ZycpO1xuXG4gIHRoaXMuZ2FtZS5zdGF0ZXMgPSBzdGF0ZXM7XG59O1xuXG5FbmdpbmUucHJvdG90eXBlLl9zdWJjbGFzc0dhbWUgPSBmdW5jdGlvbihjb250YWluZXIsIG1ldGhvZHMpIHtcbiAgdmFyIEdhbWVDbGFzcyA9IGZ1bmN0aW9uKGNvbnRhaW5lcikge1xuICAgIEdhbWUuY2FsbCh0aGlzLCBjb250YWluZXIpO1xuICB9O1xuXG4gIEdhbWVDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdhbWUucHJvdG90eXBlKTtcblxuICBmb3IgKHZhciBtZXRob2QgaW4gbWV0aG9kcykge1xuICAgIEdhbWVDbGFzcy5wcm90b3R5cGVbbWV0aG9kXSA9IG1ldGhvZHNbbWV0aG9kXTtcbiAgfVxuXG4gIHJldHVybiBHYW1lQ2xhc3M7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVuZ2luZTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VuZ2luZS5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBsYXN0VGltZSA9IDA7XG4gIHZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcblxuICBmb3IgKHZhciBpPTA7IGk8dmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsraSkge1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1tpXSsnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbaV0rJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgd2luZG93W3ZlbmRvcnNbaV0rJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICB9XG5cbiAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuXG4gICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTtcbiAgICAgIH0sIHRpbWVUb0NhbGwpO1xuXG4gICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbiAgICAgIHJldHVybiBpZDtcbiAgICB9O1xuICB9XG5cbiAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpIHtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihpZCkgeyBjbGVhclRpbWVvdXQoaWQpOyB9O1xuICB9XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmFmLXBvbHlmaWxsLmpzXG4gKiovIiwidmFyIFZpZGVvID0gcmVxdWlyZSgnLi92aWRlbycpO1xudmFyIEFzc2V0cyA9IHJlcXVpcmUoJy4vYXNzZXRzJyk7XG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG5cbnZhciBHYW1lID0gZnVuY3Rpb24oY2FudmFzKSB7XG4gIHRoaXMuY2FudmFzID0gY2FudmFzO1xuXG4gIHRoaXMud2lkdGggPSAzMDA7XG5cbiAgdGhpcy5oZWlnaHQgPSAzMDA7XG5cbiAgdGhpcy5hc3NldHMgPSBuZXcgQXNzZXRzKCk7XG5cbiAgdGhpcy5zdGF0ZXMgPSBudWxsO1xuICB0aGlzLmRlYnVnID0gbnVsbDtcbiAgdGhpcy5pbnB1dCA9IG51bGw7XG4gIHRoaXMudmlkZW8gPSBudWxsO1xuXG4gIHRoaXMuY29uZmlnID0ge1xuICAgIHVzZVJldGluYTogdHJ1ZSxcbiAgICBpbml0aWFsaXplQ2FudmFzOiB0cnVlLFxuICAgIGluaXRpYWxpemVWaWRlbzogdHJ1ZSxcbiAgICBhZGRJbnB1dEV2ZW50czogdHJ1ZSxcbiAgICBzaG93UHJlbG9hZGVyOiB0cnVlLFxuICAgIGZpeGVkU3RlcDogZmFsc2UsXG4gICAgc3RlcFRpbWU6IDAuMDE2NjYsXG4gICAgbWF4U3RlcFRpbWU6IDAuMDE2NjZcbiAgfTtcblxuICB0aGlzLmNvbmZpZ3VyZSgpO1xuXG4gIGlmICh0aGlzLmNvbmZpZy5pbml0aWFsaXplVmlkZW8pIHtcbiAgICB0aGlzLnZpZGVvID0gbmV3IFZpZGVvKHRoaXMsIGNhbnZhcywgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgaWYgKHRoaXMuY29uZmlnLmFkZElucHV0RXZlbnRzKSB7XG4gICAgdGhpcy5pbnB1dCA9IG5ldyBJbnB1dCh0aGlzLCBjYW52YXMucGFyZW50RWxlbWVudCk7XG4gIH1cbn07XG5cbkdhbWUucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgaWYgKHRoaXMudmlkZW8pIHtcbiAgICB0aGlzLnZpZGVvLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG4gIH1cbn07XG5cbkdhbWUucHJvdG90eXBlLnByZWxvYWRpbmcgPSBmdW5jdGlvbih0aW1lKSB7XG4gIGlmICghdGhpcy5jb25maWcuc2hvd1ByZWxvYWRlciAmJiAhKHRoaXMudmlkZW8gJiYgdGhpcy52aWRlby5jdHgpKSB7IHJldHVybjsgfVxuXG4gIGlmICh0aGlzLnZpZGVvLmN0eCkge1xuICAgIHZhciBjb2xvcjEgPSAnI2I5ZmY3MSc7XG4gICAgdmFyIGNvbG9yMiA9ICcjOGFjMjUwJztcbiAgICB2YXIgY29sb3IzID0gJyM2NDhlMzgnO1xuXG4gICAgaWYgKHRoaXMuX3ByZWxvYWRlcldpZHRoID09PSB1bmRlZmluZWQpIHsgdGhpcy5fcHJlbG9hZGVyV2lkdGggPSAwOyB9XG5cbiAgICB2YXIgd2lkdGggPSBNYXRoLm1pbih0aGlzLndpZHRoICogMi8zLCAzMDApO1xuICAgIHZhciBoZWlnaHQgPSAyMDtcblxuICAgIHZhciB5ID0gKHRoaXMuaGVpZ2h0IC0gaGVpZ2h0KSAvIDI7XG4gICAgdmFyIHggPSAodGhpcy53aWR0aCAtIHdpZHRoKSAvIDI7XG5cbiAgICB2YXIgY3VycmVudFdpZHRoID0gd2lkdGggKiB0aGlzLmFzc2V0cy5wcm9ncmVzcztcbiAgICB0aGlzLl9wcmVsb2FkZXJXaWR0aCA9IHRoaXMuX3ByZWxvYWRlcldpZHRoICsgKGN1cnJlbnRXaWR0aCAtIHRoaXMuX3ByZWxvYWRlcldpZHRoKSAqIHRpbWUgKiAxMDtcblxuICAgIHRoaXMudmlkZW8uY3R4LnNhdmUoKTtcblxuICAgIHRoaXMudmlkZW8uY3R4LmZpbGxTdHlsZSA9IGNvbG9yMjtcbiAgICB0aGlzLnZpZGVvLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5mb250ID0gJzQwMCA0MHB4IHNhbnMtc2VyaWYnO1xuICAgIHRoaXMudmlkZW8uY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgIHRoaXMudmlkZW8uY3R4LnRleHRCYXNlbGluZSA9ICdib3R0b20nO1xuXG4gICAgdGhpcy52aWRlby5jdHguZmlsbFN0eWxlID0gJ3JnYmEoMCwgMCwgMCwgMC4xKSc7XG4gICAgdGhpcy52aWRlby5jdHguZmlsbFRleHQoXCJQb3Rpb24uanNcIiwgdGhpcy53aWR0aC8yLCB5ICsgMik7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5maWxsU3R5bGUgPSAnI2QxZmZhMSc7XG4gICAgdGhpcy52aWRlby5jdHguZmlsbFRleHQoXCJQb3Rpb24uanNcIiwgdGhpcy53aWR0aC8yLCB5KTtcblxuICAgIHRoaXMudmlkZW8uY3R4LnN0cm9rZVN0eWxlID0gdGhpcy52aWRlby5jdHguZmlsbFN0eWxlID0gY29sb3IzO1xuICAgIHRoaXMudmlkZW8uY3R4LmZpbGxSZWN0KHgsIHkgKyAxNSwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5saW5lV2lkdGggPSAyO1xuICAgIHRoaXMudmlkZW8uY3R4LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMudmlkZW8uY3R4LnJlY3QoeCAtIDUsIHkgKyAxMCwgd2lkdGggKyAxMCwgaGVpZ2h0ICsgMTApO1xuICAgIHRoaXMudmlkZW8uY3R4LmNsb3NlUGF0aCgpO1xuICAgIHRoaXMudmlkZW8uY3R4LnN0cm9rZSgpO1xuXG4gICAgdGhpcy52aWRlby5jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLnZpZGVvLmN0eC5maWxsU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjEpJztcbiAgICB0aGlzLnZpZGVvLmN0eC5maWxsUmVjdCh4LCB5ICsgMTUsIHRoaXMuX3ByZWxvYWRlcldpZHRoLCBoZWlnaHQgKyAyKTtcblxuICAgIHRoaXMudmlkZW8uY3R4LmxpbmVXaWR0aCA9IDI7XG4gICAgdGhpcy52aWRlby5jdHguYmVnaW5QYXRoKCk7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5tb3ZlVG8oeCArIHRoaXMuX3ByZWxvYWRlcldpZHRoLCB5ICsgMTIpO1xuICAgIHRoaXMudmlkZW8uY3R4LmxpbmVUbyh4IC0gNSwgeSArIDEyKTtcbiAgICB0aGlzLnZpZGVvLmN0eC5saW5lVG8oeCAtIDUsIHkgKyAxMCArIGhlaWdodCArIDEyKTtcbiAgICB0aGlzLnZpZGVvLmN0eC5saW5lVG8oeCArIHRoaXMuX3ByZWxvYWRlcldpZHRoLCB5ICsgMTAgKyBoZWlnaHQgKyAxMik7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5zdHJva2UoKTtcbiAgICB0aGlzLnZpZGVvLmN0eC5jbG9zZVBhdGgoKTtcblxuICAgIHRoaXMudmlkZW8uY3R4LnN0cm9rZVN0eWxlID0gdGhpcy52aWRlby5jdHguZmlsbFN0eWxlID0gY29sb3IxO1xuICAgIHRoaXMudmlkZW8uY3R4LmZpbGxSZWN0KHgsIHkgKyAxNSwgdGhpcy5fcHJlbG9hZGVyV2lkdGgsIGhlaWdodCk7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5saW5lV2lkdGggPSAyO1xuICAgIHRoaXMudmlkZW8uY3R4LmJlZ2luUGF0aCgpO1xuXG4gICAgdGhpcy52aWRlby5jdHgubW92ZVRvKHggKyB0aGlzLl9wcmVsb2FkZXJXaWR0aCwgeSArIDEwKTtcbiAgICB0aGlzLnZpZGVvLmN0eC5saW5lVG8oeCAtIDUsIHkgKyAxMCk7XG4gICAgdGhpcy52aWRlby5jdHgubGluZVRvKHggLSA1LCB5ICsgMTAgKyBoZWlnaHQgKyAxMCk7XG4gICAgdGhpcy52aWRlby5jdHgubGluZVRvKHggKyB0aGlzLl9wcmVsb2FkZXJXaWR0aCwgeSArIDEwICsgaGVpZ2h0ICsgMTApO1xuXG4gICAgdGhpcy52aWRlby5jdHguc3Ryb2tlKCk7XG4gICAgdGhpcy52aWRlby5jdHguY2xvc2VQYXRoKCk7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5yZXN0b3JlKCk7XG4gIH1cbn07XG5cbkdhbWUucHJvdG90eXBlLmNvbmZpZ3VyZSA9IGZ1bmN0aW9uKCkge307XG5cbkdhbWUucHJvdG90eXBlLmZvY3VzID0gZnVuY3Rpb24oKSB7fTtcblxuR2FtZS5wcm90b3R5cGUuYmx1ciA9IGZ1bmN0aW9uKCkge307XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2dhbWUuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHdpbmRvdy5wZXJmb3JtYW5jZSB8fCBEYXRlO1xufSkoKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3RpbWUuanNcbiAqKi8iLCJ2YXIgcmVuZGVyT3JkZXJTb3J0ID0gZnVuY3Rpb24oYSwgYikge1xuICByZXR1cm4gYS5yZW5kZXJPcmRlciA8IGIucmVuZGVyT3JkZXI7XG59O1xuXG52YXIgdXBkYXRlT3JkZXJTb3J0ID0gZnVuY3Rpb24oYSwgYikge1xuICByZXR1cm4gYS51cGRhdGVPcmRlciA8IGIudXBkYXRlT3JkZXI7XG59O1xuXG52YXIgU3RhdGVNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3RhdGVzID0ge307XG4gIHRoaXMucmVuZGVyT3JkZXIgPSBbXTtcbiAgdGhpcy51cGRhdGVPcmRlciA9IFtdO1xuXG4gIHRoaXMuX3ByZXZlbnRFdmVudCA9IGZhbHNlO1xufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihuYW1lLCBzdGF0ZSkge1xuICB0aGlzLnN0YXRlc1tuYW1lXSA9IHRoaXMuX25ld1N0YXRlSG9sZGVyKG5hbWUsIHN0YXRlKTtcbiAgdGhpcy5yZWZyZXNoT3JkZXIoKTtcbiAgcmV0dXJuIHN0YXRlO1xufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGlmICghaG9sZGVyLmVuYWJsZWQpIHtcbiAgICAgIGlmIChob2xkZXIuc3RhdGUuZW5hYmxlKSB7XG4gICAgICAgIGhvbGRlci5zdGF0ZS5lbmFibGUoKTtcbiAgICAgIH1cbiAgICAgIGhvbGRlci5lbmFibGVkID0gdHJ1ZTtcbiAgICAgIGhvbGRlci5jaGFuZ2VkID0gdHJ1ZTtcblxuICAgICAgaWYgKGhvbGRlci5wYXVzZWQpIHtcbiAgICAgICAgdGhpcy51bnBhdXNlKG5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBpZiAoaG9sZGVyLmVuYWJsZWQpIHtcbiAgICAgIGlmIChob2xkZXIuc3RhdGUuZGlzYWJsZSkge1xuICAgICAgICBob2xkZXIuc3RhdGUuZGlzYWJsZSgpO1xuICAgICAgfVxuICAgICAgaG9sZGVyLmNoYW5nZWQgPSB0cnVlO1xuICAgICAgaG9sZGVyLmVuYWJsZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaWYgKGhvbGRlci5lbmFibGVkKSB7XG4gICAgICBob2xkZXIuY2hhbmdlZCA9IHRydWU7XG4gICAgICBob2xkZXIucmVuZGVyID0gZmFsc2U7XG4gICAgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGlmIChob2xkZXIuZW5hYmxlZCkge1xuICAgICAgaG9sZGVyLmNoYW5nZWQgPSB0cnVlO1xuICAgICAgaG9sZGVyLnJlbmRlciA9IHRydWU7XG4gICAgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBpZiAoaG9sZGVyLnN0YXRlLnBhdXNlKSB7XG4gICAgICBob2xkZXIuc3RhdGUucGF1c2UoKTtcbiAgICB9XG5cbiAgICBob2xkZXIuY2hhbmdlZCA9IHRydWU7XG4gICAgaG9sZGVyLnBhdXNlZCA9IHRydWU7XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUudW5wYXVzZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaWYgKGhvbGRlci5zdGF0ZS51bnBhdXNlKSB7XG4gICAgICBob2xkZXIuc3RhdGUudW5wYXVzZSgpO1xuICAgIH1cblxuICAgIGhvbGRlci5jaGFuZ2VkID0gdHJ1ZTtcbiAgICBob2xkZXIucGF1c2VkID0gZmFsc2U7XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUucHJvdGVjdCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaG9sZGVyLnByb3RlY3QgPSB0cnVlO1xuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnVucHJvdGVjdCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaG9sZGVyLnByb3RlY3QgPSBmYWxzZTtcbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5yZWZyZXNoT3JkZXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5yZW5kZXJPcmRlci5sZW5ndGggPSAwO1xuICB0aGlzLnVwZGF0ZU9yZGVyLmxlbmd0aCA9IDA7XG5cbiAgZm9yICh2YXIgbmFtZSBpbiB0aGlzLnN0YXRlcykge1xuICAgIHZhciBob2xkZXIgPSB0aGlzLnN0YXRlc1tuYW1lXTtcbiAgICBpZiAoaG9sZGVyKSB7XG4gICAgICB0aGlzLnJlbmRlck9yZGVyLnB1c2goaG9sZGVyKTtcbiAgICAgIHRoaXMudXBkYXRlT3JkZXIucHVzaChob2xkZXIpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMucmVuZGVyT3JkZXIuc29ydChyZW5kZXJPcmRlclNvcnQpO1xuICB0aGlzLnVwZGF0ZU9yZGVyLnNvcnQodXBkYXRlT3JkZXJTb3J0KTtcbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuX25ld1N0YXRlSG9sZGVyID0gZnVuY3Rpb24obmFtZSwgc3RhdGUpIHtcbiAgdmFyIGhvbGRlciA9IHt9O1xuICBob2xkZXIubmFtZSA9IG5hbWU7XG4gIGhvbGRlci5zdGF0ZSA9IHN0YXRlO1xuXG4gIGhvbGRlci5wcm90ZWN0ID0gZmFsc2U7XG5cbiAgaG9sZGVyLmVuYWJsZWQgPSB0cnVlO1xuICBob2xkZXIucGF1c2VkID0gZmFsc2U7XG5cbiAgaG9sZGVyLnJlbmRlciA9IHRydWU7XG5cbiAgaG9sZGVyLmluaXRpYWxpemVkID0gZmFsc2U7XG4gIGhvbGRlci51cGRhdGVkID0gZmFsc2U7XG4gIGhvbGRlci5jaGFuZ2VkID0gdHJ1ZTtcblxuICBob2xkZXIudXBkYXRlT3JkZXIgPSAwO1xuICBob2xkZXIucmVuZGVyT3JkZXIgPSAwO1xuXG4gIHJldHVybiBob2xkZXI7XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnNldFVwZGF0ZU9yZGVyID0gZnVuY3Rpb24obmFtZSwgb3JkZXIpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaG9sZGVyLnVwZGF0ZU9yZGVyID0gb3JkZXI7XG4gICAgdGhpcy5yZWZyZXNoT3JkZXIoKTtcbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5zZXRSZW5kZXJPcmRlciA9IGZ1bmN0aW9uKG5hbWUsIG9yZGVyKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGhvbGRlci5yZW5kZXJPcmRlciA9IG9yZGVyO1xuICAgIHRoaXMucmVmcmVzaE9yZGVyKCk7XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChzdGF0ZSAmJiAhc3RhdGUucHJvdGVjdCkge1xuICAgIGlmIChzdGF0ZS5zdGF0ZS5jbG9zZSkge1xuICAgICAgc3RhdGUuc3RhdGUuY2xvc2UoKTtcbiAgICB9XG4gICAgZGVsZXRlIHRoaXMuc3RhdGVzW25hbWVdO1xuICAgIHRoaXMucmVmcmVzaE9yZGVyKCk7XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuZGVzdHJveUFsbCA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLnVwZGF0ZU9yZGVyLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMudXBkYXRlT3JkZXJbaV07XG4gICAgaWYgKCFzdGF0ZS5wcm90ZWN0KSB7XG4gICAgICBpZiAoc3RhdGUuc3RhdGUuY2xvc2UpIHtcbiAgICAgICAgc3RhdGUuc3RhdGUuY2xvc2UoKTtcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSB0aGlzLnN0YXRlc1tzdGF0ZS5uYW1lXTtcbiAgICB9XG4gIH1cblxuICB0aGlzLnJlZnJlc2hPcmRlcigpO1xufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHJldHVybiB0aGlzLnN0YXRlc1tuYW1lXTtcbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLnVwZGF0ZU9yZGVyLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMudXBkYXRlT3JkZXJbaV07XG5cbiAgICBpZiAoc3RhdGUpIHtcbiAgICAgIHN0YXRlLmNoYW5nZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKHN0YXRlLmVuYWJsZWQpIHtcbiAgICAgICAgaWYgKCFzdGF0ZS5pbml0aWFsaXplZCAmJiBzdGF0ZS5zdGF0ZS5pbml0KSB7XG4gICAgICAgICAgc3RhdGUuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICAgIHN0YXRlLnN0YXRlLmluaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdGF0ZS5zdGF0ZS51cGRhdGUgJiYgIXN0YXRlLnBhdXNlZCkge1xuICAgICAgICAgIHN0YXRlLnN0YXRlLnVwZGF0ZSh0aW1lKTtcbiAgICAgICAgICBzdGF0ZS51cGRhdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5leGl0VXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLnVwZGF0ZU9yZGVyLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMudXBkYXRlT3JkZXJbaV07XG5cbiAgICBpZiAoc3RhdGUgJiYgc3RhdGUuZW5hYmxlZCAmJiBzdGF0ZS5zdGF0ZS5leGl0VXBkYXRlICYmICFzdGF0ZS5wYXVzZWQpIHtcbiAgICAgIHN0YXRlLnN0YXRlLmV4aXRVcGRhdGUodGltZSk7XG4gICAgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLnJlbmRlck9yZGVyLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMucmVuZGVyT3JkZXJbaV07XG4gICAgaWYgKHN0YXRlICYmIHN0YXRlLmVuYWJsZWQgJiYgKHN0YXRlLnVwZGF0ZWQgfHwgIXN0YXRlLnN0YXRlLnVwZGF0ZSkgJiYgc3RhdGUucmVuZGVyICYmIHN0YXRlLnN0YXRlLnJlbmRlcikge1xuICAgICAgc3RhdGUuc3RhdGUucmVuZGVyKCk7XG4gICAgfVxuICB9XG59O1xuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5tb3VzZW1vdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICB0aGlzLl9wcmV2ZW50RXZlbnQgPSBmYWxzZTtcblxuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLnVwZGF0ZU9yZGVyLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMudXBkYXRlT3JkZXJbaV07XG4gICAgaWYgKHN0YXRlICYmIHN0YXRlLmVuYWJsZWQgJiYgIXN0YXRlLmNoYW5nZWQgJiYgc3RhdGUuc3RhdGUubW91c2Vtb3ZlICYmICFzdGF0ZS5wYXVzZWQpIHtcbiAgICAgIHN0YXRlLnN0YXRlLm1vdXNlbW92ZSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3ByZXZlbnRFdmVudCkgeyBicmVhazsgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLm1vdXNldXAgPSBmdW5jdGlvbih2YWx1ZSkge1xuICB0aGlzLl9wcmV2ZW50RXZlbnQgPSBmYWxzZTtcblxuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLnVwZGF0ZU9yZGVyLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMudXBkYXRlT3JkZXJbaV07XG4gICAgaWYgKHN0YXRlICYmIHN0YXRlLmVuYWJsZWQgJiYgIXN0YXRlLmNoYW5nZWQgJiYgc3RhdGUuc3RhdGUubW91c2V1cCAmJiAhc3RhdGUucGF1c2VkKSB7XG4gICAgICBzdGF0ZS5zdGF0ZS5tb3VzZXVwKHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcHJldmVudEV2ZW50KSB7IGJyZWFrOyB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUubW91c2Vkb3duID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgdGhpcy5fcHJldmVudEV2ZW50ID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy51cGRhdGVPcmRlci5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnVwZGF0ZU9yZGVyW2ldO1xuICAgIGlmIChzdGF0ZSAmJiBzdGF0ZS5lbmFibGVkICYmICFzdGF0ZS5jaGFuZ2VkICYmIHN0YXRlLnN0YXRlLm1vdXNlZG93biAmJiAhc3RhdGUucGF1c2VkKSB7XG4gICAgICBzdGF0ZS5zdGF0ZS5tb3VzZWRvd24odmFsdWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wcmV2ZW50RXZlbnQpIHsgYnJlYWs7IH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5rZXl1cCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHRoaXMuX3ByZXZlbnRFdmVudCA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcbiAgICBpZiAoc3RhdGUgJiYgc3RhdGUuZW5hYmxlZCAmJiAhc3RhdGUuY2hhbmdlZCAmJiBzdGF0ZS5zdGF0ZS5rZXl1cCAmJiAhc3RhdGUucGF1c2VkKSB7XG4gICAgICBzdGF0ZS5zdGF0ZS5rZXl1cCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3ByZXZlbnRFdmVudCkgeyBicmVhazsgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmtleWRvd24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICB0aGlzLl9wcmV2ZW50RXZlbnQgPSBmYWxzZTtcblxuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLnVwZGF0ZU9yZGVyLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMudXBkYXRlT3JkZXJbaV07XG4gICAgaWYgKHN0YXRlICYmIHN0YXRlLmVuYWJsZWQgJiYgIXN0YXRlLmNoYW5nZWQgJiYgc3RhdGUuc3RhdGUua2V5ZG93biAmJiAhc3RhdGUucGF1c2VkKSB7XG4gICAgICBzdGF0ZS5zdGF0ZS5rZXlkb3duKHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcHJldmVudEV2ZW50KSB7IGJyZWFrOyB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdGVNYW5hZ2VyO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvc3RhdGUtbWFuYWdlci5qc1xuICoqLyIsInZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xudmFyIERpcnR5TWFuYWdlciA9IHJlcXVpcmUoJy4vZGlydHktbWFuYWdlcicpO1xuXG52YXIgT2JqZWN0UG9vbCA9IFtdO1xuXG52YXIgR2V0T2JqZWN0RnJvbVBvb2wgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc3VsdCA9IE9iamVjdFBvb2wucG9wKCk7XG5cbiAgaWYgKHJlc3VsdCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICByZXR1cm4ge307XG59O1xuXG52YXIgaW5kZXhUb051bWJlckFuZExvd2VyQ2FzZUtleSA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gIGlmIChpbmRleCA8PSA5KSB7XG4gICAgcmV0dXJuIDQ4ICsgaW5kZXg7XG4gIH0gZWxzZSBpZiAoaW5kZXggPT09IDEwKSB7XG4gICAgcmV0dXJuIDQ4O1xuICB9IGVsc2UgaWYgKGluZGV4ID4gMTAgJiYgaW5kZXggPD0gMzYpIHtcbiAgICByZXR1cm4gNjQgKyAoaW5kZXgtMTApO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59O1xuXG52YXIgZGVmYXVsdHMgPSBbXG4gIHsgbmFtZTogJ1Nob3cgRlBTJywgZW50cnk6ICdzaG93RnBzJywgZGVmYXVsdHM6IHRydWUgfSxcbiAgeyBuYW1lOiAnU2hvdyBLZXkgQ29kZXMnLCBlbnRyeTogJ3Nob3dLZXlDb2RlcycsIGRlZmF1bHRzOiB0cnVlIH1cbl07XG5cbnZhciBEZWJ1Z2dlciA9IGZ1bmN0aW9uKGFwcCkge1xuICB0aGlzLnZpZGVvID0gYXBwLnZpZGVvLmNyZWF0ZUxheWVyKHtcbiAgICB1c2VSZXRpbmE6IHRydWUsXG4gICAgaW5pdGlhbGl6ZUNhbnZhczogdHJ1ZVxuICB9KTtcblxuICB0aGlzLmdyYXBoID0gYXBwLnZpZGVvLmNyZWF0ZUxheWVyKHtcbiAgICB1c2VSZXRpbmE6IGZhbHNlLFxuICAgIGluaXRpYWxpemVDYW52YXM6IHRydWVcbiAgfSk7XG5cbiAgdGhpcy5fZ3JhcGhIZWlnaHQgPSAxMDA7XG4gIHRoaXMuXzYwZnBzTWFyayA9IHRoaXMuX2dyYXBoSGVpZ2h0ICogMC44O1xuICB0aGlzLl9tc1RvUHggPSB0aGlzLl82MGZwc01hcmsvMTYuNjY7XG5cbiAgdGhpcy5hcHAgPSBhcHA7XG5cbiAgdGhpcy5vcHRpb25zID0gZGVmYXVsdHM7XG4gIHRoaXMuX21heExvZ3NDb3VudHMgPSAxMDtcblxuICBmb3IgKHZhciBpPTA7IGk8dGhpcy5vcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG9wdGlvbiA9IHRoaXMub3B0aW9uc1tpXTtcbiAgICB0aGlzLl9pbml0T3B0aW9uKG9wdGlvbik7XG4gIH1cblxuICB0aGlzLmRpc2FibGVkID0gZmFsc2U7XG5cbiAgdGhpcy5mcHMgPSAwO1xuICB0aGlzLmZwc0NvdW50ID0gMDtcbiAgdGhpcy5mcHNFbGFwc2VkVGltZSA9IDA7XG4gIHRoaXMuZnBzVXBkYXRlSW50ZXJ2YWwgPSAwLjU7XG4gIHRoaXMuX2ZyYW1lUGVyZiA9IFtdO1xuXG4gIHRoaXMuX2ZvbnRTaXplID0gMDtcbiAgdGhpcy5fZGlydHlNYW5hZ2VyID0gbmV3IERpcnR5TWFuYWdlcih0aGlzLnZpZGVvLmNhbnZhcywgdGhpcy52aWRlby5jdHgpO1xuXG4gIHRoaXMubG9ncyA9IFtdO1xuXG4gIHRoaXMuX3BlcmZWYWx1ZXMgPSB7fTtcbiAgdGhpcy5fcGVyZk5hbWVzID0gW107XG5cbiAgdGhpcy5zaG93RGVidWcgPSBmYWxzZTtcbiAgdGhpcy5lbmFibGVEZWJ1Z0tleXMgPSB0cnVlO1xuICB0aGlzLmVuYWJsZVNob3J0Y3V0cyA9IGZhbHNlO1xuXG4gIHRoaXMuZW5hYmxlU2hvcnRjdXRzS2V5ID0gMjIwO1xuXG4gIHRoaXMubGFzdEtleSA9IG51bGw7XG5cbiAgdGhpcy5fbG9hZCgpO1xuXG4gIHRoaXMua2V5U2hvcnRjdXRzID0gW1xuICAgIHsga2V5OiAxMjMsIGVudHJ5OiAnc2hvd0RlYnVnJywgdHlwZTogJ3RvZ2dsZScgfVxuICBdO1xuXG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLmFkZENvbmZpZyh7IG5hbWU6ICdTaG93IFBlcmZvcm1hbmNlIEdyYXBoJywgZW50cnk6ICdzaG93R3JhcGgnLCBkZWZhdWx0czogZmFsc2UsIGNhbGw6IGZ1bmN0aW9uKCkgeyBzZWxmLmdyYXBoLmNsZWFyKCk7IH0gfSk7XG5cbiAgdGhpcy5fZGlmZiA9IDA7XG4gIHRoaXMuX2ZyYW1lU3RhcnQgPSAwO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLmJlZ2luID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLnNob3dEZWJ1Zykge1xuICAgIHRoaXMuX2ZyYW1lU3RhcnQgPSB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCk7XG4gIH1cbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuc2hvd0RlYnVnKSB7XG4gICAgdGhpcy5fZGlmZiA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSAtIHRoaXMuX2ZyYW1lU3RhcnQ7XG4gIH1cbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5fc2V0Rm9udCA9IGZ1bmN0aW9uKHB4LCBmb250KSB7XG4gIHRoaXMuX2ZvbnRTaXplID0gcHg7XG4gIHRoaXMudmlkZW8uY3R4LmZvbnQgPSBweCArICdweCAnICsgZm9udDtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy52aWRlby5zZXRTaXplKHRoaXMuYXBwLndpZHRoLCB0aGlzLmFwcC5oZWlnaHQpO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLmFkZENvbmZpZyA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICB0aGlzLm9wdGlvbnMucHVzaChvcHRpb24pO1xuICB0aGlzLl9pbml0T3B0aW9uKG9wdGlvbik7XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuX2luaXRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgb3B0aW9uLnR5cGUgPSBvcHRpb24udHlwZSB8fCAndG9nZ2xlJztcbiAgb3B0aW9uLmRlZmF1bHRzID0gb3B0aW9uLmRlZmF1bHRzID09IG51bGwgPyBmYWxzZSA6IG9wdGlvbi5kZWZhdWx0cztcblxuICBpZiAob3B0aW9uLnR5cGUgPT09ICd0b2dnbGUnKSB7XG4gICAgdGhpc1tvcHRpb24uZW50cnldID0gb3B0aW9uLmRlZmF1bHRzO1xuICB9XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5sb2dzLmxlbmd0aCA9IDA7XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUubG9nID0gZnVuY3Rpb24obWVzc2FnZSwgY29sb3IpIHtcbiAgY29sb3IgPSBjb2xvciB8fCAnd2hpdGUnO1xuICBtZXNzYWdlID0gdHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnID8gbWVzc2FnZSA6IHV0aWwuaW5zcGVjdChtZXNzYWdlKTtcblxuICB2YXIgbWVzc2FnZXMgPSBtZXNzYWdlLnJlcGxhY2UoL1xcXFwnL2csIFwiJ1wiKS5zcGxpdCgnXFxuJyk7XG5cbiAgZm9yICh2YXIgaT0wOyBpPG1lc3NhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG1zZyA9IG1lc3NhZ2VzW2ldO1xuICAgIGlmICh0aGlzLmxvZ3MubGVuZ3RoID49IHRoaXMuX21heExvZ3NDb3VudHMpIHtcbiAgICAgIE9iamVjdFBvb2wucHVzaCh0aGlzLmxvZ3Muc2hpZnQoKSk7XG4gICAgfVxuXG4gICAgdmFyIG1lc3NhZ2VPYmplY3QgPSBHZXRPYmplY3RGcm9tUG9vbCgpO1xuICAgIG1lc3NhZ2VPYmplY3QudGV4dCA9IG1zZztcbiAgICBtZXNzYWdlT2JqZWN0LmxpZmUgPSAxMDtcbiAgICBtZXNzYWdlT2JqZWN0LmNvbG9yID0gY29sb3I7XG5cbiAgICB0aGlzLmxvZ3MucHVzaChtZXNzYWdlT2JqZWN0KTtcbiAgfVxufTtcblxuRGVidWdnZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge307XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5leGl0VXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICBpZiAodGhpcy5kaXNhYmxlZCkgeyByZXR1cm47IH1cblxuICBpZiAodGhpcy5zaG93RGVidWcpIHtcbiAgICB0aGlzLl9tYXhMb2dzQ291bnRzID0gTWF0aC5jZWlsKCh0aGlzLmFwcC5oZWlnaHQgKyAyMCkvMjApO1xuICAgIHRoaXMuZnBzQ291bnQgKz0gMTtcbiAgICB0aGlzLmZwc0VsYXBzZWRUaW1lICs9IHRpbWU7XG5cbiAgICBpZiAodGhpcy5mcHNFbGFwc2VkVGltZSA+IHRoaXMuZnBzVXBkYXRlSW50ZXJ2YWwpIHtcbiAgICAgIHZhciBmcHMgPSB0aGlzLmZwc0NvdW50L3RoaXMuZnBzRWxhcHNlZFRpbWU7XG5cbiAgICAgIGlmICh0aGlzLnNob3dGcHMpIHtcbiAgICAgICAgdGhpcy5mcHMgPSB0aGlzLmZwcyAqICgxLTAuOCkgKyAwLjggKiBmcHM7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZnBzQ291bnQgPSAwO1xuICAgICAgdGhpcy5mcHNFbGFwc2VkVGltZSA9IDA7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy5sb2dzLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgICAgdmFyIGxvZyA9IHRoaXMubG9nc1tpXTtcbiAgICAgIGlmIChsb2cpIHtcbiAgICAgICAgbG9nLmxpZmUgLT0gdGltZTtcbiAgICAgICAgaWYgKGxvZy5saWZlIDw9IDApIHtcbiAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmxvZ3MuaW5kZXhPZihsb2cpO1xuICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7IHRoaXMubG9ncy5zcGxpY2UoaW5kZXgsIDEpOyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5rZXlkb3duID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKHRoaXMuZGlzYWJsZWQpIHsgcmV0dXJuOyB9XG5cbiAgdGhpcy5sYXN0S2V5ID0gdmFsdWUua2V5O1xuXG4gIHZhciBpO1xuXG4gIGlmICh0aGlzLmVuYWJsZURlYnVnS2V5cykge1xuICAgIGlmICh2YWx1ZS5rZXkgPT09IHRoaXMuZW5hYmxlU2hvcnRjdXRzS2V5KSB7XG4gICAgICB2YWx1ZS5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB0aGlzLmVuYWJsZVNob3J0Y3V0cyA9ICF0aGlzLmVuYWJsZVNob3J0Y3V0cztcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmVuYWJsZVNob3J0Y3V0cykge1xuICAgICAgZm9yIChpPTA7IGk8dGhpcy5vcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBvcHRpb24gPSB0aGlzLm9wdGlvbnNbaV07XG4gICAgICAgIHZhciBrZXlJbmRleCA9IGkgKyAxO1xuXG4gICAgICAgIGlmICh0aGlzLmFwcC5pbnB1dC5pc0tleURvd24oJ2N0cmwnKSkge1xuICAgICAgICAgIGtleUluZGV4IC09IDM2O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoYXJJZCA9IGluZGV4VG9OdW1iZXJBbmRMb3dlckNhc2VLZXkoa2V5SW5kZXgpO1xuXG4gICAgICAgIGlmIChjaGFySWQgJiYgdmFsdWUua2V5ID09PSBjaGFySWQpIHtcbiAgICAgICAgICB2YWx1ZS5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgaWYgKG9wdGlvbi50eXBlID09PSAndG9nZ2xlJykge1xuXG4gICAgICAgICAgICB0aGlzW29wdGlvbi5lbnRyeV0gPSAhdGhpc1tvcHRpb24uZW50cnldO1xuICAgICAgICAgICAgaWYgKG9wdGlvbi5jYWxsKSB7XG4gICAgICAgICAgICAgIG9wdGlvbi5jYWxsKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3NhdmUoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbi50eXBlID09PSAnY2FsbCcpIHtcbiAgICAgICAgICAgIG9wdGlvbi5lbnRyeSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yIChpPTA7IGk8dGhpcy5rZXlTaG9ydGN1dHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5U2hvcnRjdXQgPSB0aGlzLmtleVNob3J0Y3V0c1tpXTtcbiAgICBpZiAoa2V5U2hvcnRjdXQua2V5ID09PSB2YWx1ZS5rZXkpIHtcbiAgICAgIHZhbHVlLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGlmIChrZXlTaG9ydGN1dC50eXBlID09PSAndG9nZ2xlJykge1xuICAgICAgICB0aGlzW2tleVNob3J0Y3V0LmVudHJ5XSA9ICF0aGlzW2tleVNob3J0Y3V0LmVudHJ5XTtcbiAgICAgICAgdGhpcy5fc2F2ZSgpO1xuICAgICAgfSBlbHNlIGlmIChrZXlTaG9ydGN1dC50eXBlID09PSAnY2FsbCcpIHtcbiAgICAgICAgdGhpc1trZXlTaG9ydGN1dC5lbnRyeV0oKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLl9zYXZlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkYXRhID0ge1xuICAgIHNob3dEZWJ1ZzogdGhpcy5zaG93RGVidWcsXG4gICAgb3B0aW9uczoge31cbiAgfTtcblxuICBmb3IgKHZhciBpPTA7IGk8dGhpcy5vcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG9wdGlvbiA9IHRoaXMub3B0aW9uc1tpXTtcbiAgICB2YXIgdmFsdWUgPSB0aGlzW29wdGlvbi5lbnRyeV07XG4gICAgZGF0YS5vcHRpb25zW29wdGlvbi5lbnRyeV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHdpbmRvdy5sb2NhbFN0b3JhZ2UuX19wb3Rpb25EZWJ1ZyA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLl9sb2FkID0gZnVuY3Rpb24oKSB7XG4gIGlmICh3aW5kb3cubG9jYWxTdG9yYWdlICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2UuX19wb3Rpb25EZWJ1Zykge1xuICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZSh3aW5kb3cubG9jYWxTdG9yYWdlLl9fcG90aW9uRGVidWcpO1xuICAgIHRoaXMuc2hvd0RlYnVnID0gZGF0YS5zaG93RGVidWc7XG5cbiAgICBmb3IgKHZhciBuYW1lIGluIGRhdGEub3B0aW9ucykge1xuICAgICAgdGhpc1tuYW1lXSA9IGRhdGEub3B0aW9uc1tuYW1lXTtcbiAgICB9XG4gIH1cbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuZGlzYWJsZWQpIHsgcmV0dXJuOyB9XG5cbiAgdGhpcy5fZGlydHlNYW5hZ2VyLmNsZWFyKCk7XG5cbiAgaWYgKHRoaXMuc2hvd0RlYnVnKSB7XG4gICAgdGhpcy52aWRlby5jdHguc2F2ZSgpO1xuICAgIHRoaXMuX3NldEZvbnQoMTUsICdzYW5zLXNlcmlmJyk7XG5cbiAgICB0aGlzLl9yZW5kZXJMb2dzKCk7XG4gICAgdGhpcy5fcmVuZGVyRGF0YSgpO1xuICAgIHRoaXMuX3JlbmRlclNob3J0Y3V0cygpO1xuXG4gICAgdGhpcy52aWRlby5jdHgucmVzdG9yZSgpO1xuXG4gICAgaWYgKHRoaXMuc2hvd0dyYXBoKSB7XG4gICAgICB0aGlzLmdyYXBoLmN0eC5kcmF3SW1hZ2UodGhpcy5ncmFwaC5jYW52YXMsIDAsIHRoaXMuYXBwLmhlaWdodCAtIHRoaXMuX2dyYXBoSGVpZ2h0LCB0aGlzLmFwcC53aWR0aCwgdGhpcy5fZ3JhcGhIZWlnaHQsIC0yLCB0aGlzLmFwcC5oZWlnaHQgLSB0aGlzLl9ncmFwaEhlaWdodCwgdGhpcy5hcHAud2lkdGgsIHRoaXMuX2dyYXBoSGVpZ2h0KTtcblxuICAgICAgdGhpcy5ncmFwaC5jdHguZmlsbFN0eWxlID0gJyNGMkYwRDgnO1xuICAgICAgdGhpcy5ncmFwaC5jdHguZmlsbFJlY3QodGhpcy5hcHAud2lkdGggLSAyLCB0aGlzLmFwcC5oZWlnaHQgLSB0aGlzLl9ncmFwaEhlaWdodCwgMiwgdGhpcy5fZ3JhcGhIZWlnaHQpO1xuXG4gICAgICB0aGlzLmdyYXBoLmN0eC5maWxsU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjUpJztcbiAgICAgIHRoaXMuZ3JhcGguY3R4LmZpbGxSZWN0KHRoaXMuYXBwLndpZHRoIC0gMiwgdGhpcy5hcHAuaGVpZ2h0IC0gdGhpcy5fNjBmcHNNYXJrLCAyLCAxKTtcblxuICAgICAgdmFyIGxhc3QgPSAwO1xuICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMuX2ZyYW1lUGVyZi5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX2ZyYW1lUGVyZltpXTtcbiAgICAgICAgdmFyIG5hbWUgPSB0aGlzLl9wZXJmTmFtZXNbaV07XG5cbiAgICAgICAgdGhpcy5fZHJhd0ZyYW1lTGluZShpdGVtLCBuYW1lLCBsYXN0KTtcblxuICAgICAgICBsYXN0ICs9IGl0ZW07XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2RyYXdGcmFtZUxpbmUodGhpcy5fZGlmZiAtIGxhc3QsICdsYWcnLCBsYXN0KTtcbiAgICAgIHRoaXMuX2ZyYW1lUGVyZi5sZW5ndGggPSAwO1xuICAgIH1cbiAgfVxufTtcblxuRGVidWdnZXIucHJvdG90eXBlLl9kcmF3RnJhbWVMaW5lID0gZnVuY3Rpb24odmFsdWUsIG5hbWUsIGxhc3QpIHtcbiAgdmFyIGJhY2tncm91bmQgPSAnYmxhY2snO1xuICBpZiAobmFtZSA9PT0gJ3VwZGF0ZScpIHtcbiAgICBiYWNrZ3JvdW5kID0gJyM2QkE1RjInO1xuICB9IGVsc2UgaWYgKG5hbWUgPT09ICdyZW5kZXInKSB7XG4gICAgYmFja2dyb3VuZCA9ICcjRjI3ODMwJztcbiAgfSBlbHNlIGlmIChuYW1lID09PSAnbGFnJykge1xuICAgIGJhY2tncm91bmQgPSAnIzkxZjY4Mic7XG4gIH1cbiAgdGhpcy5ncmFwaC5jdHguZmlsbFN0eWxlID0gYmFja2dyb3VuZDtcblxuICB2YXIgaGVpZ2h0ID0gKHZhbHVlICsgbGFzdCkgKiB0aGlzLl9tc1RvUHhcblxuICB2YXIgeCA9IHRoaXMuYXBwLndpZHRoIC0gMjtcbiAgdmFyIHkgPSB0aGlzLmFwcC5oZWlnaHQgLSBoZWlnaHQ7XG5cbiAgdGhpcy5ncmFwaC5jdHguZmlsbFJlY3QoeCwgeSwgMiwgaGVpZ2h0IC0gKGxhc3QgKiB0aGlzLl9tc1RvUHgpKTtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5fcmVuZGVyTG9ncyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnZpZGVvLmN0eC50ZXh0QWxpZ24gPSAnbGVmdCc7XG4gIHRoaXMudmlkZW8uY3R4LnRleHRCYXNlbGluZSA9ICdib3R0b20nO1xuXG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMubG9ncy5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgbG9nID0gdGhpcy5sb2dzW2ldO1xuXG4gICAgdmFyIHkgPSAtMTAgKyB0aGlzLmFwcC5oZWlnaHQgKyAoaSAtIHRoaXMubG9ncy5sZW5ndGggKyAxKSAqIDIwO1xuICAgIHRoaXMuX3JlbmRlclRleHQobG9nLnRleHQsIDEwLCB5LCBsb2cuY29sb3IpO1xuICB9XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmRpc2FibGVkID0gdHJ1ZTtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5wZXJmID0gZnVuY3Rpb24obmFtZSkge1xuICBpZiAoIXRoaXMuc2hvd0RlYnVnKSB7IHJldHVybjsgfVxuXG4gIHZhciBleGlzdHMgPSB0aGlzLl9wZXJmVmFsdWVzW25hbWVdO1xuXG4gIGlmIChleGlzdHMgPT0gbnVsbCkge1xuICAgIHRoaXMuX3BlcmZOYW1lcy5wdXNoKG5hbWUpO1xuXG4gICAgdGhpcy5fcGVyZlZhbHVlc1tuYW1lXSA9IHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICB2YWx1ZTogMCxcbiAgICAgIHJlY29yZHM6IFtdXG4gICAgfTtcbiAgfVxuXG4gIHZhciB0aW1lID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xuXG4gIHZhciByZWNvcmQgPSB0aGlzLl9wZXJmVmFsdWVzW25hbWVdO1xuXG4gIHJlY29yZC52YWx1ZSA9IHRpbWU7XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuc3RvcFBlcmYgPSBmdW5jdGlvbihuYW1lKSB7XG4gIGlmICghdGhpcy5zaG93RGVidWcpIHsgcmV0dXJuOyB9XG5cbiAgdmFyIHJlY29yZCA9IHRoaXMuX3BlcmZWYWx1ZXNbbmFtZV07XG5cbiAgdmFyIHRpbWUgPSB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCk7XG4gIHZhciBkaWZmID0gdGltZSAtIHJlY29yZC52YWx1ZTtcblxuICByZWNvcmQucmVjb3Jkcy5wdXNoKGRpZmYpO1xuICBpZiAocmVjb3JkLnJlY29yZHMubGVuZ3RoID4gMTApIHtcbiAgICByZWNvcmQucmVjb3Jkcy5zaGlmdCgpO1xuICB9XG5cbiAgdmFyIHN1bSA9IDA7XG4gIGZvciAodmFyIGk9MDsgaTxyZWNvcmQucmVjb3Jkcy5sZW5ndGg7IGkrKykge1xuICAgIHN1bSArPSByZWNvcmQucmVjb3Jkc1tpXTtcbiAgfVxuXG4gIHZhciBhdmcgPSBzdW0vcmVjb3JkLnJlY29yZHMubGVuZ3RoO1xuXG4gIHJlY29yZC52YWx1ZSA9IGF2ZztcbiAgdGhpcy5fZnJhbWVQZXJmLnB1c2goZGlmZik7XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuX3JlbmRlckRhdGEgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy52aWRlby5jdHgudGV4dEFsaWduID0gJ3JpZ2h0JztcbiAgdGhpcy52aWRlby5jdHgudGV4dEJhc2VsaW5lID0gJ3RvcCc7XG5cbiAgdmFyIHggPSB0aGlzLmFwcC53aWR0aCAtIDE0O1xuICB2YXIgeSA9IDE0O1xuXG4gIGlmICh0aGlzLnNob3dGcHMpIHtcbiAgICB0aGlzLl9yZW5kZXJUZXh0KE1hdGgucm91bmQodGhpcy5mcHMpICsgJyBmcHMnLCB4LCB5KTtcbiAgfVxuXG4gIHkgKz0gMjQ7XG5cbiAgdGhpcy5fc2V0Rm9udCgxNSwgJ3NhbnMtc2VyaWYnKTtcblxuICBpZiAodGhpcy5zaG93S2V5Q29kZXMpIHtcbiAgICB2YXIgYnV0dG9uTmFtZSA9ICcnO1xuICAgIGlmICh0aGlzLmFwcC5pbnB1dC5tb3VzZS5pc0xlZnREb3duKSB7XG4gICAgICBidXR0b25OYW1lID0gJ2xlZnQnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hcHAuaW5wdXQubW91c2UuaXNSaWdodERvd24pIHtcbiAgICAgIGJ1dHRvbk5hbWUgPSAncmlnaHQnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hcHAuaW5wdXQubW91c2UuaXNNaWRkbGVEb3duKSB7XG4gICAgICBidXR0b25OYW1lID0gJ21pZGRsZSc7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVuZGVyVGV4dCgna2V5ICcgKyB0aGlzLmxhc3RLZXksIHgsIHksIHRoaXMuYXBwLmlucHV0LmlzS2V5RG93bih0aGlzLmxhc3RLZXkpID8gJyNlOWRjN2MnIDogJ3doaXRlJyk7XG4gICAgdGhpcy5fcmVuZGVyVGV4dCgnYnRuICcgKyBidXR0b25OYW1lLCB4IC0gNjAsIHksIHRoaXMuYXBwLmlucHV0Lm1vdXNlLmlzRG93biA/ICcjZTlkYzdjJyA6ICd3aGl0ZScpO1xuXG4gICAgZm9yICh2YXIgaT0wOyBpPHRoaXMuX3BlcmZOYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5hbWUgPSB0aGlzLl9wZXJmTmFtZXNbaV07XG4gICAgICB2YXIgdmFsdWUgPSB0aGlzLl9wZXJmVmFsdWVzW25hbWVdO1xuXG4gICAgICB5ICs9IDI0O1xuICAgICAgdGhpcy5fcmVuZGVyVGV4dChuYW1lICsgJzogJyArICB2YWx1ZS52YWx1ZS50b0ZpeGVkKDMpICsgJ21zJywgeCwgeSk7XG4gICAgfVxuICB9XG59O1xuXG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5fcmVuZGVyU2hvcnRjdXRzID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmVuYWJsZVNob3J0Y3V0cykge1xuICAgIHZhciBoZWlnaHQgPSAyODtcblxuICAgIHRoaXMuX3NldEZvbnQoMjAsICdIZWx2ZXRpY2EgTmV1ZSwgc2Fucy1zZXJpZicpO1xuICAgIHRoaXMudmlkZW8uY3R4LnRleHRBbGlnbiA9ICdsZWZ0JztcbiAgICB0aGlzLnZpZGVvLmN0eC50ZXh0QmFzZWxpbmUgPSAndG9wJztcbiAgICB2YXIgbWF4UGVyQ29sbHVtbiA9IE1hdGguZmxvb3IoKHRoaXMuYXBwLmhlaWdodCAtIDE0KS9oZWlnaHQpO1xuXG4gICAgZm9yICh2YXIgaT0wOyBpPHRoaXMub3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG9wdGlvbiA9IHRoaXMub3B0aW9uc1tpXTtcbiAgICAgIHZhciB4ID0gMTQgKyBNYXRoLmZsb29yKGkvbWF4UGVyQ29sbHVtbikgKiAzMjA7XG4gICAgICB2YXIgeSA9IDE0ICsgaSVtYXhQZXJDb2xsdW1uICogaGVpZ2h0O1xuXG4gICAgICB2YXIga2V5SW5kZXggPSBpICsgMTtcbiAgICAgIHZhciBjaGFySWQgPSBpbmRleFRvTnVtYmVyQW5kTG93ZXJDYXNlS2V5KGtleUluZGV4KTtcblxuICAgICAgdmFyIGlzT24gPSB0aGlzW29wdGlvbi5lbnRyeV07XG5cbiAgICAgIHZhciBzaG9ydGN1dCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2hhcklkKTtcblxuICAgICAgaWYgKCFjaGFySWQpIHtcbiAgICAgICAgc2hvcnRjdXQgPSAnXisnICsgU3RyaW5nLmZyb21DaGFyQ29kZShpbmRleFRvTnVtYmVyQW5kTG93ZXJDYXNlS2V5KGtleUluZGV4IC0gMzYpKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRleHQgPSAnWycgKyBzaG9ydGN1dCArICddICcgKyBvcHRpb24ubmFtZTtcbiAgICAgIGlmIChvcHRpb24udHlwZSA9PT0gJ3RvZ2dsZScpIHtcbiAgICAgICAgdGV4dCArPSAnICgnICsgKGlzT24gPyAnT04nIDogJ09GRicpICsgJyknO1xuICAgICAgfSBlbHNlIGlmIChvcHRpb24udHlwZSA9PT0gJ2NhbGwnKSB7XG4gICAgICAgIHRleHQgKz0gJyAoQ0FMTCknO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29sb3IgPSAncmdiYSgyNTUsIDI1NSwgMjU1LCAxKSc7XG4gICAgICB2YXIgb3V0bGluZSA9ICdyZ2JhKDAsIDAsIDAsIDEpJztcblxuICAgICAgaWYgKCFpc09uKSB7XG4gICAgICAgIGNvbG9yID0gJ3JnYmEoMjU1LCAyNTUsIDI1NSwgLjcpJztcbiAgICAgICAgb3V0bGluZSA9ICdyZ2JhKDAsIDAsIDAsIC43KSc7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3JlbmRlclRleHQodGV4dCwgeCwgeSwgY29sb3IsIG91dGxpbmUpO1xuICAgIH1cbiAgfVxufTtcblxuRGVidWdnZXIucHJvdG90eXBlLl9yZW5kZXJUZXh0ID0gZnVuY3Rpb24odGV4dCwgeCwgeSwgY29sb3IsIG91dGxpbmUpIHtcbiAgY29sb3IgPSBjb2xvciB8fCAnd2hpdGUnO1xuICBvdXRsaW5lID0gb3V0bGluZSB8fCAnYmxhY2snO1xuICB0aGlzLnZpZGVvLmN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgdGhpcy52aWRlby5jdHgubGluZUpvaW4gPSAncm91bmQnO1xuICB0aGlzLnZpZGVvLmN0eC5zdHJva2VTdHlsZSA9IG91dGxpbmU7XG4gIHRoaXMudmlkZW8uY3R4LmxpbmVXaWR0aCA9IDM7XG4gIHRoaXMudmlkZW8uY3R4LnN0cm9rZVRleHQodGV4dCwgeCwgeSk7XG4gIHRoaXMudmlkZW8uY3R4LmZpbGxUZXh0KHRleHQsIHgsIHkpO1xuXG4gIHZhciB3aWR0aCA9IHRoaXMudmlkZW8uY3R4Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoO1xuXG4gIHZhciBkeCA9IHggLSA1O1xuICB2YXIgZHkgPSB5O1xuICB2YXIgZHdpZHRoID0gd2lkdGggKyAxMDtcbiAgdmFyIGRoZWlnaHQgPSB0aGlzLl9mb250U2l6ZSArIDEwO1xuXG4gIGlmICh0aGlzLnZpZGVvLmN0eC50ZXh0QWxpZ24gPT09ICdyaWdodCcpIHtcbiAgICBkeCA9IHggLSA1IC0gd2lkdGg7XG4gIH1cblxuICB0aGlzLl9kaXJ0eU1hbmFnZXIuYWRkUmVjdChkeCwgZHksIGR3aWR0aCwgZGhlaWdodCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERlYnVnZ2VyO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcG90aW9uLWRlYnVnZ2VyL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAxMlxuICoqLyIsInZhciBpc1JldGluYSA9IHJlcXVpcmUoJy4vcmV0aW5hJykoKTtcblxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR9IGNhbnZhcyAtIENhbnZhcyBET00gZWxlbWVudFxuICovXG52YXIgVmlkZW8gPSBmdW5jdGlvbihnYW1lLCBjYW52YXMsIGNvbmZpZykge1xuICB0aGlzLmdhbWUgPSBnYW1lO1xuXG4gIHRoaXMuY29uZmlnID0gY29uZmlnO1xuXG4gIHRoaXMuY2FudmFzID0gY2FudmFzO1xuXG4gIHRoaXMud2lkdGggPSBnYW1lLndpZHRoO1xuXG4gIHRoaXMuaGVpZ2h0ID0gZ2FtZS5oZWlnaHQ7XG5cbiAgaWYgKGNvbmZpZy5pbml0aWFsaXplQ2FudmFzKSB7XG4gICAgdGhpcy5jdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgfVxuXG4gIHRoaXMuX2FwcGx5U2l6ZVRvQ2FudmFzKCk7XG59O1xuXG4vKipcbiAqIEluY2x1ZGVzIG1peGlucyBpbnRvIFZpZGVvIGxpYnJhcnlcbiAqIEBwYXJhbSB7b2JqZWN0fSBtZXRob2RzIC0gb2JqZWN0IG9mIG1ldGhvZHMgdGhhdCB3aWxsIGluY2x1ZGVkIGluIFZpZGVvXG4gKi9cblZpZGVvLnByb3RvdHlwZS5pbmNsdWRlID0gZnVuY3Rpb24obWV0aG9kcykge1xuICBmb3IgKHZhciBtZXRob2QgaW4gbWV0aG9kcykge1xuICAgIHRoaXNbbWV0aG9kXSA9IG1ldGhvZHNbbWV0aG9kXTtcbiAgfVxufTtcblxuVmlkZW8ucHJvdG90eXBlLmJlZ2luRnJhbWUgPSBmdW5jdGlvbigpIHt9O1xuXG5WaWRlby5wcm90b3R5cGUuZW5kRnJhbWUgPSBmdW5jdGlvbigpIHt9O1xuXG5WaWRlby5wcm90b3R5cGUuc2NhbGVDYW52YXMgPSBmdW5jdGlvbihzY2FsZSkge1xuICB0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9IHRoaXMuY2FudmFzLndpZHRoICsgJ3B4JztcbiAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0ICsgJ3B4JztcblxuICB0aGlzLmNhbnZhcy53aWR0aCAqPSBzY2FsZTtcbiAgdGhpcy5jYW52YXMuaGVpZ2h0ICo9IHNjYWxlO1xuXG4gIGlmICh0aGlzLmN0eCkge1xuICAgIHRoaXMuY3R4LnNjYWxlKHNjYWxlLCBzY2FsZSk7XG4gIH1cbn07XG5cblZpZGVvLnByb3RvdHlwZS5zZXRTaXplID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICB0aGlzLndpZHRoID0gd2lkdGg7XG4gIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gIHRoaXMuX2FwcGx5U2l6ZVRvQ2FudmFzKCk7XG59O1xuXG5WaWRlby5wcm90b3R5cGUuX2FwcGx5U2l6ZVRvQ2FudmFzID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcbiAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cbiAgdmFyIGNvbnRhaW5lciA9IHRoaXMuY2FudmFzLnBhcmVudEVsZW1lbnQ7XG4gIGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGggKyAncHgnO1xuICBjb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyAncHgnO1xuXG4gIGlmICh0aGlzLmNvbmZpZy51c2VSZXRpbmEgJiYgaXNSZXRpbmEpIHtcbiAgICB0aGlzLnNjYWxlQ2FudmFzKDIpO1xuICB9XG59O1xuXG5WaWRlby5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuY3R4KSB7IHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7IH1cbn07XG5cblZpZGVvLnByb3RvdHlwZS5jcmVhdGVMYXllciA9IGZ1bmN0aW9uKGNvbmZpZykge1xuICBjb25maWcgPSBjb25maWcgfHwge307XG5cbiAgdmFyIGNvbnRhaW5lciA9IHRoaXMuY2FudmFzLnBhcmVudEVsZW1lbnQ7XG4gIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcbiAgY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICBjYW52YXMuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICBjYW52YXMuc3R5bGUudG9wID0gJzBweCc7XG4gIGNhbnZhcy5zdHlsZS5sZWZ0ID0gJzBweCc7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjYW52YXMpO1xuXG4gIHZhciB2aWRlbyA9IG5ldyBWaWRlbyh0aGlzLmdhbWUsIGNhbnZhcywgY29uZmlnKTtcblxuICByZXR1cm4gdmlkZW87XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZGVvO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvdmlkZW8uanNcbiAqKi8iLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG52YXIgUG90aW9uQXVkaW8gPSByZXF1aXJlKCdwb3Rpb24tYXVkaW8nKTtcblxudmFyIEpzb25Mb2FkZXIgPSByZXF1aXJlKCcuL2xvYWRlci9qc29uLWxvYWRlcicpO1xudmFyIGltYWdlTG9hZGVyID0gcmVxdWlyZSgnLi9sb2FkZXIvaW1hZ2UtbG9hZGVyJyk7XG52YXIgdGV4dExvYWRlciA9IHJlcXVpcmUoJy4vbG9hZGVyL3RleHQtbG9hZGVyJyk7XG5cbi8qKlxuICogQ2xhc3MgZm9yIG1hbmFnaW5nIGFuZCBsb2FkaW5nIGFzc2V0IGZpbGVzXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIEFzc2V0cyA9IGZ1bmN0aW9uKCkge1xuICAvKipcbiAgICogSXMgY3VycmVudGx5IGxvYWRpbmcgYW55IGFzc2V0c1xuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG5cbiAgdGhpcy5pdGVtc0NvdW50ID0gMDtcbiAgdGhpcy5sb2FkZWRJdGVtc0NvdW50ID0gMDtcbiAgdGhpcy5wcm9ncmVzcyA9IDA7XG5cbiAgdGhpcy5fdGhpbmdzVG9Mb2FkID0gMDtcbiAgdGhpcy5fZGF0YSA9IHt9O1xuICB0aGlzLl9wcmVsb2FkaW5nID0gdHJ1ZTtcblxuICB0aGlzLl9jYWxsYmFjayA9IG51bGw7XG5cbiAgdGhpcy5fdG9Mb2FkID0gW107XG5cbiAgdGhpcy5fbG9hZGVycyA9IHt9O1xuXG4gIHRoaXMuYXVkaW8gPSBuZXcgUG90aW9uQXVkaW8oKTtcblxuICB0aGlzLmFkZExvYWRlcignanNvbicsIEpzb25Mb2FkZXIpO1xuXG4gIHRoaXMuYWRkTG9hZGVyKCdtcDMnLCB0aGlzLmF1ZGlvLmxvYWQuYmluZCh0aGlzLmF1ZGlvKSk7XG4gIHRoaXMuYWRkTG9hZGVyKCdtdXNpYycsIHRoaXMuYXVkaW8ubG9hZC5iaW5kKHRoaXMuYXVkaW8pKTtcbiAgdGhpcy5hZGRMb2FkZXIoJ3NvdW5kJywgdGhpcy5hdWRpby5sb2FkLmJpbmQodGhpcy5hdWRpbykpO1xuXG4gIHRoaXMuYWRkTG9hZGVyKCdpbWFnZScsIGltYWdlTG9hZGVyKTtcbiAgdGhpcy5hZGRMb2FkZXIoJ3RleHR1cmUnLCBpbWFnZUxvYWRlcik7XG4gIHRoaXMuYWRkTG9hZGVyKCdzcHJpdGUnLCBpbWFnZUxvYWRlcik7XG59O1xuXG5Bc3NldHMucHJvdG90eXBlLmFkZExvYWRlciA9IGZ1bmN0aW9uKG5hbWUsIGZuKSB7XG4gIHRoaXMuX2xvYWRlcnNbbmFtZV0gPSBmbjtcbn07XG5cbi8qKlxuICogU3RhcnRzIGxvYWRpbmcgc3RvcmVkIGFzc2V0cyB1cmxzIGFuZCBydW5zIGdpdmVuIGNhbGxiYWNrIGFmdGVyIGV2ZXJ5dGhpbmcgaXMgbG9hZGVkXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gKi9cbkFzc2V0cy5wcm90b3R5cGUub25sb2FkID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgdGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcblxuICBpZiAodGhpcy5fdGhpbmdzVG9Mb2FkID09PSAwKSB7XG4gICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLl9wcmVsb2FkaW5nID0gZmFsc2U7XG4gICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fbmV4dEZpbGUoKTtcbiAgfVxufTtcblxuLyoqXG4gKiBHZXR0ZXIgZm9yIGxvYWRlZCBhc3NldHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdXJsIG9mIHN0b3JlZCBhc3NldFxuICovXG5Bc3NldHMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgcmV0dXJuIHRoaXMuX2RhdGFbcGF0aC5ub3JtYWxpemUobmFtZSldO1xufTtcblxuQXNzZXRzLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHRoaXMuc2V0KG5hbWUsIG51bGwpO1xufTtcblxuXG4vKipcbiAqIFVzZWQgZm9yIHN0b3Jpbmcgc29tZSB2YWx1ZSBpbiBhc3NldHMgbW9kdWxlXG4gKiB1c2VmdWwgZm9yIG92ZXJyYXRpbmcgdmFsdWVzXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHVybCBvZiB0aGUgYXNzZXRcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZSAtIHZhbHVlIHRvIGJlIHN0b3JlZFxuICovXG5Bc3NldHMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHRoaXMuX2RhdGFbcGF0aC5ub3JtYWxpemUobmFtZSldID0gdmFsdWU7XG59O1xuXG4vKipcbiAqIFN0b3JlcyB1cmwgc28gaXQgY2FuIGJlIGxvYWRlZCBsYXRlclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSB0eXBlIG9mIGFzc2V0XG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gdXJsIG9mIGdpdmVuIGFzc2V0XG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gKi9cbkFzc2V0cy5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uKHR5cGUsIHVybCwgY2FsbGJhY2spIHtcbiAgdmFyIGxvYWRPYmplY3QgPSB7IHR5cGU6IHR5cGUsIHVybDogdXJsICE9IG51bGwgPyBwYXRoLm5vcm1hbGl6ZSh1cmwpIDogbnVsbCwgY2FsbGJhY2s6IGNhbGxiYWNrIH07XG5cbiAgaWYgKHRoaXMuX3ByZWxvYWRpbmcpIHtcbiAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XG4gICAgdGhpcy5pdGVtc0NvdW50ICs9IDE7XG4gICAgdGhpcy5fdGhpbmdzVG9Mb2FkICs9IDE7XG5cbiAgICB0aGlzLl90b0xvYWQucHVzaChsb2FkT2JqZWN0KTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5fbG9hZEFzc2V0RmlsZShsb2FkT2JqZWN0LCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBzZWxmLnNldChsb2FkT2JqZWN0LnVybCwgZGF0YSk7XG4gICAgICBpZiAoY2FsbGJhY2spIHsgY2FsbGJhY2soZGF0YSk7IH1cbiAgICB9KTtcbiAgfVxufTtcblxuQXNzZXRzLnByb3RvdHlwZS5fZmluaXNoZWRPbmVGaWxlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX25leHRGaWxlKCk7XG4gIHRoaXMucHJvZ3Jlc3MgPSB0aGlzLmxvYWRlZEl0ZW1zQ291bnQgLyB0aGlzLml0ZW1zQ291bnQ7XG4gIHRoaXMuX3RoaW5nc1RvTG9hZCAtPSAxO1xuICB0aGlzLmxvYWRlZEl0ZW1zQ291bnQgKz0gMTtcblxuICBpZiAodGhpcy5fdGhpbmdzVG9Mb2FkID09PSAwKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBzZWxmLl9jYWxsYmFjaygpO1xuICAgICAgc2VsZi5fcHJlbG9hZGluZyA9IGZhbHNlO1xuICAgICAgc2VsZi5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICB9LCAwKTtcbiAgfVxufTtcblxuQXNzZXRzLnByb3RvdHlwZS5fZXJyb3IgPSBmdW5jdGlvbih1cmwpIHtcbiAgY29uc29sZS53YXJuKCdFcnJvciBsb2FkaW5nIFwiJyArIHVybCArICdcIiBhc3NldCcpO1xuICB0aGlzLl9uZXh0RmlsZSgpO1xufTtcblxuQXNzZXRzLnByb3RvdHlwZS5fc2F2ZSA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgdGhpcy5zZXQodXJsLCBkYXRhKTtcbiAgaWYgKGNhbGxiYWNrKSB7IGNhbGxiYWNrKGRhdGEpOyB9XG4gIHRoaXMuX2ZpbmlzaGVkT25lRmlsZSgpO1xufTtcblxuQXNzZXRzLnByb3RvdHlwZS5faGFuZGxlQ3VzdG9tTG9hZGluZyA9IGZ1bmN0aW9uKGxvYWRpbmcpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgZG9uZSA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgc2VsZi5fc2F2ZShuYW1lLCB2YWx1ZSk7XG4gIH07XG4gIGxvYWRpbmcoZG9uZSk7XG59O1xuXG5Bc3NldHMucHJvdG90eXBlLl9uZXh0RmlsZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY3VycmVudCA9IHRoaXMuX3RvTG9hZC5zaGlmdCgpO1xuXG4gIGlmICghY3VycmVudCkgeyByZXR1cm47IH1cblxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX2xvYWRBc3NldEZpbGUoY3VycmVudCwgZnVuY3Rpb24oZGF0YSkge1xuICAgIHNlbGYuX3NhdmUoY3VycmVudC51cmwsIGRhdGEsIGN1cnJlbnQuY2FsbGJhY2spO1xuICB9KTtcbn07XG5cbkFzc2V0cy5wcm90b3R5cGUuX2xvYWRBc3NldEZpbGUgPSBmdW5jdGlvbihmaWxlLCBjYWxsYmFjaykge1xuICB2YXIgdHlwZSA9IGZpbGUudHlwZTtcbiAgdmFyIHVybCA9IGZpbGUudXJsO1xuXG4gIGlmICh1dGlsLmlzRnVuY3Rpb24odHlwZSkpIHtcbiAgICB0aGlzLl9oYW5kbGVDdXN0b21Mb2FkaW5nKHR5cGUpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHR5cGUgPSB0eXBlLnRvTG93ZXJDYXNlKCk7XG5cbiAgdmFyIGxvYWRlciA9IHRoaXMuX2xvYWRlcnNbdHlwZV0gfHwgdGV4dExvYWRlcjtcbiAgbG9hZGVyKHVybCwgY2FsbGJhY2ssIHRoaXMuX2Vycm9yLmJpbmQodGhpcykpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBc3NldHM7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9hc3NldHMuanNcbiAqKi8iLCJ2YXIga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG52YXIgaW52S2V5cyA9IHt9O1xuZm9yICh2YXIga2V5TmFtZSBpbiBrZXlzKSB7XG4gIGludktleXNba2V5c1trZXlOYW1lXV0gPSBrZXlOYW1lO1xufVxuXG52YXIgSW5wdXQgPSBmdW5jdGlvbihnYW1lLCBjb250YWluZXIpIHtcbiAgdGhpcy5fY29udGFpbmVyID0gY29udGFpbmVyO1xuICB0aGlzLl9rZXlzID0ge307XG5cbiAgdGhpcy5jYW5Db250cm9sS2V5cyA9IHRydWU7XG5cbiAgdGhpcy5tb3VzZSA9IHtcbiAgICBpc0Rvd246IGZhbHNlLFxuICAgIGlzTGVmdERvd246IGZhbHNlLFxuICAgIGlzTWlkZGxlRG93bjogZmFsc2UsXG4gICAgaXNSaWdodERvd246IGZhbHNlLFxuICAgIHg6IG51bGwsXG4gICAgeTogbnVsbFxuICB9O1xuXG4gIHRoaXMuX2FkZEV2ZW50cyhnYW1lKTtcbn07XG5cbklucHV0LnByb3RvdHlwZS5yZXNldEtleXMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fa2V5cyA9IHt9O1xufTtcblxuSW5wdXQucHJvdG90eXBlLmlzS2V5RG93biA9IGZ1bmN0aW9uKGtleSkge1xuICBpZiAoa2V5ID09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgaWYgKHRoaXMuY2FuQ29udHJvbEtleXMpIHtcbiAgICB2YXIgY29kZSA9IHR5cGVvZiBrZXkgPT09ICdudW1iZXInID8ga2V5IDoga2V5c1trZXkudG9Mb3dlckNhc2UoKV07XG4gICAgcmV0dXJuIHRoaXMuX2tleXNbY29kZV07XG4gIH1cbn07XG5cbklucHV0LnByb3RvdHlwZS5fYWRkRXZlbnRzID0gZnVuY3Rpb24oZ2FtZSkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIG1vdXNlRXZlbnQgPSB7XG4gICAgeDogbnVsbCxcbiAgICB5OiBudWxsLFxuICAgIGJ1dHRvbjogbnVsbCxcbiAgICBldmVudDogbnVsbCxcbiAgICBzdGF0ZVByZXZlbnREZWZhdWx0OiBmdW5jdGlvbigpIHtcbiAgICAgIGdhbWUuc3RhdGVzLl9wcmV2ZW50RXZlbnQgPSB0cnVlO1xuICAgIH1cbiAgfTtcblxuICB2YXIga2V5Ym9hcmRFdmVudCA9IHtcbiAgICBrZXk6IG51bGwsXG4gICAgbmFtZTogbnVsbCxcbiAgICBldmVudDogbnVsbCxcbiAgICBzdGF0ZVByZXZlbnREZWZhdWx0OiBmdW5jdGlvbigpIHtcbiAgICAgIGdhbWUuc3RhdGVzLl9wcmV2ZW50RXZlbnQgPSB0cnVlO1xuICAgIH1cbiAgfTtcblxuICBzZWxmLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24oZSkge1xuICAgIHZhciB4ID0gZS5vZmZzZXRYID09PSB1bmRlZmluZWQgPyBlLmxheWVyWCAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRMZWZ0IDogZS5vZmZzZXRYO1xuICAgIHZhciB5ID0gZS5vZmZzZXRZID09PSB1bmRlZmluZWQgPyBlLmxheWVyWSAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRUb3AgOiBlLm9mZnNldFk7XG5cbiAgICBzZWxmLm1vdXNlLnggPSB4O1xuICAgIHNlbGYubW91c2UueSA9IHk7XG5cbiAgICBtb3VzZUV2ZW50LnggPSB4O1xuICAgIG1vdXNlRXZlbnQueSA9IHk7XG4gICAgbW91c2VFdmVudC5idXR0b24gPSBudWxsO1xuICAgIG1vdXNlRXZlbnQuZXZlbnQgPSBlO1xuXG4gICAgZ2FtZS5zdGF0ZXMubW91c2Vtb3ZlKG1vdXNlRXZlbnQpO1xuICB9KTtcblxuICBzZWxmLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgeCA9IGUub2Zmc2V0WCA9PT0gdW5kZWZpbmVkID8gZS5sYXllclggLSBzZWxmLl9jb250YWluZXIub2Zmc2V0TGVmdCA6IGUub2Zmc2V0WDtcbiAgICB2YXIgeSA9IGUub2Zmc2V0WSA9PT0gdW5kZWZpbmVkID8gZS5sYXllclkgLSBzZWxmLl9jb250YWluZXIub2Zmc2V0VG9wIDogZS5vZmZzZXRZO1xuXG4gICAgc2VsZi5tb3VzZS5pc0Rvd24gPSBmYWxzZTtcblxuICAgIHN3aXRjaCAoZS5idXR0b24pIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgc2VsZi5tb3VzZS5pc0xlZnREb3duID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgc2VsZi5tb3VzZS5pc01pZGRsZURvd24gPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHNlbGYubW91c2UuaXNSaWdodERvd24gPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgbW91c2VFdmVudC54ID0geDtcbiAgICBtb3VzZUV2ZW50LnkgPSB5O1xuICAgIG1vdXNlRXZlbnQuYnV0dG9uID0gZS5idXR0b247XG4gICAgbW91c2VFdmVudC5ldmVudCA9IGU7XG5cbiAgICBnYW1lLnN0YXRlcy5tb3VzZXVwKG1vdXNlRXZlbnQpO1xuICB9LCBmYWxzZSk7XG5cbiAgc2VsZi5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgeCA9IGUub2Zmc2V0WCA9PT0gdW5kZWZpbmVkID8gZS5sYXllclggLSBzZWxmLl9jb250YWluZXIub2Zmc2V0TGVmdCA6IGUub2Zmc2V0WDtcbiAgICB2YXIgeSA9IGUub2Zmc2V0WSA9PT0gdW5kZWZpbmVkID8gZS5sYXllclkgLSBzZWxmLl9jb250YWluZXIub2Zmc2V0VG9wIDogZS5vZmZzZXRZO1xuXG4gICAgc2VsZi5tb3VzZS54ID0geDtcbiAgICBzZWxmLm1vdXNlLnkgPSB5O1xuICAgIHNlbGYubW91c2UuaXNEb3duID0gdHJ1ZTtcblxuICAgIHN3aXRjaCAoZS5idXR0b24pIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgc2VsZi5tb3VzZS5pc0xlZnREb3duID0gdHJ1ZTtcbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICBzZWxmLm1vdXNlLmlzTWlkZGxlRG93biA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBzZWxmLm1vdXNlLmlzUmlnaHREb3duID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgbW91c2VFdmVudC54ID0geDtcbiAgICBtb3VzZUV2ZW50LnkgPSB5O1xuICAgIG1vdXNlRXZlbnQuYnV0dG9uID0gZS5idXR0b247XG4gICAgbW91c2VFdmVudC5ldmVudCA9IGU7XG5cbiAgICBnYW1lLnN0YXRlcy5tb3VzZWRvd24obW91c2VFdmVudCk7XG4gIH0sIGZhbHNlKTtcblxuICBzZWxmLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBmb3IgKHZhciBpPTA7IGk8ZS50b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdG91Y2ggPSBlLnRvdWNoZXNbaV07XG5cbiAgICAgIHZhciB4ID0gdG91Y2gucGFnZVggLSBzZWxmLl9jb250YWluZXIub2Zmc2V0TGVmdDtcbiAgICAgIHZhciB5ID0gdG91Y2gucGFnZVkgLSBzZWxmLl9jb250YWluZXIub2Zmc2V0VG9wO1xuXG4gICAgICBzZWxmLm1vdXNlLnggPSB4O1xuICAgICAgc2VsZi5tb3VzZS55ID0geTtcbiAgICAgIHNlbGYubW91c2UuaXNEb3duID0gdHJ1ZTtcbiAgICAgIHNlbGYubW91c2UuaXNMZWZ0RG93biA9IHRydWU7XG5cbiAgICAgIG1vdXNlRXZlbnQueCA9IHg7XG4gICAgICBtb3VzZUV2ZW50LnkgPSB5O1xuICAgICAgbW91c2VFdmVudC5idXR0b24gPSAxO1xuICAgICAgbW91c2VFdmVudC5ldmVudCA9IGU7XG5cbiAgICAgIGdhbWUuc3RhdGVzLm1vdXNlZG93bihlKTtcbiAgICB9XG4gIH0pO1xuXG4gIHNlbGYuX2NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgZm9yICh2YXIgaT0wOyBpPGUudG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHRvdWNoID0gZS50b3VjaGVzW2ldO1xuXG4gICAgICB2YXIgeCA9IHRvdWNoLnBhZ2VYIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldExlZnQ7XG4gICAgICB2YXIgeSA9IHRvdWNoLnBhZ2VZIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldFRvcDtcblxuICAgICAgc2VsZi5tb3VzZS54ID0geDtcbiAgICAgIHNlbGYubW91c2UueSA9IHk7XG4gICAgICBzZWxmLm1vdXNlLmlzRG93biA9IHRydWU7XG4gICAgICBzZWxmLm1vdXNlLmlzTGVmdERvd24gPSB0cnVlO1xuXG4gICAgICBtb3VzZUV2ZW50LnggPSB4O1xuICAgICAgbW91c2VFdmVudC55ID0geTtcbiAgICAgIG1vdXNlRXZlbnQuZXZlbnQgPSBlO1xuXG4gICAgICBnYW1lLnN0YXRlcy5tb3VzZW1vdmUoZSk7XG4gICAgfVxuICB9KTtcblxuICBzZWxmLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdmFyIHRvdWNoID0gZS5jaGFuZ2VkVG91Y2hlc1swXTtcblxuICAgIHZhciB4ID0gdG91Y2gucGFnZVggLSBzZWxmLl9jb250YWluZXIub2Zmc2V0TGVmdDtcbiAgICB2YXIgeSA9IHRvdWNoLnBhZ2VZIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldFRvcDtcblxuICAgIHNlbGYubW91c2UueCA9IHg7XG4gICAgc2VsZi5tb3VzZS55ID0geTtcbiAgICBzZWxmLm1vdXNlLmlzRG93biA9IGZhbHNlO1xuICAgIHNlbGYubW91c2UuaXNMZWZ0RG93biA9IGZhbHNlO1xuXG4gICAgbW91c2VFdmVudC54ID0geDtcbiAgICBtb3VzZUV2ZW50LnkgPSB5O1xuICAgIG1vdXNlRXZlbnQuZXZlbnQgPSBlO1xuXG4gICAgZ2FtZS5zdGF0ZXMubW91c2V1cChlKTtcbiAgfSk7XG5cbiAgc2VsZi5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfSk7XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtcbiAgICBzZWxmLl9rZXlzW2Uua2V5Q29kZV0gPSB0cnVlO1xuXG4gICAga2V5Ym9hcmRFdmVudC5rZXkgPSBlLndoaWNoO1xuICAgIGtleWJvYXJkRXZlbnQubmFtZSA9IGludktleXNbZS53aGljaF07XG4gICAga2V5Ym9hcmRFdmVudC5ldmVudCA9IGU7XG5cbiAgICBnYW1lLnN0YXRlcy5rZXlkb3duKGtleWJvYXJkRXZlbnQpO1xuICB9KTtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBzZWxmLl9rZXlzW2Uua2V5Q29kZV0gPSBmYWxzZTtcblxuICAgIGtleWJvYXJkRXZlbnQua2V5ID0gZS53aGljaDtcbiAgICBrZXlib2FyZEV2ZW50Lm5hbWUgPSBpbnZLZXlzW2Uud2hpY2hdO1xuICAgIGtleWJvYXJkRXZlbnQuZXZlbnQgPSBlO1xuXG4gICAgZ2FtZS5zdGF0ZXMua2V5dXAoa2V5Ym9hcmRFdmVudCk7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dDtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2lucHV0LmpzXG4gKiovIiwidmFyIERpcnR5TWFuYWdlciA9IGZ1bmN0aW9uKGNhbnZhcywgY3R4KSB7XG4gIHRoaXMuY3R4ID0gY3R4O1xuICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcblxuICB0aGlzLnRvcCA9IGNhbnZhcy5oZWlnaHQ7XG4gIHRoaXMubGVmdCA9IGNhbnZhcy53aWR0aDtcbiAgdGhpcy5ib3R0b20gPSAwO1xuICB0aGlzLnJpZ2h0ID0gMDtcblxuICB0aGlzLmlzRGlydHkgPSBmYWxzZTtcbn07XG5cbkRpcnR5TWFuYWdlci5wcm90b3R5cGUuYWRkUmVjdCA9IGZ1bmN0aW9uKGxlZnQsIHRvcCwgd2lkdGgsIGhlaWdodCkge1xuICB2YXIgcmlnaHQgID0gbGVmdCArIHdpZHRoO1xuICB2YXIgYm90dG9tID0gdG9wICsgaGVpZ2h0O1xuXG4gIHRoaXMudG9wICAgID0gdG9wIDwgdGhpcy50b3AgICAgICAgPyB0b3AgICAgOiB0aGlzLnRvcDtcbiAgdGhpcy5sZWZ0ICAgPSBsZWZ0IDwgdGhpcy5sZWZ0ICAgICA/IGxlZnQgICA6IHRoaXMubGVmdDtcbiAgdGhpcy5ib3R0b20gPSBib3R0b20gPiB0aGlzLmJvdHRvbSA/IGJvdHRvbSA6IHRoaXMuYm90dG9tO1xuICB0aGlzLnJpZ2h0ICA9IHJpZ2h0ID4gdGhpcy5yaWdodCAgID8gcmlnaHQgIDogdGhpcy5yaWdodDtcblxuICB0aGlzLmlzRGlydHkgPSB0cnVlO1xufTtcblxuRGlydHlNYW5hZ2VyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMuaXNEaXJ0eSkgeyByZXR1cm47IH1cblxuICB0aGlzLmN0eC5jbGVhclJlY3QodGhpcy5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3AsXG4gICAgICAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0IC0gdGhpcy5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3R0b20gLSB0aGlzLnRvcCk7XG5cbiAgdGhpcy5sZWZ0ID0gdGhpcy5jYW52YXMud2lkdGg7XG4gIHRoaXMudG9wID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xuICB0aGlzLnJpZ2h0ID0gMDtcbiAgdGhpcy5ib3R0b20gPSAwO1xuXG4gIHRoaXMuaXNEaXJ0eSA9IGZhbHNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXJ0eU1hbmFnZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9wb3Rpb24tZGVidWdnZXIvZGlydHktbWFuYWdlci5qc1xuICoqIG1vZHVsZSBpZCA9IDExXG4gKiogbW9kdWxlIGNodW5rcyA9IDEyXG4gKiovIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3V0aWwvdXRpbC5qc1xuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDEyXG4gKiovIiwidmFyIGlzUmV0aW5hID0gZnVuY3Rpb24oKSB7XG4gIHZhciBtZWRpYVF1ZXJ5ID0gXCIoLXdlYmtpdC1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAxLjUpLFxcXG4gIChtaW4tLW1vei1kZXZpY2UtcGl4ZWwtcmF0aW86IDEuNSksXFxcbiAgKC1vLW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDMvMiksXFxcbiAgKG1pbi1yZXNvbHV0aW9uOiAxLjVkcHB4KVwiO1xuXG4gIGlmICh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA+IDEpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhICYmIHdpbmRvdy5tYXRjaE1lZGlhKG1lZGlhUXVlcnkpLm1hdGNoZXMpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc1JldGluYTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JldGluYS5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXJsLCBjYWxsYmFjaywgZXJyb3IpIHtcbiAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ3RleHQnO1xuICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICByZXR1cm4gZXJyb3IodXJsKTtcbiAgICB9XG5cbiAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSk7XG4gICAgY2FsbGJhY2soZGF0YSk7XG4gIH07XG4gIHJlcXVlc3Quc2VuZCgpO1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xvYWRlci9qc29uLWxvYWRlci5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXJsLCBjYWxsYmFjaywgZXJyb3IpIHtcbiAgdmFyIGltYWdlID0gbmV3IEltYWdlKCk7XG4gIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIGNhbGxiYWNrKGltYWdlKTtcbiAgfTtcbiAgaW1hZ2Uub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgIGVycm9yKHVybCk7XG4gIH07XG4gIGltYWdlLnNyYyA9IHVybDtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9sb2FkZXIvaW1hZ2UtbG9hZGVyLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1cmwsIGNhbGxiYWNrLCBlcnJvcikge1xuICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gIHJlcXVlc3Qub3BlbignR0VUJywgdXJsLCB0cnVlKTtcbiAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSAndGV4dCc7XG4gIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHJlcXVlc3Quc3RhdHVzICE9PSAyMDApIHtcbiAgICAgIHJldHVybiBlcnJvcih1cmwpO1xuICAgIH1cblxuICAgIHZhciBkYXRhID0gdGhpcy5yZXNwb25zZTtcbiAgICBjYWxsYmFjayhkYXRhKTtcbiAgfTtcbiAgcmVxdWVzdC5zZW5kKCk7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbG9hZGVyL3RleHQtbG9hZGVyLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICdiYWNrc3BhY2UnOiA4LFxuICAndGFiJzogOSxcbiAgJ2VudGVyJzogMTMsXG4gICdwYXVzZSc6IDE5LFxuICAnY2Fwcyc6IDIwLFxuICAnZXNjJzogMjcsXG4gICdzcGFjZSc6IDMyLFxuICAncGFnZV91cCc6IDMzLFxuICAncGFnZV9kb3duJzogMzQsXG4gICdlbmQnOiAzNSxcbiAgJ2hvbWUnOiAzNixcbiAgJ2xlZnQnOiAzNyxcbiAgJ3VwJzogMzgsXG4gICdyaWdodCc6IDM5LFxuICAnZG93bic6IDQwLFxuICAnaW5zZXJ0JzogNDUsXG4gICdkZWxldGUnOiA0NixcbiAgJzAnOiA0OCxcbiAgJzEnOiA0OSxcbiAgJzInOiA1MCxcbiAgJzMnOiA1MSxcbiAgJzQnOiA1MixcbiAgJzUnOiA1MyxcbiAgJzYnOiA1NCxcbiAgJzcnOiA1NSxcbiAgJzgnOiA1NixcbiAgJzknOiA1NyxcbiAgJ2EnOiA2NSxcbiAgJ2InOiA2NixcbiAgJ2MnOiA2NyxcbiAgJ2QnOiA2OCxcbiAgJ2UnOiA2OSxcbiAgJ2YnOiA3MCxcbiAgJ2cnOiA3MSxcbiAgJ2gnOiA3MixcbiAgJ2knOiA3MyxcbiAgJ2onOiA3NCxcbiAgJ2snOiA3NSxcbiAgJ2wnOiA3NixcbiAgJ20nOiA3NyxcbiAgJ24nOiA3OCxcbiAgJ28nOiA3OSxcbiAgJ3AnOiA4MCxcbiAgJ3EnOiA4MSxcbiAgJ3InOiA4MixcbiAgJ3MnOiA4MyxcbiAgJ3QnOiA4NCxcbiAgJ3UnOiA4NSxcbiAgJ3YnOiA4NixcbiAgJ3cnOiA4NyxcbiAgJ3gnOiA4OCxcbiAgJ3knOiA4OSxcbiAgJ3onOiA5MCxcbiAgJ251bXBhZF8wJzogOTYsXG4gICdudW1wYWRfMSc6IDk3LFxuICAnbnVtcGFkXzInOiA5OCxcbiAgJ251bXBhZF8zJzogOTksXG4gICdudW1wYWRfNCc6IDEwMCxcbiAgJ251bXBhZF81JzogMTAxLFxuICAnbnVtcGFkXzYnOiAxMDIsXG4gICdudW1wYWRfNyc6IDEwMyxcbiAgJ251bXBhZF84JzogMTA0LFxuICAnbnVtcGFkXzknOiAxMDUsXG4gICdtdWx0aXBseSc6IDEwNixcbiAgJ2FkZCc6IDEwNyxcbiAgJ3N1YnN0cmFjdCc6IDEwOSxcbiAgJ2RlY2ltYWwnOiAxMTAsXG4gICdkaXZpZGUnOiAxMTEsXG4gICdmMSc6IDExMixcbiAgJ2YyJzogMTEzLFxuICAnZjMnOiAxMTQsXG4gICdmNCc6IDExNSxcbiAgJ2Y1JzogMTE2LFxuICAnZjYnOiAxMTcsXG4gICdmNyc6IDExOCxcbiAgJ2Y4JzogMTE5LFxuICAnZjknOiAxMjAsXG4gICdmMTAnOiAxMjEsXG4gICdmMTEnOiAxMjIsXG4gICdmMTInOiAxMjMsXG4gICdzaGlmdCc6IDE2LFxuICAnY3RybCc6IDE3LFxuICAnYWx0JzogMTgsXG4gICdwbHVzJzogMTg3LFxuICAnY29tbWEnOiAxODgsXG4gICdtaW51cyc6IDE4OSxcbiAgJ3BlcmlvZCc6IDE5MFxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2tleXMuanNcbiAqKi8iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gcmVzb2x2ZXMgLiBhbmQgLi4gZWxlbWVudHMgaW4gYSBwYXRoIGFycmF5IHdpdGggZGlyZWN0b3J5IG5hbWVzIHRoZXJlXG4vLyBtdXN0IGJlIG5vIHNsYXNoZXMsIGVtcHR5IGVsZW1lbnRzLCBvciBkZXZpY2UgbmFtZXMgKGM6XFwpIGluIHRoZSBhcnJheVxuLy8gKHNvIGFsc28gbm8gbGVhZGluZyBhbmQgdHJhaWxpbmcgc2xhc2hlcyAtIGl0IGRvZXMgbm90IGRpc3Rpbmd1aXNoXG4vLyByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgcGF0aHMpXG5mdW5jdGlvbiBub3JtYWxpemVBcnJheShwYXJ0cywgYWxsb3dBYm92ZVJvb3QpIHtcbiAgLy8gaWYgdGhlIHBhdGggdHJpZXMgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIGB1cGAgZW5kcyB1cCA+IDBcbiAgdmFyIHVwID0gMDtcbiAgZm9yICh2YXIgaSA9IHBhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdmFyIGxhc3QgPSBwYXJ0c1tpXTtcbiAgICBpZiAobGFzdCA9PT0gJy4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwLS07XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgdGhlIHBhdGggaXMgYWxsb3dlZCB0byBnbyBhYm92ZSB0aGUgcm9vdCwgcmVzdG9yZSBsZWFkaW5nIC4uc1xuICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICBmb3IgKDsgdXAtLTsgdXApIHtcbiAgICAgIHBhcnRzLnVuc2hpZnQoJy4uJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzO1xufVxuXG4vLyBTcGxpdCBhIGZpbGVuYW1lIGludG8gW3Jvb3QsIGRpciwgYmFzZW5hbWUsIGV4dF0sIHVuaXggdmVyc2lvblxuLy8gJ3Jvb3QnIGlzIGp1c3QgYSBzbGFzaCwgb3Igbm90aGluZy5cbnZhciBzcGxpdFBhdGhSZSA9XG4gICAgL14oXFwvP3wpKFtcXHNcXFNdKj8pKCg/OlxcLnsxLDJ9fFteXFwvXSs/fCkoXFwuW14uXFwvXSp8KSkoPzpbXFwvXSopJC87XG52YXIgc3BsaXRQYXRoID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgcmV0dXJuIHNwbGl0UGF0aFJlLmV4ZWMoZmlsZW5hbWUpLnNsaWNlKDEpO1xufTtcblxuLy8gcGF0aC5yZXNvbHZlKFtmcm9tIC4uLl0sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZXNvbHZlID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXNvbHZlZFBhdGggPSAnJyxcbiAgICAgIHJlc29sdmVkQWJzb2x1dGUgPSBmYWxzZTtcblxuICBmb3IgKHZhciBpID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gLTEgJiYgIXJlc29sdmVkQWJzb2x1dGU7IGktLSkge1xuICAgIHZhciBwYXRoID0gKGkgPj0gMCkgPyBhcmd1bWVudHNbaV0gOiBwcm9jZXNzLmN3ZCgpO1xuXG4gICAgLy8gU2tpcCBlbXB0eSBhbmQgaW52YWxpZCBlbnRyaWVzXG4gICAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGgucmVzb2x2ZSBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9IGVsc2UgaWYgKCFwYXRoKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICByZXNvbHZlZFBhdGggPSBwYXRoICsgJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgIHJlc29sdmVkQWJzb2x1dGUgPSBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xuICB9XG5cbiAgLy8gQXQgdGhpcyBwb2ludCB0aGUgcGF0aCBzaG91bGQgYmUgcmVzb2x2ZWQgdG8gYSBmdWxsIGFic29sdXRlIHBhdGgsIGJ1dFxuICAvLyBoYW5kbGUgcmVsYXRpdmUgcGF0aHMgdG8gYmUgc2FmZSAobWlnaHQgaGFwcGVuIHdoZW4gcHJvY2Vzcy5jd2QoKSBmYWlscylcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcmVzb2x2ZWRQYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHJlc29sdmVkUGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFyZXNvbHZlZEFic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgcmV0dXJuICgocmVzb2x2ZWRBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHJlc29sdmVkUGF0aCkgfHwgJy4nO1xufTtcblxuLy8gcGF0aC5ub3JtYWxpemUocGF0aClcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMubm9ybWFsaXplID0gZnVuY3Rpb24ocGF0aCkge1xuICB2YXIgaXNBYnNvbHV0ZSA9IGV4cG9ydHMuaXNBYnNvbHV0ZShwYXRoKSxcbiAgICAgIHRyYWlsaW5nU2xhc2ggPSBzdWJzdHIocGF0aCwgLTEpID09PSAnLyc7XG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFpc0Fic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgaWYgKCFwYXRoICYmICFpc0Fic29sdXRlKSB7XG4gICAgcGF0aCA9ICcuJztcbiAgfVxuICBpZiAocGF0aCAmJiB0cmFpbGluZ1NsYXNoKSB7XG4gICAgcGF0aCArPSAnLyc7XG4gIH1cblxuICByZXR1cm4gKGlzQWJzb2x1dGUgPyAnLycgOiAnJykgKyBwYXRoO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5pc0Fic29sdXRlID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuam9pbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcGF0aHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICByZXR1cm4gZXhwb3J0cy5ub3JtYWxpemUoZmlsdGVyKHBhdGhzLCBmdW5jdGlvbihwLCBpbmRleCkge1xuICAgIGlmICh0eXBlb2YgcCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLmpvaW4gbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfVxuICAgIHJldHVybiBwO1xuICB9KS5qb2luKCcvJykpO1xufTtcblxuXG4vLyBwYXRoLnJlbGF0aXZlKGZyb20sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZWxhdGl2ZSA9IGZ1bmN0aW9uKGZyb20sIHRvKSB7XG4gIGZyb20gPSBleHBvcnRzLnJlc29sdmUoZnJvbSkuc3Vic3RyKDEpO1xuICB0byA9IGV4cG9ydHMucmVzb2x2ZSh0bykuc3Vic3RyKDEpO1xuXG4gIGZ1bmN0aW9uIHRyaW0oYXJyKSB7XG4gICAgdmFyIHN0YXJ0ID0gMDtcbiAgICBmb3IgKDsgc3RhcnQgPCBhcnIubGVuZ3RoOyBzdGFydCsrKSB7XG4gICAgICBpZiAoYXJyW3N0YXJ0XSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIHZhciBlbmQgPSBhcnIubGVuZ3RoIC0gMTtcbiAgICBmb3IgKDsgZW5kID49IDA7IGVuZC0tKSB7XG4gICAgICBpZiAoYXJyW2VuZF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoc3RhcnQgPiBlbmQpIHJldHVybiBbXTtcbiAgICByZXR1cm4gYXJyLnNsaWNlKHN0YXJ0LCBlbmQgLSBzdGFydCArIDEpO1xuICB9XG5cbiAgdmFyIGZyb21QYXJ0cyA9IHRyaW0oZnJvbS5zcGxpdCgnLycpKTtcbiAgdmFyIHRvUGFydHMgPSB0cmltKHRvLnNwbGl0KCcvJykpO1xuXG4gIHZhciBsZW5ndGggPSBNYXRoLm1pbihmcm9tUGFydHMubGVuZ3RoLCB0b1BhcnRzLmxlbmd0aCk7XG4gIHZhciBzYW1lUGFydHNMZW5ndGggPSBsZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZnJvbVBhcnRzW2ldICE9PSB0b1BhcnRzW2ldKSB7XG4gICAgICBzYW1lUGFydHNMZW5ndGggPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdmFyIG91dHB1dFBhcnRzID0gW107XG4gIGZvciAodmFyIGkgPSBzYW1lUGFydHNMZW5ndGg7IGkgPCBmcm9tUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBvdXRwdXRQYXJ0cy5wdXNoKCcuLicpO1xuICB9XG5cbiAgb3V0cHV0UGFydHMgPSBvdXRwdXRQYXJ0cy5jb25jYXQodG9QYXJ0cy5zbGljZShzYW1lUGFydHNMZW5ndGgpKTtcblxuICByZXR1cm4gb3V0cHV0UGFydHMuam9pbignLycpO1xufTtcblxuZXhwb3J0cy5zZXAgPSAnLyc7XG5leHBvcnRzLmRlbGltaXRlciA9ICc6JztcblxuZXhwb3J0cy5kaXJuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICB2YXIgcmVzdWx0ID0gc3BsaXRQYXRoKHBhdGgpLFxuICAgICAgcm9vdCA9IHJlc3VsdFswXSxcbiAgICAgIGRpciA9IHJlc3VsdFsxXTtcblxuICBpZiAoIXJvb3QgJiYgIWRpcikge1xuICAgIC8vIE5vIGRpcm5hbWUgd2hhdHNvZXZlclxuICAgIHJldHVybiAnLic7XG4gIH1cblxuICBpZiAoZGlyKSB7XG4gICAgLy8gSXQgaGFzIGEgZGlybmFtZSwgc3RyaXAgdHJhaWxpbmcgc2xhc2hcbiAgICBkaXIgPSBkaXIuc3Vic3RyKDAsIGRpci5sZW5ndGggLSAxKTtcbiAgfVxuXG4gIHJldHVybiByb290ICsgZGlyO1xufTtcblxuXG5leHBvcnRzLmJhc2VuYW1lID0gZnVuY3Rpb24ocGF0aCwgZXh0KSB7XG4gIHZhciBmID0gc3BsaXRQYXRoKHBhdGgpWzJdO1xuICAvLyBUT0RPOiBtYWtlIHRoaXMgY29tcGFyaXNvbiBjYXNlLWluc2Vuc2l0aXZlIG9uIHdpbmRvd3M/XG4gIGlmIChleHQgJiYgZi5zdWJzdHIoLTEgKiBleHQubGVuZ3RoKSA9PT0gZXh0KSB7XG4gICAgZiA9IGYuc3Vic3RyKDAsIGYubGVuZ3RoIC0gZXh0Lmxlbmd0aCk7XG4gIH1cbiAgcmV0dXJuIGY7XG59O1xuXG5cbmV4cG9ydHMuZXh0bmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHNwbGl0UGF0aChwYXRoKVszXTtcbn07XG5cbmZ1bmN0aW9uIGZpbHRlciAoeHMsIGYpIHtcbiAgICBpZiAoeHMuZmlsdGVyKSByZXR1cm4geHMuZmlsdGVyKGYpO1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChmKHhzW2ldLCBpLCB4cykpIHJlcy5wdXNoKHhzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuLy8gU3RyaW5nLnByb3RvdHlwZS5zdWJzdHIgLSBuZWdhdGl2ZSBpbmRleCBkb24ndCB3b3JrIGluIElFOFxudmFyIHN1YnN0ciA9ICdhYicuc3Vic3RyKC0xKSA9PT0gJ2InXG4gICAgPyBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7IHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pIH1cbiAgICA6IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSBzdHIubGVuZ3RoICsgc3RhcnQ7XG4gICAgICAgIHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pO1xuICAgIH1cbjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9wYXRoLWJyb3dzZXJpZnkvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAxOFxuICoqIG1vZHVsZSBjaHVua3MgPSAxMlxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9zcmMvYXVkaW8tbWFuYWdlcicpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcG90aW9uLWF1ZGlvL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMTlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTJcbiAqKi8iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IHRydWU7XG4gICAgdmFyIGN1cnJlbnRRdWV1ZTtcbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgICAgICAgY3VycmVudFF1ZXVlW2ldKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xufVxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICBxdWV1ZS5wdXNoKGZ1bik7XG4gICAgaWYgKCFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3Byb2Nlc3MvYnJvd3Nlci5qc1xuICoqIG1vZHVsZSBpZCA9IDIwXG4gKiogbW9kdWxlIGNodW5rcyA9IDEyXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTJcbiAqKi8iLCJ2YXIgTG9hZGVkQXVkaW8gPSByZXF1aXJlKCcuL2xvYWRlZC1hdWRpbycpO1xuXG52YXIgQXVkaW9NYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG4gIHZhciBBdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG5cbiAgdGhpcy5jdHggPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gIHRoaXMubWFzdGVyR2FpbiA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5fdm9sdW1lID0gMTtcblxuICB2YXIgaU9TID0gLyhpUGFkfGlQaG9uZXxpUG9kKS9nLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gIGlmIChpT1MpIHtcbiAgICB0aGlzLl9lbmFibGVpT1MoKTtcbiAgfVxufTtcblxuQXVkaW9NYW5hZ2VyLnByb3RvdHlwZS5fZW5hYmxlaU9TID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgdG91Y2ggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnVmZmVyID0gc2VsZi5jdHguY3JlYXRlQnVmZmVyKDEsIDEsIDIyMDUwKTtcbiAgICB2YXIgc291cmNlID0gc2VsZi5jdHguY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgc291cmNlLmJ1ZmZlciA9IGJ1ZmZlcjtcbiAgICBzb3VyY2UuY29ubmVjdChzZWxmLmN0eC5kZXN0aW5hdGlvbik7XG4gICAgc291cmNlLnN0YXJ0KDApO1xuXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0b3VjaCwgZmFsc2UpO1xuICB9O1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdG91Y2gsIGZhbHNlKTtcbn07XG5cbkF1ZGlvTWFuYWdlci5wcm90b3R5cGUuc2V0Vm9sdW1lID0gZnVuY3Rpb24odm9sdW1lKSB7XG4gIHRoaXMuX3ZvbHVtZSA9IHZvbHVtZTtcbiAgdGhpcy5tYXN0ZXJHYWluLmdhaW4udmFsdWUgPSB2b2x1bWU7XG59O1xuXG5BdWRpb01hbmFnZXIucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbih1cmwsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcbiAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBzZWxmLmRlY29kZUF1ZGlvRGF0YShyZXF1ZXN0LnJlc3BvbnNlLCBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIGNhbGxiYWNrKHNvdXJjZSk7XG4gICAgfSk7XG4gIH07XG4gIHJlcXVlc3Quc2VuZCgpO1xufTtcblxuQXVkaW9NYW5hZ2VyLnByb3RvdHlwZS5kZWNvZGVBdWRpb0RhdGEgPSBmdW5jdGlvbihkYXRhLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdGhpcy5jdHguZGVjb2RlQXVkaW9EYXRhKGRhdGEsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgIHZhciBhdWRpbyA9IG5ldyBMb2FkZWRBdWRpbyhzZWxmLmN0eCwgcmVzdWx0LCBzZWxmLm1hc3RlckdhaW4pO1xuXG4gICAgY2FsbGJhY2soYXVkaW8pO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXVkaW9NYW5hZ2VyO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcG90aW9uLWF1ZGlvL3NyYy9hdWRpby1tYW5hZ2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTJcbiAqKi8iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi91dGlsL34vaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qc1xuICoqIG1vZHVsZSBpZCA9IDIzXG4gKiogbW9kdWxlIGNodW5rcyA9IDEyXG4gKiovIiwidmFyIFBsYXlpbmdBdWRpbyA9IHJlcXVpcmUoJy4vcGxheWluZy1hdWRpbycpO1xuXG52YXIgTG9hZGVkQXVkaW8gPSBmdW5jdGlvbihjdHgsIGJ1ZmZlciwgbWFzdGVyR2Fpbikge1xuICB0aGlzLl9jdHggPSBjdHg7XG4gIHRoaXMuX21hc3RlckdhaW4gPSBtYXN0ZXJHYWluO1xuICB0aGlzLl9idWZmZXIgPSBidWZmZXI7XG4gIHRoaXMuX2J1ZmZlci5sb29wID0gZmFsc2U7XG59O1xuXG5Mb2FkZWRBdWRpby5wcm90b3R5cGUuX2NyZWF0ZVNvdW5kID0gZnVuY3Rpb24oZ2Fpbikge1xuICB2YXIgc291cmNlID0gdGhpcy5fY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICBzb3VyY2UuYnVmZmVyID0gdGhpcy5fYnVmZmVyO1xuXG4gIHRoaXMuX21hc3RlckdhaW4uY29ubmVjdCh0aGlzLl9jdHguZGVzdGluYXRpb24pO1xuXG4gIGdhaW4uY29ubmVjdCh0aGlzLl9tYXN0ZXJHYWluKTtcblxuICBzb3VyY2UuY29ubmVjdChnYWluKTtcblxuICByZXR1cm4gc291cmNlO1xufTtcblxuTG9hZGVkQXVkaW8ucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGdhaW4gPSB0aGlzLl9jdHguY3JlYXRlR2FpbigpO1xuXG4gIHZhciBzb3VuZCA9IHRoaXMuX2NyZWF0ZVNvdW5kKGdhaW4pO1xuXG4gIHNvdW5kLnN0YXJ0KDApO1xuXG4gIHJldHVybiBuZXcgUGxheWluZ0F1ZGlvKHNvdW5kLCBnYWluKTtcbn07XG5cbkxvYWRlZEF1ZGlvLnByb3RvdHlwZS5mYWRlSW4gPSBmdW5jdGlvbih2YWx1ZSwgdGltZSkge1xuICB2YXIgZ2FpbiA9IHRoaXMuX2N0eC5jcmVhdGVHYWluKCk7XG5cbiAgdmFyIHNvdW5kID0gdGhpcy5fY3JlYXRlU291bmQoZ2Fpbik7XG5cbiAgZ2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKDAsIDApO1xuICBnYWluLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMC4wMSwgMCk7XG4gIGdhaW4uZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSh2YWx1ZSwgdGltZSk7XG5cbiAgc291bmQuc3RhcnQoMCk7XG5cbiAgcmV0dXJuIG5ldyBQbGF5aW5nQXVkaW8oc291bmQsIGdhaW4pO1xufTtcblxuTG9hZGVkQXVkaW8ucHJvdG90eXBlLmxvb3AgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGdhaW4gPSB0aGlzLl9jdHguY3JlYXRlR2FpbigpO1xuXG4gIHZhciBzb3VuZCA9IHRoaXMuX2NyZWF0ZVNvdW5kKGdhaW4pO1xuXG4gIHNvdW5kLmxvb3AgPSB0cnVlO1xuICBzb3VuZC5zdGFydCgwKTtcblxuICByZXR1cm4gbmV3IFBsYXlpbmdBdWRpbyhzb3VuZCwgZ2Fpbik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvYWRlZEF1ZGlvO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcG90aW9uLWF1ZGlvL3NyYy9sb2FkZWQtYXVkaW8uanNcbiAqKiBtb2R1bGUgaWQgPSAyNFxuICoqIG1vZHVsZSBjaHVua3MgPSAxMlxuICoqLyIsInZhciBQbGF5aW5nQXVkaW8gPSBmdW5jdGlvbihzb3VyY2UsIGdhaW4pIHtcbiAgdGhpcy5fZ2FpbiA9IGdhaW47XG4gIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcbn07XG5cblBsYXlpbmdBdWRpby5wcm90b3R5cGUuc2V0Vm9sdW1lID0gZnVuY3Rpb24odm9sdW1lKSB7XG4gIHRoaXMuX2dhaW4uZ2Fpbi52YWx1ZSA9IHZvbHVtZTtcbn07XG5cblBsYXlpbmdBdWRpby5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9zb3VyY2Uuc3RvcCgwKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWluZ0F1ZGlvO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcG90aW9uLWF1ZGlvL3NyYy9wbGF5aW5nLWF1ZGlvLmpzXG4gKiogbW9kdWxlIGlkID0gMjVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTJcbiAqKi8iXSwic291cmNlUm9vdCI6IiIsImZpbGUiOiJzaGFyZWQuanMifQ==
