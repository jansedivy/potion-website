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
	  window.requestAnimationFrame(this.tickFunc);
	
	  var now = Time.now();
	  var time = (now - this._time) / 1000;
	  this._time = now;
	
	  this.update(time);
	  this.game.states.exitUpdate(time);
	  this.render();
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
	
	    if (state.enabled && state.state.exitUpdate && !state.paused) {
	      state.state.exitUpdate(time);
	    }
	  }
	};
	
	StateManager.prototype.render = function () {
	  for (var i = 0, len = this.renderOrder.length; i < len; i++) {
	    var state = this.renderOrder[i];
	    if (state.enabled && (state.updated || !state.state.update) && state.render && state.state.render) {
	      state.state.render();
	    }
	  }
	};
	StateManager.prototype.mousemove = function (x, y, e) {
	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];
	    if (state.enabled && !state.changed && state.state.mousemove && !state.paused) {
	      state.state.mousemove(x, y, e);
	    }
	  }
	};
	
	StateManager.prototype.mouseup = function (x, y, button) {
	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];
	    if (state.enabled && !state.changed && state.state.mouseup && !state.paused) {
	      state.state.mouseup(x, y, button);
	    }
	  }
	};
	
	StateManager.prototype.mousedown = function (x, y, button) {
	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];
	    if (state.enabled && !state.changed && state.state.mousedown && !state.paused) {
	      state.state.mousedown(x, y, button);
	    }
	  }
	};
	
	StateManager.prototype.keyup = function (key, e) {
	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];
	    if (state.enabled && !state.changed && state.state.keyup && !state.paused) {
	      state.state.keyup(key, e);
	    }
	  }
	};
	
	StateManager.prototype.keydown = function (key, e) {
	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];
	    if (state.enabled && !state.changed && state.state.keydown && !state.paused) {
	      state.state.keydown(key, e);
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
	  { name: 'Show FPS', entry: 'showFps', default: true },
	  { name: 'Show Key Codes', entry: 'showKeyCodes', default: true }
	];
	
	var Debugger = function(app) {
	  this.video = app.video.createLayer({
	    useRetina: true,
	    initializeCanvas: true
	  });
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
	
	  this._fontSize = 0;
	  this._dirtyManager = new DirtyManager(this.video.canvas, this.video.ctx);
	
	  this.logs = [];
	
	  this.showDebug = false;
	  this.enableDebugKeys = true;
	  this.enableShortcuts = false;
	
	  this.enableShortcutsKey = 220;
	
	  this.lastKey = null;
	
	  this._load();
	
	  this.keyShortcuts = [
	    { key: 123, entry: 'showDebug', type: 'toggle' }
	  ];
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
	  option.default = option.default == null ? false : option.default;
	
	  if (option.type === 'toggle') {
	    this[option.entry] = option.default;
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
	
	Debugger.prototype.keydown = function(key, e) {
	  if (this.disabled) { return; }
	
	  this.lastKey = key;
	
	  var i;
	
	  if (this.enableDebugKeys) {
	    if (key === this.enableShortcutsKey) {
	      e.preventDefault();
	
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
	
	        if (charId && key === charId) {
	          e.preventDefault();
	
	          if (option.type === 'toggle') {
	
	            this[option.entry] = !this[option.entry];
	
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
	    if (keyShortcut.key === key) {
	      e.preventDefault();
	
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
	  }
	
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
	
	Debugger.prototype._renderData = function() {
	  this.video.ctx.textAlign = 'right';
	  this.video.ctx.textBaseline = 'top';
	
	  var x = this.app.width - 14;
	  var y = 14;
	
	  if (this.showFps) {
	    this._renderText(Math.round(this.fps) + ' fps', x, y);
	  }
	
	  y += 20;
	
	  this._setFont(15, 'sans-serif');
	
	  if (this.showKeyCodes) {
	    this._renderText('key ' + this.lastKey, x, y, this.app.input.isKeyDown(this.lastKey) ? '#e9dc7c' : 'white');
	    this._renderText('btn ' + this.app.input.mouse.button, x - 60, y, this.app.input.mouse.isDown ? '#e9dc7c' : 'white');
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
	
	var utils = __webpack_require__(15);
	var path = __webpack_require__(16);
	
	var PotionAudio = __webpack_require__(17);
	
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
	
	  this._xhr = new XMLHttpRequest();
	
	  this._thingsToLoad = 0;
	  this._data = {};
	
	  this.callback = null;
	
	  this._toLoad = [];
	
	  this.audio = new PotionAudio();
	};
	
	/**
	 * Starts loading stored assets urls and runs given callback after everything is loaded
	 * @param {function} callback - callback function
	 */
	Assets.prototype.onload = function (callback) {
	  this.callback = callback;
	
	  if (this._thingsToLoad === 0) {
	    this.isLoading = false;
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
	  this.isLoading = true;
	  this.itemsCount += 1;
	  this._thingsToLoad += 1;
	
	  this._toLoad.push({ type: type, url: url != null ? path.normalize(url) : null, callback: callback });
	};
	
	Assets.prototype._finishedOneFile = function () {
	  this._nextFile();
	  this.progress = this.loadedItemsCount / this.itemsCount;
	  this._thingsToLoad -= 1;
	  this.loadedItemsCount += 1;
	
	  if (this._thingsToLoad === 0) {
	    var self = this;
	    setTimeout(function () {
	      self.callback();
	      self.isLoading = false;
	    }, 0);
	  }
	};
	
	Assets.prototype._error = function (type, url) {
	  console.warn("Error loading \"" + type + "\" asset with url " + url);
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
	
	  var type = current.type;
	  var url = current.url;
	  var callback = current.callback;
	
	  var self = this;
	
	  if (utils.isFunction(type)) {
	    this._handleCustomLoading(type);
	    return;
	  }
	
	  type = type.toLowerCase();
	
	  var request = this._xhr;
	
	  switch (type) {
	    case "json":
	      request.open("GET", url, true);
	      request.responseType = "text";
	      request.onload = function () {
	        var data = JSON.parse(this.response);
	        self._save(url, data, callback);
	      };
	      request.onerror = function () {
	        self._error(type, url);
	      };
	      request.send();
	      break;
	    case "mp3":
	    case "music":
	    case "sound":
	      self.audio.load(url, function (audio) {
	        self._save(url, audio, callback);
	      });
	      break;
	    case "image":
	    case "texture":
	    case "sprite":
	      var image = new Image();
	      image.onload = function () {
	        self._save(url, image, callback);
	      };
	      image.onerror = function () {
	        self._error(type, url);
	      };
	      image.src = url;
	      break;
	    default:
	      // text files
	      request.open("GET", url, true);
	      request.responseType = "text";
	      request.onload = function () {
	        var data = this.response;
	        self._save(url, data, callback);
	      };
	      request.onerror = function () {
	        self._error(type, url);
	      };
	      request.send();
	      break;
	  }
	};
	
	module.exports = Assets;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var keys = __webpack_require__(14);
	
	/**
	 * Input wrapper
	 * @constructor
	 * @param {Game} game - Game object
	 */
	var Input = function Input(game, container) {
	  this._container = container;
	  /**
	   * Pressed keys object
	   * @type {object}
	   */
	  this.keys = {};
	
	  /**
	   * Controls if you can press keys
	   * @type {boolean}
	   */
	  this.canControlKeys = true;
	
	  /**
	   * Mouse object with positions and if is mouse button pressed
	   * @type {object}
	   */
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
	
	/**
	 * Clears the pressed keys object
	 */
	Input.prototype.resetKeys = function () {
	  this.keys = {};
	};
	
	/**
	 * Return true or false if key is pressed
	 * @param {string} key
	 * @return {boolean}
	 */
	Input.prototype.isKeyDown = function (key) {
	  if (key == null) {
	    return false;
	  }
	
	  if (this.canControlKeys) {
	    var code = typeof key === "number" ? key : keys[key.toUpperCase()];
	    return this.keys[code];
	  }
	};
	
	/**
	 * Add canvas event listener
	 * @private
	 */
	Input.prototype._addEvents = function (game) {
	  var self = this;
	
	  self._container.addEventListener("mousemove", function (e) {
	    var x = e.offsetX === undefined ? e.layerX - self._container.offsetLeft : e.offsetX;
	    var y = e.offsetY === undefined ? e.layerY - self._container.offsetTop : e.offsetY;
	
	    self.mouse.x = x;
	    self.mouse.y = y;
	
	    game.states.mousemove(x, y, e);
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
	
	    game.states.mouseup(x, y, e.button);
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
	
	    game.states.mousedown(x, y, e.button);
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
	
	      game.states.mousedown(x, y, 1);
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
	
	      game.states.mousemove(x, y);
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
	
	    game.states.mouseup(x, y, 1);
	  });
	
	  self._container.addEventListener("contextmenu", function (e) {
	    e.preventDefault();
	  });
	
	  document.addEventListener("keydown", function (e) {
	    game.input.keys[e.keyCode] = true;
	    game.states.keydown(e.which, e);
	  });
	
	  document.addEventListener("keyup", function (e) {
	    game.input.keys[e.keyCode] = false;
	    game.states.keyup(e.which, e);
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
	
	exports.isBuffer = __webpack_require__(19);
	
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
	exports.inherits = __webpack_require__(21);
	
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(18)))

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
	
	module.exports = {
	  MOUSE1: -1,
	  MOUSE2: -3,
	  MWHEEL_UP: -4,
	  MWHEEL_DOWN: -5,
	  BACKSPACE: 8,
	  TAB: 9,
	  ENTER: 13,
	  PAUSE: 19,
	  CAPS: 20,
	  ESC: 27,
	  SPACE: 32,
	  PAGE_UP: 33,
	  PAGE_DOWN: 34,
	  END: 35,
	  HOME: 36,
	  LEFT: 37,
	  UP: 38,
	  RIGHT: 39,
	  DOWN: 40,
	  INSERT: 45,
	  DELETE: 46,
	  _0: 48,
	  _1: 49,
	  _2: 50,
	  _3: 51,
	  _4: 52,
	  _5: 53,
	  _6: 54,
	  _7: 55,
	  _8: 56,
	  _9: 57,
	  A: 65,
	  B: 66,
	  C: 67,
	  D: 68,
	  E: 69,
	  F: 70,
	  G: 71,
	  H: 72,
	  I: 73,
	  J: 74,
	  K: 75,
	  L: 76,
	  M: 77,
	  N: 78,
	  O: 79,
	  P: 80,
	  Q: 81,
	  R: 82,
	  S: 83,
	  T: 84,
	  U: 85,
	  V: 86,
	  W: 87,
	  X: 88,
	  Y: 89,
	  Z: 90,
	  NUMPAD_0: 96,
	  NUMPAD_1: 97,
	  NUMPAD_2: 98,
	  NUMPAD_3: 99,
	  NUMPAD_4: 100,
	  NUMPAD_5: 101,
	  NUMPAD_6: 102,
	  NUMPAD_7: 103,
	  NUMPAD_8: 104,
	  NUMPAD_9: 105,
	  MULTIPLY: 106,
	  ADD: 107,
	  SUBSTRACT: 109,
	  DECIMAL: 110,
	  DIVIDE: 111,
	  F1: 112,
	  F2: 113,
	  F3: 114,
	  F4: 115,
	  F5: 116,
	  F6: 117,
	  F7: 118,
	  F8: 119,
	  F9: 120,
	  F10: 121,
	  F11: 122,
	  F12: 123,
	  SHIFT: 16,
	  CTRL: 17,
	  ALT: 18,
	  PLUS: 187,
	  COMMA: 188,
	  MINUS: 189,
	  PERIOD: 190
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var get = exports.get = function (url, callback) {
	  var request = new XMLHttpRequest();
	  request.open("GET", url, true);
	
	  request.onload = function () {
	    callback(this.response);
	  };
	
	  request.send();
	};
	
	var getJSON = exports.getJSON = function (url, callback) {
	  get(url, function (text) {
	    callback(JSON.parse(text));
	  });
	};
	
	exports.isFunction = function (obj) {
	  return !!(obj && obj.constructor && obj.call && obj.apply);
	};

/***/ },
/* 16 */
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(20);


/***/ },
/* 18 */
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var LoadedAudio = __webpack_require__(22);
	
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
/* 21 */
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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var PlayingAudio = __webpack_require__(23);
	
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
/* 23 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZWQyODVkNjQ1YTJmNzJlN2E0MDIiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VuZ2luZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmFmLXBvbHlmaWxsLmpzIiwid2VicGFjazovLy8uL3NyYy9nYW1lLmpzIiwid2VicGFjazovLy8uL3NyYy90aW1lLmpzIiwid2VicGFjazovLy8uL3NyYy9zdGF0ZS1tYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL34vcG90aW9uLWRlYnVnZ2VyL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy92aWRlby5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzLmpzIiwid2VicGFjazovLy8uL3NyYy9pbnB1dC5qcyIsIndlYnBhY2s6Ly8vLi9+L3BvdGlvbi1kZWJ1Z2dlci9kaXJ0eS1tYW5hZ2VyLmpzIiwid2VicGFjazovLy8od2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3V0aWwvdXRpbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmV0aW5hLmpzIiwid2VicGFjazovLy8uL3NyYy9rZXlzLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9wYXRoLWJyb3dzZXJpZnkvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9wb3Rpb24tYXVkaW8vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8od2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wb3Rpb24tYXVkaW8vc3JjL2F1ZGlvLW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC9+L2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wb3Rpb24tYXVkaW8vc3JjL2xvYWRlZC1hdWRpby5qcyIsIndlYnBhY2s6Ly8vLi9+L3BvdGlvbi1hdWRpby9zcmMvcGxheWluZy1hdWRpby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQVEsb0JBQW9CO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxnRDs7Ozs7Ozs7OztBQ3hGQSxLQUFJLE1BQU0sR0FBRyxtQkFBTyxDQUFDLENBQWMsQ0FBQyxDQUFDOztBQUVyQyxPQUFNLENBQUMsT0FBTyxHQUFHO0FBQ2YsT0FBSSxFQUFFLGNBQVMsTUFBTSxFQUFFLE9BQU8sRUFBRTtBQUM5QixTQUFJLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDekMsWUFBTyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ3BCO0VBQ0YsQzs7Ozs7Ozs7QUNQRCxvQkFBTyxDQUFDLENBQWdCLENBQUMsRUFBRSxDQUFDOztBQUU1QixLQUFJLElBQUksR0FBRyxtQkFB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Q3JDLFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRXRELFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO0FBQy9ELFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRWxELFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDN0IsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDM0IsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxLQUFLLEdBQUcsRUFBRSxFQUFFLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQztBQUM1RCxTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUMzQixTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7QUFFeEIsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxvQkFBb0IsQ0FBQztBQUM3RSxTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0FBRXJFLFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDN0IsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRTNCLFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDeEQsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3JDLFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ25ELFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQzs7QUFFdEUsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDeEIsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRTNCLFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO0FBQy9ELFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUVqRSxTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMs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QTtBQUNBO0FBQ0EsSUFBRztBQUNILHdCQUF1QixTQUFTO0FBQ2hDO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxPQUFPO0FBQ2xCLFlBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZDQUE0QyxLQUFLOztBQUVqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0Esb0NBQW1DLE9BQU87QUFDMUM7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLDBEQUF5RDtBQUN6RDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWCxVQUFTO0FBQ1Q7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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RUE7QUFDQSw0QkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsNkJBQTRCLFVBQVU7Ozs7Ozs7QUN6RHRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFOzs7Ozs7QUNMQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsSUFBRztBQUNIOztBQUVBOzs7Ozs7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQSxFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDdEJBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7OztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG4gXHR2YXIgcGFyZW50SnNvbnBGdW5jdGlvbiA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXTtcbiBcdHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSA9IGZ1bmN0aW9uIHdlYnBhY2tKc29ucENhbGxiYWNrKGNodW5rSWRzLCBtb3JlTW9kdWxlcykge1xuIFx0XHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcbiBcdFx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG4gXHRcdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDAsIGNhbGxiYWNrcyA9IFtdO1xuIFx0XHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbiBcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pXG4gXHRcdFx0XHRjYWxsYmFja3MucHVzaC5hcHBseShjYWxsYmFja3MsIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSk7XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbiBcdFx0fVxuIFx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0fVxuIFx0XHRpZihwYXJlbnRKc29ucEZ1bmN0aW9uKSBwYXJlbnRKc29ucEZ1bmN0aW9uKGNodW5rSWRzLCBtb3JlTW9kdWxlcyk7XG4gXHRcdHdoaWxlKGNhbGxiYWNrcy5sZW5ndGgpXG4gXHRcdFx0Y2FsbGJhY2tzLnNoaWZ0KCkuY2FsbChudWxsLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcbiBcdFx0aWYobW9yZU1vZHVsZXNbMF0pIHtcbiBcdFx0XHRpbnN0YWxsZWRNb2R1bGVzWzBdID0gMDtcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3NcbiBcdC8vIFwiMFwiIG1lYW5zIFwiYWxyZWFkeSBsb2FkZWRcIlxuIFx0Ly8gQXJyYXkgbWVhbnMgXCJsb2FkaW5nXCIsIGFycmF5IGNvbnRhaW5zIGNhbGxiYWNrc1xuIFx0dmFyIGluc3RhbGxlZENodW5rcyA9IHtcbiBcdFx0MTI6MFxuIFx0fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG4gXHQvLyBUaGlzIGZpbGUgY29udGFpbnMgb25seSB0aGUgZW50cnkgY2h1bmsuXG4gXHQvLyBUaGUgY2h1bmsgbG9hZGluZyBmdW5jdGlvbiBmb3IgYWRkaXRpb25hbCBjaHVua3NcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZSA9IGZ1bmN0aW9uIHJlcXVpcmVFbnN1cmUoY2h1bmtJZCwgY2FsbGJhY2spIHtcbiBcdFx0Ly8gXCIwXCIgaXMgdGhlIHNpZ25hbCBmb3IgXCJhbHJlYWR5IGxvYWRlZFwiXG4gXHRcdGlmKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMClcbiBcdFx0XHRyZXR1cm4gY2FsbGJhY2suY2FsbChudWxsLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBhbiBhcnJheSBtZWFucyBcImN1cnJlbnRseSBsb2FkaW5nXCIuXG4gXHRcdGlmKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSAhPT0gdW5kZWZpbmVkKSB7XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdLnB1c2goY2FsbGJhY2spO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdC8vIHN0YXJ0IGNodW5rIGxvYWRpbmdcbiBcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSBbY2FsbGJhY2tdO1xuIFx0XHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiBcdFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gXHRcdFx0c2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiBcdFx0XHRzY3JpcHQuY2hhcnNldCA9ICd1dGYtOCc7XG4gXHRcdFx0c2NyaXB0LmFzeW5jID0gdHJ1ZTtcbiBcdFx0XHRzY3JpcHQuc3JjID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGNodW5rSWQgKyBcIi5jaHVuay5qc1wiO1xuIFx0XHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvX19idWlsZF9fL1wiO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGVkMjg1ZDY0NWEyZjcyZTdhNDAyXG4gKiovIiwidmFyIEVuZ2luZSA9IHJlcXVpcmUoJy4vc3JjL2VuZ2luZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaW5pdDogZnVuY3Rpb24oY2FudmFzLCBtZXRob2RzKSB7XG4gICAgdmFyIGVuZ2luZSA9IG5ldyBFbmdpbmUoY2FudmFzLCBtZXRob2RzKTtcbiAgICByZXR1cm4gZW5naW5lLmdhbWU7XG4gIH1cbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2luZGV4LmpzXG4gKiovIiwicmVxdWlyZSgnLi9yYWYtcG9seWZpbGwnKSgpO1xuXG52YXIgR2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpO1xuXG52YXIgVGltZSA9IHJlcXVpcmUoJy4vdGltZScpO1xuXG52YXIgRGVidWdnZXIgPSByZXF1aXJlKCdwb3Rpb24tZGVidWdnZXInKTtcblxudmFyIFN0YXRlTWFuYWdlciA9IHJlcXVpcmUoJy4vc3RhdGUtbWFuYWdlcicpO1xuXG4vKipcbiAqIE1haW4gRW5naW5lIGNsYXNzIHdoaWNoIGNhbGxzIHRoZSBnYW1lIG1ldGhvZHNcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgRW5naW5lID0gZnVuY3Rpb24oY29udGFpbmVyLCBtZXRob2RzKSB7XG4gIHZhciBHYW1lQ2xhc3MgPSB0aGlzLl9zdWJjbGFzc0dhbWUoY29udGFpbmVyLCBtZXRob2RzKTtcblxuICBjb250YWluZXIuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuXG4gIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgY2FudmFzLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2FudmFzKTtcblxuICB0aGlzLmdhbWUgPSBuZXcgR2FtZUNsYXNzKGNhbnZhcyk7XG4gIHRoaXMuZ2FtZS5kZWJ1ZyA9IG5ldyBEZWJ1Z2dlcih0aGlzLmdhbWUpO1xuXG4gIHRoaXMuX3NldERlZmF1bHRTdGF0ZXMoKTtcblxuICB0aGlzLnRpY2tGdW5jID0gKGZ1bmN0aW9uIChzZWxmKSB7IHJldHVybiBmdW5jdGlvbigpIHsgc2VsZi50aWNrKCk7IH07IH0pKHRoaXMpO1xuICB0aGlzLnByZWxvYWRlclRpY2tGdW5jID0gKGZ1bmN0aW9uIChzZWxmKSB7IHJldHVybiBmdW5jdGlvbigpIHsgc2VsZi5fcHJlbG9hZGVyVGljaygpOyB9OyB9KSh0aGlzKTtcblxuICB0aGlzLnN0cmF5VGltZSA9IDA7XG5cbiAgdGhpcy5fdGltZSA9IFRpbWUubm93KCk7XG5cbiAgdGhpcy5nYW1lLmFzc2V0cy5vbmxvYWQoZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdGFydCgpO1xuXG4gICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMucHJlbG9hZGVySWQpO1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrRnVuYyk7XG4gIH0uYmluZCh0aGlzKSk7XG5cbiAgaWYgKHRoaXMuZ2FtZS5hc3NldHMuaXNMb2FkaW5nKSB7XG4gICAgdGhpcy5wcmVsb2FkZXJJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5wcmVsb2FkZXJUaWNrRnVuYyk7XG4gIH1cbn07XG5cbi8qKlxuICogQWRkIGV2ZW50IGxpc3RlbmVyIGZvciB3aW5kb3cgZXZlbnRzXG4gKiBAcHJpdmF0ZVxuICovXG5FbmdpbmUucHJvdG90eXBlLmFkZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIGdhbWUgPSBzZWxmLmdhbWU7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24oKSB7XG4gICAgc2VsZi5nYW1lLmlucHV0LnJlc2V0S2V5cygpO1xuICAgIHNlbGYuZ2FtZS5ibHVyKCk7XG4gIH0pO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGZ1bmN0aW9uKCkge1xuICAgIHNlbGYuZ2FtZS5pbnB1dC5yZXNldEtleXMoKTtcbiAgICBzZWxmLmdhbWUuZm9jdXMoKTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIFN0YXJ0cyB0aGUgZ2FtZSwgYWRkcyBldmVudHMgYW5kIHJ1biBmaXJzdCBmcmFtZVxuICogQHByaXZhdGVcbiAqL1xuRW5naW5lLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5nYW1lLmNvbmZpZy5hZGRJbnB1dEV2ZW50cykge1xuICAgIHRoaXMuYWRkRXZlbnRzKCk7XG4gIH1cbn07XG5cbi8qKlxuICogTWFpbiB0aWNrIGZ1bmN0aW9uIGluIGdhbWUgbG9vcFxuICogQHByaXZhdGVcbiAqL1xuRW5naW5lLnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24oKSB7XG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrRnVuYyk7XG5cbiAgdmFyIG5vdyA9IFRpbWUubm93KCk7XG4gIHZhciB0aW1lID0gKG5vdyAtIHRoaXMuX3RpbWUpIC8gMTAwMDtcbiAgdGhpcy5fdGltZSA9IG5vdztcblxuICB0aGlzLnVwZGF0ZSh0aW1lKTtcbiAgdGhpcy5nYW1lLnN0YXRlcy5leGl0VXBkYXRlKHRpbWUpO1xuICB0aGlzLnJlbmRlcigpO1xufTtcblxuLyoqXG4gKiBVcGRhdGVzIHRoZSBnYW1lXG4gKiBAcGFyYW0ge251bWJlcn0gdGltZSAtIHRpbWUgaW4gc2Vjb25kcyBzaW5jZSBsYXN0IGZyYW1lXG4gKiBAcHJpdmF0ZVxuICovXG5FbmdpbmUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgaWYgKHRpbWUgPiB0aGlzLmdhbWUuY29uZmlnLm1heFN0ZXBUaW1lKSB7IHRpbWUgPSB0aGlzLmdhbWUuY29uZmlnLm1heFN0ZXBUaW1lOyB9XG5cbiAgaWYgKHRoaXMuZ2FtZS5jb25maWcuZml4ZWRTdGVwKSB7XG4gICAgdGhpcy5zdHJheVRpbWUgPSB0aGlzLnN0cmF5VGltZSArIHRpbWU7XG4gICAgd2hpbGUgKHRoaXMuc3RyYXlUaW1lID49IHRoaXMuZ2FtZS5jb25maWcuc3RlcFRpbWUpIHtcbiAgICAgIHRoaXMuc3RyYXlUaW1lID0gdGhpcy5zdHJheVRpbWUgLSB0aGlzLmdhbWUuY29uZmlnLnN0ZXBUaW1lO1xuICAgICAgdGhpcy5nYW1lLnN0YXRlcy51cGRhdGUodGhpcy5nYW1lLmNvbmZpZy5zdGVwVGltZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuZ2FtZS5zdGF0ZXMudXBkYXRlKHRpbWUpO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbmRlcnMgdGhlIGdhbWVcbiAqIEBwcml2YXRlXG4gKi9cbkVuZ2luZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZ2FtZS52aWRlby5iZWdpbkZyYW1lKCk7XG5cbiAgdGhpcy5nYW1lLnZpZGVvLmNsZWFyKCk7XG5cbiAgdGhpcy5nYW1lLnN0YXRlcy5yZW5kZXIoKTtcblxuICB0aGlzLmdhbWUudmlkZW8uZW5kRnJhbWUoKTtcbn07XG5cbi8qKlxuICogTWFpbiB0aWNrIGZ1bmN0aW9uIGluIHByZWxvYWRlciBsb29wXG4gKiBAcHJpdmF0ZVxuICovXG5FbmdpbmUucHJvdG90eXBlLl9wcmVsb2FkZXJUaWNrID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucHJlbG9hZGVySWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucHJlbG9hZGVyVGlja0Z1bmMpO1xuXG4gIHZhciBub3cgPSBUaW1lLm5vdygpO1xuICB2YXIgdGltZSA9IChub3cgLSB0aGlzLl90aW1lKSAvIDEwMDA7XG4gIHRoaXMuX3RpbWUgPSBub3c7XG5cbiAgaWYgKHRoaXMuZ2FtZS5jb25maWcuc2hvd1ByZWxvYWRlcikge1xuICAgIHRoaXMuZ2FtZS52aWRlby5jbGVhcigpO1xuICAgIHRoaXMuZ2FtZS5wcmVsb2FkaW5nKHRpbWUpO1xuICB9XG59O1xuXG5FbmdpbmUucHJvdG90eXBlLl9zZXREZWZhdWx0U3RhdGVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzdGF0ZXMgPSBuZXcgU3RhdGVNYW5hZ2VyKCk7XG4gIHN0YXRlcy5hZGQoJ2FwcCcsIHRoaXMuZ2FtZSk7XG4gIHN0YXRlcy5hZGQoJ2RlYnVnJywgdGhpcy5nYW1lLmRlYnVnKTtcblxuICBzdGF0ZXMucHJvdGVjdCgnYXBwJyk7XG4gIHN0YXRlcy5wcm90ZWN0KCdkZWJ1ZycpO1xuXG4gIHRoaXMuZ2FtZS5zdGF0ZXMgPSBzdGF0ZXM7XG59O1xuXG5FbmdpbmUucHJvdG90eXBlLl9zdWJjbGFzc0dhbWUgPSBmdW5jdGlvbihjb250YWluZXIsIG1ldGhvZHMpIHtcbiAgdmFyIEdhbWVDbGFzcyA9IGZ1bmN0aW9uKGNvbnRhaW5lcikge1xuICAgIEdhbWUuY2FsbCh0aGlzLCBjb250YWluZXIpO1xuICB9O1xuXG4gIEdhbWVDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdhbWUucHJvdG90eXBlKTtcblxuICBmb3IgKHZhciBtZXRob2QgaW4gbWV0aG9kcykge1xuICAgIEdhbWVDbGFzcy5wcm90b3R5cGVbbWV0aG9kXSA9IG1ldGhvZHNbbWV0aG9kXTtcbiAgfVxuXG4gIHJldHVybiBHYW1lQ2xhc3M7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVuZ2luZTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VuZ2luZS5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBsYXN0VGltZSA9IDA7XG4gIHZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcblxuICBmb3IgKHZhciBpPTA7IGk8dmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsraSkge1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1tpXSsnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbaV0rJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgd2luZG93W3ZlbmRvcnNbaV0rJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICB9XG5cbiAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuXG4gICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTtcbiAgICAgIH0sIHRpbWVUb0NhbGwpO1xuXG4gICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbiAgICAgIHJldHVybiBpZDtcbiAgICB9O1xuICB9XG5cbiAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpIHtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihpZCkgeyBjbGVhclRpbWVvdXQoaWQpOyB9O1xuICB9XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmFmLXBvbHlmaWxsLmpzXG4gKiovIiwidmFyIFZpZGVvID0gcmVxdWlyZSgnLi92aWRlbycpO1xudmFyIEFzc2V0cyA9IHJlcXVpcmUoJy4vYXNzZXRzJyk7XG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG5cbnZhciBHYW1lID0gZnVuY3Rpb24oY2FudmFzKSB7XG4gIHRoaXMuY2FudmFzID0gY2FudmFzO1xuXG4gIHRoaXMud2lkdGggPSAzMDA7XG5cbiAgdGhpcy5oZWlnaHQgPSAzMDA7XG5cbiAgdGhpcy5hc3NldHMgPSBuZXcgQXNzZXRzKCk7XG5cbiAgdGhpcy5zdGF0ZXMgPSBudWxsO1xuICB0aGlzLmRlYnVnID0gbnVsbDtcbiAgdGhpcy5pbnB1dCA9IG51bGw7XG4gIHRoaXMudmlkZW8gPSBudWxsO1xuXG4gIHRoaXMuY29uZmlnID0ge1xuICAgIHVzZVJldGluYTogdHJ1ZSxcbiAgICBpbml0aWFsaXplQ2FudmFzOiB0cnVlLFxuICAgIGluaXRpYWxpemVWaWRlbzogdHJ1ZSxcbiAgICBhZGRJbnB1dEV2ZW50czogdHJ1ZSxcbiAgICBzaG93UHJlbG9hZGVyOiB0cnVlLFxuICAgIGZpeGVkU3RlcDogZmFsc2UsXG4gICAgc3RlcFRpbWU6IDAuMDE2NjYsXG4gICAgbWF4U3RlcFRpbWU6IDAuMDE2NjZcbiAgfTtcblxuICB0aGlzLmNvbmZpZ3VyZSgpO1xuXG4gIGlmICh0aGlzLmNvbmZpZy5pbml0aWFsaXplVmlkZW8pIHtcbiAgICB0aGlzLnZpZGVvID0gbmV3IFZpZGVvKHRoaXMsIGNhbnZhcywgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgaWYgKHRoaXMuY29uZmlnLmFkZElucHV0RXZlbnRzKSB7XG4gICAgdGhpcy5pbnB1dCA9IG5ldyBJbnB1dCh0aGlzLCBjYW52YXMucGFyZW50RWxlbWVudCk7XG4gIH1cbn07XG5cbkdhbWUucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgaWYgKHRoaXMudmlkZW8pIHtcbiAgICB0aGlzLnZpZGVvLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG4gIH1cbn07XG5cbkdhbWUucHJvdG90eXBlLnByZWxvYWRpbmcgPSBmdW5jdGlvbih0aW1lKSB7XG4gIGlmICghdGhpcy5jb25maWcuc2hvd1ByZWxvYWRlciAmJiAhKHRoaXMudmlkZW8gJiYgdGhpcy52aWRlby5jdHgpKSB7IHJldHVybjsgfVxuXG4gIGlmICh0aGlzLnZpZGVvLmN0eCkge1xuICAgIHZhciBjb2xvcjEgPSAnI2I5ZmY3MSc7XG4gICAgdmFyIGNvbG9yMiA9ICcjOGFjMjUwJztcbiAgICB2YXIgY29sb3IzID0gJyM2NDhlMzgnO1xuXG4gICAgaWYgKHRoaXMuX3ByZWxvYWRlcldpZHRoID09PSB1bmRlZmluZWQpIHsgdGhpcy5fcHJlbG9hZGVyV2lkdGggPSAwOyB9XG5cbiAgICB2YXIgd2lkdGggPSBNYXRoLm1pbih0aGlzLndpZHRoICogMi8zLCAzMDApO1xuICAgIHZhciBoZWlnaHQgPSAyMDtcblxuICAgIHZhciB5ID0gKHRoaXMuaGVpZ2h0IC0gaGVpZ2h0KSAvIDI7XG4gICAgdmFyIHggPSAodGhpcy53aWR0aCAtIHdpZHRoKSAvIDI7XG5cbiAgICB2YXIgY3VycmVudFdpZHRoID0gd2lkdGggKiB0aGlzLmFzc2V0cy5wcm9ncmVzcztcbiAgICB0aGlzLl9wcmVsb2FkZXJXaWR0aCA9IHRoaXMuX3ByZWxvYWRlcldpZHRoICsgKGN1cnJlbnRXaWR0aCAtIHRoaXMuX3ByZWxvYWRlcldpZHRoKSAqIHRpbWUgKiAxMDtcblxuICAgIHRoaXMudmlkZW8uY3R4LnNhdmUoKTtcblxuICAgIHRoaXMudmlkZW8uY3R4LmZpbGxTdHlsZSA9IGNvbG9yMjtcbiAgICB0aGlzLnZpZGVvLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5mb250ID0gJzQwMCA0MHB4IHNhbnMtc2VyaWYnO1xuICAgIHRoaXMudmlkZW8uY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgIHRoaXMudmlkZW8uY3R4LnRleHRCYXNlbGluZSA9ICdib3R0b20nO1xuXG4gICAgdGhpcy52aWRlby5jdHguZmlsbFN0eWxlID0gJ3JnYmEoMCwgMCwgMCwgMC4xKSc7XG4gICAgdGhpcy52aWRlby5jdHguZmlsbFRleHQoXCJQb3Rpb24uanNcIiwgdGhpcy53aWR0aC8yLCB5ICsgMik7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5maWxsU3R5bGUgPSAnI2QxZmZhMSc7XG4gICAgdGhpcy52aWRlby5jdHguZmlsbFRleHQoXCJQb3Rpb24uanNcIiwgdGhpcy53aWR0aC8yLCB5KTtcblxuICAgIHRoaXMudmlkZW8uY3R4LnN0cm9rZVN0eWxlID0gdGhpcy52aWRlby5jdHguZmlsbFN0eWxlID0gY29sb3IzO1xuICAgIHRoaXMudmlkZW8uY3R4LmZpbGxSZWN0KHgsIHkgKyAxNSwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5saW5lV2lkdGggPSAyO1xuICAgIHRoaXMudmlkZW8uY3R4LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMudmlkZW8uY3R4LnJlY3QoeCAtIDUsIHkgKyAxMCwgd2lkdGggKyAxMCwgaGVpZ2h0ICsgMTApO1xuICAgIHRoaXMudmlkZW8uY3R4LmNsb3NlUGF0aCgpO1xuICAgIHRoaXMudmlkZW8uY3R4LnN0cm9rZSgpO1xuXG4gICAgdGhpcy52aWRlby5jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLnZpZGVvLmN0eC5maWxsU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjEpJztcbiAgICB0aGlzLnZpZGVvLmN0eC5maWxsUmVjdCh4LCB5ICsgMTUsIHRoaXMuX3ByZWxvYWRlcldpZHRoLCBoZWlnaHQgKyAyKTtcblxuICAgIHRoaXMudmlkZW8uY3R4LmxpbmVXaWR0aCA9IDI7XG4gICAgdGhpcy52aWRlby5jdHguYmVnaW5QYXRoKCk7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5tb3ZlVG8oeCArIHRoaXMuX3ByZWxvYWRlcldpZHRoLCB5ICsgMTIpO1xuICAgIHRoaXMudmlkZW8uY3R4LmxpbmVUbyh4IC0gNSwgeSArIDEyKTtcbiAgICB0aGlzLnZpZGVvLmN0eC5saW5lVG8oeCAtIDUsIHkgKyAxMCArIGhlaWdodCArIDEyKTtcbiAgICB0aGlzLnZpZGVvLmN0eC5saW5lVG8oeCArIHRoaXMuX3ByZWxvYWRlcldpZHRoLCB5ICsgMTAgKyBoZWlnaHQgKyAxMik7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5zdHJva2UoKTtcbiAgICB0aGlzLnZpZGVvLmN0eC5jbG9zZVBhdGgoKTtcblxuICAgIHRoaXMudmlkZW8uY3R4LnN0cm9rZVN0eWxlID0gdGhpcy52aWRlby5jdHguZmlsbFN0eWxlID0gY29sb3IxO1xuICAgIHRoaXMudmlkZW8uY3R4LmZpbGxSZWN0KHgsIHkgKyAxNSwgdGhpcy5fcHJlbG9hZGVyV2lkdGgsIGhlaWdodCk7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5saW5lV2lkdGggPSAyO1xuICAgIHRoaXMudmlkZW8uY3R4LmJlZ2luUGF0aCgpO1xuXG4gICAgdGhpcy52aWRlby5jdHgubW92ZVRvKHggKyB0aGlzLl9wcmVsb2FkZXJXaWR0aCwgeSArIDEwKTtcbiAgICB0aGlzLnZpZGVvLmN0eC5saW5lVG8oeCAtIDUsIHkgKyAxMCk7XG4gICAgdGhpcy52aWRlby5jdHgubGluZVRvKHggLSA1LCB5ICsgMTAgKyBoZWlnaHQgKyAxMCk7XG4gICAgdGhpcy52aWRlby5jdHgubGluZVRvKHggKyB0aGlzLl9wcmVsb2FkZXJXaWR0aCwgeSArIDEwICsgaGVpZ2h0ICsgMTApO1xuXG4gICAgdGhpcy52aWRlby5jdHguc3Ryb2tlKCk7XG4gICAgdGhpcy52aWRlby5jdHguY2xvc2VQYXRoKCk7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5yZXN0b3JlKCk7XG4gIH1cbn07XG5cbkdhbWUucHJvdG90eXBlLmNvbmZpZ3VyZSA9IGZ1bmN0aW9uKCkge307XG5cbkdhbWUucHJvdG90eXBlLmZvY3VzID0gZnVuY3Rpb24oKSB7fTtcblxuR2FtZS5wcm90b3R5cGUuYmx1ciA9IGZ1bmN0aW9uKCkge307XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2dhbWUuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHdpbmRvdy5wZXJmb3JtYW5jZSB8fCBEYXRlO1xufSkoKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3RpbWUuanNcbiAqKi8iLCJ2YXIgcmVuZGVyT3JkZXJTb3J0ID0gZnVuY3Rpb24oYSwgYikge1xuICByZXR1cm4gYS5yZW5kZXJPcmRlciA8IGIucmVuZGVyT3JkZXI7XG59O1xuXG52YXIgdXBkYXRlT3JkZXJTb3J0ID0gZnVuY3Rpb24oYSwgYikge1xuICByZXR1cm4gYS51cGRhdGVPcmRlciA8IGIudXBkYXRlT3JkZXI7XG59O1xuXG52YXIgU3RhdGVNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3RhdGVzID0ge307XG4gIHRoaXMucmVuZGVyT3JkZXIgPSBbXTtcbiAgdGhpcy51cGRhdGVPcmRlciA9IFtdO1xufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihuYW1lLCBzdGF0ZSkge1xuICB0aGlzLnN0YXRlc1tuYW1lXSA9IHRoaXMuX25ld1N0YXRlSG9sZGVyKG5hbWUsIHN0YXRlKTtcbiAgdGhpcy5yZWZyZXNoT3JkZXIoKTtcbiAgcmV0dXJuIHN0YXRlO1xufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGlmICghaG9sZGVyLmVuYWJsZWQpIHtcbiAgICAgIGlmIChob2xkZXIuc3RhdGUuZW5hYmxlKSB7XG4gICAgICAgIGhvbGRlci5zdGF0ZS5lbmFibGUoKTtcbiAgICAgIH1cbiAgICAgIGhvbGRlci5lbmFibGVkID0gdHJ1ZTtcbiAgICAgIGhvbGRlci5jaGFuZ2VkID0gdHJ1ZTtcblxuICAgICAgaWYgKGhvbGRlci5wYXVzZWQpIHtcbiAgICAgICAgdGhpcy51bnBhdXNlKG5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBpZiAoaG9sZGVyLmVuYWJsZWQpIHtcbiAgICAgIGlmIChob2xkZXIuc3RhdGUuZGlzYWJsZSkge1xuICAgICAgICBob2xkZXIuc3RhdGUuZGlzYWJsZSgpO1xuICAgICAgfVxuICAgICAgaG9sZGVyLmNoYW5nZWQgPSB0cnVlO1xuICAgICAgaG9sZGVyLmVuYWJsZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaWYgKGhvbGRlci5lbmFibGVkKSB7XG4gICAgICBob2xkZXIuY2hhbmdlZCA9IHRydWU7XG4gICAgICBob2xkZXIucmVuZGVyID0gZmFsc2U7XG4gICAgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGlmIChob2xkZXIuZW5hYmxlZCkge1xuICAgICAgaG9sZGVyLmNoYW5nZWQgPSB0cnVlO1xuICAgICAgaG9sZGVyLnJlbmRlciA9IHRydWU7XG4gICAgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBpZiAoaG9sZGVyLnN0YXRlLnBhdXNlKSB7XG4gICAgICBob2xkZXIuc3RhdGUucGF1c2UoKTtcbiAgICB9XG5cbiAgICBob2xkZXIuY2hhbmdlZCA9IHRydWU7XG4gICAgaG9sZGVyLnBhdXNlZCA9IHRydWU7XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUudW5wYXVzZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaWYgKGhvbGRlci5zdGF0ZS51bnBhdXNlKSB7XG4gICAgICBob2xkZXIuc3RhdGUudW5wYXVzZSgpO1xuICAgIH1cblxuICAgIGhvbGRlci5jaGFuZ2VkID0gdHJ1ZTtcbiAgICBob2xkZXIucGF1c2VkID0gZmFsc2U7XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUucHJvdGVjdCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaG9sZGVyLnByb3RlY3QgPSB0cnVlO1xuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnVucHJvdGVjdCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaG9sZGVyLnByb3RlY3QgPSBmYWxzZTtcbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5yZWZyZXNoT3JkZXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5yZW5kZXJPcmRlci5sZW5ndGggPSAwO1xuICB0aGlzLnVwZGF0ZU9yZGVyLmxlbmd0aCA9IDA7XG5cbiAgZm9yICh2YXIgbmFtZSBpbiB0aGlzLnN0YXRlcykge1xuICAgIHZhciBob2xkZXIgPSB0aGlzLnN0YXRlc1tuYW1lXTtcbiAgICBpZiAoaG9sZGVyKSB7XG4gICAgICB0aGlzLnJlbmRlck9yZGVyLnB1c2goaG9sZGVyKTtcbiAgICAgIHRoaXMudXBkYXRlT3JkZXIucHVzaChob2xkZXIpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMucmVuZGVyT3JkZXIuc29ydChyZW5kZXJPcmRlclNvcnQpO1xuICB0aGlzLnVwZGF0ZU9yZGVyLnNvcnQodXBkYXRlT3JkZXJTb3J0KTtcbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuX25ld1N0YXRlSG9sZGVyID0gZnVuY3Rpb24obmFtZSwgc3RhdGUpIHtcbiAgdmFyIGhvbGRlciA9IHt9O1xuICBob2xkZXIubmFtZSA9IG5hbWU7XG4gIGhvbGRlci5zdGF0ZSA9IHN0YXRlO1xuXG4gIGhvbGRlci5wcm90ZWN0ID0gZmFsc2U7XG5cbiAgaG9sZGVyLmVuYWJsZWQgPSB0cnVlO1xuICBob2xkZXIucGF1c2VkID0gZmFsc2U7XG5cbiAgaG9sZGVyLnJlbmRlciA9IHRydWU7XG5cbiAgaG9sZGVyLmluaXRpYWxpemVkID0gZmFsc2U7XG4gIGhvbGRlci51cGRhdGVkID0gZmFsc2U7XG4gIGhvbGRlci5jaGFuZ2VkID0gdHJ1ZTtcblxuICBob2xkZXIudXBkYXRlT3JkZXIgPSAwO1xuICBob2xkZXIucmVuZGVyT3JkZXIgPSAwO1xuXG4gIHJldHVybiBob2xkZXI7XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnNldFVwZGF0ZU9yZGVyID0gZnVuY3Rpb24obmFtZSwgb3JkZXIpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaG9sZGVyLnVwZGF0ZU9yZGVyID0gb3JkZXI7XG4gICAgdGhpcy5yZWZyZXNoT3JkZXIoKTtcbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5zZXRSZW5kZXJPcmRlciA9IGZ1bmN0aW9uKG5hbWUsIG9yZGVyKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGhvbGRlci5yZW5kZXJPcmRlciA9IG9yZGVyO1xuICAgIHRoaXMucmVmcmVzaE9yZGVyKCk7XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChzdGF0ZSAmJiAhc3RhdGUucHJvdGVjdCkge1xuICAgIGlmIChzdGF0ZS5zdGF0ZS5jbG9zZSkge1xuICAgICAgc3RhdGUuc3RhdGUuY2xvc2UoKTtcbiAgICB9XG4gICAgZGVsZXRlIHRoaXMuc3RhdGVzW25hbWVdO1xuICAgIHRoaXMucmVmcmVzaE9yZGVyKCk7XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuZGVzdHJveUFsbCA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLnVwZGF0ZU9yZGVyLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMudXBkYXRlT3JkZXJbaV07XG4gICAgaWYgKCFzdGF0ZS5wcm90ZWN0KSB7XG4gICAgICBpZiAoc3RhdGUuc3RhdGUuY2xvc2UpIHtcbiAgICAgICAgc3RhdGUuc3RhdGUuY2xvc2UoKTtcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSB0aGlzLnN0YXRlc1tzdGF0ZS5uYW1lXTtcbiAgICB9XG4gIH1cblxuICB0aGlzLnJlZnJlc2hPcmRlcigpO1xufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHJldHVybiB0aGlzLnN0YXRlc1tuYW1lXTtcbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLnVwZGF0ZU9yZGVyLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMudXBkYXRlT3JkZXJbaV07XG5cbiAgICBpZiAoc3RhdGUpIHtcbiAgICAgIHN0YXRlLmNoYW5nZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKHN0YXRlLmVuYWJsZWQpIHtcbiAgICAgICAgaWYgKCFzdGF0ZS5pbml0aWFsaXplZCAmJiBzdGF0ZS5zdGF0ZS5pbml0KSB7XG4gICAgICAgICAgc3RhdGUuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICAgIHN0YXRlLnN0YXRlLmluaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdGF0ZS5zdGF0ZS51cGRhdGUgJiYgIXN0YXRlLnBhdXNlZCkge1xuICAgICAgICAgIHN0YXRlLnN0YXRlLnVwZGF0ZSh0aW1lKTtcbiAgICAgICAgICBzdGF0ZS51cGRhdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5leGl0VXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLnVwZGF0ZU9yZGVyLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMudXBkYXRlT3JkZXJbaV07XG5cbiAgICBpZiAoc3RhdGUuZW5hYmxlZCAmJiBzdGF0ZS5zdGF0ZS5leGl0VXBkYXRlICYmICFzdGF0ZS5wYXVzZWQpIHtcbiAgICAgIHN0YXRlLnN0YXRlLmV4aXRVcGRhdGUodGltZSk7XG4gICAgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLnJlbmRlck9yZGVyLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMucmVuZGVyT3JkZXJbaV07XG4gICAgaWYgKHN0YXRlLmVuYWJsZWQgJiYgKHN0YXRlLnVwZGF0ZWQgfHwgIXN0YXRlLnN0YXRlLnVwZGF0ZSkgJiYgc3RhdGUucmVuZGVyICYmIHN0YXRlLnN0YXRlLnJlbmRlcikge1xuICAgICAgc3RhdGUuc3RhdGUucmVuZGVyKCk7XG4gICAgfVxuICB9XG59O1xuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5tb3VzZW1vdmUgPSBmdW5jdGlvbih4LCB5LCBlKSB7XG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcbiAgICBpZiAoc3RhdGUuZW5hYmxlZCAmJiAhc3RhdGUuY2hhbmdlZCAmJiBzdGF0ZS5zdGF0ZS5tb3VzZW1vdmUgJiYgIXN0YXRlLnBhdXNlZCkge1xuICAgICAgc3RhdGUuc3RhdGUubW91c2Vtb3ZlKHgsIHksIGUpO1xuICAgIH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5tb3VzZXVwID0gZnVuY3Rpb24oeCwgeSwgYnV0dG9uKSB7XG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcbiAgICBpZiAoc3RhdGUuZW5hYmxlZCAmJiAhc3RhdGUuY2hhbmdlZCAmJiBzdGF0ZS5zdGF0ZS5tb3VzZXVwICYmICFzdGF0ZS5wYXVzZWQpIHtcbiAgICAgIHN0YXRlLnN0YXRlLm1vdXNldXAoeCwgeSwgYnV0dG9uKTtcbiAgICB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUubW91c2Vkb3duID0gZnVuY3Rpb24oeCwgeSwgYnV0dG9uKSB7XG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcbiAgICBpZiAoc3RhdGUuZW5hYmxlZCAmJiAhc3RhdGUuY2hhbmdlZCAmJiBzdGF0ZS5zdGF0ZS5tb3VzZWRvd24gJiYgIXN0YXRlLnBhdXNlZCkge1xuICAgICAgc3RhdGUuc3RhdGUubW91c2Vkb3duKHgsIHksIGJ1dHRvbik7XG4gICAgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmtleXVwID0gZnVuY3Rpb24oa2V5LCBlKSB7XG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcbiAgICBpZiAoc3RhdGUuZW5hYmxlZCAmJiAhc3RhdGUuY2hhbmdlZCAmJiBzdGF0ZS5zdGF0ZS5rZXl1cCAmJiAhc3RhdGUucGF1c2VkKSB7XG4gICAgICBzdGF0ZS5zdGF0ZS5rZXl1cChrZXksIGUpO1xuICAgIH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5rZXlkb3duID0gZnVuY3Rpb24oa2V5LCBlKSB7XG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcbiAgICBpZiAoc3RhdGUuZW5hYmxlZCAmJiAhc3RhdGUuY2hhbmdlZCAmJiBzdGF0ZS5zdGF0ZS5rZXlkb3duICYmICFzdGF0ZS5wYXVzZWQpIHtcbiAgICAgIHN0YXRlLnN0YXRlLmtleWRvd24oa2V5LCBlKTtcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdGVNYW5hZ2VyO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvc3RhdGUtbWFuYWdlci5qc1xuICoqLyIsInZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xudmFyIERpcnR5TWFuYWdlciA9IHJlcXVpcmUoJy4vZGlydHktbWFuYWdlcicpO1xuXG52YXIgT2JqZWN0UG9vbCA9IFtdO1xuXG52YXIgR2V0T2JqZWN0RnJvbVBvb2wgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc3VsdCA9IE9iamVjdFBvb2wucG9wKCk7XG5cbiAgaWYgKHJlc3VsdCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICByZXR1cm4ge307XG59O1xuXG52YXIgaW5kZXhUb051bWJlckFuZExvd2VyQ2FzZUtleSA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gIGlmIChpbmRleCA8PSA5KSB7XG4gICAgcmV0dXJuIDQ4ICsgaW5kZXg7XG4gIH0gZWxzZSBpZiAoaW5kZXggPT09IDEwKSB7XG4gICAgcmV0dXJuIDQ4O1xuICB9IGVsc2UgaWYgKGluZGV4ID4gMTAgJiYgaW5kZXggPD0gMzYpIHtcbiAgICByZXR1cm4gNjQgKyAoaW5kZXgtMTApO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59O1xuXG52YXIgZGVmYXVsdHMgPSBbXG4gIHsgbmFtZTogJ1Nob3cgRlBTJywgZW50cnk6ICdzaG93RnBzJywgZGVmYXVsdDogdHJ1ZSB9LFxuICB7IG5hbWU6ICdTaG93IEtleSBDb2RlcycsIGVudHJ5OiAnc2hvd0tleUNvZGVzJywgZGVmYXVsdDogdHJ1ZSB9XG5dO1xuXG52YXIgRGVidWdnZXIgPSBmdW5jdGlvbihhcHApIHtcbiAgdGhpcy52aWRlbyA9IGFwcC52aWRlby5jcmVhdGVMYXllcih7XG4gICAgdXNlUmV0aW5hOiB0cnVlLFxuICAgIGluaXRpYWxpemVDYW52YXM6IHRydWVcbiAgfSk7XG4gIHRoaXMuYXBwID0gYXBwO1xuXG4gIHRoaXMub3B0aW9ucyA9IGRlZmF1bHRzO1xuICB0aGlzLl9tYXhMb2dzQ291bnRzID0gMTA7XG5cbiAgZm9yICh2YXIgaT0wOyBpPHRoaXMub3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBvcHRpb24gPSB0aGlzLm9wdGlvbnNbaV07XG4gICAgdGhpcy5faW5pdE9wdGlvbihvcHRpb24pO1xuICB9XG5cbiAgdGhpcy5kaXNhYmxlZCA9IGZhbHNlO1xuXG4gIHRoaXMuZnBzID0gMDtcbiAgdGhpcy5mcHNDb3VudCA9IDA7XG4gIHRoaXMuZnBzRWxhcHNlZFRpbWUgPSAwO1xuICB0aGlzLmZwc1VwZGF0ZUludGVydmFsID0gMC41O1xuXG4gIHRoaXMuX2ZvbnRTaXplID0gMDtcbiAgdGhpcy5fZGlydHlNYW5hZ2VyID0gbmV3IERpcnR5TWFuYWdlcih0aGlzLnZpZGVvLmNhbnZhcywgdGhpcy52aWRlby5jdHgpO1xuXG4gIHRoaXMubG9ncyA9IFtdO1xuXG4gIHRoaXMuc2hvd0RlYnVnID0gZmFsc2U7XG4gIHRoaXMuZW5hYmxlRGVidWdLZXlzID0gdHJ1ZTtcbiAgdGhpcy5lbmFibGVTaG9ydGN1dHMgPSBmYWxzZTtcblxuICB0aGlzLmVuYWJsZVNob3J0Y3V0c0tleSA9IDIyMDtcblxuICB0aGlzLmxhc3RLZXkgPSBudWxsO1xuXG4gIHRoaXMuX2xvYWQoKTtcblxuICB0aGlzLmtleVNob3J0Y3V0cyA9IFtcbiAgICB7IGtleTogMTIzLCBlbnRyeTogJ3Nob3dEZWJ1ZycsIHR5cGU6ICd0b2dnbGUnIH1cbiAgXTtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5fc2V0Rm9udCA9IGZ1bmN0aW9uKHB4LCBmb250KSB7XG4gIHRoaXMuX2ZvbnRTaXplID0gcHg7XG4gIHRoaXMudmlkZW8uY3R4LmZvbnQgPSBweCArICdweCAnICsgZm9udDtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy52aWRlby5zZXRTaXplKHRoaXMuYXBwLndpZHRoLCB0aGlzLmFwcC5oZWlnaHQpO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLmFkZENvbmZpZyA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICB0aGlzLm9wdGlvbnMucHVzaChvcHRpb24pO1xuICB0aGlzLl9pbml0T3B0aW9uKG9wdGlvbik7XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuX2luaXRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgb3B0aW9uLnR5cGUgPSBvcHRpb24udHlwZSB8fCAndG9nZ2xlJztcbiAgb3B0aW9uLmRlZmF1bHQgPSBvcHRpb24uZGVmYXVsdCA9PSBudWxsID8gZmFsc2UgOiBvcHRpb24uZGVmYXVsdDtcblxuICBpZiAob3B0aW9uLnR5cGUgPT09ICd0b2dnbGUnKSB7XG4gICAgdGhpc1tvcHRpb24uZW50cnldID0gb3B0aW9uLmRlZmF1bHQ7XG4gIH1cbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmxvZ3MubGVuZ3RoID0gMDtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5sb2cgPSBmdW5jdGlvbihtZXNzYWdlLCBjb2xvcikge1xuICBjb2xvciA9IGNvbG9yIHx8ICd3aGl0ZSc7XG4gIG1lc3NhZ2UgPSB0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycgPyBtZXNzYWdlIDogdXRpbC5pbnNwZWN0KG1lc3NhZ2UpO1xuXG4gIHZhciBtZXNzYWdlcyA9IG1lc3NhZ2UucmVwbGFjZSgvXFxcXCcvZywgXCInXCIpLnNwbGl0KCdcXG4nKTtcblxuICBmb3IgKHZhciBpPTA7IGk8bWVzc2FnZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbXNnID0gbWVzc2FnZXNbaV07XG4gICAgaWYgKHRoaXMubG9ncy5sZW5ndGggPj0gdGhpcy5fbWF4TG9nc0NvdW50cykge1xuICAgICAgT2JqZWN0UG9vbC5wdXNoKHRoaXMubG9ncy5zaGlmdCgpKTtcbiAgICB9XG5cbiAgICB2YXIgbWVzc2FnZU9iamVjdCA9IEdldE9iamVjdEZyb21Qb29sKCk7XG4gICAgbWVzc2FnZU9iamVjdC50ZXh0ID0gbXNnO1xuICAgIG1lc3NhZ2VPYmplY3QubGlmZSA9IDEwO1xuICAgIG1lc3NhZ2VPYmplY3QuY29sb3IgPSBjb2xvcjtcblxuICAgIHRoaXMubG9ncy5wdXNoKG1lc3NhZ2VPYmplY3QpO1xuICB9XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7fTtcblxuRGVidWdnZXIucHJvdG90eXBlLmV4aXRVcGRhdGUgPSBmdW5jdGlvbih0aW1lKSB7XG4gIGlmICh0aGlzLmRpc2FibGVkKSB7IHJldHVybjsgfVxuXG4gIGlmICh0aGlzLnNob3dEZWJ1Zykge1xuICAgIHRoaXMuX21heExvZ3NDb3VudHMgPSBNYXRoLmNlaWwoKHRoaXMuYXBwLmhlaWdodCArIDIwKS8yMCk7XG4gICAgdGhpcy5mcHNDb3VudCArPSAxO1xuICAgIHRoaXMuZnBzRWxhcHNlZFRpbWUgKz0gdGltZTtcblxuICAgIGlmICh0aGlzLmZwc0VsYXBzZWRUaW1lID4gdGhpcy5mcHNVcGRhdGVJbnRlcnZhbCkge1xuICAgICAgdmFyIGZwcyA9IHRoaXMuZnBzQ291bnQvdGhpcy5mcHNFbGFwc2VkVGltZTtcblxuICAgICAgaWYgKHRoaXMuc2hvd0Zwcykge1xuICAgICAgICB0aGlzLmZwcyA9IHRoaXMuZnBzICogKDEtMC44KSArIDAuOCAqIGZwcztcbiAgICAgIH1cblxuICAgICAgdGhpcy5mcHNDb3VudCA9IDA7XG4gICAgICB0aGlzLmZwc0VsYXBzZWRUaW1lID0gMDtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLmxvZ3MubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgICB2YXIgbG9nID0gdGhpcy5sb2dzW2ldO1xuICAgICAgaWYgKGxvZykge1xuICAgICAgICBsb2cubGlmZSAtPSB0aW1lO1xuICAgICAgICBpZiAobG9nLmxpZmUgPD0gMCkge1xuICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMubG9ncy5pbmRleE9mKGxvZyk7XG4gICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHsgdGhpcy5sb2dzLnNwbGljZShpbmRleCwgMSk7IH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuRGVidWdnZXIucHJvdG90eXBlLmtleWRvd24gPSBmdW5jdGlvbihrZXksIGUpIHtcbiAgaWYgKHRoaXMuZGlzYWJsZWQpIHsgcmV0dXJuOyB9XG5cbiAgdGhpcy5sYXN0S2V5ID0ga2V5O1xuXG4gIHZhciBpO1xuXG4gIGlmICh0aGlzLmVuYWJsZURlYnVnS2V5cykge1xuICAgIGlmIChrZXkgPT09IHRoaXMuZW5hYmxlU2hvcnRjdXRzS2V5KSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHRoaXMuZW5hYmxlU2hvcnRjdXRzID0gIXRoaXMuZW5hYmxlU2hvcnRjdXRzO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZW5hYmxlU2hvcnRjdXRzKSB7XG4gICAgICBmb3IgKGk9MDsgaTx0aGlzLm9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG9wdGlvbiA9IHRoaXMub3B0aW9uc1tpXTtcbiAgICAgICAgdmFyIGtleUluZGV4ID0gaSArIDE7XG5cbiAgICAgICAgaWYgKHRoaXMuYXBwLmlucHV0LmlzS2V5RG93bignY3RybCcpKSB7XG4gICAgICAgICAga2V5SW5kZXggLT0gMzY7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hhcklkID0gaW5kZXhUb051bWJlckFuZExvd2VyQ2FzZUtleShrZXlJbmRleCk7XG5cbiAgICAgICAgaWYgKGNoYXJJZCAmJiBrZXkgPT09IGNoYXJJZCkge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgIGlmIChvcHRpb24udHlwZSA9PT0gJ3RvZ2dsZScpIHtcblxuICAgICAgICAgICAgdGhpc1tvcHRpb24uZW50cnldID0gIXRoaXNbb3B0aW9uLmVudHJ5XTtcblxuICAgICAgICAgICAgdGhpcy5fc2F2ZSgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9uLnR5cGUgPT09ICdjYWxsJykge1xuICAgICAgICAgICAgb3B0aW9uLmVudHJ5KCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmb3IgKGk9MDsgaTx0aGlzLmtleVNob3J0Y3V0cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXlTaG9ydGN1dCA9IHRoaXMua2V5U2hvcnRjdXRzW2ldO1xuICAgIGlmIChrZXlTaG9ydGN1dC5rZXkgPT09IGtleSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBpZiAoa2V5U2hvcnRjdXQudHlwZSA9PT0gJ3RvZ2dsZScpIHtcbiAgICAgICAgdGhpc1trZXlTaG9ydGN1dC5lbnRyeV0gPSAhdGhpc1trZXlTaG9ydGN1dC5lbnRyeV07XG4gICAgICAgIHRoaXMuX3NhdmUoKTtcbiAgICAgIH0gZWxzZSBpZiAoa2V5U2hvcnRjdXQudHlwZSA9PT0gJ2NhbGwnKSB7XG4gICAgICAgIHRoaXNba2V5U2hvcnRjdXQuZW50cnldKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5fc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGF0YSA9IHtcbiAgICBzaG93RGVidWc6IHRoaXMuc2hvd0RlYnVnLFxuICAgIG9wdGlvbnM6IHt9XG4gIH07XG5cbiAgZm9yICh2YXIgaT0wOyBpPHRoaXMub3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBvcHRpb24gPSB0aGlzLm9wdGlvbnNbaV07XG4gICAgdmFyIHZhbHVlID0gdGhpc1tvcHRpb24uZW50cnldO1xuICAgIGRhdGEub3B0aW9uc1tvcHRpb24uZW50cnldID0gdmFsdWU7XG4gIH1cblxuICB3aW5kb3cubG9jYWxTdG9yYWdlLl9fcG90aW9uRGVidWcgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5fbG9hZCA9IGZ1bmN0aW9uKCkge1xuICBpZiAod2luZG93LmxvY2FsU3RvcmFnZSAmJiB3aW5kb3cubG9jYWxTdG9yYWdlLl9fcG90aW9uRGVidWcpIHtcbiAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2Uod2luZG93LmxvY2FsU3RvcmFnZS5fX3BvdGlvbkRlYnVnKTtcbiAgICB0aGlzLnNob3dEZWJ1ZyA9IGRhdGEuc2hvd0RlYnVnO1xuXG4gICAgZm9yICh2YXIgbmFtZSBpbiBkYXRhLm9wdGlvbnMpIHtcbiAgICAgIHRoaXNbbmFtZV0gPSBkYXRhLm9wdGlvbnNbbmFtZV07XG4gICAgfVxuICB9XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmRpc2FibGVkKSB7IHJldHVybjsgfVxuXG4gIHRoaXMuX2RpcnR5TWFuYWdlci5jbGVhcigpO1xuXG4gIGlmICh0aGlzLnNob3dEZWJ1Zykge1xuICAgIHRoaXMudmlkZW8uY3R4LnNhdmUoKTtcbiAgICB0aGlzLl9zZXRGb250KDE1LCAnc2Fucy1zZXJpZicpO1xuXG4gICAgdGhpcy5fcmVuZGVyTG9ncygpO1xuICAgIHRoaXMuX3JlbmRlckRhdGEoKTtcbiAgICB0aGlzLl9yZW5kZXJTaG9ydGN1dHMoKTtcblxuICAgIHRoaXMudmlkZW8uY3R4LnJlc3RvcmUoKTtcbiAgfVxuXG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuX3JlbmRlckxvZ3MgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy52aWRlby5jdHgudGV4dEFsaWduID0gJ2xlZnQnO1xuICB0aGlzLnZpZGVvLmN0eC50ZXh0QmFzZWxpbmUgPSAnYm90dG9tJztcblxuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLmxvZ3MubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIGxvZyA9IHRoaXMubG9nc1tpXTtcblxuICAgIHZhciB5ID0gLTEwICsgdGhpcy5hcHAuaGVpZ2h0ICsgKGkgLSB0aGlzLmxvZ3MubGVuZ3RoICsgMSkgKiAyMDtcbiAgICB0aGlzLl9yZW5kZXJUZXh0KGxvZy50ZXh0LCAxMCwgeSwgbG9nLmNvbG9yKTtcbiAgfVxufTtcblxuRGVidWdnZXIucHJvdG90eXBlLmRpc2FibGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5kaXNhYmxlZCA9IHRydWU7XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuX3JlbmRlckRhdGEgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy52aWRlby5jdHgudGV4dEFsaWduID0gJ3JpZ2h0JztcbiAgdGhpcy52aWRlby5jdHgudGV4dEJhc2VsaW5lID0gJ3RvcCc7XG5cbiAgdmFyIHggPSB0aGlzLmFwcC53aWR0aCAtIDE0O1xuICB2YXIgeSA9IDE0O1xuXG4gIGlmICh0aGlzLnNob3dGcHMpIHtcbiAgICB0aGlzLl9yZW5kZXJUZXh0KE1hdGgucm91bmQodGhpcy5mcHMpICsgJyBmcHMnLCB4LCB5KTtcbiAgfVxuXG4gIHkgKz0gMjA7XG5cbiAgdGhpcy5fc2V0Rm9udCgxNSwgJ3NhbnMtc2VyaWYnKTtcblxuICBpZiAodGhpcy5zaG93S2V5Q29kZXMpIHtcbiAgICB0aGlzLl9yZW5kZXJUZXh0KCdrZXkgJyArIHRoaXMubGFzdEtleSwgeCwgeSwgdGhpcy5hcHAuaW5wdXQuaXNLZXlEb3duKHRoaXMubGFzdEtleSkgPyAnI2U5ZGM3YycgOiAnd2hpdGUnKTtcbiAgICB0aGlzLl9yZW5kZXJUZXh0KCdidG4gJyArIHRoaXMuYXBwLmlucHV0Lm1vdXNlLmJ1dHRvbiwgeCAtIDYwLCB5LCB0aGlzLmFwcC5pbnB1dC5tb3VzZS5pc0Rvd24gPyAnI2U5ZGM3YycgOiAnd2hpdGUnKTtcbiAgfVxufTtcblxuXG5EZWJ1Z2dlci5wcm90b3R5cGUuX3JlbmRlclNob3J0Y3V0cyA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5lbmFibGVTaG9ydGN1dHMpIHtcbiAgICB2YXIgaGVpZ2h0ID0gMjg7XG5cbiAgICB0aGlzLl9zZXRGb250KDIwLCAnSGVsdmV0aWNhIE5ldWUsIHNhbnMtc2VyaWYnKTtcbiAgICB0aGlzLnZpZGVvLmN0eC50ZXh0QWxpZ24gPSAnbGVmdCc7XG4gICAgdGhpcy52aWRlby5jdHgudGV4dEJhc2VsaW5lID0gJ3RvcCc7XG4gICAgdmFyIG1heFBlckNvbGx1bW4gPSBNYXRoLmZsb29yKCh0aGlzLmFwcC5oZWlnaHQgLSAxNCkvaGVpZ2h0KTtcblxuICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLm9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBvcHRpb24gPSB0aGlzLm9wdGlvbnNbaV07XG4gICAgICB2YXIgeCA9IDE0ICsgTWF0aC5mbG9vcihpL21heFBlckNvbGx1bW4pICogMzIwO1xuICAgICAgdmFyIHkgPSAxNCArIGklbWF4UGVyQ29sbHVtbiAqIGhlaWdodDtcblxuICAgICAgdmFyIGtleUluZGV4ID0gaSArIDE7XG4gICAgICB2YXIgY2hhcklkID0gaW5kZXhUb051bWJlckFuZExvd2VyQ2FzZUtleShrZXlJbmRleCk7XG5cbiAgICAgIHZhciBpc09uID0gdGhpc1tvcHRpb24uZW50cnldO1xuXG4gICAgICB2YXIgc2hvcnRjdXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNoYXJJZCk7XG5cbiAgICAgIGlmICghY2hhcklkKSB7XG4gICAgICAgIHNob3J0Y3V0ID0gJ14rJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaW5kZXhUb051bWJlckFuZExvd2VyQ2FzZUtleShrZXlJbmRleCAtIDM2KSk7XG4gICAgICB9XG5cbiAgICAgIHZhciB0ZXh0ID0gJ1snICsgc2hvcnRjdXQgKyAnXSAnICsgb3B0aW9uLm5hbWU7XG4gICAgICBpZiAob3B0aW9uLnR5cGUgPT09ICd0b2dnbGUnKSB7XG4gICAgICAgIHRleHQgKz0gJyAoJyArIChpc09uID8gJ09OJyA6ICdPRkYnKSArICcpJztcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9uLnR5cGUgPT09ICdjYWxsJykge1xuICAgICAgICB0ZXh0ICs9ICcgKENBTEwpJztcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbG9yID0gJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMSknO1xuICAgICAgdmFyIG91dGxpbmUgPSAncmdiYSgwLCAwLCAwLCAxKSc7XG5cbiAgICAgIGlmICghaXNPbikge1xuICAgICAgICBjb2xvciA9ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIC43KSc7XG4gICAgICAgIG91dGxpbmUgPSAncmdiYSgwLCAwLCAwLCAuNyknO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9yZW5kZXJUZXh0KHRleHQsIHgsIHksIGNvbG9yLCBvdXRsaW5lKTtcbiAgICB9XG4gIH1cbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5fcmVuZGVyVGV4dCA9IGZ1bmN0aW9uKHRleHQsIHgsIHksIGNvbG9yLCBvdXRsaW5lKSB7XG4gIGNvbG9yID0gY29sb3IgfHwgJ3doaXRlJztcbiAgb3V0bGluZSA9IG91dGxpbmUgfHwgJ2JsYWNrJztcbiAgdGhpcy52aWRlby5jdHguZmlsbFN0eWxlID0gY29sb3I7XG4gIHRoaXMudmlkZW8uY3R4LmxpbmVKb2luID0gJ3JvdW5kJztcbiAgdGhpcy52aWRlby5jdHguc3Ryb2tlU3R5bGUgPSBvdXRsaW5lO1xuICB0aGlzLnZpZGVvLmN0eC5saW5lV2lkdGggPSAzO1xuICB0aGlzLnZpZGVvLmN0eC5zdHJva2VUZXh0KHRleHQsIHgsIHkpO1xuICB0aGlzLnZpZGVvLmN0eC5maWxsVGV4dCh0ZXh0LCB4LCB5KTtcblxuICB2YXIgd2lkdGggPSB0aGlzLnZpZGVvLmN0eC5tZWFzdXJlVGV4dCh0ZXh0KS53aWR0aDtcblxuICB2YXIgZHggPSB4IC0gNTtcbiAgdmFyIGR5ID0geTtcbiAgdmFyIGR3aWR0aCA9IHdpZHRoICsgMTA7XG4gIHZhciBkaGVpZ2h0ID0gdGhpcy5fZm9udFNpemUgKyAxMDtcblxuICBpZiAodGhpcy52aWRlby5jdHgudGV4dEFsaWduID09PSAncmlnaHQnKSB7XG4gICAgZHggPSB4IC0gNSAtIHdpZHRoO1xuICB9XG5cbiAgdGhpcy5fZGlydHlNYW5hZ2VyLmFkZFJlY3QoZHgsIGR5LCBkd2lkdGgsIGRoZWlnaHQpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZWJ1Z2dlcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3BvdGlvbi1kZWJ1Z2dlci9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTJcbiAqKi8iLCJ2YXIgaXNSZXRpbmEgPSByZXF1aXJlKCcuL3JldGluYScpKCk7XG5cbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBjYW52YXMgLSBDYW52YXMgRE9NIGVsZW1lbnRcbiAqL1xudmFyIFZpZGVvID0gZnVuY3Rpb24oZ2FtZSwgY2FudmFzLCBjb25maWcpIHtcbiAgdGhpcy5nYW1lID0gZ2FtZTtcblxuICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcblxuICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcblxuICB0aGlzLndpZHRoID0gZ2FtZS53aWR0aDtcblxuICB0aGlzLmhlaWdodCA9IGdhbWUuaGVpZ2h0O1xuXG4gIGlmIChjb25maWcuaW5pdGlhbGl6ZUNhbnZhcykge1xuICAgIHRoaXMuY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gIH1cblxuICB0aGlzLl9hcHBseVNpemVUb0NhbnZhcygpO1xufTtcblxuLyoqXG4gKiBJbmNsdWRlcyBtaXhpbnMgaW50byBWaWRlbyBsaWJyYXJ5XG4gKiBAcGFyYW0ge29iamVjdH0gbWV0aG9kcyAtIG9iamVjdCBvZiBtZXRob2RzIHRoYXQgd2lsbCBpbmNsdWRlZCBpbiBWaWRlb1xuICovXG5WaWRlby5wcm90b3R5cGUuaW5jbHVkZSA9IGZ1bmN0aW9uKG1ldGhvZHMpIHtcbiAgZm9yICh2YXIgbWV0aG9kIGluIG1ldGhvZHMpIHtcbiAgICB0aGlzW21ldGhvZF0gPSBtZXRob2RzW21ldGhvZF07XG4gIH1cbn07XG5cblZpZGVvLnByb3RvdHlwZS5iZWdpbkZyYW1lID0gZnVuY3Rpb24oKSB7fTtcblxuVmlkZW8ucHJvdG90eXBlLmVuZEZyYW1lID0gZnVuY3Rpb24oKSB7fTtcblxuVmlkZW8ucHJvdG90eXBlLnNjYWxlQ2FudmFzID0gZnVuY3Rpb24oc2NhbGUpIHtcbiAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aCArICdweCc7XG4gIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodCArICdweCc7XG5cbiAgdGhpcy5jYW52YXMud2lkdGggKj0gc2NhbGU7XG4gIHRoaXMuY2FudmFzLmhlaWdodCAqPSBzY2FsZTtcblxuICBpZiAodGhpcy5jdHgpIHtcbiAgICB0aGlzLmN0eC5zY2FsZShzY2FsZSwgc2NhbGUpO1xuICB9XG59O1xuXG5WaWRlby5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcbiAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICB0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuICB0aGlzLl9hcHBseVNpemVUb0NhbnZhcygpO1xufTtcblxuVmlkZW8ucHJvdG90eXBlLl9hcHBseVNpemVUb0NhbnZhcyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuXG4gIHZhciBjb250YWluZXIgPSB0aGlzLmNhbnZhcy5wYXJlbnRFbGVtZW50O1xuICBjb250YWluZXIuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgJ3B4JztcbiAgY29udGFpbmVyLnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgJ3B4JztcblxuICBpZiAodGhpcy5jb25maWcudXNlUmV0aW5hICYmIGlzUmV0aW5hKSB7XG4gICAgdGhpcy5zY2FsZUNhbnZhcygyKTtcbiAgfVxufTtcblxuVmlkZW8ucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmN0eCkgeyB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpOyB9XG59O1xuXG5WaWRlby5wcm90b3R5cGUuY3JlYXRlTGF5ZXIgPSBmdW5jdGlvbihjb25maWcpIHtcbiAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG4gIHZhciBjb250YWluZXIgPSB0aGlzLmNhbnZhcy5wYXJlbnRFbGVtZW50O1xuICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gIGNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gIGNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgY2FudmFzLnN0eWxlLnRvcCA9ICcwcHgnO1xuICBjYW52YXMuc3R5bGUubGVmdCA9ICcwcHgnO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2FudmFzKTtcblxuICB2YXIgdmlkZW8gPSBuZXcgVmlkZW8odGhpcy5nYW1lLCBjYW52YXMsIGNvbmZpZyk7XG5cbiAgcmV0dXJuIHZpZGVvO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWRlbztcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3ZpZGVvLmpzXG4gKiovIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbnZhciBQb3Rpb25BdWRpbyA9IHJlcXVpcmUoJ3BvdGlvbi1hdWRpbycpO1xuXG4vKipcbiAqIENsYXNzIGZvciBtYW5hZ2luZyBhbmQgbG9hZGluZyBhc3NldCBmaWxlc1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBBc3NldHMgPSBmdW5jdGlvbigpIHtcbiAgLyoqXG4gICAqIElzIGN1cnJlbnRseSBsb2FkaW5nIGFueSBhc3NldHNcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuXG4gIHRoaXMuaXRlbXNDb3VudCA9IDA7XG4gIHRoaXMubG9hZGVkSXRlbXNDb3VudCA9IDA7XG4gIHRoaXMucHJvZ3Jlc3MgPSAwO1xuXG4gIHRoaXMuX3hociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gIHRoaXMuX3RoaW5nc1RvTG9hZCA9IDA7XG4gIHRoaXMuX2RhdGEgPSB7fTtcblxuICB0aGlzLmNhbGxiYWNrID0gbnVsbDtcblxuICB0aGlzLl90b0xvYWQgPSBbXTtcblxuICB0aGlzLmF1ZGlvID0gbmV3IFBvdGlvbkF1ZGlvKCk7XG59O1xuXG4vKipcbiAqIFN0YXJ0cyBsb2FkaW5nIHN0b3JlZCBhc3NldHMgdXJscyBhbmQgcnVucyBnaXZlbiBjYWxsYmFjayBhZnRlciBldmVyeXRoaW5nIGlzIGxvYWRlZFxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBjYWxsYmFjayBmdW5jdGlvblxuICovXG5Bc3NldHMucHJvdG90eXBlLm9ubG9hZCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcblxuICBpZiAodGhpcy5fdGhpbmdzVG9Mb2FkID09PSAwKSB7XG4gICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9uZXh0RmlsZSgpO1xuICB9XG59O1xuXG4vKipcbiAqIEdldHRlciBmb3IgbG9hZGVkIGFzc2V0c1xuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB1cmwgb2Ygc3RvcmVkIGFzc2V0XG4gKi9cbkFzc2V0cy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSkge1xuICByZXR1cm4gdGhpcy5fZGF0YVtwYXRoLm5vcm1hbGl6ZShuYW1lKV07XG59O1xuXG4vKipcbiAqIFVzZWQgZm9yIHN0b3Jpbmcgc29tZSB2YWx1ZSBpbiBhc3NldHMgbW9kdWxlXG4gKiB1c2VmdWwgZm9yIG92ZXJyYXRpbmcgdmFsdWVzXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHVybCBvZiB0aGUgYXNzZXRcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZSAtIHZhbHVlIHRvIGJlIHN0b3JlZFxuICovXG5Bc3NldHMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHRoaXMuX2RhdGFbcGF0aC5ub3JtYWxpemUobmFtZSldID0gdmFsdWU7XG59O1xuXG4vKipcbiAqIFN0b3JlcyB1cmwgc28gaXQgY2FuIGJlIGxvYWRlZCBsYXRlclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSB0eXBlIG9mIGFzc2V0XG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gdXJsIG9mIGdpdmVuIGFzc2V0XG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gKi9cbkFzc2V0cy5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uKHR5cGUsIHVybCwgY2FsbGJhY2spIHtcbiAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xuICB0aGlzLml0ZW1zQ291bnQgKz0gMTtcbiAgdGhpcy5fdGhpbmdzVG9Mb2FkICs9IDE7XG5cbiAgdGhpcy5fdG9Mb2FkLnB1c2goeyB0eXBlOiB0eXBlLCB1cmw6IHVybCAhPSBudWxsID8gcGF0aC5ub3JtYWxpemUodXJsKSA6IG51bGwsIGNhbGxiYWNrOiBjYWxsYmFjayB9KTtcbn07XG5cbkFzc2V0cy5wcm90b3R5cGUuX2ZpbmlzaGVkT25lRmlsZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9uZXh0RmlsZSgpO1xuICB0aGlzLnByb2dyZXNzID0gdGhpcy5sb2FkZWRJdGVtc0NvdW50IC8gdGhpcy5pdGVtc0NvdW50O1xuICB0aGlzLl90aGluZ3NUb0xvYWQgLT0gMTtcbiAgdGhpcy5sb2FkZWRJdGVtc0NvdW50ICs9IDE7XG5cbiAgaWYgKHRoaXMuX3RoaW5nc1RvTG9hZCA9PT0gMCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi5jYWxsYmFjaygpO1xuICAgICAgc2VsZi5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICB9LCAwKTtcbiAgfVxufTtcblxuQXNzZXRzLnByb3RvdHlwZS5fZXJyb3IgPSBmdW5jdGlvbih0eXBlLCB1cmwpIHtcbiAgY29uc29sZS53YXJuKCdFcnJvciBsb2FkaW5nIFwiJyArIHR5cGUgKyAnXCIgYXNzZXQgd2l0aCB1cmwgJyArIHVybCk7XG4gIHRoaXMuX25leHRGaWxlKCk7XG59O1xuXG5Bc3NldHMucHJvdG90eXBlLl9zYXZlID0gZnVuY3Rpb24odXJsLCBkYXRhLCBjYWxsYmFjaykge1xuICB0aGlzLnNldCh1cmwsIGRhdGEpO1xuICBpZiAoY2FsbGJhY2spIHsgY2FsbGJhY2soZGF0YSk7IH1cbiAgdGhpcy5fZmluaXNoZWRPbmVGaWxlKCk7XG59O1xuXG5Bc3NldHMucHJvdG90eXBlLl9oYW5kbGVDdXN0b21Mb2FkaW5nID0gZnVuY3Rpb24obG9hZGluZykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBkb25lID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICBzZWxmLl9zYXZlKG5hbWUsIHZhbHVlKTtcbiAgfTtcbiAgbG9hZGluZyhkb25lKTtcbn07XG5cbkFzc2V0cy5wcm90b3R5cGUuX25leHRGaWxlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5fdG9Mb2FkLnNoaWZ0KCk7XG5cbiAgaWYgKCFjdXJyZW50KSB7IHJldHVybjsgfVxuXG4gIHZhciB0eXBlID0gY3VycmVudC50eXBlO1xuICB2YXIgdXJsID0gY3VycmVudC51cmw7XG4gIHZhciBjYWxsYmFjayA9IGN1cnJlbnQuY2FsbGJhY2s7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIGlmICh1dGlscy5pc0Z1bmN0aW9uKHR5cGUpKSB7XG4gICAgdGhpcy5faGFuZGxlQ3VzdG9tTG9hZGluZyh0eXBlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0eXBlID0gdHlwZS50b0xvd2VyQ2FzZSgpO1xuXG4gIHZhciByZXF1ZXN0ID0gdGhpcy5feGhyO1xuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ2pzb24nOlxuICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSAndGV4dCc7XG4gICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSk7XG4gICAgICAgIHNlbGYuX3NhdmUodXJsLCBkYXRhLCBjYWxsYmFjayk7XG4gICAgICB9O1xuICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oKSB7IHNlbGYuX2Vycm9yKHR5cGUsIHVybCk7IH07XG4gICAgICByZXF1ZXN0LnNlbmQoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ21wMyc6XG4gICAgY2FzZSAnbXVzaWMnOlxuICAgIGNhc2UgJ3NvdW5kJzpcbiAgICAgIHNlbGYuYXVkaW8ubG9hZCh1cmwsIGZ1bmN0aW9uKGF1ZGlvKSB7XG4gICAgICAgIHNlbGYuX3NhdmUodXJsLCBhdWRpbywgY2FsbGJhY2spO1xuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdpbWFnZSc6XG4gICAgY2FzZSAndGV4dHVyZSc6XG4gICAgY2FzZSAnc3ByaXRlJzpcbiAgICAgIHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYuX3NhdmUodXJsLCBpbWFnZSwgY2FsbGJhY2spO1xuICAgICAgfTtcbiAgICAgIGltYWdlLm9uZXJyb3IgPSBmdW5jdGlvbigpIHsgc2VsZi5fZXJyb3IodHlwZSwgdXJsKTsgfTtcbiAgICAgIGltYWdlLnNyYyA9IHVybDtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6IC8vIHRleHQgZmlsZXNcbiAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgdXJsLCB0cnVlKTtcbiAgICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ3RleHQnO1xuICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLnJlc3BvbnNlO1xuICAgICAgICBzZWxmLl9zYXZlKHVybCwgZGF0YSwgY2FsbGJhY2spO1xuICAgICAgfTtcbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKCkgeyBzZWxmLl9lcnJvcih0eXBlLCB1cmwpOyB9O1xuICAgICAgcmVxdWVzdC5zZW5kKCk7XG4gICAgICBicmVhaztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBc3NldHM7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9hc3NldHMuanNcbiAqKi8iLCJ2YXIga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIElucHV0IHdyYXBwZXJcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtHYW1lfSBnYW1lIC0gR2FtZSBvYmplY3RcbiAqL1xudmFyIElucHV0ID0gZnVuY3Rpb24oZ2FtZSwgY29udGFpbmVyKSB7XG4gIHRoaXMuX2NvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgLyoqXG4gICAqIFByZXNzZWQga2V5cyBvYmplY3RcbiAgICogQHR5cGUge29iamVjdH1cbiAgICovXG4gIHRoaXMua2V5cyA9IHt9O1xuXG4gIC8qKlxuICAgKiBDb250cm9scyBpZiB5b3UgY2FuIHByZXNzIGtleXNcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICB0aGlzLmNhbkNvbnRyb2xLZXlzID0gdHJ1ZTtcblxuICAvKipcbiAgICogTW91c2Ugb2JqZWN0IHdpdGggcG9zaXRpb25zIGFuZCBpZiBpcyBtb3VzZSBidXR0b24gcHJlc3NlZFxuICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgKi9cbiAgdGhpcy5tb3VzZSA9IHtcbiAgICBpc0Rvd246IGZhbHNlLFxuICAgIGlzTGVmdERvd246IGZhbHNlLFxuICAgIGlzTWlkZGxlRG93bjogZmFsc2UsXG4gICAgaXNSaWdodERvd246IGZhbHNlLFxuICAgIHg6IG51bGwsXG4gICAgeTogbnVsbFxuICB9O1xuXG4gIHRoaXMuX2FkZEV2ZW50cyhnYW1lKTtcbn07XG5cbi8qKlxuICogQ2xlYXJzIHRoZSBwcmVzc2VkIGtleXMgb2JqZWN0XG4gKi9cbklucHV0LnByb3RvdHlwZS5yZXNldEtleXMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5rZXlzID0ge307XG59O1xuXG4vKipcbiAqIFJldHVybiB0cnVlIG9yIGZhbHNlIGlmIGtleSBpcyBwcmVzc2VkXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5JbnB1dC5wcm90b3R5cGUuaXNLZXlEb3duID0gZnVuY3Rpb24oa2V5KSB7XG4gIGlmIChrZXkgPT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBpZiAodGhpcy5jYW5Db250cm9sS2V5cykge1xuICAgIHZhciBjb2RlID0gdHlwZW9mIGtleSA9PT0gJ251bWJlcicgPyBrZXkgOiBrZXlzW2tleS50b1VwcGVyQ2FzZSgpXTtcbiAgICByZXR1cm4gdGhpcy5rZXlzW2NvZGVdO1xuICB9XG59O1xuXG4vKipcbiAqIEFkZCBjYW52YXMgZXZlbnQgbGlzdGVuZXJcbiAqIEBwcml2YXRlXG4gKi9cbklucHV0LnByb3RvdHlwZS5fYWRkRXZlbnRzID0gZnVuY3Rpb24oZ2FtZSkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgeCA9IGUub2Zmc2V0WCA9PT0gdW5kZWZpbmVkID8gZS5sYXllclggLSBzZWxmLl9jb250YWluZXIub2Zmc2V0TGVmdCA6IGUub2Zmc2V0WDtcbiAgICB2YXIgeSA9IGUub2Zmc2V0WSA9PT0gdW5kZWZpbmVkID8gZS5sYXllclkgLSBzZWxmLl9jb250YWluZXIub2Zmc2V0VG9wIDogZS5vZmZzZXRZO1xuXG4gICAgc2VsZi5tb3VzZS54ID0geDtcbiAgICBzZWxmLm1vdXNlLnkgPSB5O1xuXG4gICAgZ2FtZS5zdGF0ZXMubW91c2Vtb3ZlKHgsIHksIGUpO1xuICB9KTtcblxuICBzZWxmLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgeCA9IGUub2Zmc2V0WCA9PT0gdW5kZWZpbmVkID8gZS5sYXllclggLSBzZWxmLl9jb250YWluZXIub2Zmc2V0TGVmdCA6IGUub2Zmc2V0WDtcbiAgICB2YXIgeSA9IGUub2Zmc2V0WSA9PT0gdW5kZWZpbmVkID8gZS5sYXllclkgLSBzZWxmLl9jb250YWluZXIub2Zmc2V0VG9wIDogZS5vZmZzZXRZO1xuXG4gICAgc2VsZi5tb3VzZS5pc0Rvd24gPSBmYWxzZTtcblxuICAgIHN3aXRjaCAoZS5idXR0b24pIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgc2VsZi5tb3VzZS5pc0xlZnREb3duID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgc2VsZi5tb3VzZS5pc01pZGRsZURvd24gPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHNlbGYubW91c2UuaXNSaWdodERvd24gPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgZ2FtZS5zdGF0ZXMubW91c2V1cCh4LCB5LCBlLmJ1dHRvbik7XG4gIH0sIGZhbHNlKTtcblxuICBzZWxmLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciB4ID0gZS5vZmZzZXRYID09PSB1bmRlZmluZWQgPyBlLmxheWVyWCAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRMZWZ0IDogZS5vZmZzZXRYO1xuICAgIHZhciB5ID0gZS5vZmZzZXRZID09PSB1bmRlZmluZWQgPyBlLmxheWVyWSAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRUb3AgOiBlLm9mZnNldFk7XG5cbiAgICBzZWxmLm1vdXNlLnggPSB4O1xuICAgIHNlbGYubW91c2UueSA9IHk7XG4gICAgc2VsZi5tb3VzZS5pc0Rvd24gPSB0cnVlO1xuXG4gICAgc3dpdGNoIChlLmJ1dHRvbikge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBzZWxmLm1vdXNlLmlzTGVmdERvd24gPSB0cnVlO1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHNlbGYubW91c2UuaXNNaWRkbGVEb3duID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHNlbGYubW91c2UuaXNSaWdodERvd24gPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBnYW1lLnN0YXRlcy5tb3VzZWRvd24oeCwgeSwgZS5idXR0b24pO1xuICB9LCBmYWxzZSk7XG5cbiAgc2VsZi5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgZm9yICh2YXIgaT0wOyBpPGUudG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHRvdWNoID0gZS50b3VjaGVzW2ldO1xuXG4gICAgICB2YXIgeCA9IHRvdWNoLnBhZ2VYIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldExlZnQ7XG4gICAgICB2YXIgeSA9IHRvdWNoLnBhZ2VZIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldFRvcDtcblxuICAgICAgc2VsZi5tb3VzZS54ID0geDtcbiAgICAgIHNlbGYubW91c2UueSA9IHk7XG4gICAgICBzZWxmLm1vdXNlLmlzRG93biA9IHRydWU7XG4gICAgICBzZWxmLm1vdXNlLmlzTGVmdERvd24gPSB0cnVlO1xuXG4gICAgICBnYW1lLnN0YXRlcy5tb3VzZWRvd24oeCwgeSwgMSk7XG4gICAgfVxuICB9KTtcblxuICBzZWxmLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGZvciAodmFyIGk9MDsgaTxlLnRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB0b3VjaCA9IGUudG91Y2hlc1tpXTtcblxuICAgICAgdmFyIHggPSB0b3VjaC5wYWdlWCAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRMZWZ0O1xuICAgICAgdmFyIHkgPSB0b3VjaC5wYWdlWSAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRUb3A7XG5cbiAgICAgIHNlbGYubW91c2UueCA9IHg7XG4gICAgICBzZWxmLm1vdXNlLnkgPSB5O1xuICAgICAgc2VsZi5tb3VzZS5pc0Rvd24gPSB0cnVlO1xuICAgICAgc2VsZi5tb3VzZS5pc0xlZnREb3duID0gdHJ1ZTtcblxuICAgICAgZ2FtZS5zdGF0ZXMubW91c2Vtb3ZlKHgsIHkpO1xuICAgIH1cbiAgfSk7XG5cbiAgc2VsZi5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciB0b3VjaCA9IGUuY2hhbmdlZFRvdWNoZXNbMF07XG5cbiAgICB2YXIgeCA9IHRvdWNoLnBhZ2VYIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldExlZnQ7XG4gICAgdmFyIHkgPSB0b3VjaC5wYWdlWSAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRUb3A7XG5cbiAgICBzZWxmLm1vdXNlLnggPSB4O1xuICAgIHNlbGYubW91c2UueSA9IHk7XG4gICAgc2VsZi5tb3VzZS5pc0Rvd24gPSBmYWxzZTtcbiAgICBzZWxmLm1vdXNlLmlzTGVmdERvd24gPSBmYWxzZTtcblxuICAgIGdhbWUuc3RhdGVzLm1vdXNldXAoeCwgeSwgMSk7XG4gIH0pO1xuXG4gIHNlbGYuX2NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH0pO1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgZ2FtZS5pbnB1dC5rZXlzW2Uua2V5Q29kZV0gPSB0cnVlO1xuICAgIGdhbWUuc3RhdGVzLmtleWRvd24oZS53aGljaCwgZSk7XG4gIH0pO1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24oZSkge1xuICAgIGdhbWUuaW5wdXQua2V5c1tlLmtleUNvZGVdID0gZmFsc2U7XG4gICAgZ2FtZS5zdGF0ZXMua2V5dXAoZS53aGljaCwgZSk7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dDtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2lucHV0LmpzXG4gKiovIiwidmFyIERpcnR5TWFuYWdlciA9IGZ1bmN0aW9uKGNhbnZhcywgY3R4KSB7XG4gIHRoaXMuY3R4ID0gY3R4O1xuICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcblxuICB0aGlzLnRvcCA9IGNhbnZhcy5oZWlnaHQ7XG4gIHRoaXMubGVmdCA9IGNhbnZhcy53aWR0aDtcbiAgdGhpcy5ib3R0b20gPSAwO1xuICB0aGlzLnJpZ2h0ID0gMDtcblxuICB0aGlzLmlzRGlydHkgPSBmYWxzZTtcbn07XG5cbkRpcnR5TWFuYWdlci5wcm90b3R5cGUuYWRkUmVjdCA9IGZ1bmN0aW9uKGxlZnQsIHRvcCwgd2lkdGgsIGhlaWdodCkge1xuICB2YXIgcmlnaHQgID0gbGVmdCArIHdpZHRoO1xuICB2YXIgYm90dG9tID0gdG9wICsgaGVpZ2h0O1xuXG4gIHRoaXMudG9wICAgID0gdG9wIDwgdGhpcy50b3AgICAgICAgPyB0b3AgICAgOiB0aGlzLnRvcDtcbiAgdGhpcy5sZWZ0ICAgPSBsZWZ0IDwgdGhpcy5sZWZ0ICAgICA/IGxlZnQgICA6IHRoaXMubGVmdDtcbiAgdGhpcy5ib3R0b20gPSBib3R0b20gPiB0aGlzLmJvdHRvbSA/IGJvdHRvbSA6IHRoaXMuYm90dG9tO1xuICB0aGlzLnJpZ2h0ICA9IHJpZ2h0ID4gdGhpcy5yaWdodCAgID8gcmlnaHQgIDogdGhpcy5yaWdodDtcblxuICB0aGlzLmlzRGlydHkgPSB0cnVlO1xufTtcblxuRGlydHlNYW5hZ2VyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMuaXNEaXJ0eSkgeyByZXR1cm47IH1cblxuICB0aGlzLmN0eC5jbGVhclJlY3QodGhpcy5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3AsXG4gICAgICAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0IC0gdGhpcy5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3R0b20gLSB0aGlzLnRvcCk7XG5cbiAgdGhpcy5sZWZ0ID0gdGhpcy5jYW52YXMud2lkdGg7XG4gIHRoaXMudG9wID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xuICB0aGlzLnJpZ2h0ID0gMDtcbiAgdGhpcy5ib3R0b20gPSAwO1xuXG4gIHRoaXMuaXNEaXJ0eSA9IGZhbHNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXJ0eU1hbmFnZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9wb3Rpb24tZGVidWdnZXIvZGlydHktbWFuYWdlci5qc1xuICoqIG1vZHVsZSBpZCA9IDExXG4gKiogbW9kdWxlIGNodW5rcyA9IDEyXG4gKiovIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3V0aWwvdXRpbC5qc1xuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDEyXG4gKiovIiwidmFyIGlzUmV0aW5hID0gZnVuY3Rpb24oKSB7XG4gIHZhciBtZWRpYVF1ZXJ5ID0gXCIoLXdlYmtpdC1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAxLjUpLFxcXG4gIChtaW4tLW1vei1kZXZpY2UtcGl4ZWwtcmF0aW86IDEuNSksXFxcbiAgKC1vLW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDMvMiksXFxcbiAgKG1pbi1yZXNvbHV0aW9uOiAxLjVkcHB4KVwiO1xuXG4gIGlmICh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA+IDEpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhICYmIHdpbmRvdy5tYXRjaE1lZGlhKG1lZGlhUXVlcnkpLm1hdGNoZXMpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc1JldGluYTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JldGluYS5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAnTU9VU0UxJzotMSxcbiAgJ01PVVNFMic6LTMsXG4gICdNV0hFRUxfVVAnOi00LFxuICAnTVdIRUVMX0RPV04nOi01LFxuICAnQkFDS1NQQUNFJzo4LFxuICAnVEFCJzo5LFxuICAnRU5URVInOjEzLFxuICAnUEFVU0UnOjE5LFxuICAnQ0FQUyc6MjAsXG4gICdFU0MnOjI3LFxuICAnU1BBQ0UnOjMyLFxuICAnUEFHRV9VUCc6MzMsXG4gICdQQUdFX0RPV04nOjM0LFxuICAnRU5EJzozNSxcbiAgJ0hPTUUnOjM2LFxuICAnTEVGVCc6MzcsXG4gICdVUCc6MzgsXG4gICdSSUdIVCc6MzksXG4gICdET1dOJzo0MCxcbiAgJ0lOU0VSVCc6NDUsXG4gICdERUxFVEUnOjQ2LFxuICAnXzAnOjQ4LFxuICAnXzEnOjQ5LFxuICAnXzInOjUwLFxuICAnXzMnOjUxLFxuICAnXzQnOjUyLFxuICAnXzUnOjUzLFxuICAnXzYnOjU0LFxuICAnXzcnOjU1LFxuICAnXzgnOjU2LFxuICAnXzknOjU3LFxuICAnQSc6NjUsXG4gICdCJzo2NixcbiAgJ0MnOjY3LFxuICAnRCc6NjgsXG4gICdFJzo2OSxcbiAgJ0YnOjcwLFxuICAnRyc6NzEsXG4gICdIJzo3MixcbiAgJ0knOjczLFxuICAnSic6NzQsXG4gICdLJzo3NSxcbiAgJ0wnOjc2LFxuICAnTSc6NzcsXG4gICdOJzo3OCxcbiAgJ08nOjc5LFxuICAnUCc6ODAsXG4gICdRJzo4MSxcbiAgJ1InOjgyLFxuICAnUyc6ODMsXG4gICdUJzo4NCxcbiAgJ1UnOjg1LFxuICAnVic6ODYsXG4gICdXJzo4NyxcbiAgJ1gnOjg4LFxuICAnWSc6ODksXG4gICdaJzo5MCxcbiAgJ05VTVBBRF8wJzo5NixcbiAgJ05VTVBBRF8xJzo5NyxcbiAgJ05VTVBBRF8yJzo5OCxcbiAgJ05VTVBBRF8zJzo5OSxcbiAgJ05VTVBBRF80JzoxMDAsXG4gICdOVU1QQURfNSc6MTAxLFxuICAnTlVNUEFEXzYnOjEwMixcbiAgJ05VTVBBRF83JzoxMDMsXG4gICdOVU1QQURfOCc6MTA0LFxuICAnTlVNUEFEXzknOjEwNSxcbiAgJ01VTFRJUExZJzoxMDYsXG4gICdBREQnOjEwNyxcbiAgJ1NVQlNUUkFDVCc6MTA5LFxuICAnREVDSU1BTCc6MTEwLFxuICAnRElWSURFJzoxMTEsXG4gICdGMSc6MTEyLFxuICAnRjInOjExMyxcbiAgJ0YzJzoxMTQsXG4gICdGNCc6MTE1LFxuICAnRjUnOjExNixcbiAgJ0Y2JzoxMTcsXG4gICdGNyc6MTE4LFxuICAnRjgnOjExOSxcbiAgJ0Y5JzoxMjAsXG4gICdGMTAnOjEyMSxcbiAgJ0YxMSc6MTIyLFxuICAnRjEyJzoxMjMsXG4gICdTSElGVCc6MTYsXG4gICdDVFJMJzoxNyxcbiAgJ0FMVCc6MTgsXG4gICdQTFVTJzoxODcsXG4gICdDT01NQSc6MTg4LFxuICAnTUlOVVMnOjE4OSxcbiAgJ1BFUklPRCc6MTkwXG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMva2V5cy5qc1xuICoqLyIsInZhciBnZXQgPSBleHBvcnRzLmdldCA9IGZ1bmN0aW9uKHVybCwgY2FsbGJhY2spIHtcbiAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgcmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuXG4gIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgY2FsbGJhY2sodGhpcy5yZXNwb25zZSk7XG4gIH07XG5cbiAgcmVxdWVzdC5zZW5kKCk7XG59O1xuXG52YXIgZ2V0SlNPTiA9IGV4cG9ydHMuZ2V0SlNPTiA9IGZ1bmN0aW9uKHVybCwgY2FsbGJhY2spIHtcbiAgZ2V0KHVybCwgZnVuY3Rpb24odGV4dCkge1xuICAgIGNhbGxiYWNrKEpTT04ucGFyc2UodGV4dCkpO1xuICB9KTtcbn07XG5cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gISEob2JqICYmIG9iai5jb25zdHJ1Y3RvciAmJiBvYmouY2FsbCAmJiBvYmouYXBwbHkpO1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3V0aWxzLmpzXG4gKiovIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCBhcnJheSB3aXRoIGRpcmVjdG9yeSBuYW1lcyB0aGVyZVxuLy8gbXVzdCBiZSBubyBzbGFzaGVzLCBlbXB0eSBlbGVtZW50cywgb3IgZGV2aWNlIG5hbWVzIChjOlxcKSBpbiB0aGUgYXJyYXlcbi8vIChzbyBhbHNvIG5vIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgLSBpdCBkb2VzIG5vdCBkaXN0aW5ndWlzaFxuLy8gcmVsYXRpdmUgYW5kIGFic29sdXRlIHBhdGhzKVxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkocGFydHMsIGFsbG93QWJvdmVSb290KSB7XG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBsYXN0ID0gcGFydHNbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuLy8gU3BsaXQgYSBmaWxlbmFtZSBpbnRvIFtyb290LCBkaXIsIGJhc2VuYW1lLCBleHRdLCB1bml4IHZlcnNpb25cbi8vICdyb290JyBpcyBqdXN0IGEgc2xhc2gsIG9yIG5vdGhpbmcuXG52YXIgc3BsaXRQYXRoUmUgPVxuICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xudmFyIHNwbGl0UGF0aCA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHJldHVybiBzcGxpdFBhdGhSZS5leGVjKGZpbGVuYW1lKS5zbGljZSgxKTtcbn07XG5cbi8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVzb2x2ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzb2x2ZWRQYXRoID0gJycsXG4gICAgICByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICB2YXIgcGF0aCA9IChpID49IDApID8gYXJndW1lbnRzW2ldIDogcHJvY2Vzcy5jd2QoKTtcblxuICAgIC8vIFNraXAgZW1wdHkgYW5kIGludmFsaWQgZW50cmllc1xuICAgIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLnJlc29sdmUgbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfSBlbHNlIGlmICghcGF0aCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcmVzb2x2ZWRQYXRoID0gcGF0aCArICcvJyArIHJlc29sdmVkUGF0aDtcbiAgICByZXNvbHZlZEFic29sdXRlID0gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbiAgfVxuXG4gIC8vIEF0IHRoaXMgcG9pbnQgdGhlIHBhdGggc2hvdWxkIGJlIHJlc29sdmVkIHRvIGEgZnVsbCBhYnNvbHV0ZSBwYXRoLCBidXRcbiAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzIHRvIGJlIHNhZmUgKG1pZ2h0IGhhcHBlbiB3aGVuIHByb2Nlc3MuY3dkKCkgZmFpbHMpXG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHJlc29sdmVkUGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihyZXNvbHZlZFBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhcmVzb2x2ZWRBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIHJldHVybiAoKHJlc29sdmVkQWJzb2x1dGUgPyAnLycgOiAnJykgKyByZXNvbHZlZFBhdGgpIHx8ICcuJztcbn07XG5cbi8vIHBhdGgubm9ybWFsaXplKHBhdGgpXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIGlzQWJzb2x1dGUgPSBleHBvcnRzLmlzQWJzb2x1dGUocGF0aCksXG4gICAgICB0cmFpbGluZ1NsYXNoID0gc3Vic3RyKHBhdGgsIC0xKSA9PT0gJy8nO1xuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICBwYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhaXNBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIGlmICghcGF0aCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgIHBhdGggPSAnLic7XG4gIH1cbiAgaWYgKHBhdGggJiYgdHJhaWxpbmdTbGFzaCkge1xuICAgIHBhdGggKz0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIChpc0Fic29sdXRlID8gJy8nIDogJycpICsgcGF0aDtcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguY2hhckF0KDApID09PSAnLyc7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmpvaW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIGV4cG9ydHMubm9ybWFsaXplKGZpbHRlcihwYXRocywgZnVuY3Rpb24ocCwgaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5qb2luIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH1cbiAgICByZXR1cm4gcDtcbiAgfSkuam9pbignLycpKTtcbn07XG5cblxuLy8gcGF0aC5yZWxhdGl2ZShmcm9tLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVsYXRpdmUgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICBmcm9tID0gZXhwb3J0cy5yZXNvbHZlKGZyb20pLnN1YnN0cigxKTtcbiAgdG8gPSBleHBvcnRzLnJlc29sdmUodG8pLnN1YnN0cigxKTtcblxuICBmdW5jdGlvbiB0cmltKGFycikge1xuICAgIHZhciBzdGFydCA9IDA7XG4gICAgZm9yICg7IHN0YXJ0IDwgYXJyLmxlbmd0aDsgc3RhcnQrKykge1xuICAgICAgaWYgKGFycltzdGFydF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICB2YXIgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgZm9yICg7IGVuZCA+PSAwOyBlbmQtLSkge1xuICAgICAgaWYgKGFycltlbmRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0ID4gZW5kKSByZXR1cm4gW107XG4gICAgcmV0dXJuIGFyci5zbGljZShzdGFydCwgZW5kIC0gc3RhcnQgKyAxKTtcbiAgfVxuXG4gIHZhciBmcm9tUGFydHMgPSB0cmltKGZyb20uc3BsaXQoJy8nKSk7XG4gIHZhciB0b1BhcnRzID0gdHJpbSh0by5zcGxpdCgnLycpKTtcblxuICB2YXIgbGVuZ3RoID0gTWF0aC5taW4oZnJvbVBhcnRzLmxlbmd0aCwgdG9QYXJ0cy5sZW5ndGgpO1xuICB2YXIgc2FtZVBhcnRzTGVuZ3RoID0gbGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGZyb21QYXJ0c1tpXSAhPT0gdG9QYXJ0c1tpXSkge1xuICAgICAgc2FtZVBhcnRzTGVuZ3RoID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvdXRwdXRQYXJ0cyA9IFtdO1xuICBmb3IgKHZhciBpID0gc2FtZVBhcnRzTGVuZ3RoOyBpIDwgZnJvbVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0cHV0UGFydHMucHVzaCgnLi4nKTtcbiAgfVxuXG4gIG91dHB1dFBhcnRzID0gb3V0cHV0UGFydHMuY29uY2F0KHRvUGFydHMuc2xpY2Uoc2FtZVBhcnRzTGVuZ3RoKSk7XG5cbiAgcmV0dXJuIG91dHB1dFBhcnRzLmpvaW4oJy8nKTtcbn07XG5cbmV4cG9ydHMuc2VwID0gJy8nO1xuZXhwb3J0cy5kZWxpbWl0ZXIgPSAnOic7XG5cbmV4cG9ydHMuZGlybmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIHJlc3VsdCA9IHNwbGl0UGF0aChwYXRoKSxcbiAgICAgIHJvb3QgPSByZXN1bHRbMF0sXG4gICAgICBkaXIgPSByZXN1bHRbMV07XG5cbiAgaWYgKCFyb290ICYmICFkaXIpIHtcbiAgICAvLyBObyBkaXJuYW1lIHdoYXRzb2V2ZXJcbiAgICByZXR1cm4gJy4nO1xuICB9XG5cbiAgaWYgKGRpcikge1xuICAgIC8vIEl0IGhhcyBhIGRpcm5hbWUsIHN0cmlwIHRyYWlsaW5nIHNsYXNoXG4gICAgZGlyID0gZGlyLnN1YnN0cigwLCBkaXIubGVuZ3RoIC0gMSk7XG4gIH1cblxuICByZXR1cm4gcm9vdCArIGRpcjtcbn07XG5cblxuZXhwb3J0cy5iYXNlbmFtZSA9IGZ1bmN0aW9uKHBhdGgsIGV4dCkge1xuICB2YXIgZiA9IHNwbGl0UGF0aChwYXRoKVsyXTtcbiAgLy8gVE9ETzogbWFrZSB0aGlzIGNvbXBhcmlzb24gY2FzZS1pbnNlbnNpdGl2ZSBvbiB3aW5kb3dzP1xuICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBmO1xufTtcblxuXG5leHBvcnRzLmV4dG5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBzcGxpdFBhdGgocGF0aClbM107XG59O1xuXG5mdW5jdGlvbiBmaWx0ZXIgKHhzLCBmKSB7XG4gICAgaWYgKHhzLmZpbHRlcikgcmV0dXJuIHhzLmZpbHRlcihmKTtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZih4c1tpXSwgaSwgeHMpKSByZXMucHVzaCh4c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbi8vIFN0cmluZy5wcm90b3R5cGUuc3Vic3RyIC0gbmVnYXRpdmUgaW5kZXggZG9uJ3Qgd29yayBpbiBJRThcbnZhciBzdWJzdHIgPSAnYWInLnN1YnN0cigtMSkgPT09ICdiJ1xuICAgID8gZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikgeyByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKSB9XG4gICAgOiBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gc3RyLmxlbmd0aCArIHN0YXJ0O1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9XG47XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMTZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTJcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vc3JjL2F1ZGlvLW1hbmFnZXInKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3BvdGlvbi1hdWRpby9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDE3XG4gKiogbW9kdWxlIGNodW5rcyA9IDEyXG4gKiovIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuICAgIHZhciBjdXJyZW50UXVldWU7XG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtpXSgpO1xuICAgICAgICB9XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbn1cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgcXVldWUucHVzaChmdW4pO1xuICAgIGlmICghZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9wcm9jZXNzL2Jyb3dzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxOFxuICoqIG1vZHVsZSBjaHVua3MgPSAxMlxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qc1xuICoqIG1vZHVsZSBpZCA9IDE5XG4gKiogbW9kdWxlIGNodW5rcyA9IDEyXG4gKiovIiwidmFyIExvYWRlZEF1ZGlvID0gcmVxdWlyZSgnLi9sb2FkZWQtYXVkaW8nKTtcblxudmFyIEF1ZGlvTWFuYWdlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuXG4gIHRoaXMuY3R4ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICB0aGlzLm1hc3RlckdhaW4gPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XG4gIHRoaXMuX3ZvbHVtZSA9IDE7XG5cbiAgdmFyIGlPUyA9IC8oaVBhZHxpUGhvbmV8aVBvZCkvZy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICBpZiAoaU9TKSB7XG4gICAgdGhpcy5fZW5hYmxlaU9TKCk7XG4gIH1cbn07XG5cbkF1ZGlvTWFuYWdlci5wcm90b3R5cGUuX2VuYWJsZWlPUyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIHRvdWNoID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJ1ZmZlciA9IHNlbGYuY3R4LmNyZWF0ZUJ1ZmZlcigxLCAxLCAyMjA1MCk7XG4gICAgdmFyIHNvdXJjZSA9IHNlbGYuY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgIHNvdXJjZS5idWZmZXIgPSBidWZmZXI7XG4gICAgc291cmNlLmNvbm5lY3Qoc2VsZi5jdHguZGVzdGluYXRpb24pO1xuICAgIHNvdXJjZS5zdGFydCgwKTtcblxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdG91Y2gsIGZhbHNlKTtcbiAgfTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRvdWNoLCBmYWxzZSk7XG59O1xuXG5BdWRpb01hbmFnZXIucHJvdG90eXBlLnNldFZvbHVtZSA9IGZ1bmN0aW9uKHZvbHVtZSkge1xuICB0aGlzLl92b2x1bWUgPSB2b2x1bWU7XG4gIHRoaXMubWFzdGVyR2Fpbi5nYWluLnZhbHVlID0gdm9sdW1lO1xufTtcblxuQXVkaW9NYW5hZ2VyLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24odXJsLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgcmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XG4gIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgc2VsZi5kZWNvZGVBdWRpb0RhdGEocmVxdWVzdC5yZXNwb25zZSwgZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBjYWxsYmFjayhzb3VyY2UpO1xuICAgIH0pO1xuICB9O1xuICByZXF1ZXN0LnNlbmQoKTtcbn07XG5cbkF1ZGlvTWFuYWdlci5wcm90b3R5cGUuZGVjb2RlQXVkaW9EYXRhID0gZnVuY3Rpb24oZGF0YSwgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHRoaXMuY3R4LmRlY29kZUF1ZGlvRGF0YShkYXRhLCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICB2YXIgYXVkaW8gPSBuZXcgTG9hZGVkQXVkaW8oc2VsZi5jdHgsIHJlc3VsdCwgc2VsZi5tYXN0ZXJHYWluKTtcblxuICAgIGNhbGxiYWNrKGF1ZGlvKTtcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF1ZGlvTWFuYWdlcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3BvdGlvbi1hdWRpby9zcmMvYXVkaW8tbWFuYWdlci5qc1xuICoqIG1vZHVsZSBpZCA9IDIwXG4gKiogbW9kdWxlIGNodW5rcyA9IDEyXG4gKiovIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC9+L2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyMVxuICoqIG1vZHVsZSBjaHVua3MgPSAxMlxuICoqLyIsInZhciBQbGF5aW5nQXVkaW8gPSByZXF1aXJlKCcuL3BsYXlpbmctYXVkaW8nKTtcblxudmFyIExvYWRlZEF1ZGlvID0gZnVuY3Rpb24oY3R4LCBidWZmZXIsIG1hc3RlckdhaW4pIHtcbiAgdGhpcy5fY3R4ID0gY3R4O1xuICB0aGlzLl9tYXN0ZXJHYWluID0gbWFzdGVyR2FpbjtcbiAgdGhpcy5fYnVmZmVyID0gYnVmZmVyO1xuICB0aGlzLl9idWZmZXIubG9vcCA9IGZhbHNlO1xufTtcblxuTG9hZGVkQXVkaW8ucHJvdG90eXBlLl9jcmVhdGVTb3VuZCA9IGZ1bmN0aW9uKGdhaW4pIHtcbiAgdmFyIHNvdXJjZSA9IHRoaXMuX2N0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbiAgc291cmNlLmJ1ZmZlciA9IHRoaXMuX2J1ZmZlcjtcblxuICB0aGlzLl9tYXN0ZXJHYWluLmNvbm5lY3QodGhpcy5fY3R4LmRlc3RpbmF0aW9uKTtcblxuICBnYWluLmNvbm5lY3QodGhpcy5fbWFzdGVyR2Fpbik7XG5cbiAgc291cmNlLmNvbm5lY3QoZ2Fpbik7XG5cbiAgcmV0dXJuIHNvdXJjZTtcbn07XG5cbkxvYWRlZEF1ZGlvLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBnYWluID0gdGhpcy5fY3R4LmNyZWF0ZUdhaW4oKTtcblxuICB2YXIgc291bmQgPSB0aGlzLl9jcmVhdGVTb3VuZChnYWluKTtcblxuICBzb3VuZC5zdGFydCgwKTtcblxuICByZXR1cm4gbmV3IFBsYXlpbmdBdWRpbyhzb3VuZCwgZ2Fpbik7XG59O1xuXG5Mb2FkZWRBdWRpby5wcm90b3R5cGUuZmFkZUluID0gZnVuY3Rpb24odmFsdWUsIHRpbWUpIHtcbiAgdmFyIGdhaW4gPSB0aGlzLl9jdHguY3JlYXRlR2FpbigpO1xuXG4gIHZhciBzb3VuZCA9IHRoaXMuX2NyZWF0ZVNvdW5kKGdhaW4pO1xuXG4gIGdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCAwKTtcbiAgZ2Fpbi5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAuMDEsIDApO1xuICBnYWluLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUodmFsdWUsIHRpbWUpO1xuXG4gIHNvdW5kLnN0YXJ0KDApO1xuXG4gIHJldHVybiBuZXcgUGxheWluZ0F1ZGlvKHNvdW5kLCBnYWluKTtcbn07XG5cbkxvYWRlZEF1ZGlvLnByb3RvdHlwZS5sb29wID0gZnVuY3Rpb24oKSB7XG4gIHZhciBnYWluID0gdGhpcy5fY3R4LmNyZWF0ZUdhaW4oKTtcblxuICB2YXIgc291bmQgPSB0aGlzLl9jcmVhdGVTb3VuZChnYWluKTtcblxuICBzb3VuZC5sb29wID0gdHJ1ZTtcbiAgc291bmQuc3RhcnQoMCk7XG5cbiAgcmV0dXJuIG5ldyBQbGF5aW5nQXVkaW8oc291bmQsIGdhaW4pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2FkZWRBdWRpbztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3BvdGlvbi1hdWRpby9zcmMvbG9hZGVkLWF1ZGlvLmpzXG4gKiogbW9kdWxlIGlkID0gMjJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTJcbiAqKi8iLCJ2YXIgUGxheWluZ0F1ZGlvID0gZnVuY3Rpb24oc291cmNlLCBnYWluKSB7XG4gIHRoaXMuX2dhaW4gPSBnYWluO1xuICB0aGlzLl9zb3VyY2UgPSBzb3VyY2U7XG59O1xuXG5QbGF5aW5nQXVkaW8ucHJvdG90eXBlLnNldFZvbHVtZSA9IGZ1bmN0aW9uKHZvbHVtZSkge1xuICB0aGlzLl9nYWluLmdhaW4udmFsdWUgPSB2b2x1bWU7XG59O1xuXG5QbGF5aW5nQXVkaW8ucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fc291cmNlLnN0b3AoMCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXlpbmdBdWRpbztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3BvdGlvbi1hdWRpby9zcmMvcGxheWluZy1hdWRpby5qc1xuICoqIG1vZHVsZSBpZCA9IDIzXG4gKiogbW9kdWxlIGNodW5rcyA9IDEyXG4gKiovIl0sInNvdXJjZVJvb3QiOiIiLCJmaWxlIjoic2hhcmVkLmpzIn0=