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
/******/ 	__webpack_require__.p = "/build/";
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
	    return engine.app;
	  }
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	__webpack_require__(3)();
	
	var App = __webpack_require__(4);
	
	var Time = __webpack_require__(5);
	
	var Debugger = __webpack_require__(7);
	
	var StateManager = __webpack_require__(6);
	
	/**
	 * Main Engine class which calls the app methods
	 * @constructor
	 */
	var Engine = function Engine(container, methods) {
	  var AppClass = this._subclassApp(container, methods);
	
	  container.style.position = "relative";
	
	  var canvas = document.createElement("canvas");
	  canvas.style.display = "block";
	  container.appendChild(canvas);
	
	  this.app = new AppClass(canvas);
	  this.app.debug = new Debugger(this.app);
	
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
	
	  this.app.assets.onload((function () {
	    window.cancelAnimationFrame(this.preloaderId);
	    this.app._preloader.exit();
	
	    this.start();
	  }).bind(this));
	
	  if (this.app.assets.isLoading && this.app.config.showPreloader) {
	    this.preloaderId = window.requestAnimationFrame(this.preloaderTickFunc);
	  }
	};
	
	/**
	 * Add event listener for window events
	 * @private
	 */
	Engine.prototype.addEvents = function () {
	  var self = this;
	
	  window.addEventListener("blur", function () {
	    self.app.input.resetKeys();
	    self.app.blur();
	  });
	
	  window.addEventListener("focus", function () {
	    self.app.input.resetKeys();
	    self.app.focus();
	  });
	};
	
	/**
	 * Starts the app, adds events and run first frame
	 * @private
	 */
	Engine.prototype.start = function () {
	  if (this.app.config.addInputEvents) {
	    this.addEvents();
	  }
	
	  window.requestAnimationFrame(this.tickFunc);
	};
	
	/**
	 * Main tick function in app loop
	 * @private
	 */
	Engine.prototype.tick = function () {
	  window.requestAnimationFrame(this.tickFunc);
	
	  this.app.debug.begin();
	
	  var now = Time.now();
	  var time = (now - this._time) / 1000;
	  this._time = now;
	
	  this.app.debug.perf("update");
	  this.update(time);
	  this.app.debug.stopPerf("update");
	
	  this.app.states.exitUpdate(time);
	
	  this.app.debug.perf("render");
	  this.render();
	  this.app.debug.stopPerf("render");
	
	  this.app.debug.render();
	
	  this.app.debug.end();
	};
	
	/**
	 * Updates the app
	 * @param {number} time - time in seconds since last frame
	 * @private
	 */
	Engine.prototype.update = function (time) {
	  if (time > this.app.config.maxStepTime) {
	    time = this.app.config.maxStepTime;
	  }
	
	  if (this.app.config.fixedStep) {
	    this.strayTime = this.strayTime + time;
	    while (this.strayTime >= this.app.config.stepTime) {
	      this.strayTime = this.strayTime - this.app.config.stepTime;
	      this.app.states.update(this.app.config.stepTime);
	    }
	  } else {
	    this.app.states.update(time);
	  }
	};
	
	/**
	 * Renders the app
	 * @private
	 */
	Engine.prototype.render = function () {
	  this.app.video.beginFrame();
	
	  this.app.video.clear();
	
	  this.app.states.render();
	
	  this.app.video.endFrame();
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
	
	  this.app.preloading(time);
	};
	
	Engine.prototype._setDefaultStates = function () {
	  var states = new StateManager();
	  states.add("app", this.app);
	  states.add("debug", this.app.debug);
	
	  states.protect("app");
	  states.protect("debug");
	  states.hide("debug");
	
	  this.app.states = states;
	};
	
	Engine.prototype._subclassApp = function (container, methods) {
	  var AppClass = function AppClass(container) {
	    App.call(this, container);
	  };
	
	  AppClass.prototype = Object.create(App.prototype);
	
	  for (var method in methods) {
	    AppClass.prototype[method] = methods[method];
	  }
	
	  return AppClass;
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
	var Loading = __webpack_require__(11);
	
	var App = function App(canvas) {
	  this.canvas = canvas;
	
	  this.width = 300;
	
	  this.height = 300;
	
	  this.assets = new Assets();
	
	  this.states = null;
	  this.debug = null;
	  this.input = null;
	  this.video = null;
	
	  this.config = {
	    allowHiDPI: true,
	    getCanvasContext: true,
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
	
	  this._preloader = new Loading(this);
	};
	
	App.prototype.setSize = function (width, height) {
	  this.width = width;
	  this.height = height;
	
	  if (this.video) {
	    this.video.setSize(width, height);
	  }
	};
	
	App.prototype.preloading = function (time) {
	  if (this.config.showPreloader) {
	    this._preloader.render(time);
	  }
	};
	
	App.prototype.configure = function () {};
	
	App.prototype.focus = function () {};
	
	App.prototype.blur = function () {};
	
	module.exports = App;

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

	var util = __webpack_require__(18);
	var DirtyManager = __webpack_require__(12);
	
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
	    allowHiDPI: true,
	    getCanvasContext: true
	  });
	
	  this.graph = app.video.createLayer({
	    allowHiDPI: false,
	    getCanvasContext: true
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
	var Video = function Video(app, canvas, config) {
	  this.app = app;
	
	  this.config = config;
	
	  this.canvas = canvas;
	
	  this.width = app.width;
	
	  this.height = app.height;
	
	  if (config.getCanvasContext) {
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
	
	Video.prototype.destroy = function () {
	  this.canvas.parentElement.removeChild(this.canvas);
	};
	
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
	
	  if (this.config.allowHiDPI && isRetina) {
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
	
	  var video = new Video(this.app, canvas, config);
	
	  return video;
	};
	
	module.exports = Video;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";
	
	var util = __webpack_require__(18);
	var path = __webpack_require__(19);
	
	var PotionAudio = __webpack_require__(20);
	
	var JsonLoader = __webpack_require__(15);
	var imageLoader = __webpack_require__(16);
	var textLoader = __webpack_require__(17);
	
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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var keys = __webpack_require__(14);
	
	var invKeys = {};
	for (var keyName in keys) {
	  invKeys[keys[keyName]] = keyName;
	}
	
	var Input = function Input(app, container) {
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
	
	  this._addEvents(app);
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
	
	Input.prototype._addEvents = function (app) {
	  var self = this;
	
	  var mouseEvent = {
	    x: null,
	    y: null,
	    button: null,
	    event: null,
	    stateStopEvent: function stateStopEvent() {
	      app.states._preventEvent = true;
	    }
	  };
	
	  var keyboardEvent = {
	    key: null,
	    name: null,
	    event: null,
	    stateStopEvent: function stateStopEvent() {
	      app.states._preventEvent = true;
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
	
	    app.states.mousemove(mouseEvent);
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
	
	    app.states.mouseup(mouseEvent);
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
	
	    app.states.mousedown(mouseEvent);
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
	
	      app.states.mousedown(mouseEvent);
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
	
	      app.states.mousemove(mouseEvent);
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
	
	    app.states.mouseup(mouseEvent);
	  });
	
	  self._container.addEventListener("contextmenu", function (e) {
	    e.preventDefault();
	  });
	
	  document.addEventListener("keydown", function (e) {
	    self._keys[e.keyCode] = true;
	
	    keyboardEvent.key = e.which;
	    keyboardEvent.name = invKeys[e.which];
	    keyboardEvent.event = e;
	
	    app.states.keydown(keyboardEvent);
	  });
	
	  document.addEventListener("keyup", function (e) {
	    self._keys[e.keyCode] = false;
	
	    keyboardEvent.key = e.which;
	    keyboardEvent.name = invKeys[e.which];
	    keyboardEvent.event = e;
	
	    app.states.keyup(keyboardEvent);
	  });
	};
	
	module.exports = Input;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Loading = function Loading(app) {
	  this.app = app;
	
	  this.barWidth = 0;
	
	  this.video = app.video.createLayer({
	    allowHiDPI: true,
	    getCanvasContext: true
	  });
	
	  this.video.canvas.className += " test";
	};
	
	Loading.prototype.render = function (time) {
	  this.video.clear();
	
	  var color1 = "#b9ff71";
	  var color2 = "#8ac250";
	  var color3 = "#648e38";
	
	  var width = Math.min(this.app.width * 2 / 3, 300);
	  var height = 20;
	
	  var y = (this.app.height - height) / 2;
	  var x = (this.app.width - width) / 2;
	
	  var currentWidth = width * this.app.assets.progress;
	  this.barWidth = this.barWidth + (currentWidth - this.barWidth) * time * 10;
	
	  this.video.ctx.fillStyle = color2;
	  this.video.ctx.fillRect(0, 0, this.app.width, this.app.height);
	
	  this.video.ctx.font = "400 40px sans-serif";
	  this.video.ctx.textAlign = "center";
	  this.video.ctx.textBaseline = "bottom";
	
	  this.video.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
	  this.video.ctx.fillText("Potion.js", this.app.width / 2, y + 2);
	
	  this.video.ctx.fillStyle = "#d1ffa1";
	  this.video.ctx.fillText("Potion.js", this.app.width / 2, y);
	
	  this.video.ctx.strokeStyle = this.video.ctx.fillStyle = color3;
	  this.video.ctx.fillRect(x, y + 15, width, height);
	
	  this.video.ctx.lineWidth = 2;
	  this.video.ctx.beginPath();
	  this.video.ctx.rect(x - 5, y + 10, width + 10, height + 10);
	  this.video.ctx.closePath();
	  this.video.ctx.stroke();
	
	  this.video.ctx.strokeStyle = this.video.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
	  this.video.ctx.fillRect(x, y + 15, this.barWidth, height + 2);
	
	  this.video.ctx.lineWidth = 2;
	  this.video.ctx.beginPath();
	
	  this.video.ctx.moveTo(x + this.barWidth, y + 12);
	  this.video.ctx.lineTo(x - 5, y + 12);
	  this.video.ctx.lineTo(x - 5, y + 10 + height + 12);
	  this.video.ctx.lineTo(x + this.barWidth, y + 10 + height + 12);
	
	  this.video.ctx.stroke();
	  this.video.ctx.closePath();
	
	  this.video.ctx.strokeStyle = this.video.ctx.fillStyle = color1;
	  this.video.ctx.fillRect(x, y + 15, this.barWidth, height);
	
	  this.video.ctx.lineWidth = 2;
	  this.video.ctx.beginPath();
	
	  this.video.ctx.moveTo(x + this.barWidth, y + 10);
	  this.video.ctx.lineTo(x - 5, y + 10);
	  this.video.ctx.lineTo(x - 5, y + 10 + height + 10);
	  this.video.ctx.lineTo(x + this.barWidth, y + 10 + height + 10);
	
	  this.video.ctx.stroke();
	  this.video.ctx.closePath();
	};
	
	Loading.prototype.exit = function () {
	  this.video.destroy();
	};
	
	module.exports = Loading;

/***/ },
/* 12 */
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
/* 15 */
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
/* 16 */
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
/* 17 */
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
/* 18 */
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
	
	exports.isBuffer = __webpack_require__(22);
	
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
	exports.inherits = __webpack_require__(24);
	
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(21)))

/***/ },
/* 19 */
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(23);


/***/ },
/* 21 */
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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var LoadedAudio = __webpack_require__(25);
	
	var AudioManager = function() {
	  var AudioContext = window.AudioContext || window.webkitAudioContext;
	
	  this._ctx = new AudioContext();
	  this._masterGain = this._ctx.createGain();
	  this._volume = 1;
	  this.isMuted = false;
	
	  var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
	  if (iOS) {
	    this._enableiOS();
	  }
	};
	
	AudioManager.prototype._enableiOS = function() {
	  var self = this;
	
	  var touch = function() {
	    var buffer = self._ctx.createBuffer(1, 1, 22050);
	    var source = self._ctx.createBufferSource();
	    source.buffer = buffer;
	    source.connect(self._ctx.destination);
	    source.start(0);
	
	    window.removeEventListener('touchstart', touch, false);
	  };
	
	  window.addEventListener('touchstart', touch, false);
	};
	
	AudioManager.prototype.mute = function() {
	  this.isMuted = true;
	  this._updateMute();
	};
	
	AudioManager.prototype.unmute = function() {
	  this.isMuted = false;
	  this._updateMute();
	};
	
	AudioManager.prototype.toggleMute = function() {
	  this.isMuted = !this.isMuted;
	  this._updateMute();
	};
	
	AudioManager.prototype._updateMute = function() {
	  this._masterGain.gain.value = this.isMuted ? 0 : this._volume;
	};
	
	AudioManager.prototype.setVolume = function(volume) {
	  this._volume = volume;
	  this._masterGain.gain.value = volume;
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
	
	  this._ctx.decodeAudioData(data, function(result) {
	    var audio = new LoadedAudio(self._ctx, result, self._masterGain);
	
	    callback(audio);
	  });
	};
	
	module.exports = AudioManager;


