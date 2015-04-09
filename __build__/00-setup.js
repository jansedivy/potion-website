/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/__build__/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
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
	    app.video.ctx.fillText("Hello Potion", 10, 10);
	  }
	});

/***/ },
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
	
	var utils = __webpack_require__(14);
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
	
	var keys = __webpack_require__(15);
	
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
/* 15 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzhlMzljZGFjMTVmOGM2NzMzOTk/OWMxOSoqKioqKioqKioiLCJ3ZWJwYWNrOi8vLy4vZXhhbXBsZXMvMDAtc2V0dXAvYXBwLmpzIiwid2VicGFjazovLy8uL2luZGV4LmpzPzI2NDUqKioqKioqKioqIiwid2VicGFjazovLy8uL3NyYy9lbmdpbmUuanM/NjNhNioqKioqKioqKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JhZi1wb2x5ZmlsbC5qcz9iY2FkKioqKioqKioqKiIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZS5qcz9jN2VmKioqKioqKioqKiIsIndlYnBhY2s6Ly8vLi9zcmMvdGltZS5qcz9lMTIwKioqKioqKioqKiIsIndlYnBhY2s6Ly8vLi9zcmMvc3RhdGUtbWFuYWdlci5qcz9kYTNlKioqKioqKioqKiIsIndlYnBhY2s6Ly8vLi9+L3BvdGlvbi1kZWJ1Z2dlci9pbmRleC5qcz82NWRjKioqKioqKioqKiIsIndlYnBhY2s6Ly8vLi9zcmMvdmlkZW8uanM/ZDU0NSoqKioqKioqKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy5qcz80ODIyKioqKioqKioqKiIsIndlYnBhY2s6Ly8vLi9zcmMvaW5wdXQuanM/ZjA4ZioqKioqKioqKioiLCJ3ZWJwYWNrOi8vLy4vfi9wb3Rpb24tZGVidWdnZXIvZGlydHktbWFuYWdlci5qcz8wNzgzKioqKioqKioqKiIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi91dGlsL3V0aWwuanM/NzQ3ZSoqKioqKioqKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JldGluYS5qcz9iYjJkKioqKioqKioqKiIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMuanM/MmZmOCoqKioqKioqKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tleXMuanM/NzBlYSoqKioqKioqKioiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzPzg2ODAqKioqKioqKioqIiwid2VicGFjazovLy8uL34vcG90aW9uLWF1ZGlvL2luZGV4LmpzPzhmYWUqKioqKioqKioqIiwid2VicGFjazovLy8od2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3Byb2Nlc3MvYnJvd3Nlci5qcz82ZjBlKioqKioqKioqKiIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzPzIzOWQqKioqKioqKioqIiwid2VicGFjazovLy8uL34vcG90aW9uLWF1ZGlvL3NyYy9hdWRpby1tYW5hZ2VyLmpzP2UxMzgqKioqKioqKioqIiwid2VicGFjazovLy8od2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3V0aWwvfi9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzPzFjM2YqKioqKioqKioqIiwid2VicGFjazovLy8uL34vcG90aW9uLWF1ZGlvL3NyYy9sb2FkZWQtYXVkaW8uanM/MmNiOCoqKioqKioqKioiLCJ3ZWJwYWNrOi8vLy4vfi9wb3Rpb24tYXVkaW8vc3JjL3BsYXlpbmctYXVkaW8uanM/Zjk4MioqKioqKioqKioiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esd0M7Ozs7Ozs7OztBQ3RDQSxLQUFJLE1BQU0sR0FBRyxtQkFBTyxDQUFDLENBQVEsQ0FBQyxDQUFDOztBQUUvQixLQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDckQsU0FBTSxFQUFFLGtCQUFXO0FBQ2pC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RyxTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFdEIsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztBQUNsQyxTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFdkQsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLHFCQUFxQixDQUFDO0FBQzVDLFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7QUFDcEMsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQzs7QUFFdkMsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLG9CQUFvQixDQUFDO0FBQ2hELFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztBQUUxRCxTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQ3JDLFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRXRELFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO0FBQy9ELFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRWxELFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDN0IsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDM0IsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxLQUFLLEdBQUcsRUFBRSxFQUFFLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQztBQUM1RCxTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUMzQixTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7QUFFeEIsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxvQkFBb0IsQ0FBQztBQUM3RSxTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0FBRXJFLFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDN0IsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRTNCLFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDeEQsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3JDLFNBQUksQ0FBQyxLQUFLLENBQUMs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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZDQUE0QyxLQUFLOztBQUVqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0Esb0NBQW1DLE9BQU87QUFDMUM7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLDBEQUF5RDtBQUN6RDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWCxVQUFTO0FBQ1Q7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsU0FBUztBQUNwQjtBQUNBLFlBQVcsU0FBUztBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUN6a0JBLEtBQUksUUFBUSxHQUFHLG9CQUFXO0FBQ3hCLE9BQUksVUFBVSxHQUFHLDJJQUdTLENBQUM7O0FBRTNCLE9BQUksTUFBTSxDQUFDLGdCQUFnQixHQUFHLENBQUM7QUFDN0IsWUFBTyxJQUFJLENBQUM7SUFFZCxJQUFJLE1BQU0sQ0FBQyxVQUFVLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPO0FBQzVELFlBQU8sSUFBSSxDQUFDO0lBRWQsT0FBTyxLQUFLLENBQUM7RUFDZCxDQUFDOztBQUVGLE9BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDOzs7Ozs7OztBQ2Z6QixLQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxHQUFHLFVBQVMsR0FBRyxFQUFFLFFBQVEsRUFBRTtBQUM5QyxPQUFJLE9BQU8sR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO0FBQ25DLFVBQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFL0IsVUFBTyxDQUFDLE1BQU0sR0FBRyxZQUFXO0FBQzFCLGFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekIsQ0FBQzs7QUFFRixVQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7RUFDaEIsQ0FBQzs7QUFFRixLQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxHQUFHLFVBQVMsR0FBRyxFQUFFLFFBQVEsRUFBRTtBQUN0RCxNQUFHLENBQUMsR0FBRyxFQUFFLFVBQVMsSUFBSSxFQUFFO0FBQ3RCLGFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDNUIsQ0FBQyxDQUFDO0VBQ0osQ0FBQzs7QUFFRixRQUFPLENBQUMsVUFBVSxHQUFHLFVBQVMsR0FBRyxFQUFFO0FBQ2pDLFVBQU8sQ0FBQyxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsV0FBVyxJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQzVELEM7Ozs7Ozs7O0FDbkJELE9BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixXQUFTLENBQUMsQ0FBQztBQUNYLFdBQVMsQ0FBQyxDQUFDO0FBQ1gsY0FBWSxDQUFDLENBQUM7QUFDZCxnQkFBYyxDQUFDLENBQUM7QUFDaEIsY0FBWSxDQUFDO0FBQ2IsUUFBTSxDQUFDO0FBQ1AsVUFBUSxFQUFFO0FBQ1YsVUFBUSxFQUFFO0FBQ1YsU0FBTyxFQUFFO0FBQ1QsUUFBTSxFQUFFO0FBQ1IsVUFBUSxFQUFFO0FBQ1YsWUFBVSxFQUFFO0FBQ1osY0FBWSxFQUFFO0FBQ2QsUUFBTSxFQUFFO0FBQ1IsU0FBTyxFQUFFO0FBQ1QsU0FBTyxFQUFFO0FBQ1QsT0FBSyxFQUFFO0FBQ1AsVUFBUSxFQUFFO0FBQ1YsU0FBTyxFQUFFO0FBQ1QsV0FBUyxFQUFFO0FBQ1gsV0FBUyxFQUFFO0FBQ1gsT0FBSyxFQUFFO0FBQ1AsT0FBSyxFQUFFO0FBQ1AsT0FBSyxFQUFFO0FBQ1AsT0FBSyxFQUFFO0FBQ1AsT0FBSyxFQUFFO0FBQ1AsT0FBSyxFQUFFO0FBQ1AsT0FBSyxFQUFFO0FBQ1AsT0FBSyxFQUFFO0FBQ1AsT0FBSyxFQUFFO0FBQ1AsT0FBSyxFQUFFO0FBQ1AsTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sTUFBSSxFQUFFO0FBQ04sYUFBVyxFQUFFO0FBQ2IsYUFBVyxFQUFFO0FBQ2IsYUFBVyxFQUFFO0FBQ2IsYUFBVyxFQUFFO0FBQ2IsYUFBVyxHQUFHO0FBQ2QsYUFBVyxHQUFHO0FBQ2QsYUFBVyxHQUFHO0FBQ2QsYUFBVyxHQUFHO0FBQ2QsYUFBVyxHQUFHO0FBQ2QsYUFBVyxHQUFHO0FBQ2QsYUFBVyxHQUFHO0FBQ2QsUUFBTSxHQUFHO0FBQ1QsY0FBWSxHQUFHO0FBQ2YsWUFBVSxHQUFHO0FBQ2IsV0FBUyxHQUFHO0FBQ1osT0FBSyxHQUFHO0FBQ1IsT0FBSyxHQUFHO0FBQ1IsT0FBSyxHQUFHO0FBQ1IsT0FBSyxHQUFHO0FBQ1IsT0FBSyxHQUFHO0FBQ1IsT0FBSyxHQUFHO0FBQ1IsT0FBSyxHQUFHO0FBQ1IsT0FBSyxHQUFHO0FBQ1IsT0FBSyxHQUFHO0FBQ1IsUUFBTSxHQUFHO0FBQ1QsUUFBTSxHQUFHO0FBQ1QsUUFBTSxHQUFHO0FBQ1QsVUFBUSxFQUFFO0FBQ1YsU0FBTyxFQUFFO0FBQ1QsUUFBTSxFQUFFO0FBQ1IsU0FBTyxHQUFHO0FBQ1YsVUFBUSxHQUFHO0FBQ1gsVUFBUSxHQUFHO0FBQ1gsV0FBUyxHQUFHO0VBQ2IsQzs7Ozs7O0FDNUZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBZ0MsUUFBUTtBQUN4QztBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVSxNQUFNO0FBQ2hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDhCQUE2QixJQUFJO0FBQ2pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFDQUFvQyw4QkFBOEI7QUFDbEU7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFVLG9CQUFvQjtBQUM5QjtBQUNBOztBQUVBO0FBQ0EsV0FBVSxVQUFVO0FBQ3BCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFpQixZQUFZO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBK0Isc0JBQXNCO0FBQ3JEO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsZUFBZTtBQUNsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUNBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDL05BOzs7Ozs7O0FDQUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0QkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsNkJBQTRCLFVBQVU7Ozs7Ozs7QUN6RHRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFOzs7Ozs7QUNMQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsSUFBRztBQUNIOztBQUVBOzs7Ozs7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQSxFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDdEJBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7OztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL19fYnVpbGRfXy9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCAzOGUzOWNkYWMxNWY4YzY3MzM5OVxuICoqLyIsInZhciBQb3Rpb24gPSByZXF1aXJlKCdwb3Rpb24nKTtcblxudmFyIGFwcCA9IFBvdGlvbi5pbml0KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lJyksIHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICBhcHAudmlkZW8uY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgYXBwLnZpZGVvLmN0eC5mb250ID0gJzIwcHggc2Fucy1zZXJpZic7XG4gICAgYXBwLnZpZGVvLmN0eC50ZXh0QWxpZ24gPSAnbGVmdCc7XG4gICAgYXBwLnZpZGVvLmN0eC50ZXh0QmFzZWxpbmUgPSAndG9wJztcbiAgICBhcHAudmlkZW8uY3R4LmZpbGxUZXh0KFwiSGVsbG8gUG90aW9uXCIsIDEwLCAxMCk7XG4gIH1cbn0pO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9leGFtcGxlcy8wMC1zZXR1cC9hcHAuanNcbiAqKi8iLCJ2YXIgRW5naW5lID0gcmVxdWlyZSgnLi9zcmMvZW5naW5lJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpbml0OiBmdW5jdGlvbihjYW52YXMsIG1ldGhvZHMpIHtcbiAgICB2YXIgZW5naW5lID0gbmV3IEVuZ2luZShjYW52YXMsIG1ldGhvZHMpO1xuICAgIHJldHVybiBlbmdpbmUuZ2FtZTtcbiAgfVxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vaW5kZXguanNcbiAqKi8iLCJyZXF1aXJlKCcuL3JhZi1wb2x5ZmlsbCcpKCk7XG5cbnZhciBHYW1lID0gcmVxdWlyZSgnLi9nYW1lJyk7XG5cbnZhciBUaW1lID0gcmVxdWlyZSgnLi90aW1lJyk7XG5cbnZhciBEZWJ1Z2dlciA9IHJlcXVpcmUoJ3BvdGlvbi1kZWJ1Z2dlcicpO1xuXG52YXIgU3RhdGVNYW5hZ2VyID0gcmVxdWlyZSgnLi9zdGF0ZS1tYW5hZ2VyJyk7XG5cbi8qKlxuICogTWFpbiBFbmdpbmUgY2xhc3Mgd2hpY2ggY2FsbHMgdGhlIGdhbWUgbWV0aG9kc1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBFbmdpbmUgPSBmdW5jdGlvbihjb250YWluZXIsIG1ldGhvZHMpIHtcbiAgdmFyIEdhbWVDbGFzcyA9IHRoaXMuX3N1YmNsYXNzR2FtZShjb250YWluZXIsIG1ldGhvZHMpO1xuXG4gIGNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG5cbiAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICBjYW52YXMuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjYW52YXMpO1xuXG4gIHRoaXMuZ2FtZSA9IG5ldyBHYW1lQ2xhc3MoY2FudmFzKTtcbiAgdGhpcy5nYW1lLmRlYnVnID0gbmV3IERlYnVnZ2VyKHRoaXMuZ2FtZSk7XG5cbiAgdGhpcy5fc2V0RGVmYXVsdFN0YXRlcygpO1xuXG4gIHRoaXMudGlja0Z1bmMgPSAoZnVuY3Rpb24gKHNlbGYpIHsgcmV0dXJuIGZ1bmN0aW9uKCkgeyBzZWxmLnRpY2soKTsgfTsgfSkodGhpcyk7XG4gIHRoaXMucHJlbG9hZGVyVGlja0Z1bmMgPSAoZnVuY3Rpb24gKHNlbGYpIHsgcmV0dXJuIGZ1bmN0aW9uKCkgeyBzZWxmLl9wcmVsb2FkZXJUaWNrKCk7IH07IH0pKHRoaXMpO1xuXG4gIHRoaXMuc3RyYXlUaW1lID0gMDtcblxuICB0aGlzLl90aW1lID0gVGltZS5ub3coKTtcblxuICB0aGlzLmdhbWUuYXNzZXRzLm9ubG9hZChmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0YXJ0KCk7XG5cbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5wcmVsb2FkZXJJZCk7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2tGdW5jKTtcbiAgfS5iaW5kKHRoaXMpKTtcblxuICBpZiAodGhpcy5nYW1lLmFzc2V0cy5pc0xvYWRpbmcpIHtcbiAgICB0aGlzLnByZWxvYWRlcklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnByZWxvYWRlclRpY2tGdW5jKTtcbiAgfVxufTtcblxuLyoqXG4gKiBBZGQgZXZlbnQgbGlzdGVuZXIgZm9yIHdpbmRvdyBldmVudHNcbiAqIEBwcml2YXRlXG4gKi9cbkVuZ2luZS5wcm90b3R5cGUuYWRkRXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgZ2FtZSA9IHNlbGYuZ2FtZTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbigpIHtcbiAgICBzZWxmLmdhbWUuaW5wdXQucmVzZXRLZXlzKCk7XG4gICAgc2VsZi5nYW1lLmJsdXIoKTtcbiAgfSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZnVuY3Rpb24oKSB7XG4gICAgc2VsZi5nYW1lLmlucHV0LnJlc2V0S2V5cygpO1xuICAgIHNlbGYuZ2FtZS5mb2N1cygpO1xuICB9KTtcbn07XG5cbi8qKlxuICogU3RhcnRzIHRoZSBnYW1lLCBhZGRzIGV2ZW50cyBhbmQgcnVuIGZpcnN0IGZyYW1lXG4gKiBAcHJpdmF0ZVxuICovXG5FbmdpbmUucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmdhbWUuY29uZmlnLmFkZElucHV0RXZlbnRzKSB7XG4gICAgdGhpcy5hZGRFdmVudHMoKTtcbiAgfVxufTtcblxuLyoqXG4gKiBNYWluIHRpY2sgZnVuY3Rpb24gaW4gZ2FtZSBsb29wXG4gKiBAcHJpdmF0ZVxuICovXG5FbmdpbmUucHJvdG90eXBlLnRpY2sgPSBmdW5jdGlvbigpIHtcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2tGdW5jKTtcblxuICB2YXIgbm93ID0gVGltZS5ub3coKTtcbiAgdmFyIHRpbWUgPSAobm93IC0gdGhpcy5fdGltZSkgLyAxMDAwO1xuICB0aGlzLl90aW1lID0gbm93O1xuXG4gIHRoaXMudXBkYXRlKHRpbWUpO1xuICB0aGlzLmdhbWUuc3RhdGVzLmV4aXRVcGRhdGUodGltZSk7XG4gIHRoaXMucmVuZGVyKCk7XG59O1xuXG4vKipcbiAqIFVwZGF0ZXMgdGhlIGdhbWVcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lIC0gdGltZSBpbiBzZWNvbmRzIHNpbmNlIGxhc3QgZnJhbWVcbiAqIEBwcml2YXRlXG4gKi9cbkVuZ2luZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICBpZiAodGltZSA+IHRoaXMuZ2FtZS5jb25maWcubWF4U3RlcFRpbWUpIHsgdGltZSA9IHRoaXMuZ2FtZS5jb25maWcubWF4U3RlcFRpbWU7IH1cblxuICBpZiAodGhpcy5nYW1lLmNvbmZpZy5maXhlZFN0ZXApIHtcbiAgICB0aGlzLnN0cmF5VGltZSA9IHRoaXMuc3RyYXlUaW1lICsgdGltZTtcbiAgICB3aGlsZSAodGhpcy5zdHJheVRpbWUgPj0gdGhpcy5nYW1lLmNvbmZpZy5zdGVwVGltZSkge1xuICAgICAgdGhpcy5zdHJheVRpbWUgPSB0aGlzLnN0cmF5VGltZSAtIHRoaXMuZ2FtZS5jb25maWcuc3RlcFRpbWU7XG4gICAgICB0aGlzLmdhbWUuc3RhdGVzLnVwZGF0ZSh0aGlzLmdhbWUuY29uZmlnLnN0ZXBUaW1lKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5nYW1lLnN0YXRlcy51cGRhdGUodGltZSk7XG4gIH1cbn07XG5cbi8qKlxuICogUmVuZGVycyB0aGUgZ2FtZVxuICogQHByaXZhdGVcbiAqL1xuRW5naW5lLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5nYW1lLnZpZGVvLmJlZ2luRnJhbWUoKTtcblxuICB0aGlzLmdhbWUudmlkZW8uY2xlYXIoKTtcblxuICB0aGlzLmdhbWUuc3RhdGVzLnJlbmRlcigpO1xuXG4gIHRoaXMuZ2FtZS52aWRlby5lbmRGcmFtZSgpO1xufTtcblxuLyoqXG4gKiBNYWluIHRpY2sgZnVuY3Rpb24gaW4gcHJlbG9hZGVyIGxvb3BcbiAqIEBwcml2YXRlXG4gKi9cbkVuZ2luZS5wcm90b3R5cGUuX3ByZWxvYWRlclRpY2sgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5wcmVsb2FkZXJJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5wcmVsb2FkZXJUaWNrRnVuYyk7XG5cbiAgdmFyIG5vdyA9IFRpbWUubm93KCk7XG4gIHZhciB0aW1lID0gKG5vdyAtIHRoaXMuX3RpbWUpIC8gMTAwMDtcbiAgdGhpcy5fdGltZSA9IG5vdztcblxuICBpZiAodGhpcy5nYW1lLmNvbmZpZy5zaG93UHJlbG9hZGVyKSB7XG4gICAgdGhpcy5nYW1lLnZpZGVvLmNsZWFyKCk7XG4gICAgdGhpcy5nYW1lLnByZWxvYWRpbmcodGltZSk7XG4gIH1cbn07XG5cbkVuZ2luZS5wcm90b3R5cGUuX3NldERlZmF1bHRTdGF0ZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHN0YXRlcyA9IG5ldyBTdGF0ZU1hbmFnZXIoKTtcbiAgc3RhdGVzLmFkZCgnYXBwJywgdGhpcy5nYW1lKTtcbiAgc3RhdGVzLmFkZCgnZGVidWcnLCB0aGlzLmdhbWUuZGVidWcpO1xuXG4gIHN0YXRlcy5wcm90ZWN0KCdhcHAnKTtcbiAgc3RhdGVzLnByb3RlY3QoJ2RlYnVnJyk7XG5cbiAgdGhpcy5nYW1lLnN0YXRlcyA9IHN0YXRlcztcbn07XG5cbkVuZ2luZS5wcm90b3R5cGUuX3N1YmNsYXNzR2FtZSA9IGZ1bmN0aW9uKGNvbnRhaW5lciwgbWV0aG9kcykge1xuICB2YXIgR2FtZUNsYXNzID0gZnVuY3Rpb24oY29udGFpbmVyKSB7XG4gICAgR2FtZS5jYWxsKHRoaXMsIGNvbnRhaW5lcik7XG4gIH07XG5cbiAgR2FtZUNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR2FtZS5wcm90b3R5cGUpO1xuXG4gIGZvciAodmFyIG1ldGhvZCBpbiBtZXRob2RzKSB7XG4gICAgR2FtZUNsYXNzLnByb3RvdHlwZVttZXRob2RdID0gbWV0aG9kc1ttZXRob2RdO1xuICB9XG5cbiAgcmV0dXJuIEdhbWVDbGFzcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRW5naW5lO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW5naW5lLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGxhc3RUaW1lID0gMDtcbiAgdmFyIHZlbmRvcnMgPSBbJ21zJywgJ21veicsICd3ZWJraXQnLCAnbyddO1xuXG4gIGZvciAodmFyIGk9MDsgaTx2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKytpKSB7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW2ldKydSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1tpXSsnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSB8fCB3aW5kb3dbdmVuZG9yc1tpXSsnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gIH1cblxuICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XG5cbiAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBjYWxsYmFjayhjdXJyVGltZSArIHRpbWVUb0NhbGwpO1xuICAgICAgfSwgdGltZVRvQ2FsbCk7XG5cbiAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgcmV0dXJuIGlkO1xuICAgIH07XG4gIH1cblxuICBpZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSkge1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGlkKSB7IGNsZWFyVGltZW91dChpZCk7IH07XG4gIH1cbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yYWYtcG9seWZpbGwuanNcbiAqKi8iLCJ2YXIgVmlkZW8gPSByZXF1aXJlKCcuL3ZpZGVvJyk7XG52YXIgQXNzZXRzID0gcmVxdWlyZSgnLi9hc3NldHMnKTtcbnZhciBJbnB1dCA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcblxudmFyIEdhbWUgPSBmdW5jdGlvbihjYW52YXMpIHtcbiAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG5cbiAgdGhpcy53aWR0aCA9IDMwMDtcblxuICB0aGlzLmhlaWdodCA9IDMwMDtcblxuICB0aGlzLmFzc2V0cyA9IG5ldyBBc3NldHMoKTtcblxuICB0aGlzLnN0YXRlcyA9IG51bGw7XG4gIHRoaXMuZGVidWcgPSBudWxsO1xuICB0aGlzLmlucHV0ID0gbnVsbDtcbiAgdGhpcy52aWRlbyA9IG51bGw7XG5cbiAgdGhpcy5jb25maWcgPSB7XG4gICAgdXNlUmV0aW5hOiB0cnVlLFxuICAgIGluaXRpYWxpemVDYW52YXM6IHRydWUsXG4gICAgaW5pdGlhbGl6ZVZpZGVvOiB0cnVlLFxuICAgIGFkZElucHV0RXZlbnRzOiB0cnVlLFxuICAgIHNob3dQcmVsb2FkZXI6IHRydWUsXG4gICAgZml4ZWRTdGVwOiBmYWxzZSxcbiAgICBzdGVwVGltZTogMC4wMTY2NixcbiAgICBtYXhTdGVwVGltZTogMC4wMTY2NlxuICB9O1xuXG4gIHRoaXMuY29uZmlndXJlKCk7XG5cbiAgaWYgKHRoaXMuY29uZmlnLmluaXRpYWxpemVWaWRlbykge1xuICAgIHRoaXMudmlkZW8gPSBuZXcgVmlkZW8odGhpcywgY2FudmFzLCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBpZiAodGhpcy5jb25maWcuYWRkSW5wdXRFdmVudHMpIHtcbiAgICB0aGlzLmlucHV0ID0gbmV3IElucHV0KHRoaXMsIGNhbnZhcy5wYXJlbnRFbGVtZW50KTtcbiAgfVxufTtcblxuR2FtZS5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcbiAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICB0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuICBpZiAodGhpcy52aWRlbykge1xuICAgIHRoaXMudmlkZW8uc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgfVxufTtcblxuR2FtZS5wcm90b3R5cGUucHJlbG9hZGluZyA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgaWYgKCF0aGlzLmNvbmZpZy5zaG93UHJlbG9hZGVyICYmICEodGhpcy52aWRlbyAmJiB0aGlzLnZpZGVvLmN0eCkpIHsgcmV0dXJuOyB9XG5cbiAgaWYgKHRoaXMudmlkZW8uY3R4KSB7XG4gICAgdmFyIGNvbG9yMSA9ICcjYjlmZjcxJztcbiAgICB2YXIgY29sb3IyID0gJyM4YWMyNTAnO1xuICAgIHZhciBjb2xvcjMgPSAnIzY0OGUzOCc7XG5cbiAgICBpZiAodGhpcy5fcHJlbG9hZGVyV2lkdGggPT09IHVuZGVmaW5lZCkgeyB0aGlzLl9wcmVsb2FkZXJXaWR0aCA9IDA7IH1cblxuICAgIHZhciB3aWR0aCA9IE1hdGgubWluKHRoaXMud2lkdGggKiAyLzMsIDMwMCk7XG4gICAgdmFyIGhlaWdodCA9IDIwO1xuXG4gICAgdmFyIHkgPSAodGhpcy5oZWlnaHQgLSBoZWlnaHQpIC8gMjtcbiAgICB2YXIgeCA9ICh0aGlzLndpZHRoIC0gd2lkdGgpIC8gMjtcblxuICAgIHZhciBjdXJyZW50V2lkdGggPSB3aWR0aCAqIHRoaXMuYXNzZXRzLnByb2dyZXNzO1xuICAgIHRoaXMuX3ByZWxvYWRlcldpZHRoID0gdGhpcy5fcHJlbG9hZGVyV2lkdGggKyAoY3VycmVudFdpZHRoIC0gdGhpcy5fcHJlbG9hZGVyV2lkdGgpICogdGltZSAqIDEwO1xuXG4gICAgdGhpcy52aWRlby5jdHguc2F2ZSgpO1xuXG4gICAgdGhpcy52aWRlby5jdHguZmlsbFN0eWxlID0gY29sb3IyO1xuICAgIHRoaXMudmlkZW8uY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblxuICAgIHRoaXMudmlkZW8uY3R4LmZvbnQgPSAnNDAwIDQwcHggc2Fucy1zZXJpZic7XG4gICAgdGhpcy52aWRlby5jdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgdGhpcy52aWRlby5jdHgudGV4dEJhc2VsaW5lID0gJ2JvdHRvbSc7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5maWxsU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjEpJztcbiAgICB0aGlzLnZpZGVvLmN0eC5maWxsVGV4dChcIlBvdGlvbi5qc1wiLCB0aGlzLndpZHRoLzIsIHkgKyAyKTtcblxuICAgIHRoaXMudmlkZW8uY3R4LmZpbGxTdHlsZSA9ICcjZDFmZmExJztcbiAgICB0aGlzLnZpZGVvLmN0eC5maWxsVGV4dChcIlBvdGlvbi5qc1wiLCB0aGlzLndpZHRoLzIsIHkpO1xuXG4gICAgdGhpcy52aWRlby5jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLnZpZGVvLmN0eC5maWxsU3R5bGUgPSBjb2xvcjM7XG4gICAgdGhpcy52aWRlby5jdHguZmlsbFJlY3QoeCwgeSArIDE1LCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIHRoaXMudmlkZW8uY3R4LmxpbmVXaWR0aCA9IDI7XG4gICAgdGhpcy52aWRlby5jdHguYmVnaW5QYXRoKCk7XG4gICAgdGhpcy52aWRlby5jdHgucmVjdCh4IC0gNSwgeSArIDEwLCB3aWR0aCArIDEwLCBoZWlnaHQgKyAxMCk7XG4gICAgdGhpcy52aWRlby5jdHguY2xvc2VQYXRoKCk7XG4gICAgdGhpcy52aWRlby5jdHguc3Ryb2tlKCk7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5zdHJva2VTdHlsZSA9IHRoaXMudmlkZW8uY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDAsIDAsIDAsIDAuMSknO1xuICAgIHRoaXMudmlkZW8uY3R4LmZpbGxSZWN0KHgsIHkgKyAxNSwgdGhpcy5fcHJlbG9hZGVyV2lkdGgsIGhlaWdodCArIDIpO1xuXG4gICAgdGhpcy52aWRlby5jdHgubGluZVdpZHRoID0gMjtcbiAgICB0aGlzLnZpZGVvLmN0eC5iZWdpblBhdGgoKTtcblxuICAgIHRoaXMudmlkZW8uY3R4Lm1vdmVUbyh4ICsgdGhpcy5fcHJlbG9hZGVyV2lkdGgsIHkgKyAxMik7XG4gICAgdGhpcy52aWRlby5jdHgubGluZVRvKHggLSA1LCB5ICsgMTIpO1xuICAgIHRoaXMudmlkZW8uY3R4LmxpbmVUbyh4IC0gNSwgeSArIDEwICsgaGVpZ2h0ICsgMTIpO1xuICAgIHRoaXMudmlkZW8uY3R4LmxpbmVUbyh4ICsgdGhpcy5fcHJlbG9hZGVyV2lkdGgsIHkgKyAxMCArIGhlaWdodCArIDEyKTtcblxuICAgIHRoaXMudmlkZW8uY3R4LnN0cm9rZSgpO1xuICAgIHRoaXMudmlkZW8uY3R4LmNsb3NlUGF0aCgpO1xuXG4gICAgdGhpcy52aWRlby5jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLnZpZGVvLmN0eC5maWxsU3R5bGUgPSBjb2xvcjE7XG4gICAgdGhpcy52aWRlby5jdHguZmlsbFJlY3QoeCwgeSArIDE1LCB0aGlzLl9wcmVsb2FkZXJXaWR0aCwgaGVpZ2h0KTtcblxuICAgIHRoaXMudmlkZW8uY3R4LmxpbmVXaWR0aCA9IDI7XG4gICAgdGhpcy52aWRlby5jdHguYmVnaW5QYXRoKCk7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5tb3ZlVG8oeCArIHRoaXMuX3ByZWxvYWRlcldpZHRoLCB5ICsgMTApO1xuICAgIHRoaXMudmlkZW8uY3R4LmxpbmVUbyh4IC0gNSwgeSArIDEwKTtcbiAgICB0aGlzLnZpZGVvLmN0eC5saW5lVG8oeCAtIDUsIHkgKyAxMCArIGhlaWdodCArIDEwKTtcbiAgICB0aGlzLnZpZGVvLmN0eC5saW5lVG8oeCArIHRoaXMuX3ByZWxvYWRlcldpZHRoLCB5ICsgMTAgKyBoZWlnaHQgKyAxMCk7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5zdHJva2UoKTtcbiAgICB0aGlzLnZpZGVvLmN0eC5jbG9zZVBhdGgoKTtcblxuICAgIHRoaXMudmlkZW8uY3R4LnJlc3RvcmUoKTtcbiAgfVxufTtcblxuR2FtZS5wcm90b3R5cGUuY29uZmlndXJlID0gZnVuY3Rpb24oKSB7fTtcblxuR2FtZS5wcm90b3R5cGUuZm9jdXMgPSBmdW5jdGlvbigpIHt9O1xuXG5HYW1lLnByb3RvdHlwZS5ibHVyID0gZnVuY3Rpb24oKSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZ2FtZS5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlIHx8IERhdGU7XG59KSgpO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvdGltZS5qc1xuICoqLyIsInZhciByZW5kZXJPcmRlclNvcnQgPSBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBhLnJlbmRlck9yZGVyIDwgYi5yZW5kZXJPcmRlcjtcbn07XG5cbnZhciB1cGRhdGVPcmRlclNvcnQgPSBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBhLnVwZGF0ZU9yZGVyIDwgYi51cGRhdGVPcmRlcjtcbn07XG5cbnZhciBTdGF0ZU1hbmFnZXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zdGF0ZXMgPSB7fTtcbiAgdGhpcy5yZW5kZXJPcmRlciA9IFtdO1xuICB0aGlzLnVwZGF0ZU9yZGVyID0gW107XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKG5hbWUsIHN0YXRlKSB7XG4gIHRoaXMuc3RhdGVzW25hbWVdID0gdGhpcy5fbmV3U3RhdGVIb2xkZXIobmFtZSwgc3RhdGUpO1xuICB0aGlzLnJlZnJlc2hPcmRlcigpO1xuICByZXR1cm4gc3RhdGU7XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaWYgKCFob2xkZXIuZW5hYmxlZCkge1xuICAgICAgaWYgKGhvbGRlci5zdGF0ZS5lbmFibGUpIHtcbiAgICAgICAgaG9sZGVyLnN0YXRlLmVuYWJsZSgpO1xuICAgICAgfVxuICAgICAgaG9sZGVyLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgaG9sZGVyLmNoYW5nZWQgPSB0cnVlO1xuXG4gICAgICBpZiAoaG9sZGVyLnBhdXNlZCkge1xuICAgICAgICB0aGlzLnVucGF1c2UobmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmRpc2FibGUgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGlmIChob2xkZXIuZW5hYmxlZCkge1xuICAgICAgaWYgKGhvbGRlci5zdGF0ZS5kaXNhYmxlKSB7XG4gICAgICAgIGhvbGRlci5zdGF0ZS5kaXNhYmxlKCk7XG4gICAgICB9XG4gICAgICBob2xkZXIuY2hhbmdlZCA9IHRydWU7XG4gICAgICBob2xkZXIuZW5hYmxlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBpZiAoaG9sZGVyLmVuYWJsZWQpIHtcbiAgICAgIGhvbGRlci5jaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIGhvbGRlci5yZW5kZXIgPSBmYWxzZTtcbiAgICB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaWYgKGhvbGRlci5lbmFibGVkKSB7XG4gICAgICBob2xkZXIuY2hhbmdlZCA9IHRydWU7XG4gICAgICBob2xkZXIucmVuZGVyID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGlmIChob2xkZXIuc3RhdGUucGF1c2UpIHtcbiAgICAgIGhvbGRlci5zdGF0ZS5wYXVzZSgpO1xuICAgIH1cblxuICAgIGhvbGRlci5jaGFuZ2VkID0gdHJ1ZTtcbiAgICBob2xkZXIucGF1c2VkID0gdHJ1ZTtcbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS51bnBhdXNlID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBpZiAoaG9sZGVyLnN0YXRlLnVucGF1c2UpIHtcbiAgICAgIGhvbGRlci5zdGF0ZS51bnBhdXNlKCk7XG4gICAgfVxuXG4gICAgaG9sZGVyLmNoYW5nZWQgPSB0cnVlO1xuICAgIGhvbGRlci5wYXVzZWQgPSBmYWxzZTtcbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5wcm90ZWN0ID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBob2xkZXIucHJvdGVjdCA9IHRydWU7XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUudW5wcm90ZWN0ID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBob2xkZXIucHJvdGVjdCA9IGZhbHNlO1xuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnJlZnJlc2hPcmRlciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnJlbmRlck9yZGVyLmxlbmd0aCA9IDA7XG4gIHRoaXMudXBkYXRlT3JkZXIubGVuZ3RoID0gMDtcblxuICBmb3IgKHZhciBuYW1lIGluIHRoaXMuc3RhdGVzKSB7XG4gICAgdmFyIGhvbGRlciA9IHRoaXMuc3RhdGVzW25hbWVdO1xuICAgIGlmIChob2xkZXIpIHtcbiAgICAgIHRoaXMucmVuZGVyT3JkZXIucHVzaChob2xkZXIpO1xuICAgICAgdGhpcy51cGRhdGVPcmRlci5wdXNoKGhvbGRlcik7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5yZW5kZXJPcmRlci5zb3J0KHJlbmRlck9yZGVyU29ydCk7XG4gIHRoaXMudXBkYXRlT3JkZXIuc29ydCh1cGRhdGVPcmRlclNvcnQpO1xufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5fbmV3U3RhdGVIb2xkZXIgPSBmdW5jdGlvbihuYW1lLCBzdGF0ZSkge1xuICB2YXIgaG9sZGVyID0ge307XG4gIGhvbGRlci5uYW1lID0gbmFtZTtcbiAgaG9sZGVyLnN0YXRlID0gc3RhdGU7XG5cbiAgaG9sZGVyLnByb3RlY3QgPSBmYWxzZTtcblxuICBob2xkZXIuZW5hYmxlZCA9IHRydWU7XG4gIGhvbGRlci5wYXVzZWQgPSBmYWxzZTtcblxuICBob2xkZXIucmVuZGVyID0gdHJ1ZTtcblxuICBob2xkZXIuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgaG9sZGVyLnVwZGF0ZWQgPSBmYWxzZTtcbiAgaG9sZGVyLmNoYW5nZWQgPSB0cnVlO1xuXG4gIGhvbGRlci51cGRhdGVPcmRlciA9IDA7XG4gIGhvbGRlci5yZW5kZXJPcmRlciA9IDA7XG5cbiAgcmV0dXJuIGhvbGRlcjtcbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuc2V0VXBkYXRlT3JkZXIgPSBmdW5jdGlvbihuYW1lLCBvcmRlcikge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBob2xkZXIudXBkYXRlT3JkZXIgPSBvcmRlcjtcbiAgICB0aGlzLnJlZnJlc2hPcmRlcigpO1xuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnNldFJlbmRlck9yZGVyID0gZnVuY3Rpb24obmFtZSwgb3JkZXIpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaG9sZGVyLnJlbmRlck9yZGVyID0gb3JkZXI7XG4gICAgdGhpcy5yZWZyZXNoT3JkZXIoKTtcbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgc3RhdGUgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKHN0YXRlICYmICFzdGF0ZS5wcm90ZWN0KSB7XG4gICAgaWYgKHN0YXRlLnN0YXRlLmNsb3NlKSB7XG4gICAgICBzdGF0ZS5zdGF0ZS5jbG9zZSgpO1xuICAgIH1cbiAgICBkZWxldGUgdGhpcy5zdGF0ZXNbbmFtZV07XG4gICAgdGhpcy5yZWZyZXNoT3JkZXIoKTtcbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5kZXN0cm95QWxsID0gZnVuY3Rpb24oKSB7XG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcbiAgICBpZiAoIXN0YXRlLnByb3RlY3QpIHtcbiAgICAgIGlmIChzdGF0ZS5zdGF0ZS5jbG9zZSkge1xuICAgICAgICBzdGF0ZS5zdGF0ZS5jbG9zZSgpO1xuICAgICAgfVxuICAgICAgZGVsZXRlIHRoaXMuc3RhdGVzW3N0YXRlLm5hbWVdO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMucmVmcmVzaE9yZGVyKCk7XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgcmV0dXJuIHRoaXMuc3RhdGVzW25hbWVdO1xufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbih0aW1lKSB7XG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcblxuICAgIGlmIChzdGF0ZSkge1xuICAgICAgc3RhdGUuY2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoc3RhdGUuZW5hYmxlZCkge1xuICAgICAgICBpZiAoIXN0YXRlLmluaXRpYWxpemVkICYmIHN0YXRlLnN0YXRlLmluaXQpIHtcbiAgICAgICAgICBzdGF0ZS5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgICAgc3RhdGUuc3RhdGUuaW5pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YXRlLnN0YXRlLnVwZGF0ZSAmJiAhc3RhdGUucGF1c2VkKSB7XG4gICAgICAgICAgc3RhdGUuc3RhdGUudXBkYXRlKHRpbWUpO1xuICAgICAgICAgIHN0YXRlLnVwZGF0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmV4aXRVcGRhdGUgPSBmdW5jdGlvbih0aW1lKSB7XG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcblxuICAgIGlmIChzdGF0ZS5lbmFibGVkICYmIHN0YXRlLnN0YXRlLmV4aXRVcGRhdGUgJiYgIXN0YXRlLnBhdXNlZCkge1xuICAgICAgc3RhdGUuc3RhdGUuZXhpdFVwZGF0ZSh0aW1lKTtcbiAgICB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMucmVuZGVyT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5yZW5kZXJPcmRlcltpXTtcbiAgICBpZiAoc3RhdGUuZW5hYmxlZCAmJiAoc3RhdGUudXBkYXRlZCB8fCAhc3RhdGUuc3RhdGUudXBkYXRlKSAmJiBzdGF0ZS5yZW5kZXIgJiYgc3RhdGUuc3RhdGUucmVuZGVyKSB7XG4gICAgICBzdGF0ZS5zdGF0ZS5yZW5kZXIoKTtcbiAgICB9XG4gIH1cbn07XG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLm1vdXNlbW92ZSA9IGZ1bmN0aW9uKHgsIHksIGUpIHtcbiAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy51cGRhdGVPcmRlci5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnVwZGF0ZU9yZGVyW2ldO1xuICAgIGlmIChzdGF0ZS5lbmFibGVkICYmICFzdGF0ZS5jaGFuZ2VkICYmIHN0YXRlLnN0YXRlLm1vdXNlbW92ZSAmJiAhc3RhdGUucGF1c2VkKSB7XG4gICAgICBzdGF0ZS5zdGF0ZS5tb3VzZW1vdmUoeCwgeSwgZSk7XG4gICAgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLm1vdXNldXAgPSBmdW5jdGlvbih4LCB5LCBidXR0b24pIHtcbiAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy51cGRhdGVPcmRlci5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnVwZGF0ZU9yZGVyW2ldO1xuICAgIGlmIChzdGF0ZS5lbmFibGVkICYmICFzdGF0ZS5jaGFuZ2VkICYmIHN0YXRlLnN0YXRlLm1vdXNldXAgJiYgIXN0YXRlLnBhdXNlZCkge1xuICAgICAgc3RhdGUuc3RhdGUubW91c2V1cCh4LCB5LCBidXR0b24pO1xuICAgIH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5tb3VzZWRvd24gPSBmdW5jdGlvbih4LCB5LCBidXR0b24pIHtcbiAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy51cGRhdGVPcmRlci5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnVwZGF0ZU9yZGVyW2ldO1xuICAgIGlmIChzdGF0ZS5lbmFibGVkICYmICFzdGF0ZS5jaGFuZ2VkICYmIHN0YXRlLnN0YXRlLm1vdXNlZG93biAmJiAhc3RhdGUucGF1c2VkKSB7XG4gICAgICBzdGF0ZS5zdGF0ZS5tb3VzZWRvd24oeCwgeSwgYnV0dG9uKTtcbiAgICB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUua2V5dXAgPSBmdW5jdGlvbihrZXksIGUpIHtcbiAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy51cGRhdGVPcmRlci5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnVwZGF0ZU9yZGVyW2ldO1xuICAgIGlmIChzdGF0ZS5lbmFibGVkICYmICFzdGF0ZS5jaGFuZ2VkICYmIHN0YXRlLnN0YXRlLmtleXVwICYmICFzdGF0ZS5wYXVzZWQpIHtcbiAgICAgIHN0YXRlLnN0YXRlLmtleXVwKGtleSwgZSk7XG4gICAgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmtleWRvd24gPSBmdW5jdGlvbihrZXksIGUpIHtcbiAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy51cGRhdGVPcmRlci5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnVwZGF0ZU9yZGVyW2ldO1xuICAgIGlmIChzdGF0ZS5lbmFibGVkICYmICFzdGF0ZS5jaGFuZ2VkICYmIHN0YXRlLnN0YXRlLmtleWRvd24gJiYgIXN0YXRlLnBhdXNlZCkge1xuICAgICAgc3RhdGUuc3RhdGUua2V5ZG93bihrZXksIGUpO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0ZU1hbmFnZXI7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9zdGF0ZS1tYW5hZ2VyLmpzXG4gKiovIiwidmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG52YXIgRGlydHlNYW5hZ2VyID0gcmVxdWlyZSgnLi9kaXJ0eS1tYW5hZ2VyJyk7XG5cbnZhciBPYmplY3RQb29sID0gW107XG5cbnZhciBHZXRPYmplY3RGcm9tUG9vbCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzdWx0ID0gT2JqZWN0UG9vbC5wb3AoKTtcblxuICBpZiAocmVzdWx0KSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHJldHVybiB7fTtcbn07XG5cbnZhciBpbmRleFRvTnVtYmVyQW5kTG93ZXJDYXNlS2V5ID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgaWYgKGluZGV4IDw9IDkpIHtcbiAgICByZXR1cm4gNDggKyBpbmRleDtcbiAgfSBlbHNlIGlmIChpbmRleCA9PT0gMTApIHtcbiAgICByZXR1cm4gNDg7XG4gIH0gZWxzZSBpZiAoaW5kZXggPiAxMCAmJiBpbmRleCA8PSAzNikge1xuICAgIHJldHVybiA2NCArIChpbmRleC0xMCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07XG5cbnZhciBkZWZhdWx0cyA9IFtcbiAgeyBuYW1lOiAnU2hvdyBGUFMnLCBlbnRyeTogJ3Nob3dGcHMnLCBkZWZhdWx0OiB0cnVlIH0sXG4gIHsgbmFtZTogJ1Nob3cgS2V5IENvZGVzJywgZW50cnk6ICdzaG93S2V5Q29kZXMnLCBkZWZhdWx0OiB0cnVlIH1cbl07XG5cbnZhciBEZWJ1Z2dlciA9IGZ1bmN0aW9uKGFwcCkge1xuICB0aGlzLnZpZGVvID0gYXBwLnZpZGVvLmNyZWF0ZUxheWVyKHtcbiAgICB1c2VSZXRpbmE6IHRydWUsXG4gICAgaW5pdGlhbGl6ZUNhbnZhczogdHJ1ZVxuICB9KTtcbiAgdGhpcy5hcHAgPSBhcHA7XG5cbiAgdGhpcy5vcHRpb25zID0gZGVmYXVsdHM7XG4gIHRoaXMuX21heExvZ3NDb3VudHMgPSAxMDtcblxuICBmb3IgKHZhciBpPTA7IGk8dGhpcy5vcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG9wdGlvbiA9IHRoaXMub3B0aW9uc1tpXTtcbiAgICB0aGlzLl9pbml0T3B0aW9uKG9wdGlvbik7XG4gIH1cblxuICB0aGlzLmRpc2FibGVkID0gZmFsc2U7XG5cbiAgdGhpcy5mcHMgPSAwO1xuICB0aGlzLmZwc0NvdW50ID0gMDtcbiAgdGhpcy5mcHNFbGFwc2VkVGltZSA9IDA7XG4gIHRoaXMuZnBzVXBkYXRlSW50ZXJ2YWwgPSAwLjU7XG5cbiAgdGhpcy5fZm9udFNpemUgPSAwO1xuICB0aGlzLl9kaXJ0eU1hbmFnZXIgPSBuZXcgRGlydHlNYW5hZ2VyKHRoaXMudmlkZW8uY2FudmFzLCB0aGlzLnZpZGVvLmN0eCk7XG5cbiAgdGhpcy5sb2dzID0gW107XG5cbiAgdGhpcy5zaG93RGVidWcgPSBmYWxzZTtcbiAgdGhpcy5lbmFibGVEZWJ1Z0tleXMgPSB0cnVlO1xuICB0aGlzLmVuYWJsZVNob3J0Y3V0cyA9IGZhbHNlO1xuXG4gIHRoaXMuZW5hYmxlU2hvcnRjdXRzS2V5ID0gMjIwO1xuXG4gIHRoaXMubGFzdEtleSA9IG51bGw7XG5cbiAgdGhpcy5fbG9hZCgpO1xuXG4gIHRoaXMua2V5U2hvcnRjdXRzID0gW1xuICAgIHsga2V5OiAxMjMsIGVudHJ5OiAnc2hvd0RlYnVnJywgdHlwZTogJ3RvZ2dsZScgfVxuICBdO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLl9zZXRGb250ID0gZnVuY3Rpb24ocHgsIGZvbnQpIHtcbiAgdGhpcy5fZm9udFNpemUgPSBweDtcbiAgdGhpcy52aWRlby5jdHguZm9udCA9IHB4ICsgJ3B4ICcgKyBmb250O1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnZpZGVvLnNldFNpemUodGhpcy5hcHAud2lkdGgsIHRoaXMuYXBwLmhlaWdodCk7XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuYWRkQ29uZmlnID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gIHRoaXMub3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gIHRoaXMuX2luaXRPcHRpb24ob3B0aW9uKTtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5faW5pdE9wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICBvcHRpb24udHlwZSA9IG9wdGlvbi50eXBlIHx8ICd0b2dnbGUnO1xuICBvcHRpb24uZGVmYXVsdCA9IG9wdGlvbi5kZWZhdWx0ID09IG51bGwgPyBmYWxzZSA6IG9wdGlvbi5kZWZhdWx0O1xuXG4gIGlmIChvcHRpb24udHlwZSA9PT0gJ3RvZ2dsZScpIHtcbiAgICB0aGlzW29wdGlvbi5lbnRyeV0gPSBvcHRpb24uZGVmYXVsdDtcbiAgfVxufTtcblxuRGVidWdnZXIucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMubG9ncy5sZW5ndGggPSAwO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLmxvZyA9IGZ1bmN0aW9uKG1lc3NhZ2UsIGNvbG9yKSB7XG4gIGNvbG9yID0gY29sb3IgfHwgJ3doaXRlJztcbiAgbWVzc2FnZSA9IHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJyA/IG1lc3NhZ2UgOiB1dGlsLmluc3BlY3QobWVzc2FnZSk7XG5cbiAgdmFyIG1lc3NhZ2VzID0gbWVzc2FnZS5yZXBsYWNlKC9cXFxcJy9nLCBcIidcIikuc3BsaXQoJ1xcbicpO1xuXG4gIGZvciAodmFyIGk9MDsgaTxtZXNzYWdlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBtc2cgPSBtZXNzYWdlc1tpXTtcbiAgICBpZiAodGhpcy5sb2dzLmxlbmd0aCA+PSB0aGlzLl9tYXhMb2dzQ291bnRzKSB7XG4gICAgICBPYmplY3RQb29sLnB1c2godGhpcy5sb2dzLnNoaWZ0KCkpO1xuICAgIH1cblxuICAgIHZhciBtZXNzYWdlT2JqZWN0ID0gR2V0T2JqZWN0RnJvbVBvb2woKTtcbiAgICBtZXNzYWdlT2JqZWN0LnRleHQgPSBtc2c7XG4gICAgbWVzc2FnZU9iamVjdC5saWZlID0gMTA7XG4gICAgbWVzc2FnZU9iamVjdC5jb2xvciA9IGNvbG9yO1xuXG4gICAgdGhpcy5sb2dzLnB1c2gobWVzc2FnZU9iamVjdCk7XG4gIH1cbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHt9O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuZXhpdFVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgaWYgKHRoaXMuZGlzYWJsZWQpIHsgcmV0dXJuOyB9XG5cbiAgaWYgKHRoaXMuc2hvd0RlYnVnKSB7XG4gICAgdGhpcy5fbWF4TG9nc0NvdW50cyA9IE1hdGguY2VpbCgodGhpcy5hcHAuaGVpZ2h0ICsgMjApLzIwKTtcbiAgICB0aGlzLmZwc0NvdW50ICs9IDE7XG4gICAgdGhpcy5mcHNFbGFwc2VkVGltZSArPSB0aW1lO1xuXG4gICAgaWYgKHRoaXMuZnBzRWxhcHNlZFRpbWUgPiB0aGlzLmZwc1VwZGF0ZUludGVydmFsKSB7XG4gICAgICB2YXIgZnBzID0gdGhpcy5mcHNDb3VudC90aGlzLmZwc0VsYXBzZWRUaW1lO1xuXG4gICAgICBpZiAodGhpcy5zaG93RnBzKSB7XG4gICAgICAgIHRoaXMuZnBzID0gdGhpcy5mcHMgKiAoMS0wLjgpICsgMC44ICogZnBzO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmZwc0NvdW50ID0gMDtcbiAgICAgIHRoaXMuZnBzRWxhcHNlZFRpbWUgPSAwO1xuICAgIH1cblxuICAgIGZvciAodmFyIGk9MCwgbGVuPXRoaXMubG9ncy5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICAgIHZhciBsb2cgPSB0aGlzLmxvZ3NbaV07XG4gICAgICBpZiAobG9nKSB7XG4gICAgICAgIGxvZy5saWZlIC09IHRpbWU7XG4gICAgICAgIGlmIChsb2cubGlmZSA8PSAwKSB7XG4gICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5sb2dzLmluZGV4T2YobG9nKTtcbiAgICAgICAgICBpZiAoaW5kZXggPiAtMSkgeyB0aGlzLmxvZ3Muc3BsaWNlKGluZGV4LCAxKTsgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUua2V5ZG93biA9IGZ1bmN0aW9uKGtleSwgZSkge1xuICBpZiAodGhpcy5kaXNhYmxlZCkgeyByZXR1cm47IH1cblxuICB0aGlzLmxhc3RLZXkgPSBrZXk7XG5cbiAgdmFyIGk7XG5cbiAgaWYgKHRoaXMuZW5hYmxlRGVidWdLZXlzKSB7XG4gICAgaWYgKGtleSA9PT0gdGhpcy5lbmFibGVTaG9ydGN1dHNLZXkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5lbmFibGVTaG9ydGN1dHMgPSAhdGhpcy5lbmFibGVTaG9ydGN1dHM7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5lbmFibGVTaG9ydGN1dHMpIHtcbiAgICAgIGZvciAoaT0wOyBpPHRoaXMub3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgb3B0aW9uID0gdGhpcy5vcHRpb25zW2ldO1xuICAgICAgICB2YXIga2V5SW5kZXggPSBpICsgMTtcblxuICAgICAgICBpZiAodGhpcy5hcHAuaW5wdXQuaXNLZXlEb3duKCdjdHJsJykpIHtcbiAgICAgICAgICBrZXlJbmRleCAtPSAzNjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGFySWQgPSBpbmRleFRvTnVtYmVyQW5kTG93ZXJDYXNlS2V5KGtleUluZGV4KTtcblxuICAgICAgICBpZiAoY2hhcklkICYmIGtleSA9PT0gY2hhcklkKSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgaWYgKG9wdGlvbi50eXBlID09PSAndG9nZ2xlJykge1xuXG4gICAgICAgICAgICB0aGlzW29wdGlvbi5lbnRyeV0gPSAhdGhpc1tvcHRpb24uZW50cnldO1xuXG4gICAgICAgICAgICB0aGlzLl9zYXZlKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChvcHRpb24udHlwZSA9PT0gJ2NhbGwnKSB7XG4gICAgICAgICAgICBvcHRpb24uZW50cnkoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAoaT0wOyBpPHRoaXMua2V5U2hvcnRjdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtleVNob3J0Y3V0ID0gdGhpcy5rZXlTaG9ydGN1dHNbaV07XG4gICAgaWYgKGtleVNob3J0Y3V0LmtleSA9PT0ga2V5KSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGlmIChrZXlTaG9ydGN1dC50eXBlID09PSAndG9nZ2xlJykge1xuICAgICAgICB0aGlzW2tleVNob3J0Y3V0LmVudHJ5XSA9ICF0aGlzW2tleVNob3J0Y3V0LmVudHJ5XTtcbiAgICAgICAgdGhpcy5fc2F2ZSgpO1xuICAgICAgfSBlbHNlIGlmIChrZXlTaG9ydGN1dC50eXBlID09PSAnY2FsbCcpIHtcbiAgICAgICAgdGhpc1trZXlTaG9ydGN1dC5lbnRyeV0oKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLl9zYXZlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkYXRhID0ge1xuICAgIHNob3dEZWJ1ZzogdGhpcy5zaG93RGVidWcsXG4gICAgb3B0aW9uczoge31cbiAgfTtcblxuICBmb3IgKHZhciBpPTA7IGk8dGhpcy5vcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG9wdGlvbiA9IHRoaXMub3B0aW9uc1tpXTtcbiAgICB2YXIgdmFsdWUgPSB0aGlzW29wdGlvbi5lbnRyeV07XG4gICAgZGF0YS5vcHRpb25zW29wdGlvbi5lbnRyeV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHdpbmRvdy5sb2NhbFN0b3JhZ2UuX19wb3Rpb25EZWJ1ZyA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLl9sb2FkID0gZnVuY3Rpb24oKSB7XG4gIGlmICh3aW5kb3cubG9jYWxTdG9yYWdlICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2UuX19wb3Rpb25EZWJ1Zykge1xuICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZSh3aW5kb3cubG9jYWxTdG9yYWdlLl9fcG90aW9uRGVidWcpO1xuICAgIHRoaXMuc2hvd0RlYnVnID0gZGF0YS5zaG93RGVidWc7XG5cbiAgICBmb3IgKHZhciBuYW1lIGluIGRhdGEub3B0aW9ucykge1xuICAgICAgdGhpc1tuYW1lXSA9IGRhdGEub3B0aW9uc1tuYW1lXTtcbiAgICB9XG4gIH1cbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuZGlzYWJsZWQpIHsgcmV0dXJuOyB9XG5cbiAgdGhpcy5fZGlydHlNYW5hZ2VyLmNsZWFyKCk7XG5cbiAgaWYgKHRoaXMuc2hvd0RlYnVnKSB7XG4gICAgdGhpcy52aWRlby5jdHguc2F2ZSgpO1xuICAgIHRoaXMuX3NldEZvbnQoMTUsICdzYW5zLXNlcmlmJyk7XG5cbiAgICB0aGlzLl9yZW5kZXJMb2dzKCk7XG4gICAgdGhpcy5fcmVuZGVyRGF0YSgpO1xuICAgIHRoaXMuX3JlbmRlclNob3J0Y3V0cygpO1xuXG4gICAgdGhpcy52aWRlby5jdHgucmVzdG9yZSgpO1xuICB9XG5cbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5fcmVuZGVyTG9ncyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnZpZGVvLmN0eC50ZXh0QWxpZ24gPSAnbGVmdCc7XG4gIHRoaXMudmlkZW8uY3R4LnRleHRCYXNlbGluZSA9ICdib3R0b20nO1xuXG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMubG9ncy5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgbG9nID0gdGhpcy5sb2dzW2ldO1xuXG4gICAgdmFyIHkgPSAtMTAgKyB0aGlzLmFwcC5oZWlnaHQgKyAoaSAtIHRoaXMubG9ncy5sZW5ndGggKyAxKSAqIDIwO1xuICAgIHRoaXMuX3JlbmRlclRleHQobG9nLnRleHQsIDEwLCB5LCBsb2cuY29sb3IpO1xuICB9XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmRpc2FibGVkID0gdHJ1ZTtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5fcmVuZGVyRGF0YSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnZpZGVvLmN0eC50ZXh0QWxpZ24gPSAncmlnaHQnO1xuICB0aGlzLnZpZGVvLmN0eC50ZXh0QmFzZWxpbmUgPSAndG9wJztcblxuICB2YXIgeCA9IHRoaXMuYXBwLndpZHRoIC0gMTQ7XG4gIHZhciB5ID0gMTQ7XG5cbiAgaWYgKHRoaXMuc2hvd0Zwcykge1xuICAgIHRoaXMuX3JlbmRlclRleHQoTWF0aC5yb3VuZCh0aGlzLmZwcykgKyAnIGZwcycsIHgsIHkpO1xuICB9XG5cbiAgeSArPSAyMDtcblxuICB0aGlzLl9zZXRGb250KDE1LCAnc2Fucy1zZXJpZicpO1xuXG4gIGlmICh0aGlzLnNob3dLZXlDb2Rlcykge1xuICAgIHRoaXMuX3JlbmRlclRleHQoJ2tleSAnICsgdGhpcy5sYXN0S2V5LCB4LCB5LCB0aGlzLmFwcC5pbnB1dC5pc0tleURvd24odGhpcy5sYXN0S2V5KSA/ICcjZTlkYzdjJyA6ICd3aGl0ZScpO1xuICAgIHRoaXMuX3JlbmRlclRleHQoJ2J0biAnICsgdGhpcy5hcHAuaW5wdXQubW91c2UuYnV0dG9uLCB4IC0gNjAsIHksIHRoaXMuYXBwLmlucHV0Lm1vdXNlLmlzRG93biA/ICcjZTlkYzdjJyA6ICd3aGl0ZScpO1xuICB9XG59O1xuXG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5fcmVuZGVyU2hvcnRjdXRzID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmVuYWJsZVNob3J0Y3V0cykge1xuICAgIHZhciBoZWlnaHQgPSAyODtcblxuICAgIHRoaXMuX3NldEZvbnQoMjAsICdIZWx2ZXRpY2EgTmV1ZSwgc2Fucy1zZXJpZicpO1xuICAgIHRoaXMudmlkZW8uY3R4LnRleHRBbGlnbiA9ICdsZWZ0JztcbiAgICB0aGlzLnZpZGVvLmN0eC50ZXh0QmFzZWxpbmUgPSAndG9wJztcbiAgICB2YXIgbWF4UGVyQ29sbHVtbiA9IE1hdGguZmxvb3IoKHRoaXMuYXBwLmhlaWdodCAtIDE0KS9oZWlnaHQpO1xuXG4gICAgZm9yICh2YXIgaT0wOyBpPHRoaXMub3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG9wdGlvbiA9IHRoaXMub3B0aW9uc1tpXTtcbiAgICAgIHZhciB4ID0gMTQgKyBNYXRoLmZsb29yKGkvbWF4UGVyQ29sbHVtbikgKiAzMjA7XG4gICAgICB2YXIgeSA9IDE0ICsgaSVtYXhQZXJDb2xsdW1uICogaGVpZ2h0O1xuXG4gICAgICB2YXIga2V5SW5kZXggPSBpICsgMTtcbiAgICAgIHZhciBjaGFySWQgPSBpbmRleFRvTnVtYmVyQW5kTG93ZXJDYXNlS2V5KGtleUluZGV4KTtcblxuICAgICAgdmFyIGlzT24gPSB0aGlzW29wdGlvbi5lbnRyeV07XG5cbiAgICAgIHZhciBzaG9ydGN1dCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2hhcklkKTtcblxuICAgICAgaWYgKCFjaGFySWQpIHtcbiAgICAgICAgc2hvcnRjdXQgPSAnXisnICsgU3RyaW5nLmZyb21DaGFyQ29kZShpbmRleFRvTnVtYmVyQW5kTG93ZXJDYXNlS2V5KGtleUluZGV4IC0gMzYpKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRleHQgPSAnWycgKyBzaG9ydGN1dCArICddICcgKyBvcHRpb24ubmFtZTtcbiAgICAgIGlmIChvcHRpb24udHlwZSA9PT0gJ3RvZ2dsZScpIHtcbiAgICAgICAgdGV4dCArPSAnICgnICsgKGlzT24gPyAnT04nIDogJ09GRicpICsgJyknO1xuICAgICAgfSBlbHNlIGlmIChvcHRpb24udHlwZSA9PT0gJ2NhbGwnKSB7XG4gICAgICAgIHRleHQgKz0gJyAoQ0FMTCknO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29sb3IgPSAncmdiYSgyNTUsIDI1NSwgMjU1LCAxKSc7XG4gICAgICB2YXIgb3V0bGluZSA9ICdyZ2JhKDAsIDAsIDAsIDEpJztcblxuICAgICAgaWYgKCFpc09uKSB7XG4gICAgICAgIGNvbG9yID0gJ3JnYmEoMjU1LCAyNTUsIDI1NSwgLjcpJztcbiAgICAgICAgb3V0bGluZSA9ICdyZ2JhKDAsIDAsIDAsIC43KSc7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3JlbmRlclRleHQodGV4dCwgeCwgeSwgY29sb3IsIG91dGxpbmUpO1xuICAgIH1cbiAgfVxufTtcblxuRGVidWdnZXIucHJvdG90eXBlLl9yZW5kZXJUZXh0ID0gZnVuY3Rpb24odGV4dCwgeCwgeSwgY29sb3IsIG91dGxpbmUpIHtcbiAgY29sb3IgPSBjb2xvciB8fCAnd2hpdGUnO1xuICBvdXRsaW5lID0gb3V0bGluZSB8fCAnYmxhY2snO1xuICB0aGlzLnZpZGVvLmN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgdGhpcy52aWRlby5jdHgubGluZUpvaW4gPSAncm91bmQnO1xuICB0aGlzLnZpZGVvLmN0eC5zdHJva2VTdHlsZSA9IG91dGxpbmU7XG4gIHRoaXMudmlkZW8uY3R4LmxpbmVXaWR0aCA9IDM7XG4gIHRoaXMudmlkZW8uY3R4LnN0cm9rZVRleHQodGV4dCwgeCwgeSk7XG4gIHRoaXMudmlkZW8uY3R4LmZpbGxUZXh0KHRleHQsIHgsIHkpO1xuXG4gIHZhciB3aWR0aCA9IHRoaXMudmlkZW8uY3R4Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoO1xuXG4gIHZhciBkeCA9IHggLSA1O1xuICB2YXIgZHkgPSB5O1xuICB2YXIgZHdpZHRoID0gd2lkdGggKyAxMDtcbiAgdmFyIGRoZWlnaHQgPSB0aGlzLl9mb250U2l6ZSArIDEwO1xuXG4gIGlmICh0aGlzLnZpZGVvLmN0eC50ZXh0QWxpZ24gPT09ICdyaWdodCcpIHtcbiAgICBkeCA9IHggLSA1IC0gd2lkdGg7XG4gIH1cblxuICB0aGlzLl9kaXJ0eU1hbmFnZXIuYWRkUmVjdChkeCwgZHksIGR3aWR0aCwgZGhlaWdodCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERlYnVnZ2VyO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcG90aW9uLWRlYnVnZ2VyL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IDcgOCA5IDEwIDExXG4gKiovIiwidmFyIGlzUmV0aW5hID0gcmVxdWlyZSgnLi9yZXRpbmEnKSgpO1xuXG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudH0gY2FudmFzIC0gQ2FudmFzIERPTSBlbGVtZW50XG4gKi9cbnZhciBWaWRlbyA9IGZ1bmN0aW9uKGdhbWUsIGNhbnZhcywgY29uZmlnKSB7XG4gIHRoaXMuZ2FtZSA9IGdhbWU7XG5cbiAgdGhpcy5jb25maWcgPSBjb25maWc7XG5cbiAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG5cbiAgdGhpcy53aWR0aCA9IGdhbWUud2lkdGg7XG5cbiAgdGhpcy5oZWlnaHQgPSBnYW1lLmhlaWdodDtcblxuICBpZiAoY29uZmlnLmluaXRpYWxpemVDYW52YXMpIHtcbiAgICB0aGlzLmN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICB9XG5cbiAgdGhpcy5fYXBwbHlTaXplVG9DYW52YXMoKTtcbn07XG5cbi8qKlxuICogSW5jbHVkZXMgbWl4aW5zIGludG8gVmlkZW8gbGlicmFyeVxuICogQHBhcmFtIHtvYmplY3R9IG1ldGhvZHMgLSBvYmplY3Qgb2YgbWV0aG9kcyB0aGF0IHdpbGwgaW5jbHVkZWQgaW4gVmlkZW9cbiAqL1xuVmlkZW8ucHJvdG90eXBlLmluY2x1ZGUgPSBmdW5jdGlvbihtZXRob2RzKSB7XG4gIGZvciAodmFyIG1ldGhvZCBpbiBtZXRob2RzKSB7XG4gICAgdGhpc1ttZXRob2RdID0gbWV0aG9kc1ttZXRob2RdO1xuICB9XG59O1xuXG5WaWRlby5wcm90b3R5cGUuYmVnaW5GcmFtZSA9IGZ1bmN0aW9uKCkge307XG5cblZpZGVvLnByb3RvdHlwZS5lbmRGcmFtZSA9IGZ1bmN0aW9uKCkge307XG5cblZpZGVvLnByb3RvdHlwZS5zY2FsZUNhbnZhcyA9IGZ1bmN0aW9uKHNjYWxlKSB7XG4gIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gdGhpcy5jYW52YXMud2lkdGggKyAncHgnO1xuICB0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQgKyAncHgnO1xuXG4gIHRoaXMuY2FudmFzLndpZHRoICo9IHNjYWxlO1xuICB0aGlzLmNhbnZhcy5oZWlnaHQgKj0gc2NhbGU7XG5cbiAgaWYgKHRoaXMuY3R4KSB7XG4gICAgdGhpcy5jdHguc2NhbGUoc2NhbGUsIHNjYWxlKTtcbiAgfVxufTtcblxuVmlkZW8ucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgdGhpcy5fYXBwbHlTaXplVG9DYW52YXMoKTtcbn07XG5cblZpZGVvLnByb3RvdHlwZS5fYXBwbHlTaXplVG9DYW52YXMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcblxuICB2YXIgY29udGFpbmVyID0gdGhpcy5jYW52YXMucGFyZW50RWxlbWVudDtcbiAgY29udGFpbmVyLnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArICdweCc7XG4gIGNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArICdweCc7XG5cbiAgaWYgKHRoaXMuY29uZmlnLnVzZVJldGluYSAmJiBpc1JldGluYSkge1xuICAgIHRoaXMuc2NhbGVDYW52YXMoMik7XG4gIH1cbn07XG5cblZpZGVvLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5jdHgpIHsgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTsgfVxufTtcblxuVmlkZW8ucHJvdG90eXBlLmNyZWF0ZUxheWVyID0gZnVuY3Rpb24oY29uZmlnKSB7XG4gIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuICB2YXIgY29udGFpbmVyID0gdGhpcy5jYW52YXMucGFyZW50RWxlbWVudDtcbiAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICBjYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICBjYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gIGNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gIGNhbnZhcy5zdHlsZS50b3AgPSAnMHB4JztcbiAgY2FudmFzLnN0eWxlLmxlZnQgPSAnMHB4JztcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNhbnZhcyk7XG5cbiAgdmFyIHZpZGVvID0gbmV3IFZpZGVvKHRoaXMuZ2FtZSwgY2FudmFzLCBjb25maWcpO1xuXG4gIHJldHVybiB2aWRlbztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmlkZW87XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy92aWRlby5qc1xuICoqLyIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG52YXIgUG90aW9uQXVkaW8gPSByZXF1aXJlKCdwb3Rpb24tYXVkaW8nKTtcblxuLyoqXG4gKiBDbGFzcyBmb3IgbWFuYWdpbmcgYW5kIGxvYWRpbmcgYXNzZXQgZmlsZXNcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgQXNzZXRzID0gZnVuY3Rpb24oKSB7XG4gIC8qKlxuICAgKiBJcyBjdXJyZW50bHkgbG9hZGluZyBhbnkgYXNzZXRzXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcblxuICB0aGlzLml0ZW1zQ291bnQgPSAwO1xuICB0aGlzLmxvYWRlZEl0ZW1zQ291bnQgPSAwO1xuICB0aGlzLnByb2dyZXNzID0gMDtcblxuICB0aGlzLl94aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICB0aGlzLl90aGluZ3NUb0xvYWQgPSAwO1xuICB0aGlzLl9kYXRhID0ge307XG5cbiAgdGhpcy5jYWxsYmFjayA9IG51bGw7XG5cbiAgdGhpcy5fdG9Mb2FkID0gW107XG5cbiAgdGhpcy5hdWRpbyA9IG5ldyBQb3Rpb25BdWRpbygpO1xufTtcblxuLyoqXG4gKiBTdGFydHMgbG9hZGluZyBzdG9yZWQgYXNzZXRzIHVybHMgYW5kIHJ1bnMgZ2l2ZW4gY2FsbGJhY2sgYWZ0ZXIgZXZlcnl0aGluZyBpcyBsb2FkZWRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAqL1xuQXNzZXRzLnByb3RvdHlwZS5vbmxvYWQgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG5cbiAgaWYgKHRoaXMuX3RoaW5nc1RvTG9hZCA9PT0gMCkge1xuICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fbmV4dEZpbGUoKTtcbiAgfVxufTtcblxuLyoqXG4gKiBHZXR0ZXIgZm9yIGxvYWRlZCBhc3NldHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdXJsIG9mIHN0b3JlZCBhc3NldFxuICovXG5Bc3NldHMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgcmV0dXJuIHRoaXMuX2RhdGFbcGF0aC5ub3JtYWxpemUobmFtZSldO1xufTtcblxuLyoqXG4gKiBVc2VkIGZvciBzdG9yaW5nIHNvbWUgdmFsdWUgaW4gYXNzZXRzIG1vZHVsZVxuICogdXNlZnVsIGZvciBvdmVycmF0aW5nIHZhbHVlc1xuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB1cmwgb2YgdGhlIGFzc2V0XG4gKiBAcGFyYW0ge2FueX0gdmFsdWUgLSB2YWx1ZSB0byBiZSBzdG9yZWRcbiAqL1xuQXNzZXRzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB0aGlzLl9kYXRhW3BhdGgubm9ybWFsaXplKG5hbWUpXSA9IHZhbHVlO1xufTtcblxuLyoqXG4gKiBTdG9yZXMgdXJsIHNvIGl0IGNhbiBiZSBsb2FkZWQgbGF0ZXJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0gdHlwZSBvZiBhc3NldFxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIHVybCBvZiBnaXZlbiBhc3NldFxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBjYWxsYmFjayBmdW5jdGlvblxuICovXG5Bc3NldHMucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbih0eXBlLCB1cmwsIGNhbGxiYWNrKSB7XG4gIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcbiAgdGhpcy5pdGVtc0NvdW50ICs9IDE7XG4gIHRoaXMuX3RoaW5nc1RvTG9hZCArPSAxO1xuXG4gIHRoaXMuX3RvTG9hZC5wdXNoKHsgdHlwZTogdHlwZSwgdXJsOiB1cmwgIT0gbnVsbCA/IHBhdGgubm9ybWFsaXplKHVybCkgOiBudWxsLCBjYWxsYmFjazogY2FsbGJhY2sgfSk7XG59O1xuXG5Bc3NldHMucHJvdG90eXBlLl9maW5pc2hlZE9uZUZpbGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fbmV4dEZpbGUoKTtcbiAgdGhpcy5wcm9ncmVzcyA9IHRoaXMubG9hZGVkSXRlbXNDb3VudCAvIHRoaXMuaXRlbXNDb3VudDtcbiAgdGhpcy5fdGhpbmdzVG9Mb2FkIC09IDE7XG4gIHRoaXMubG9hZGVkSXRlbXNDb3VudCArPSAxO1xuXG4gIGlmICh0aGlzLl90aGluZ3NUb0xvYWQgPT09IDApIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHNlbGYuY2FsbGJhY2soKTtcbiAgICAgIHNlbGYuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgfSwgMCk7XG4gIH1cbn07XG5cbkFzc2V0cy5wcm90b3R5cGUuX2Vycm9yID0gZnVuY3Rpb24odHlwZSwgdXJsKSB7XG4gIGNvbnNvbGUud2FybignRXJyb3IgbG9hZGluZyBcIicgKyB0eXBlICsgJ1wiIGFzc2V0IHdpdGggdXJsICcgKyB1cmwpO1xuICB0aGlzLl9uZXh0RmlsZSgpO1xufTtcblxuQXNzZXRzLnByb3RvdHlwZS5fc2F2ZSA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgdGhpcy5zZXQodXJsLCBkYXRhKTtcbiAgaWYgKGNhbGxiYWNrKSB7IGNhbGxiYWNrKGRhdGEpOyB9XG4gIHRoaXMuX2ZpbmlzaGVkT25lRmlsZSgpO1xufTtcblxuQXNzZXRzLnByb3RvdHlwZS5faGFuZGxlQ3VzdG9tTG9hZGluZyA9IGZ1bmN0aW9uKGxvYWRpbmcpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgZG9uZSA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgc2VsZi5fc2F2ZShuYW1lLCB2YWx1ZSk7XG4gIH07XG4gIGxvYWRpbmcoZG9uZSk7XG59O1xuXG5Bc3NldHMucHJvdG90eXBlLl9uZXh0RmlsZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY3VycmVudCA9IHRoaXMuX3RvTG9hZC5zaGlmdCgpO1xuXG4gIGlmICghY3VycmVudCkgeyByZXR1cm47IH1cblxuICB2YXIgdHlwZSA9IGN1cnJlbnQudHlwZTtcbiAgdmFyIHVybCA9IGN1cnJlbnQudXJsO1xuICB2YXIgY2FsbGJhY2sgPSBjdXJyZW50LmNhbGxiYWNrO1xuXG4gIHZhciBzZWxmID0gdGhpcztcblxuICBpZiAodXRpbHMuaXNGdW5jdGlvbih0eXBlKSkge1xuICAgIHRoaXMuX2hhbmRsZUN1c3RvbUxvYWRpbmcodHlwZSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdHlwZSA9IHR5cGUudG9Mb3dlckNhc2UoKTtcblxuICB2YXIgcmVxdWVzdCA9IHRoaXMuX3hocjtcblxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdqc29uJzpcbiAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgdXJsLCB0cnVlKTtcbiAgICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ3RleHQnO1xuICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpO1xuICAgICAgICBzZWxmLl9zYXZlKHVybCwgZGF0YSwgY2FsbGJhY2spO1xuICAgICAgfTtcbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKCkgeyBzZWxmLl9lcnJvcih0eXBlLCB1cmwpOyB9O1xuICAgICAgcmVxdWVzdC5zZW5kKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdtcDMnOlxuICAgIGNhc2UgJ211c2ljJzpcbiAgICBjYXNlICdzb3VuZCc6XG4gICAgICBzZWxmLmF1ZGlvLmxvYWQodXJsLCBmdW5jdGlvbihhdWRpbykge1xuICAgICAgICBzZWxmLl9zYXZlKHVybCwgYXVkaW8sIGNhbGxiYWNrKTtcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnaW1hZ2UnOlxuICAgIGNhc2UgJ3RleHR1cmUnOlxuICAgIGNhc2UgJ3Nwcml0ZSc6XG4gICAgICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLl9zYXZlKHVybCwgaW1hZ2UsIGNhbGxiYWNrKTtcbiAgICAgIH07XG4gICAgICBpbWFnZS5vbmVycm9yID0gZnVuY3Rpb24oKSB7IHNlbGYuX2Vycm9yKHR5cGUsIHVybCk7IH07XG4gICAgICBpbWFnZS5zcmMgPSB1cmw7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OiAvLyB0ZXh0IGZpbGVzXG4gICAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9ICd0ZXh0JztcbiAgICAgIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5yZXNwb25zZTtcbiAgICAgICAgc2VsZi5fc2F2ZSh1cmwsIGRhdGEsIGNhbGxiYWNrKTtcbiAgICAgIH07XG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigpIHsgc2VsZi5fZXJyb3IodHlwZSwgdXJsKTsgfTtcbiAgICAgIHJlcXVlc3Quc2VuZCgpO1xuICAgICAgYnJlYWs7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXNzZXRzO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvYXNzZXRzLmpzXG4gKiovIiwidmFyIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBJbnB1dCB3cmFwcGVyXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7R2FtZX0gZ2FtZSAtIEdhbWUgb2JqZWN0XG4gKi9cbnZhciBJbnB1dCA9IGZ1bmN0aW9uKGdhbWUsIGNvbnRhaW5lcikge1xuICB0aGlzLl9jb250YWluZXIgPSBjb250YWluZXI7XG4gIC8qKlxuICAgKiBQcmVzc2VkIGtleXMgb2JqZWN0XG4gICAqIEB0eXBlIHtvYmplY3R9XG4gICAqL1xuICB0aGlzLmtleXMgPSB7fTtcblxuICAvKipcbiAgICogQ29udHJvbHMgaWYgeW91IGNhbiBwcmVzcyBrZXlzXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgdGhpcy5jYW5Db250cm9sS2V5cyA9IHRydWU7XG5cbiAgLyoqXG4gICAqIE1vdXNlIG9iamVjdCB3aXRoIHBvc2l0aW9ucyBhbmQgaWYgaXMgbW91c2UgYnV0dG9uIHByZXNzZWRcbiAgICogQHR5cGUge29iamVjdH1cbiAgICovXG4gIHRoaXMubW91c2UgPSB7XG4gICAgaXNEb3duOiBmYWxzZSxcbiAgICBpc0xlZnREb3duOiBmYWxzZSxcbiAgICBpc01pZGRsZURvd246IGZhbHNlLFxuICAgIGlzUmlnaHREb3duOiBmYWxzZSxcbiAgICB4OiBudWxsLFxuICAgIHk6IG51bGxcbiAgfTtcblxuICB0aGlzLl9hZGRFdmVudHMoZ2FtZSk7XG59O1xuXG4vKipcbiAqIENsZWFycyB0aGUgcHJlc3NlZCBrZXlzIG9iamVjdFxuICovXG5JbnB1dC5wcm90b3R5cGUucmVzZXRLZXlzID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMua2V5cyA9IHt9O1xufTtcblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBvciBmYWxzZSBpZiBrZXkgaXMgcHJlc3NlZFxuICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuSW5wdXQucHJvdG90eXBlLmlzS2V5RG93biA9IGZ1bmN0aW9uKGtleSkge1xuICBpZiAoa2V5ID09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgaWYgKHRoaXMuY2FuQ29udHJvbEtleXMpIHtcbiAgICB2YXIgY29kZSA9IHR5cGVvZiBrZXkgPT09ICdudW1iZXInID8ga2V5IDoga2V5c1trZXkudG9VcHBlckNhc2UoKV07XG4gICAgcmV0dXJuIHRoaXMua2V5c1tjb2RlXTtcbiAgfVxufTtcblxuLyoqXG4gKiBBZGQgY2FudmFzIGV2ZW50IGxpc3RlbmVyXG4gKiBAcHJpdmF0ZVxuICovXG5JbnB1dC5wcm90b3R5cGUuX2FkZEV2ZW50cyA9IGZ1bmN0aW9uKGdhbWUpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYuX2NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbihlKSB7XG4gICAgdmFyIHggPSBlLm9mZnNldFggPT09IHVuZGVmaW5lZCA/IGUubGF5ZXJYIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldExlZnQgOiBlLm9mZnNldFg7XG4gICAgdmFyIHkgPSBlLm9mZnNldFkgPT09IHVuZGVmaW5lZCA/IGUubGF5ZXJZIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldFRvcCA6IGUub2Zmc2V0WTtcblxuICAgIHNlbGYubW91c2UueCA9IHg7XG4gICAgc2VsZi5tb3VzZS55ID0geTtcblxuICAgIGdhbWUuc3RhdGVzLm1vdXNlbW92ZSh4LCB5LCBlKTtcbiAgfSk7XG5cbiAgc2VsZi5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdmFyIHggPSBlLm9mZnNldFggPT09IHVuZGVmaW5lZCA/IGUubGF5ZXJYIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldExlZnQgOiBlLm9mZnNldFg7XG4gICAgdmFyIHkgPSBlLm9mZnNldFkgPT09IHVuZGVmaW5lZCA/IGUubGF5ZXJZIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldFRvcCA6IGUub2Zmc2V0WTtcblxuICAgIHNlbGYubW91c2UuaXNEb3duID0gZmFsc2U7XG5cbiAgICBzd2l0Y2ggKGUuYnV0dG9uKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHNlbGYubW91c2UuaXNMZWZ0RG93biA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHNlbGYubW91c2UuaXNNaWRkbGVEb3duID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBzZWxmLm1vdXNlLmlzUmlnaHREb3duID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGdhbWUuc3RhdGVzLm1vdXNldXAoeCwgeSwgZS5idXR0b24pO1xuICB9LCBmYWxzZSk7XG5cbiAgc2VsZi5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgeCA9IGUub2Zmc2V0WCA9PT0gdW5kZWZpbmVkID8gZS5sYXllclggLSBzZWxmLl9jb250YWluZXIub2Zmc2V0TGVmdCA6IGUub2Zmc2V0WDtcbiAgICB2YXIgeSA9IGUub2Zmc2V0WSA9PT0gdW5kZWZpbmVkID8gZS5sYXllclkgLSBzZWxmLl9jb250YWluZXIub2Zmc2V0VG9wIDogZS5vZmZzZXRZO1xuXG4gICAgc2VsZi5tb3VzZS54ID0geDtcbiAgICBzZWxmLm1vdXNlLnkgPSB5O1xuICAgIHNlbGYubW91c2UuaXNEb3duID0gdHJ1ZTtcblxuICAgIHN3aXRjaCAoZS5idXR0b24pIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgc2VsZi5tb3VzZS5pc0xlZnREb3duID0gdHJ1ZTtcbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICBzZWxmLm1vdXNlLmlzTWlkZGxlRG93biA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBzZWxmLm1vdXNlLmlzUmlnaHREb3duID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgZ2FtZS5zdGF0ZXMubW91c2Vkb3duKHgsIHksIGUuYnV0dG9uKTtcbiAgfSwgZmFsc2UpO1xuXG4gIHNlbGYuX2NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGZvciAodmFyIGk9MDsgaTxlLnRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB0b3VjaCA9IGUudG91Y2hlc1tpXTtcblxuICAgICAgdmFyIHggPSB0b3VjaC5wYWdlWCAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRMZWZ0O1xuICAgICAgdmFyIHkgPSB0b3VjaC5wYWdlWSAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRUb3A7XG5cbiAgICAgIHNlbGYubW91c2UueCA9IHg7XG4gICAgICBzZWxmLm1vdXNlLnkgPSB5O1xuICAgICAgc2VsZi5tb3VzZS5pc0Rvd24gPSB0cnVlO1xuXG4gICAgICBnYW1lLnN0YXRlcy5tb3VzZWRvd24oeCwgeSwgMSk7XG4gICAgfVxuICB9KTtcblxuICBzZWxmLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGZvciAodmFyIGk9MDsgaTxlLnRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB0b3VjaCA9IGUudG91Y2hlc1tpXTtcblxuICAgICAgdmFyIHggPSB0b3VjaC5wYWdlWCAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRMZWZ0O1xuICAgICAgdmFyIHkgPSB0b3VjaC5wYWdlWSAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRUb3A7XG5cbiAgICAgIHNlbGYubW91c2UueCA9IHg7XG4gICAgICBzZWxmLm1vdXNlLnkgPSB5O1xuICAgICAgc2VsZi5tb3VzZS5pc0Rvd24gPSB0cnVlO1xuXG4gICAgICBnYW1lLnN0YXRlcy5tb3VzZW1vdmUoeCwgeSk7XG4gICAgfVxuICB9KTtcblxuICBzZWxmLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdmFyIHRvdWNoID0gZS5jaGFuZ2VkVG91Y2hlc1swXTtcblxuICAgIHZhciB4ID0gdG91Y2gucGFnZVggLSBzZWxmLl9jb250YWluZXIub2Zmc2V0TGVmdDtcbiAgICB2YXIgeSA9IHRvdWNoLnBhZ2VZIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldFRvcDtcblxuICAgIHNlbGYubW91c2UueCA9IHg7XG4gICAgc2VsZi5tb3VzZS55ID0geTtcbiAgICBzZWxmLm1vdXNlLmlzRG93biA9IGZhbHNlO1xuXG4gICAgZ2FtZS5zdGF0ZXMubW91c2V1cCh4LCB5LCAxKTtcbiAgfSk7XG5cbiAgc2VsZi5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfSk7XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtcbiAgICBnYW1lLmlucHV0LmtleXNbZS5rZXlDb2RlXSA9IHRydWU7XG4gICAgZ2FtZS5zdGF0ZXMua2V5ZG93bihlLndoaWNoLCBlKTtcbiAgfSk7XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbihlKSB7XG4gICAgZ2FtZS5pbnB1dC5rZXlzW2Uua2V5Q29kZV0gPSBmYWxzZTtcbiAgICBnYW1lLnN0YXRlcy5rZXl1cChlLndoaWNoLCBlKTtcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvaW5wdXQuanNcbiAqKi8iLCJ2YXIgRGlydHlNYW5hZ2VyID0gZnVuY3Rpb24oY2FudmFzLCBjdHgpIHtcbiAgdGhpcy5jdHggPSBjdHg7XG4gIHRoaXMuY2FudmFzID0gY2FudmFzO1xuXG4gIHRoaXMudG9wID0gY2FudmFzLmhlaWdodDtcbiAgdGhpcy5sZWZ0ID0gY2FudmFzLndpZHRoO1xuICB0aGlzLmJvdHRvbSA9IDA7XG4gIHRoaXMucmlnaHQgPSAwO1xuXG4gIHRoaXMuaXNEaXJ0eSA9IGZhbHNlO1xufTtcblxuRGlydHlNYW5hZ2VyLnByb3RvdHlwZS5hZGRSZWN0ID0gZnVuY3Rpb24obGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0KSB7XG4gIHZhciByaWdodCAgPSBsZWZ0ICsgd2lkdGg7XG4gIHZhciBib3R0b20gPSB0b3AgKyBoZWlnaHQ7XG5cbiAgdGhpcy50b3AgICAgPSB0b3AgPCB0aGlzLnRvcCAgICAgICA/IHRvcCAgICA6IHRoaXMudG9wO1xuICB0aGlzLmxlZnQgICA9IGxlZnQgPCB0aGlzLmxlZnQgICAgID8gbGVmdCAgIDogdGhpcy5sZWZ0O1xuICB0aGlzLmJvdHRvbSA9IGJvdHRvbSA+IHRoaXMuYm90dG9tID8gYm90dG9tIDogdGhpcy5ib3R0b207XG4gIHRoaXMucmlnaHQgID0gcmlnaHQgPiB0aGlzLnJpZ2h0ICAgPyByaWdodCAgOiB0aGlzLnJpZ2h0O1xuXG4gIHRoaXMuaXNEaXJ0eSA9IHRydWU7XG59O1xuXG5EaXJ0eU1hbmFnZXIucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5pc0RpcnR5KSB7IHJldHVybjsgfVxuXG4gIHRoaXMuY3R4LmNsZWFyUmVjdCh0aGlzLmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICB0aGlzLnRvcCxcbiAgICAgICAgICAgICAgICAgICAgIHRoaXMucmlnaHQgLSB0aGlzLmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICB0aGlzLmJvdHRvbSAtIHRoaXMudG9wKTtcblxuICB0aGlzLmxlZnQgPSB0aGlzLmNhbnZhcy53aWR0aDtcbiAgdGhpcy50b3AgPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XG4gIHRoaXMucmlnaHQgPSAwO1xuICB0aGlzLmJvdHRvbSA9IDA7XG5cbiAgdGhpcy5pc0RpcnR5ID0gZmFsc2U7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpcnR5TWFuYWdlcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3BvdGlvbi1kZWJ1Z2dlci9kaXJ0eS1tYW5hZ2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMTFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUgNiA3IDggOSAxMCAxMVxuICoqLyIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi91dGlsL3V0aWwuanNcbiAqKiBtb2R1bGUgaWQgPSAxMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IDcgOCA5IDEwIDExXG4gKiovIiwidmFyIGlzUmV0aW5hID0gZnVuY3Rpb24oKSB7XG4gIHZhciBtZWRpYVF1ZXJ5ID0gXCIoLXdlYmtpdC1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAxLjUpLFxcXG4gIChtaW4tLW1vei1kZXZpY2UtcGl4ZWwtcmF0aW86IDEuNSksXFxcbiAgKC1vLW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDMvMiksXFxcbiAgKG1pbi1yZXNvbHV0aW9uOiAxLjVkcHB4KVwiO1xuXG4gIGlmICh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA+IDEpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhICYmIHdpbmRvdy5tYXRjaE1lZGlhKG1lZGlhUXVlcnkpLm1hdGNoZXMpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc1JldGluYTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JldGluYS5qc1xuICoqLyIsInZhciBnZXQgPSBleHBvcnRzLmdldCA9IGZ1bmN0aW9uKHVybCwgY2FsbGJhY2spIHtcbiAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgcmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuXG4gIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgY2FsbGJhY2sodGhpcy5yZXNwb25zZSk7XG4gIH07XG5cbiAgcmVxdWVzdC5zZW5kKCk7XG59O1xuXG52YXIgZ2V0SlNPTiA9IGV4cG9ydHMuZ2V0SlNPTiA9IGZ1bmN0aW9uKHVybCwgY2FsbGJhY2spIHtcbiAgZ2V0KHVybCwgZnVuY3Rpb24odGV4dCkge1xuICAgIGNhbGxiYWNrKEpTT04ucGFyc2UodGV4dCkpO1xuICB9KTtcbn07XG5cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gISEob2JqICYmIG9iai5jb25zdHJ1Y3RvciAmJiBvYmouY2FsbCAmJiBvYmouYXBwbHkpO1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3V0aWxzLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICdNT1VTRTEnOi0xLFxuICAnTU9VU0UyJzotMyxcbiAgJ01XSEVFTF9VUCc6LTQsXG4gICdNV0hFRUxfRE9XTic6LTUsXG4gICdCQUNLU1BBQ0UnOjgsXG4gICdUQUInOjksXG4gICdFTlRFUic6MTMsXG4gICdQQVVTRSc6MTksXG4gICdDQVBTJzoyMCxcbiAgJ0VTQyc6MjcsXG4gICdTUEFDRSc6MzIsXG4gICdQQUdFX1VQJzozMyxcbiAgJ1BBR0VfRE9XTic6MzQsXG4gICdFTkQnOjM1LFxuICAnSE9NRSc6MzYsXG4gICdMRUZUJzozNyxcbiAgJ1VQJzozOCxcbiAgJ1JJR0hUJzozOSxcbiAgJ0RPV04nOjQwLFxuICAnSU5TRVJUJzo0NSxcbiAgJ0RFTEVURSc6NDYsXG4gICdfMCc6NDgsXG4gICdfMSc6NDksXG4gICdfMic6NTAsXG4gICdfMyc6NTEsXG4gICdfNCc6NTIsXG4gICdfNSc6NTMsXG4gICdfNic6NTQsXG4gICdfNyc6NTUsXG4gICdfOCc6NTYsXG4gICdfOSc6NTcsXG4gICdBJzo2NSxcbiAgJ0InOjY2LFxuICAnQyc6NjcsXG4gICdEJzo2OCxcbiAgJ0UnOjY5LFxuICAnRic6NzAsXG4gICdHJzo3MSxcbiAgJ0gnOjcyLFxuICAnSSc6NzMsXG4gICdKJzo3NCxcbiAgJ0snOjc1LFxuICAnTCc6NzYsXG4gICdNJzo3NyxcbiAgJ04nOjc4LFxuICAnTyc6NzksXG4gICdQJzo4MCxcbiAgJ1EnOjgxLFxuICAnUic6ODIsXG4gICdTJzo4MyxcbiAgJ1QnOjg0LFxuICAnVSc6ODUsXG4gICdWJzo4NixcbiAgJ1cnOjg3LFxuICAnWCc6ODgsXG4gICdZJzo4OSxcbiAgJ1onOjkwLFxuICAnTlVNUEFEXzAnOjk2LFxuICAnTlVNUEFEXzEnOjk3LFxuICAnTlVNUEFEXzInOjk4LFxuICAnTlVNUEFEXzMnOjk5LFxuICAnTlVNUEFEXzQnOjEwMCxcbiAgJ05VTVBBRF81JzoxMDEsXG4gICdOVU1QQURfNic6MTAyLFxuICAnTlVNUEFEXzcnOjEwMyxcbiAgJ05VTVBBRF84JzoxMDQsXG4gICdOVU1QQURfOSc6MTA1LFxuICAnTVVMVElQTFknOjEwNixcbiAgJ0FERCc6MTA3LFxuICAnU1VCU1RSQUNUJzoxMDksXG4gICdERUNJTUFMJzoxMTAsXG4gICdESVZJREUnOjExMSxcbiAgJ0YxJzoxMTIsXG4gICdGMic6MTEzLFxuICAnRjMnOjExNCxcbiAgJ0Y0JzoxMTUsXG4gICdGNSc6MTE2LFxuICAnRjYnOjExNyxcbiAgJ0Y3JzoxMTgsXG4gICdGOCc6MTE5LFxuICAnRjknOjEyMCxcbiAgJ0YxMCc6MTIxLFxuICAnRjExJzoxMjIsXG4gICdGMTInOjEyMyxcbiAgJ1NISUZUJzoxNixcbiAgJ0NUUkwnOjE3LFxuICAnQUxUJzoxOCxcbiAgJ1BMVVMnOjE4NyxcbiAgJ0NPTU1BJzoxODgsXG4gICdNSU5VUyc6MTg5LFxuICAnUEVSSU9EJzoxOTBcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9rZXlzLmpzXG4gKiovIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCBhcnJheSB3aXRoIGRpcmVjdG9yeSBuYW1lcyB0aGVyZVxuLy8gbXVzdCBiZSBubyBzbGFzaGVzLCBlbXB0eSBlbGVtZW50cywgb3IgZGV2aWNlIG5hbWVzIChjOlxcKSBpbiB0aGUgYXJyYXlcbi8vIChzbyBhbHNvIG5vIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgLSBpdCBkb2VzIG5vdCBkaXN0aW5ndWlzaFxuLy8gcmVsYXRpdmUgYW5kIGFic29sdXRlIHBhdGhzKVxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkocGFydHMsIGFsbG93QWJvdmVSb290KSB7XG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBsYXN0ID0gcGFydHNbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuLy8gU3BsaXQgYSBmaWxlbmFtZSBpbnRvIFtyb290LCBkaXIsIGJhc2VuYW1lLCBleHRdLCB1bml4IHZlcnNpb25cbi8vICdyb290JyBpcyBqdXN0IGEgc2xhc2gsIG9yIG5vdGhpbmcuXG52YXIgc3BsaXRQYXRoUmUgPVxuICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xudmFyIHNwbGl0UGF0aCA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHJldHVybiBzcGxpdFBhdGhSZS5leGVjKGZpbGVuYW1lKS5zbGljZSgxKTtcbn07XG5cbi8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVzb2x2ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzb2x2ZWRQYXRoID0gJycsXG4gICAgICByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICB2YXIgcGF0aCA9IChpID49IDApID8gYXJndW1lbnRzW2ldIDogcHJvY2Vzcy5jd2QoKTtcblxuICAgIC8vIFNraXAgZW1wdHkgYW5kIGludmFsaWQgZW50cmllc1xuICAgIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLnJlc29sdmUgbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfSBlbHNlIGlmICghcGF0aCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcmVzb2x2ZWRQYXRoID0gcGF0aCArICcvJyArIHJlc29sdmVkUGF0aDtcbiAgICByZXNvbHZlZEFic29sdXRlID0gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbiAgfVxuXG4gIC8vIEF0IHRoaXMgcG9pbnQgdGhlIHBhdGggc2hvdWxkIGJlIHJlc29sdmVkIHRvIGEgZnVsbCBhYnNvbHV0ZSBwYXRoLCBidXRcbiAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzIHRvIGJlIHNhZmUgKG1pZ2h0IGhhcHBlbiB3aGVuIHByb2Nlc3MuY3dkKCkgZmFpbHMpXG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHJlc29sdmVkUGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihyZXNvbHZlZFBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhcmVzb2x2ZWRBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIHJldHVybiAoKHJlc29sdmVkQWJzb2x1dGUgPyAnLycgOiAnJykgKyByZXNvbHZlZFBhdGgpIHx8ICcuJztcbn07XG5cbi8vIHBhdGgubm9ybWFsaXplKHBhdGgpXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIGlzQWJzb2x1dGUgPSBleHBvcnRzLmlzQWJzb2x1dGUocGF0aCksXG4gICAgICB0cmFpbGluZ1NsYXNoID0gc3Vic3RyKHBhdGgsIC0xKSA9PT0gJy8nO1xuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICBwYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhaXNBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIGlmICghcGF0aCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgIHBhdGggPSAnLic7XG4gIH1cbiAgaWYgKHBhdGggJiYgdHJhaWxpbmdTbGFzaCkge1xuICAgIHBhdGggKz0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIChpc0Fic29sdXRlID8gJy8nIDogJycpICsgcGF0aDtcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguY2hhckF0KDApID09PSAnLyc7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmpvaW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIGV4cG9ydHMubm9ybWFsaXplKGZpbHRlcihwYXRocywgZnVuY3Rpb24ocCwgaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5qb2luIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH1cbiAgICByZXR1cm4gcDtcbiAgfSkuam9pbignLycpKTtcbn07XG5cblxuLy8gcGF0aC5yZWxhdGl2ZShmcm9tLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVsYXRpdmUgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICBmcm9tID0gZXhwb3J0cy5yZXNvbHZlKGZyb20pLnN1YnN0cigxKTtcbiAgdG8gPSBleHBvcnRzLnJlc29sdmUodG8pLnN1YnN0cigxKTtcblxuICBmdW5jdGlvbiB0cmltKGFycikge1xuICAgIHZhciBzdGFydCA9IDA7XG4gICAgZm9yICg7IHN0YXJ0IDwgYXJyLmxlbmd0aDsgc3RhcnQrKykge1xuICAgICAgaWYgKGFycltzdGFydF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICB2YXIgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgZm9yICg7IGVuZCA+PSAwOyBlbmQtLSkge1xuICAgICAgaWYgKGFycltlbmRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0ID4gZW5kKSByZXR1cm4gW107XG4gICAgcmV0dXJuIGFyci5zbGljZShzdGFydCwgZW5kIC0gc3RhcnQgKyAxKTtcbiAgfVxuXG4gIHZhciBmcm9tUGFydHMgPSB0cmltKGZyb20uc3BsaXQoJy8nKSk7XG4gIHZhciB0b1BhcnRzID0gdHJpbSh0by5zcGxpdCgnLycpKTtcblxuICB2YXIgbGVuZ3RoID0gTWF0aC5taW4oZnJvbVBhcnRzLmxlbmd0aCwgdG9QYXJ0cy5sZW5ndGgpO1xuICB2YXIgc2FtZVBhcnRzTGVuZ3RoID0gbGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGZyb21QYXJ0c1tpXSAhPT0gdG9QYXJ0c1tpXSkge1xuICAgICAgc2FtZVBhcnRzTGVuZ3RoID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvdXRwdXRQYXJ0cyA9IFtdO1xuICBmb3IgKHZhciBpID0gc2FtZVBhcnRzTGVuZ3RoOyBpIDwgZnJvbVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0cHV0UGFydHMucHVzaCgnLi4nKTtcbiAgfVxuXG4gIG91dHB1dFBhcnRzID0gb3V0cHV0UGFydHMuY29uY2F0KHRvUGFydHMuc2xpY2Uoc2FtZVBhcnRzTGVuZ3RoKSk7XG5cbiAgcmV0dXJuIG91dHB1dFBhcnRzLmpvaW4oJy8nKTtcbn07XG5cbmV4cG9ydHMuc2VwID0gJy8nO1xuZXhwb3J0cy5kZWxpbWl0ZXIgPSAnOic7XG5cbmV4cG9ydHMuZGlybmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIHJlc3VsdCA9IHNwbGl0UGF0aChwYXRoKSxcbiAgICAgIHJvb3QgPSByZXN1bHRbMF0sXG4gICAgICBkaXIgPSByZXN1bHRbMV07XG5cbiAgaWYgKCFyb290ICYmICFkaXIpIHtcbiAgICAvLyBObyBkaXJuYW1lIHdoYXRzb2V2ZXJcbiAgICByZXR1cm4gJy4nO1xuICB9XG5cbiAgaWYgKGRpcikge1xuICAgIC8vIEl0IGhhcyBhIGRpcm5hbWUsIHN0cmlwIHRyYWlsaW5nIHNsYXNoXG4gICAgZGlyID0gZGlyLnN1YnN0cigwLCBkaXIubGVuZ3RoIC0gMSk7XG4gIH1cblxuICByZXR1cm4gcm9vdCArIGRpcjtcbn07XG5cblxuZXhwb3J0cy5iYXNlbmFtZSA9IGZ1bmN0aW9uKHBhdGgsIGV4dCkge1xuICB2YXIgZiA9IHNwbGl0UGF0aChwYXRoKVsyXTtcbiAgLy8gVE9ETzogbWFrZSB0aGlzIGNvbXBhcmlzb24gY2FzZS1pbnNlbnNpdGl2ZSBvbiB3aW5kb3dzP1xuICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBmO1xufTtcblxuXG5leHBvcnRzLmV4dG5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBzcGxpdFBhdGgocGF0aClbM107XG59O1xuXG5mdW5jdGlvbiBmaWx0ZXIgKHhzLCBmKSB7XG4gICAgaWYgKHhzLmZpbHRlcikgcmV0dXJuIHhzLmZpbHRlcihmKTtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZih4c1tpXSwgaSwgeHMpKSByZXMucHVzaCh4c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbi8vIFN0cmluZy5wcm90b3R5cGUuc3Vic3RyIC0gbmVnYXRpdmUgaW5kZXggZG9uJ3Qgd29yayBpbiBJRThcbnZhciBzdWJzdHIgPSAnYWInLnN1YnN0cigtMSkgPT09ICdiJ1xuICAgID8gZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikgeyByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKSB9XG4gICAgOiBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gc3RyLmxlbmd0aCArIHN0YXJ0O1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9XG47XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMTZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUgNiA3IDggOSAxMCAxMVxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9zcmMvYXVkaW8tbWFuYWdlcicpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcG90aW9uLWF1ZGlvL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMTdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUgNiA3IDggOSAxMCAxMVxuICoqLyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gdHJ1ZTtcbiAgICB2YXIgY3VycmVudFF1ZXVlO1xuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgICAgICAgICBjdXJyZW50UXVldWVbaV0oKTtcbiAgICAgICAgfVxuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG59XG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHF1ZXVlLnB1c2goZnVuKTtcbiAgICBpZiAoIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vcHJvY2Vzcy9icm93c2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMThcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUgNiA3IDggOSAxMCAxMVxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qc1xuICoqIG1vZHVsZSBpZCA9IDE5XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IDYgNyA4IDkgMTAgMTFcbiAqKi8iLCJ2YXIgTG9hZGVkQXVkaW8gPSByZXF1aXJlKCcuL2xvYWRlZC1hdWRpbycpO1xuXG52YXIgQXVkaW9NYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG4gIHZhciBBdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG5cbiAgdGhpcy5jdHggPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gIHRoaXMubWFzdGVyR2FpbiA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5fdm9sdW1lID0gMTtcblxuICB2YXIgaU9TID0gLyhpUGFkfGlQaG9uZXxpUG9kKS9nLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gIGlmIChpT1MpIHtcbiAgICB0aGlzLl9lbmFibGVpT1MoKTtcbiAgfVxufTtcblxuQXVkaW9NYW5hZ2VyLnByb3RvdHlwZS5fZW5hYmxlaU9TID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgdG91Y2ggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnVmZmVyID0gc2VsZi5jdHguY3JlYXRlQnVmZmVyKDEsIDEsIDIyMDUwKTtcbiAgICB2YXIgc291cmNlID0gc2VsZi5jdHguY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgc291cmNlLmJ1ZmZlciA9IGJ1ZmZlcjtcbiAgICBzb3VyY2UuY29ubmVjdChzZWxmLmN0eC5kZXN0aW5hdGlvbik7XG4gICAgc291cmNlLnN0YXJ0KDApO1xuXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0b3VjaCwgZmFsc2UpO1xuICB9O1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdG91Y2gsIGZhbHNlKTtcbn07XG5cbkF1ZGlvTWFuYWdlci5wcm90b3R5cGUuc2V0Vm9sdW1lID0gZnVuY3Rpb24odm9sdW1lKSB7XG4gIHRoaXMuX3ZvbHVtZSA9IHZvbHVtZTtcbiAgdGhpcy5tYXN0ZXJHYWluLmdhaW4udmFsdWUgPSB2b2x1bWU7XG59O1xuXG5BdWRpb01hbmFnZXIucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbih1cmwsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcbiAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBzZWxmLmRlY29kZUF1ZGlvRGF0YShyZXF1ZXN0LnJlc3BvbnNlLCBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIGNhbGxiYWNrKHNvdXJjZSk7XG4gICAgfSk7XG4gIH07XG4gIHJlcXVlc3Quc2VuZCgpO1xufTtcblxuQXVkaW9NYW5hZ2VyLnByb3RvdHlwZS5kZWNvZGVBdWRpb0RhdGEgPSBmdW5jdGlvbihkYXRhLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdGhpcy5jdHguZGVjb2RlQXVkaW9EYXRhKGRhdGEsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgIHZhciBhdWRpbyA9IG5ldyBMb2FkZWRBdWRpbyhzZWxmLmN0eCwgcmVzdWx0LCBzZWxmLm1hc3RlckdhaW4pO1xuXG4gICAgY2FsbGJhY2soYXVkaW8pO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXVkaW9NYW5hZ2VyO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcG90aW9uLWF1ZGlvL3NyYy9hdWRpby1tYW5hZ2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUgNiA3IDggOSAxMCAxMVxuICoqLyIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3V0aWwvfi9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUgNiA3IDggOSAxMCAxMVxuICoqLyIsInZhciBQbGF5aW5nQXVkaW8gPSByZXF1aXJlKCcuL3BsYXlpbmctYXVkaW8nKTtcblxudmFyIExvYWRlZEF1ZGlvID0gZnVuY3Rpb24oY3R4LCBidWZmZXIsIG1hc3RlckdhaW4pIHtcbiAgdGhpcy5fY3R4ID0gY3R4O1xuICB0aGlzLl9tYXN0ZXJHYWluID0gbWFzdGVyR2FpbjtcbiAgdGhpcy5fYnVmZmVyID0gYnVmZmVyO1xuICB0aGlzLl9idWZmZXIubG9vcCA9IGZhbHNlO1xufTtcblxuTG9hZGVkQXVkaW8ucHJvdG90eXBlLl9jcmVhdGVTb3VuZCA9IGZ1bmN0aW9uKGdhaW4pIHtcbiAgdmFyIHNvdXJjZSA9IHRoaXMuX2N0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbiAgc291cmNlLmJ1ZmZlciA9IHRoaXMuX2J1ZmZlcjtcblxuICB0aGlzLl9tYXN0ZXJHYWluLmNvbm5lY3QodGhpcy5fY3R4LmRlc3RpbmF0aW9uKTtcblxuICBnYWluLmNvbm5lY3QodGhpcy5fbWFzdGVyR2Fpbik7XG5cbiAgc291cmNlLmNvbm5lY3QoZ2Fpbik7XG5cbiAgcmV0dXJuIHNvdXJjZTtcbn07XG5cbkxvYWRlZEF1ZGlvLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBnYWluID0gdGhpcy5fY3R4LmNyZWF0ZUdhaW4oKTtcblxuICB2YXIgc291bmQgPSB0aGlzLl9jcmVhdGVTb3VuZChnYWluKTtcblxuICBzb3VuZC5zdGFydCgwKTtcblxuICByZXR1cm4gbmV3IFBsYXlpbmdBdWRpbyhzb3VuZCwgZ2Fpbik7XG59O1xuXG5Mb2FkZWRBdWRpby5wcm90b3R5cGUuZmFkZUluID0gZnVuY3Rpb24odmFsdWUsIHRpbWUpIHtcbiAgdmFyIGdhaW4gPSB0aGlzLl9jdHguY3JlYXRlR2FpbigpO1xuXG4gIHZhciBzb3VuZCA9IHRoaXMuX2NyZWF0ZVNvdW5kKGdhaW4pO1xuXG4gIGdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCAwKTtcbiAgZ2Fpbi5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAuMDEsIDApO1xuICBnYWluLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUodmFsdWUsIHRpbWUpO1xuXG4gIHNvdW5kLnN0YXJ0KDApO1xuXG4gIHJldHVybiBuZXcgUGxheWluZ0F1ZGlvKHNvdW5kLCBnYWluKTtcbn07XG5cbkxvYWRlZEF1ZGlvLnByb3RvdHlwZS5sb29wID0gZnVuY3Rpb24oKSB7XG4gIHZhciBnYWluID0gdGhpcy5fY3R4LmNyZWF0ZUdhaW4oKTtcblxuICB2YXIgc291bmQgPSB0aGlzLl9jcmVhdGVTb3VuZChnYWluKTtcblxuICBzb3VuZC5sb29wID0gdHJ1ZTtcbiAgc291bmQuc3RhcnQoMCk7XG5cbiAgcmV0dXJuIG5ldyBQbGF5aW5nQXVkaW8oc291bmQsIGdhaW4pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2FkZWRBdWRpbztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3BvdGlvbi1hdWRpby9zcmMvbG9hZGVkLWF1ZGlvLmpzXG4gKiogbW9kdWxlIGlkID0gMjJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUgNiA3IDggOSAxMCAxMVxuICoqLyIsInZhciBQbGF5aW5nQXVkaW8gPSBmdW5jdGlvbihzb3VyY2UsIGdhaW4pIHtcbiAgdGhpcy5fZ2FpbiA9IGdhaW47XG4gIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcbn07XG5cblBsYXlpbmdBdWRpby5wcm90b3R5cGUuc2V0Vm9sdW1lID0gZnVuY3Rpb24odm9sdW1lKSB7XG4gIHRoaXMuX2dhaW4uZ2Fpbi52YWx1ZSA9IHZvbHVtZTtcbn07XG5cblBsYXlpbmdBdWRpby5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9zb3VyY2Uuc3RvcCgwKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWluZ0F1ZGlvO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcG90aW9uLWF1ZGlvL3NyYy9wbGF5aW5nLWF1ZGlvLmpzXG4gKiogbW9kdWxlIGlkID0gMjNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUgNiA3IDggOSAxMCAxMVxuICoqLyJdLCJzb3VyY2VSb290IjoiIiwiZmlsZSI6IjAwLXNldHVwLmpzIn0=