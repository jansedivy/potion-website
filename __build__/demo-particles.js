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
	  configure: function configure() {
	    this.setSize(document.body.clientWidth, document.body.clientHeight);
	  },
	
	  init: function init() {
	    this.particles = [];
	    this.lastPosition = { x: null, y: null };
	  },
	
	  mousemove: function mousemove(x, y) {
	    if (this.lastPosition.x && this.lastPosition.y) {
	      var dx = (x - this.lastPosition.x) * 20;
	      var dy = (y - this.lastPosition.y) * 20;
	      this.particles.push(new Particle(x, y, dx, dy));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzhlMzljZGFjMTVmOGM2NzMzOTk/OWMxOSoqKioqKioqIiwid2VicGFjazovLy8uL2V4YW1wbGVzL2RlbW8tcGFydGljbGVzL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcz8yNjQ1KioqKioqKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VuZ2luZS5qcz82M2E2KioqKioqKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JhZi1wb2x5ZmlsbC5qcz9iY2FkKioqKioqKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dhbWUuanM/YzdlZioqKioqKioqIiwid2VicGFjazovLy8uL3NyYy90aW1lLmpzP2UxMjAqKioqKioqKiIsIndlYnBhY2s6Ly8vLi9zcmMvc3RhdGUtbWFuYWdlci5qcz9kYTNlKioqKioqKioiLCJ3ZWJwYWNrOi8vLy4vfi9wb3Rpb24tZGVidWdnZXIvaW5kZXguanM/NjVkYyoqKioqKioqIiwid2VicGFjazovLy8uL3NyYy92aWRlby5qcz9kNTQ1KioqKioqKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy5qcz80ODIyKioqKioqKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL2lucHV0LmpzP2YwOGYqKioqKioqKiIsIndlYnBhY2s6Ly8vLi9+L3BvdGlvbi1kZWJ1Z2dlci9kaXJ0eS1tYW5hZ2VyLmpzPzA3ODMqKioqKioqKiIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi91dGlsL3V0aWwuanM/NzQ3ZSoqKioqKioqIiwid2VicGFjazovLy8uL3NyYy9yZXRpbmEuanM/YmIyZCoqKioqKioqIiwid2VicGFjazovLy8uL3NyYy91dGlscy5qcz8yZmY4KioqKioqKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tleXMuanM/NzBlYSoqKioqKioqIiwid2VicGFjazovLy8od2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3BhdGgtYnJvd3NlcmlmeS9pbmRleC5qcz84NjgwKioqKioqKioiLCJ3ZWJwYWNrOi8vLy4vfi9wb3Rpb24tYXVkaW8vaW5kZXguanM/OGZhZSoqKioqKioqIiwid2VicGFjazovLy8od2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3Byb2Nlc3MvYnJvd3Nlci5qcz82ZjBlKioqKioqKioiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcz8yMzlkKioqKioqKioiLCJ3ZWJwYWNrOi8vLy4vfi9wb3Rpb24tYXVkaW8vc3JjL2F1ZGlvLW1hbmFnZXIuanM/ZTEzOCoqKioqKioqIiwid2VicGFjazovLy8od2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3V0aWwvfi9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzPzFjM2YqKioqKioqKiIsIndlYnBhY2s6Ly8vLi9+L3BvdGlvbi1hdWRpby9zcmMvbG9hZGVkLWF1ZGlvLmpzPzJjYjgqKioqKioqKiIsIndlYnBhY2s6Ly8vLi9+L3BvdGlvbi1hdWRpby9zcmMvcGxheWluZy1hdWRpby5qcz9mOTgyKioqKioqKioiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esd0M7Ozs7Ozs7OztBQ3RDQSxLQUFJLE1BQU0sR0FBRyxtQkFBTyxDQUFDLENBQVEsQ0FBQyxDQUFDOztBQUUvQixLQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDckQsWUFBUyxFQUFFLHFCQUFXO0FBQ3BCLFNBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxX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QUFDLElBQUksR0FBRyxxQkFBcUIsQ0FBQztBQUM1QyxTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0FBQ3BDLFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUM7O0FBRXZDLFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxvQkFBb0IsQ0FBQztBQUNoRCxTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFMUQsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUNyQyxTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUV0RCxTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztBQUMvRCxTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUVsRCxTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQzNCLFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsS0FBSyxHQUFHLEVBQUUsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDNUQsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDM0IsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7O0FBRXhCLFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsb0JBQW9CLENBQUM7QUFDN0UsU0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDOztBQUVyRSxTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDOztBQUUzQixTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3hELFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNyQyxTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNuRCxTQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7O0FBRXRFLFNBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0s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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLHNCQUFzQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSCx3QkFBdUIsU0FBUztBQUNoQztBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsT0FBTztBQUNsQixZQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw2Q0FBNEMsS0FBSzs7QUFFakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLG9DQUFtQyxPQUFPO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSwwREFBeUQ7QUFDekQ7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXO0FBQ1gsVUFBUztBQUNUO0FBQ0E7QUFDQSxZQUFXO0FBQ1g7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLFNBQVM7QUFDcEI7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RTtBQUNOLE1BQUksRUFBRTtBQUNOLE1BQUksRUFBRTtBQUNOLE1BQUksRUFBRTtBQUNOLE1BQUksRUFBRTtBQUNOLE1BQUksRUFBRTtBQUNOLE1BQUksRUFBRTtBQUNOLE1BQUksRUFBRTtBQUNOLE1BQUksRUFBRTtBQUNOLGFBQVcsRUFBRTtBQUNiLGFBQVcsRUFBRTtBQUNiLGFBQVcsRUFBRTtBQUNiLGFBQVcsRUFBRTtBQUNiLGFBQVcsR0FBRztBQUNkLGFBQVcsR0FBRztBQUNkLGFBQVcsR0FBRztBQUNkLGFBQVcsR0FBRztBQUNkLGFBQVcsR0FBRztBQUNkLGFBQVcsR0FBRztBQUNkLGFBQVcsR0FBRztBQUNkLFFBQU0sR0FBRztBQUNULGNBQVksR0FBRztBQUNmLFlBQVUsR0FBRztBQUNiLFdBQVMsR0FBRztBQUNaLE9BQUssR0FBRztBQUNSLE9BQUssR0FBRztBQUNSLE9BQUssR0FBRztBQUNSLE9BQUssR0FBRztBQUNSLE9BQUssR0FBRztBQUNSLE9BQUssR0FBRztBQUNSLE9BQUssR0FBRztBQUNSLE9BQUssR0FBRztBQUNSLE9BQUssR0FBRztBQUNSLFFBQU0sR0FBRztBQUNULFFBQU0sR0FBRztBQUNULFFBQU0sR0FBRztBQUNULFVBQVEsRUFBRTtBQUNWLFNBQU8sRUFBRTtBQUNULFFBQU0sRUFBRTtBQUNSLFNBQU8sR0FBRztBQUNWLFVBQVEsR0FBRztBQUNYLFVBQVEsR0FBRztBQUNYLFdBQVMsR0FBRztFQUNiLEM7Ozs7OztBQzVGRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWdDLFFBQVE7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVUsTUFBTTtBQUNoQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4QkFBNkIsSUFBSTtBQUNqQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBb0MsOEJBQThCO0FBQ2xFOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVSxvQkFBb0I7QUFDOUI7QUFDQTs7QUFFQTtBQUNBLFdBQVUsVUFBVTtBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBaUIsWUFBWTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0NBQStCLHNCQUFzQjtBQUNyRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLGVBQWU7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1DQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQy9OQTs7Ozs7OztBQ0FBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNEJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLDZCQUE0QixVQUFVOzs7Ozs7O0FDekR0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRTs7Ozs7O0FDTEE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLElBQUc7QUFDSDs7QUFFQTs7Ozs7OztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0EsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3RCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9fX2J1aWxkX18vXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgMzhlMzljZGFjMTVmOGM2NzMzOTlcbiAqKi8iLCJ2YXIgUG90aW9uID0gcmVxdWlyZSgncG90aW9uJyk7XG5cbnZhciBhcHAgPSBQb3Rpb24uaW5pdChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZScpLCB7XG4gIGNvbmZpZ3VyZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTaXplKGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGgsIGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0KTtcbiAgfSxcblxuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhcnRpY2xlcyA9IFtdO1xuICAgIHRoaXMubGFzdFBvc2l0aW9uID0geyB4OiBudWxsLCB5OiBudWxsIH07XG4gIH0sXG5cbiAgbW91c2Vtb3ZlOiBmdW5jdGlvbih4LCB5KSB7XG4gICAgaWYgKHRoaXMubGFzdFBvc2l0aW9uLnggJiYgdGhpcy5sYXN0UG9zaXRpb24ueSkge1xuICAgICAgdmFyIGR4ID0gKHggLSB0aGlzLmxhc3RQb3NpdGlvbi54KSAqIDIwO1xuICAgICAgdmFyIGR5ID0gKHkgLSB0aGlzLmxhc3RQb3NpdGlvbi55KSAqIDIwO1xuICAgICAgdGhpcy5wYXJ0aWNsZXMucHVzaChuZXcgUGFydGljbGUoeCwgeSwgZHgsIGR5KSk7XG4gICAgfVxuXG4gICAgdGhpcy5sYXN0UG9zaXRpb24ueCA9IHRoaXMuaW5wdXQubW91c2UueDtcbiAgICB0aGlzLmxhc3RQb3NpdGlvbi55ID0gdGhpcy5pbnB1dC5tb3VzZS55O1xuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24odGltZSkge1xuICAgIGZvciAodmFyIGk9MCwgbGVuPXRoaXMucGFydGljbGVzLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgICAgdmFyIHBhcnRpY2xlID0gdGhpcy5wYXJ0aWNsZXNbaV07XG4gICAgICBpZiAocGFydGljbGUpIHsgcGFydGljbGUudXBkYXRlKHRpbWUpOyB9XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy5wYXJ0aWNsZXMubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgICB2YXIgcGFydGljbGUgPSB0aGlzLnBhcnRpY2xlc1tpXTtcbiAgICAgIGlmIChwYXJ0aWNsZSkgeyBwYXJ0aWNsZS5yZW5kZXIoKTsgfVxuICAgIH1cbiAgfVxufSk7XG5cbnZhciBQYXJ0aWNsZSA9IGZ1bmN0aW9uKHgsIHksIGR4LCBkeSkge1xuICB0aGlzLnggPSB4O1xuICB0aGlzLnkgPSB5O1xuICB0aGlzLnIgPSBNYXRoLnJhbmRvbSgpICogMjAgKyA1O1xuICB0aGlzLmR4ID0gZHg7XG4gIHRoaXMuZHkgPSBkeTtcblxuICB2YXIgY29sb3JzID0gWycjMDQ4MTllJywgJyMzOGIyY2UnLCAnIzYwYjljZScsICcjMDE1MzY3JywgJyNmZjk5MDAnXTtcbiAgdGhpcy5jb2xvciA9IGNvbG9yc1tNYXRoLmZsb29yKGNvbG9ycy5sZW5ndGggKiBNYXRoLnJhbmRvbSgpKV07XG59O1xuXG5QYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICB0aGlzLmR4ID0gdGhpcy5keCArICgwIC0gdGhpcy5keCkgKiB0aW1lO1xuICB0aGlzLmR5ID0gdGhpcy5keSArICgwIC0gdGhpcy5keSkgKiB0aW1lO1xuXG4gIHRoaXMuciA9IHRoaXMuciArICgwIC0gdGhpcy5yKSAqIHRpbWU7XG5cbiAgaWYgKHRoaXMuciA8PSAwLjUpIHtcbiAgICBhcHAucGFydGljbGVzLnNwbGljZShhcHAucGFydGljbGVzLmluZGV4T2YodGhpcyksIDEpO1xuICB9XG5cbiAgdGhpcy54ICs9IHRoaXMuZHggKiB0aW1lO1xuICB0aGlzLnkgKz0gdGhpcy5keSAqIHRpbWU7XG59O1xuXG5QYXJ0aWNsZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gIGFwcC52aWRlby5jdHguYmVnaW5QYXRoKCk7XG4gIGFwcC52aWRlby5jdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLnIsIDAsIE1hdGguUEkqMiwgZmFsc2UpO1xuICBhcHAudmlkZW8uY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5jb2xvcjtcbiAgYXBwLnZpZGVvLmN0eC5zdHJva2UoKTtcbiAgYXBwLnZpZGVvLmN0eC5jbG9zZVBhdGgoKTtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2V4YW1wbGVzL2RlbW8tcGFydGljbGVzL2FwcC5qc1xuICoqLyIsInZhciBFbmdpbmUgPSByZXF1aXJlKCcuL3NyYy9lbmdpbmUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKGNhbnZhcywgbWV0aG9kcykge1xuICAgIHZhciBlbmdpbmUgPSBuZXcgRW5naW5lKGNhbnZhcywgbWV0aG9kcyk7XG4gICAgcmV0dXJuIGVuZ2luZS5nYW1lO1xuICB9XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9pbmRleC5qc1xuICoqLyIsInJlcXVpcmUoJy4vcmFmLXBvbHlmaWxsJykoKTtcblxudmFyIEdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKTtcblxudmFyIFRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKTtcblxudmFyIERlYnVnZ2VyID0gcmVxdWlyZSgncG90aW9uLWRlYnVnZ2VyJyk7XG5cbnZhciBTdGF0ZU1hbmFnZXIgPSByZXF1aXJlKCcuL3N0YXRlLW1hbmFnZXInKTtcblxuLyoqXG4gKiBNYWluIEVuZ2luZSBjbGFzcyB3aGljaCBjYWxscyB0aGUgZ2FtZSBtZXRob2RzXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIEVuZ2luZSA9IGZ1bmN0aW9uKGNvbnRhaW5lciwgbWV0aG9kcykge1xuICB2YXIgR2FtZUNsYXNzID0gdGhpcy5fc3ViY2xhc3NHYW1lKGNvbnRhaW5lciwgbWV0aG9kcyk7XG5cbiAgY29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcblxuICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gIGNhbnZhcy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNhbnZhcyk7XG5cbiAgdGhpcy5nYW1lID0gbmV3IEdhbWVDbGFzcyhjYW52YXMpO1xuICB0aGlzLmdhbWUuZGVidWcgPSBuZXcgRGVidWdnZXIodGhpcy5nYW1lKTtcblxuICB0aGlzLl9zZXREZWZhdWx0U3RhdGVzKCk7XG5cbiAgdGhpcy50aWNrRnVuYyA9IChmdW5jdGlvbiAoc2VsZikgeyByZXR1cm4gZnVuY3Rpb24oKSB7IHNlbGYudGljaygpOyB9OyB9KSh0aGlzKTtcbiAgdGhpcy5wcmVsb2FkZXJUaWNrRnVuYyA9IChmdW5jdGlvbiAoc2VsZikgeyByZXR1cm4gZnVuY3Rpb24oKSB7IHNlbGYuX3ByZWxvYWRlclRpY2soKTsgfTsgfSkodGhpcyk7XG5cbiAgdGhpcy5zdHJheVRpbWUgPSAwO1xuXG4gIHRoaXMuX3RpbWUgPSBUaW1lLm5vdygpO1xuXG4gIHRoaXMuZ2FtZS5hc3NldHMub25sb2FkKGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc3RhcnQoKTtcblxuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnByZWxvYWRlcklkKTtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGlja0Z1bmMpO1xuICB9LmJpbmQodGhpcykpO1xuXG4gIGlmICh0aGlzLmdhbWUuYXNzZXRzLmlzTG9hZGluZykge1xuICAgIHRoaXMucHJlbG9hZGVySWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucHJlbG9hZGVyVGlja0Z1bmMpO1xuICB9XG59O1xuXG4vKipcbiAqIEFkZCBldmVudCBsaXN0ZW5lciBmb3Igd2luZG93IGV2ZW50c1xuICogQHByaXZhdGVcbiAqL1xuRW5naW5lLnByb3RvdHlwZS5hZGRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciBnYW1lID0gc2VsZi5nYW1lO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uKCkge1xuICAgIHNlbGYuZ2FtZS5pbnB1dC5yZXNldEtleXMoKTtcbiAgICBzZWxmLmdhbWUuYmx1cigpO1xuICB9KTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbigpIHtcbiAgICBzZWxmLmdhbWUuaW5wdXQucmVzZXRLZXlzKCk7XG4gICAgc2VsZi5nYW1lLmZvY3VzKCk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBTdGFydHMgdGhlIGdhbWUsIGFkZHMgZXZlbnRzIGFuZCBydW4gZmlyc3QgZnJhbWVcbiAqIEBwcml2YXRlXG4gKi9cbkVuZ2luZS5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuZ2FtZS5jb25maWcuYWRkSW5wdXRFdmVudHMpIHtcbiAgICB0aGlzLmFkZEV2ZW50cygpO1xuICB9XG59O1xuXG4vKipcbiAqIE1haW4gdGljayBmdW5jdGlvbiBpbiBnYW1lIGxvb3BcbiAqIEBwcml2YXRlXG4gKi9cbkVuZ2luZS5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKCkge1xuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGlja0Z1bmMpO1xuXG4gIHZhciBub3cgPSBUaW1lLm5vdygpO1xuICB2YXIgdGltZSA9IChub3cgLSB0aGlzLl90aW1lKSAvIDEwMDA7XG4gIHRoaXMuX3RpbWUgPSBub3c7XG5cbiAgdGhpcy51cGRhdGUodGltZSk7XG4gIHRoaXMuZ2FtZS5zdGF0ZXMuZXhpdFVwZGF0ZSh0aW1lKTtcbiAgdGhpcy5yZW5kZXIoKTtcbn07XG5cbi8qKlxuICogVXBkYXRlcyB0aGUgZ2FtZVxuICogQHBhcmFtIHtudW1iZXJ9IHRpbWUgLSB0aW1lIGluIHNlY29uZHMgc2luY2UgbGFzdCBmcmFtZVxuICogQHByaXZhdGVcbiAqL1xuRW5naW5lLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbih0aW1lKSB7XG4gIGlmICh0aW1lID4gdGhpcy5nYW1lLmNvbmZpZy5tYXhTdGVwVGltZSkgeyB0aW1lID0gdGhpcy5nYW1lLmNvbmZpZy5tYXhTdGVwVGltZTsgfVxuXG4gIGlmICh0aGlzLmdhbWUuY29uZmlnLmZpeGVkU3RlcCkge1xuICAgIHRoaXMuc3RyYXlUaW1lID0gdGhpcy5zdHJheVRpbWUgKyB0aW1lO1xuICAgIHdoaWxlICh0aGlzLnN0cmF5VGltZSA+PSB0aGlzLmdhbWUuY29uZmlnLnN0ZXBUaW1lKSB7XG4gICAgICB0aGlzLnN0cmF5VGltZSA9IHRoaXMuc3RyYXlUaW1lIC0gdGhpcy5nYW1lLmNvbmZpZy5zdGVwVGltZTtcbiAgICAgIHRoaXMuZ2FtZS5zdGF0ZXMudXBkYXRlKHRoaXMuZ2FtZS5jb25maWcuc3RlcFRpbWUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLmdhbWUuc3RhdGVzLnVwZGF0ZSh0aW1lKTtcbiAgfVxufTtcblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBnYW1lXG4gKiBAcHJpdmF0ZVxuICovXG5FbmdpbmUucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmdhbWUudmlkZW8uYmVnaW5GcmFtZSgpO1xuXG4gIHRoaXMuZ2FtZS52aWRlby5jbGVhcigpO1xuXG4gIHRoaXMuZ2FtZS5zdGF0ZXMucmVuZGVyKCk7XG5cbiAgdGhpcy5nYW1lLnZpZGVvLmVuZEZyYW1lKCk7XG59O1xuXG4vKipcbiAqIE1haW4gdGljayBmdW5jdGlvbiBpbiBwcmVsb2FkZXIgbG9vcFxuICogQHByaXZhdGVcbiAqL1xuRW5naW5lLnByb3RvdHlwZS5fcHJlbG9hZGVyVGljayA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnByZWxvYWRlcklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnByZWxvYWRlclRpY2tGdW5jKTtcblxuICB2YXIgbm93ID0gVGltZS5ub3coKTtcbiAgdmFyIHRpbWUgPSAobm93IC0gdGhpcy5fdGltZSkgLyAxMDAwO1xuICB0aGlzLl90aW1lID0gbm93O1xuXG4gIGlmICh0aGlzLmdhbWUuY29uZmlnLnNob3dQcmVsb2FkZXIpIHtcbiAgICB0aGlzLmdhbWUudmlkZW8uY2xlYXIoKTtcbiAgICB0aGlzLmdhbWUucHJlbG9hZGluZyh0aW1lKTtcbiAgfVxufTtcblxuRW5naW5lLnByb3RvdHlwZS5fc2V0RGVmYXVsdFN0YXRlcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc3RhdGVzID0gbmV3IFN0YXRlTWFuYWdlcigpO1xuICBzdGF0ZXMuYWRkKCdhcHAnLCB0aGlzLmdhbWUpO1xuICBzdGF0ZXMuYWRkKCdkZWJ1ZycsIHRoaXMuZ2FtZS5kZWJ1Zyk7XG5cbiAgc3RhdGVzLnByb3RlY3QoJ2FwcCcpO1xuICBzdGF0ZXMucHJvdGVjdCgnZGVidWcnKTtcblxuICB0aGlzLmdhbWUuc3RhdGVzID0gc3RhdGVzO1xufTtcblxuRW5naW5lLnByb3RvdHlwZS5fc3ViY2xhc3NHYW1lID0gZnVuY3Rpb24oY29udGFpbmVyLCBtZXRob2RzKSB7XG4gIHZhciBHYW1lQ2xhc3MgPSBmdW5jdGlvbihjb250YWluZXIpIHtcbiAgICBHYW1lLmNhbGwodGhpcywgY29udGFpbmVyKTtcbiAgfTtcblxuICBHYW1lQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHYW1lLnByb3RvdHlwZSk7XG5cbiAgZm9yICh2YXIgbWV0aG9kIGluIG1ldGhvZHMpIHtcbiAgICBHYW1lQ2xhc3MucHJvdG90eXBlW21ldGhvZF0gPSBtZXRob2RzW21ldGhvZF07XG4gIH1cblxuICByZXR1cm4gR2FtZUNsYXNzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFbmdpbmU7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbmdpbmUuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbGFzdFRpbWUgPSAwO1xuICB2YXIgdmVuZG9ycyA9IFsnbXMnLCAnbW96JywgJ3dlYmtpdCcsICdvJ107XG5cbiAgZm9yICh2YXIgaT0wOyBpPHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK2kpIHtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbaV0rJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW2ldKydDYW5jZWxBbmltYXRpb25GcmFtZSddIHx8IHdpbmRvd1t2ZW5kb3JzW2ldKydDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgfVxuXG4gIGlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcblxuICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7XG4gICAgICB9LCB0aW1lVG9DYWxsKTtcblxuICAgICAgbGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGw7XG4gICAgICByZXR1cm4gaWQ7XG4gICAgfTtcbiAgfVxuXG4gIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oaWQpIHsgY2xlYXJUaW1lb3V0KGlkKTsgfTtcbiAgfVxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JhZi1wb2x5ZmlsbC5qc1xuICoqLyIsInZhciBWaWRlbyA9IHJlcXVpcmUoJy4vdmlkZW8nKTtcbnZhciBBc3NldHMgPSByZXF1aXJlKCcuL2Fzc2V0cycpO1xudmFyIElucHV0ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xuXG52YXIgR2FtZSA9IGZ1bmN0aW9uKGNhbnZhcykge1xuICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcblxuICB0aGlzLndpZHRoID0gMzAwO1xuXG4gIHRoaXMuaGVpZ2h0ID0gMzAwO1xuXG4gIHRoaXMuYXNzZXRzID0gbmV3IEFzc2V0cygpO1xuXG4gIHRoaXMuc3RhdGVzID0gbnVsbDtcbiAgdGhpcy5kZWJ1ZyA9IG51bGw7XG4gIHRoaXMuaW5wdXQgPSBudWxsO1xuICB0aGlzLnZpZGVvID0gbnVsbDtcblxuICB0aGlzLmNvbmZpZyA9IHtcbiAgICB1c2VSZXRpbmE6IHRydWUsXG4gICAgaW5pdGlhbGl6ZUNhbnZhczogdHJ1ZSxcbiAgICBpbml0aWFsaXplVmlkZW86IHRydWUsXG4gICAgYWRkSW5wdXRFdmVudHM6IHRydWUsXG4gICAgc2hvd1ByZWxvYWRlcjogdHJ1ZSxcbiAgICBmaXhlZFN0ZXA6IGZhbHNlLFxuICAgIHN0ZXBUaW1lOiAwLjAxNjY2LFxuICAgIG1heFN0ZXBUaW1lOiAwLjAxNjY2XG4gIH07XG5cbiAgdGhpcy5jb25maWd1cmUoKTtcblxuICBpZiAodGhpcy5jb25maWcuaW5pdGlhbGl6ZVZpZGVvKSB7XG4gICAgdGhpcy52aWRlbyA9IG5ldyBWaWRlbyh0aGlzLCBjYW52YXMsIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGlmICh0aGlzLmNvbmZpZy5hZGRJbnB1dEV2ZW50cykge1xuICAgIHRoaXMuaW5wdXQgPSBuZXcgSW5wdXQodGhpcywgY2FudmFzLnBhcmVudEVsZW1lbnQpO1xuICB9XG59O1xuXG5HYW1lLnByb3RvdHlwZS5zZXRTaXplID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICB0aGlzLndpZHRoID0gd2lkdGg7XG4gIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gIGlmICh0aGlzLnZpZGVvKSB7XG4gICAgdGhpcy52aWRlby5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuICB9XG59O1xuXG5HYW1lLnByb3RvdHlwZS5wcmVsb2FkaW5nID0gZnVuY3Rpb24odGltZSkge1xuICBpZiAoIXRoaXMuY29uZmlnLnNob3dQcmVsb2FkZXIgJiYgISh0aGlzLnZpZGVvICYmIHRoaXMudmlkZW8uY3R4KSkgeyByZXR1cm47IH1cblxuICBpZiAodGhpcy52aWRlby5jdHgpIHtcbiAgICB2YXIgY29sb3IxID0gJyNiOWZmNzEnO1xuICAgIHZhciBjb2xvcjIgPSAnIzhhYzI1MCc7XG4gICAgdmFyIGNvbG9yMyA9ICcjNjQ4ZTM4JztcblxuICAgIGlmICh0aGlzLl9wcmVsb2FkZXJXaWR0aCA9PT0gdW5kZWZpbmVkKSB7IHRoaXMuX3ByZWxvYWRlcldpZHRoID0gMDsgfVxuXG4gICAgdmFyIHdpZHRoID0gTWF0aC5taW4odGhpcy53aWR0aCAqIDIvMywgMzAwKTtcbiAgICB2YXIgaGVpZ2h0ID0gMjA7XG5cbiAgICB2YXIgeSA9ICh0aGlzLmhlaWdodCAtIGhlaWdodCkgLyAyO1xuICAgIHZhciB4ID0gKHRoaXMud2lkdGggLSB3aWR0aCkgLyAyO1xuXG4gICAgdmFyIGN1cnJlbnRXaWR0aCA9IHdpZHRoICogdGhpcy5hc3NldHMucHJvZ3Jlc3M7XG4gICAgdGhpcy5fcHJlbG9hZGVyV2lkdGggPSB0aGlzLl9wcmVsb2FkZXJXaWR0aCArIChjdXJyZW50V2lkdGggLSB0aGlzLl9wcmVsb2FkZXJXaWR0aCkgKiB0aW1lICogMTA7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5zYXZlKCk7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5maWxsU3R5bGUgPSBjb2xvcjI7XG4gICAgdGhpcy52aWRlby5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXG4gICAgdGhpcy52aWRlby5jdHguZm9udCA9ICc0MDAgNDBweCBzYW5zLXNlcmlmJztcbiAgICB0aGlzLnZpZGVvLmN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICB0aGlzLnZpZGVvLmN0eC50ZXh0QmFzZWxpbmUgPSAnYm90dG9tJztcblxuICAgIHRoaXMudmlkZW8uY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDAsIDAsIDAsIDAuMSknO1xuICAgIHRoaXMudmlkZW8uY3R4LmZpbGxUZXh0KFwiUG90aW9uLmpzXCIsIHRoaXMud2lkdGgvMiwgeSArIDIpO1xuXG4gICAgdGhpcy52aWRlby5jdHguZmlsbFN0eWxlID0gJyNkMWZmYTEnO1xuICAgIHRoaXMudmlkZW8uY3R4LmZpbGxUZXh0KFwiUG90aW9uLmpzXCIsIHRoaXMud2lkdGgvMiwgeSk7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5zdHJva2VTdHlsZSA9IHRoaXMudmlkZW8uY3R4LmZpbGxTdHlsZSA9IGNvbG9yMztcbiAgICB0aGlzLnZpZGVvLmN0eC5maWxsUmVjdCh4LCB5ICsgMTUsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgdGhpcy52aWRlby5jdHgubGluZVdpZHRoID0gMjtcbiAgICB0aGlzLnZpZGVvLmN0eC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLnZpZGVvLmN0eC5yZWN0KHggLSA1LCB5ICsgMTAsIHdpZHRoICsgMTAsIGhlaWdodCArIDEwKTtcbiAgICB0aGlzLnZpZGVvLmN0eC5jbG9zZVBhdGgoKTtcbiAgICB0aGlzLnZpZGVvLmN0eC5zdHJva2UoKTtcblxuICAgIHRoaXMudmlkZW8uY3R4LnN0cm9rZVN0eWxlID0gdGhpcy52aWRlby5jdHguZmlsbFN0eWxlID0gJ3JnYmEoMCwgMCwgMCwgMC4xKSc7XG4gICAgdGhpcy52aWRlby5jdHguZmlsbFJlY3QoeCwgeSArIDE1LCB0aGlzLl9wcmVsb2FkZXJXaWR0aCwgaGVpZ2h0ICsgMik7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5saW5lV2lkdGggPSAyO1xuICAgIHRoaXMudmlkZW8uY3R4LmJlZ2luUGF0aCgpO1xuXG4gICAgdGhpcy52aWRlby5jdHgubW92ZVRvKHggKyB0aGlzLl9wcmVsb2FkZXJXaWR0aCwgeSArIDEyKTtcbiAgICB0aGlzLnZpZGVvLmN0eC5saW5lVG8oeCAtIDUsIHkgKyAxMik7XG4gICAgdGhpcy52aWRlby5jdHgubGluZVRvKHggLSA1LCB5ICsgMTAgKyBoZWlnaHQgKyAxMik7XG4gICAgdGhpcy52aWRlby5jdHgubGluZVRvKHggKyB0aGlzLl9wcmVsb2FkZXJXaWR0aCwgeSArIDEwICsgaGVpZ2h0ICsgMTIpO1xuXG4gICAgdGhpcy52aWRlby5jdHguc3Ryb2tlKCk7XG4gICAgdGhpcy52aWRlby5jdHguY2xvc2VQYXRoKCk7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5zdHJva2VTdHlsZSA9IHRoaXMudmlkZW8uY3R4LmZpbGxTdHlsZSA9IGNvbG9yMTtcbiAgICB0aGlzLnZpZGVvLmN0eC5maWxsUmVjdCh4LCB5ICsgMTUsIHRoaXMuX3ByZWxvYWRlcldpZHRoLCBoZWlnaHQpO1xuXG4gICAgdGhpcy52aWRlby5jdHgubGluZVdpZHRoID0gMjtcbiAgICB0aGlzLnZpZGVvLmN0eC5iZWdpblBhdGgoKTtcblxuICAgIHRoaXMudmlkZW8uY3R4Lm1vdmVUbyh4ICsgdGhpcy5fcHJlbG9hZGVyV2lkdGgsIHkgKyAxMCk7XG4gICAgdGhpcy52aWRlby5jdHgubGluZVRvKHggLSA1LCB5ICsgMTApO1xuICAgIHRoaXMudmlkZW8uY3R4LmxpbmVUbyh4IC0gNSwgeSArIDEwICsgaGVpZ2h0ICsgMTApO1xuICAgIHRoaXMudmlkZW8uY3R4LmxpbmVUbyh4ICsgdGhpcy5fcHJlbG9hZGVyV2lkdGgsIHkgKyAxMCArIGhlaWdodCArIDEwKTtcblxuICAgIHRoaXMudmlkZW8uY3R4LnN0cm9rZSgpO1xuICAgIHRoaXMudmlkZW8uY3R4LmNsb3NlUGF0aCgpO1xuXG4gICAgdGhpcy52aWRlby5jdHgucmVzdG9yZSgpO1xuICB9XG59O1xuXG5HYW1lLnByb3RvdHlwZS5jb25maWd1cmUgPSBmdW5jdGlvbigpIHt9O1xuXG5HYW1lLnByb3RvdHlwZS5mb2N1cyA9IGZ1bmN0aW9uKCkge307XG5cbkdhbWUucHJvdG90eXBlLmJsdXIgPSBmdW5jdGlvbigpIHt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9nYW1lLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiB3aW5kb3cucGVyZm9ybWFuY2UgfHwgRGF0ZTtcbn0pKCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy90aW1lLmpzXG4gKiovIiwidmFyIHJlbmRlck9yZGVyU29ydCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIGEucmVuZGVyT3JkZXIgPCBiLnJlbmRlck9yZGVyO1xufTtcblxudmFyIHVwZGF0ZU9yZGVyU29ydCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIGEudXBkYXRlT3JkZXIgPCBiLnVwZGF0ZU9yZGVyO1xufTtcblxudmFyIFN0YXRlTWFuYWdlciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnN0YXRlcyA9IHt9O1xuICB0aGlzLnJlbmRlck9yZGVyID0gW107XG4gIHRoaXMudXBkYXRlT3JkZXIgPSBbXTtcbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24obmFtZSwgc3RhdGUpIHtcbiAgdGhpcy5zdGF0ZXNbbmFtZV0gPSB0aGlzLl9uZXdTdGF0ZUhvbGRlcihuYW1lLCBzdGF0ZSk7XG4gIHRoaXMucmVmcmVzaE9yZGVyKCk7XG4gIHJldHVybiBzdGF0ZTtcbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuZW5hYmxlID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBpZiAoIWhvbGRlci5lbmFibGVkKSB7XG4gICAgICBpZiAoaG9sZGVyLnN0YXRlLmVuYWJsZSkge1xuICAgICAgICBob2xkZXIuc3RhdGUuZW5hYmxlKCk7XG4gICAgICB9XG4gICAgICBob2xkZXIuZW5hYmxlZCA9IHRydWU7XG4gICAgICBob2xkZXIuY2hhbmdlZCA9IHRydWU7XG5cbiAgICAgIGlmIChob2xkZXIucGF1c2VkKSB7XG4gICAgICAgIHRoaXMudW5wYXVzZShuYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaWYgKGhvbGRlci5lbmFibGVkKSB7XG4gICAgICBpZiAoaG9sZGVyLnN0YXRlLmRpc2FibGUpIHtcbiAgICAgICAgaG9sZGVyLnN0YXRlLmRpc2FibGUoKTtcbiAgICAgIH1cbiAgICAgIGhvbGRlci5jaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIGhvbGRlci5lbmFibGVkID0gZmFsc2U7XG4gICAgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGlmIChob2xkZXIuZW5hYmxlZCkge1xuICAgICAgaG9sZGVyLmNoYW5nZWQgPSB0cnVlO1xuICAgICAgaG9sZGVyLnJlbmRlciA9IGZhbHNlO1xuICAgIH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBpZiAoaG9sZGVyLmVuYWJsZWQpIHtcbiAgICAgIGhvbGRlci5jaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIGhvbGRlci5yZW5kZXIgPSB0cnVlO1xuICAgIH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaWYgKGhvbGRlci5zdGF0ZS5wYXVzZSkge1xuICAgICAgaG9sZGVyLnN0YXRlLnBhdXNlKCk7XG4gICAgfVxuXG4gICAgaG9sZGVyLmNoYW5nZWQgPSB0cnVlO1xuICAgIGhvbGRlci5wYXVzZWQgPSB0cnVlO1xuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnVucGF1c2UgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGlmIChob2xkZXIuc3RhdGUudW5wYXVzZSkge1xuICAgICAgaG9sZGVyLnN0YXRlLnVucGF1c2UoKTtcbiAgICB9XG5cbiAgICBob2xkZXIuY2hhbmdlZCA9IHRydWU7XG4gICAgaG9sZGVyLnBhdXNlZCA9IGZhbHNlO1xuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnByb3RlY3QgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGhvbGRlci5wcm90ZWN0ID0gdHJ1ZTtcbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS51bnByb3RlY3QgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGhvbGRlci5wcm90ZWN0ID0gZmFsc2U7XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUucmVmcmVzaE9yZGVyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucmVuZGVyT3JkZXIubGVuZ3RoID0gMDtcbiAgdGhpcy51cGRhdGVPcmRlci5sZW5ndGggPSAwO1xuXG4gIGZvciAodmFyIG5hbWUgaW4gdGhpcy5zdGF0ZXMpIHtcbiAgICB2YXIgaG9sZGVyID0gdGhpcy5zdGF0ZXNbbmFtZV07XG4gICAgaWYgKGhvbGRlcikge1xuICAgICAgdGhpcy5yZW5kZXJPcmRlci5wdXNoKGhvbGRlcik7XG4gICAgICB0aGlzLnVwZGF0ZU9yZGVyLnB1c2goaG9sZGVyKTtcbiAgICB9XG4gIH1cblxuICB0aGlzLnJlbmRlck9yZGVyLnNvcnQocmVuZGVyT3JkZXJTb3J0KTtcbiAgdGhpcy51cGRhdGVPcmRlci5zb3J0KHVwZGF0ZU9yZGVyU29ydCk7XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLl9uZXdTdGF0ZUhvbGRlciA9IGZ1bmN0aW9uKG5hbWUsIHN0YXRlKSB7XG4gIHZhciBob2xkZXIgPSB7fTtcbiAgaG9sZGVyLm5hbWUgPSBuYW1lO1xuICBob2xkZXIuc3RhdGUgPSBzdGF0ZTtcblxuICBob2xkZXIucHJvdGVjdCA9IGZhbHNlO1xuXG4gIGhvbGRlci5lbmFibGVkID0gdHJ1ZTtcbiAgaG9sZGVyLnBhdXNlZCA9IGZhbHNlO1xuXG4gIGhvbGRlci5yZW5kZXIgPSB0cnVlO1xuXG4gIGhvbGRlci5pbml0aWFsaXplZCA9IGZhbHNlO1xuICBob2xkZXIudXBkYXRlZCA9IGZhbHNlO1xuICBob2xkZXIuY2hhbmdlZCA9IHRydWU7XG5cbiAgaG9sZGVyLnVwZGF0ZU9yZGVyID0gMDtcbiAgaG9sZGVyLnJlbmRlck9yZGVyID0gMDtcblxuICByZXR1cm4gaG9sZGVyO1xufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5zZXRVcGRhdGVPcmRlciA9IGZ1bmN0aW9uKG5hbWUsIG9yZGVyKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGhvbGRlci51cGRhdGVPcmRlciA9IG9yZGVyO1xuICAgIHRoaXMucmVmcmVzaE9yZGVyKCk7XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuc2V0UmVuZGVyT3JkZXIgPSBmdW5jdGlvbihuYW1lLCBvcmRlcikge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBob2xkZXIucmVuZGVyT3JkZXIgPSBvcmRlcjtcbiAgICB0aGlzLnJlZnJlc2hPcmRlcigpO1xuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoc3RhdGUgJiYgIXN0YXRlLnByb3RlY3QpIHtcbiAgICBpZiAoc3RhdGUuc3RhdGUuY2xvc2UpIHtcbiAgICAgIHN0YXRlLnN0YXRlLmNsb3NlKCk7XG4gICAgfVxuICAgIGRlbGV0ZSB0aGlzLnN0YXRlc1tuYW1lXTtcbiAgICB0aGlzLnJlZnJlc2hPcmRlcigpO1xuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmRlc3Ryb3lBbGwgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy51cGRhdGVPcmRlci5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnVwZGF0ZU9yZGVyW2ldO1xuICAgIGlmICghc3RhdGUucHJvdGVjdCkge1xuICAgICAgaWYgKHN0YXRlLnN0YXRlLmNsb3NlKSB7XG4gICAgICAgIHN0YXRlLnN0YXRlLmNsb3NlKCk7XG4gICAgICB9XG4gICAgICBkZWxldGUgdGhpcy5zdGF0ZXNbc3RhdGUubmFtZV07XG4gICAgfVxuICB9XG5cbiAgdGhpcy5yZWZyZXNoT3JkZXIoKTtcbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSkge1xuICByZXR1cm4gdGhpcy5zdGF0ZXNbbmFtZV07XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy51cGRhdGVPcmRlci5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnVwZGF0ZU9yZGVyW2ldO1xuXG4gICAgaWYgKHN0YXRlKSB7XG4gICAgICBzdGF0ZS5jaGFuZ2VkID0gZmFsc2U7XG5cbiAgICAgIGlmIChzdGF0ZS5lbmFibGVkKSB7XG4gICAgICAgIGlmICghc3RhdGUuaW5pdGlhbGl6ZWQgJiYgc3RhdGUuc3RhdGUuaW5pdCkge1xuICAgICAgICAgIHN0YXRlLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgICBzdGF0ZS5zdGF0ZS5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RhdGUuc3RhdGUudXBkYXRlICYmICFzdGF0ZS5wYXVzZWQpIHtcbiAgICAgICAgICBzdGF0ZS5zdGF0ZS51cGRhdGUodGltZSk7XG4gICAgICAgICAgc3RhdGUudXBkYXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuZXhpdFVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy51cGRhdGVPcmRlci5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnVwZGF0ZU9yZGVyW2ldO1xuXG4gICAgaWYgKHN0YXRlLmVuYWJsZWQgJiYgc3RhdGUuc3RhdGUuZXhpdFVwZGF0ZSAmJiAhc3RhdGUucGF1c2VkKSB7XG4gICAgICBzdGF0ZS5zdGF0ZS5leGl0VXBkYXRlKHRpbWUpO1xuICAgIH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy5yZW5kZXJPcmRlci5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnJlbmRlck9yZGVyW2ldO1xuICAgIGlmIChzdGF0ZS5lbmFibGVkICYmIChzdGF0ZS51cGRhdGVkIHx8ICFzdGF0ZS5zdGF0ZS51cGRhdGUpICYmIHN0YXRlLnJlbmRlciAmJiBzdGF0ZS5zdGF0ZS5yZW5kZXIpIHtcbiAgICAgIHN0YXRlLnN0YXRlLnJlbmRlcigpO1xuICAgIH1cbiAgfVxufTtcblN0YXRlTWFuYWdlci5wcm90b3R5cGUubW91c2Vtb3ZlID0gZnVuY3Rpb24oeCwgeSwgZSkge1xuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLnVwZGF0ZU9yZGVyLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMudXBkYXRlT3JkZXJbaV07XG4gICAgaWYgKHN0YXRlLmVuYWJsZWQgJiYgIXN0YXRlLmNoYW5nZWQgJiYgc3RhdGUuc3RhdGUubW91c2Vtb3ZlICYmICFzdGF0ZS5wYXVzZWQpIHtcbiAgICAgIHN0YXRlLnN0YXRlLm1vdXNlbW92ZSh4LCB5LCBlKTtcbiAgICB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUubW91c2V1cCA9IGZ1bmN0aW9uKHgsIHksIGJ1dHRvbikge1xuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLnVwZGF0ZU9yZGVyLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMudXBkYXRlT3JkZXJbaV07XG4gICAgaWYgKHN0YXRlLmVuYWJsZWQgJiYgIXN0YXRlLmNoYW5nZWQgJiYgc3RhdGUuc3RhdGUubW91c2V1cCAmJiAhc3RhdGUucGF1c2VkKSB7XG4gICAgICBzdGF0ZS5zdGF0ZS5tb3VzZXVwKHgsIHksIGJ1dHRvbik7XG4gICAgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLm1vdXNlZG93biA9IGZ1bmN0aW9uKHgsIHksIGJ1dHRvbikge1xuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLnVwZGF0ZU9yZGVyLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMudXBkYXRlT3JkZXJbaV07XG4gICAgaWYgKHN0YXRlLmVuYWJsZWQgJiYgIXN0YXRlLmNoYW5nZWQgJiYgc3RhdGUuc3RhdGUubW91c2Vkb3duICYmICFzdGF0ZS5wYXVzZWQpIHtcbiAgICAgIHN0YXRlLnN0YXRlLm1vdXNlZG93bih4LCB5LCBidXR0b24pO1xuICAgIH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5rZXl1cCA9IGZ1bmN0aW9uKGtleSwgZSkge1xuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLnVwZGF0ZU9yZGVyLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMudXBkYXRlT3JkZXJbaV07XG4gICAgaWYgKHN0YXRlLmVuYWJsZWQgJiYgIXN0YXRlLmNoYW5nZWQgJiYgc3RhdGUuc3RhdGUua2V5dXAgJiYgIXN0YXRlLnBhdXNlZCkge1xuICAgICAgc3RhdGUuc3RhdGUua2V5dXAoa2V5LCBlKTtcbiAgICB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUua2V5ZG93biA9IGZ1bmN0aW9uKGtleSwgZSkge1xuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLnVwZGF0ZU9yZGVyLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMudXBkYXRlT3JkZXJbaV07XG4gICAgaWYgKHN0YXRlLmVuYWJsZWQgJiYgIXN0YXRlLmNoYW5nZWQgJiYgc3RhdGUuc3RhdGUua2V5ZG93biAmJiAhc3RhdGUucGF1c2VkKSB7XG4gICAgICBzdGF0ZS5zdGF0ZS5rZXlkb3duKGtleSwgZSk7XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YXRlTWFuYWdlcjtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3N0YXRlLW1hbmFnZXIuanNcbiAqKi8iLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciBEaXJ0eU1hbmFnZXIgPSByZXF1aXJlKCcuL2RpcnR5LW1hbmFnZXInKTtcblxudmFyIE9iamVjdFBvb2wgPSBbXTtcblxudmFyIEdldE9iamVjdEZyb21Qb29sID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXN1bHQgPSBPYmplY3RQb29sLnBvcCgpO1xuXG4gIGlmIChyZXN1bHQpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcmV0dXJuIHt9O1xufTtcblxudmFyIGluZGV4VG9OdW1iZXJBbmRMb3dlckNhc2VLZXkgPSBmdW5jdGlvbihpbmRleCkge1xuICBpZiAoaW5kZXggPD0gOSkge1xuICAgIHJldHVybiA0OCArIGluZGV4O1xuICB9IGVsc2UgaWYgKGluZGV4ID09PSAxMCkge1xuICAgIHJldHVybiA0ODtcbiAgfSBlbHNlIGlmIChpbmRleCA+IDEwICYmIGluZGV4IDw9IDM2KSB7XG4gICAgcmV0dXJuIDY0ICsgKGluZGV4LTEwKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufTtcblxudmFyIGRlZmF1bHRzID0gW1xuICB7IG5hbWU6ICdTaG93IEZQUycsIGVudHJ5OiAnc2hvd0ZwcycsIGRlZmF1bHQ6IHRydWUgfSxcbiAgeyBuYW1lOiAnU2hvdyBLZXkgQ29kZXMnLCBlbnRyeTogJ3Nob3dLZXlDb2RlcycsIGRlZmF1bHQ6IHRydWUgfVxuXTtcblxudmFyIERlYnVnZ2VyID0gZnVuY3Rpb24oYXBwKSB7XG4gIHRoaXMudmlkZW8gPSBhcHAudmlkZW8uY3JlYXRlTGF5ZXIoe1xuICAgIHVzZVJldGluYTogdHJ1ZSxcbiAgICBpbml0aWFsaXplQ2FudmFzOiB0cnVlXG4gIH0pO1xuICB0aGlzLmFwcCA9IGFwcDtcblxuICB0aGlzLm9wdGlvbnMgPSBkZWZhdWx0cztcbiAgdGhpcy5fbWF4TG9nc0NvdW50cyA9IDEwO1xuXG4gIGZvciAodmFyIGk9MDsgaTx0aGlzLm9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgb3B0aW9uID0gdGhpcy5vcHRpb25zW2ldO1xuICAgIHRoaXMuX2luaXRPcHRpb24ob3B0aW9uKTtcbiAgfVxuXG4gIHRoaXMuZGlzYWJsZWQgPSBmYWxzZTtcblxuICB0aGlzLmZwcyA9IDA7XG4gIHRoaXMuZnBzQ291bnQgPSAwO1xuICB0aGlzLmZwc0VsYXBzZWRUaW1lID0gMDtcbiAgdGhpcy5mcHNVcGRhdGVJbnRlcnZhbCA9IDAuNTtcblxuICB0aGlzLl9mb250U2l6ZSA9IDA7XG4gIHRoaXMuX2RpcnR5TWFuYWdlciA9IG5ldyBEaXJ0eU1hbmFnZXIodGhpcy52aWRlby5jYW52YXMsIHRoaXMudmlkZW8uY3R4KTtcblxuICB0aGlzLmxvZ3MgPSBbXTtcblxuICB0aGlzLnNob3dEZWJ1ZyA9IGZhbHNlO1xuICB0aGlzLmVuYWJsZURlYnVnS2V5cyA9IHRydWU7XG4gIHRoaXMuZW5hYmxlU2hvcnRjdXRzID0gZmFsc2U7XG5cbiAgdGhpcy5lbmFibGVTaG9ydGN1dHNLZXkgPSAyMjA7XG5cbiAgdGhpcy5sYXN0S2V5ID0gbnVsbDtcblxuICB0aGlzLl9sb2FkKCk7XG5cbiAgdGhpcy5rZXlTaG9ydGN1dHMgPSBbXG4gICAgeyBrZXk6IDEyMywgZW50cnk6ICdzaG93RGVidWcnLCB0eXBlOiAndG9nZ2xlJyB9XG4gIF07XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuX3NldEZvbnQgPSBmdW5jdGlvbihweCwgZm9udCkge1xuICB0aGlzLl9mb250U2l6ZSA9IHB4O1xuICB0aGlzLnZpZGVvLmN0eC5mb250ID0gcHggKyAncHggJyArIGZvbnQ7XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMudmlkZW8uc2V0U2l6ZSh0aGlzLmFwcC53aWR0aCwgdGhpcy5hcHAuaGVpZ2h0KTtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5hZGRDb25maWcgPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgdGhpcy5vcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgdGhpcy5faW5pdE9wdGlvbihvcHRpb24pO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLl9pbml0T3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gIG9wdGlvbi50eXBlID0gb3B0aW9uLnR5cGUgfHwgJ3RvZ2dsZSc7XG4gIG9wdGlvbi5kZWZhdWx0ID0gb3B0aW9uLmRlZmF1bHQgPT0gbnVsbCA/IGZhbHNlIDogb3B0aW9uLmRlZmF1bHQ7XG5cbiAgaWYgKG9wdGlvbi50eXBlID09PSAndG9nZ2xlJykge1xuICAgIHRoaXNbb3B0aW9uLmVudHJ5XSA9IG9wdGlvbi5kZWZhdWx0O1xuICB9XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5sb2dzLmxlbmd0aCA9IDA7XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUubG9nID0gZnVuY3Rpb24obWVzc2FnZSwgY29sb3IpIHtcbiAgY29sb3IgPSBjb2xvciB8fCAnd2hpdGUnO1xuICBtZXNzYWdlID0gdHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnID8gbWVzc2FnZSA6IHV0aWwuaW5zcGVjdChtZXNzYWdlKTtcblxuICB2YXIgbWVzc2FnZXMgPSBtZXNzYWdlLnJlcGxhY2UoL1xcXFwnL2csIFwiJ1wiKS5zcGxpdCgnXFxuJyk7XG5cbiAgZm9yICh2YXIgaT0wOyBpPG1lc3NhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG1zZyA9IG1lc3NhZ2VzW2ldO1xuICAgIGlmICh0aGlzLmxvZ3MubGVuZ3RoID49IHRoaXMuX21heExvZ3NDb3VudHMpIHtcbiAgICAgIE9iamVjdFBvb2wucHVzaCh0aGlzLmxvZ3Muc2hpZnQoKSk7XG4gICAgfVxuXG4gICAgdmFyIG1lc3NhZ2VPYmplY3QgPSBHZXRPYmplY3RGcm9tUG9vbCgpO1xuICAgIG1lc3NhZ2VPYmplY3QudGV4dCA9IG1zZztcbiAgICBtZXNzYWdlT2JqZWN0LmxpZmUgPSAxMDtcbiAgICBtZXNzYWdlT2JqZWN0LmNvbG9yID0gY29sb3I7XG5cbiAgICB0aGlzLmxvZ3MucHVzaChtZXNzYWdlT2JqZWN0KTtcbiAgfVxufTtcblxuRGVidWdnZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge307XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5leGl0VXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICBpZiAodGhpcy5kaXNhYmxlZCkgeyByZXR1cm47IH1cblxuICBpZiAodGhpcy5zaG93RGVidWcpIHtcbiAgICB0aGlzLl9tYXhMb2dzQ291bnRzID0gTWF0aC5jZWlsKCh0aGlzLmFwcC5oZWlnaHQgKyAyMCkvMjApO1xuICAgIHRoaXMuZnBzQ291bnQgKz0gMTtcbiAgICB0aGlzLmZwc0VsYXBzZWRUaW1lICs9IHRpbWU7XG5cbiAgICBpZiAodGhpcy5mcHNFbGFwc2VkVGltZSA+IHRoaXMuZnBzVXBkYXRlSW50ZXJ2YWwpIHtcbiAgICAgIHZhciBmcHMgPSB0aGlzLmZwc0NvdW50L3RoaXMuZnBzRWxhcHNlZFRpbWU7XG5cbiAgICAgIGlmICh0aGlzLnNob3dGcHMpIHtcbiAgICAgICAgdGhpcy5mcHMgPSB0aGlzLmZwcyAqICgxLTAuOCkgKyAwLjggKiBmcHM7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZnBzQ291bnQgPSAwO1xuICAgICAgdGhpcy5mcHNFbGFwc2VkVGltZSA9IDA7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy5sb2dzLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgICAgdmFyIGxvZyA9IHRoaXMubG9nc1tpXTtcbiAgICAgIGlmIChsb2cpIHtcbiAgICAgICAgbG9nLmxpZmUgLT0gdGltZTtcbiAgICAgICAgaWYgKGxvZy5saWZlIDw9IDApIHtcbiAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmxvZ3MuaW5kZXhPZihsb2cpO1xuICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7IHRoaXMubG9ncy5zcGxpY2UoaW5kZXgsIDEpOyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5rZXlkb3duID0gZnVuY3Rpb24oa2V5LCBlKSB7XG4gIGlmICh0aGlzLmRpc2FibGVkKSB7IHJldHVybjsgfVxuXG4gIHRoaXMubGFzdEtleSA9IGtleTtcblxuICB2YXIgaTtcblxuICBpZiAodGhpcy5lbmFibGVEZWJ1Z0tleXMpIHtcbiAgICBpZiAoa2V5ID09PSB0aGlzLmVuYWJsZVNob3J0Y3V0c0tleSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB0aGlzLmVuYWJsZVNob3J0Y3V0cyA9ICF0aGlzLmVuYWJsZVNob3J0Y3V0cztcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmVuYWJsZVNob3J0Y3V0cykge1xuICAgICAgZm9yIChpPTA7IGk8dGhpcy5vcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBvcHRpb24gPSB0aGlzLm9wdGlvbnNbaV07XG4gICAgICAgIHZhciBrZXlJbmRleCA9IGkgKyAxO1xuXG4gICAgICAgIGlmICh0aGlzLmFwcC5pbnB1dC5pc0tleURvd24oJ2N0cmwnKSkge1xuICAgICAgICAgIGtleUluZGV4IC09IDM2O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoYXJJZCA9IGluZGV4VG9OdW1iZXJBbmRMb3dlckNhc2VLZXkoa2V5SW5kZXgpO1xuXG4gICAgICAgIGlmIChjaGFySWQgJiYga2V5ID09PSBjaGFySWQpIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICBpZiAob3B0aW9uLnR5cGUgPT09ICd0b2dnbGUnKSB7XG5cbiAgICAgICAgICAgIHRoaXNbb3B0aW9uLmVudHJ5XSA9ICF0aGlzW29wdGlvbi5lbnRyeV07XG5cbiAgICAgICAgICAgIHRoaXMuX3NhdmUoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbi50eXBlID09PSAnY2FsbCcpIHtcbiAgICAgICAgICAgIG9wdGlvbi5lbnRyeSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yIChpPTA7IGk8dGhpcy5rZXlTaG9ydGN1dHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5U2hvcnRjdXQgPSB0aGlzLmtleVNob3J0Y3V0c1tpXTtcbiAgICBpZiAoa2V5U2hvcnRjdXQua2V5ID09PSBrZXkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgaWYgKGtleVNob3J0Y3V0LnR5cGUgPT09ICd0b2dnbGUnKSB7XG4gICAgICAgIHRoaXNba2V5U2hvcnRjdXQuZW50cnldID0gIXRoaXNba2V5U2hvcnRjdXQuZW50cnldO1xuICAgICAgICB0aGlzLl9zYXZlKCk7XG4gICAgICB9IGVsc2UgaWYgKGtleVNob3J0Y3V0LnR5cGUgPT09ICdjYWxsJykge1xuICAgICAgICB0aGlzW2tleVNob3J0Y3V0LmVudHJ5XSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuX3NhdmUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRhdGEgPSB7XG4gICAgc2hvd0RlYnVnOiB0aGlzLnNob3dEZWJ1ZyxcbiAgICBvcHRpb25zOiB7fVxuICB9O1xuXG4gIGZvciAodmFyIGk9MDsgaTx0aGlzLm9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgb3B0aW9uID0gdGhpcy5vcHRpb25zW2ldO1xuICAgIHZhciB2YWx1ZSA9IHRoaXNbb3B0aW9uLmVudHJ5XTtcbiAgICBkYXRhLm9wdGlvbnNbb3B0aW9uLmVudHJ5XSA9IHZhbHVlO1xuICB9XG5cbiAgd2luZG93LmxvY2FsU3RvcmFnZS5fX3BvdGlvbkRlYnVnID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuX2xvYWQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UgJiYgd2luZG93LmxvY2FsU3RvcmFnZS5fX3BvdGlvbkRlYnVnKSB7XG4gICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuX19wb3Rpb25EZWJ1Zyk7XG4gICAgdGhpcy5zaG93RGVidWcgPSBkYXRhLnNob3dEZWJ1ZztcblxuICAgIGZvciAodmFyIG5hbWUgaW4gZGF0YS5vcHRpb25zKSB7XG4gICAgICB0aGlzW25hbWVdID0gZGF0YS5vcHRpb25zW25hbWVdO1xuICAgIH1cbiAgfVxufTtcblxuRGVidWdnZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5kaXNhYmxlZCkgeyByZXR1cm47IH1cblxuICB0aGlzLl9kaXJ0eU1hbmFnZXIuY2xlYXIoKTtcblxuICBpZiAodGhpcy5zaG93RGVidWcpIHtcbiAgICB0aGlzLnZpZGVvLmN0eC5zYXZlKCk7XG4gICAgdGhpcy5fc2V0Rm9udCgxNSwgJ3NhbnMtc2VyaWYnKTtcblxuICAgIHRoaXMuX3JlbmRlckxvZ3MoKTtcbiAgICB0aGlzLl9yZW5kZXJEYXRhKCk7XG4gICAgdGhpcy5fcmVuZGVyU2hvcnRjdXRzKCk7XG5cbiAgICB0aGlzLnZpZGVvLmN0eC5yZXN0b3JlKCk7XG4gIH1cblxufTtcblxuRGVidWdnZXIucHJvdG90eXBlLl9yZW5kZXJMb2dzID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMudmlkZW8uY3R4LnRleHRBbGlnbiA9ICdsZWZ0JztcbiAgdGhpcy52aWRlby5jdHgudGV4dEJhc2VsaW5lID0gJ2JvdHRvbSc7XG5cbiAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy5sb2dzLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgIHZhciBsb2cgPSB0aGlzLmxvZ3NbaV07XG5cbiAgICB2YXIgeSA9IC0xMCArIHRoaXMuYXBwLmhlaWdodCArIChpIC0gdGhpcy5sb2dzLmxlbmd0aCArIDEpICogMjA7XG4gICAgdGhpcy5fcmVuZGVyVGV4dChsb2cudGV4dCwgMTAsIHksIGxvZy5jb2xvcik7XG4gIH1cbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZGlzYWJsZWQgPSB0cnVlO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLl9yZW5kZXJEYXRhID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMudmlkZW8uY3R4LnRleHRBbGlnbiA9ICdyaWdodCc7XG4gIHRoaXMudmlkZW8uY3R4LnRleHRCYXNlbGluZSA9ICd0b3AnO1xuXG4gIHZhciB4ID0gdGhpcy5hcHAud2lkdGggLSAxNDtcbiAgdmFyIHkgPSAxNDtcblxuICBpZiAodGhpcy5zaG93RnBzKSB7XG4gICAgdGhpcy5fcmVuZGVyVGV4dChNYXRoLnJvdW5kKHRoaXMuZnBzKSArICcgZnBzJywgeCwgeSk7XG4gIH1cblxuICB5ICs9IDIwO1xuXG4gIHRoaXMuX3NldEZvbnQoMTUsICdzYW5zLXNlcmlmJyk7XG5cbiAgaWYgKHRoaXMuc2hvd0tleUNvZGVzKSB7XG4gICAgdGhpcy5fcmVuZGVyVGV4dCgna2V5ICcgKyB0aGlzLmxhc3RLZXksIHgsIHksIHRoaXMuYXBwLmlucHV0LmlzS2V5RG93bih0aGlzLmxhc3RLZXkpID8gJyNlOWRjN2MnIDogJ3doaXRlJyk7XG4gICAgdGhpcy5fcmVuZGVyVGV4dCgnYnRuICcgKyB0aGlzLmFwcC5pbnB1dC5tb3VzZS5idXR0b24sIHggLSA2MCwgeSwgdGhpcy5hcHAuaW5wdXQubW91c2UuaXNEb3duID8gJyNlOWRjN2MnIDogJ3doaXRlJyk7XG4gIH1cbn07XG5cblxuRGVidWdnZXIucHJvdG90eXBlLl9yZW5kZXJTaG9ydGN1dHMgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuZW5hYmxlU2hvcnRjdXRzKSB7XG4gICAgdmFyIGhlaWdodCA9IDI4O1xuXG4gICAgdGhpcy5fc2V0Rm9udCgyMCwgJ0hlbHZldGljYSBOZXVlLCBzYW5zLXNlcmlmJyk7XG4gICAgdGhpcy52aWRlby5jdHgudGV4dEFsaWduID0gJ2xlZnQnO1xuICAgIHRoaXMudmlkZW8uY3R4LnRleHRCYXNlbGluZSA9ICd0b3AnO1xuICAgIHZhciBtYXhQZXJDb2xsdW1uID0gTWF0aC5mbG9vcigodGhpcy5hcHAuaGVpZ2h0IC0gMTQpL2hlaWdodCk7XG5cbiAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy5vcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb3B0aW9uID0gdGhpcy5vcHRpb25zW2ldO1xuICAgICAgdmFyIHggPSAxNCArIE1hdGguZmxvb3IoaS9tYXhQZXJDb2xsdW1uKSAqIDMyMDtcbiAgICAgIHZhciB5ID0gMTQgKyBpJW1heFBlckNvbGx1bW4gKiBoZWlnaHQ7XG5cbiAgICAgIHZhciBrZXlJbmRleCA9IGkgKyAxO1xuICAgICAgdmFyIGNoYXJJZCA9IGluZGV4VG9OdW1iZXJBbmRMb3dlckNhc2VLZXkoa2V5SW5kZXgpO1xuXG4gICAgICB2YXIgaXNPbiA9IHRoaXNbb3B0aW9uLmVudHJ5XTtcblxuICAgICAgdmFyIHNob3J0Y3V0ID0gU3RyaW5nLmZyb21DaGFyQ29kZShjaGFySWQpO1xuXG4gICAgICBpZiAoIWNoYXJJZCkge1xuICAgICAgICBzaG9ydGN1dCA9ICdeKycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGluZGV4VG9OdW1iZXJBbmRMb3dlckNhc2VLZXkoa2V5SW5kZXggLSAzNikpO1xuICAgICAgfVxuXG4gICAgICB2YXIgdGV4dCA9ICdbJyArIHNob3J0Y3V0ICsgJ10gJyArIG9wdGlvbi5uYW1lO1xuICAgICAgaWYgKG9wdGlvbi50eXBlID09PSAndG9nZ2xlJykge1xuICAgICAgICB0ZXh0ICs9ICcgKCcgKyAoaXNPbiA/ICdPTicgOiAnT0ZGJykgKyAnKSc7XG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbi50eXBlID09PSAnY2FsbCcpIHtcbiAgICAgICAgdGV4dCArPSAnIChDQUxMKSc7XG4gICAgICB9XG5cbiAgICAgIHZhciBjb2xvciA9ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDEpJztcbiAgICAgIHZhciBvdXRsaW5lID0gJ3JnYmEoMCwgMCwgMCwgMSknO1xuXG4gICAgICBpZiAoIWlzT24pIHtcbiAgICAgICAgY29sb3IgPSAncmdiYSgyNTUsIDI1NSwgMjU1LCAuNyknO1xuICAgICAgICBvdXRsaW5lID0gJ3JnYmEoMCwgMCwgMCwgLjcpJztcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcmVuZGVyVGV4dCh0ZXh0LCB4LCB5LCBjb2xvciwgb3V0bGluZSk7XG4gICAgfVxuICB9XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuX3JlbmRlclRleHQgPSBmdW5jdGlvbih0ZXh0LCB4LCB5LCBjb2xvciwgb3V0bGluZSkge1xuICBjb2xvciA9IGNvbG9yIHx8ICd3aGl0ZSc7XG4gIG91dGxpbmUgPSBvdXRsaW5lIHx8ICdibGFjayc7XG4gIHRoaXMudmlkZW8uY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICB0aGlzLnZpZGVvLmN0eC5saW5lSm9pbiA9ICdyb3VuZCc7XG4gIHRoaXMudmlkZW8uY3R4LnN0cm9rZVN0eWxlID0gb3V0bGluZTtcbiAgdGhpcy52aWRlby5jdHgubGluZVdpZHRoID0gMztcbiAgdGhpcy52aWRlby5jdHguc3Ryb2tlVGV4dCh0ZXh0LCB4LCB5KTtcbiAgdGhpcy52aWRlby5jdHguZmlsbFRleHQodGV4dCwgeCwgeSk7XG5cbiAgdmFyIHdpZHRoID0gdGhpcy52aWRlby5jdHgubWVhc3VyZVRleHQodGV4dCkud2lkdGg7XG5cbiAgdmFyIGR4ID0geCAtIDU7XG4gIHZhciBkeSA9IHk7XG4gIHZhciBkd2lkdGggPSB3aWR0aCArIDEwO1xuICB2YXIgZGhlaWdodCA9IHRoaXMuX2ZvbnRTaXplICsgMTA7XG5cbiAgaWYgKHRoaXMudmlkZW8uY3R4LnRleHRBbGlnbiA9PT0gJ3JpZ2h0Jykge1xuICAgIGR4ID0geCAtIDUgLSB3aWR0aDtcbiAgfVxuXG4gIHRoaXMuX2RpcnR5TWFuYWdlci5hZGRSZWN0KGR4LCBkeSwgZHdpZHRoLCBkaGVpZ2h0KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGVidWdnZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9wb3Rpb24tZGVidWdnZXIvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSA3XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IDYgNyA4IDkgMTAgMTFcbiAqKi8iLCJ2YXIgaXNSZXRpbmEgPSByZXF1aXJlKCcuL3JldGluYScpKCk7XG5cbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBjYW52YXMgLSBDYW52YXMgRE9NIGVsZW1lbnRcbiAqL1xudmFyIFZpZGVvID0gZnVuY3Rpb24oZ2FtZSwgY2FudmFzLCBjb25maWcpIHtcbiAgdGhpcy5nYW1lID0gZ2FtZTtcblxuICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcblxuICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcblxuICB0aGlzLndpZHRoID0gZ2FtZS53aWR0aDtcblxuICB0aGlzLmhlaWdodCA9IGdhbWUuaGVpZ2h0O1xuXG4gIGlmIChjb25maWcuaW5pdGlhbGl6ZUNhbnZhcykge1xuICAgIHRoaXMuY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gIH1cblxuICB0aGlzLl9hcHBseVNpemVUb0NhbnZhcygpO1xufTtcblxuLyoqXG4gKiBJbmNsdWRlcyBtaXhpbnMgaW50byBWaWRlbyBsaWJyYXJ5XG4gKiBAcGFyYW0ge29iamVjdH0gbWV0aG9kcyAtIG9iamVjdCBvZiBtZXRob2RzIHRoYXQgd2lsbCBpbmNsdWRlZCBpbiBWaWRlb1xuICovXG5WaWRlby5wcm90b3R5cGUuaW5jbHVkZSA9IGZ1bmN0aW9uKG1ldGhvZHMpIHtcbiAgZm9yICh2YXIgbWV0aG9kIGluIG1ldGhvZHMpIHtcbiAgICB0aGlzW21ldGhvZF0gPSBtZXRob2RzW21ldGhvZF07XG4gIH1cbn07XG5cblZpZGVvLnByb3RvdHlwZS5iZWdpbkZyYW1lID0gZnVuY3Rpb24oKSB7fTtcblxuVmlkZW8ucHJvdG90eXBlLmVuZEZyYW1lID0gZnVuY3Rpb24oKSB7fTtcblxuVmlkZW8ucHJvdG90eXBlLnNjYWxlQ2FudmFzID0gZnVuY3Rpb24oc2NhbGUpIHtcbiAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aCArICdweCc7XG4gIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodCArICdweCc7XG5cbiAgdGhpcy5jYW52YXMud2lkdGggKj0gc2NhbGU7XG4gIHRoaXMuY2FudmFzLmhlaWdodCAqPSBzY2FsZTtcblxuICBpZiAodGhpcy5jdHgpIHtcbiAgICB0aGlzLmN0eC5zY2FsZShzY2FsZSwgc2NhbGUpO1xuICB9XG59O1xuXG5WaWRlby5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcbiAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICB0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuICB0aGlzLl9hcHBseVNpemVUb0NhbnZhcygpO1xufTtcblxuVmlkZW8ucHJvdG90eXBlLl9hcHBseVNpemVUb0NhbnZhcyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuXG4gIHZhciBjb250YWluZXIgPSB0aGlzLmNhbnZhcy5wYXJlbnRFbGVtZW50O1xuICBjb250YWluZXIuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgJ3B4JztcbiAgY29udGFpbmVyLnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgJ3B4JztcblxuICBpZiAodGhpcy5jb25maWcudXNlUmV0aW5hICYmIGlzUmV0aW5hKSB7XG4gICAgdGhpcy5zY2FsZUNhbnZhcygyKTtcbiAgfVxufTtcblxuVmlkZW8ucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmN0eCkgeyB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpOyB9XG59O1xuXG5WaWRlby5wcm90b3R5cGUuY3JlYXRlTGF5ZXIgPSBmdW5jdGlvbihjb25maWcpIHtcbiAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG4gIHZhciBjb250YWluZXIgPSB0aGlzLmNhbnZhcy5wYXJlbnRFbGVtZW50O1xuICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gIGNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gIGNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgY2FudmFzLnN0eWxlLnRvcCA9ICcwcHgnO1xuICBjYW52YXMuc3R5bGUubGVmdCA9ICcwcHgnO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2FudmFzKTtcblxuICB2YXIgdmlkZW8gPSBuZXcgVmlkZW8odGhpcy5nYW1lLCBjYW52YXMsIGNvbmZpZyk7XG5cbiAgcmV0dXJuIHZpZGVvO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWRlbztcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3ZpZGVvLmpzXG4gKiovIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbnZhciBQb3Rpb25BdWRpbyA9IHJlcXVpcmUoJ3BvdGlvbi1hdWRpbycpO1xuXG4vKipcbiAqIENsYXNzIGZvciBtYW5hZ2luZyBhbmQgbG9hZGluZyBhc3NldCBmaWxlc1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBBc3NldHMgPSBmdW5jdGlvbigpIHtcbiAgLyoqXG4gICAqIElzIGN1cnJlbnRseSBsb2FkaW5nIGFueSBhc3NldHNcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuXG4gIHRoaXMuaXRlbXNDb3VudCA9IDA7XG4gIHRoaXMubG9hZGVkSXRlbXNDb3VudCA9IDA7XG4gIHRoaXMucHJvZ3Jlc3MgPSAwO1xuXG4gIHRoaXMuX3hociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gIHRoaXMuX3RoaW5nc1RvTG9hZCA9IDA7XG4gIHRoaXMuX2RhdGEgPSB7fTtcblxuICB0aGlzLmNhbGxiYWNrID0gbnVsbDtcblxuICB0aGlzLl90b0xvYWQgPSBbXTtcblxuICB0aGlzLmF1ZGlvID0gbmV3IFBvdGlvbkF1ZGlvKCk7XG59O1xuXG4vKipcbiAqIFN0YXJ0cyBsb2FkaW5nIHN0b3JlZCBhc3NldHMgdXJscyBhbmQgcnVucyBnaXZlbiBjYWxsYmFjayBhZnRlciBldmVyeXRoaW5nIGlzIGxvYWRlZFxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBjYWxsYmFjayBmdW5jdGlvblxuICovXG5Bc3NldHMucHJvdG90eXBlLm9ubG9hZCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcblxuICBpZiAodGhpcy5fdGhpbmdzVG9Mb2FkID09PSAwKSB7XG4gICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9uZXh0RmlsZSgpO1xuICB9XG59O1xuXG4vKipcbiAqIEdldHRlciBmb3IgbG9hZGVkIGFzc2V0c1xuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB1cmwgb2Ygc3RvcmVkIGFzc2V0XG4gKi9cbkFzc2V0cy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSkge1xuICByZXR1cm4gdGhpcy5fZGF0YVtwYXRoLm5vcm1hbGl6ZShuYW1lKV07XG59O1xuXG4vKipcbiAqIFVzZWQgZm9yIHN0b3Jpbmcgc29tZSB2YWx1ZSBpbiBhc3NldHMgbW9kdWxlXG4gKiB1c2VmdWwgZm9yIG92ZXJyYXRpbmcgdmFsdWVzXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHVybCBvZiB0aGUgYXNzZXRcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZSAtIHZhbHVlIHRvIGJlIHN0b3JlZFxuICovXG5Bc3NldHMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHRoaXMuX2RhdGFbcGF0aC5ub3JtYWxpemUobmFtZSldID0gdmFsdWU7XG59O1xuXG4vKipcbiAqIFN0b3JlcyB1cmwgc28gaXQgY2FuIGJlIGxvYWRlZCBsYXRlclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSB0eXBlIG9mIGFzc2V0XG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gdXJsIG9mIGdpdmVuIGFzc2V0XG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gKi9cbkFzc2V0cy5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uKHR5cGUsIHVybCwgY2FsbGJhY2spIHtcbiAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xuICB0aGlzLml0ZW1zQ291bnQgKz0gMTtcbiAgdGhpcy5fdGhpbmdzVG9Mb2FkICs9IDE7XG5cbiAgdGhpcy5fdG9Mb2FkLnB1c2goeyB0eXBlOiB0eXBlLCB1cmw6IHVybCAhPSBudWxsID8gcGF0aC5ub3JtYWxpemUodXJsKSA6IG51bGwsIGNhbGxiYWNrOiBjYWxsYmFjayB9KTtcbn07XG5cbkFzc2V0cy5wcm90b3R5cGUuX2ZpbmlzaGVkT25lRmlsZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9uZXh0RmlsZSgpO1xuICB0aGlzLnByb2dyZXNzID0gdGhpcy5sb2FkZWRJdGVtc0NvdW50IC8gdGhpcy5pdGVtc0NvdW50O1xuICB0aGlzLl90aGluZ3NUb0xvYWQgLT0gMTtcbiAgdGhpcy5sb2FkZWRJdGVtc0NvdW50ICs9IDE7XG5cbiAgaWYgKHRoaXMuX3RoaW5nc1RvTG9hZCA9PT0gMCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi5jYWxsYmFjaygpO1xuICAgICAgc2VsZi5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICB9LCAwKTtcbiAgfVxufTtcblxuQXNzZXRzLnByb3RvdHlwZS5fZXJyb3IgPSBmdW5jdGlvbih0eXBlLCB1cmwpIHtcbiAgY29uc29sZS53YXJuKCdFcnJvciBsb2FkaW5nIFwiJyArIHR5cGUgKyAnXCIgYXNzZXQgd2l0aCB1cmwgJyArIHVybCk7XG4gIHRoaXMuX25leHRGaWxlKCk7XG59O1xuXG5Bc3NldHMucHJvdG90eXBlLl9zYXZlID0gZnVuY3Rpb24odXJsLCBkYXRhLCBjYWxsYmFjaykge1xuICB0aGlzLnNldCh1cmwsIGRhdGEpO1xuICBpZiAoY2FsbGJhY2spIHsgY2FsbGJhY2soZGF0YSk7IH1cbiAgdGhpcy5fZmluaXNoZWRPbmVGaWxlKCk7XG59O1xuXG5Bc3NldHMucHJvdG90eXBlLl9oYW5kbGVDdXN0b21Mb2FkaW5nID0gZnVuY3Rpb24obG9hZGluZykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBkb25lID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICBzZWxmLl9zYXZlKG5hbWUsIHZhbHVlKTtcbiAgfTtcbiAgbG9hZGluZyhkb25lKTtcbn07XG5cbkFzc2V0cy5wcm90b3R5cGUuX25leHRGaWxlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5fdG9Mb2FkLnNoaWZ0KCk7XG5cbiAgaWYgKCFjdXJyZW50KSB7IHJldHVybjsgfVxuXG4gIHZhciB0eXBlID0gY3VycmVudC50eXBlO1xuICB2YXIgdXJsID0gY3VycmVudC51cmw7XG4gIHZhciBjYWxsYmFjayA9IGN1cnJlbnQuY2FsbGJhY2s7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIGlmICh1dGlscy5pc0Z1bmN0aW9uKHR5cGUpKSB7XG4gICAgdGhpcy5faGFuZGxlQ3VzdG9tTG9hZGluZyh0eXBlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0eXBlID0gdHlwZS50b0xvd2VyQ2FzZSgpO1xuXG4gIHZhciByZXF1ZXN0ID0gdGhpcy5feGhyO1xuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ2pzb24nOlxuICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSAndGV4dCc7XG4gICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSk7XG4gICAgICAgIHNlbGYuX3NhdmUodXJsLCBkYXRhLCBjYWxsYmFjayk7XG4gICAgICB9O1xuICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oKSB7IHNlbGYuX2Vycm9yKHR5cGUsIHVybCk7IH07XG4gICAgICByZXF1ZXN0LnNlbmQoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ21wMyc6XG4gICAgY2FzZSAnbXVzaWMnOlxuICAgIGNhc2UgJ3NvdW5kJzpcbiAgICAgIHNlbGYuYXVkaW8ubG9hZCh1cmwsIGZ1bmN0aW9uKGF1ZGlvKSB7XG4gICAgICAgIHNlbGYuX3NhdmUodXJsLCBhdWRpbywgY2FsbGJhY2spO1xuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdpbWFnZSc6XG4gICAgY2FzZSAndGV4dHVyZSc6XG4gICAgY2FzZSAnc3ByaXRlJzpcbiAgICAgIHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYuX3NhdmUodXJsLCBpbWFnZSwgY2FsbGJhY2spO1xuICAgICAgfTtcbiAgICAgIGltYWdlLm9uZXJyb3IgPSBmdW5jdGlvbigpIHsgc2VsZi5fZXJyb3IodHlwZSwgdXJsKTsgfTtcbiAgICAgIGltYWdlLnNyYyA9IHVybDtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6IC8vIHRleHQgZmlsZXNcbiAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgdXJsLCB0cnVlKTtcbiAgICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ3RleHQnO1xuICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLnJlc3BvbnNlO1xuICAgICAgICBzZWxmLl9zYXZlKHVybCwgZGF0YSwgY2FsbGJhY2spO1xuICAgICAgfTtcbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKCkgeyBzZWxmLl9lcnJvcih0eXBlLCB1cmwpOyB9O1xuICAgICAgcmVxdWVzdC5zZW5kKCk7XG4gICAgICBicmVhaztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBc3NldHM7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9hc3NldHMuanNcbiAqKi8iLCJ2YXIga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIElucHV0IHdyYXBwZXJcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtHYW1lfSBnYW1lIC0gR2FtZSBvYmplY3RcbiAqL1xudmFyIElucHV0ID0gZnVuY3Rpb24oZ2FtZSwgY29udGFpbmVyKSB7XG4gIHRoaXMuX2NvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgLyoqXG4gICAqIFByZXNzZWQga2V5cyBvYmplY3RcbiAgICogQHR5cGUge29iamVjdH1cbiAgICovXG4gIHRoaXMua2V5cyA9IHt9O1xuXG4gIC8qKlxuICAgKiBDb250cm9scyBpZiB5b3UgY2FuIHByZXNzIGtleXNcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICB0aGlzLmNhbkNvbnRyb2xLZXlzID0gdHJ1ZTtcblxuICAvKipcbiAgICogTW91c2Ugb2JqZWN0IHdpdGggcG9zaXRpb25zIGFuZCBpZiBpcyBtb3VzZSBidXR0b24gcHJlc3NlZFxuICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgKi9cbiAgdGhpcy5tb3VzZSA9IHtcbiAgICBpc0Rvd246IGZhbHNlLFxuICAgIGlzTGVmdERvd246IGZhbHNlLFxuICAgIGlzTWlkZGxlRG93bjogZmFsc2UsXG4gICAgaXNSaWdodERvd246IGZhbHNlLFxuICAgIHg6IG51bGwsXG4gICAgeTogbnVsbFxuICB9O1xuXG4gIHRoaXMuX2FkZEV2ZW50cyhnYW1lKTtcbn07XG5cbi8qKlxuICogQ2xlYXJzIHRoZSBwcmVzc2VkIGtleXMgb2JqZWN0XG4gKi9cbklucHV0LnByb3RvdHlwZS5yZXNldEtleXMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5rZXlzID0ge307XG59O1xuXG4vKipcbiAqIFJldHVybiB0cnVlIG9yIGZhbHNlIGlmIGtleSBpcyBwcmVzc2VkXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5JbnB1dC5wcm90b3R5cGUuaXNLZXlEb3duID0gZnVuY3Rpb24oa2V5KSB7XG4gIGlmIChrZXkgPT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBpZiAodGhpcy5jYW5Db250cm9sS2V5cykge1xuICAgIHZhciBjb2RlID0gdHlwZW9mIGtleSA9PT0gJ251bWJlcicgPyBrZXkgOiBrZXlzW2tleS50b1VwcGVyQ2FzZSgpXTtcbiAgICByZXR1cm4gdGhpcy5rZXlzW2NvZGVdO1xuICB9XG59O1xuXG4vKipcbiAqIEFkZCBjYW52YXMgZXZlbnQgbGlzdGVuZXJcbiAqIEBwcml2YXRlXG4gKi9cbklucHV0LnByb3RvdHlwZS5fYWRkRXZlbnRzID0gZnVuY3Rpb24oZ2FtZSkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgeCA9IGUub2Zmc2V0WCA9PT0gdW5kZWZpbmVkID8gZS5sYXllclggLSBzZWxmLl9jb250YWluZXIub2Zmc2V0TGVmdCA6IGUub2Zmc2V0WDtcbiAgICB2YXIgeSA9IGUub2Zmc2V0WSA9PT0gdW5kZWZpbmVkID8gZS5sYXllclkgLSBzZWxmLl9jb250YWluZXIub2Zmc2V0VG9wIDogZS5vZmZzZXRZO1xuXG4gICAgc2VsZi5tb3VzZS54ID0geDtcbiAgICBzZWxmLm1vdXNlLnkgPSB5O1xuXG4gICAgZ2FtZS5zdGF0ZXMubW91c2Vtb3ZlKHgsIHksIGUpO1xuICB9KTtcblxuICBzZWxmLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgeCA9IGUub2Zmc2V0WCA9PT0gdW5kZWZpbmVkID8gZS5sYXllclggLSBzZWxmLl9jb250YWluZXIub2Zmc2V0TGVmdCA6IGUub2Zmc2V0WDtcbiAgICB2YXIgeSA9IGUub2Zmc2V0WSA9PT0gdW5kZWZpbmVkID8gZS5sYXllclkgLSBzZWxmLl9jb250YWluZXIub2Zmc2V0VG9wIDogZS5vZmZzZXRZO1xuXG4gICAgc2VsZi5tb3VzZS5pc0Rvd24gPSBmYWxzZTtcblxuICAgIHN3aXRjaCAoZS5idXR0b24pIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgc2VsZi5tb3VzZS5pc0xlZnREb3duID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgc2VsZi5tb3VzZS5pc01pZGRsZURvd24gPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHNlbGYubW91c2UuaXNSaWdodERvd24gPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgZ2FtZS5zdGF0ZXMubW91c2V1cCh4LCB5LCBlLmJ1dHRvbik7XG4gIH0sIGZhbHNlKTtcblxuICBzZWxmLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciB4ID0gZS5vZmZzZXRYID09PSB1bmRlZmluZWQgPyBlLmxheWVyWCAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRMZWZ0IDogZS5vZmZzZXRYO1xuICAgIHZhciB5ID0gZS5vZmZzZXRZID09PSB1bmRlZmluZWQgPyBlLmxheWVyWSAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRUb3AgOiBlLm9mZnNldFk7XG5cbiAgICBzZWxmLm1vdXNlLnggPSB4O1xuICAgIHNlbGYubW91c2UueSA9IHk7XG4gICAgc2VsZi5tb3VzZS5pc0Rvd24gPSB0cnVlO1xuXG4gICAgc3dpdGNoIChlLmJ1dHRvbikge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBzZWxmLm1vdXNlLmlzTGVmdERvd24gPSB0cnVlO1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHNlbGYubW91c2UuaXNNaWRkbGVEb3duID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHNlbGYubW91c2UuaXNSaWdodERvd24gPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBnYW1lLnN0YXRlcy5tb3VzZWRvd24oeCwgeSwgZS5idXR0b24pO1xuICB9LCBmYWxzZSk7XG5cbiAgc2VsZi5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgZm9yICh2YXIgaT0wOyBpPGUudG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHRvdWNoID0gZS50b3VjaGVzW2ldO1xuXG4gICAgICB2YXIgeCA9IHRvdWNoLnBhZ2VYIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldExlZnQ7XG4gICAgICB2YXIgeSA9IHRvdWNoLnBhZ2VZIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldFRvcDtcblxuICAgICAgc2VsZi5tb3VzZS54ID0geDtcbiAgICAgIHNlbGYubW91c2UueSA9IHk7XG4gICAgICBzZWxmLm1vdXNlLmlzRG93biA9IHRydWU7XG5cbiAgICAgIGdhbWUuc3RhdGVzLm1vdXNlZG93bih4LCB5LCAxKTtcbiAgICB9XG4gIH0pO1xuXG4gIHNlbGYuX2NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgZm9yICh2YXIgaT0wOyBpPGUudG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHRvdWNoID0gZS50b3VjaGVzW2ldO1xuXG4gICAgICB2YXIgeCA9IHRvdWNoLnBhZ2VYIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldExlZnQ7XG4gICAgICB2YXIgeSA9IHRvdWNoLnBhZ2VZIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldFRvcDtcblxuICAgICAgc2VsZi5tb3VzZS54ID0geDtcbiAgICAgIHNlbGYubW91c2UueSA9IHk7XG4gICAgICBzZWxmLm1vdXNlLmlzRG93biA9IHRydWU7XG5cbiAgICAgIGdhbWUuc3RhdGVzLm1vdXNlbW92ZSh4LCB5KTtcbiAgICB9XG4gIH0pO1xuXG4gIHNlbGYuX2NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgdG91Y2ggPSBlLmNoYW5nZWRUb3VjaGVzWzBdO1xuXG4gICAgdmFyIHggPSB0b3VjaC5wYWdlWCAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRMZWZ0O1xuICAgIHZhciB5ID0gdG91Y2gucGFnZVkgLSBzZWxmLl9jb250YWluZXIub2Zmc2V0VG9wO1xuXG4gICAgc2VsZi5tb3VzZS54ID0geDtcbiAgICBzZWxmLm1vdXNlLnkgPSB5O1xuICAgIHNlbGYubW91c2UuaXNEb3duID0gZmFsc2U7XG5cbiAgICBnYW1lLnN0YXRlcy5tb3VzZXVwKHgsIHksIDEpO1xuICB9KTtcblxuICBzZWxmLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9KTtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xuICAgIGdhbWUuaW5wdXQua2V5c1tlLmtleUNvZGVdID0gdHJ1ZTtcbiAgICBnYW1lLnN0YXRlcy5rZXlkb3duKGUud2hpY2gsIGUpO1xuICB9KTtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBnYW1lLmlucHV0LmtleXNbZS5rZXlDb2RlXSA9IGZhbHNlO1xuICAgIGdhbWUuc3RhdGVzLmtleXVwKGUud2hpY2gsIGUpO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW5wdXQ7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9pbnB1dC5qc1xuICoqLyIsInZhciBEaXJ0eU1hbmFnZXIgPSBmdW5jdGlvbihjYW52YXMsIGN0eCkge1xuICB0aGlzLmN0eCA9IGN0eDtcbiAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG5cbiAgdGhpcy50b3AgPSBjYW52YXMuaGVpZ2h0O1xuICB0aGlzLmxlZnQgPSBjYW52YXMud2lkdGg7XG4gIHRoaXMuYm90dG9tID0gMDtcbiAgdGhpcy5yaWdodCA9IDA7XG5cbiAgdGhpcy5pc0RpcnR5ID0gZmFsc2U7XG59O1xuXG5EaXJ0eU1hbmFnZXIucHJvdG90eXBlLmFkZFJlY3QgPSBmdW5jdGlvbihsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHQpIHtcbiAgdmFyIHJpZ2h0ICA9IGxlZnQgKyB3aWR0aDtcbiAgdmFyIGJvdHRvbSA9IHRvcCArIGhlaWdodDtcblxuICB0aGlzLnRvcCAgICA9IHRvcCA8IHRoaXMudG9wICAgICAgID8gdG9wICAgIDogdGhpcy50b3A7XG4gIHRoaXMubGVmdCAgID0gbGVmdCA8IHRoaXMubGVmdCAgICAgPyBsZWZ0ICAgOiB0aGlzLmxlZnQ7XG4gIHRoaXMuYm90dG9tID0gYm90dG9tID4gdGhpcy5ib3R0b20gPyBib3R0b20gOiB0aGlzLmJvdHRvbTtcbiAgdGhpcy5yaWdodCAgPSByaWdodCA+IHRoaXMucmlnaHQgICA/IHJpZ2h0ICA6IHRoaXMucmlnaHQ7XG5cbiAgdGhpcy5pc0RpcnR5ID0gdHJ1ZTtcbn07XG5cbkRpcnR5TWFuYWdlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLmlzRGlydHkpIHsgcmV0dXJuOyB9XG5cbiAgdGhpcy5jdHguY2xlYXJSZWN0KHRoaXMubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9wLFxuICAgICAgICAgICAgICAgICAgICAgdGhpcy5yaWdodCAtIHRoaXMubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm90dG9tIC0gdGhpcy50b3ApO1xuXG4gIHRoaXMubGVmdCA9IHRoaXMuY2FudmFzLndpZHRoO1xuICB0aGlzLnRvcCA9IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgdGhpcy5yaWdodCA9IDA7XG4gIHRoaXMuYm90dG9tID0gMDtcblxuICB0aGlzLmlzRGlydHkgPSBmYWxzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGlydHlNYW5hZ2VyO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcG90aW9uLWRlYnVnZ2VyL2RpcnR5LW1hbmFnZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IDcgOCA5IDEwIDExXG4gKiovIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3V0aWwvdXRpbC5qc1xuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IDYgNyA4IDkgMTAgMTFcbiAqKi8iLCJ2YXIgaXNSZXRpbmEgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG1lZGlhUXVlcnkgPSBcIigtd2Via2l0LW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDEuNSksXFxcbiAgKG1pbi0tbW96LWRldmljZS1waXhlbC1yYXRpbzogMS41KSxcXFxuICAoLW8tbWluLWRldmljZS1waXhlbC1yYXRpbzogMy8yKSxcXFxuICAobWluLXJlc29sdXRpb246IDEuNWRwcHgpXCI7XG5cbiAgaWYgKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvID4gMSlcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBpZiAod2luZG93Lm1hdGNoTWVkaWEgJiYgd2luZG93Lm1hdGNoTWVkaWEobWVkaWFRdWVyeSkubWF0Y2hlcylcbiAgICByZXR1cm4gdHJ1ZTtcblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzUmV0aW5hO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmV0aW5hLmpzXG4gKiovIiwidmFyIGdldCA9IGV4cG9ydHMuZ2V0ID0gZnVuY3Rpb24odXJsLCBjYWxsYmFjaykge1xuICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG5cbiAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBjYWxsYmFjayh0aGlzLnJlc3BvbnNlKTtcbiAgfTtcblxuICByZXF1ZXN0LnNlbmQoKTtcbn07XG5cbnZhciBnZXRKU09OID0gZXhwb3J0cy5nZXRKU09OID0gZnVuY3Rpb24odXJsLCBjYWxsYmFjaykge1xuICBnZXQodXJsLCBmdW5jdGlvbih0ZXh0KSB7XG4gICAgY2FsbGJhY2soSlNPTi5wYXJzZSh0ZXh0KSk7XG4gIH0pO1xufTtcblxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiAhIShvYmogJiYgb2JqLmNvbnN0cnVjdG9yICYmIG9iai5jYWxsICYmIG9iai5hcHBseSk7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvdXRpbHMuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgJ01PVVNFMSc6LTEsXG4gICdNT1VTRTInOi0zLFxuICAnTVdIRUVMX1VQJzotNCxcbiAgJ01XSEVFTF9ET1dOJzotNSxcbiAgJ0JBQ0tTUEFDRSc6OCxcbiAgJ1RBQic6OSxcbiAgJ0VOVEVSJzoxMyxcbiAgJ1BBVVNFJzoxOSxcbiAgJ0NBUFMnOjIwLFxuICAnRVNDJzoyNyxcbiAgJ1NQQUNFJzozMixcbiAgJ1BBR0VfVVAnOjMzLFxuICAnUEFHRV9ET1dOJzozNCxcbiAgJ0VORCc6MzUsXG4gICdIT01FJzozNixcbiAgJ0xFRlQnOjM3LFxuICAnVVAnOjM4LFxuICAnUklHSFQnOjM5LFxuICAnRE9XTic6NDAsXG4gICdJTlNFUlQnOjQ1LFxuICAnREVMRVRFJzo0NixcbiAgJ18wJzo0OCxcbiAgJ18xJzo0OSxcbiAgJ18yJzo1MCxcbiAgJ18zJzo1MSxcbiAgJ180Jzo1MixcbiAgJ181Jzo1MyxcbiAgJ182Jzo1NCxcbiAgJ183Jzo1NSxcbiAgJ184Jzo1NixcbiAgJ185Jzo1NyxcbiAgJ0EnOjY1LFxuICAnQic6NjYsXG4gICdDJzo2NyxcbiAgJ0QnOjY4LFxuICAnRSc6NjksXG4gICdGJzo3MCxcbiAgJ0cnOjcxLFxuICAnSCc6NzIsXG4gICdJJzo3MyxcbiAgJ0onOjc0LFxuICAnSyc6NzUsXG4gICdMJzo3NixcbiAgJ00nOjc3LFxuICAnTic6NzgsXG4gICdPJzo3OSxcbiAgJ1AnOjgwLFxuICAnUSc6ODEsXG4gICdSJzo4MixcbiAgJ1MnOjgzLFxuICAnVCc6ODQsXG4gICdVJzo4NSxcbiAgJ1YnOjg2LFxuICAnVyc6ODcsXG4gICdYJzo4OCxcbiAgJ1knOjg5LFxuICAnWic6OTAsXG4gICdOVU1QQURfMCc6OTYsXG4gICdOVU1QQURfMSc6OTcsXG4gICdOVU1QQURfMic6OTgsXG4gICdOVU1QQURfMyc6OTksXG4gICdOVU1QQURfNCc6MTAwLFxuICAnTlVNUEFEXzUnOjEwMSxcbiAgJ05VTVBBRF82JzoxMDIsXG4gICdOVU1QQURfNyc6MTAzLFxuICAnTlVNUEFEXzgnOjEwNCxcbiAgJ05VTVBBRF85JzoxMDUsXG4gICdNVUxUSVBMWSc6MTA2LFxuICAnQUREJzoxMDcsXG4gICdTVUJTVFJBQ1QnOjEwOSxcbiAgJ0RFQ0lNQUwnOjExMCxcbiAgJ0RJVklERSc6MTExLFxuICAnRjEnOjExMixcbiAgJ0YyJzoxMTMsXG4gICdGMyc6MTE0LFxuICAnRjQnOjExNSxcbiAgJ0Y1JzoxMTYsXG4gICdGNic6MTE3LFxuICAnRjcnOjExOCxcbiAgJ0Y4JzoxMTksXG4gICdGOSc6MTIwLFxuICAnRjEwJzoxMjEsXG4gICdGMTEnOjEyMixcbiAgJ0YxMic6MTIzLFxuICAnU0hJRlQnOjE2LFxuICAnQ1RSTCc6MTcsXG4gICdBTFQnOjE4LFxuICAnUExVUyc6MTg3LFxuICAnQ09NTUEnOjE4OCxcbiAgJ01JTlVTJzoxODksXG4gICdQRVJJT0QnOjE5MFxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2tleXMuanNcbiAqKi8iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gcmVzb2x2ZXMgLiBhbmQgLi4gZWxlbWVudHMgaW4gYSBwYXRoIGFycmF5IHdpdGggZGlyZWN0b3J5IG5hbWVzIHRoZXJlXG4vLyBtdXN0IGJlIG5vIHNsYXNoZXMsIGVtcHR5IGVsZW1lbnRzLCBvciBkZXZpY2UgbmFtZXMgKGM6XFwpIGluIHRoZSBhcnJheVxuLy8gKHNvIGFsc28gbm8gbGVhZGluZyBhbmQgdHJhaWxpbmcgc2xhc2hlcyAtIGl0IGRvZXMgbm90IGRpc3Rpbmd1aXNoXG4vLyByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgcGF0aHMpXG5mdW5jdGlvbiBub3JtYWxpemVBcnJheShwYXJ0cywgYWxsb3dBYm92ZVJvb3QpIHtcbiAgLy8gaWYgdGhlIHBhdGggdHJpZXMgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIGB1cGAgZW5kcyB1cCA+IDBcbiAgdmFyIHVwID0gMDtcbiAgZm9yICh2YXIgaSA9IHBhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdmFyIGxhc3QgPSBwYXJ0c1tpXTtcbiAgICBpZiAobGFzdCA9PT0gJy4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwLS07XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgdGhlIHBhdGggaXMgYWxsb3dlZCB0byBnbyBhYm92ZSB0aGUgcm9vdCwgcmVzdG9yZSBsZWFkaW5nIC4uc1xuICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICBmb3IgKDsgdXAtLTsgdXApIHtcbiAgICAgIHBhcnRzLnVuc2hpZnQoJy4uJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzO1xufVxuXG4vLyBTcGxpdCBhIGZpbGVuYW1lIGludG8gW3Jvb3QsIGRpciwgYmFzZW5hbWUsIGV4dF0sIHVuaXggdmVyc2lvblxuLy8gJ3Jvb3QnIGlzIGp1c3QgYSBzbGFzaCwgb3Igbm90aGluZy5cbnZhciBzcGxpdFBhdGhSZSA9XG4gICAgL14oXFwvP3wpKFtcXHNcXFNdKj8pKCg/OlxcLnsxLDJ9fFteXFwvXSs/fCkoXFwuW14uXFwvXSp8KSkoPzpbXFwvXSopJC87XG52YXIgc3BsaXRQYXRoID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgcmV0dXJuIHNwbGl0UGF0aFJlLmV4ZWMoZmlsZW5hbWUpLnNsaWNlKDEpO1xufTtcblxuLy8gcGF0aC5yZXNvbHZlKFtmcm9tIC4uLl0sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZXNvbHZlID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXNvbHZlZFBhdGggPSAnJyxcbiAgICAgIHJlc29sdmVkQWJzb2x1dGUgPSBmYWxzZTtcblxuICBmb3IgKHZhciBpID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gLTEgJiYgIXJlc29sdmVkQWJzb2x1dGU7IGktLSkge1xuICAgIHZhciBwYXRoID0gKGkgPj0gMCkgPyBhcmd1bWVudHNbaV0gOiBwcm9jZXNzLmN3ZCgpO1xuXG4gICAgLy8gU2tpcCBlbXB0eSBhbmQgaW52YWxpZCBlbnRyaWVzXG4gICAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGgucmVzb2x2ZSBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9IGVsc2UgaWYgKCFwYXRoKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICByZXNvbHZlZFBhdGggPSBwYXRoICsgJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgIHJlc29sdmVkQWJzb2x1dGUgPSBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xuICB9XG5cbiAgLy8gQXQgdGhpcyBwb2ludCB0aGUgcGF0aCBzaG91bGQgYmUgcmVzb2x2ZWQgdG8gYSBmdWxsIGFic29sdXRlIHBhdGgsIGJ1dFxuICAvLyBoYW5kbGUgcmVsYXRpdmUgcGF0aHMgdG8gYmUgc2FmZSAobWlnaHQgaGFwcGVuIHdoZW4gcHJvY2Vzcy5jd2QoKSBmYWlscylcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcmVzb2x2ZWRQYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHJlc29sdmVkUGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFyZXNvbHZlZEFic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgcmV0dXJuICgocmVzb2x2ZWRBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHJlc29sdmVkUGF0aCkgfHwgJy4nO1xufTtcblxuLy8gcGF0aC5ub3JtYWxpemUocGF0aClcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMubm9ybWFsaXplID0gZnVuY3Rpb24ocGF0aCkge1xuICB2YXIgaXNBYnNvbHV0ZSA9IGV4cG9ydHMuaXNBYnNvbHV0ZShwYXRoKSxcbiAgICAgIHRyYWlsaW5nU2xhc2ggPSBzdWJzdHIocGF0aCwgLTEpID09PSAnLyc7XG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFpc0Fic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgaWYgKCFwYXRoICYmICFpc0Fic29sdXRlKSB7XG4gICAgcGF0aCA9ICcuJztcbiAgfVxuICBpZiAocGF0aCAmJiB0cmFpbGluZ1NsYXNoKSB7XG4gICAgcGF0aCArPSAnLyc7XG4gIH1cblxuICByZXR1cm4gKGlzQWJzb2x1dGUgPyAnLycgOiAnJykgKyBwYXRoO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5pc0Fic29sdXRlID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuam9pbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcGF0aHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICByZXR1cm4gZXhwb3J0cy5ub3JtYWxpemUoZmlsdGVyKHBhdGhzLCBmdW5jdGlvbihwLCBpbmRleCkge1xuICAgIGlmICh0eXBlb2YgcCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLmpvaW4gbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfVxuICAgIHJldHVybiBwO1xuICB9KS5qb2luKCcvJykpO1xufTtcblxuXG4vLyBwYXRoLnJlbGF0aXZlKGZyb20sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZWxhdGl2ZSA9IGZ1bmN0aW9uKGZyb20sIHRvKSB7XG4gIGZyb20gPSBleHBvcnRzLnJlc29sdmUoZnJvbSkuc3Vic3RyKDEpO1xuICB0byA9IGV4cG9ydHMucmVzb2x2ZSh0bykuc3Vic3RyKDEpO1xuXG4gIGZ1bmN0aW9uIHRyaW0oYXJyKSB7XG4gICAgdmFyIHN0YXJ0ID0gMDtcbiAgICBmb3IgKDsgc3RhcnQgPCBhcnIubGVuZ3RoOyBzdGFydCsrKSB7XG4gICAgICBpZiAoYXJyW3N0YXJ0XSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIHZhciBlbmQgPSBhcnIubGVuZ3RoIC0gMTtcbiAgICBmb3IgKDsgZW5kID49IDA7IGVuZC0tKSB7XG4gICAgICBpZiAoYXJyW2VuZF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoc3RhcnQgPiBlbmQpIHJldHVybiBbXTtcbiAgICByZXR1cm4gYXJyLnNsaWNlKHN0YXJ0LCBlbmQgLSBzdGFydCArIDEpO1xuICB9XG5cbiAgdmFyIGZyb21QYXJ0cyA9IHRyaW0oZnJvbS5zcGxpdCgnLycpKTtcbiAgdmFyIHRvUGFydHMgPSB0cmltKHRvLnNwbGl0KCcvJykpO1xuXG4gIHZhciBsZW5ndGggPSBNYXRoLm1pbihmcm9tUGFydHMubGVuZ3RoLCB0b1BhcnRzLmxlbmd0aCk7XG4gIHZhciBzYW1lUGFydHNMZW5ndGggPSBsZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZnJvbVBhcnRzW2ldICE9PSB0b1BhcnRzW2ldKSB7XG4gICAgICBzYW1lUGFydHNMZW5ndGggPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdmFyIG91dHB1dFBhcnRzID0gW107XG4gIGZvciAodmFyIGkgPSBzYW1lUGFydHNMZW5ndGg7IGkgPCBmcm9tUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBvdXRwdXRQYXJ0cy5wdXNoKCcuLicpO1xuICB9XG5cbiAgb3V0cHV0UGFydHMgPSBvdXRwdXRQYXJ0cy5jb25jYXQodG9QYXJ0cy5zbGljZShzYW1lUGFydHNMZW5ndGgpKTtcblxuICByZXR1cm4gb3V0cHV0UGFydHMuam9pbignLycpO1xufTtcblxuZXhwb3J0cy5zZXAgPSAnLyc7XG5leHBvcnRzLmRlbGltaXRlciA9ICc6JztcblxuZXhwb3J0cy5kaXJuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICB2YXIgcmVzdWx0ID0gc3BsaXRQYXRoKHBhdGgpLFxuICAgICAgcm9vdCA9IHJlc3VsdFswXSxcbiAgICAgIGRpciA9IHJlc3VsdFsxXTtcblxuICBpZiAoIXJvb3QgJiYgIWRpcikge1xuICAgIC8vIE5vIGRpcm5hbWUgd2hhdHNvZXZlclxuICAgIHJldHVybiAnLic7XG4gIH1cblxuICBpZiAoZGlyKSB7XG4gICAgLy8gSXQgaGFzIGEgZGlybmFtZSwgc3RyaXAgdHJhaWxpbmcgc2xhc2hcbiAgICBkaXIgPSBkaXIuc3Vic3RyKDAsIGRpci5sZW5ndGggLSAxKTtcbiAgfVxuXG4gIHJldHVybiByb290ICsgZGlyO1xufTtcblxuXG5leHBvcnRzLmJhc2VuYW1lID0gZnVuY3Rpb24ocGF0aCwgZXh0KSB7XG4gIHZhciBmID0gc3BsaXRQYXRoKHBhdGgpWzJdO1xuICAvLyBUT0RPOiBtYWtlIHRoaXMgY29tcGFyaXNvbiBjYXNlLWluc2Vuc2l0aXZlIG9uIHdpbmRvd3M/XG4gIGlmIChleHQgJiYgZi5zdWJzdHIoLTEgKiBleHQubGVuZ3RoKSA9PT0gZXh0KSB7XG4gICAgZiA9IGYuc3Vic3RyKDAsIGYubGVuZ3RoIC0gZXh0Lmxlbmd0aCk7XG4gIH1cbiAgcmV0dXJuIGY7XG59O1xuXG5cbmV4cG9ydHMuZXh0bmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHNwbGl0UGF0aChwYXRoKVszXTtcbn07XG5cbmZ1bmN0aW9uIGZpbHRlciAoeHMsIGYpIHtcbiAgICBpZiAoeHMuZmlsdGVyKSByZXR1cm4geHMuZmlsdGVyKGYpO1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChmKHhzW2ldLCBpLCB4cykpIHJlcy5wdXNoKHhzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuLy8gU3RyaW5nLnByb3RvdHlwZS5zdWJzdHIgLSBuZWdhdGl2ZSBpbmRleCBkb24ndCB3b3JrIGluIElFOFxudmFyIHN1YnN0ciA9ICdhYicuc3Vic3RyKC0xKSA9PT0gJ2InXG4gICAgPyBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7IHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pIH1cbiAgICA6IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSBzdHIubGVuZ3RoICsgc3RhcnQ7XG4gICAgICAgIHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pO1xuICAgIH1cbjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9wYXRoLWJyb3dzZXJpZnkvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAxNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IDcgOCA5IDEwIDExXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL3NyYy9hdWRpby1tYW5hZ2VyJyk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9wb3Rpb24tYXVkaW8vaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAxN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IDcgOCA5IDEwIDExXG4gKiovIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuICAgIHZhciBjdXJyZW50UXVldWU7XG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtpXSgpO1xuICAgICAgICB9XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbn1cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgcXVldWUucHVzaChmdW4pO1xuICAgIGlmICghZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9wcm9jZXNzL2Jyb3dzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IDcgOCA5IDEwIDExXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMTlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUgNiA3IDggOSAxMCAxMVxuICoqLyIsInZhciBMb2FkZWRBdWRpbyA9IHJlcXVpcmUoJy4vbG9hZGVkLWF1ZGlvJyk7XG5cbnZhciBBdWRpb01hbmFnZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIEF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcblxuICB0aGlzLmN0eCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAgdGhpcy5tYXN0ZXJHYWluID0gdGhpcy5jdHguY3JlYXRlR2FpbigpO1xuICB0aGlzLl92b2x1bWUgPSAxO1xuXG4gIHZhciBpT1MgPSAvKGlQYWR8aVBob25lfGlQb2QpL2cudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgaWYgKGlPUykge1xuICAgIHRoaXMuX2VuYWJsZWlPUygpO1xuICB9XG59O1xuXG5BdWRpb01hbmFnZXIucHJvdG90eXBlLl9lbmFibGVpT1MgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciB0b3VjaCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBidWZmZXIgPSBzZWxmLmN0eC5jcmVhdGVCdWZmZXIoMSwgMSwgMjIwNTApO1xuICAgIHZhciBzb3VyY2UgPSBzZWxmLmN0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbiAgICBzb3VyY2UuYnVmZmVyID0gYnVmZmVyO1xuICAgIHNvdXJjZS5jb25uZWN0KHNlbGYuY3R4LmRlc3RpbmF0aW9uKTtcbiAgICBzb3VyY2Uuc3RhcnQoMCk7XG5cbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRvdWNoLCBmYWxzZSk7XG4gIH07XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0b3VjaCwgZmFsc2UpO1xufTtcblxuQXVkaW9NYW5hZ2VyLnByb3RvdHlwZS5zZXRWb2x1bWUgPSBmdW5jdGlvbih2b2x1bWUpIHtcbiAgdGhpcy5fdm9sdW1lID0gdm9sdW1lO1xuICB0aGlzLm1hc3RlckdhaW4uZ2Fpbi52YWx1ZSA9IHZvbHVtZTtcbn07XG5cbkF1ZGlvTWFuYWdlci5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uKHVybCwgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIHJlcXVlc3Qub3BlbignR0VUJywgdXJsLCB0cnVlKTtcbiAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIHNlbGYuZGVjb2RlQXVkaW9EYXRhKHJlcXVlc3QucmVzcG9uc2UsIGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgY2FsbGJhY2soc291cmNlKTtcbiAgICB9KTtcbiAgfTtcbiAgcmVxdWVzdC5zZW5kKCk7XG59O1xuXG5BdWRpb01hbmFnZXIucHJvdG90eXBlLmRlY29kZUF1ZGlvRGF0YSA9IGZ1bmN0aW9uKGRhdGEsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB0aGlzLmN0eC5kZWNvZGVBdWRpb0RhdGEoZGF0YSwgZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgdmFyIGF1ZGlvID0gbmV3IExvYWRlZEF1ZGlvKHNlbGYuY3R4LCByZXN1bHQsIHNlbGYubWFzdGVyR2Fpbik7XG5cbiAgICBjYWxsYmFjayhhdWRpbyk7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBdWRpb01hbmFnZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9wb3Rpb24tYXVkaW8vc3JjL2F1ZGlvLW1hbmFnZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IDcgOCA5IDEwIDExXG4gKiovIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC9+L2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IDcgOCA5IDEwIDExXG4gKiovIiwidmFyIFBsYXlpbmdBdWRpbyA9IHJlcXVpcmUoJy4vcGxheWluZy1hdWRpbycpO1xuXG52YXIgTG9hZGVkQXVkaW8gPSBmdW5jdGlvbihjdHgsIGJ1ZmZlciwgbWFzdGVyR2Fpbikge1xuICB0aGlzLl9jdHggPSBjdHg7XG4gIHRoaXMuX21hc3RlckdhaW4gPSBtYXN0ZXJHYWluO1xuICB0aGlzLl9idWZmZXIgPSBidWZmZXI7XG4gIHRoaXMuX2J1ZmZlci5sb29wID0gZmFsc2U7XG59O1xuXG5Mb2FkZWRBdWRpby5wcm90b3R5cGUuX2NyZWF0ZVNvdW5kID0gZnVuY3Rpb24oZ2Fpbikge1xuICB2YXIgc291cmNlID0gdGhpcy5fY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICBzb3VyY2UuYnVmZmVyID0gdGhpcy5fYnVmZmVyO1xuXG4gIHRoaXMuX21hc3RlckdhaW4uY29ubmVjdCh0aGlzLl9jdHguZGVzdGluYXRpb24pO1xuXG4gIGdhaW4uY29ubmVjdCh0aGlzLl9tYXN0ZXJHYWluKTtcblxuICBzb3VyY2UuY29ubmVjdChnYWluKTtcblxuICByZXR1cm4gc291cmNlO1xufTtcblxuTG9hZGVkQXVkaW8ucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGdhaW4gPSB0aGlzLl9jdHguY3JlYXRlR2FpbigpO1xuXG4gIHZhciBzb3VuZCA9IHRoaXMuX2NyZWF0ZVNvdW5kKGdhaW4pO1xuXG4gIHNvdW5kLnN0YXJ0KDApO1xuXG4gIHJldHVybiBuZXcgUGxheWluZ0F1ZGlvKHNvdW5kLCBnYWluKTtcbn07XG5cbkxvYWRlZEF1ZGlvLnByb3RvdHlwZS5mYWRlSW4gPSBmdW5jdGlvbih2YWx1ZSwgdGltZSkge1xuICB2YXIgZ2FpbiA9IHRoaXMuX2N0eC5jcmVhdGVHYWluKCk7XG5cbiAgdmFyIHNvdW5kID0gdGhpcy5fY3JlYXRlU291bmQoZ2Fpbik7XG5cbiAgZ2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKDAsIDApO1xuICBnYWluLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMC4wMSwgMCk7XG4gIGdhaW4uZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSh2YWx1ZSwgdGltZSk7XG5cbiAgc291bmQuc3RhcnQoMCk7XG5cbiAgcmV0dXJuIG5ldyBQbGF5aW5nQXVkaW8oc291bmQsIGdhaW4pO1xufTtcblxuTG9hZGVkQXVkaW8ucHJvdG90eXBlLmxvb3AgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGdhaW4gPSB0aGlzLl9jdHguY3JlYXRlR2FpbigpO1xuXG4gIHZhciBzb3VuZCA9IHRoaXMuX2NyZWF0ZVNvdW5kKGdhaW4pO1xuXG4gIHNvdW5kLmxvb3AgPSB0cnVlO1xuICBzb3VuZC5zdGFydCgwKTtcblxuICByZXR1cm4gbmV3IFBsYXlpbmdBdWRpbyhzb3VuZCwgZ2Fpbik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvYWRlZEF1ZGlvO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcG90aW9uLWF1ZGlvL3NyYy9sb2FkZWQtYXVkaW8uanNcbiAqKiBtb2R1bGUgaWQgPSAyMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IDcgOCA5IDEwIDExXG4gKiovIiwidmFyIFBsYXlpbmdBdWRpbyA9IGZ1bmN0aW9uKHNvdXJjZSwgZ2Fpbikge1xuICB0aGlzLl9nYWluID0gZ2FpbjtcbiAgdGhpcy5fc291cmNlID0gc291cmNlO1xufTtcblxuUGxheWluZ0F1ZGlvLnByb3RvdHlwZS5zZXRWb2x1bWUgPSBmdW5jdGlvbih2b2x1bWUpIHtcbiAgdGhpcy5fZ2Fpbi5nYWluLnZhbHVlID0gdm9sdW1lO1xufTtcblxuUGxheWluZ0F1ZGlvLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3NvdXJjZS5zdG9wKDApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5aW5nQXVkaW87XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9wb3Rpb24tYXVkaW8vc3JjL3BsYXlpbmctYXVkaW8uanNcbiAqKiBtb2R1bGUgaWQgPSAyM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IDcgOCA5IDEwIDExXG4gKiovIl0sInNvdXJjZVJvb3QiOiIiLCJmaWxlIjoiZGVtby1wYXJ0aWNsZXMuanMifQ==