/***/ },
/* 24 */
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
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var PlayingAudio = __webpack_require__(26);
	
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
/* 26 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzdhN2RiZTBjNzRkNjBjZDRmZmMiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VuZ2luZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmFmLXBvbHlmaWxsLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RpbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YXRlLW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wb3Rpb24tZGVidWdnZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZpZGVvLmpzIiwid2VicGFjazovLy8uL3NyYy9hc3NldHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2lucHV0LmpzIiwid2VicGFjazovLy8uL3NyYy9sb2FkaW5nLmpzIiwid2VicGFjazovLy8uL34vcG90aW9uLWRlYnVnZ2VyL2RpcnR5LW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JldGluYS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMva2V5cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbG9hZGVyL2pzb24tbG9hZGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9sb2FkZXIvaW1hZ2UtbG9hZGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9sb2FkZXIvdGV4dC1sb2FkZXIuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC91dGlsLmpzIiwid2VicGFjazovLy8od2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3BhdGgtYnJvd3NlcmlmeS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3BvdGlvbi1hdWRpby9pbmRleC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9+L3BvdGlvbi1hdWRpby9zcmMvYXVkaW8tbWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi91dGlsL34vaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9+L3BvdGlvbi1hdWRpby9zcmMvbG9hZGVkLWF1ZGlvLmpzIiwid2VicGFjazovLy8uL34vcG90aW9uLWF1ZGlvL3NyYy9wbGF5aW5nLWF1ZGlvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBUSxvQkFBb0I7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDRDOzs7Ozs7Ozs7O0FDeEZBLEtBQUksTUFBTSxHQUFHLG1CQUFPLENBQUMsQ0FBYyxDQUFDLENBQUM7O0FBRXJDLE9BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixPQUFJLEVBQUUsY0FBUyxNQUFNLEVBQUUsT0FBTyxFQUFFO0FBQzlCLFNBQUksTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFP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R0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDOztBQUVyQyxPQUFJLFlBQVksR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQ3BELE9BQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7O0FBRTNFLE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7QUFDbEMsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFL0QsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLHFCQUFxQixDQUFDO0FBQzVDLE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7QUFDcEMsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQzs7QUFFdkMsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLG9CQUFvQixDQUFDO0FBQ2hELE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFOUQsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUNyQyxPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFMUQsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7QUFDL0QsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFbEQsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUM3QixPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUMzQixPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEtBQUssR0FBRyxFQUFFLEVBQUUsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQzVELE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQzNCLE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDOztBQUV4QixPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLG9CQUFvQixDQUFDO0FBQzdFLE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFOUQsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUM3QixPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFM0IsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNqRCxPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDckMsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDbkQsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDOztBQUUvRCxPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN4QixPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFM0IsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7QUFDL0QsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRTFELE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDN0IsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRTNCLE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZDQUE0QyxLQUFLOztBQUVqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0Esb0NBQW1DLE9BQU87QUFDMUM7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLDBEQUF5RDtBQUN6RDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWCxVQUFTO0FBQ1Q7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLElBQUc7QUFDSDs7QUFFQTs7Ozs7OztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0EsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3RCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xuIFx0dmFyIHBhcmVudEpzb25wRnVuY3Rpb24gPSB3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl07XG4gXHR3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl0gPSBmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhjaHVua0lkcywgbW9yZU1vZHVsZXMpIHtcbiBcdFx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG4gXHRcdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuIFx0XHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwLCBjYWxsYmFja3MgPSBbXTtcbiBcdFx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG4gXHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKVxuIFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2guYXBwbHkoY2FsbGJhY2tzLCBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pO1xuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG4gXHRcdH1cbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdH1cbiBcdFx0aWYocGFyZW50SnNvbnBGdW5jdGlvbikgcGFyZW50SnNvbnBGdW5jdGlvbihjaHVua0lkcywgbW9yZU1vZHVsZXMpO1xuIFx0XHR3aGlsZShjYWxsYmFja3MubGVuZ3RoKVxuIFx0XHRcdGNhbGxiYWNrcy5zaGlmdCgpLmNhbGwobnVsbCwgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4gXHRcdGlmKG1vcmVNb2R1bGVzWzBdKSB7XG4gXHRcdFx0aW5zdGFsbGVkTW9kdWxlc1swXSA9IDA7XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4gXHQvLyBcIjBcIiBtZWFucyBcImFscmVhZHkgbG9hZGVkXCJcbiBcdC8vIEFycmF5IG1lYW5zIFwibG9hZGluZ1wiLCBhcnJheSBjb250YWlucyBjYWxsYmFja3NcbiBcdHZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG4gXHRcdDEyOjBcbiBcdH07XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuIFx0Ly8gVGhpcyBmaWxlIGNvbnRhaW5zIG9ubHkgdGhlIGVudHJ5IGNodW5rLlxuIFx0Ly8gVGhlIGNodW5rIGxvYWRpbmcgZnVuY3Rpb24gZm9yIGFkZGl0aW9uYWwgY2h1bmtzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmUgPSBmdW5jdGlvbiByZXF1aXJlRW5zdXJlKGNodW5rSWQsIGNhbGxiYWNrKSB7XG4gXHRcdC8vIFwiMFwiIGlzIHRoZSBzaWduYWwgZm9yIFwiYWxyZWFkeSBsb2FkZWRcIlxuIFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApXG4gXHRcdFx0cmV0dXJuIGNhbGxiYWNrLmNhbGwobnVsbCwgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gYW4gYXJyYXkgbWVhbnMgXCJjdXJyZW50bHkgbG9hZGluZ1wiLlxuIFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gIT09IHVuZGVmaW5lZCkge1xuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXS5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHQvLyBzdGFydCBjaHVuayBsb2FkaW5nXG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gW2NhbGxiYWNrXTtcbiBcdFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gXHRcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuIFx0XHRcdHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gXHRcdFx0c2NyaXB0LmNoYXJzZXQgPSAndXRmLTgnO1xuIFx0XHRcdHNjcmlwdC5hc3luYyA9IHRydWU7XG4gXHRcdFx0c2NyaXB0LnNyYyA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBjaHVua0lkICsgXCIuY2h1bmsuanNcIjtcbiBcdFx0XHRoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2J1aWxkL1wiO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDM3YTdkYmUwYzc0ZDYwY2Q0ZmZjXG4gKiovIiwidmFyIEVuZ2luZSA9IHJlcXVpcmUoJy4vc3JjL2VuZ2luZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaW5pdDogZnVuY3Rpb24oY2FudmFzLCBtZXRob2RzKSB7XG4gICAgdmFyIGVuZ2luZSA9IG5ldyBFbmdpbmUoY2FudmFzLCBtZXRob2RzKTtcbiAgICByZXR1cm4gZW5naW5lLmFwcDtcbiAgfVxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vaW5kZXguanNcbiAqKi8iLCJyZXF1aXJlKCcuL3JhZi1wb2x5ZmlsbCcpKCk7XG5cbnZhciBBcHAgPSByZXF1aXJlKCcuL2FwcCcpO1xuXG52YXIgVGltZSA9IHJlcXVpcmUoJy4vdGltZScpO1xuXG52YXIgRGVidWdnZXIgPSByZXF1aXJlKCdwb3Rpb24tZGVidWdnZXInKTtcblxudmFyIFN0YXRlTWFuYWdlciA9IHJlcXVpcmUoJy4vc3RhdGUtbWFuYWdlcicpO1xuXG4vKipcbiAqIE1haW4gRW5naW5lIGNsYXNzIHdoaWNoIGNhbGxzIHRoZSBhcHAgbWV0aG9kc1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBFbmdpbmUgPSBmdW5jdGlvbihjb250YWluZXIsIG1ldGhvZHMpIHtcbiAgdmFyIEFwcENsYXNzID0gdGhpcy5fc3ViY2xhc3NBcHAoY29udGFpbmVyLCBtZXRob2RzKTtcblxuICBjb250YWluZXIuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuXG4gIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgY2FudmFzLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2FudmFzKTtcblxuICB0aGlzLmFwcCA9IG5ldyBBcHBDbGFzcyhjYW52YXMpO1xuICB0aGlzLmFwcC5kZWJ1ZyA9IG5ldyBEZWJ1Z2dlcih0aGlzLmFwcCk7XG5cbiAgdGhpcy5fc2V0RGVmYXVsdFN0YXRlcygpO1xuXG4gIHRoaXMudGlja0Z1bmMgPSAoZnVuY3Rpb24gKHNlbGYpIHsgcmV0dXJuIGZ1bmN0aW9uKCkgeyBzZWxmLnRpY2soKTsgfTsgfSkodGhpcyk7XG4gIHRoaXMucHJlbG9hZGVyVGlja0Z1bmMgPSAoZnVuY3Rpb24gKHNlbGYpIHsgcmV0dXJuIGZ1bmN0aW9uKCkgeyBzZWxmLl9wcmVsb2FkZXJUaWNrKCk7IH07IH0pKHRoaXMpO1xuXG4gIHRoaXMuc3RyYXlUaW1lID0gMDtcblxuICB0aGlzLl90aW1lID0gVGltZS5ub3coKTtcblxuICB0aGlzLmFwcC5hc3NldHMub25sb2FkKGZ1bmN0aW9uKCkge1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnByZWxvYWRlcklkKTtcbiAgICB0aGlzLmFwcC5fcHJlbG9hZGVyLmV4aXQoKTtcblxuICAgIHRoaXMuc3RhcnQoKTtcbiAgfS5iaW5kKHRoaXMpKTtcblxuICBpZiAodGhpcy5hcHAuYXNzZXRzLmlzTG9hZGluZyAmJiB0aGlzLmFwcC5jb25maWcuc2hvd1ByZWxvYWRlcikge1xuICAgIHRoaXMucHJlbG9hZGVySWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucHJlbG9hZGVyVGlja0Z1bmMpO1xuICB9XG59O1xuXG4vKipcbiAqIEFkZCBldmVudCBsaXN0ZW5lciBmb3Igd2luZG93IGV2ZW50c1xuICogQHByaXZhdGVcbiAqL1xuRW5naW5lLnByb3RvdHlwZS5hZGRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24oKSB7XG4gICAgc2VsZi5hcHAuaW5wdXQucmVzZXRLZXlzKCk7XG4gICAgc2VsZi5hcHAuYmx1cigpO1xuICB9KTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbigpIHtcbiAgICBzZWxmLmFwcC5pbnB1dC5yZXNldEtleXMoKTtcbiAgICBzZWxmLmFwcC5mb2N1cygpO1xuICB9KTtcbn07XG5cbi8qKlxuICogU3RhcnRzIHRoZSBhcHAsIGFkZHMgZXZlbnRzIGFuZCBydW4gZmlyc3QgZnJhbWVcbiAqIEBwcml2YXRlXG4gKi9cbkVuZ2luZS5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuYXBwLmNvbmZpZy5hZGRJbnB1dEV2ZW50cykge1xuICAgIHRoaXMuYWRkRXZlbnRzKCk7XG4gIH1cblxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGlja0Z1bmMpO1xufTtcblxuLyoqXG4gKiBNYWluIHRpY2sgZnVuY3Rpb24gaW4gYXBwIGxvb3BcbiAqIEBwcml2YXRlXG4gKi9cbkVuZ2luZS5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKCkge1xuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGlja0Z1bmMpO1xuXG4gIHRoaXMuYXBwLmRlYnVnLmJlZ2luKCk7XG5cbiAgdmFyIG5vdyA9IFRpbWUubm93KCk7XG4gIHZhciB0aW1lID0gKG5vdyAtIHRoaXMuX3RpbWUpIC8gMTAwMDtcbiAgdGhpcy5fdGltZSA9IG5vdztcblxuICB0aGlzLmFwcC5kZWJ1Zy5wZXJmKCd1cGRhdGUnKTtcbiAgdGhpcy51cGRhdGUodGltZSk7XG4gIHRoaXMuYXBwLmRlYnVnLnN0b3BQZXJmKCd1cGRhdGUnKTtcblxuICB0aGlzLmFwcC5zdGF0ZXMuZXhpdFVwZGF0ZSh0aW1lKTtcblxuICB0aGlzLmFwcC5kZWJ1Zy5wZXJmKCdyZW5kZXInKTtcbiAgdGhpcy5yZW5kZXIoKTtcbiAgdGhpcy5hcHAuZGVidWcuc3RvcFBlcmYoJ3JlbmRlcicpO1xuXG4gIHRoaXMuYXBwLmRlYnVnLnJlbmRlcigpO1xuXG4gIHRoaXMuYXBwLmRlYnVnLmVuZCgpO1xufTtcblxuLyoqXG4gKiBVcGRhdGVzIHRoZSBhcHBcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lIC0gdGltZSBpbiBzZWNvbmRzIHNpbmNlIGxhc3QgZnJhbWVcbiAqIEBwcml2YXRlXG4gKi9cbkVuZ2luZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICBpZiAodGltZSA+IHRoaXMuYXBwLmNvbmZpZy5tYXhTdGVwVGltZSkgeyB0aW1lID0gdGhpcy5hcHAuY29uZmlnLm1heFN0ZXBUaW1lOyB9XG5cbiAgaWYgKHRoaXMuYXBwLmNvbmZpZy5maXhlZFN0ZXApIHtcbiAgICB0aGlzLnN0cmF5VGltZSA9IHRoaXMuc3RyYXlUaW1lICsgdGltZTtcbiAgICB3aGlsZSAodGhpcy5zdHJheVRpbWUgPj0gdGhpcy5hcHAuY29uZmlnLnN0ZXBUaW1lKSB7XG4gICAgICB0aGlzLnN0cmF5VGltZSA9IHRoaXMuc3RyYXlUaW1lIC0gdGhpcy5hcHAuY29uZmlnLnN0ZXBUaW1lO1xuICAgICAgdGhpcy5hcHAuc3RhdGVzLnVwZGF0ZSh0aGlzLmFwcC5jb25maWcuc3RlcFRpbWUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLmFwcC5zdGF0ZXMudXBkYXRlKHRpbWUpO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbmRlcnMgdGhlIGFwcFxuICogQHByaXZhdGVcbiAqL1xuRW5naW5lLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5hcHAudmlkZW8uYmVnaW5GcmFtZSgpO1xuXG4gIHRoaXMuYXBwLnZpZGVvLmNsZWFyKCk7XG5cbiAgdGhpcy5hcHAuc3RhdGVzLnJlbmRlcigpO1xuXG4gIHRoaXMuYXBwLnZpZGVvLmVuZEZyYW1lKCk7XG59O1xuXG4vKipcbiAqIE1haW4gdGljayBmdW5jdGlvbiBpbiBwcmVsb2FkZXIgbG9vcFxuICogQHByaXZhdGVcbiAqL1xuRW5naW5lLnByb3RvdHlwZS5fcHJlbG9hZGVyVGljayA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnByZWxvYWRlcklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnByZWxvYWRlclRpY2tGdW5jKTtcblxuICB2YXIgbm93ID0gVGltZS5ub3coKTtcbiAgdmFyIHRpbWUgPSAobm93IC0gdGhpcy5fdGltZSkgLyAxMDAwO1xuICB0aGlzLl90aW1lID0gbm93O1xuXG4gIHRoaXMuYXBwLnByZWxvYWRpbmcodGltZSk7XG59O1xuXG5FbmdpbmUucHJvdG90eXBlLl9zZXREZWZhdWx0U3RhdGVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzdGF0ZXMgPSBuZXcgU3RhdGVNYW5hZ2VyKCk7XG4gIHN0YXRlcy5hZGQoJ2FwcCcsIHRoaXMuYXBwKTtcbiAgc3RhdGVzLmFkZCgnZGVidWcnLCB0aGlzLmFwcC5kZWJ1Zyk7XG5cbiAgc3RhdGVzLnByb3RlY3QoJ2FwcCcpO1xuICBzdGF0ZXMucHJvdGVjdCgnZGVidWcnKTtcbiAgc3RhdGVzLmhpZGUoJ2RlYnVnJyk7XG5cbiAgdGhpcy5hcHAuc3RhdGVzID0gc3RhdGVzO1xufTtcblxuRW5naW5lLnByb3RvdHlwZS5fc3ViY2xhc3NBcHAgPSBmdW5jdGlvbihjb250YWluZXIsIG1ldGhvZHMpIHtcbiAgdmFyIEFwcENsYXNzID0gZnVuY3Rpb24oY29udGFpbmVyKSB7XG4gICAgQXBwLmNhbGwodGhpcywgY29udGFpbmVyKTtcbiAgfTtcblxuICBBcHBDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFwcC5wcm90b3R5cGUpO1xuXG4gIGZvciAodmFyIG1ldGhvZCBpbiBtZXRob2RzKSB7XG4gICAgQXBwQ2xhc3MucHJvdG90eXBlW21ldGhvZF0gPSBtZXRob2RzW21ldGhvZF07XG4gIH1cblxuICByZXR1cm4gQXBwQ2xhc3M7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVuZ2luZTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VuZ2luZS5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBsYXN0VGltZSA9IDA7XG4gIHZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcblxuICBmb3IgKHZhciBpPTA7IGk8dmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsraSkge1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1tpXSsnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbaV0rJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgd2luZG93W3ZlbmRvcnNbaV0rJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICB9XG5cbiAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuXG4gICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTtcbiAgICAgIH0sIHRpbWVUb0NhbGwpO1xuXG4gICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbiAgICAgIHJldHVybiBpZDtcbiAgICB9O1xuICB9XG5cbiAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpIHtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihpZCkgeyBjbGVhclRpbWVvdXQoaWQpOyB9O1xuICB9XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmFmLXBvbHlmaWxsLmpzXG4gKiovIiwidmFyIFZpZGVvID0gcmVxdWlyZSgnLi92aWRlbycpO1xudmFyIEFzc2V0cyA9IHJlcXVpcmUoJy4vYXNzZXRzJyk7XG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG52YXIgTG9hZGluZyA9IHJlcXVpcmUoJy4vbG9hZGluZycpO1xuXG52YXIgQXBwID0gZnVuY3Rpb24oY2FudmFzKSB7XG4gIHRoaXMuY2FudmFzID0gY2FudmFzO1xuXG4gIHRoaXMud2lkdGggPSAzMDA7XG5cbiAgdGhpcy5oZWlnaHQgPSAzMDA7XG5cbiAgdGhpcy5hc3NldHMgPSBuZXcgQXNzZXRzKCk7XG5cbiAgdGhpcy5zdGF0ZXMgPSBudWxsO1xuICB0aGlzLmRlYnVnID0gbnVsbDtcbiAgdGhpcy5pbnB1dCA9IG51bGw7XG4gIHRoaXMudmlkZW8gPSBudWxsO1xuXG4gIHRoaXMuY29uZmlnID0ge1xuICAgIGFsbG93SGlEUEk6IHRydWUsXG4gICAgZ2V0Q2FudmFzQ29udGV4dDogdHJ1ZSxcbiAgICBpbml0aWFsaXplVmlkZW86IHRydWUsXG4gICAgYWRkSW5wdXRFdmVudHM6IHRydWUsXG4gICAgc2hvd1ByZWxvYWRlcjogdHJ1ZSxcbiAgICBmaXhlZFN0ZXA6IGZhbHNlLFxuICAgIHN0ZXBUaW1lOiAwLjAxNjY2LFxuICAgIG1heFN0ZXBUaW1lOiAwLjAxNjY2XG4gIH07XG5cbiAgdGhpcy5jb25maWd1cmUoKTtcblxuICBpZiAodGhpcy5jb25maWcuaW5pdGlhbGl6ZVZpZGVvKSB7XG4gICAgdGhpcy52aWRlbyA9IG5ldyBWaWRlbyh0aGlzLCBjYW52YXMsIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGlmICh0aGlzLmNvbmZpZy5hZGRJbnB1dEV2ZW50cykge1xuICAgIHRoaXMuaW5wdXQgPSBuZXcgSW5wdXQodGhpcywgY2FudmFzLnBhcmVudEVsZW1lbnQpO1xuICB9XG5cbiAgdGhpcy5fcHJlbG9hZGVyID0gbmV3IExvYWRpbmcodGhpcyk7XG59O1xuXG5BcHAucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgaWYgKHRoaXMudmlkZW8pIHtcbiAgICB0aGlzLnZpZGVvLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG4gIH1cbn07XG5cbkFwcC5wcm90b3R5cGUucHJlbG9hZGluZyA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgaWYgKHRoaXMuY29uZmlnLnNob3dQcmVsb2FkZXIpIHtcbiAgICB0aGlzLl9wcmVsb2FkZXIucmVuZGVyKHRpbWUpO1xuICB9XG59O1xuXG5BcHAucHJvdG90eXBlLmNvbmZpZ3VyZSA9IGZ1bmN0aW9uKCkge307XG5cbkFwcC5wcm90b3R5cGUuZm9jdXMgPSBmdW5jdGlvbigpIHt9O1xuXG5BcHAucHJvdG90eXBlLmJsdXIgPSBmdW5jdGlvbigpIHt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcDtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2FwcC5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlIHx8IERhdGU7XG59KSgpO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvdGltZS5qc1xuICoqLyIsInZhciByZW5kZXJPcmRlclNvcnQgPSBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBhLnJlbmRlck9yZGVyIDwgYi5yZW5kZXJPcmRlcjtcbn07XG5cbnZhciB1cGRhdGVPcmRlclNvcnQgPSBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBhLnVwZGF0ZU9yZGVyIDwgYi51cGRhdGVPcmRlcjtcbn07XG5cbnZhciBTdGF0ZU1hbmFnZXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zdGF0ZXMgPSB7fTtcbiAgdGhpcy5yZW5kZXJPcmRlciA9IFtdO1xuICB0aGlzLnVwZGF0ZU9yZGVyID0gW107XG5cbiAgdGhpcy5fcHJldmVudEV2ZW50ID0gZmFsc2U7XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKG5hbWUsIHN0YXRlKSB7XG4gIHRoaXMuc3RhdGVzW25hbWVdID0gdGhpcy5fbmV3U3RhdGVIb2xkZXIobmFtZSwgc3RhdGUpO1xuICB0aGlzLnJlZnJlc2hPcmRlcigpO1xuICByZXR1cm4gc3RhdGU7XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaWYgKCFob2xkZXIuZW5hYmxlZCkge1xuICAgICAgaWYgKGhvbGRlci5zdGF0ZS5lbmFibGUpIHtcbiAgICAgICAgaG9sZGVyLnN0YXRlLmVuYWJsZSgpO1xuICAgICAgfVxuICAgICAgaG9sZGVyLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgaG9sZGVyLmNoYW5nZWQgPSB0cnVlO1xuXG4gICAgICBpZiAoaG9sZGVyLnBhdXNlZCkge1xuICAgICAgICB0aGlzLnVucGF1c2UobmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmRpc2FibGUgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGlmIChob2xkZXIuZW5hYmxlZCkge1xuICAgICAgaWYgKGhvbGRlci5zdGF0ZS5kaXNhYmxlKSB7XG4gICAgICAgIGhvbGRlci5zdGF0ZS5kaXNhYmxlKCk7XG4gICAgICB9XG4gICAgICBob2xkZXIuY2hhbmdlZCA9IHRydWU7XG4gICAgICBob2xkZXIuZW5hYmxlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBpZiAoaG9sZGVyLmVuYWJsZWQpIHtcbiAgICAgIGhvbGRlci5jaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIGhvbGRlci5yZW5kZXIgPSBmYWxzZTtcbiAgICB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaWYgKGhvbGRlci5lbmFibGVkKSB7XG4gICAgICBob2xkZXIuY2hhbmdlZCA9IHRydWU7XG4gICAgICBob2xkZXIucmVuZGVyID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGlmIChob2xkZXIuc3RhdGUucGF1c2UpIHtcbiAgICAgIGhvbGRlci5zdGF0ZS5wYXVzZSgpO1xuICAgIH1cblxuICAgIGhvbGRlci5jaGFuZ2VkID0gdHJ1ZTtcbiAgICBob2xkZXIucGF1c2VkID0gdHJ1ZTtcbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS51bnBhdXNlID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBpZiAoaG9sZGVyLnN0YXRlLnVucGF1c2UpIHtcbiAgICAgIGhvbGRlci5zdGF0ZS51bnBhdXNlKCk7XG4gICAgfVxuXG4gICAgaG9sZGVyLmNoYW5nZWQgPSB0cnVlO1xuICAgIGhvbGRlci5wYXVzZWQgPSBmYWxzZTtcbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5wcm90ZWN0ID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBob2xkZXIucHJvdGVjdCA9IHRydWU7XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUudW5wcm90ZWN0ID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBob2xkZXIucHJvdGVjdCA9IGZhbHNlO1xuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnJlZnJlc2hPcmRlciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnJlbmRlck9yZGVyLmxlbmd0aCA9IDA7XG4gIHRoaXMudXBkYXRlT3JkZXIubGVuZ3RoID0gMDtcblxuICBmb3IgKHZhciBuYW1lIGluIHRoaXMuc3RhdGVzKSB7XG4gICAgdmFyIGhvbGRlciA9IHRoaXMuc3RhdGVzW25hbWVdO1xuICAgIGlmIChob2xkZXIpIHtcbiAgICAgIHRoaXMucmVuZGVyT3JkZXIucHVzaChob2xkZXIpO1xuICAgICAgdGhpcy51cGRhdGVPcmRlci5wdXNoKGhvbGRlcik7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5yZW5kZXJPcmRlci5zb3J0KHJlbmRlck9yZGVyU29ydCk7XG4gIHRoaXMudXBkYXRlT3JkZXIuc29ydCh1cGRhdGVPcmRlclNvcnQpO1xufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5fbmV3U3RhdGVIb2xkZXIgPSBmdW5jdGlvbihuYW1lLCBzdGF0ZSkge1xuICB2YXIgaG9sZGVyID0ge307XG4gIGhvbGRlci5uYW1lID0gbmFtZTtcbiAgaG9sZGVyLnN0YXRlID0gc3RhdGU7XG5cbiAgaG9sZGVyLnByb3RlY3QgPSBmYWxzZTtcblxuICBob2xkZXIuZW5hYmxlZCA9IHRydWU7XG4gIGhvbGRlci5wYXVzZWQgPSBmYWxzZTtcblxuICBob2xkZXIucmVuZGVyID0gdHJ1ZTtcblxuICBob2xkZXIuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgaG9sZGVyLnVwZGF0ZWQgPSBmYWxzZTtcbiAgaG9sZGVyLmNoYW5nZWQgPSB0cnVlO1xuXG4gIGhvbGRlci51cGRhdGVPcmRlciA9IDA7XG4gIGhvbGRlci5yZW5kZXJPcmRlciA9IDA7XG5cbiAgcmV0dXJuIGhvbGRlcjtcbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuc2V0VXBkYXRlT3JkZXIgPSBmdW5jdGlvbihuYW1lLCBvcmRlcikge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBob2xkZXIudXBkYXRlT3JkZXIgPSBvcmRlcjtcbiAgICB0aGlzLnJlZnJlc2hPcmRlcigpO1xuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnNldFJlbmRlck9yZGVyID0gZnVuY3Rpb24obmFtZSwgb3JkZXIpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaG9sZGVyLnJlbmRlck9yZGVyID0gb3JkZXI7XG4gICAgdGhpcy5yZWZyZXNoT3JkZXIoKTtcbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgc3RhdGUgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKHN0YXRlICYmICFzdGF0ZS5wcm90ZWN0KSB7XG4gICAgaWYgKHN0YXRlLnN0YXRlLmNsb3NlKSB7XG4gICAgICBzdGF0ZS5zdGF0ZS5jbG9zZSgpO1xuICAgIH1cbiAgICBkZWxldGUgdGhpcy5zdGF0ZXNbbmFtZV07XG4gICAgdGhpcy5yZWZyZXNoT3JkZXIoKTtcbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5kZXN0cm95QWxsID0gZnVuY3Rpb24oKSB7XG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcbiAgICBpZiAoIXN0YXRlLnByb3RlY3QpIHtcbiAgICAgIGlmIChzdGF0ZS5zdGF0ZS5jbG9zZSkge1xuICAgICAgICBzdGF0ZS5zdGF0ZS5jbG9zZSgpO1xuICAgICAgfVxuICAgICAgZGVsZXRlIHRoaXMuc3RhdGVzW3N0YXRlLm5hbWVdO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMucmVmcmVzaE9yZGVyKCk7XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgcmV0dXJuIHRoaXMuc3RhdGVzW25hbWVdO1xufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbih0aW1lKSB7XG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcblxuICAgIGlmIChzdGF0ZSkge1xuICAgICAgc3RhdGUuY2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoc3RhdGUuZW5hYmxlZCkge1xuICAgICAgICBpZiAoIXN0YXRlLmluaXRpYWxpemVkICYmIHN0YXRlLnN0YXRlLmluaXQpIHtcbiAgICAgICAgICBzdGF0ZS5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgICAgc3RhdGUuc3RhdGUuaW5pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YXRlLnN0YXRlLnVwZGF0ZSAmJiAhc3RhdGUucGF1c2VkKSB7XG4gICAgICAgICAgc3RhdGUuc3RhdGUudXBkYXRlKHRpbWUpO1xuICAgICAgICAgIHN0YXRlLnVwZGF0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmV4aXRVcGRhdGUgPSBmdW5jdGlvbih0aW1lKSB7XG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcblxuICAgIGlmIChzdGF0ZSAmJiBzdGF0ZS5lbmFibGVkICYmIHN0YXRlLnN0YXRlLmV4aXRVcGRhdGUgJiYgIXN0YXRlLnBhdXNlZCkge1xuICAgICAgc3RhdGUuc3RhdGUuZXhpdFVwZGF0ZSh0aW1lKTtcbiAgICB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMucmVuZGVyT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5yZW5kZXJPcmRlcltpXTtcbiAgICBpZiAoc3RhdGUgJiYgc3RhdGUuZW5hYmxlZCAmJiAoc3RhdGUudXBkYXRlZCB8fCAhc3RhdGUuc3RhdGUudXBkYXRlKSAmJiBzdGF0ZS5yZW5kZXIgJiYgc3RhdGUuc3RhdGUucmVuZGVyKSB7XG4gICAgICBzdGF0ZS5zdGF0ZS5yZW5kZXIoKTtcbiAgICB9XG4gIH1cbn07XG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLm1vdXNlbW92ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHRoaXMuX3ByZXZlbnRFdmVudCA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcbiAgICBpZiAoc3RhdGUgJiYgc3RhdGUuZW5hYmxlZCAmJiAhc3RhdGUuY2hhbmdlZCAmJiBzdGF0ZS5zdGF0ZS5tb3VzZW1vdmUgJiYgIXN0YXRlLnBhdXNlZCkge1xuICAgICAgc3RhdGUuc3RhdGUubW91c2Vtb3ZlKHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcHJldmVudEV2ZW50KSB7IGJyZWFrOyB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUubW91c2V1cCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHRoaXMuX3ByZXZlbnRFdmVudCA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcbiAgICBpZiAoc3RhdGUgJiYgc3RhdGUuZW5hYmxlZCAmJiAhc3RhdGUuY2hhbmdlZCAmJiBzdGF0ZS5zdGF0ZS5tb3VzZXVwICYmICFzdGF0ZS5wYXVzZWQpIHtcbiAgICAgIHN0YXRlLnN0YXRlLm1vdXNldXAodmFsdWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wcmV2ZW50RXZlbnQpIHsgYnJlYWs7IH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5tb3VzZWRvd24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICB0aGlzLl9wcmV2ZW50RXZlbnQgPSBmYWxzZTtcblxuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLnVwZGF0ZU9yZGVyLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMudXBkYXRlT3JkZXJbaV07XG4gICAgaWYgKHN0YXRlICYmIHN0YXRlLmVuYWJsZWQgJiYgIXN0YXRlLmNoYW5nZWQgJiYgc3RhdGUuc3RhdGUubW91c2Vkb3duICYmICFzdGF0ZS5wYXVzZWQpIHtcbiAgICAgIHN0YXRlLnN0YXRlLm1vdXNlZG93bih2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3ByZXZlbnRFdmVudCkgeyBicmVhazsgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmtleXVwID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgdGhpcy5fcHJldmVudEV2ZW50ID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy51cGRhdGVPcmRlci5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnVwZGF0ZU9yZGVyW2ldO1xuICAgIGlmIChzdGF0ZSAmJiBzdGF0ZS5lbmFibGVkICYmICFzdGF0ZS5jaGFuZ2VkICYmIHN0YXRlLnN0YXRlLmtleXVwICYmICFzdGF0ZS5wYXVzZWQpIHtcbiAgICAgIHN0YXRlLnN0YXRlLmtleXVwKHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcHJldmVudEV2ZW50KSB7IGJyZWFrOyB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUua2V5ZG93biA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHRoaXMuX3ByZXZlbnRFdmVudCA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcbiAgICBpZiAoc3RhdGUgJiYgc3RhdGUuZW5hYmxlZCAmJiAhc3RhdGUuY2hhbmdlZCAmJiBzdGF0ZS5zdGF0ZS5rZXlkb3duICYmICFzdGF0ZS5wYXVzZWQpIHtcbiAgICAgIHN0YXRlLnN0YXRlLmtleWRvd24odmFsdWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wcmV2ZW50RXZlbnQpIHsgYnJlYWs7IH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0ZU1hbmFnZXI7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9zdGF0ZS1tYW5hZ2VyLmpzXG4gKiovIiwidmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG52YXIgRGlydHlNYW5hZ2VyID0gcmVxdWlyZSgnLi9kaXJ0eS1tYW5hZ2VyJyk7XG5cbnZhciBPYmplY3RQb29sID0gW107XG5cbnZhciBHZXRPYmplY3RGcm9tUG9vbCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzdWx0ID0gT2JqZWN0UG9vbC5wb3AoKTtcblxuICBpZiAocmVzdWx0KSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHJldHVybiB7fTtcbn07XG5cbnZhciBpbmRleFRvTnVtYmVyQW5kTG93ZXJDYXNlS2V5ID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgaWYgKGluZGV4IDw9IDkpIHtcbiAgICByZXR1cm4gNDggKyBpbmRleDtcbiAgfSBlbHNlIGlmIChpbmRleCA9PT0gMTApIHtcbiAgICByZXR1cm4gNDg7XG4gIH0gZWxzZSBpZiAoaW5kZXggPiAxMCAmJiBpbmRleCA8PSAzNikge1xuICAgIHJldHVybiA2NCArIChpbmRleC0xMCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07XG5cbnZhciBkZWZhdWx0cyA9IFtcbiAgeyBuYW1lOiAnU2hvdyBGUFMnLCBlbnRyeTogJ3Nob3dGcHMnLCBkZWZhdWx0czogdHJ1ZSB9LFxuICB7IG5hbWU6ICdTaG93IEtleSBDb2RlcycsIGVudHJ5OiAnc2hvd0tleUNvZGVzJywgZGVmYXVsdHM6IHRydWUgfVxuXTtcblxudmFyIERlYnVnZ2VyID0gZnVuY3Rpb24oYXBwKSB7XG4gIHRoaXMudmlkZW8gPSBhcHAudmlkZW8uY3JlYXRlTGF5ZXIoe1xuICAgIGFsbG93SGlEUEk6IHRydWUsXG4gICAgZ2V0Q2FudmFzQ29udGV4dDogdHJ1ZVxuICB9KTtcblxuICB0aGlzLmdyYXBoID0gYXBwLnZpZGVvLmNyZWF0ZUxheWVyKHtcbiAgICBhbGxvd0hpRFBJOiBmYWxzZSxcbiAgICBnZXRDYW52YXNDb250ZXh0OiB0cnVlXG4gIH0pO1xuXG4gIHRoaXMuX2dyYXBoSGVpZ2h0ID0gMTAwO1xuICB0aGlzLl82MGZwc01hcmsgPSB0aGlzLl9ncmFwaEhlaWdodCAqIDAuODtcbiAgdGhpcy5fbXNUb1B4ID0gdGhpcy5fNjBmcHNNYXJrLzE2LjY2O1xuXG4gIHRoaXMuYXBwID0gYXBwO1xuXG4gIHRoaXMub3B0aW9ucyA9IGRlZmF1bHRzO1xuICB0aGlzLl9tYXhMb2dzQ291bnRzID0gMTA7XG5cbiAgZm9yICh2YXIgaT0wOyBpPHRoaXMub3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBvcHRpb24gPSB0aGlzLm9wdGlvbnNbaV07XG4gICAgdGhpcy5faW5pdE9wdGlvbihvcHRpb24pO1xuICB9XG5cbiAgdGhpcy5kaXNhYmxlZCA9IGZhbHNlO1xuXG4gIHRoaXMuZnBzID0gMDtcbiAgdGhpcy5mcHNDb3VudCA9IDA7XG4gIHRoaXMuZnBzRWxhcHNlZFRpbWUgPSAwO1xuICB0aGlzLmZwc1VwZGF0ZUludGVydmFsID0gMC41O1xuICB0aGlzLl9mcmFtZVBlcmYgPSBbXTtcblxuICB0aGlzLl9mb250U2l6ZSA9IDA7XG4gIHRoaXMuX2RpcnR5TWFuYWdlciA9IG5ldyBEaXJ0eU1hbmFnZXIodGhpcy52aWRlby5jYW52YXMsIHRoaXMudmlkZW8uY3R4KTtcblxuICB0aGlzLmxvZ3MgPSBbXTtcblxuICB0aGlzLl9wZXJmVmFsdWVzID0ge307XG4gIHRoaXMuX3BlcmZOYW1lcyA9IFtdO1xuXG4gIHRoaXMuc2hvd0RlYnVnID0gZmFsc2U7XG4gIHRoaXMuZW5hYmxlRGVidWdLZXlzID0gdHJ1ZTtcbiAgdGhpcy5lbmFibGVTaG9ydGN1dHMgPSBmYWxzZTtcblxuICB0aGlzLmVuYWJsZVNob3J0Y3V0c0tleSA9IDIyMDtcblxuICB0aGlzLmxhc3RLZXkgPSBudWxsO1xuXG4gIHRoaXMuX2xvYWQoKTtcblxuICB0aGlzLmtleVNob3J0Y3V0cyA9IFtcbiAgICB7IGtleTogMTIzLCBlbnRyeTogJ3Nob3dEZWJ1ZycsIHR5cGU6ICd0b2dnbGUnIH1cbiAgXTtcblxuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5hZGRDb25maWcoeyBuYW1lOiAnU2hvdyBQZXJmb3JtYW5jZSBHcmFwaCcsIGVudHJ5OiAnc2hvd0dyYXBoJywgZGVmYXVsdHM6IGZhbHNlLCBjYWxsOiBmdW5jdGlvbigpIHsgc2VsZi5ncmFwaC5jbGVhcigpOyB9IH0pO1xuXG4gIHRoaXMuX2RpZmYgPSAwO1xuICB0aGlzLl9mcmFtZVN0YXJ0ID0gMDtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5iZWdpbiA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5zaG93RGVidWcpIHtcbiAgICB0aGlzLl9mcmFtZVN0YXJ0ID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xuICB9XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLnNob3dEZWJ1Zykge1xuICAgIHRoaXMuX2RpZmYgPSB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgLSB0aGlzLl9mcmFtZVN0YXJ0O1xuICB9XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuX3NldEZvbnQgPSBmdW5jdGlvbihweCwgZm9udCkge1xuICB0aGlzLl9mb250U2l6ZSA9IHB4O1xuICB0aGlzLnZpZGVvLmN0eC5mb250ID0gcHggKyAncHggJyArIGZvbnQ7XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMudmlkZW8uc2V0U2l6ZSh0aGlzLmFwcC53aWR0aCwgdGhpcy5hcHAuaGVpZ2h0KTtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5hZGRDb25maWcgPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgdGhpcy5vcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgdGhpcy5faW5pdE9wdGlvbihvcHRpb24pO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLl9pbml0T3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gIG9wdGlvbi50eXBlID0gb3B0aW9uLnR5cGUgfHwgJ3RvZ2dsZSc7XG4gIG9wdGlvbi5kZWZhdWx0cyA9IG9wdGlvbi5kZWZhdWx0cyA9PSBudWxsID8gZmFsc2UgOiBvcHRpb24uZGVmYXVsdHM7XG5cbiAgaWYgKG9wdGlvbi50eXBlID09PSAndG9nZ2xlJykge1xuICAgIHRoaXNbb3B0aW9uLmVudHJ5XSA9IG9wdGlvbi5kZWZhdWx0cztcbiAgfVxufTtcblxuRGVidWdnZXIucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMubG9ncy5sZW5ndGggPSAwO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLmxvZyA9IGZ1bmN0aW9uKG1lc3NhZ2UsIGNvbG9yKSB7XG4gIGNvbG9yID0gY29sb3IgfHwgJ3doaXRlJztcbiAgbWVzc2FnZSA9IHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJyA/IG1lc3NhZ2UgOiB1dGlsLmluc3BlY3QobWVzc2FnZSk7XG5cbiAgdmFyIG1lc3NhZ2VzID0gbWVzc2FnZS5yZXBsYWNlKC9cXFxcJy9nLCBcIidcIikuc3BsaXQoJ1xcbicpO1xuXG4gIGZvciAodmFyIGk9MDsgaTxtZXNzYWdlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBtc2cgPSBtZXNzYWdlc1tpXTtcbiAgICBpZiAodGhpcy5sb2dzLmxlbmd0aCA+PSB0aGlzLl9tYXhMb2dzQ291bnRzKSB7XG4gICAgICBPYmplY3RQb29sLnB1c2godGhpcy5sb2dzLnNoaWZ0KCkpO1xuICAgIH1cblxuICAgIHZhciBtZXNzYWdlT2JqZWN0ID0gR2V0T2JqZWN0RnJvbVBvb2woKTtcbiAgICBtZXNzYWdlT2JqZWN0LnRleHQgPSBtc2c7XG4gICAgbWVzc2FnZU9iamVjdC5saWZlID0gMTA7XG4gICAgbWVzc2FnZU9iamVjdC5jb2xvciA9IGNvbG9yO1xuXG4gICAgdGhpcy5sb2dzLnB1c2gobWVzc2FnZU9iamVjdCk7XG4gIH1cbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHt9O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuZXhpdFVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgaWYgKHRoaXMuZGlzYWJsZWQpIHsgcmV0dXJuOyB9XG5cbiAgaWYgKHRoaXMuc2hvd0RlYnVnKSB7XG4gICAgdGhpcy5fbWF4TG9nc0NvdW50cyA9IE1hdGguY2VpbCgodGhpcy5hcHAuaGVpZ2h0ICsgMjApLzIwKTtcbiAgICB0aGlzLmZwc0NvdW50ICs9IDE7XG4gICAgdGhpcy5mcHNFbGFwc2VkVGltZSArPSB0aW1lO1xuXG4gICAgaWYgKHRoaXMuZnBzRWxhcHNlZFRpbWUgPiB0aGlzLmZwc1VwZGF0ZUludGVydmFsKSB7XG4gICAgICB2YXIgZnBzID0gdGhpcy5mcHNDb3VudC90aGlzLmZwc0VsYXBzZWRUaW1lO1xuXG4gICAgICBpZiAodGhpcy5zaG93RnBzKSB7XG4gICAgICAgIHRoaXMuZnBzID0gdGhpcy5mcHMgKiAoMS0wLjgpICsgMC44ICogZnBzO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmZwc0NvdW50ID0gMDtcbiAgICAgIHRoaXMuZnBzRWxhcHNlZFRpbWUgPSAwO1xuICAgIH1cblxuICAgIGZvciAodmFyIGk9MCwgbGVuPXRoaXMubG9ncy5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICAgIHZhciBsb2cgPSB0aGlzLmxvZ3NbaV07XG4gICAgICBpZiAobG9nKSB7XG4gICAgICAgIGxvZy5saWZlIC09IHRpbWU7XG4gICAgICAgIGlmIChsb2cubGlmZSA8PSAwKSB7XG4gICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5sb2dzLmluZGV4T2YobG9nKTtcbiAgICAgICAgICBpZiAoaW5kZXggPiAtMSkgeyB0aGlzLmxvZ3Muc3BsaWNlKGluZGV4LCAxKTsgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUua2V5ZG93biA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICh0aGlzLmRpc2FibGVkKSB7IHJldHVybjsgfVxuXG4gIHRoaXMubGFzdEtleSA9IHZhbHVlLmtleTtcblxuICB2YXIgaTtcblxuICBpZiAodGhpcy5lbmFibGVEZWJ1Z0tleXMpIHtcbiAgICBpZiAodmFsdWUua2V5ID09PSB0aGlzLmVuYWJsZVNob3J0Y3V0c0tleSkge1xuICAgICAgdmFsdWUuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5lbmFibGVTaG9ydGN1dHMgPSAhdGhpcy5lbmFibGVTaG9ydGN1dHM7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5lbmFibGVTaG9ydGN1dHMpIHtcbiAgICAgIGZvciAoaT0wOyBpPHRoaXMub3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgb3B0aW9uID0gdGhpcy5vcHRpb25zW2ldO1xuICAgICAgICB2YXIga2V5SW5kZXggPSBpICsgMTtcblxuICAgICAgICBpZiAodGhpcy5hcHAuaW5wdXQuaXNLZXlEb3duKCdjdHJsJykpIHtcbiAgICAgICAgICBrZXlJbmRleCAtPSAzNjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGFySWQgPSBpbmRleFRvTnVtYmVyQW5kTG93ZXJDYXNlS2V5KGtleUluZGV4KTtcblxuICAgICAgICBpZiAoY2hhcklkICYmIHZhbHVlLmtleSA9PT0gY2hhcklkKSB7XG4gICAgICAgICAgdmFsdWUuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgIGlmIChvcHRpb24udHlwZSA9PT0gJ3RvZ2dsZScpIHtcblxuICAgICAgICAgICAgdGhpc1tvcHRpb24uZW50cnldID0gIXRoaXNbb3B0aW9uLmVudHJ5XTtcbiAgICAgICAgICAgIGlmIChvcHRpb24uY2FsbCkge1xuICAgICAgICAgICAgICBvcHRpb24uY2FsbCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9zYXZlKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChvcHRpb24udHlwZSA9PT0gJ2NhbGwnKSB7XG4gICAgICAgICAgICBvcHRpb24uZW50cnkoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAoaT0wOyBpPHRoaXMua2V5U2hvcnRjdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtleVNob3J0Y3V0ID0gdGhpcy5rZXlTaG9ydGN1dHNbaV07XG4gICAgaWYgKGtleVNob3J0Y3V0LmtleSA9PT0gdmFsdWUua2V5KSB7XG4gICAgICB2YWx1ZS5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBpZiAoa2V5U2hvcnRjdXQudHlwZSA9PT0gJ3RvZ2dsZScpIHtcbiAgICAgICAgdGhpc1trZXlTaG9ydGN1dC5lbnRyeV0gPSAhdGhpc1trZXlTaG9ydGN1dC5lbnRyeV07XG4gICAgICAgIHRoaXMuX3NhdmUoKTtcbiAgICAgIH0gZWxzZSBpZiAoa2V5U2hvcnRjdXQudHlwZSA9PT0gJ2NhbGwnKSB7XG4gICAgICAgIHRoaXNba2V5U2hvcnRjdXQuZW50cnldKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5fc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGF0YSA9IHtcbiAgICBzaG93RGVidWc6IHRoaXMuc2hvd0RlYnVnLFxuICAgIG9wdGlvbnM6IHt9XG4gIH07XG5cbiAgZm9yICh2YXIgaT0wOyBpPHRoaXMub3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBvcHRpb24gPSB0aGlzLm9wdGlvbnNbaV07XG4gICAgdmFyIHZhbHVlID0gdGhpc1tvcHRpb24uZW50cnldO1xuICAgIGRhdGEub3B0aW9uc1tvcHRpb24uZW50cnldID0gdmFsdWU7XG4gIH1cblxuICB3aW5kb3cubG9jYWxTdG9yYWdlLl9fcG90aW9uRGVidWcgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5fbG9hZCA9IGZ1bmN0aW9uKCkge1xuICBpZiAod2luZG93LmxvY2FsU3RvcmFnZSAmJiB3aW5kb3cubG9jYWxTdG9yYWdlLl9fcG90aW9uRGVidWcpIHtcbiAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2Uod2luZG93LmxvY2FsU3RvcmFnZS5fX3BvdGlvbkRlYnVnKTtcbiAgICB0aGlzLnNob3dEZWJ1ZyA9IGRhdGEuc2hvd0RlYnVnO1xuXG4gICAgZm9yICh2YXIgbmFtZSBpbiBkYXRhLm9wdGlvbnMpIHtcbiAgICAgIHRoaXNbbmFtZV0gPSBkYXRhLm9wdGlvbnNbbmFtZV07XG4gICAgfVxuICB9XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmRpc2FibGVkKSB7IHJldHVybjsgfVxuXG4gIHRoaXMuX2RpcnR5TWFuYWdlci5jbGVhcigpO1xuXG4gIGlmICh0aGlzLnNob3dEZWJ1Zykge1xuICAgIHRoaXMudmlkZW8uY3R4LnNhdmUoKTtcbiAgICB0aGlzLl9zZXRGb250KDE1LCAnc2Fucy1zZXJpZicpO1xuXG4gICAgdGhpcy5fcmVuZGVyTG9ncygpO1xuICAgIHRoaXMuX3JlbmRlckRhdGEoKTtcbiAgICB0aGlzLl9yZW5kZXJTaG9ydGN1dHMoKTtcblxuICAgIHRoaXMudmlkZW8uY3R4LnJlc3RvcmUoKTtcblxuICAgIGlmICh0aGlzLnNob3dHcmFwaCkge1xuICAgICAgdGhpcy5ncmFwaC5jdHguZHJhd0ltYWdlKHRoaXMuZ3JhcGguY2FudmFzLCAwLCB0aGlzLmFwcC5oZWlnaHQgLSB0aGlzLl9ncmFwaEhlaWdodCwgdGhpcy5hcHAud2lkdGgsIHRoaXMuX2dyYXBoSGVpZ2h0LCAtMiwgdGhpcy5hcHAuaGVpZ2h0IC0gdGhpcy5fZ3JhcGhIZWlnaHQsIHRoaXMuYXBwLndpZHRoLCB0aGlzLl9ncmFwaEhlaWdodCk7XG5cbiAgICAgIHRoaXMuZ3JhcGguY3R4LmZpbGxTdHlsZSA9ICcjRjJGMEQ4JztcbiAgICAgIHRoaXMuZ3JhcGguY3R4LmZpbGxSZWN0KHRoaXMuYXBwLndpZHRoIC0gMiwgdGhpcy5hcHAuaGVpZ2h0IC0gdGhpcy5fZ3JhcGhIZWlnaHQsIDIsIHRoaXMuX2dyYXBoSGVpZ2h0KTtcblxuICAgICAgdGhpcy5ncmFwaC5jdHguZmlsbFN0eWxlID0gJ3JnYmEoMCwgMCwgMCwgMC41KSc7XG4gICAgICB0aGlzLmdyYXBoLmN0eC5maWxsUmVjdCh0aGlzLmFwcC53aWR0aCAtIDIsIHRoaXMuYXBwLmhlaWdodCAtIHRoaXMuXzYwZnBzTWFyaywgMiwgMSk7XG5cbiAgICAgIHZhciBsYXN0ID0gMDtcbiAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLl9mcmFtZVBlcmYubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLl9mcmFtZVBlcmZbaV07XG4gICAgICAgIHZhciBuYW1lID0gdGhpcy5fcGVyZk5hbWVzW2ldO1xuXG4gICAgICAgIHRoaXMuX2RyYXdGcmFtZUxpbmUoaXRlbSwgbmFtZSwgbGFzdCk7XG5cbiAgICAgICAgbGFzdCArPSBpdGVtO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9kcmF3RnJhbWVMaW5lKHRoaXMuX2RpZmYgLSBsYXN0LCAnbGFnJywgbGFzdCk7XG4gICAgICB0aGlzLl9mcmFtZVBlcmYubGVuZ3RoID0gMDtcbiAgICB9XG4gIH1cbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5fZHJhd0ZyYW1lTGluZSA9IGZ1bmN0aW9uKHZhbHVlLCBuYW1lLCBsYXN0KSB7XG4gIHZhciBiYWNrZ3JvdW5kID0gJ2JsYWNrJztcbiAgaWYgKG5hbWUgPT09ICd1cGRhdGUnKSB7XG4gICAgYmFja2dyb3VuZCA9ICcjNkJBNUYyJztcbiAgfSBlbHNlIGlmIChuYW1lID09PSAncmVuZGVyJykge1xuICAgIGJhY2tncm91bmQgPSAnI0YyNzgzMCc7XG4gIH0gZWxzZSBpZiAobmFtZSA9PT0gJ2xhZycpIHtcbiAgICBiYWNrZ3JvdW5kID0gJyM5MWY2ODInO1xuICB9XG4gIHRoaXMuZ3JhcGguY3R4LmZpbGxTdHlsZSA9IGJhY2tncm91bmQ7XG5cbiAgdmFyIGhlaWdodCA9ICh2YWx1ZSArIGxhc3QpICogdGhpcy5fbXNUb1B4XG5cbiAgdmFyIHggPSB0aGlzLmFwcC53aWR0aCAtIDI7XG4gIHZhciB5ID0gdGhpcy5hcHAuaGVpZ2h0IC0gaGVpZ2h0O1xuXG4gIHRoaXMuZ3JhcGguY3R4LmZpbGxSZWN0KHgsIHksIDIsIGhlaWdodCAtIChsYXN0ICogdGhpcy5fbXNUb1B4KSk7XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuX3JlbmRlckxvZ3MgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy52aWRlby5jdHgudGV4dEFsaWduID0gJ2xlZnQnO1xuICB0aGlzLnZpZGVvLmN0eC50ZXh0QmFzZWxpbmUgPSAnYm90dG9tJztcblxuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLmxvZ3MubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIGxvZyA9IHRoaXMubG9nc1tpXTtcblxuICAgIHZhciB5ID0gLTEwICsgdGhpcy5hcHAuaGVpZ2h0ICsgKGkgLSB0aGlzLmxvZ3MubGVuZ3RoICsgMSkgKiAyMDtcbiAgICB0aGlzLl9yZW5kZXJUZXh0KGxvZy50ZXh0LCAxMCwgeSwgbG9nLmNvbG9yKTtcbiAgfVxufTtcblxuRGVidWdnZXIucHJvdG90eXBlLmRpc2FibGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5kaXNhYmxlZCA9IHRydWU7XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUucGVyZiA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgaWYgKCF0aGlzLnNob3dEZWJ1ZykgeyByZXR1cm47IH1cblxuICB2YXIgZXhpc3RzID0gdGhpcy5fcGVyZlZhbHVlc1tuYW1lXTtcblxuICBpZiAoZXhpc3RzID09IG51bGwpIHtcbiAgICB0aGlzLl9wZXJmTmFtZXMucHVzaChuYW1lKTtcblxuICAgIHRoaXMuX3BlcmZWYWx1ZXNbbmFtZV0gPSB7XG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgdmFsdWU6IDAsXG4gICAgICByZWNvcmRzOiBbXVxuICAgIH07XG4gIH1cblxuICB2YXIgdGltZSA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcblxuICB2YXIgcmVjb3JkID0gdGhpcy5fcGVyZlZhbHVlc1tuYW1lXTtcblxuICByZWNvcmQudmFsdWUgPSB0aW1lO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLnN0b3BQZXJmID0gZnVuY3Rpb24obmFtZSkge1xuICBpZiAoIXRoaXMuc2hvd0RlYnVnKSB7IHJldHVybjsgfVxuXG4gIHZhciByZWNvcmQgPSB0aGlzLl9wZXJmVmFsdWVzW25hbWVdO1xuXG4gIHZhciB0aW1lID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xuICB2YXIgZGlmZiA9IHRpbWUgLSByZWNvcmQudmFsdWU7XG5cbiAgcmVjb3JkLnJlY29yZHMucHVzaChkaWZmKTtcbiAgaWYgKHJlY29yZC5yZWNvcmRzLmxlbmd0aCA+IDEwKSB7XG4gICAgcmVjb3JkLnJlY29yZHMuc2hpZnQoKTtcbiAgfVxuXG4gIHZhciBzdW0gPSAwO1xuICBmb3IgKHZhciBpPTA7IGk8cmVjb3JkLnJlY29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICBzdW0gKz0gcmVjb3JkLnJlY29yZHNbaV07XG4gIH1cblxuICB2YXIgYXZnID0gc3VtL3JlY29yZC5yZWNvcmRzLmxlbmd0aDtcblxuICByZWNvcmQudmFsdWUgPSBhdmc7XG4gIHRoaXMuX2ZyYW1lUGVyZi5wdXNoKGRpZmYpO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLl9yZW5kZXJEYXRhID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMudmlkZW8uY3R4LnRleHRBbGlnbiA9ICdyaWdodCc7XG4gIHRoaXMudmlkZW8uY3R4LnRleHRCYXNlbGluZSA9ICd0b3AnO1xuXG4gIHZhciB4ID0gdGhpcy5hcHAud2lkdGggLSAxNDtcbiAgdmFyIHkgPSAxNDtcblxuICBpZiAodGhpcy5zaG93RnBzKSB7XG4gICAgdGhpcy5fcmVuZGVyVGV4dChNYXRoLnJvdW5kKHRoaXMuZnBzKSArICcgZnBzJywgeCwgeSk7XG4gIH1cblxuICB5ICs9IDI0O1xuXG4gIHRoaXMuX3NldEZvbnQoMTUsICdzYW5zLXNlcmlmJyk7XG5cbiAgaWYgKHRoaXMuc2hvd0tleUNvZGVzKSB7XG4gICAgdmFyIGJ1dHRvbk5hbWUgPSAnJztcbiAgICBpZiAodGhpcy5hcHAuaW5wdXQubW91c2UuaXNMZWZ0RG93bikge1xuICAgICAgYnV0dG9uTmFtZSA9ICdsZWZ0JztcbiAgICB9IGVsc2UgaWYgKHRoaXMuYXBwLmlucHV0Lm1vdXNlLmlzUmlnaHREb3duKSB7XG4gICAgICBidXR0b25OYW1lID0gJ3JpZ2h0JztcbiAgICB9IGVsc2UgaWYgKHRoaXMuYXBwLmlucHV0Lm1vdXNlLmlzTWlkZGxlRG93bikge1xuICAgICAgYnV0dG9uTmFtZSA9ICdtaWRkbGUnO1xuICAgIH1cblxuICAgIHRoaXMuX3JlbmRlclRleHQoJ2tleSAnICsgdGhpcy5sYXN0S2V5LCB4LCB5LCB0aGlzLmFwcC5pbnB1dC5pc0tleURvd24odGhpcy5sYXN0S2V5KSA/ICcjZTlkYzdjJyA6ICd3aGl0ZScpO1xuICAgIHRoaXMuX3JlbmRlclRleHQoJ2J0biAnICsgYnV0dG9uTmFtZSwgeCAtIDYwLCB5LCB0aGlzLmFwcC5pbnB1dC5tb3VzZS5pc0Rvd24gPyAnI2U5ZGM3YycgOiAnd2hpdGUnKTtcblxuICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLl9wZXJmTmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBuYW1lID0gdGhpcy5fcGVyZk5hbWVzW2ldO1xuICAgICAgdmFyIHZhbHVlID0gdGhpcy5fcGVyZlZhbHVlc1tuYW1lXTtcblxuICAgICAgeSArPSAyNDtcbiAgICAgIHRoaXMuX3JlbmRlclRleHQobmFtZSArICc6ICcgKyAgdmFsdWUudmFsdWUudG9GaXhlZCgzKSArICdtcycsIHgsIHkpO1xuICAgIH1cbiAgfVxufTtcblxuXG5EZWJ1Z2dlci5wcm90b3R5cGUuX3JlbmRlclNob3J0Y3V0cyA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5lbmFibGVTaG9ydGN1dHMpIHtcbiAgICB2YXIgaGVpZ2h0ID0gMjg7XG5cbiAgICB0aGlzLl9zZXRGb250KDIwLCAnSGVsdmV0aWNhIE5ldWUsIHNhbnMtc2VyaWYnKTtcbiAgICB0aGlzLnZpZGVvLmN0eC50ZXh0QWxpZ24gPSAnbGVmdCc7XG4gICAgdGhpcy52aWRlby5jdHgudGV4dEJhc2VsaW5lID0gJ3RvcCc7XG4gICAgdmFyIG1heFBlckNvbGx1bW4gPSBNYXRoLmZsb29yKCh0aGlzLmFwcC5oZWlnaHQgLSAxNCkvaGVpZ2h0KTtcblxuICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLm9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBvcHRpb24gPSB0aGlzLm9wdGlvbnNbaV07XG4gICAgICB2YXIgeCA9IDE0ICsgTWF0aC5mbG9vcihpL21heFBlckNvbGx1bW4pICogMzIwO1xuICAgICAgdmFyIHkgPSAxNCArIGklbWF4UGVyQ29sbHVtbiAqIGhlaWdodDtcblxuICAgICAgdmFyIGtleUluZGV4ID0gaSArIDE7XG4gICAgICB2YXIgY2hhcklkID0gaW5kZXhUb051bWJlckFuZExvd2VyQ2FzZUtleShrZXlJbmRleCk7XG5cbiAgICAgIHZhciBpc09uID0gdGhpc1tvcHRpb24uZW50cnldO1xuXG4gICAgICB2YXIgc2hvcnRjdXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNoYXJJZCk7XG5cbiAgICAgIGlmICghY2hhcklkKSB7XG4gICAgICAgIHNob3J0Y3V0ID0gJ14rJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaW5kZXhUb051bWJlckFuZExvd2VyQ2FzZUtleShrZXlJbmRleCAtIDM2KSk7XG4gICAgICB9XG5cbiAgICAgIHZhciB0ZXh0ID0gJ1snICsgc2hvcnRjdXQgKyAnXSAnICsgb3B0aW9uLm5hbWU7XG4gICAgICBpZiAob3B0aW9uLnR5cGUgPT09ICd0b2dnbGUnKSB7XG4gICAgICAgIHRleHQgKz0gJyAoJyArIChpc09uID8gJ09OJyA6ICdPRkYnKSArICcpJztcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9uLnR5cGUgPT09ICdjYWxsJykge1xuICAgICAgICB0ZXh0ICs9ICcgKENBTEwpJztcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbG9yID0gJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMSknO1xuICAgICAgdmFyIG91dGxpbmUgPSAncmdiYSgwLCAwLCAwLCAxKSc7XG5cbiAgICAgIGlmICghaXNPbikge1xuICAgICAgICBjb2xvciA9ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIC43KSc7XG4gICAgICAgIG91dGxpbmUgPSAncmdiYSgwLCAwLCAwLCAuNyknO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9yZW5kZXJUZXh0KHRleHQsIHgsIHksIGNvbG9yLCBvdXRsaW5lKTtcbiAgICB9XG4gIH1cbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5fcmVuZGVyVGV4dCA9IGZ1bmN0aW9uKHRleHQsIHgsIHksIGNvbG9yLCBvdXRsaW5lKSB7XG4gIGNvbG9yID0gY29sb3IgfHwgJ3doaXRlJztcbiAgb3V0bGluZSA9IG91dGxpbmUgfHwgJ2JsYWNrJztcbiAgdGhpcy52aWRlby5jdHguZmlsbFN0eWxlID0gY29sb3I7XG4gIHRoaXMudmlkZW8uY3R4LmxpbmVKb2luID0gJ3JvdW5kJztcbiAgdGhpcy52aWRlby5jdHguc3Ryb2tlU3R5bGUgPSBvdXRsaW5lO1xuICB0aGlzLnZpZGVvLmN0eC5saW5lV2lkdGggPSAzO1xuICB0aGlzLnZpZGVvLmN0eC5zdHJva2VUZXh0KHRleHQsIHgsIHkpO1xuICB0aGlzLnZpZGVvLmN0eC5maWxsVGV4dCh0ZXh0LCB4LCB5KTtcblxuICB2YXIgd2lkdGggPSB0aGlzLnZpZGVvLmN0eC5tZWFzdXJlVGV4dCh0ZXh0KS53aWR0aDtcblxuICB2YXIgZHggPSB4IC0gNTtcbiAgdmFyIGR5ID0geTtcbiAgdmFyIGR3aWR0aCA9IHdpZHRoICsgMTA7XG4gIHZhciBkaGVpZ2h0ID0gdGhpcy5fZm9udFNpemUgKyAxMDtcblxuICBpZiAodGhpcy52aWRlby5jdHgudGV4dEFsaWduID09PSAncmlnaHQnKSB7XG4gICAgZHggPSB4IC0gNSAtIHdpZHRoO1xuICB9XG5cbiAgdGhpcy5fZGlydHlNYW5hZ2VyLmFkZFJlY3QoZHgsIGR5LCBkd2lkdGgsIGRoZWlnaHQpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZWJ1Z2dlcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3BvdGlvbi1kZWJ1Z2dlci9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTJcbiAqKi8iLCJ2YXIgaXNSZXRpbmEgPSByZXF1aXJlKCcuL3JldGluYScpKCk7XG5cbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBjYW52YXMgLSBDYW52YXMgRE9NIGVsZW1lbnRcbiAqL1xudmFyIFZpZGVvID0gZnVuY3Rpb24oYXBwLCBjYW52YXMsIGNvbmZpZykge1xuICB0aGlzLmFwcCA9IGFwcDtcblxuICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcblxuICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcblxuICB0aGlzLndpZHRoID0gYXBwLndpZHRoO1xuXG4gIHRoaXMuaGVpZ2h0ID0gYXBwLmhlaWdodDtcblxuICBpZiAoY29uZmlnLmdldENhbnZhc0NvbnRleHQpIHtcbiAgICB0aGlzLmN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICB9XG5cbiAgdGhpcy5fYXBwbHlTaXplVG9DYW52YXMoKTtcbn07XG5cbi8qKlxuICogSW5jbHVkZXMgbWl4aW5zIGludG8gVmlkZW8gbGlicmFyeVxuICogQHBhcmFtIHtvYmplY3R9IG1ldGhvZHMgLSBvYmplY3Qgb2YgbWV0aG9kcyB0aGF0IHdpbGwgaW5jbHVkZWQgaW4gVmlkZW9cbiAqL1xuVmlkZW8ucHJvdG90eXBlLmluY2x1ZGUgPSBmdW5jdGlvbihtZXRob2RzKSB7XG4gIGZvciAodmFyIG1ldGhvZCBpbiBtZXRob2RzKSB7XG4gICAgdGhpc1ttZXRob2RdID0gbWV0aG9kc1ttZXRob2RdO1xuICB9XG59O1xuXG5WaWRlby5wcm90b3R5cGUuYmVnaW5GcmFtZSA9IGZ1bmN0aW9uKCkge307XG5cblZpZGVvLnByb3RvdHlwZS5lbmRGcmFtZSA9IGZ1bmN0aW9uKCkge307XG5cblZpZGVvLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuY2FudmFzLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5jYW52YXMpO1xufTtcblxuVmlkZW8ucHJvdG90eXBlLnNjYWxlQ2FudmFzID0gZnVuY3Rpb24oc2NhbGUpIHtcbiAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aCArICdweCc7XG4gIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodCArICdweCc7XG5cbiAgdGhpcy5jYW52YXMud2lkdGggKj0gc2NhbGU7XG4gIHRoaXMuY2FudmFzLmhlaWdodCAqPSBzY2FsZTtcblxuICBpZiAodGhpcy5jdHgpIHtcbiAgICB0aGlzLmN0eC5zY2FsZShzY2FsZSwgc2NhbGUpO1xuICB9XG59O1xuXG5WaWRlby5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcbiAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICB0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuICB0aGlzLl9hcHBseVNpemVUb0NhbnZhcygpO1xufTtcblxuVmlkZW8ucHJvdG90eXBlLl9hcHBseVNpemVUb0NhbnZhcyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuXG4gIHZhciBjb250YWluZXIgPSB0aGlzLmNhbnZhcy5wYXJlbnRFbGVtZW50O1xuICBjb250YWluZXIuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgJ3B4JztcbiAgY29udGFpbmVyLnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgJ3B4JztcblxuICBpZiAodGhpcy5jb25maWcuYWxsb3dIaURQSSAmJiBpc1JldGluYSkge1xuICAgIHRoaXMuc2NhbGVDYW52YXMoMik7XG4gIH1cbn07XG5cblZpZGVvLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5jdHgpIHsgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTsgfVxufTtcblxuVmlkZW8ucHJvdG90eXBlLmNyZWF0ZUxheWVyID0gZnVuY3Rpb24oY29uZmlnKSB7XG4gIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuICB2YXIgY29udGFpbmVyID0gdGhpcy5jYW52YXMucGFyZW50RWxlbWVudDtcbiAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICBjYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICBjYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gIGNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gIGNhbnZhcy5zdHlsZS50b3AgPSAnMHB4JztcbiAgY2FudmFzLnN0eWxlLmxlZnQgPSAnMHB4JztcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNhbnZhcyk7XG5cbiAgdmFyIHZpZGVvID0gbmV3IFZpZGVvKHRoaXMuYXBwLCBjYW52YXMsIGNvbmZpZyk7XG5cbiAgcmV0dXJuIHZpZGVvO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWRlbztcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3ZpZGVvLmpzXG4gKiovIiwidmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxudmFyIFBvdGlvbkF1ZGlvID0gcmVxdWlyZSgncG90aW9uLWF1ZGlvJyk7XG5cbnZhciBKc29uTG9hZGVyID0gcmVxdWlyZSgnLi9sb2FkZXIvanNvbi1sb2FkZXInKTtcbnZhciBpbWFnZUxvYWRlciA9IHJlcXVpcmUoJy4vbG9hZGVyL2ltYWdlLWxvYWRlcicpO1xudmFyIHRleHRMb2FkZXIgPSByZXF1aXJlKCcuL2xvYWRlci90ZXh0LWxvYWRlcicpO1xuXG4vKipcbiAqIENsYXNzIGZvciBtYW5hZ2luZyBhbmQgbG9hZGluZyBhc3NldCBmaWxlc1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBBc3NldHMgPSBmdW5jdGlvbigpIHtcbiAgLyoqXG4gICAqIElzIGN1cnJlbnRseSBsb2FkaW5nIGFueSBhc3NldHNcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuXG4gIHRoaXMuaXRlbXNDb3VudCA9IDA7XG4gIHRoaXMubG9hZGVkSXRlbXNDb3VudCA9IDA7XG4gIHRoaXMucHJvZ3Jlc3MgPSAwO1xuXG4gIHRoaXMuX3RoaW5nc1RvTG9hZCA9IDA7XG4gIHRoaXMuX2RhdGEgPSB7fTtcbiAgdGhpcy5fcHJlbG9hZGluZyA9IHRydWU7XG5cbiAgdGhpcy5fY2FsbGJhY2sgPSBudWxsO1xuXG4gIHRoaXMuX3RvTG9hZCA9IFtdO1xuXG4gIHRoaXMuX2xvYWRlcnMgPSB7fTtcblxuICB0aGlzLmF1ZGlvID0gbmV3IFBvdGlvbkF1ZGlvKCk7XG5cbiAgdGhpcy5hZGRMb2FkZXIoJ2pzb24nLCBKc29uTG9hZGVyKTtcblxuICB0aGlzLmFkZExvYWRlcignbXAzJywgdGhpcy5hdWRpby5sb2FkLmJpbmQodGhpcy5hdWRpbykpO1xuICB0aGlzLmFkZExvYWRlcignbXVzaWMnLCB0aGlzLmF1ZGlvLmxvYWQuYmluZCh0aGlzLmF1ZGlvKSk7XG4gIHRoaXMuYWRkTG9hZGVyKCdzb3VuZCcsIHRoaXMuYXVkaW8ubG9hZC5iaW5kKHRoaXMuYXVkaW8pKTtcblxuICB0aGlzLmFkZExvYWRlcignaW1hZ2UnLCBpbWFnZUxvYWRlcik7XG4gIHRoaXMuYWRkTG9hZGVyKCd0ZXh0dXJlJywgaW1hZ2VMb2FkZXIpO1xuICB0aGlzLmFkZExvYWRlcignc3ByaXRlJywgaW1hZ2VMb2FkZXIpO1xufTtcblxuQXNzZXRzLnByb3RvdHlwZS5hZGRMb2FkZXIgPSBmdW5jdGlvbihuYW1lLCBmbikge1xuICB0aGlzLl9sb2FkZXJzW25hbWVdID0gZm47XG59O1xuXG4vKipcbiAqIFN0YXJ0cyBsb2FkaW5nIHN0b3JlZCBhc3NldHMgdXJscyBhbmQgcnVucyBnaXZlbiBjYWxsYmFjayBhZnRlciBldmVyeXRoaW5nIGlzIGxvYWRlZFxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBjYWxsYmFjayBmdW5jdGlvblxuICovXG5Bc3NldHMucHJvdG90eXBlLm9ubG9hZCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG5cbiAgaWYgKHRoaXMuX3RoaW5nc1RvTG9hZCA9PT0gMCkge1xuICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5fcHJlbG9hZGluZyA9IGZhbHNlO1xuICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuX25leHRGaWxlKCk7XG4gIH1cbn07XG5cbi8qKlxuICogR2V0dGVyIGZvciBsb2FkZWQgYXNzZXRzXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHVybCBvZiBzdG9yZWQgYXNzZXRcbiAqL1xuQXNzZXRzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHJldHVybiB0aGlzLl9kYXRhW3BhdGgubm9ybWFsaXplKG5hbWUpXTtcbn07XG5cbkFzc2V0cy5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24obmFtZSkge1xuICB0aGlzLnNldChuYW1lLCBudWxsKTtcbn07XG5cblxuLyoqXG4gKiBVc2VkIGZvciBzdG9yaW5nIHNvbWUgdmFsdWUgaW4gYXNzZXRzIG1vZHVsZVxuICogdXNlZnVsIGZvciBvdmVycmF0aW5nIHZhbHVlc1xuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB1cmwgb2YgdGhlIGFzc2V0XG4gKiBAcGFyYW0ge2FueX0gdmFsdWUgLSB2YWx1ZSB0byBiZSBzdG9yZWRcbiAqL1xuQXNzZXRzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB0aGlzLl9kYXRhW3BhdGgubm9ybWFsaXplKG5hbWUpXSA9IHZhbHVlO1xufTtcblxuLyoqXG4gKiBTdG9yZXMgdXJsIHNvIGl0IGNhbiBiZSBsb2FkZWQgbGF0ZXJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0gdHlwZSBvZiBhc3NldFxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIHVybCBvZiBnaXZlbiBhc3NldFxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBjYWxsYmFjayBmdW5jdGlvblxuICovXG5Bc3NldHMucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbih0eXBlLCB1cmwsIGNhbGxiYWNrKSB7XG4gIHZhciBsb2FkT2JqZWN0ID0geyB0eXBlOiB0eXBlLCB1cmw6IHVybCAhPSBudWxsID8gcGF0aC5ub3JtYWxpemUodXJsKSA6IG51bGwsIGNhbGxiYWNrOiBjYWxsYmFjayB9O1xuXG4gIGlmICh0aGlzLl9wcmVsb2FkaW5nKSB7XG4gICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xuICAgIHRoaXMuaXRlbXNDb3VudCArPSAxO1xuICAgIHRoaXMuX3RoaW5nc1RvTG9hZCArPSAxO1xuXG4gICAgdGhpcy5fdG9Mb2FkLnB1c2gobG9hZE9iamVjdCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuX2xvYWRBc3NldEZpbGUobG9hZE9iamVjdCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgc2VsZi5zZXQobG9hZE9iamVjdC51cmwsIGRhdGEpO1xuICAgICAgaWYgKGNhbGxiYWNrKSB7IGNhbGxiYWNrKGRhdGEpOyB9XG4gICAgfSk7XG4gIH1cbn07XG5cbkFzc2V0cy5wcm90b3R5cGUuX2ZpbmlzaGVkT25lRmlsZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9uZXh0RmlsZSgpO1xuICB0aGlzLnByb2dyZXNzID0gdGhpcy5sb2FkZWRJdGVtc0NvdW50IC8gdGhpcy5pdGVtc0NvdW50O1xuICB0aGlzLl90aGluZ3NUb0xvYWQgLT0gMTtcbiAgdGhpcy5sb2FkZWRJdGVtc0NvdW50ICs9IDE7XG5cbiAgaWYgKHRoaXMuX3RoaW5nc1RvTG9hZCA9PT0gMCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi5fY2FsbGJhY2soKTtcbiAgICAgIHNlbGYuX3ByZWxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHNlbGYuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgfSwgMCk7XG4gIH1cbn07XG5cbkFzc2V0cy5wcm90b3R5cGUuX2Vycm9yID0gZnVuY3Rpb24odXJsKSB7XG4gIGNvbnNvbGUud2FybignRXJyb3IgbG9hZGluZyBcIicgKyB1cmwgKyAnXCIgYXNzZXQnKTtcbiAgdGhpcy5fbmV4dEZpbGUoKTtcbn07XG5cbkFzc2V0cy5wcm90b3R5cGUuX3NhdmUgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGNhbGxiYWNrKSB7XG4gIHRoaXMuc2V0KHVybCwgZGF0YSk7XG4gIGlmIChjYWxsYmFjaykgeyBjYWxsYmFjayhkYXRhKTsgfVxuICB0aGlzLl9maW5pc2hlZE9uZUZpbGUoKTtcbn07XG5cbkFzc2V0cy5wcm90b3R5cGUuX2hhbmRsZUN1c3RvbUxvYWRpbmcgPSBmdW5jdGlvbihsb2FkaW5nKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGRvbmUgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIHNlbGYuX3NhdmUobmFtZSwgdmFsdWUpO1xuICB9O1xuICBsb2FkaW5nKGRvbmUpO1xufTtcblxuQXNzZXRzLnByb3RvdHlwZS5fbmV4dEZpbGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGN1cnJlbnQgPSB0aGlzLl90b0xvYWQuc2hpZnQoKTtcblxuICBpZiAoIWN1cnJlbnQpIHsgcmV0dXJuOyB9XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLl9sb2FkQXNzZXRGaWxlKGN1cnJlbnQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBzZWxmLl9zYXZlKGN1cnJlbnQudXJsLCBkYXRhLCBjdXJyZW50LmNhbGxiYWNrKTtcbiAgfSk7XG59O1xuXG5Bc3NldHMucHJvdG90eXBlLl9sb2FkQXNzZXRGaWxlID0gZnVuY3Rpb24oZmlsZSwgY2FsbGJhY2spIHtcbiAgdmFyIHR5cGUgPSBmaWxlLnR5cGU7XG4gIHZhciB1cmwgPSBmaWxlLnVybDtcblxuICBpZiAodXRpbC5pc0Z1bmN0aW9uKHR5cGUpKSB7XG4gICAgdGhpcy5faGFuZGxlQ3VzdG9tTG9hZGluZyh0eXBlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0eXBlID0gdHlwZS50b0xvd2VyQ2FzZSgpO1xuXG4gIHZhciBsb2FkZXIgPSB0aGlzLl9sb2FkZXJzW3R5cGVdIHx8IHRleHRMb2FkZXI7XG4gIGxvYWRlcih1cmwsIGNhbGxiYWNrLCB0aGlzLl9lcnJvci5iaW5kKHRoaXMpKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXNzZXRzO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvYXNzZXRzLmpzXG4gKiovIiwidmFyIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxudmFyIGludktleXMgPSB7fTtcbmZvciAodmFyIGtleU5hbWUgaW4ga2V5cykge1xuICBpbnZLZXlzW2tleXNba2V5TmFtZV1dID0ga2V5TmFtZTtcbn1cblxudmFyIElucHV0ID0gZnVuY3Rpb24oYXBwLCBjb250YWluZXIpIHtcbiAgdGhpcy5fY29udGFpbmVyID0gY29udGFpbmVyO1xuICB0aGlzLl9rZXlzID0ge307XG5cbiAgdGhpcy5jYW5Db250cm9sS2V5cyA9IHRydWU7XG5cbiAgdGhpcy5tb3VzZSA9IHtcbiAgICBpc0Rvd246IGZhbHNlLFxuICAgIGlzTGVmdERvd246IGZhbHNlLFxuICAgIGlzTWlkZGxlRG93bjogZmFsc2UsXG4gICAgaXNSaWdodERvd246IGZhbHNlLFxuICAgIHg6IG51bGwsXG4gICAgeTogbnVsbFxuICB9O1xuXG4gIHRoaXMuX2FkZEV2ZW50cyhhcHApO1xufTtcblxuSW5wdXQucHJvdG90eXBlLnJlc2V0S2V5cyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9rZXlzID0ge307XG59O1xuXG5JbnB1dC5wcm90b3R5cGUuaXNLZXlEb3duID0gZnVuY3Rpb24oa2V5KSB7XG4gIGlmIChrZXkgPT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBpZiAodGhpcy5jYW5Db250cm9sS2V5cykge1xuICAgIHZhciBjb2RlID0gdHlwZW9mIGtleSA9PT0gJ251bWJlcicgPyBrZXkgOiBrZXlzW2tleS50b0xvd2VyQ2FzZSgpXTtcbiAgICByZXR1cm4gdGhpcy5fa2V5c1tjb2RlXTtcbiAgfVxufTtcblxuSW5wdXQucHJvdG90eXBlLl9hZGRFdmVudHMgPSBmdW5jdGlvbihhcHApIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciBtb3VzZUV2ZW50ID0ge1xuICAgIHg6IG51bGwsXG4gICAgeTogbnVsbCxcbiAgICBidXR0b246IG51bGwsXG4gICAgZXZlbnQ6IG51bGwsXG4gICAgc3RhdGVTdG9wRXZlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgYXBwLnN0YXRlcy5fcHJldmVudEV2ZW50ID0gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGtleWJvYXJkRXZlbnQgPSB7XG4gICAga2V5OiBudWxsLFxuICAgIG5hbWU6IG51bGwsXG4gICAgZXZlbnQ6IG51bGwsXG4gICAgc3RhdGVTdG9wRXZlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgYXBwLnN0YXRlcy5fcHJldmVudEV2ZW50ID0gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgc2VsZi5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgeCA9IGUub2Zmc2V0WCA9PT0gdW5kZWZpbmVkID8gZS5sYXllclggLSBzZWxmLl9jb250YWluZXIub2Zmc2V0TGVmdCA6IGUub2Zmc2V0WDtcbiAgICB2YXIgeSA9IGUub2Zmc2V0WSA9PT0gdW5kZWZpbmVkID8gZS5sYXllclkgLSBzZWxmLl9jb250YWluZXIub2Zmc2V0VG9wIDogZS5vZmZzZXRZO1xuXG4gICAgc2VsZi5tb3VzZS54ID0geDtcbiAgICBzZWxmLm1vdXNlLnkgPSB5O1xuXG4gICAgbW91c2VFdmVudC54ID0geDtcbiAgICBtb3VzZUV2ZW50LnkgPSB5O1xuICAgIG1vdXNlRXZlbnQuYnV0dG9uID0gbnVsbDtcbiAgICBtb3VzZUV2ZW50LmV2ZW50ID0gZTtcblxuICAgIGFwcC5zdGF0ZXMubW91c2Vtb3ZlKG1vdXNlRXZlbnQpO1xuICB9KTtcblxuICBzZWxmLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgeCA9IGUub2Zmc2V0WCA9PT0gdW5kZWZpbmVkID8gZS5sYXllclggLSBzZWxmLl9jb250YWluZXIub2Zmc2V0TGVmdCA6IGUub2Zmc2V0WDtcbiAgICB2YXIgeSA9IGUub2Zmc2V0WSA9PT0gdW5kZWZpbmVkID8gZS5sYXllclkgLSBzZWxmLl9jb250YWluZXIub2Zmc2V0VG9wIDogZS5vZmZzZXRZO1xuXG4gICAgc2VsZi5tb3VzZS5pc0Rvd24gPSBmYWxzZTtcblxuICAgIHN3aXRjaCAoZS5idXR0b24pIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgc2VsZi5tb3VzZS5pc0xlZnREb3duID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgc2VsZi5tb3VzZS5pc01pZGRsZURvd24gPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHNlbGYubW91c2UuaXNSaWdodERvd24gPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgbW91c2VFdmVudC54ID0geDtcbiAgICBtb3VzZUV2ZW50LnkgPSB5O1xuICAgIG1vdXNlRXZlbnQuYnV0dG9uID0gZS5idXR0b247XG4gICAgbW91c2VFdmVudC5ldmVudCA9IGU7XG5cbiAgICBhcHAuc3RhdGVzLm1vdXNldXAobW91c2VFdmVudCk7XG4gIH0sIGZhbHNlKTtcblxuICBzZWxmLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciB4ID0gZS5vZmZzZXRYID09PSB1bmRlZmluZWQgPyBlLmxheWVyWCAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRMZWZ0IDogZS5vZmZzZXRYO1xuICAgIHZhciB5ID0gZS5vZmZzZXRZID09PSB1bmRlZmluZWQgPyBlLmxheWVyWSAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRUb3AgOiBlLm9mZnNldFk7XG5cbiAgICBzZWxmLm1vdXNlLnggPSB4O1xuICAgIHNlbGYubW91c2UueSA9IHk7XG4gICAgc2VsZi5tb3VzZS5pc0Rvd24gPSB0cnVlO1xuXG4gICAgc3dpdGNoIChlLmJ1dHRvbikge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBzZWxmLm1vdXNlLmlzTGVmdERvd24gPSB0cnVlO1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHNlbGYubW91c2UuaXNNaWRkbGVEb3duID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHNlbGYubW91c2UuaXNSaWdodERvd24gPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBtb3VzZUV2ZW50LnggPSB4O1xuICAgIG1vdXNlRXZlbnQueSA9IHk7XG4gICAgbW91c2VFdmVudC5idXR0b24gPSBlLmJ1dHRvbjtcbiAgICBtb3VzZUV2ZW50LmV2ZW50ID0gZTtcblxuICAgIGFwcC5zdGF0ZXMubW91c2Vkb3duKG1vdXNlRXZlbnQpO1xuICB9LCBmYWxzZSk7XG5cbiAgc2VsZi5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgZm9yICh2YXIgaT0wOyBpPGUudG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHRvdWNoID0gZS50b3VjaGVzW2ldO1xuXG4gICAgICB2YXIgeCA9IHRvdWNoLnBhZ2VYIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldExlZnQ7XG4gICAgICB2YXIgeSA9IHRvdWNoLnBhZ2VZIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldFRvcDtcblxuICAgICAgc2VsZi5tb3VzZS54ID0geDtcbiAgICAgIHNlbGYubW91c2UueSA9IHk7XG4gICAgICBzZWxmLm1vdXNlLmlzRG93biA9IHRydWU7XG4gICAgICBzZWxmLm1vdXNlLmlzTGVmdERvd24gPSB0cnVlO1xuXG4gICAgICBtb3VzZUV2ZW50LnggPSB4O1xuICAgICAgbW91c2VFdmVudC55ID0geTtcbiAgICAgIG1vdXNlRXZlbnQuYnV0dG9uID0gMTtcbiAgICAgIG1vdXNlRXZlbnQuZXZlbnQgPSBlO1xuXG4gICAgICBhcHAuc3RhdGVzLm1vdXNlZG93bihtb3VzZUV2ZW50KTtcbiAgICB9XG4gIH0pO1xuXG4gIHNlbGYuX2NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgZm9yICh2YXIgaT0wOyBpPGUudG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHRvdWNoID0gZS50b3VjaGVzW2ldO1xuXG4gICAgICB2YXIgeCA9IHRvdWNoLnBhZ2VYIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldExlZnQ7XG4gICAgICB2YXIgeSA9IHRvdWNoLnBhZ2VZIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldFRvcDtcblxuICAgICAgc2VsZi5tb3VzZS54ID0geDtcbiAgICAgIHNlbGYubW91c2UueSA9IHk7XG4gICAgICBzZWxmLm1vdXNlLmlzRG93biA9IHRydWU7XG4gICAgICBzZWxmLm1vdXNlLmlzTGVmdERvd24gPSB0cnVlO1xuXG4gICAgICBtb3VzZUV2ZW50LnggPSB4O1xuICAgICAgbW91c2VFdmVudC55ID0geTtcbiAgICAgIG1vdXNlRXZlbnQuZXZlbnQgPSBlO1xuXG4gICAgICBhcHAuc3RhdGVzLm1vdXNlbW92ZShtb3VzZUV2ZW50KTtcbiAgICB9XG4gIH0pO1xuXG4gIHNlbGYuX2NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgdG91Y2ggPSBlLmNoYW5nZWRUb3VjaGVzWzBdO1xuXG4gICAgdmFyIHggPSB0b3VjaC5wYWdlWCAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRMZWZ0O1xuICAgIHZhciB5ID0gdG91Y2gucGFnZVkgLSBzZWxmLl9jb250YWluZXIub2Zmc2V0VG9wO1xuXG4gICAgc2VsZi5tb3VzZS54ID0geDtcbiAgICBzZWxmLm1vdXNlLnkgPSB5O1xuICAgIHNlbGYubW91c2UuaXNEb3duID0gZmFsc2U7XG4gICAgc2VsZi5tb3VzZS5pc0xlZnREb3duID0gZmFsc2U7XG5cbiAgICBtb3VzZUV2ZW50LnggPSB4O1xuICAgIG1vdXNlRXZlbnQueSA9IHk7XG4gICAgbW91c2VFdmVudC5ldmVudCA9IGU7XG5cbiAgICBhcHAuc3RhdGVzLm1vdXNldXAobW91c2VFdmVudCk7XG4gIH0pO1xuXG4gIHNlbGYuX2NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH0pO1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgc2VsZi5fa2V5c1tlLmtleUNvZGVdID0gdHJ1ZTtcblxuICAgIGtleWJvYXJkRXZlbnQua2V5ID0gZS53aGljaDtcbiAgICBrZXlib2FyZEV2ZW50Lm5hbWUgPSBpbnZLZXlzW2Uud2hpY2hdO1xuICAgIGtleWJvYXJkRXZlbnQuZXZlbnQgPSBlO1xuXG4gICAgYXBwLnN0YXRlcy5rZXlkb3duKGtleWJvYXJkRXZlbnQpO1xuICB9KTtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBzZWxmLl9rZXlzW2Uua2V5Q29kZV0gPSBmYWxzZTtcblxuICAgIGtleWJvYXJkRXZlbnQua2V5ID0gZS53aGljaDtcbiAgICBrZXlib2FyZEV2ZW50Lm5hbWUgPSBpbnZLZXlzW2Uud2hpY2hdO1xuICAgIGtleWJvYXJkRXZlbnQuZXZlbnQgPSBlO1xuXG4gICAgYXBwLnN0YXRlcy5rZXl1cChrZXlib2FyZEV2ZW50KTtcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvaW5wdXQuanNcbiAqKi8iLCJ2YXIgTG9hZGluZyA9IGZ1bmN0aW9uKGFwcCkge1xuICB0aGlzLmFwcCA9IGFwcDtcblxuICB0aGlzLmJhcldpZHRoID0gMDtcblxuICB0aGlzLnZpZGVvID0gYXBwLnZpZGVvLmNyZWF0ZUxheWVyKHtcbiAgICBhbGxvd0hpRFBJOiB0cnVlLFxuICAgIGdldENhbnZhc0NvbnRleHQ6IHRydWVcbiAgfSk7XG5cbiAgdGhpcy52aWRlby5jYW52YXMuY2xhc3NOYW1lICs9ICcgdGVzdCc7XG59O1xuXG5Mb2FkaW5nLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbih0aW1lKSB7XG4gIHRoaXMudmlkZW8uY2xlYXIoKTtcblxuICB2YXIgY29sb3IxID0gJyNiOWZmNzEnO1xuICB2YXIgY29sb3IyID0gJyM4YWMyNTAnO1xuICB2YXIgY29sb3IzID0gJyM2NDhlMzgnO1xuXG4gIHZhciB3aWR0aCA9IE1hdGgubWluKHRoaXMuYXBwLndpZHRoICogMi8zLCAzMDApO1xuICB2YXIgaGVpZ2h0ID0gMjA7XG5cbiAgdmFyIHkgPSAodGhpcy5hcHAuaGVpZ2h0IC0gaGVpZ2h0KSAvIDI7XG4gIHZhciB4ID0gKHRoaXMuYXBwLndpZHRoIC0gd2lkdGgpIC8gMjtcblxuICB2YXIgY3VycmVudFdpZHRoID0gd2lkdGggKiB0aGlzLmFwcC5hc3NldHMucHJvZ3Jlc3M7XG4gIHRoaXMuYmFyV2lkdGggPSB0aGlzLmJhcldpZHRoICsgKGN1cnJlbnRXaWR0aCAtIHRoaXMuYmFyV2lkdGgpICogdGltZSAqIDEwO1xuXG4gIHRoaXMudmlkZW8uY3R4LmZpbGxTdHlsZSA9IGNvbG9yMjtcbiAgdGhpcy52aWRlby5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5hcHAud2lkdGgsIHRoaXMuYXBwLmhlaWdodCk7XG5cbiAgdGhpcy52aWRlby5jdHguZm9udCA9ICc0MDAgNDBweCBzYW5zLXNlcmlmJztcbiAgdGhpcy52aWRlby5jdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gIHRoaXMudmlkZW8uY3R4LnRleHRCYXNlbGluZSA9ICdib3R0b20nO1xuXG4gIHRoaXMudmlkZW8uY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDAsIDAsIDAsIDAuMSknO1xuICB0aGlzLnZpZGVvLmN0eC5maWxsVGV4dChcIlBvdGlvbi5qc1wiLCB0aGlzLmFwcC53aWR0aC8yLCB5ICsgMik7XG5cbiAgdGhpcy52aWRlby5jdHguZmlsbFN0eWxlID0gJyNkMWZmYTEnO1xuICB0aGlzLnZpZGVvLmN0eC5maWxsVGV4dChcIlBvdGlvbi5qc1wiLCB0aGlzLmFwcC53aWR0aC8yLCB5KTtcblxuICB0aGlzLnZpZGVvLmN0eC5zdHJva2VTdHlsZSA9IHRoaXMudmlkZW8uY3R4LmZpbGxTdHlsZSA9IGNvbG9yMztcbiAgdGhpcy52aWRlby5jdHguZmlsbFJlY3QoeCwgeSArIDE1LCB3aWR0aCwgaGVpZ2h0KTtcblxuICB0aGlzLnZpZGVvLmN0eC5saW5lV2lkdGggPSAyO1xuICB0aGlzLnZpZGVvLmN0eC5iZWdpblBhdGgoKTtcbiAgdGhpcy52aWRlby5jdHgucmVjdCh4IC0gNSwgeSArIDEwLCB3aWR0aCArIDEwLCBoZWlnaHQgKyAxMCk7XG4gIHRoaXMudmlkZW8uY3R4LmNsb3NlUGF0aCgpO1xuICB0aGlzLnZpZGVvLmN0eC5zdHJva2UoKTtcblxuICB0aGlzLnZpZGVvLmN0eC5zdHJva2VTdHlsZSA9IHRoaXMudmlkZW8uY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDAsIDAsIDAsIDAuMSknO1xuICB0aGlzLnZpZGVvLmN0eC5maWxsUmVjdCh4LCB5ICsgMTUsIHRoaXMuYmFyV2lkdGgsIGhlaWdodCArIDIpO1xuXG4gIHRoaXMudmlkZW8uY3R4LmxpbmVXaWR0aCA9IDI7XG4gIHRoaXMudmlkZW8uY3R4LmJlZ2luUGF0aCgpO1xuXG4gIHRoaXMudmlkZW8uY3R4Lm1vdmVUbyh4ICsgdGhpcy5iYXJXaWR0aCwgeSArIDEyKTtcbiAgdGhpcy52aWRlby5jdHgubGluZVRvKHggLSA1LCB5ICsgMTIpO1xuICB0aGlzLnZpZGVvLmN0eC5saW5lVG8oeCAtIDUsIHkgKyAxMCArIGhlaWdodCArIDEyKTtcbiAgdGhpcy52aWRlby5jdHgubGluZVRvKHggKyB0aGlzLmJhcldpZHRoLCB5ICsgMTAgKyBoZWlnaHQgKyAxMik7XG5cbiAgdGhpcy52aWRlby5jdHguc3Ryb2tlKCk7XG4gIHRoaXMudmlkZW8uY3R4LmNsb3NlUGF0aCgpO1xuXG4gIHRoaXMudmlkZW8uY3R4LnN0cm9rZVN0eWxlID0gdGhpcy52aWRlby5jdHguZmlsbFN0eWxlID0gY29sb3IxO1xuICB0aGlzLnZpZGVvLmN0eC5maWxsUmVjdCh4LCB5ICsgMTUsIHRoaXMuYmFyV2lkdGgsIGhlaWdodCk7XG5cbiAgdGhpcy52aWRlby5jdHgubGluZVdpZHRoID0gMjtcbiAgdGhpcy52aWRlby5jdHguYmVnaW5QYXRoKCk7XG5cbiAgdGhpcy52aWRlby5jdHgubW92ZVRvKHggKyB0aGlzLmJhcldpZHRoLCB5ICsgMTApO1xuICB0aGlzLnZpZGVvLmN0eC5saW5lVG8oeCAtIDUsIHkgKyAxMCk7XG4gIHRoaXMudmlkZW8uY3R4LmxpbmVUbyh4IC0gNSwgeSArIDEwICsgaGVpZ2h0ICsgMTApO1xuICB0aGlzLnZpZGVvLmN0eC5saW5lVG8oeCArIHRoaXMuYmFyV2lkdGgsIHkgKyAxMCArIGhlaWdodCArIDEwKTtcblxuICB0aGlzLnZpZGVvLmN0eC5zdHJva2UoKTtcbiAgdGhpcy52aWRlby5jdHguY2xvc2VQYXRoKCk7XG59O1xuXG5Mb2FkaW5nLnByb3RvdHlwZS5leGl0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMudmlkZW8uZGVzdHJveSgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2FkaW5nO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbG9hZGluZy5qc1xuICoqLyIsInZhciBEaXJ0eU1hbmFnZXIgPSBmdW5jdGlvbihjYW52YXMsIGN0eCkge1xuICB0aGlzLmN0eCA9IGN0eDtcbiAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG5cbiAgdGhpcy50b3AgPSBjYW52YXMuaGVpZ2h0O1xuICB0aGlzLmxlZnQgPSBjYW52YXMud2lkdGg7XG4gIHRoaXMuYm90dG9tID0gMDtcbiAgdGhpcy5yaWdodCA9IDA7XG5cbiAgdGhpcy5pc0RpcnR5ID0gZmFsc2U7XG59O1xuXG5EaXJ0eU1hbmFnZXIucHJvdG90eXBlLmFkZFJlY3QgPSBmdW5jdGlvbihsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHQpIHtcbiAgdmFyIHJpZ2h0ICA9IGxlZnQgKyB3aWR0aDtcbiAgdmFyIGJvdHRvbSA9IHRvcCArIGhlaWdodDtcblxuICB0aGlzLnRvcCAgICA9IHRvcCA8IHRoaXMudG9wICAgICAgID8gdG9wICAgIDogdGhpcy50b3A7XG4gIHRoaXMubGVmdCAgID0gbGVmdCA8IHRoaXMubGVmdCAgICAgPyBsZWZ0ICAgOiB0aGlzLmxlZnQ7XG4gIHRoaXMuYm90dG9tID0gYm90dG9tID4gdGhpcy5ib3R0b20gPyBib3R0b20gOiB0aGlzLmJvdHRvbTtcbiAgdGhpcy5yaWdodCAgPSByaWdodCA+IHRoaXMucmlnaHQgICA/IHJpZ2h0ICA6IHRoaXMucmlnaHQ7XG5cbiAgdGhpcy5pc0RpcnR5ID0gdHJ1ZTtcbn07XG5cbkRpcnR5TWFuYWdlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLmlzRGlydHkpIHsgcmV0dXJuOyB9XG5cbiAgdGhpcy5jdHguY2xlYXJSZWN0KHRoaXMubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9wLFxuICAgICAgICAgICAgICAgICAgICAgdGhpcy5yaWdodCAtIHRoaXMubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm90dG9tIC0gdGhpcy50b3ApO1xuXG4gIHRoaXMubGVmdCA9IHRoaXMuY2FudmFzLndpZHRoO1xuICB0aGlzLnRvcCA9IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgdGhpcy5yaWdodCA9IDA7XG4gIHRoaXMuYm90dG9tID0gMDtcblxuICB0aGlzLmlzRGlydHkgPSBmYWxzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGlydHlNYW5hZ2VyO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcG90aW9uLWRlYnVnZ2VyL2RpcnR5LW1hbmFnZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxMlxuICoqIG1vZHVsZSBjaHVua3MgPSAxMlxuICoqLyIsInZhciBpc1JldGluYSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbWVkaWFRdWVyeSA9IFwiKC13ZWJraXQtbWluLWRldmljZS1waXhlbC1yYXRpbzogMS41KSxcXFxuICAobWluLS1tb3otZGV2aWNlLXBpeGVsLXJhdGlvOiAxLjUpLFxcXG4gICgtby1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAzLzIpLFxcXG4gIChtaW4tcmVzb2x1dGlvbjogMS41ZHBweClcIjtcblxuICBpZiAod2luZG93LmRldmljZVBpeGVsUmF0aW8gPiAxKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmICh3aW5kb3cubWF0Y2hNZWRpYSAmJiB3aW5kb3cubWF0Y2hNZWRpYShtZWRpYVF1ZXJ5KS5tYXRjaGVzKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaXNSZXRpbmE7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZXRpbmEuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgJ2JhY2tzcGFjZSc6IDgsXG4gICd0YWInOiA5LFxuICAnZW50ZXInOiAxMyxcbiAgJ3BhdXNlJzogMTksXG4gICdjYXBzJzogMjAsXG4gICdlc2MnOiAyNyxcbiAgJ3NwYWNlJzogMzIsXG4gICdwYWdlX3VwJzogMzMsXG4gICdwYWdlX2Rvd24nOiAzNCxcbiAgJ2VuZCc6IDM1LFxuICAnaG9tZSc6IDM2LFxuICAnbGVmdCc6IDM3LFxuICAndXAnOiAzOCxcbiAgJ3JpZ2h0JzogMzksXG4gICdkb3duJzogNDAsXG4gICdpbnNlcnQnOiA0NSxcbiAgJ2RlbGV0ZSc6IDQ2LFxuICAnMCc6IDQ4LFxuICAnMSc6IDQ5LFxuICAnMic6IDUwLFxuICAnMyc6IDUxLFxuICAnNCc6IDUyLFxuICAnNSc6IDUzLFxuICAnNic6IDU0LFxuICAnNyc6IDU1LFxuICAnOCc6IDU2LFxuICAnOSc6IDU3LFxuICAnYSc6IDY1LFxuICAnYic6IDY2LFxuICAnYyc6IDY3LFxuICAnZCc6IDY4LFxuICAnZSc6IDY5LFxuICAnZic6IDcwLFxuICAnZyc6IDcxLFxuICAnaCc6IDcyLFxuICAnaSc6IDczLFxuICAnaic6IDc0LFxuICAnayc6IDc1LFxuICAnbCc6IDc2LFxuICAnbSc6IDc3LFxuICAnbic6IDc4LFxuICAnbyc6IDc5LFxuICAncCc6IDgwLFxuICAncSc6IDgxLFxuICAncic6IDgyLFxuICAncyc6IDgzLFxuICAndCc6IDg0LFxuICAndSc6IDg1LFxuICAndic6IDg2LFxuICAndyc6IDg3LFxuICAneCc6IDg4LFxuICAneSc6IDg5LFxuICAneic6IDkwLFxuICAnbnVtcGFkXzAnOiA5NixcbiAgJ251bXBhZF8xJzogOTcsXG4gICdudW1wYWRfMic6IDk4LFxuICAnbnVtcGFkXzMnOiA5OSxcbiAgJ251bXBhZF80JzogMTAwLFxuICAnbnVtcGFkXzUnOiAxMDEsXG4gICdudW1wYWRfNic6IDEwMixcbiAgJ251bXBhZF83JzogMTAzLFxuICAnbnVtcGFkXzgnOiAxMDQsXG4gICdudW1wYWRfOSc6IDEwNSxcbiAgJ211bHRpcGx5JzogMTA2LFxuICAnYWRkJzogMTA3LFxuICAnc3Vic3RyYWN0JzogMTA5LFxuICAnZGVjaW1hbCc6IDExMCxcbiAgJ2RpdmlkZSc6IDExMSxcbiAgJ2YxJzogMTEyLFxuICAnZjInOiAxMTMsXG4gICdmMyc6IDExNCxcbiAgJ2Y0JzogMTE1LFxuICAnZjUnOiAxMTYsXG4gICdmNic6IDExNyxcbiAgJ2Y3JzogMTE4LFxuICAnZjgnOiAxMTksXG4gICdmOSc6IDEyMCxcbiAgJ2YxMCc6IDEyMSxcbiAgJ2YxMSc6IDEyMixcbiAgJ2YxMic6IDEyMyxcbiAgJ3NoaWZ0JzogMTYsXG4gICdjdHJsJzogMTcsXG4gICdhbHQnOiAxOCxcbiAgJ3BsdXMnOiAxODcsXG4gICdjb21tYSc6IDE4OCxcbiAgJ21pbnVzJzogMTg5LFxuICAncGVyaW9kJzogMTkwXG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMva2V5cy5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXJsLCBjYWxsYmFjaywgZXJyb3IpIHtcbiAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ3RleHQnO1xuICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICByZXR1cm4gZXJyb3IodXJsKTtcbiAgICB9XG5cbiAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSk7XG4gICAgY2FsbGJhY2soZGF0YSk7XG4gIH07XG4gIHJlcXVlc3Quc2VuZCgpO1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xvYWRlci9qc29uLWxvYWRlci5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXJsLCBjYWxsYmFjaywgZXJyb3IpIHtcbiAgdmFyIGltYWdlID0gbmV3IEltYWdlKCk7XG4gIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIGNhbGxiYWNrKGltYWdlKTtcbiAgfTtcbiAgaW1hZ2Uub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgIGVycm9yKHVybCk7XG4gIH07XG4gIGltYWdlLnNyYyA9IHVybDtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9sb2FkZXIvaW1hZ2UtbG9hZGVyLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1cmwsIGNhbGxiYWNrLCBlcnJvcikge1xuICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gIHJlcXVlc3Qub3BlbignR0VUJywgdXJsLCB0cnVlKTtcbiAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSAndGV4dCc7XG4gIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHJlcXVlc3Quc3RhdHVzICE9PSAyMDApIHtcbiAgICAgIHJldHVybiBlcnJvcih1cmwpO1xuICAgIH1cblxuICAgIHZhciBkYXRhID0gdGhpcy5yZXNwb25zZTtcbiAgICBjYWxsYmFjayhkYXRhKTtcbiAgfTtcbiAgcmVxdWVzdC5zZW5kKCk7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbG9hZGVyL3RleHQtbG9hZGVyLmpzXG4gKiovIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3V0aWwvdXRpbC5qc1xuICoqIG1vZHVsZSBpZCA9IDE4XG4gKiogbW9kdWxlIGNodW5rcyA9IDEyXG4gKiovIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCBhcnJheSB3aXRoIGRpcmVjdG9yeSBuYW1lcyB0aGVyZVxuLy8gbXVzdCBiZSBubyBzbGFzaGVzLCBlbXB0eSBlbGVtZW50cywgb3IgZGV2aWNlIG5hbWVzIChjOlxcKSBpbiB0aGUgYXJyYXlcbi8vIChzbyBhbHNvIG5vIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgLSBpdCBkb2VzIG5vdCBkaXN0aW5ndWlzaFxuLy8gcmVsYXRpdmUgYW5kIGFic29sdXRlIHBhdGhzKVxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkocGFydHMsIGFsbG93QWJvdmVSb290KSB7XG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBsYXN0ID0gcGFydHNbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuLy8gU3BsaXQgYSBmaWxlbmFtZSBpbnRvIFtyb290LCBkaXIsIGJhc2VuYW1lLCBleHRdLCB1bml4IHZlcnNpb25cbi8vICdyb290JyBpcyBqdXN0IGEgc2xhc2gsIG9yIG5vdGhpbmcuXG52YXIgc3BsaXRQYXRoUmUgPVxuICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xudmFyIHNwbGl0UGF0aCA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHJldHVybiBzcGxpdFBhdGhSZS5leGVjKGZpbGVuYW1lKS5zbGljZSgxKTtcbn07XG5cbi8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVzb2x2ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzb2x2ZWRQYXRoID0gJycsXG4gICAgICByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICB2YXIgcGF0aCA9IChpID49IDApID8gYXJndW1lbnRzW2ldIDogcHJvY2Vzcy5jd2QoKTtcblxuICAgIC8vIFNraXAgZW1wdHkgYW5kIGludmFsaWQgZW50cmllc1xuICAgIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLnJlc29sdmUgbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfSBlbHNlIGlmICghcGF0aCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcmVzb2x2ZWRQYXRoID0gcGF0aCArICcvJyArIHJlc29sdmVkUGF0aDtcbiAgICByZXNvbHZlZEFic29sdXRlID0gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbiAgfVxuXG4gIC8vIEF0IHRoaXMgcG9pbnQgdGhlIHBhdGggc2hvdWxkIGJlIHJlc29sdmVkIHRvIGEgZnVsbCBhYnNvbHV0ZSBwYXRoLCBidXRcbiAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzIHRvIGJlIHNhZmUgKG1pZ2h0IGhhcHBlbiB3aGVuIHByb2Nlc3MuY3dkKCkgZmFpbHMpXG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHJlc29sdmVkUGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihyZXNvbHZlZFBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhcmVzb2x2ZWRBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIHJldHVybiAoKHJlc29sdmVkQWJzb2x1dGUgPyAnLycgOiAnJykgKyByZXNvbHZlZFBhdGgpIHx8ICcuJztcbn07XG5cbi8vIHBhdGgubm9ybWFsaXplKHBhdGgpXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIGlzQWJzb2x1dGUgPSBleHBvcnRzLmlzQWJzb2x1dGUocGF0aCksXG4gICAgICB0cmFpbGluZ1NsYXNoID0gc3Vic3RyKHBhdGgsIC0xKSA9PT0gJy8nO1xuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICBwYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhaXNBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIGlmICghcGF0aCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgIHBhdGggPSAnLic7XG4gIH1cbiAgaWYgKHBhdGggJiYgdHJhaWxpbmdTbGFzaCkge1xuICAgIHBhdGggKz0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIChpc0Fic29sdXRlID8gJy8nIDogJycpICsgcGF0aDtcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguY2hhckF0KDApID09PSAnLyc7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmpvaW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIGV4cG9ydHMubm9ybWFsaXplKGZpbHRlcihwYXRocywgZnVuY3Rpb24ocCwgaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5qb2luIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH1cbiAgICByZXR1cm4gcDtcbiAgfSkuam9pbignLycpKTtcbn07XG5cblxuLy8gcGF0aC5yZWxhdGl2ZShmcm9tLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVsYXRpdmUgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICBmcm9tID0gZXhwb3J0cy5yZXNvbHZlKGZyb20pLnN1YnN0cigxKTtcbiAgdG8gPSBleHBvcnRzLnJlc29sdmUodG8pLnN1YnN0cigxKTtcblxuICBmdW5jdGlvbiB0cmltKGFycikge1xuICAgIHZhciBzdGFydCA9IDA7XG4gICAgZm9yICg7IHN0YXJ0IDwgYXJyLmxlbmd0aDsgc3RhcnQrKykge1xuICAgICAgaWYgKGFycltzdGFydF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICB2YXIgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgZm9yICg7IGVuZCA+PSAwOyBlbmQtLSkge1xuICAgICAgaWYgKGFycltlbmRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0ID4gZW5kKSByZXR1cm4gW107XG4gICAgcmV0dXJuIGFyci5zbGljZShzdGFydCwgZW5kIC0gc3RhcnQgKyAxKTtcbiAgfVxuXG4gIHZhciBmcm9tUGFydHMgPSB0cmltKGZyb20uc3BsaXQoJy8nKSk7XG4gIHZhciB0b1BhcnRzID0gdHJpbSh0by5zcGxpdCgnLycpKTtcblxuICB2YXIgbGVuZ3RoID0gTWF0aC5taW4oZnJvbVBhcnRzLmxlbmd0aCwgdG9QYXJ0cy5sZW5ndGgpO1xuICB2YXIgc2FtZVBhcnRzTGVuZ3RoID0gbGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGZyb21QYXJ0c1tpXSAhPT0gdG9QYXJ0c1tpXSkge1xuICAgICAgc2FtZVBhcnRzTGVuZ3RoID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvdXRwdXRQYXJ0cyA9IFtdO1xuICBmb3IgKHZhciBpID0gc2FtZVBhcnRzTGVuZ3RoOyBpIDwgZnJvbVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0cHV0UGFydHMucHVzaCgnLi4nKTtcbiAgfVxuXG4gIG91dHB1dFBhcnRzID0gb3V0cHV0UGFydHMuY29uY2F0KHRvUGFydHMuc2xpY2Uoc2FtZVBhcnRzTGVuZ3RoKSk7XG5cbiAgcmV0dXJuIG91dHB1dFBhcnRzLmpvaW4oJy8nKTtcbn07XG5cbmV4cG9ydHMuc2VwID0gJy8nO1xuZXhwb3J0cy5kZWxpbWl0ZXIgPSAnOic7XG5cbmV4cG9ydHMuZGlybmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIHJlc3VsdCA9IHNwbGl0UGF0aChwYXRoKSxcbiAgICAgIHJvb3QgPSByZXN1bHRbMF0sXG4gICAgICBkaXIgPSByZXN1bHRbMV07XG5cbiAgaWYgKCFyb290ICYmICFkaXIpIHtcbiAgICAvLyBObyBkaXJuYW1lIHdoYXRzb2V2ZXJcbiAgICByZXR1cm4gJy4nO1xuICB9XG5cbiAgaWYgKGRpcikge1xuICAgIC8vIEl0IGhhcyBhIGRpcm5hbWUsIHN0cmlwIHRyYWlsaW5nIHNsYXNoXG4gICAgZGlyID0gZGlyLnN1YnN0cigwLCBkaXIubGVuZ3RoIC0gMSk7XG4gIH1cblxuICByZXR1cm4gcm9vdCArIGRpcjtcbn07XG5cblxuZXhwb3J0cy5iYXNlbmFtZSA9IGZ1bmN0aW9uKHBhdGgsIGV4dCkge1xuICB2YXIgZiA9IHNwbGl0UGF0aChwYXRoKVsyXTtcbiAgLy8gVE9ETzogbWFrZSB0aGlzIGNvbXBhcmlzb24gY2FzZS1pbnNlbnNpdGl2ZSBvbiB3aW5kb3dzP1xuICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBmO1xufTtcblxuXG5leHBvcnRzLmV4dG5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBzcGxpdFBhdGgocGF0aClbM107XG59O1xuXG5mdW5jdGlvbiBmaWx0ZXIgKHhzLCBmKSB7XG4gICAgaWYgKHhzLmZpbHRlcikgcmV0dXJuIHhzLmZpbHRlcihmKTtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZih4c1tpXSwgaSwgeHMpKSByZXMucHVzaCh4c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbi8vIFN0cmluZy5wcm90b3R5cGUuc3Vic3RyIC0gbmVnYXRpdmUgaW5kZXggZG9uJ3Qgd29yayBpbiBJRThcbnZhciBzdWJzdHIgPSAnYWInLnN1YnN0cigtMSkgPT09ICdiJ1xuICAgID8gZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikgeyByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKSB9XG4gICAgOiBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gc3RyLmxlbmd0aCArIHN0YXJ0O1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9XG47XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMTlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTJcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vc3JjL2F1ZGlvLW1hbmFnZXInKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3BvdGlvbi1hdWRpby9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDIwXG4gKiogbW9kdWxlIGNodW5rcyA9IDEyXG4gKiovIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuICAgIHZhciBjdXJyZW50UXVldWU7XG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtpXSgpO1xuICAgICAgICB9XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbn1cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgcXVldWUucHVzaChmdW4pO1xuICAgIGlmICghZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9wcm9jZXNzL2Jyb3dzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyMVxuICoqIG1vZHVsZSBjaHVua3MgPSAxMlxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qc1xuICoqIG1vZHVsZSBpZCA9IDIyXG4gKiogbW9kdWxlIGNodW5rcyA9IDEyXG4gKiovIiwidmFyIExvYWRlZEF1ZGlvID0gcmVxdWlyZSgnLi9sb2FkZWQtYXVkaW8nKTtcblxudmFyIEF1ZGlvTWFuYWdlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuXG4gIHRoaXMuX2N0eCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAgdGhpcy5fbWFzdGVyR2FpbiA9IHRoaXMuX2N0eC5jcmVhdGVHYWluKCk7XG4gIHRoaXMuX3ZvbHVtZSA9IDE7XG4gIHRoaXMuaXNNdXRlZCA9IGZhbHNlO1xuXG4gIHZhciBpT1MgPSAvKGlQYWR8aVBob25lfGlQb2QpL2cudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgaWYgKGlPUykge1xuICAgIHRoaXMuX2VuYWJsZWlPUygpO1xuICB9XG59O1xuXG5BdWRpb01hbmFnZXIucHJvdG90eXBlLl9lbmFibGVpT1MgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciB0b3VjaCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBidWZmZXIgPSBzZWxmLl9jdHguY3JlYXRlQnVmZmVyKDEsIDEsIDIyMDUwKTtcbiAgICB2YXIgc291cmNlID0gc2VsZi5fY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgIHNvdXJjZS5idWZmZXIgPSBidWZmZXI7XG4gICAgc291cmNlLmNvbm5lY3Qoc2VsZi5fY3R4LmRlc3RpbmF0aW9uKTtcbiAgICBzb3VyY2Uuc3RhcnQoMCk7XG5cbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRvdWNoLCBmYWxzZSk7XG4gIH07XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0b3VjaCwgZmFsc2UpO1xufTtcblxuQXVkaW9NYW5hZ2VyLnByb3RvdHlwZS5tdXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuaXNNdXRlZCA9IHRydWU7XG4gIHRoaXMuX3VwZGF0ZU11dGUoKTtcbn07XG5cbkF1ZGlvTWFuYWdlci5wcm90b3R5cGUudW5tdXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuaXNNdXRlZCA9IGZhbHNlO1xuICB0aGlzLl91cGRhdGVNdXRlKCk7XG59O1xuXG5BdWRpb01hbmFnZXIucHJvdG90eXBlLnRvZ2dsZU11dGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5pc011dGVkID0gIXRoaXMuaXNNdXRlZDtcbiAgdGhpcy5fdXBkYXRlTXV0ZSgpO1xufTtcblxuQXVkaW9NYW5hZ2VyLnByb3RvdHlwZS5fdXBkYXRlTXV0ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9tYXN0ZXJHYWluLmdhaW4udmFsdWUgPSB0aGlzLmlzTXV0ZWQgPyAwIDogdGhpcy5fdm9sdW1lO1xufTtcblxuQXVkaW9NYW5hZ2VyLnByb3RvdHlwZS5zZXRWb2x1bWUgPSBmdW5jdGlvbih2b2x1bWUpIHtcbiAgdGhpcy5fdm9sdW1lID0gdm9sdW1lO1xuICB0aGlzLl9tYXN0ZXJHYWluLmdhaW4udmFsdWUgPSB2b2x1bWU7XG59O1xuXG5BdWRpb01hbmFnZXIucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbih1cmwsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcbiAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBzZWxmLmRlY29kZUF1ZGlvRGF0YShyZXF1ZXN0LnJlc3BvbnNlLCBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIGNhbGxiYWNrKHNvdXJjZSk7XG4gICAgfSk7XG4gIH07XG4gIHJlcXVlc3Quc2VuZCgpO1xufTtcblxuQXVkaW9NYW5hZ2VyLnByb3RvdHlwZS5kZWNvZGVBdWRpb0RhdGEgPSBmdW5jdGlvbihkYXRhLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdGhpcy5fY3R4LmRlY29kZUF1ZGlvRGF0YShkYXRhLCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICB2YXIgYXVkaW8gPSBuZXcgTG9hZGVkQXVkaW8oc2VsZi5fY3R4LCByZXN1bHQsIHNlbGYuX21hc3RlckdhaW4pO1xuXG4gICAgY2FsbGJhY2soYXVkaW8pO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXVkaW9NYW5hZ2VyO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcG90aW9uLWF1ZGlvL3NyYy9hdWRpby1tYW5hZ2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTJcbiAqKi8iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi91dGlsL34vaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qc1xuICoqIG1vZHVsZSBpZCA9IDI0XG4gKiogbW9kdWxlIGNodW5rcyA9IDEyXG4gKiovIiwidmFyIFBsYXlpbmdBdWRpbyA9IHJlcXVpcmUoJy4vcGxheWluZy1hdWRpbycpO1xuXG52YXIgTG9hZGVkQXVkaW8gPSBmdW5jdGlvbihjdHgsIGJ1ZmZlciwgbWFzdGVyR2Fpbikge1xuICB0aGlzLl9jdHggPSBjdHg7XG4gIHRoaXMuX21hc3RlckdhaW4gPSBtYXN0ZXJHYWluO1xuICB0aGlzLl9idWZmZXIgPSBidWZmZXI7XG4gIHRoaXMuX2J1ZmZlci5sb29wID0gZmFsc2U7XG59O1xuXG5Mb2FkZWRBdWRpby5wcm90b3R5cGUuX2NyZWF0ZVNvdW5kID0gZnVuY3Rpb24oZ2Fpbikge1xuICB2YXIgc291cmNlID0gdGhpcy5fY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICBzb3VyY2UuYnVmZmVyID0gdGhpcy5fYnVmZmVyO1xuXG4gIHRoaXMuX21hc3RlckdhaW4uY29ubmVjdCh0aGlzLl9jdHguZGVzdGluYXRpb24pO1xuXG4gIGdhaW4uY29ubmVjdCh0aGlzLl9tYXN0ZXJHYWluKTtcblxuICBzb3VyY2UuY29ubmVjdChnYWluKTtcblxuICByZXR1cm4gc291cmNlO1xufTtcblxuTG9hZGVkQXVkaW8ucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGdhaW4gPSB0aGlzLl9jdHguY3JlYXRlR2FpbigpO1xuXG4gIHZhciBzb3VuZCA9IHRoaXMuX2NyZWF0ZVNvdW5kKGdhaW4pO1xuXG4gIHNvdW5kLnN0YXJ0KDApO1xuXG4gIHJldHVybiBuZXcgUGxheWluZ0F1ZGlvKHNvdW5kLCBnYWluKTtcbn07XG5cbkxvYWRlZEF1ZGlvLnByb3RvdHlwZS5mYWRlSW4gPSBmdW5jdGlvbih2YWx1ZSwgdGltZSkge1xuICB2YXIgZ2FpbiA9IHRoaXMuX2N0eC5jcmVhdGVHYWluKCk7XG5cbiAgdmFyIHNvdW5kID0gdGhpcy5fY3JlYXRlU291bmQoZ2Fpbik7XG5cbiAgZ2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKDAsIDApO1xuICBnYWluLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMC4wMSwgMCk7XG4gIGdhaW4uZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSh2YWx1ZSwgdGltZSk7XG5cbiAgc291bmQuc3RhcnQoMCk7XG5cbiAgcmV0dXJuIG5ldyBQbGF5aW5nQXVkaW8oc291bmQsIGdhaW4pO1xufTtcblxuTG9hZGVkQXVkaW8ucHJvdG90eXBlLmxvb3AgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGdhaW4gPSB0aGlzLl9jdHguY3JlYXRlR2FpbigpO1xuXG4gIHZhciBzb3VuZCA9IHRoaXMuX2NyZWF0ZVNvdW5kKGdhaW4pO1xuXG4gIHNvdW5kLmxvb3AgPSB0cnVlO1xuICBzb3VuZC5zdGFydCgwKTtcblxuICByZXR1cm4gbmV3IFBsYXlpbmdBdWRpbyhzb3VuZCwgZ2Fpbik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvYWRlZEF1ZGlvO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcG90aW9uLWF1ZGlvL3NyYy9sb2FkZWQtYXVkaW8uanNcbiAqKiBtb2R1bGUgaWQgPSAyNVxuICoqIG1vZHVsZSBjaHVua3MgPSAxMlxuICoqLyIsInZhciBQbGF5aW5nQXVkaW8gPSBmdW5jdGlvbihzb3VyY2UsIGdhaW4pIHtcbiAgdGhpcy5fZ2FpbiA9IGdhaW47XG4gIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcbn07XG5cblBsYXlpbmdBdWRpby5wcm90b3R5cGUuc2V0Vm9sdW1lID0gZnVuY3Rpb24odm9sdW1lKSB7XG4gIHRoaXMuX2dhaW4uZ2Fpbi52YWx1ZSA9IHZvbHVtZTtcbn07XG5cblBsYXlpbmdBdWRpby5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9zb3VyY2Uuc3RvcCgwKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWluZ0F1ZGlvO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcG90aW9uLWF1ZGlvL3NyYy9wbGF5aW5nLWF1ZGlvLmpzXG4gKiogbW9kdWxlIGlkID0gMjZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTJcbiAqKi8iXSwic291cmNlUm9vdCI6IiIsImZpbGUiOiJzaGFyZWQuanMifQ==