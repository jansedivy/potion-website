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
/******/ 		13:0
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

	var util = __webpack_require__(17);
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
	
	var isRetina = __webpack_require__(16)();
	
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
	
	var util = __webpack_require__(17);
	var path = __webpack_require__(19);
	
	var PotionAudio = __webpack_require__(20);
	
	var JsonLoader = __webpack_require__(13);
	var imageLoader = __webpack_require__(14);
	var textLoader = __webpack_require__(15);
	
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
	    var self = this;
	    this._toLoad.forEach(function (current) {
	      self._loadAssetFile(current, function (data) {
	        self._save(current.url, data, current.callback);
	      });
	    });
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
	
	var keys = __webpack_require__(18);
	
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
	    self.mouse.isActive = true;
	
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
	
	    self.mouse.isDown = self.mouse.isLeftDown || self.mouse.isRightDown || self.mouse.isMiddleDown;
	
	    mouseEvent.x = x;
	    mouseEvent.y = y;
	    mouseEvent.button = e.button;
	    mouseEvent.event = e;
	
	    app.states.mouseup(mouseEvent);
	  }, false);
	
	  self._container.addEventListener("mouseleave", function () {
	    self.mouse.isActive = false;
	
	    self.mouse.isDown = false;
	    self.mouse.isLeftDown = false;
	    self.mouse.isRightDown = false;
	    self.mouse.isMiddleDown = false;
	  });
	
	  self._container.addEventListener("mouseenter", function () {
	    self.mouse.isActive = true;
	  });
	
	  self._container.addEventListener("mousedown", function (e) {
	    e.preventDefault();
	
	    var x = e.offsetX === undefined ? e.layerX - self._container.offsetLeft : e.offsetX;
	    var y = e.offsetY === undefined ? e.layerY - self._container.offsetTop : e.offsetY;
	
	    self.mouse.x = x;
	    self.mouse.y = y;
	    self.mouse.isDown = true;
	    self.mouse.isActive = true;
	
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
	      self.mouse.isActive = true;
	
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
	      self.mouse.isActive = true;
	
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
	    self.mouse.isActive = false;
	    self.mouse.isDown = false;
	    self.mouse.isLeftDown = false;
	    self.mouse.isRightDown = false;
	    self.mouse.isMiddleDown = false;
	
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
/* 14 */
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
	
	    var data = this.response;
	    callback(data);
	  };
	  request.send();
	};

/***/ },
/* 16 */
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
/* 17 */
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
	
	exports.isBuffer = __webpack_require__(23);
	
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
/* 18 */
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

	module.exports = __webpack_require__(22);


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
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzYxZDdlOTlmZTY5OTMyMDZhZDMiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VuZ2luZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmFmLXBvbHlmaWxsLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RpbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YXRlLW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wb3Rpb24tZGVidWdnZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZpZGVvLmpzIiwid2VicGFjazovLy8uL3NyYy9hc3NldHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2lucHV0LmpzIiwid2VicGFjazovLy8uL3NyYy9sb2FkaW5nLmpzIiwid2VicGFjazovLy8uL34vcG90aW9uLWRlYnVnZ2VyL2RpcnR5LW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xvYWRlci9qc29uLWxvYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbG9hZGVyL2ltYWdlLWxvYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbG9hZGVyL3RleHQtbG9hZGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9yZXRpbmEuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC91dGlsLmpzIiwid2VicGFjazovLy8uL3NyYy9rZXlzLmpzIiwid2VicGFjazovLy8od2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3BhdGgtYnJvd3NlcmlmeS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3BvdGlvbi1hdWRpby9pbmRleC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wb3Rpb24tYXVkaW8vc3JjL2F1ZGlvLW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi91dGlsL34vaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9+L3BvdGlvbi1hdWRpby9zcmMvbG9hZGVkLWF1ZGlvLmpzIiwid2VicGFjazovLy8uL34vcG90aW9uLWF1ZGlvL3NyYy9wbGF5aW5nLWF1ZGlvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBUSxvQkFBb0I7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDRDOzs7Ozs7Ozs7O0FDeEZBLEtBQUksTUFBTSxHQUFHLG1CQUFPLENBQUMsQ0FBYyxDQUFDLENBQUM7O0FBRXJDLE9BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixPQUFJLEVBQUUsY0FBUyxNQUFNLEVBQUUsT0FBTyxFQUFFO0FBQzlCLFNBQUksTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFP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QUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFL0QsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLHFCQUFxQixDQUFDO0FBQzVDLE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7QUFDcEMsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQzs7QUFFdkMsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLG9CQUFvQixDQUFDO0FBQ2hELE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFOUQsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUNyQyxPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFMUQsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7QUFDL0QsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFbEQsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUM3QixPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUMzQixPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEtBQUssR0FBRyxFQUFFLEVBQUUsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQzVELE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQzNCLE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDOztBQUV4QixPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLG9CQUFvQixDQUFDO0FBQzdFLE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFOUQsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUM3QixPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFM0IsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNqRCxPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDckMsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDbkQsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDOztBQUUvRCxPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN4QixPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFM0IsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7QUFDL0QsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRTFELE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDN0IsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRTNCLE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDakQsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3JDLE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ25ELE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZDQUE0QyxLQUFLOztBQUVqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0Esb0NBQW1DLE9BQU87QUFDMUM7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLDBEQUF5RDtBQUN6RDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWCxVQUFTO0FBQ1Q7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsU0FBUztBQUNwQjtBQUNBLFlBQVcsU0FBUztBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUN6a0JBLE9BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixjQUFhLENBQUM7QUFDZCxRQUFPLENBQUM7QUFDUixVQUFTLEVBQUU7QUFDWCxVQUFTLEVBQUU7QUFDWCxTQUFRLEVBQUU7QUFDVixRQUFPLEVBQUU7QUFDVCxVQUFTLEVBQUU7QUFDWCxZQUFXLEVBQUU7QUFDYixjQUFhLEVBQUU7QUFDZixRQUFPLEVBQUU7QUFDVCxTQUFRLEVBQUU7QUFDVixTQUFRLEVBQUU7QUFDVixPQUFNLEVBQUU7QUFDUixVQUFTLEVBQUU7QUFDWCxTQUFRLEVBQUU7QUFDVixXQUFVLEVBQUU7QUFDWixXQUFRLEVBQUUsRUFBRTtBQUNaLE1BQUcsRUFBRSxFQUFFO0FBQ1AsTUFBRyxFQUFFLEVBQUU7QUFDUCxNQUFHLEVBQUUsRUFBRTtBQUNQLE1BQUcsRUFBRSxFQUFFO0FBQ1AsTUFBRyxFQUFFLEVBQUU7QUFDUCxNQUFHLEVBQUUsRUFBRTtBQUNQLE1BQUcsRUFBRSxFQUFFO0FBQ1AsTUFBRyxFQUFFLEVBQUU7QUFDUCxNQUFHLEVBQUUsRUFBRTtBQUNQLE1BQUcsRUFBRSxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsTUFBSyxFQUFFO0FBQ1AsYUFBWSxFQUFFO0FBQ2QsYUFBWSxFQUFFO0FBQ2QsYUFBWSxFQUFFO0FBQ2QsYUFBWSxFQUFFO0FBQ2QsYUFBWSxHQUFHO0FBQ2YsYUFBWSxHQUFHO0FBQ2YsYUFBWSxHQUFHO0FBQ2YsYUFBWSxHQUFHO0FBQ2YsYUFBWSxHQUFHO0FBQ2YsYUFBWSxHQUFHO0FBQ2YsYUFBWSxHQUFHO0FBQ2YsUUFBTyxHQUFHO0FBQ1YsY0FBYSxHQUFHO0FBQ2hCLFlBQVcsR0FBRztBQUNkLFdBQVUsR0FBRztBQUNiLE9BQU0sR0FBRztBQUNULE9BQU0sR0FBRztBQUNULE9BQU0sR0FBRztBQUNULE9BQU0sR0FBRztBQUNULE9BQU0sR0FBRztBQUNULE9BQU0sR0FBRztBQUNULE9BQU0sR0FBRztBQUNULE9BQU0sR0FBRztBQUNULE9BQU0sR0FBRztBQUNULFFBQU8sR0FBRztBQUNWLFFBQU8sR0FBRztBQUNWLFFBQU8sR0FBRztBQUNWLFVBQVMsRUFBRTtBQUNYLFNBQVEsRUFBRTtBQUNWLFFBQU8sRUFBRTtBQUNULFNBQVEsR0FBRztBQUNYLFVBQVMsR0FBRztBQUNaLFVBQVMsR0FBRztBQUNaLFdBQVUsR0FBRztFQUNkLEM7Ozs7OztBQ3hGRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWdDLFFBQVE7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVUsTUFBTTtBQUNoQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4QkFBNkIsSUFBSTtBQUNqQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBb0MsOEJBQThCO0FBQ2xFOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVSxvQkFBb0I7QUFDOUI7QUFDQTs7QUFFQTtBQUNBLFdBQVUsVUFBVTtBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBaUIsWUFBWTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0NBQStCLHNCQUFzQjtBQUNyRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLGVBQWU7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1DQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQy9OQTs7Ozs7OztBQ0FBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNEJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLDZCQUE0QixVQUFVOzs7Ozs7O0FDekR0Qzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsSUFBRztBQUNIOztBQUVBOzs7Ozs7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFOzs7Ozs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0EsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3RCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xuIFx0dmFyIHBhcmVudEpzb25wRnVuY3Rpb24gPSB3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl07XG4gXHR3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl0gPSBmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhjaHVua0lkcywgbW9yZU1vZHVsZXMpIHtcbiBcdFx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG4gXHRcdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuIFx0XHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwLCBjYWxsYmFja3MgPSBbXTtcbiBcdFx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG4gXHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKVxuIFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2guYXBwbHkoY2FsbGJhY2tzLCBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pO1xuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG4gXHRcdH1cbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdH1cbiBcdFx0aWYocGFyZW50SnNvbnBGdW5jdGlvbikgcGFyZW50SnNvbnBGdW5jdGlvbihjaHVua0lkcywgbW9yZU1vZHVsZXMpO1xuIFx0XHR3aGlsZShjYWxsYmFja3MubGVuZ3RoKVxuIFx0XHRcdGNhbGxiYWNrcy5zaGlmdCgpLmNhbGwobnVsbCwgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4gXHRcdGlmKG1vcmVNb2R1bGVzWzBdKSB7XG4gXHRcdFx0aW5zdGFsbGVkTW9kdWxlc1swXSA9IDA7XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4gXHQvLyBcIjBcIiBtZWFucyBcImFscmVhZHkgbG9hZGVkXCJcbiBcdC8vIEFycmF5IG1lYW5zIFwibG9hZGluZ1wiLCBhcnJheSBjb250YWlucyBjYWxsYmFja3NcbiBcdHZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG4gXHRcdDEzOjBcbiBcdH07XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuIFx0Ly8gVGhpcyBmaWxlIGNvbnRhaW5zIG9ubHkgdGhlIGVudHJ5IGNodW5rLlxuIFx0Ly8gVGhlIGNodW5rIGxvYWRpbmcgZnVuY3Rpb24gZm9yIGFkZGl0aW9uYWwgY2h1bmtzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmUgPSBmdW5jdGlvbiByZXF1aXJlRW5zdXJlKGNodW5rSWQsIGNhbGxiYWNrKSB7XG4gXHRcdC8vIFwiMFwiIGlzIHRoZSBzaWduYWwgZm9yIFwiYWxyZWFkeSBsb2FkZWRcIlxuIFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApXG4gXHRcdFx0cmV0dXJuIGNhbGxiYWNrLmNhbGwobnVsbCwgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gYW4gYXJyYXkgbWVhbnMgXCJjdXJyZW50bHkgbG9hZGluZ1wiLlxuIFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gIT09IHVuZGVmaW5lZCkge1xuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXS5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHQvLyBzdGFydCBjaHVuayBsb2FkaW5nXG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gW2NhbGxiYWNrXTtcbiBcdFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gXHRcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuIFx0XHRcdHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gXHRcdFx0c2NyaXB0LmNoYXJzZXQgPSAndXRmLTgnO1xuIFx0XHRcdHNjcmlwdC5hc3luYyA9IHRydWU7XG4gXHRcdFx0c2NyaXB0LnNyYyA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBjaHVua0lkICsgXCIuY2h1bmsuanNcIjtcbiBcdFx0XHRoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2J1aWxkL1wiO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDM2MWQ3ZTk5ZmU2OTkzMjA2YWQzXG4gKiovIiwidmFyIEVuZ2luZSA9IHJlcXVpcmUoJy4vc3JjL2VuZ2luZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaW5pdDogZnVuY3Rpb24oY2FudmFzLCBtZXRob2RzKSB7XG4gICAgdmFyIGVuZ2luZSA9IG5ldyBFbmdpbmUoY2FudmFzLCBtZXRob2RzKTtcbiAgICByZXR1cm4gZW5naW5lLmFwcDtcbiAgfVxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vaW5kZXguanNcbiAqKi8iLCJyZXF1aXJlKCcuL3JhZi1wb2x5ZmlsbCcpKCk7XG5cbnZhciBBcHAgPSByZXF1aXJlKCcuL2FwcCcpO1xuXG52YXIgVGltZSA9IHJlcXVpcmUoJy4vdGltZScpO1xuXG52YXIgRGVidWdnZXIgPSByZXF1aXJlKCdwb3Rpb24tZGVidWdnZXInKTtcblxudmFyIFN0YXRlTWFuYWdlciA9IHJlcXVpcmUoJy4vc3RhdGUtbWFuYWdlcicpO1xuXG4vKipcbiAqIE1haW4gRW5naW5lIGNsYXNzIHdoaWNoIGNhbGxzIHRoZSBhcHAgbWV0aG9kc1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBFbmdpbmUgPSBmdW5jdGlvbihjb250YWluZXIsIG1ldGhvZHMpIHtcbiAgdmFyIEFwcENsYXNzID0gdGhpcy5fc3ViY2xhc3NBcHAoY29udGFpbmVyLCBtZXRob2RzKTtcblxuICBjb250YWluZXIuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuXG4gIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgY2FudmFzLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2FudmFzKTtcblxuICB0aGlzLmFwcCA9IG5ldyBBcHBDbGFzcyhjYW52YXMpO1xuICB0aGlzLmFwcC5kZWJ1ZyA9IG5ldyBEZWJ1Z2dlcih0aGlzLmFwcCk7XG5cbiAgdGhpcy5fc2V0RGVmYXVsdFN0YXRlcygpO1xuXG4gIHRoaXMudGlja0Z1bmMgPSAoZnVuY3Rpb24gKHNlbGYpIHsgcmV0dXJuIGZ1bmN0aW9uKCkgeyBzZWxmLnRpY2soKTsgfTsgfSkodGhpcyk7XG4gIHRoaXMucHJlbG9hZGVyVGlja0Z1bmMgPSAoZnVuY3Rpb24gKHNlbGYpIHsgcmV0dXJuIGZ1bmN0aW9uKCkgeyBzZWxmLl9wcmVsb2FkZXJUaWNrKCk7IH07IH0pKHRoaXMpO1xuXG4gIHRoaXMuc3RyYXlUaW1lID0gMDtcblxuICB0aGlzLl90aW1lID0gVGltZS5ub3coKTtcblxuICB0aGlzLmFwcC5hc3NldHMub25sb2FkKGZ1bmN0aW9uKCkge1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnByZWxvYWRlcklkKTtcbiAgICB0aGlzLmFwcC5fcHJlbG9hZGVyLmV4aXQoKTtcblxuICAgIHRoaXMuc3RhcnQoKTtcbiAgfS5iaW5kKHRoaXMpKTtcblxuICBpZiAodGhpcy5hcHAuYXNzZXRzLmlzTG9hZGluZyAmJiB0aGlzLmFwcC5jb25maWcuc2hvd1ByZWxvYWRlcikge1xuICAgIHRoaXMucHJlbG9hZGVySWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucHJlbG9hZGVyVGlja0Z1bmMpO1xuICB9XG59O1xuXG4vKipcbiAqIEFkZCBldmVudCBsaXN0ZW5lciBmb3Igd2luZG93IGV2ZW50c1xuICogQHByaXZhdGVcbiAqL1xuRW5naW5lLnByb3RvdHlwZS5hZGRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24oKSB7XG4gICAgc2VsZi5hcHAuaW5wdXQucmVzZXRLZXlzKCk7XG4gICAgc2VsZi5hcHAuYmx1cigpO1xuICB9KTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbigpIHtcbiAgICBzZWxmLmFwcC5pbnB1dC5yZXNldEtleXMoKTtcbiAgICBzZWxmLmFwcC5mb2N1cygpO1xuICB9KTtcbn07XG5cbi8qKlxuICogU3RhcnRzIHRoZSBhcHAsIGFkZHMgZXZlbnRzIGFuZCBydW4gZmlyc3QgZnJhbWVcbiAqIEBwcml2YXRlXG4gKi9cbkVuZ2luZS5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuYXBwLmNvbmZpZy5hZGRJbnB1dEV2ZW50cykge1xuICAgIHRoaXMuYWRkRXZlbnRzKCk7XG4gIH1cblxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGlja0Z1bmMpO1xufTtcblxuLyoqXG4gKiBNYWluIHRpY2sgZnVuY3Rpb24gaW4gYXBwIGxvb3BcbiAqIEBwcml2YXRlXG4gKi9cbkVuZ2luZS5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKCkge1xuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGlja0Z1bmMpO1xuXG4gIHRoaXMuYXBwLmRlYnVnLmJlZ2luKCk7XG5cbiAgdmFyIG5vdyA9IFRpbWUubm93KCk7XG4gIHZhciB0aW1lID0gKG5vdyAtIHRoaXMuX3RpbWUpIC8gMTAwMDtcbiAgdGhpcy5fdGltZSA9IG5vdztcblxuICB0aGlzLmFwcC5kZWJ1Zy5wZXJmKCd1cGRhdGUnKTtcbiAgdGhpcy51cGRhdGUodGltZSk7XG4gIHRoaXMuYXBwLmRlYnVnLnN0b3BQZXJmKCd1cGRhdGUnKTtcblxuICB0aGlzLmFwcC5zdGF0ZXMuZXhpdFVwZGF0ZSh0aW1lKTtcblxuICB0aGlzLmFwcC5kZWJ1Zy5wZXJmKCdyZW5kZXInKTtcbiAgdGhpcy5yZW5kZXIoKTtcbiAgdGhpcy5hcHAuZGVidWcuc3RvcFBlcmYoJ3JlbmRlcicpO1xuXG4gIHRoaXMuYXBwLmRlYnVnLnJlbmRlcigpO1xuXG4gIHRoaXMuYXBwLmRlYnVnLmVuZCgpO1xufTtcblxuLyoqXG4gKiBVcGRhdGVzIHRoZSBhcHBcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lIC0gdGltZSBpbiBzZWNvbmRzIHNpbmNlIGxhc3QgZnJhbWVcbiAqIEBwcml2YXRlXG4gKi9cbkVuZ2luZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICBpZiAodGltZSA+IHRoaXMuYXBwLmNvbmZpZy5tYXhTdGVwVGltZSkgeyB0aW1lID0gdGhpcy5hcHAuY29uZmlnLm1heFN0ZXBUaW1lOyB9XG5cbiAgaWYgKHRoaXMuYXBwLmNvbmZpZy5maXhlZFN0ZXApIHtcbiAgICB0aGlzLnN0cmF5VGltZSA9IHRoaXMuc3RyYXlUaW1lICsgdGltZTtcbiAgICB3aGlsZSAodGhpcy5zdHJheVRpbWUgPj0gdGhpcy5hcHAuY29uZmlnLnN0ZXBUaW1lKSB7XG4gICAgICB0aGlzLnN0cmF5VGltZSA9IHRoaXMuc3RyYXlUaW1lIC0gdGhpcy5hcHAuY29uZmlnLnN0ZXBUaW1lO1xuICAgICAgdGhpcy5hcHAuc3RhdGVzLnVwZGF0ZSh0aGlzLmFwcC5jb25maWcuc3RlcFRpbWUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLmFwcC5zdGF0ZXMudXBkYXRlKHRpbWUpO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbmRlcnMgdGhlIGFwcFxuICogQHByaXZhdGVcbiAqL1xuRW5naW5lLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5hcHAudmlkZW8uYmVnaW5GcmFtZSgpO1xuXG4gIHRoaXMuYXBwLnZpZGVvLmNsZWFyKCk7XG5cbiAgdGhpcy5hcHAuc3RhdGVzLnJlbmRlcigpO1xuXG4gIHRoaXMuYXBwLnZpZGVvLmVuZEZyYW1lKCk7XG59O1xuXG4vKipcbiAqIE1haW4gdGljayBmdW5jdGlvbiBpbiBwcmVsb2FkZXIgbG9vcFxuICogQHByaXZhdGVcbiAqL1xuRW5naW5lLnByb3RvdHlwZS5fcHJlbG9hZGVyVGljayA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnByZWxvYWRlcklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnByZWxvYWRlclRpY2tGdW5jKTtcblxuICB2YXIgbm93ID0gVGltZS5ub3coKTtcbiAgdmFyIHRpbWUgPSAobm93IC0gdGhpcy5fdGltZSkgLyAxMDAwO1xuICB0aGlzLl90aW1lID0gbm93O1xuXG4gIHRoaXMuYXBwLnByZWxvYWRpbmcodGltZSk7XG59O1xuXG5FbmdpbmUucHJvdG90eXBlLl9zZXREZWZhdWx0U3RhdGVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzdGF0ZXMgPSBuZXcgU3RhdGVNYW5hZ2VyKCk7XG4gIHN0YXRlcy5hZGQoJ2FwcCcsIHRoaXMuYXBwKTtcbiAgc3RhdGVzLmFkZCgnZGVidWcnLCB0aGlzLmFwcC5kZWJ1Zyk7XG5cbiAgc3RhdGVzLnByb3RlY3QoJ2FwcCcpO1xuICBzdGF0ZXMucHJvdGVjdCgnZGVidWcnKTtcbiAgc3RhdGVzLmhpZGUoJ2RlYnVnJyk7XG5cbiAgdGhpcy5hcHAuc3RhdGVzID0gc3RhdGVzO1xufTtcblxuRW5naW5lLnByb3RvdHlwZS5fc3ViY2xhc3NBcHAgPSBmdW5jdGlvbihjb250YWluZXIsIG1ldGhvZHMpIHtcbiAgdmFyIEFwcENsYXNzID0gZnVuY3Rpb24oY29udGFpbmVyKSB7XG4gICAgQXBwLmNhbGwodGhpcywgY29udGFpbmVyKTtcbiAgfTtcblxuICBBcHBDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFwcC5wcm90b3R5cGUpO1xuXG4gIGZvciAodmFyIG1ldGhvZCBpbiBtZXRob2RzKSB7XG4gICAgQXBwQ2xhc3MucHJvdG90eXBlW21ldGhvZF0gPSBtZXRob2RzW21ldGhvZF07XG4gIH1cblxuICByZXR1cm4gQXBwQ2xhc3M7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVuZ2luZTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VuZ2luZS5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBsYXN0VGltZSA9IDA7XG4gIHZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcblxuICBmb3IgKHZhciBpPTA7IGk8dmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsraSkge1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1tpXSsnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbaV0rJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgd2luZG93W3ZlbmRvcnNbaV0rJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICB9XG5cbiAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuXG4gICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTtcbiAgICAgIH0sIHRpbWVUb0NhbGwpO1xuXG4gICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbiAgICAgIHJldHVybiBpZDtcbiAgICB9O1xuICB9XG5cbiAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpIHtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihpZCkgeyBjbGVhclRpbWVvdXQoaWQpOyB9O1xuICB9XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmFmLXBvbHlmaWxsLmpzXG4gKiovIiwidmFyIFZpZGVvID0gcmVxdWlyZSgnLi92aWRlbycpO1xudmFyIEFzc2V0cyA9IHJlcXVpcmUoJy4vYXNzZXRzJyk7XG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG52YXIgTG9hZGluZyA9IHJlcXVpcmUoJy4vbG9hZGluZycpO1xuXG52YXIgQXBwID0gZnVuY3Rpb24oY2FudmFzKSB7XG4gIHRoaXMuY2FudmFzID0gY2FudmFzO1xuXG4gIHRoaXMud2lkdGggPSAzMDA7XG5cbiAgdGhpcy5oZWlnaHQgPSAzMDA7XG5cbiAgdGhpcy5hc3NldHMgPSBuZXcgQXNzZXRzKCk7XG5cbiAgdGhpcy5zdGF0ZXMgPSBudWxsO1xuICB0aGlzLmRlYnVnID0gbnVsbDtcbiAgdGhpcy5pbnB1dCA9IG51bGw7XG4gIHRoaXMudmlkZW8gPSBudWxsO1xuXG4gIHRoaXMuY29uZmlnID0ge1xuICAgIGFsbG93SGlEUEk6IHRydWUsXG4gICAgZ2V0Q2FudmFzQ29udGV4dDogdHJ1ZSxcbiAgICBpbml0aWFsaXplVmlkZW86IHRydWUsXG4gICAgYWRkSW5wdXRFdmVudHM6IHRydWUsXG4gICAgc2hvd1ByZWxvYWRlcjogdHJ1ZSxcbiAgICBmaXhlZFN0ZXA6IGZhbHNlLFxuICAgIHN0ZXBUaW1lOiAwLjAxNjY2LFxuICAgIG1heFN0ZXBUaW1lOiAwLjAxNjY2XG4gIH07XG5cbiAgdGhpcy5jb25maWd1cmUoKTtcblxuICBpZiAodGhpcy5jb25maWcuaW5pdGlhbGl6ZVZpZGVvKSB7XG4gICAgdGhpcy52aWRlbyA9IG5ldyBWaWRlbyh0aGlzLCBjYW52YXMsIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGlmICh0aGlzLmNvbmZpZy5hZGRJbnB1dEV2ZW50cykge1xuICAgIHRoaXMuaW5wdXQgPSBuZXcgSW5wdXQodGhpcywgY2FudmFzLnBhcmVudEVsZW1lbnQpO1xuICB9XG5cbiAgdGhpcy5fcHJlbG9hZGVyID0gbmV3IExvYWRpbmcodGhpcyk7XG59O1xuXG5BcHAucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgaWYgKHRoaXMudmlkZW8pIHtcbiAgICB0aGlzLnZpZGVvLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG4gIH1cbn07XG5cbkFwcC5wcm90b3R5cGUucHJlbG9hZGluZyA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgaWYgKHRoaXMuY29uZmlnLnNob3dQcmVsb2FkZXIpIHtcbiAgICB0aGlzLl9wcmVsb2FkZXIucmVuZGVyKHRpbWUpO1xuICB9XG59O1xuXG5BcHAucHJvdG90eXBlLmNvbmZpZ3VyZSA9IGZ1bmN0aW9uKCkge307XG5cbkFwcC5wcm90b3R5cGUuZm9jdXMgPSBmdW5jdGlvbigpIHt9O1xuXG5BcHAucHJvdG90eXBlLmJsdXIgPSBmdW5jdGlvbigpIHt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcDtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2FwcC5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlIHx8IERhdGU7XG59KSgpO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvdGltZS5qc1xuICoqLyIsInZhciByZW5kZXJPcmRlclNvcnQgPSBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBhLnJlbmRlck9yZGVyIDwgYi5yZW5kZXJPcmRlcjtcbn07XG5cbnZhciB1cGRhdGVPcmRlclNvcnQgPSBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBhLnVwZGF0ZU9yZGVyIDwgYi51cGRhdGVPcmRlcjtcbn07XG5cbnZhciBTdGF0ZU1hbmFnZXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zdGF0ZXMgPSB7fTtcbiAgdGhpcy5yZW5kZXJPcmRlciA9IFtdO1xuICB0aGlzLnVwZGF0ZU9yZGVyID0gW107XG5cbiAgdGhpcy5fcHJldmVudEV2ZW50ID0gZmFsc2U7XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKG5hbWUsIHN0YXRlKSB7XG4gIHRoaXMuc3RhdGVzW25hbWVdID0gdGhpcy5fbmV3U3RhdGVIb2xkZXIobmFtZSwgc3RhdGUpO1xuICB0aGlzLnJlZnJlc2hPcmRlcigpO1xuICByZXR1cm4gc3RhdGU7XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaWYgKCFob2xkZXIuZW5hYmxlZCkge1xuICAgICAgaWYgKGhvbGRlci5zdGF0ZS5lbmFibGUpIHtcbiAgICAgICAgaG9sZGVyLnN0YXRlLmVuYWJsZSgpO1xuICAgICAgfVxuICAgICAgaG9sZGVyLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgaG9sZGVyLmNoYW5nZWQgPSB0cnVlO1xuXG4gICAgICBpZiAoaG9sZGVyLnBhdXNlZCkge1xuICAgICAgICB0aGlzLnVucGF1c2UobmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmRpc2FibGUgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGlmIChob2xkZXIuZW5hYmxlZCkge1xuICAgICAgaWYgKGhvbGRlci5zdGF0ZS5kaXNhYmxlKSB7XG4gICAgICAgIGhvbGRlci5zdGF0ZS5kaXNhYmxlKCk7XG4gICAgICB9XG4gICAgICBob2xkZXIuY2hhbmdlZCA9IHRydWU7XG4gICAgICBob2xkZXIuZW5hYmxlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBpZiAoaG9sZGVyLmVuYWJsZWQpIHtcbiAgICAgIGhvbGRlci5jaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIGhvbGRlci5yZW5kZXIgPSBmYWxzZTtcbiAgICB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaWYgKGhvbGRlci5lbmFibGVkKSB7XG4gICAgICBob2xkZXIuY2hhbmdlZCA9IHRydWU7XG4gICAgICBob2xkZXIucmVuZGVyID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGlmIChob2xkZXIuc3RhdGUucGF1c2UpIHtcbiAgICAgIGhvbGRlci5zdGF0ZS5wYXVzZSgpO1xuICAgIH1cblxuICAgIGhvbGRlci5jaGFuZ2VkID0gdHJ1ZTtcbiAgICBob2xkZXIucGF1c2VkID0gdHJ1ZTtcbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS51bnBhdXNlID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBpZiAoaG9sZGVyLnN0YXRlLnVucGF1c2UpIHtcbiAgICAgIGhvbGRlci5zdGF0ZS51bnBhdXNlKCk7XG4gICAgfVxuXG4gICAgaG9sZGVyLmNoYW5nZWQgPSB0cnVlO1xuICAgIGhvbGRlci5wYXVzZWQgPSBmYWxzZTtcbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5wcm90ZWN0ID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBob2xkZXIucHJvdGVjdCA9IHRydWU7XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUudW5wcm90ZWN0ID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBob2xkZXIucHJvdGVjdCA9IGZhbHNlO1xuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnJlZnJlc2hPcmRlciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnJlbmRlck9yZGVyLmxlbmd0aCA9IDA7XG4gIHRoaXMudXBkYXRlT3JkZXIubGVuZ3RoID0gMDtcblxuICBmb3IgKHZhciBuYW1lIGluIHRoaXMuc3RhdGVzKSB7XG4gICAgdmFyIGhvbGRlciA9IHRoaXMuc3RhdGVzW25hbWVdO1xuICAgIGlmIChob2xkZXIpIHtcbiAgICAgIHRoaXMucmVuZGVyT3JkZXIucHVzaChob2xkZXIpO1xuICAgICAgdGhpcy51cGRhdGVPcmRlci5wdXNoKGhvbGRlcik7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5yZW5kZXJPcmRlci5zb3J0KHJlbmRlck9yZGVyU29ydCk7XG4gIHRoaXMudXBkYXRlT3JkZXIuc29ydCh1cGRhdGVPcmRlclNvcnQpO1xufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5fbmV3U3RhdGVIb2xkZXIgPSBmdW5jdGlvbihuYW1lLCBzdGF0ZSkge1xuICB2YXIgaG9sZGVyID0ge307XG4gIGhvbGRlci5uYW1lID0gbmFtZTtcbiAgaG9sZGVyLnN0YXRlID0gc3RhdGU7XG5cbiAgaG9sZGVyLnByb3RlY3QgPSBmYWxzZTtcblxuICBob2xkZXIuZW5hYmxlZCA9IHRydWU7XG4gIGhvbGRlci5wYXVzZWQgPSBmYWxzZTtcblxuICBob2xkZXIucmVuZGVyID0gdHJ1ZTtcblxuICBob2xkZXIuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgaG9sZGVyLnVwZGF0ZWQgPSBmYWxzZTtcbiAgaG9sZGVyLmNoYW5nZWQgPSB0cnVlO1xuXG4gIGhvbGRlci51cGRhdGVPcmRlciA9IDA7XG4gIGhvbGRlci5yZW5kZXJPcmRlciA9IDA7XG5cbiAgcmV0dXJuIGhvbGRlcjtcbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuc2V0VXBkYXRlT3JkZXIgPSBmdW5jdGlvbihuYW1lLCBvcmRlcikge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBob2xkZXIudXBkYXRlT3JkZXIgPSBvcmRlcjtcbiAgICB0aGlzLnJlZnJlc2hPcmRlcigpO1xuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnNldFJlbmRlck9yZGVyID0gZnVuY3Rpb24obmFtZSwgb3JkZXIpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaG9sZGVyLnJlbmRlck9yZGVyID0gb3JkZXI7XG4gICAgdGhpcy5yZWZyZXNoT3JkZXIoKTtcbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgc3RhdGUgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKHN0YXRlICYmICFzdGF0ZS5wcm90ZWN0KSB7XG4gICAgaWYgKHN0YXRlLnN0YXRlLmNsb3NlKSB7XG4gICAgICBzdGF0ZS5zdGF0ZS5jbG9zZSgpO1xuICAgIH1cbiAgICBkZWxldGUgdGhpcy5zdGF0ZXNbbmFtZV07XG4gICAgdGhpcy5yZWZyZXNoT3JkZXIoKTtcbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5kZXN0cm95QWxsID0gZnVuY3Rpb24oKSB7XG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcbiAgICBpZiAoIXN0YXRlLnByb3RlY3QpIHtcbiAgICAgIGlmIChzdGF0ZS5zdGF0ZS5jbG9zZSkge1xuICAgICAgICBzdGF0ZS5zdGF0ZS5jbG9zZSgpO1xuICAgICAgfVxuICAgICAgZGVsZXRlIHRoaXMuc3RhdGVzW3N0YXRlLm5hbWVdO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMucmVmcmVzaE9yZGVyKCk7XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgcmV0dXJuIHRoaXMuc3RhdGVzW25hbWVdO1xufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbih0aW1lKSB7XG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcblxuICAgIGlmIChzdGF0ZSkge1xuICAgICAgc3RhdGUuY2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoc3RhdGUuZW5hYmxlZCkge1xuICAgICAgICBpZiAoIXN0YXRlLmluaXRpYWxpemVkICYmIHN0YXRlLnN0YXRlLmluaXQpIHtcbiAgICAgICAgICBzdGF0ZS5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgICAgc3RhdGUuc3RhdGUuaW5pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YXRlLnN0YXRlLnVwZGF0ZSAmJiAhc3RhdGUucGF1c2VkKSB7XG4gICAgICAgICAgc3RhdGUuc3RhdGUudXBkYXRlKHRpbWUpO1xuICAgICAgICAgIHN0YXRlLnVwZGF0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmV4aXRVcGRhdGUgPSBmdW5jdGlvbih0aW1lKSB7XG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcblxuICAgIGlmIChzdGF0ZSAmJiBzdGF0ZS5lbmFibGVkICYmIHN0YXRlLnN0YXRlLmV4aXRVcGRhdGUgJiYgIXN0YXRlLnBhdXNlZCkge1xuICAgICAgc3RhdGUuc3RhdGUuZXhpdFVwZGF0ZSh0aW1lKTtcbiAgICB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMucmVuZGVyT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5yZW5kZXJPcmRlcltpXTtcbiAgICBpZiAoc3RhdGUgJiYgc3RhdGUuZW5hYmxlZCAmJiAoc3RhdGUudXBkYXRlZCB8fCAhc3RhdGUuc3RhdGUudXBkYXRlKSAmJiBzdGF0ZS5yZW5kZXIgJiYgc3RhdGUuc3RhdGUucmVuZGVyKSB7XG4gICAgICBzdGF0ZS5zdGF0ZS5yZW5kZXIoKTtcbiAgICB9XG4gIH1cbn07XG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLm1vdXNlbW92ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHRoaXMuX3ByZXZlbnRFdmVudCA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcbiAgICBpZiAoc3RhdGUgJiYgc3RhdGUuZW5hYmxlZCAmJiAhc3RhdGUuY2hhbmdlZCAmJiBzdGF0ZS5zdGF0ZS5tb3VzZW1vdmUgJiYgIXN0YXRlLnBhdXNlZCkge1xuICAgICAgc3RhdGUuc3RhdGUubW91c2Vtb3ZlKHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcHJldmVudEV2ZW50KSB7IGJyZWFrOyB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUubW91c2V1cCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHRoaXMuX3ByZXZlbnRFdmVudCA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcbiAgICBpZiAoc3RhdGUgJiYgc3RhdGUuZW5hYmxlZCAmJiAhc3RhdGUuY2hhbmdlZCAmJiBzdGF0ZS5zdGF0ZS5tb3VzZXVwICYmICFzdGF0ZS5wYXVzZWQpIHtcbiAgICAgIHN0YXRlLnN0YXRlLm1vdXNldXAodmFsdWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wcmV2ZW50RXZlbnQpIHsgYnJlYWs7IH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5tb3VzZWRvd24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICB0aGlzLl9wcmV2ZW50RXZlbnQgPSBmYWxzZTtcblxuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLnVwZGF0ZU9yZGVyLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMudXBkYXRlT3JkZXJbaV07XG4gICAgaWYgKHN0YXRlICYmIHN0YXRlLmVuYWJsZWQgJiYgIXN0YXRlLmNoYW5nZWQgJiYgc3RhdGUuc3RhdGUubW91c2Vkb3duICYmICFzdGF0ZS5wYXVzZWQpIHtcbiAgICAgIHN0YXRlLnN0YXRlLm1vdXNlZG93bih2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3ByZXZlbnRFdmVudCkgeyBicmVhazsgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmtleXVwID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgdGhpcy5fcHJldmVudEV2ZW50ID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy51cGRhdGVPcmRlci5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnVwZGF0ZU9yZGVyW2ldO1xuICAgIGlmIChzdGF0ZSAmJiBzdGF0ZS5lbmFibGVkICYmICFzdGF0ZS5jaGFuZ2VkICYmIHN0YXRlLnN0YXRlLmtleXVwICYmICFzdGF0ZS5wYXVzZWQpIHtcbiAgICAgIHN0YXRlLnN0YXRlLmtleXVwKHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcHJldmVudEV2ZW50KSB7IGJyZWFrOyB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUua2V5ZG93biA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHRoaXMuX3ByZXZlbnRFdmVudCA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcbiAgICBpZiAoc3RhdGUgJiYgc3RhdGUuZW5hYmxlZCAmJiAhc3RhdGUuY2hhbmdlZCAmJiBzdGF0ZS5zdGF0ZS5rZXlkb3duICYmICFzdGF0ZS5wYXVzZWQpIHtcbiAgICAgIHN0YXRlLnN0YXRlLmtleWRvd24odmFsdWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wcmV2ZW50RXZlbnQpIHsgYnJlYWs7IH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0ZU1hbmFnZXI7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9zdGF0ZS1tYW5hZ2VyLmpzXG4gKiovIiwidmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG52YXIgRGlydHlNYW5hZ2VyID0gcmVxdWlyZSgnLi9kaXJ0eS1tYW5hZ2VyJyk7XG5cbnZhciBPYmplY3RQb29sID0gW107XG5cbnZhciBHZXRPYmplY3RGcm9tUG9vbCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzdWx0ID0gT2JqZWN0UG9vbC5wb3AoKTtcblxuICBpZiAocmVzdWx0KSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHJldHVybiB7fTtcbn07XG5cbnZhciBpbmRleFRvTnVtYmVyQW5kTG93ZXJDYXNlS2V5ID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgaWYgKGluZGV4IDw9IDkpIHtcbiAgICByZXR1cm4gNDggKyBpbmRleDtcbiAgfSBlbHNlIGlmIChpbmRleCA9PT0gMTApIHtcbiAgICByZXR1cm4gNDg7XG4gIH0gZWxzZSBpZiAoaW5kZXggPiAxMCAmJiBpbmRleCA8PSAzNikge1xuICAgIHJldHVybiA2NCArIChpbmRleC0xMCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07XG5cbnZhciBkZWZhdWx0cyA9IFtcbiAgeyBuYW1lOiAnU2hvdyBGUFMnLCBlbnRyeTogJ3Nob3dGcHMnLCBkZWZhdWx0czogdHJ1ZSB9LFxuICB7IG5hbWU6ICdTaG93IEtleSBDb2RlcycsIGVudHJ5OiAnc2hvd0tleUNvZGVzJywgZGVmYXVsdHM6IHRydWUgfVxuXTtcblxudmFyIERlYnVnZ2VyID0gZnVuY3Rpb24oYXBwKSB7XG4gIHRoaXMudmlkZW8gPSBhcHAudmlkZW8uY3JlYXRlTGF5ZXIoe1xuICAgIGFsbG93SGlEUEk6IHRydWUsXG4gICAgZ2V0Q2FudmFzQ29udGV4dDogdHJ1ZVxuICB9KTtcblxuICB0aGlzLmdyYXBoID0gYXBwLnZpZGVvLmNyZWF0ZUxheWVyKHtcbiAgICBhbGxvd0hpRFBJOiBmYWxzZSxcbiAgICBnZXRDYW52YXNDb250ZXh0OiB0cnVlXG4gIH0pO1xuXG4gIHRoaXMuX2dyYXBoSGVpZ2h0ID0gMTAwO1xuICB0aGlzLl82MGZwc01hcmsgPSB0aGlzLl9ncmFwaEhlaWdodCAqIDAuODtcbiAgdGhpcy5fbXNUb1B4ID0gdGhpcy5fNjBmcHNNYXJrLzE2LjY2O1xuXG4gIHRoaXMuYXBwID0gYXBwO1xuXG4gIHRoaXMub3B0aW9ucyA9IGRlZmF1bHRzO1xuICB0aGlzLl9tYXhMb2dzQ291bnRzID0gMTA7XG5cbiAgZm9yICh2YXIgaT0wOyBpPHRoaXMub3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBvcHRpb24gPSB0aGlzLm9wdGlvbnNbaV07XG4gICAgdGhpcy5faW5pdE9wdGlvbihvcHRpb24pO1xuICB9XG5cbiAgdGhpcy5kaXNhYmxlZCA9IGZhbHNlO1xuXG4gIHRoaXMuZnBzID0gMDtcbiAgdGhpcy5mcHNDb3VudCA9IDA7XG4gIHRoaXMuZnBzRWxhcHNlZFRpbWUgPSAwO1xuICB0aGlzLmZwc1VwZGF0ZUludGVydmFsID0gMC41O1xuICB0aGlzLl9mcmFtZVBlcmYgPSBbXTtcblxuICB0aGlzLl9mb250U2l6ZSA9IDA7XG4gIHRoaXMuX2RpcnR5TWFuYWdlciA9IG5ldyBEaXJ0eU1hbmFnZXIodGhpcy52aWRlby5jYW52YXMsIHRoaXMudmlkZW8uY3R4KTtcblxuICB0aGlzLmxvZ3MgPSBbXTtcblxuICB0aGlzLl9wZXJmVmFsdWVzID0ge307XG4gIHRoaXMuX3BlcmZOYW1lcyA9IFtdO1xuXG4gIHRoaXMuc2hvd0RlYnVnID0gZmFsc2U7XG4gIHRoaXMuZW5hYmxlRGVidWdLZXlzID0gdHJ1ZTtcbiAgdGhpcy5lbmFibGVTaG9ydGN1dHMgPSBmYWxzZTtcblxuICB0aGlzLmVuYWJsZVNob3J0Y3V0c0tleSA9IDIyMDtcblxuICB0aGlzLmxhc3RLZXkgPSBudWxsO1xuXG4gIHRoaXMuX2xvYWQoKTtcblxuICB0aGlzLmtleVNob3J0Y3V0cyA9IFtcbiAgICB7IGtleTogMTIzLCBlbnRyeTogJ3Nob3dEZWJ1ZycsIHR5cGU6ICd0b2dnbGUnIH1cbiAgXTtcblxuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5hZGRDb25maWcoeyBuYW1lOiAnU2hvdyBQZXJmb3JtYW5jZSBHcmFwaCcsIGVudHJ5OiAnc2hvd0dyYXBoJywgZGVmYXVsdHM6IGZhbHNlLCBjYWxsOiBmdW5jdGlvbigpIHsgc2VsZi5ncmFwaC5jbGVhcigpOyB9IH0pO1xuXG4gIHRoaXMuX2RpZmYgPSAwO1xuICB0aGlzLl9mcmFtZVN0YXJ0ID0gMDtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5iZWdpbiA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5zaG93RGVidWcpIHtcbiAgICB0aGlzLl9mcmFtZVN0YXJ0ID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xuICB9XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLnNob3dEZWJ1Zykge1xuICAgIHRoaXMuX2RpZmYgPSB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgLSB0aGlzLl9mcmFtZVN0YXJ0O1xuICB9XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuX3NldEZvbnQgPSBmdW5jdGlvbihweCwgZm9udCkge1xuICB0aGlzLl9mb250U2l6ZSA9IHB4O1xuICB0aGlzLnZpZGVvLmN0eC5mb250ID0gcHggKyAncHggJyArIGZvbnQ7XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMudmlkZW8uc2V0U2l6ZSh0aGlzLmFwcC53aWR0aCwgdGhpcy5hcHAuaGVpZ2h0KTtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5hZGRDb25maWcgPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgdGhpcy5vcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgdGhpcy5faW5pdE9wdGlvbihvcHRpb24pO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLl9pbml0T3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gIG9wdGlvbi50eXBlID0gb3B0aW9uLnR5cGUgfHwgJ3RvZ2dsZSc7XG4gIG9wdGlvbi5kZWZhdWx0cyA9IG9wdGlvbi5kZWZhdWx0cyA9PSBudWxsID8gZmFsc2UgOiBvcHRpb24uZGVmYXVsdHM7XG5cbiAgaWYgKG9wdGlvbi50eXBlID09PSAndG9nZ2xlJykge1xuICAgIHRoaXNbb3B0aW9uLmVudHJ5XSA9IG9wdGlvbi5kZWZhdWx0cztcbiAgfVxufTtcblxuRGVidWdnZXIucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMubG9ncy5sZW5ndGggPSAwO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLmxvZyA9IGZ1bmN0aW9uKG1lc3NhZ2UsIGNvbG9yKSB7XG4gIGNvbG9yID0gY29sb3IgfHwgJ3doaXRlJztcbiAgbWVzc2FnZSA9IHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJyA/IG1lc3NhZ2UgOiB1dGlsLmluc3BlY3QobWVzc2FnZSk7XG5cbiAgdmFyIG1lc3NhZ2VzID0gbWVzc2FnZS5yZXBsYWNlKC9cXFxcJy9nLCBcIidcIikuc3BsaXQoJ1xcbicpO1xuXG4gIGZvciAodmFyIGk9MDsgaTxtZXNzYWdlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBtc2cgPSBtZXNzYWdlc1tpXTtcbiAgICBpZiAodGhpcy5sb2dzLmxlbmd0aCA+PSB0aGlzLl9tYXhMb2dzQ291bnRzKSB7XG4gICAgICBPYmplY3RQb29sLnB1c2godGhpcy5sb2dzLnNoaWZ0KCkpO1xuICAgIH1cblxuICAgIHZhciBtZXNzYWdlT2JqZWN0ID0gR2V0T2JqZWN0RnJvbVBvb2woKTtcbiAgICBtZXNzYWdlT2JqZWN0LnRleHQgPSBtc2c7XG4gICAgbWVzc2FnZU9iamVjdC5saWZlID0gMTA7XG4gICAgbWVzc2FnZU9iamVjdC5jb2xvciA9IGNvbG9yO1xuXG4gICAgdGhpcy5sb2dzLnB1c2gobWVzc2FnZU9iamVjdCk7XG4gIH1cbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHt9O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuZXhpdFVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgaWYgKHRoaXMuZGlzYWJsZWQpIHsgcmV0dXJuOyB9XG5cbiAgaWYgKHRoaXMuc2hvd0RlYnVnKSB7XG4gICAgdGhpcy5fbWF4TG9nc0NvdW50cyA9IE1hdGguY2VpbCgodGhpcy5hcHAuaGVpZ2h0ICsgMjApLzIwKTtcbiAgICB0aGlzLmZwc0NvdW50ICs9IDE7XG4gICAgdGhpcy5mcHNFbGFwc2VkVGltZSArPSB0aW1lO1xuXG4gICAgaWYgKHRoaXMuZnBzRWxhcHNlZFRpbWUgPiB0aGlzLmZwc1VwZGF0ZUludGVydmFsKSB7XG4gICAgICB2YXIgZnBzID0gdGhpcy5mcHNDb3VudC90aGlzLmZwc0VsYXBzZWRUaW1lO1xuXG4gICAgICBpZiAodGhpcy5zaG93RnBzKSB7XG4gICAgICAgIHRoaXMuZnBzID0gdGhpcy5mcHMgKiAoMS0wLjgpICsgMC44ICogZnBzO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmZwc0NvdW50ID0gMDtcbiAgICAgIHRoaXMuZnBzRWxhcHNlZFRpbWUgPSAwO1xuICAgIH1cblxuICAgIGZvciAodmFyIGk9MCwgbGVuPXRoaXMubG9ncy5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICAgIHZhciBsb2cgPSB0aGlzLmxvZ3NbaV07XG4gICAgICBpZiAobG9nKSB7XG4gICAgICAgIGxvZy5saWZlIC09IHRpbWU7XG4gICAgICAgIGlmIChsb2cubGlmZSA8PSAwKSB7XG4gICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5sb2dzLmluZGV4T2YobG9nKTtcbiAgICAgICAgICBpZiAoaW5kZXggPiAtMSkgeyB0aGlzLmxvZ3Muc3BsaWNlKGluZGV4LCAxKTsgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUua2V5ZG93biA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICh0aGlzLmRpc2FibGVkKSB7IHJldHVybjsgfVxuXG4gIHRoaXMubGFzdEtleSA9IHZhbHVlLmtleTtcblxuICB2YXIgaTtcblxuICBpZiAodGhpcy5lbmFibGVEZWJ1Z0tleXMpIHtcbiAgICBpZiAodmFsdWUua2V5ID09PSB0aGlzLmVuYWJsZVNob3J0Y3V0c0tleSkge1xuICAgICAgdmFsdWUuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5lbmFibGVTaG9ydGN1dHMgPSAhdGhpcy5lbmFibGVTaG9ydGN1dHM7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5lbmFibGVTaG9ydGN1dHMpIHtcbiAgICAgIGZvciAoaT0wOyBpPHRoaXMub3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgb3B0aW9uID0gdGhpcy5vcHRpb25zW2ldO1xuICAgICAgICB2YXIga2V5SW5kZXggPSBpICsgMTtcblxuICAgICAgICBpZiAodGhpcy5hcHAuaW5wdXQuaXNLZXlEb3duKCdjdHJsJykpIHtcbiAgICAgICAgICBrZXlJbmRleCAtPSAzNjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGFySWQgPSBpbmRleFRvTnVtYmVyQW5kTG93ZXJDYXNlS2V5KGtleUluZGV4KTtcblxuICAgICAgICBpZiAoY2hhcklkICYmIHZhbHVlLmtleSA9PT0gY2hhcklkKSB7XG4gICAgICAgICAgdmFsdWUuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgIGlmIChvcHRpb24udHlwZSA9PT0gJ3RvZ2dsZScpIHtcblxuICAgICAgICAgICAgdGhpc1tvcHRpb24uZW50cnldID0gIXRoaXNbb3B0aW9uLmVudHJ5XTtcbiAgICAgICAgICAgIGlmIChvcHRpb24uY2FsbCkge1xuICAgICAgICAgICAgICBvcHRpb24uY2FsbCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9zYXZlKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChvcHRpb24udHlwZSA9PT0gJ2NhbGwnKSB7XG4gICAgICAgICAgICBvcHRpb24uZW50cnkoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAoaT0wOyBpPHRoaXMua2V5U2hvcnRjdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtleVNob3J0Y3V0ID0gdGhpcy5rZXlTaG9ydGN1dHNbaV07XG4gICAgaWYgKGtleVNob3J0Y3V0LmtleSA9PT0gdmFsdWUua2V5KSB7XG4gICAgICB2YWx1ZS5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBpZiAoa2V5U2hvcnRjdXQudHlwZSA9PT0gJ3RvZ2dsZScpIHtcbiAgICAgICAgdGhpc1trZXlTaG9ydGN1dC5lbnRyeV0gPSAhdGhpc1trZXlTaG9ydGN1dC5lbnRyeV07XG4gICAgICAgIHRoaXMuX3NhdmUoKTtcbiAgICAgIH0gZWxzZSBpZiAoa2V5U2hvcnRjdXQudHlwZSA9PT0gJ2NhbGwnKSB7XG4gICAgICAgIHRoaXNba2V5U2hvcnRjdXQuZW50cnldKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5fc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGF0YSA9IHtcbiAgICBzaG93RGVidWc6IHRoaXMuc2hvd0RlYnVnLFxuICAgIG9wdGlvbnM6IHt9XG4gIH07XG5cbiAgZm9yICh2YXIgaT0wOyBpPHRoaXMub3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBvcHRpb24gPSB0aGlzLm9wdGlvbnNbaV07XG4gICAgdmFyIHZhbHVlID0gdGhpc1tvcHRpb24uZW50cnldO1xuICAgIGRhdGEub3B0aW9uc1tvcHRpb24uZW50cnldID0gdmFsdWU7XG4gIH1cblxuICB3aW5kb3cubG9jYWxTdG9yYWdlLl9fcG90aW9uRGVidWcgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5fbG9hZCA9IGZ1bmN0aW9uKCkge1xuICBpZiAod2luZG93LmxvY2FsU3RvcmFnZSAmJiB3aW5kb3cubG9jYWxTdG9yYWdlLl9fcG90aW9uRGVidWcpIHtcbiAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2Uod2luZG93LmxvY2FsU3RvcmFnZS5fX3BvdGlvbkRlYnVnKTtcbiAgICB0aGlzLnNob3dEZWJ1ZyA9IGRhdGEuc2hvd0RlYnVnO1xuXG4gICAgZm9yICh2YXIgbmFtZSBpbiBkYXRhLm9wdGlvbnMpIHtcbiAgICAgIHRoaXNbbmFtZV0gPSBkYXRhLm9wdGlvbnNbbmFtZV07XG4gICAgfVxuICB9XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmRpc2FibGVkKSB7IHJldHVybjsgfVxuXG4gIHRoaXMuX2RpcnR5TWFuYWdlci5jbGVhcigpO1xuXG4gIGlmICh0aGlzLnNob3dEZWJ1Zykge1xuICAgIHRoaXMudmlkZW8uY3R4LnNhdmUoKTtcbiAgICB0aGlzLl9zZXRGb250KDE1LCAnc2Fucy1zZXJpZicpO1xuXG4gICAgdGhpcy5fcmVuZGVyTG9ncygpO1xuICAgIHRoaXMuX3JlbmRlckRhdGEoKTtcbiAgICB0aGlzLl9yZW5kZXJTaG9ydGN1dHMoKTtcblxuICAgIHRoaXMudmlkZW8uY3R4LnJlc3RvcmUoKTtcblxuICAgIGlmICh0aGlzLnNob3dHcmFwaCkge1xuICAgICAgdGhpcy5ncmFwaC5jdHguZHJhd0ltYWdlKHRoaXMuZ3JhcGguY2FudmFzLCAwLCB0aGlzLmFwcC5oZWlnaHQgLSB0aGlzLl9ncmFwaEhlaWdodCwgdGhpcy5hcHAud2lkdGgsIHRoaXMuX2dyYXBoSGVpZ2h0LCAtMiwgdGhpcy5hcHAuaGVpZ2h0IC0gdGhpcy5fZ3JhcGhIZWlnaHQsIHRoaXMuYXBwLndpZHRoLCB0aGlzLl9ncmFwaEhlaWdodCk7XG5cbiAgICAgIHRoaXMuZ3JhcGguY3R4LmZpbGxTdHlsZSA9ICcjRjJGMEQ4JztcbiAgICAgIHRoaXMuZ3JhcGguY3R4LmZpbGxSZWN0KHRoaXMuYXBwLndpZHRoIC0gMiwgdGhpcy5hcHAuaGVpZ2h0IC0gdGhpcy5fZ3JhcGhIZWlnaHQsIDIsIHRoaXMuX2dyYXBoSGVpZ2h0KTtcblxuICAgICAgdGhpcy5ncmFwaC5jdHguZmlsbFN0eWxlID0gJ3JnYmEoMCwgMCwgMCwgMC41KSc7XG4gICAgICB0aGlzLmdyYXBoLmN0eC5maWxsUmVjdCh0aGlzLmFwcC53aWR0aCAtIDIsIHRoaXMuYXBwLmhlaWdodCAtIHRoaXMuXzYwZnBzTWFyaywgMiwgMSk7XG5cbiAgICAgIHZhciBsYXN0ID0gMDtcbiAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLl9mcmFtZVBlcmYubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLl9mcmFtZVBlcmZbaV07XG4gICAgICAgIHZhciBuYW1lID0gdGhpcy5fcGVyZk5hbWVzW2ldO1xuXG4gICAgICAgIHRoaXMuX2RyYXdGcmFtZUxpbmUoaXRlbSwgbmFtZSwgbGFzdCk7XG5cbiAgICAgICAgbGFzdCArPSBpdGVtO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9kcmF3RnJhbWVMaW5lKHRoaXMuX2RpZmYgLSBsYXN0LCAnbGFnJywgbGFzdCk7XG4gICAgICB0aGlzLl9mcmFtZVBlcmYubGVuZ3RoID0gMDtcbiAgICB9XG4gIH1cbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5fZHJhd0ZyYW1lTGluZSA9IGZ1bmN0aW9uKHZhbHVlLCBuYW1lLCBsYXN0KSB7XG4gIHZhciBiYWNrZ3JvdW5kID0gJ2JsYWNrJztcbiAgaWYgKG5hbWUgPT09ICd1cGRhdGUnKSB7XG4gICAgYmFja2dyb3VuZCA9ICcjNkJBNUYyJztcbiAgfSBlbHNlIGlmIChuYW1lID09PSAncmVuZGVyJykge1xuICAgIGJhY2tncm91bmQgPSAnI0YyNzgzMCc7XG4gIH0gZWxzZSBpZiAobmFtZSA9PT0gJ2xhZycpIHtcbiAgICBiYWNrZ3JvdW5kID0gJyM5MWY2ODInO1xuICB9XG4gIHRoaXMuZ3JhcGguY3R4LmZpbGxTdHlsZSA9IGJhY2tncm91bmQ7XG5cbiAgdmFyIGhlaWdodCA9ICh2YWx1ZSArIGxhc3QpICogdGhpcy5fbXNUb1B4XG5cbiAgdmFyIHggPSB0aGlzLmFwcC53aWR0aCAtIDI7XG4gIHZhciB5ID0gdGhpcy5hcHAuaGVpZ2h0IC0gaGVpZ2h0O1xuXG4gIHRoaXMuZ3JhcGguY3R4LmZpbGxSZWN0KHgsIHksIDIsIGhlaWdodCAtIChsYXN0ICogdGhpcy5fbXNUb1B4KSk7XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuX3JlbmRlckxvZ3MgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy52aWRlby5jdHgudGV4dEFsaWduID0gJ2xlZnQnO1xuICB0aGlzLnZpZGVvLmN0eC50ZXh0QmFzZWxpbmUgPSAnYm90dG9tJztcblxuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLmxvZ3MubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIGxvZyA9IHRoaXMubG9nc1tpXTtcblxuICAgIHZhciB5ID0gLTEwICsgdGhpcy5hcHAuaGVpZ2h0ICsgKGkgLSB0aGlzLmxvZ3MubGVuZ3RoICsgMSkgKiAyMDtcbiAgICB0aGlzLl9yZW5kZXJUZXh0KGxvZy50ZXh0LCAxMCwgeSwgbG9nLmNvbG9yKTtcbiAgfVxufTtcblxuRGVidWdnZXIucHJvdG90eXBlLmRpc2FibGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5kaXNhYmxlZCA9IHRydWU7XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUucGVyZiA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgaWYgKCF0aGlzLnNob3dEZWJ1ZykgeyByZXR1cm47IH1cblxuICB2YXIgZXhpc3RzID0gdGhpcy5fcGVyZlZhbHVlc1tuYW1lXTtcblxuICBpZiAoZXhpc3RzID09IG51bGwpIHtcbiAgICB0aGlzLl9wZXJmTmFtZXMucHVzaChuYW1lKTtcblxuICAgIHRoaXMuX3BlcmZWYWx1ZXNbbmFtZV0gPSB7XG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgdmFsdWU6IDAsXG4gICAgICByZWNvcmRzOiBbXVxuICAgIH07XG4gIH1cblxuICB2YXIgdGltZSA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcblxuICB2YXIgcmVjb3JkID0gdGhpcy5fcGVyZlZhbHVlc1tuYW1lXTtcblxuICByZWNvcmQudmFsdWUgPSB0aW1lO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLnN0b3BQZXJmID0gZnVuY3Rpb24obmFtZSkge1xuICBpZiAoIXRoaXMuc2hvd0RlYnVnKSB7IHJldHVybjsgfVxuXG4gIHZhciByZWNvcmQgPSB0aGlzLl9wZXJmVmFsdWVzW25hbWVdO1xuXG4gIHZhciB0aW1lID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xuICB2YXIgZGlmZiA9IHRpbWUgLSByZWNvcmQudmFsdWU7XG5cbiAgcmVjb3JkLnJlY29yZHMucHVzaChkaWZmKTtcbiAgaWYgKHJlY29yZC5yZWNvcmRzLmxlbmd0aCA+IDEwKSB7XG4gICAgcmVjb3JkLnJlY29yZHMuc2hpZnQoKTtcbiAgfVxuXG4gIHZhciBzdW0gPSAwO1xuICBmb3IgKHZhciBpPTA7IGk8cmVjb3JkLnJlY29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICBzdW0gKz0gcmVjb3JkLnJlY29yZHNbaV07XG4gIH1cblxuICB2YXIgYXZnID0gc3VtL3JlY29yZC5yZWNvcmRzLmxlbmd0aDtcblxuICByZWNvcmQudmFsdWUgPSBhdmc7XG4gIHRoaXMuX2ZyYW1lUGVyZi5wdXNoKGRpZmYpO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLl9yZW5kZXJEYXRhID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMudmlkZW8uY3R4LnRleHRBbGlnbiA9ICdyaWdodCc7XG4gIHRoaXMudmlkZW8uY3R4LnRleHRCYXNlbGluZSA9ICd0b3AnO1xuXG4gIHZhciB4ID0gdGhpcy5hcHAud2lkdGggLSAxNDtcbiAgdmFyIHkgPSAxNDtcblxuICBpZiAodGhpcy5zaG93RnBzKSB7XG4gICAgdGhpcy5fcmVuZGVyVGV4dChNYXRoLnJvdW5kKHRoaXMuZnBzKSArICcgZnBzJywgeCwgeSk7XG4gIH1cblxuICB5ICs9IDI0O1xuXG4gIHRoaXMuX3NldEZvbnQoMTUsICdzYW5zLXNlcmlmJyk7XG5cbiAgaWYgKHRoaXMuc2hvd0tleUNvZGVzKSB7XG4gICAgdmFyIGJ1dHRvbk5hbWUgPSAnJztcbiAgICBpZiAodGhpcy5hcHAuaW5wdXQubW91c2UuaXNMZWZ0RG93bikge1xuICAgICAgYnV0dG9uTmFtZSA9ICdsZWZ0JztcbiAgICB9IGVsc2UgaWYgKHRoaXMuYXBwLmlucHV0Lm1vdXNlLmlzUmlnaHREb3duKSB7XG4gICAgICBidXR0b25OYW1lID0gJ3JpZ2h0JztcbiAgICB9IGVsc2UgaWYgKHRoaXMuYXBwLmlucHV0Lm1vdXNlLmlzTWlkZGxlRG93bikge1xuICAgICAgYnV0dG9uTmFtZSA9ICdtaWRkbGUnO1xuICAgIH1cblxuICAgIHRoaXMuX3JlbmRlclRleHQoJ2tleSAnICsgdGhpcy5sYXN0S2V5LCB4LCB5LCB0aGlzLmFwcC5pbnB1dC5pc0tleURvd24odGhpcy5sYXN0S2V5KSA/ICcjZTlkYzdjJyA6ICd3aGl0ZScpO1xuICAgIHRoaXMuX3JlbmRlclRleHQoJ2J0biAnICsgYnV0dG9uTmFtZSwgeCAtIDYwLCB5LCB0aGlzLmFwcC5pbnB1dC5tb3VzZS5pc0Rvd24gPyAnI2U5ZGM3YycgOiAnd2hpdGUnKTtcblxuICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLl9wZXJmTmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBuYW1lID0gdGhpcy5fcGVyZk5hbWVzW2ldO1xuICAgICAgdmFyIHZhbHVlID0gdGhpcy5fcGVyZlZhbHVlc1tuYW1lXTtcblxuICAgICAgeSArPSAyNDtcbiAgICAgIHRoaXMuX3JlbmRlclRleHQobmFtZSArICc6ICcgKyAgdmFsdWUudmFsdWUudG9GaXhlZCgzKSArICdtcycsIHgsIHkpO1xuICAgIH1cbiAgfVxufTtcblxuXG5EZWJ1Z2dlci5wcm90b3R5cGUuX3JlbmRlclNob3J0Y3V0cyA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5lbmFibGVTaG9ydGN1dHMpIHtcbiAgICB2YXIgaGVpZ2h0ID0gMjg7XG5cbiAgICB0aGlzLl9zZXRGb250KDIwLCAnSGVsdmV0aWNhIE5ldWUsIHNhbnMtc2VyaWYnKTtcbiAgICB0aGlzLnZpZGVvLmN0eC50ZXh0QWxpZ24gPSAnbGVmdCc7XG4gICAgdGhpcy52aWRlby5jdHgudGV4dEJhc2VsaW5lID0gJ3RvcCc7XG4gICAgdmFyIG1heFBlckNvbGx1bW4gPSBNYXRoLmZsb29yKCh0aGlzLmFwcC5oZWlnaHQgLSAxNCkvaGVpZ2h0KTtcblxuICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLm9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBvcHRpb24gPSB0aGlzLm9wdGlvbnNbaV07XG4gICAgICB2YXIgeCA9IDE0ICsgTWF0aC5mbG9vcihpL21heFBlckNvbGx1bW4pICogMzIwO1xuICAgICAgdmFyIHkgPSAxNCArIGklbWF4UGVyQ29sbHVtbiAqIGhlaWdodDtcblxuICAgICAgdmFyIGtleUluZGV4ID0gaSArIDE7XG4gICAgICB2YXIgY2hhcklkID0gaW5kZXhUb051bWJlckFuZExvd2VyQ2FzZUtleShrZXlJbmRleCk7XG5cbiAgICAgIHZhciBpc09uID0gdGhpc1tvcHRpb24uZW50cnldO1xuXG4gICAgICB2YXIgc2hvcnRjdXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNoYXJJZCk7XG5cbiAgICAgIGlmICghY2hhcklkKSB7XG4gICAgICAgIHNob3J0Y3V0ID0gJ14rJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaW5kZXhUb051bWJlckFuZExvd2VyQ2FzZUtleShrZXlJbmRleCAtIDM2KSk7XG4gICAgICB9XG5cbiAgICAgIHZhciB0ZXh0ID0gJ1snICsgc2hvcnRjdXQgKyAnXSAnICsgb3B0aW9uLm5hbWU7XG4gICAgICBpZiAob3B0aW9uLnR5cGUgPT09ICd0b2dnbGUnKSB7XG4gICAgICAgIHRleHQgKz0gJyAoJyArIChpc09uID8gJ09OJyA6ICdPRkYnKSArICcpJztcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9uLnR5cGUgPT09ICdjYWxsJykge1xuICAgICAgICB0ZXh0ICs9ICcgKENBTEwpJztcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbG9yID0gJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMSknO1xuICAgICAgdmFyIG91dGxpbmUgPSAncmdiYSgwLCAwLCAwLCAxKSc7XG5cbiAgICAgIGlmICghaXNPbikge1xuICAgICAgICBjb2xvciA9ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIC43KSc7XG4gICAgICAgIG91dGxpbmUgPSAncmdiYSgwLCAwLCAwLCAuNyknO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9yZW5kZXJUZXh0KHRleHQsIHgsIHksIGNvbG9yLCBvdXRsaW5lKTtcbiAgICB9XG4gIH1cbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5fcmVuZGVyVGV4dCA9IGZ1bmN0aW9uKHRleHQsIHgsIHksIGNvbG9yLCBvdXRsaW5lKSB7XG4gIGNvbG9yID0gY29sb3IgfHwgJ3doaXRlJztcbiAgb3V0bGluZSA9IG91dGxpbmUgfHwgJ2JsYWNrJztcbiAgdGhpcy52aWRlby5jdHguZmlsbFN0eWxlID0gY29sb3I7XG4gIHRoaXMudmlkZW8uY3R4LmxpbmVKb2luID0gJ3JvdW5kJztcbiAgdGhpcy52aWRlby5jdHguc3Ryb2tlU3R5bGUgPSBvdXRsaW5lO1xuICB0aGlzLnZpZGVvLmN0eC5saW5lV2lkdGggPSAzO1xuICB0aGlzLnZpZGVvLmN0eC5zdHJva2VUZXh0KHRleHQsIHgsIHkpO1xuICB0aGlzLnZpZGVvLmN0eC5maWxsVGV4dCh0ZXh0LCB4LCB5KTtcblxuICB2YXIgd2lkdGggPSB0aGlzLnZpZGVvLmN0eC5tZWFzdXJlVGV4dCh0ZXh0KS53aWR0aDtcblxuICB2YXIgZHggPSB4IC0gNTtcbiAgdmFyIGR5ID0geTtcbiAgdmFyIGR3aWR0aCA9IHdpZHRoICsgMTA7XG4gIHZhciBkaGVpZ2h0ID0gdGhpcy5fZm9udFNpemUgKyAxMDtcblxuICBpZiAodGhpcy52aWRlby5jdHgudGV4dEFsaWduID09PSAncmlnaHQnKSB7XG4gICAgZHggPSB4IC0gNSAtIHdpZHRoO1xuICB9XG5cbiAgdGhpcy5fZGlydHlNYW5hZ2VyLmFkZFJlY3QoZHgsIGR5LCBkd2lkdGgsIGRoZWlnaHQpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZWJ1Z2dlcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3BvdGlvbi1kZWJ1Z2dlci9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTNcbiAqKi8iLCJ2YXIgaXNSZXRpbmEgPSByZXF1aXJlKCcuL3JldGluYScpKCk7XG5cbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBjYW52YXMgLSBDYW52YXMgRE9NIGVsZW1lbnRcbiAqL1xudmFyIFZpZGVvID0gZnVuY3Rpb24oYXBwLCBjYW52YXMsIGNvbmZpZykge1xuICB0aGlzLmFwcCA9IGFwcDtcblxuICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcblxuICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcblxuICB0aGlzLndpZHRoID0gYXBwLndpZHRoO1xuXG4gIHRoaXMuaGVpZ2h0ID0gYXBwLmhlaWdodDtcblxuICBpZiAoY29uZmlnLmdldENhbnZhc0NvbnRleHQpIHtcbiAgICB0aGlzLmN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICB9XG5cbiAgdGhpcy5fYXBwbHlTaXplVG9DYW52YXMoKTtcbn07XG5cbi8qKlxuICogSW5jbHVkZXMgbWl4aW5zIGludG8gVmlkZW8gbGlicmFyeVxuICogQHBhcmFtIHtvYmplY3R9IG1ldGhvZHMgLSBvYmplY3Qgb2YgbWV0aG9kcyB0aGF0IHdpbGwgaW5jbHVkZWQgaW4gVmlkZW9cbiAqL1xuVmlkZW8ucHJvdG90eXBlLmluY2x1ZGUgPSBmdW5jdGlvbihtZXRob2RzKSB7XG4gIGZvciAodmFyIG1ldGhvZCBpbiBtZXRob2RzKSB7XG4gICAgdGhpc1ttZXRob2RdID0gbWV0aG9kc1ttZXRob2RdO1xuICB9XG59O1xuXG5WaWRlby5wcm90b3R5cGUuYmVnaW5GcmFtZSA9IGZ1bmN0aW9uKCkge307XG5cblZpZGVvLnByb3RvdHlwZS5lbmRGcmFtZSA9IGZ1bmN0aW9uKCkge307XG5cblZpZGVvLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuY2FudmFzLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5jYW52YXMpO1xufTtcblxuVmlkZW8ucHJvdG90eXBlLnNjYWxlQ2FudmFzID0gZnVuY3Rpb24oc2NhbGUpIHtcbiAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aCArICdweCc7XG4gIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodCArICdweCc7XG5cbiAgdGhpcy5jYW52YXMud2lkdGggKj0gc2NhbGU7XG4gIHRoaXMuY2FudmFzLmhlaWdodCAqPSBzY2FsZTtcblxuICBpZiAodGhpcy5jdHgpIHtcbiAgICB0aGlzLmN0eC5zY2FsZShzY2FsZSwgc2NhbGUpO1xuICB9XG59O1xuXG5WaWRlby5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcbiAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICB0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuICB0aGlzLl9hcHBseVNpemVUb0NhbnZhcygpO1xufTtcblxuVmlkZW8ucHJvdG90eXBlLl9hcHBseVNpemVUb0NhbnZhcyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuXG4gIHZhciBjb250YWluZXIgPSB0aGlzLmNhbnZhcy5wYXJlbnRFbGVtZW50O1xuICBjb250YWluZXIuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgJ3B4JztcbiAgY29udGFpbmVyLnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgJ3B4JztcblxuICBpZiAodGhpcy5jb25maWcuYWxsb3dIaURQSSAmJiBpc1JldGluYSkge1xuICAgIHRoaXMuc2NhbGVDYW52YXMoMik7XG4gIH1cbn07XG5cblZpZGVvLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5jdHgpIHsgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTsgfVxufTtcblxuVmlkZW8ucHJvdG90eXBlLmNyZWF0ZUxheWVyID0gZnVuY3Rpb24oY29uZmlnKSB7XG4gIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuICB2YXIgY29udGFpbmVyID0gdGhpcy5jYW52YXMucGFyZW50RWxlbWVudDtcbiAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICBjYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICBjYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gIGNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gIGNhbnZhcy5zdHlsZS50b3AgPSAnMHB4JztcbiAgY2FudmFzLnN0eWxlLmxlZnQgPSAnMHB4JztcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNhbnZhcyk7XG5cbiAgdmFyIHZpZGVvID0gbmV3IFZpZGVvKHRoaXMuYXBwLCBjYW52YXMsIGNvbmZpZyk7XG5cbiAgcmV0dXJuIHZpZGVvO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWRlbztcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3ZpZGVvLmpzXG4gKiovIiwidmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxudmFyIFBvdGlvbkF1ZGlvID0gcmVxdWlyZSgncG90aW9uLWF1ZGlvJyk7XG5cbnZhciBKc29uTG9hZGVyID0gcmVxdWlyZSgnLi9sb2FkZXIvanNvbi1sb2FkZXInKTtcbnZhciBpbWFnZUxvYWRlciA9IHJlcXVpcmUoJy4vbG9hZGVyL2ltYWdlLWxvYWRlcicpO1xudmFyIHRleHRMb2FkZXIgPSByZXF1aXJlKCcuL2xvYWRlci90ZXh0LWxvYWRlcicpO1xuXG4vKipcbiAqIENsYXNzIGZvciBtYW5hZ2luZyBhbmQgbG9hZGluZyBhc3NldCBmaWxlc1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBBc3NldHMgPSBmdW5jdGlvbigpIHtcbiAgLyoqXG4gICAqIElzIGN1cnJlbnRseSBsb2FkaW5nIGFueSBhc3NldHNcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuXG4gIHRoaXMuaXRlbXNDb3VudCA9IDA7XG4gIHRoaXMubG9hZGVkSXRlbXNDb3VudCA9IDA7XG4gIHRoaXMucHJvZ3Jlc3MgPSAwO1xuXG4gIHRoaXMuX3RoaW5nc1RvTG9hZCA9IDA7XG4gIHRoaXMuX2RhdGEgPSB7fTtcbiAgdGhpcy5fcHJlbG9hZGluZyA9IHRydWU7XG5cbiAgdGhpcy5fY2FsbGJhY2sgPSBudWxsO1xuXG4gIHRoaXMuX3RvTG9hZCA9IFtdO1xuXG4gIHRoaXMuX2xvYWRlcnMgPSB7fTtcblxuICB0aGlzLmF1ZGlvID0gbmV3IFBvdGlvbkF1ZGlvKCk7XG5cbiAgdGhpcy5hZGRMb2FkZXIoJ2pzb24nLCBKc29uTG9hZGVyKTtcblxuICB0aGlzLmFkZExvYWRlcignbXAzJywgdGhpcy5hdWRpby5sb2FkLmJpbmQodGhpcy5hdWRpbykpO1xuICB0aGlzLmFkZExvYWRlcignbXVzaWMnLCB0aGlzLmF1ZGlvLmxvYWQuYmluZCh0aGlzLmF1ZGlvKSk7XG4gIHRoaXMuYWRkTG9hZGVyKCdzb3VuZCcsIHRoaXMuYXVkaW8ubG9hZC5iaW5kKHRoaXMuYXVkaW8pKTtcblxuICB0aGlzLmFkZExvYWRlcignaW1hZ2UnLCBpbWFnZUxvYWRlcik7XG4gIHRoaXMuYWRkTG9hZGVyKCd0ZXh0dXJlJywgaW1hZ2VMb2FkZXIpO1xuICB0aGlzLmFkZExvYWRlcignc3ByaXRlJywgaW1hZ2VMb2FkZXIpO1xufTtcblxuQXNzZXRzLnByb3RvdHlwZS5hZGRMb2FkZXIgPSBmdW5jdGlvbihuYW1lLCBmbikge1xuICB0aGlzLl9sb2FkZXJzW25hbWVdID0gZm47XG59O1xuXG4vKipcbiAqIFN0YXJ0cyBsb2FkaW5nIHN0b3JlZCBhc3NldHMgdXJscyBhbmQgcnVucyBnaXZlbiBjYWxsYmFjayBhZnRlciBldmVyeXRoaW5nIGlzIGxvYWRlZFxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBjYWxsYmFjayBmdW5jdGlvblxuICovXG5Bc3NldHMucHJvdG90eXBlLm9ubG9hZCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG5cbiAgaWYgKHRoaXMuX3RoaW5nc1RvTG9hZCA9PT0gMCkge1xuICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5fcHJlbG9hZGluZyA9IGZhbHNlO1xuICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLl90b0xvYWQuZm9yRWFjaChmdW5jdGlvbihjdXJyZW50KSB7XG4gICAgICBzZWxmLl9sb2FkQXNzZXRGaWxlKGN1cnJlbnQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgc2VsZi5fc2F2ZShjdXJyZW50LnVybCwgZGF0YSwgY3VycmVudC5jYWxsYmFjayk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufTtcblxuLyoqXG4gKiBHZXR0ZXIgZm9yIGxvYWRlZCBhc3NldHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdXJsIG9mIHN0b3JlZCBhc3NldFxuICovXG5Bc3NldHMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgcmV0dXJuIHRoaXMuX2RhdGFbcGF0aC5ub3JtYWxpemUobmFtZSldO1xufTtcblxuQXNzZXRzLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHRoaXMuc2V0KG5hbWUsIG51bGwpO1xufTtcblxuXG4vKipcbiAqIFVzZWQgZm9yIHN0b3Jpbmcgc29tZSB2YWx1ZSBpbiBhc3NldHMgbW9kdWxlXG4gKiB1c2VmdWwgZm9yIG92ZXJyYXRpbmcgdmFsdWVzXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHVybCBvZiB0aGUgYXNzZXRcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZSAtIHZhbHVlIHRvIGJlIHN0b3JlZFxuICovXG5Bc3NldHMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHRoaXMuX2RhdGFbcGF0aC5ub3JtYWxpemUobmFtZSldID0gdmFsdWU7XG59O1xuXG4vKipcbiAqIFN0b3JlcyB1cmwgc28gaXQgY2FuIGJlIGxvYWRlZCBsYXRlclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSB0eXBlIG9mIGFzc2V0XG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gdXJsIG9mIGdpdmVuIGFzc2V0XG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gKi9cbkFzc2V0cy5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uKHR5cGUsIHVybCwgY2FsbGJhY2spIHtcbiAgdmFyIGxvYWRPYmplY3QgPSB7IHR5cGU6IHR5cGUsIHVybDogdXJsICE9IG51bGwgPyBwYXRoLm5vcm1hbGl6ZSh1cmwpIDogbnVsbCwgY2FsbGJhY2s6IGNhbGxiYWNrIH07XG5cbiAgaWYgKHRoaXMuX3ByZWxvYWRpbmcpIHtcbiAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XG4gICAgdGhpcy5pdGVtc0NvdW50ICs9IDE7XG4gICAgdGhpcy5fdGhpbmdzVG9Mb2FkICs9IDE7XG5cbiAgICB0aGlzLl90b0xvYWQucHVzaChsb2FkT2JqZWN0KTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5fbG9hZEFzc2V0RmlsZShsb2FkT2JqZWN0LCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBzZWxmLnNldChsb2FkT2JqZWN0LnVybCwgZGF0YSk7XG4gICAgICBpZiAoY2FsbGJhY2spIHsgY2FsbGJhY2soZGF0YSk7IH1cbiAgICB9KTtcbiAgfVxufTtcblxuQXNzZXRzLnByb3RvdHlwZS5fZmluaXNoZWRPbmVGaWxlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucHJvZ3Jlc3MgPSB0aGlzLmxvYWRlZEl0ZW1zQ291bnQgLyB0aGlzLml0ZW1zQ291bnQ7XG4gIHRoaXMuX3RoaW5nc1RvTG9hZCAtPSAxO1xuICB0aGlzLmxvYWRlZEl0ZW1zQ291bnQgKz0gMTtcblxuICBpZiAodGhpcy5fdGhpbmdzVG9Mb2FkID09PSAwKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBzZWxmLl9jYWxsYmFjaygpO1xuICAgICAgc2VsZi5fcHJlbG9hZGluZyA9IGZhbHNlO1xuICAgICAgc2VsZi5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICB9LCAwKTtcbiAgfVxufTtcblxuQXNzZXRzLnByb3RvdHlwZS5fZXJyb3IgPSBmdW5jdGlvbih1cmwpIHtcbiAgY29uc29sZS53YXJuKCdFcnJvciBsb2FkaW5nIFwiJyArIHVybCArICdcIiBhc3NldCcpO1xufTtcblxuQXNzZXRzLnByb3RvdHlwZS5fc2F2ZSA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgdGhpcy5zZXQodXJsLCBkYXRhKTtcbiAgaWYgKGNhbGxiYWNrKSB7IGNhbGxiYWNrKGRhdGEpOyB9XG4gIHRoaXMuX2ZpbmlzaGVkT25lRmlsZSgpO1xufTtcblxuQXNzZXRzLnByb3RvdHlwZS5faGFuZGxlQ3VzdG9tTG9hZGluZyA9IGZ1bmN0aW9uKGxvYWRpbmcpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgZG9uZSA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgc2VsZi5fc2F2ZShuYW1lLCB2YWx1ZSk7XG4gIH07XG4gIGxvYWRpbmcoZG9uZSk7XG59O1xuXG5Bc3NldHMucHJvdG90eXBlLl9sb2FkQXNzZXRGaWxlID0gZnVuY3Rpb24oZmlsZSwgY2FsbGJhY2spIHtcbiAgdmFyIHR5cGUgPSBmaWxlLnR5cGU7XG4gIHZhciB1cmwgPSBmaWxlLnVybDtcblxuICBpZiAodXRpbC5pc0Z1bmN0aW9uKHR5cGUpKSB7XG4gICAgdGhpcy5faGFuZGxlQ3VzdG9tTG9hZGluZyh0eXBlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0eXBlID0gdHlwZS50b0xvd2VyQ2FzZSgpO1xuXG4gIHZhciBsb2FkZXIgPSB0aGlzLl9sb2FkZXJzW3R5cGVdIHx8IHRleHRMb2FkZXI7XG4gIGxvYWRlcih1cmwsIGNhbGxiYWNrLCB0aGlzLl9lcnJvci5iaW5kKHRoaXMpKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXNzZXRzO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvYXNzZXRzLmpzXG4gKiovIiwidmFyIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxudmFyIGludktleXMgPSB7fTtcbmZvciAodmFyIGtleU5hbWUgaW4ga2V5cykge1xuICBpbnZLZXlzW2tleXNba2V5TmFtZV1dID0ga2V5TmFtZTtcbn1cblxudmFyIElucHV0ID0gZnVuY3Rpb24oYXBwLCBjb250YWluZXIpIHtcbiAgdGhpcy5fY29udGFpbmVyID0gY29udGFpbmVyO1xuICB0aGlzLl9rZXlzID0ge307XG5cbiAgdGhpcy5jYW5Db250cm9sS2V5cyA9IHRydWU7XG5cbiAgdGhpcy5tb3VzZSA9IHtcbiAgICBpc0Rvd246IGZhbHNlLFxuICAgIGlzTGVmdERvd246IGZhbHNlLFxuICAgIGlzTWlkZGxlRG93bjogZmFsc2UsXG4gICAgaXNSaWdodERvd246IGZhbHNlLFxuICAgIHg6IG51bGwsXG4gICAgeTogbnVsbFxuICB9O1xuXG4gIHRoaXMuX2FkZEV2ZW50cyhhcHApO1xufTtcblxuSW5wdXQucHJvdG90eXBlLnJlc2V0S2V5cyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9rZXlzID0ge307XG59O1xuXG5JbnB1dC5wcm90b3R5cGUuaXNLZXlEb3duID0gZnVuY3Rpb24oa2V5KSB7XG4gIGlmIChrZXkgPT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBpZiAodGhpcy5jYW5Db250cm9sS2V5cykge1xuICAgIHZhciBjb2RlID0gdHlwZW9mIGtleSA9PT0gJ251bWJlcicgPyBrZXkgOiBrZXlzW2tleS50b0xvd2VyQ2FzZSgpXTtcbiAgICByZXR1cm4gdGhpcy5fa2V5c1tjb2RlXTtcbiAgfVxufTtcblxuSW5wdXQucHJvdG90eXBlLl9hZGRFdmVudHMgPSBmdW5jdGlvbihhcHApIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciBtb3VzZUV2ZW50ID0ge1xuICAgIHg6IG51bGwsXG4gICAgeTogbnVsbCxcbiAgICBidXR0b246IG51bGwsXG4gICAgZXZlbnQ6IG51bGwsXG4gICAgc3RhdGVTdG9wRXZlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgYXBwLnN0YXRlcy5fcHJldmVudEV2ZW50ID0gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGtleWJvYXJkRXZlbnQgPSB7XG4gICAga2V5OiBudWxsLFxuICAgIG5hbWU6IG51bGwsXG4gICAgZXZlbnQ6IG51bGwsXG4gICAgc3RhdGVTdG9wRXZlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgYXBwLnN0YXRlcy5fcHJldmVudEV2ZW50ID0gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgc2VsZi5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgeCA9IGUub2Zmc2V0WCA9PT0gdW5kZWZpbmVkID8gZS5sYXllclggLSBzZWxmLl9jb250YWluZXIub2Zmc2V0TGVmdCA6IGUub2Zmc2V0WDtcbiAgICB2YXIgeSA9IGUub2Zmc2V0WSA9PT0gdW5kZWZpbmVkID8gZS5sYXllclkgLSBzZWxmLl9jb250YWluZXIub2Zmc2V0VG9wIDogZS5vZmZzZXRZO1xuXG4gICAgc2VsZi5tb3VzZS54ID0geDtcbiAgICBzZWxmLm1vdXNlLnkgPSB5O1xuICAgIHNlbGYubW91c2UuaXNBY3RpdmUgPSB0cnVlO1xuXG4gICAgbW91c2VFdmVudC54ID0geDtcbiAgICBtb3VzZUV2ZW50LnkgPSB5O1xuICAgIG1vdXNlRXZlbnQuYnV0dG9uID0gbnVsbDtcbiAgICBtb3VzZUV2ZW50LmV2ZW50ID0gZTtcblxuICAgIGFwcC5zdGF0ZXMubW91c2Vtb3ZlKG1vdXNlRXZlbnQpO1xuICB9KTtcblxuICBzZWxmLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgeCA9IGUub2Zmc2V0WCA9PT0gdW5kZWZpbmVkID8gZS5sYXllclggLSBzZWxmLl9jb250YWluZXIub2Zmc2V0TGVmdCA6IGUub2Zmc2V0WDtcbiAgICB2YXIgeSA9IGUub2Zmc2V0WSA9PT0gdW5kZWZpbmVkID8gZS5sYXllclkgLSBzZWxmLl9jb250YWluZXIub2Zmc2V0VG9wIDogZS5vZmZzZXRZO1xuXG4gICAgc3dpdGNoIChlLmJ1dHRvbikge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBzZWxmLm1vdXNlLmlzTGVmdERvd24gPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICBzZWxmLm1vdXNlLmlzTWlkZGxlRG93biA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgc2VsZi5tb3VzZS5pc1JpZ2h0RG93biA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBzZWxmLm1vdXNlLmlzRG93biA9IHNlbGYubW91c2UuaXNMZWZ0RG93biB8fCBzZWxmLm1vdXNlLmlzUmlnaHREb3duIHx8IHNlbGYubW91c2UuaXNNaWRkbGVEb3duO1xuXG4gICAgbW91c2VFdmVudC54ID0geDtcbiAgICBtb3VzZUV2ZW50LnkgPSB5O1xuICAgIG1vdXNlRXZlbnQuYnV0dG9uID0gZS5idXR0b247XG4gICAgbW91c2VFdmVudC5ldmVudCA9IGU7XG5cbiAgICBhcHAuc3RhdGVzLm1vdXNldXAobW91c2VFdmVudCk7XG4gIH0sIGZhbHNlKTtcblxuICBzZWxmLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKCkge1xuICAgIHNlbGYubW91c2UuaXNBY3RpdmUgPSBmYWxzZTtcblxuICAgIHNlbGYubW91c2UuaXNEb3duID0gZmFsc2U7XG4gICAgc2VsZi5tb3VzZS5pc0xlZnREb3duID0gZmFsc2U7XG4gICAgc2VsZi5tb3VzZS5pc1JpZ2h0RG93biA9IGZhbHNlO1xuICAgIHNlbGYubW91c2UuaXNNaWRkbGVEb3duID0gZmFsc2U7XG4gIH0pO1xuXG4gIHNlbGYuX2NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oKSB7XG4gICAgc2VsZi5tb3VzZS5pc0FjdGl2ZSA9IHRydWU7XG4gIH0pO1xuXG4gIHNlbGYuX2NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdmFyIHggPSBlLm9mZnNldFggPT09IHVuZGVmaW5lZCA/IGUubGF5ZXJYIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldExlZnQgOiBlLm9mZnNldFg7XG4gICAgdmFyIHkgPSBlLm9mZnNldFkgPT09IHVuZGVmaW5lZCA/IGUubGF5ZXJZIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldFRvcCA6IGUub2Zmc2V0WTtcblxuICAgIHNlbGYubW91c2UueCA9IHg7XG4gICAgc2VsZi5tb3VzZS55ID0geTtcbiAgICBzZWxmLm1vdXNlLmlzRG93biA9IHRydWU7XG4gICAgc2VsZi5tb3VzZS5pc0FjdGl2ZSA9IHRydWU7XG5cbiAgICBzd2l0Y2ggKGUuYnV0dG9uKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHNlbGYubW91c2UuaXNMZWZ0RG93biA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgc2VsZi5tb3VzZS5pc01pZGRsZURvd24gPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgc2VsZi5tb3VzZS5pc1JpZ2h0RG93biA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIG1vdXNlRXZlbnQueCA9IHg7XG4gICAgbW91c2VFdmVudC55ID0geTtcbiAgICBtb3VzZUV2ZW50LmJ1dHRvbiA9IGUuYnV0dG9uO1xuICAgIG1vdXNlRXZlbnQuZXZlbnQgPSBlO1xuXG4gICAgYXBwLnN0YXRlcy5tb3VzZWRvd24obW91c2VFdmVudCk7XG4gIH0sIGZhbHNlKTtcblxuICBzZWxmLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBmb3IgKHZhciBpPTA7IGk8ZS50b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdG91Y2ggPSBlLnRvdWNoZXNbaV07XG5cbiAgICAgIHZhciB4ID0gdG91Y2gucGFnZVggLSBzZWxmLl9jb250YWluZXIub2Zmc2V0TGVmdDtcbiAgICAgIHZhciB5ID0gdG91Y2gucGFnZVkgLSBzZWxmLl9jb250YWluZXIub2Zmc2V0VG9wO1xuXG4gICAgICBzZWxmLm1vdXNlLnggPSB4O1xuICAgICAgc2VsZi5tb3VzZS55ID0geTtcbiAgICAgIHNlbGYubW91c2UuaXNEb3duID0gdHJ1ZTtcbiAgICAgIHNlbGYubW91c2UuaXNMZWZ0RG93biA9IHRydWU7XG4gICAgICBzZWxmLm1vdXNlLmlzQWN0aXZlID0gdHJ1ZTtcblxuICAgICAgbW91c2VFdmVudC54ID0geDtcbiAgICAgIG1vdXNlRXZlbnQueSA9IHk7XG4gICAgICBtb3VzZUV2ZW50LmJ1dHRvbiA9IDE7XG4gICAgICBtb3VzZUV2ZW50LmV2ZW50ID0gZTtcblxuICAgICAgYXBwLnN0YXRlcy5tb3VzZWRvd24obW91c2VFdmVudCk7XG4gICAgfVxuICB9KTtcblxuICBzZWxmLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGZvciAodmFyIGk9MDsgaTxlLnRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB0b3VjaCA9IGUudG91Y2hlc1tpXTtcblxuICAgICAgdmFyIHggPSB0b3VjaC5wYWdlWCAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRMZWZ0O1xuICAgICAgdmFyIHkgPSB0b3VjaC5wYWdlWSAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRUb3A7XG5cbiAgICAgIHNlbGYubW91c2UueCA9IHg7XG4gICAgICBzZWxmLm1vdXNlLnkgPSB5O1xuICAgICAgc2VsZi5tb3VzZS5pc0Rvd24gPSB0cnVlO1xuICAgICAgc2VsZi5tb3VzZS5pc0xlZnREb3duID0gdHJ1ZTtcbiAgICAgIHNlbGYubW91c2UuaXNBY3RpdmUgPSB0cnVlO1xuXG4gICAgICBtb3VzZUV2ZW50LnggPSB4O1xuICAgICAgbW91c2VFdmVudC55ID0geTtcbiAgICAgIG1vdXNlRXZlbnQuZXZlbnQgPSBlO1xuXG4gICAgICBhcHAuc3RhdGVzLm1vdXNlbW92ZShtb3VzZUV2ZW50KTtcbiAgICB9XG4gIH0pO1xuXG4gIHNlbGYuX2NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgdG91Y2ggPSBlLmNoYW5nZWRUb3VjaGVzWzBdO1xuXG4gICAgdmFyIHggPSB0b3VjaC5wYWdlWCAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRMZWZ0O1xuICAgIHZhciB5ID0gdG91Y2gucGFnZVkgLSBzZWxmLl9jb250YWluZXIub2Zmc2V0VG9wO1xuXG4gICAgc2VsZi5tb3VzZS54ID0geDtcbiAgICBzZWxmLm1vdXNlLnkgPSB5O1xuICAgIHNlbGYubW91c2UuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICBzZWxmLm1vdXNlLmlzRG93biA9IGZhbHNlO1xuICAgIHNlbGYubW91c2UuaXNMZWZ0RG93biA9IGZhbHNlO1xuICAgIHNlbGYubW91c2UuaXNSaWdodERvd24gPSBmYWxzZTtcbiAgICBzZWxmLm1vdXNlLmlzTWlkZGxlRG93biA9IGZhbHNlO1xuXG4gICAgbW91c2VFdmVudC54ID0geDtcbiAgICBtb3VzZUV2ZW50LnkgPSB5O1xuICAgIG1vdXNlRXZlbnQuZXZlbnQgPSBlO1xuXG4gICAgYXBwLnN0YXRlcy5tb3VzZXVwKG1vdXNlRXZlbnQpO1xuICB9KTtcblxuICBzZWxmLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9KTtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xuICAgIHNlbGYuX2tleXNbZS5rZXlDb2RlXSA9IHRydWU7XG5cbiAgICBrZXlib2FyZEV2ZW50LmtleSA9IGUud2hpY2g7XG4gICAga2V5Ym9hcmRFdmVudC5uYW1lID0gaW52S2V5c1tlLndoaWNoXTtcbiAgICBrZXlib2FyZEV2ZW50LmV2ZW50ID0gZTtcblxuICAgIGFwcC5zdGF0ZXMua2V5ZG93bihrZXlib2FyZEV2ZW50KTtcbiAgfSk7XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbihlKSB7XG4gICAgc2VsZi5fa2V5c1tlLmtleUNvZGVdID0gZmFsc2U7XG5cbiAgICBrZXlib2FyZEV2ZW50LmtleSA9IGUud2hpY2g7XG4gICAga2V5Ym9hcmRFdmVudC5uYW1lID0gaW52S2V5c1tlLndoaWNoXTtcbiAgICBrZXlib2FyZEV2ZW50LmV2ZW50ID0gZTtcblxuICAgIGFwcC5zdGF0ZXMua2V5dXAoa2V5Ym9hcmRFdmVudCk7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dDtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2lucHV0LmpzXG4gKiovIiwidmFyIExvYWRpbmcgPSBmdW5jdGlvbihhcHApIHtcbiAgdGhpcy5hcHAgPSBhcHA7XG5cbiAgdGhpcy5iYXJXaWR0aCA9IDA7XG5cbiAgdGhpcy52aWRlbyA9IGFwcC52aWRlby5jcmVhdGVMYXllcih7XG4gICAgYWxsb3dIaURQSTogdHJ1ZSxcbiAgICBnZXRDYW52YXNDb250ZXh0OiB0cnVlXG4gIH0pO1xufTtcblxuTG9hZGluZy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24odGltZSkge1xuICB0aGlzLnZpZGVvLmNsZWFyKCk7XG5cbiAgdmFyIGNvbG9yMSA9ICcjYjlmZjcxJztcbiAgdmFyIGNvbG9yMiA9ICcjOGFjMjUwJztcbiAgdmFyIGNvbG9yMyA9ICcjNjQ4ZTM4JztcblxuICB2YXIgd2lkdGggPSBNYXRoLm1pbih0aGlzLmFwcC53aWR0aCAqIDIvMywgMzAwKTtcbiAgdmFyIGhlaWdodCA9IDIwO1xuXG4gIHZhciB5ID0gKHRoaXMuYXBwLmhlaWdodCAtIGhlaWdodCkgLyAyO1xuICB2YXIgeCA9ICh0aGlzLmFwcC53aWR0aCAtIHdpZHRoKSAvIDI7XG5cbiAgdmFyIGN1cnJlbnRXaWR0aCA9IHdpZHRoICogdGhpcy5hcHAuYXNzZXRzLnByb2dyZXNzO1xuICB0aGlzLmJhcldpZHRoID0gdGhpcy5iYXJXaWR0aCArIChjdXJyZW50V2lkdGggLSB0aGlzLmJhcldpZHRoKSAqIHRpbWUgKiAxMDtcblxuICB0aGlzLnZpZGVvLmN0eC5maWxsU3R5bGUgPSBjb2xvcjI7XG4gIHRoaXMudmlkZW8uY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuYXBwLndpZHRoLCB0aGlzLmFwcC5oZWlnaHQpO1xuXG4gIHRoaXMudmlkZW8uY3R4LmZvbnQgPSAnNDAwIDQwcHggc2Fucy1zZXJpZic7XG4gIHRoaXMudmlkZW8uY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICB0aGlzLnZpZGVvLmN0eC50ZXh0QmFzZWxpbmUgPSAnYm90dG9tJztcblxuICB0aGlzLnZpZGVvLmN0eC5maWxsU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjEpJztcbiAgdGhpcy52aWRlby5jdHguZmlsbFRleHQoXCJQb3Rpb24uanNcIiwgdGhpcy5hcHAud2lkdGgvMiwgeSArIDIpO1xuXG4gIHRoaXMudmlkZW8uY3R4LmZpbGxTdHlsZSA9ICcjZDFmZmExJztcbiAgdGhpcy52aWRlby5jdHguZmlsbFRleHQoXCJQb3Rpb24uanNcIiwgdGhpcy5hcHAud2lkdGgvMiwgeSk7XG5cbiAgdGhpcy52aWRlby5jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLnZpZGVvLmN0eC5maWxsU3R5bGUgPSBjb2xvcjM7XG4gIHRoaXMudmlkZW8uY3R4LmZpbGxSZWN0KHgsIHkgKyAxNSwgd2lkdGgsIGhlaWdodCk7XG5cbiAgdGhpcy52aWRlby5jdHgubGluZVdpZHRoID0gMjtcbiAgdGhpcy52aWRlby5jdHguYmVnaW5QYXRoKCk7XG4gIHRoaXMudmlkZW8uY3R4LnJlY3QoeCAtIDUsIHkgKyAxMCwgd2lkdGggKyAxMCwgaGVpZ2h0ICsgMTApO1xuICB0aGlzLnZpZGVvLmN0eC5jbG9zZVBhdGgoKTtcbiAgdGhpcy52aWRlby5jdHguc3Ryb2tlKCk7XG5cbiAgdGhpcy52aWRlby5jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLnZpZGVvLmN0eC5maWxsU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjEpJztcbiAgdGhpcy52aWRlby5jdHguZmlsbFJlY3QoeCwgeSArIDE1LCB0aGlzLmJhcldpZHRoLCBoZWlnaHQgKyAyKTtcblxuICB0aGlzLnZpZGVvLmN0eC5saW5lV2lkdGggPSAyO1xuICB0aGlzLnZpZGVvLmN0eC5iZWdpblBhdGgoKTtcblxuICB0aGlzLnZpZGVvLmN0eC5tb3ZlVG8oeCArIHRoaXMuYmFyV2lkdGgsIHkgKyAxMik7XG4gIHRoaXMudmlkZW8uY3R4LmxpbmVUbyh4IC0gNSwgeSArIDEyKTtcbiAgdGhpcy52aWRlby5jdHgubGluZVRvKHggLSA1LCB5ICsgMTAgKyBoZWlnaHQgKyAxMik7XG4gIHRoaXMudmlkZW8uY3R4LmxpbmVUbyh4ICsgdGhpcy5iYXJXaWR0aCwgeSArIDEwICsgaGVpZ2h0ICsgMTIpO1xuXG4gIHRoaXMudmlkZW8uY3R4LnN0cm9rZSgpO1xuICB0aGlzLnZpZGVvLmN0eC5jbG9zZVBhdGgoKTtcblxuICB0aGlzLnZpZGVvLmN0eC5zdHJva2VTdHlsZSA9IHRoaXMudmlkZW8uY3R4LmZpbGxTdHlsZSA9IGNvbG9yMTtcbiAgdGhpcy52aWRlby5jdHguZmlsbFJlY3QoeCwgeSArIDE1LCB0aGlzLmJhcldpZHRoLCBoZWlnaHQpO1xuXG4gIHRoaXMudmlkZW8uY3R4LmxpbmVXaWR0aCA9IDI7XG4gIHRoaXMudmlkZW8uY3R4LmJlZ2luUGF0aCgpO1xuXG4gIHRoaXMudmlkZW8uY3R4Lm1vdmVUbyh4ICsgdGhpcy5iYXJXaWR0aCwgeSArIDEwKTtcbiAgdGhpcy52aWRlby5jdHgubGluZVRvKHggLSA1LCB5ICsgMTApO1xuICB0aGlzLnZpZGVvLmN0eC5saW5lVG8oeCAtIDUsIHkgKyAxMCArIGhlaWdodCArIDEwKTtcbiAgdGhpcy52aWRlby5jdHgubGluZVRvKHggKyB0aGlzLmJhcldpZHRoLCB5ICsgMTAgKyBoZWlnaHQgKyAxMCk7XG5cbiAgdGhpcy52aWRlby5jdHguc3Ryb2tlKCk7XG4gIHRoaXMudmlkZW8uY3R4LmNsb3NlUGF0aCgpO1xufTtcblxuTG9hZGluZy5wcm90b3R5cGUuZXhpdCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnZpZGVvLmRlc3Ryb3koKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGluZztcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xvYWRpbmcuanNcbiAqKi8iLCJ2YXIgRGlydHlNYW5hZ2VyID0gZnVuY3Rpb24oY2FudmFzLCBjdHgpIHtcbiAgdGhpcy5jdHggPSBjdHg7XG4gIHRoaXMuY2FudmFzID0gY2FudmFzO1xuXG4gIHRoaXMudG9wID0gY2FudmFzLmhlaWdodDtcbiAgdGhpcy5sZWZ0ID0gY2FudmFzLndpZHRoO1xuICB0aGlzLmJvdHRvbSA9IDA7XG4gIHRoaXMucmlnaHQgPSAwO1xuXG4gIHRoaXMuaXNEaXJ0eSA9IGZhbHNlO1xufTtcblxuRGlydHlNYW5hZ2VyLnByb3RvdHlwZS5hZGRSZWN0ID0gZnVuY3Rpb24obGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0KSB7XG4gIHZhciByaWdodCAgPSBsZWZ0ICsgd2lkdGg7XG4gIHZhciBib3R0b20gPSB0b3AgKyBoZWlnaHQ7XG5cbiAgdGhpcy50b3AgICAgPSB0b3AgPCB0aGlzLnRvcCAgICAgICA/IHRvcCAgICA6IHRoaXMudG9wO1xuICB0aGlzLmxlZnQgICA9IGxlZnQgPCB0aGlzLmxlZnQgICAgID8gbGVmdCAgIDogdGhpcy5sZWZ0O1xuICB0aGlzLmJvdHRvbSA9IGJvdHRvbSA+IHRoaXMuYm90dG9tID8gYm90dG9tIDogdGhpcy5ib3R0b207XG4gIHRoaXMucmlnaHQgID0gcmlnaHQgPiB0aGlzLnJpZ2h0ICAgPyByaWdodCAgOiB0aGlzLnJpZ2h0O1xuXG4gIHRoaXMuaXNEaXJ0eSA9IHRydWU7XG59O1xuXG5EaXJ0eU1hbmFnZXIucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5pc0RpcnR5KSB7IHJldHVybjsgfVxuXG4gIHRoaXMuY3R4LmNsZWFyUmVjdCh0aGlzLmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICB0aGlzLnRvcCxcbiAgICAgICAgICAgICAgICAgICAgIHRoaXMucmlnaHQgLSB0aGlzLmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICB0aGlzLmJvdHRvbSAtIHRoaXMudG9wKTtcblxuICB0aGlzLmxlZnQgPSB0aGlzLmNhbnZhcy53aWR0aDtcbiAgdGhpcy50b3AgPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XG4gIHRoaXMucmlnaHQgPSAwO1xuICB0aGlzLmJvdHRvbSA9IDA7XG5cbiAgdGhpcy5pc0RpcnR5ID0gZmFsc2U7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpcnR5TWFuYWdlcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3BvdGlvbi1kZWJ1Z2dlci9kaXJ0eS1tYW5hZ2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVybCwgY2FsbGJhY2ssIGVycm9yKSB7XG4gIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgcmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9ICd0ZXh0JztcbiAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAocmVxdWVzdC5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgcmV0dXJuIGVycm9yKHVybCk7XG4gICAgfVxuXG4gICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpO1xuICAgIGNhbGxiYWNrKGRhdGEpO1xuICB9O1xuICByZXF1ZXN0LnNlbmQoKTtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9sb2FkZXIvanNvbi1sb2FkZXIuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVybCwgY2FsbGJhY2ssIGVycm9yKSB7XG4gIHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBjYWxsYmFjayhpbWFnZSk7XG4gIH07XG4gIGltYWdlLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICBlcnJvcih1cmwpO1xuICB9O1xuICBpbWFnZS5zcmMgPSB1cmw7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbG9hZGVyL2ltYWdlLWxvYWRlci5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXJsLCBjYWxsYmFjaywgZXJyb3IpIHtcbiAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ3RleHQnO1xuICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICByZXR1cm4gZXJyb3IodXJsKTtcbiAgICB9XG5cbiAgICB2YXIgZGF0YSA9IHRoaXMucmVzcG9uc2U7XG4gICAgY2FsbGJhY2soZGF0YSk7XG4gIH07XG4gIHJlcXVlc3Quc2VuZCgpO1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xvYWRlci90ZXh0LWxvYWRlci5qc1xuICoqLyIsInZhciBpc1JldGluYSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbWVkaWFRdWVyeSA9IFwiKC13ZWJraXQtbWluLWRldmljZS1waXhlbC1yYXRpbzogMS41KSxcXFxuICAobWluLS1tb3otZGV2aWNlLXBpeGVsLXJhdGlvOiAxLjUpLFxcXG4gICgtby1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAzLzIpLFxcXG4gIChtaW4tcmVzb2x1dGlvbjogMS41ZHBweClcIjtcblxuICBpZiAod2luZG93LmRldmljZVBpeGVsUmF0aW8gPiAxKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmICh3aW5kb3cubWF0Y2hNZWRpYSAmJiB3aW5kb3cubWF0Y2hNZWRpYShtZWRpYVF1ZXJ5KS5tYXRjaGVzKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaXNSZXRpbmE7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZXRpbmEuanNcbiAqKi8iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIGZvcm1hdFJlZ0V4cCA9IC8lW3NkaiVdL2c7XG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKGYpIHtcbiAgaWYgKCFpc1N0cmluZyhmKSkge1xuICAgIHZhciBvYmplY3RzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iamVjdHMucHVzaChpbnNwZWN0KGFyZ3VtZW50c1tpXSkpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0cy5qb2luKCcgJyk7XG4gIH1cblxuICB2YXIgaSA9IDE7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICB2YXIgbGVuID0gYXJncy5sZW5ndGg7XG4gIHZhciBzdHIgPSBTdHJpbmcoZikucmVwbGFjZShmb3JtYXRSZWdFeHAsIGZ1bmN0aW9uKHgpIHtcbiAgICBpZiAoeCA9PT0gJyUlJykgcmV0dXJuICclJztcbiAgICBpZiAoaSA+PSBsZW4pIHJldHVybiB4O1xuICAgIHN3aXRjaCAoeCkge1xuICAgICAgY2FzZSAnJXMnOiByZXR1cm4gU3RyaW5nKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclZCc6IHJldHVybiBOdW1iZXIoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVqJzpcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIHJldHVybiAnW0NpcmN1bGFyXSc7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfSk7XG4gIGZvciAodmFyIHggPSBhcmdzW2ldOyBpIDwgbGVuOyB4ID0gYXJnc1srK2ldKSB7XG4gICAgaWYgKGlzTnVsbCh4KSB8fCAhaXNPYmplY3QoeCkpIHtcbiAgICAgIHN0ciArPSAnICcgKyB4O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgKz0gJyAnICsgaW5zcGVjdCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cblxuLy8gTWFyayB0aGF0IGEgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZC5cbi8vIFJldHVybnMgYSBtb2RpZmllZCBmdW5jdGlvbiB3aGljaCB3YXJucyBvbmNlIGJ5IGRlZmF1bHQuXG4vLyBJZiAtLW5vLWRlcHJlY2F0aW9uIGlzIHNldCwgdGhlbiBpdCBpcyBhIG5vLW9wLlxuZXhwb3J0cy5kZXByZWNhdGUgPSBmdW5jdGlvbihmbiwgbXNnKSB7XG4gIC8vIEFsbG93IGZvciBkZXByZWNhdGluZyB0aGluZ3MgaW4gdGhlIHByb2Nlc3Mgb2Ygc3RhcnRpbmcgdXAuXG4gIGlmIChpc1VuZGVmaW5lZChnbG9iYWwucHJvY2VzcykpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy5kZXByZWNhdGUoZm4sIG1zZykuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHByb2Nlc3Mubm9EZXByZWNhdGlvbiA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKHByb2Nlc3MudGhyb3dEZXByZWNhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy50cmFjZURlcHJlY2F0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59O1xuXG5cbnZhciBkZWJ1Z3MgPSB7fTtcbnZhciBkZWJ1Z0Vudmlyb247XG5leHBvcnRzLmRlYnVnbG9nID0gZnVuY3Rpb24oc2V0KSB7XG4gIGlmIChpc1VuZGVmaW5lZChkZWJ1Z0Vudmlyb24pKVxuICAgIGRlYnVnRW52aXJvbiA9IHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJyc7XG4gIHNldCA9IHNldC50b1VwcGVyQ2FzZSgpO1xuICBpZiAoIWRlYnVnc1tzZXRdKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoJ1xcXFxiJyArIHNldCArICdcXFxcYicsICdpJykudGVzdChkZWJ1Z0Vudmlyb24pKSB7XG4gICAgICB2YXIgcGlkID0gcHJvY2Vzcy5waWQ7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbXNnID0gZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKTtcbiAgICAgICAgY29uc29sZS5lcnJvcignJXMgJWQ6ICVzJywgc2V0LCBwaWQsIG1zZyk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWJ1Z3Nbc2V0XTtcbn07XG5cblxuLyoqXG4gKiBFY2hvcyB0aGUgdmFsdWUgb2YgYSB2YWx1ZS4gVHJ5cyB0byBwcmludCB0aGUgdmFsdWUgb3V0XG4gKiBpbiB0aGUgYmVzdCB3YXkgcG9zc2libGUgZ2l2ZW4gdGhlIGRpZmZlcmVudCB0eXBlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcHJpbnQgb3V0LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdGhhdCBhbHRlcnMgdGhlIG91dHB1dC5cbiAqL1xuLyogbGVnYWN5OiBvYmosIHNob3dIaWRkZW4sIGRlcHRoLCBjb2xvcnMqL1xuZnVuY3Rpb24gaW5zcGVjdChvYmosIG9wdHMpIHtcbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHZhciBjdHggPSB7XG4gICAgc2VlbjogW10sXG4gICAgc3R5bGl6ZTogc3R5bGl6ZU5vQ29sb3JcbiAgfTtcbiAgLy8gbGVnYWN5Li4uXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDMpIGN0eC5kZXB0aCA9IGFyZ3VtZW50c1syXTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkgY3R4LmNvbG9ycyA9IGFyZ3VtZW50c1szXTtcbiAgaWYgKGlzQm9vbGVhbihvcHRzKSkge1xuICAgIC8vIGxlZ2FjeS4uLlxuICAgIGN0eC5zaG93SGlkZGVuID0gb3B0cztcbiAgfSBlbHNlIGlmIChvcHRzKSB7XG4gICAgLy8gZ290IGFuIFwib3B0aW9uc1wiIG9iamVjdFxuICAgIGV4cG9ydHMuX2V4dGVuZChjdHgsIG9wdHMpO1xuICB9XG4gIC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSkgY3R4LnNob3dIaWRkZW4gPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5kZXB0aCkpIGN0eC5kZXB0aCA9IDI7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY29sb3JzKSkgY3R4LmNvbG9ycyA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKSBjdHguY3VzdG9tSW5zcGVjdCA9IHRydWU7XG4gIGlmIChjdHguY29sb3JzKSBjdHguc3R5bGl6ZSA9IHN0eWxpemVXaXRoQ29sb3I7XG4gIHJldHVybiBmb3JtYXRWYWx1ZShjdHgsIG9iaiwgY3R4LmRlcHRoKTtcbn1cbmV4cG9ydHMuaW5zcGVjdCA9IGluc3BlY3Q7XG5cblxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BTlNJX2VzY2FwZV9jb2RlI2dyYXBoaWNzXG5pbnNwZWN0LmNvbG9ycyA9IHtcbiAgJ2JvbGQnIDogWzEsIDIyXSxcbiAgJ2l0YWxpYycgOiBbMywgMjNdLFxuICAndW5kZXJsaW5lJyA6IFs0LCAyNF0sXG4gICdpbnZlcnNlJyA6IFs3LCAyN10sXG4gICd3aGl0ZScgOiBbMzcsIDM5XSxcbiAgJ2dyZXknIDogWzkwLCAzOV0sXG4gICdibGFjaycgOiBbMzAsIDM5XSxcbiAgJ2JsdWUnIDogWzM0LCAzOV0sXG4gICdjeWFuJyA6IFszNiwgMzldLFxuICAnZ3JlZW4nIDogWzMyLCAzOV0sXG4gICdtYWdlbnRhJyA6IFszNSwgMzldLFxuICAncmVkJyA6IFszMSwgMzldLFxuICAneWVsbG93JyA6IFszMywgMzldXG59O1xuXG4vLyBEb24ndCB1c2UgJ2JsdWUnIG5vdCB2aXNpYmxlIG9uIGNtZC5leGVcbmluc3BlY3Quc3R5bGVzID0ge1xuICAnc3BlY2lhbCc6ICdjeWFuJyxcbiAgJ251bWJlcic6ICd5ZWxsb3cnLFxuICAnYm9vbGVhbic6ICd5ZWxsb3cnLFxuICAndW5kZWZpbmVkJzogJ2dyZXknLFxuICAnbnVsbCc6ICdib2xkJyxcbiAgJ3N0cmluZyc6ICdncmVlbicsXG4gICdkYXRlJzogJ21hZ2VudGEnLFxuICAvLyBcIm5hbWVcIjogaW50ZW50aW9uYWxseSBub3Qgc3R5bGluZ1xuICAncmVnZXhwJzogJ3JlZCdcbn07XG5cblxuZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICB2YXIgc3R5bGUgPSBpbnNwZWN0LnN0eWxlc1tzdHlsZVR5cGVdO1xuXG4gIGlmIChzdHlsZSkge1xuICAgIHJldHVybiAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVsxXSArICdtJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cblxuZnVuY3Rpb24gc3R5bGl6ZU5vQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgcmV0dXJuIHN0cjtcbn1cblxuXG5mdW5jdGlvbiBhcnJheVRvSGFzaChhcnJheSkge1xuICB2YXIgaGFzaCA9IHt9O1xuXG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsLCBpZHgpIHtcbiAgICBoYXNoW3ZhbF0gPSB0cnVlO1xuICB9KTtcblxuICByZXR1cm4gaGFzaDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRWYWx1ZShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMpIHtcbiAgLy8gUHJvdmlkZSBhIGhvb2sgZm9yIHVzZXItc3BlY2lmaWVkIGluc3BlY3QgZnVuY3Rpb25zLlxuICAvLyBDaGVjayB0aGF0IHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGFuIGluc3BlY3QgZnVuY3Rpb24gb24gaXRcbiAgaWYgKGN0eC5jdXN0b21JbnNwZWN0ICYmXG4gICAgICB2YWx1ZSAmJlxuICAgICAgaXNGdW5jdGlvbih2YWx1ZS5pbnNwZWN0KSAmJlxuICAgICAgLy8gRmlsdGVyIG91dCB0aGUgdXRpbCBtb2R1bGUsIGl0J3MgaW5zcGVjdCBmdW5jdGlvbiBpcyBzcGVjaWFsXG4gICAgICB2YWx1ZS5pbnNwZWN0ICE9PSBleHBvcnRzLmluc3BlY3QgJiZcbiAgICAgIC8vIEFsc28gZmlsdGVyIG91dCBhbnkgcHJvdG90eXBlIG9iamVjdHMgdXNpbmcgdGhlIGNpcmN1bGFyIGNoZWNrLlxuICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgIHZhciByZXQgPSB2YWx1ZS5pbnNwZWN0KHJlY3Vyc2VUaW1lcywgY3R4KTtcbiAgICBpZiAoIWlzU3RyaW5nKHJldCkpIHtcbiAgICAgIHJldCA9IGZvcm1hdFZhbHVlKGN0eCwgcmV0LCByZWN1cnNlVGltZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLy8gUHJpbWl0aXZlIHR5cGVzIGNhbm5vdCBoYXZlIHByb3BlcnRpZXNcbiAgdmFyIHByaW1pdGl2ZSA9IGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKTtcbiAgaWYgKHByaW1pdGl2ZSkge1xuICAgIHJldHVybiBwcmltaXRpdmU7XG4gIH1cblxuICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICB2YXIgdmlzaWJsZUtleXMgPSBhcnJheVRvSGFzaChrZXlzKTtcblxuICBpZiAoY3R4LnNob3dIaWRkZW4pIHtcbiAgICBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpO1xuICB9XG5cbiAgLy8gSUUgZG9lc24ndCBtYWtlIGVycm9yIGZpZWxkcyBub24tZW51bWVyYWJsZVxuICAvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvZHd3NTJzYnQodj12cy45NCkuYXNweFxuICBpZiAoaXNFcnJvcih2YWx1ZSlcbiAgICAgICYmIChrZXlzLmluZGV4T2YoJ21lc3NhZ2UnKSA+PSAwIHx8IGtleXMuaW5kZXhPZignZGVzY3JpcHRpb24nKSA+PSAwKSkge1xuICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICAvLyBTb21lIHR5cGUgb2Ygb2JqZWN0IHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWQuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW0Z1bmN0aW9uJyArIG5hbWUgKyAnXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfVxuICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdkYXRlJyk7XG4gICAgfVxuICAgIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgYmFzZSA9ICcnLCBhcnJheSA9IGZhbHNlLCBicmFjZXMgPSBbJ3snLCAnfSddO1xuXG4gIC8vIE1ha2UgQXJyYXkgc2F5IHRoYXQgdGhleSBhcmUgQXJyYXlcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgYXJyYXkgPSB0cnVlO1xuICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gIH1cblxuICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICBiYXNlID0gJyBbRnVuY3Rpb24nICsgbiArICddJztcbiAgfVxuXG4gIC8vIE1ha2UgUmVnRXhwcyBzYXkgdGhhdCB0aGV5IGFyZSBSZWdFeHBzXG4gIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBEYXRlLnByb3RvdHlwZS50b1VUQ1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZXJyb3Igd2l0aCBtZXNzYWdlIGZpcnN0IHNheSB0aGUgZXJyb3JcbiAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCAmJiAoIWFycmF5IHx8IHZhbHVlLmxlbmd0aCA9PSAwKSkge1xuICAgIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgYnJhY2VzWzFdO1xuICB9XG5cbiAgaWYgKHJlY3Vyc2VUaW1lcyA8IDApIHtcbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cblxuICBjdHguc2Vlbi5wdXNoKHZhbHVlKTtcblxuICB2YXIgb3V0cHV0O1xuICBpZiAoYXJyYXkpIHtcbiAgICBvdXRwdXQgPSBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKTtcbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGN0eC5zZWVuLnBvcCgpO1xuXG4gIHJldHVybiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHZhciBzaW1wbGUgPSAnXFwnJyArIEpTT04uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgIHJldHVybiBjdHguc3R5bGl6ZShzaW1wbGUsICdzdHJpbmcnKTtcbiAgfVxuICBpZiAoaXNOdW1iZXIodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnbnVtYmVyJyk7XG4gIGlmIChpc0Jvb2xlYW4odmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnYm9vbGVhbicpO1xuICAvLyBGb3Igc29tZSByZWFzb24gdHlwZW9mIG51bGwgaXMgXCJvYmplY3RcIiwgc28gc3BlY2lhbCBjYXNlIGhlcmUuXG4gIGlmIChpc051bGwodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnbnVsbCcsICdudWxsJyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IodmFsdWUpIHtcbiAgcmV0dXJuICdbJyArIEVycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSArICddJztcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkodmFsdWUsIFN0cmluZyhpKSkpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAgU3RyaW5nKGkpLCB0cnVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dC5wdXNoKCcnKTtcbiAgICB9XG4gIH1cbiAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIGlmICgha2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBrZXksIHRydWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpIHtcbiAgdmFyIG5hbWUsIHN0ciwgZGVzYztcbiAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIGtleSkgfHwgeyB2YWx1ZTogdmFsdWVba2V5XSB9O1xuICBpZiAoZGVzYy5nZXQpIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmICghaGFzT3duUHJvcGVydHkodmlzaWJsZUtleXMsIGtleSkpIHtcbiAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICB9XG4gIGlmICghc3RyKSB7XG4gICAgaWYgKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSkgPCAwKSB7XG4gICAgICBpZiAoaXNOdWxsKHJlY3Vyc2VUaW1lcykpIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgcmVjdXJzZVRpbWVzIC0gMSk7XG4gICAgICB9XG4gICAgICBpZiAoc3RyLmluZGV4T2YoJ1xcbicpID4gLTEpIHtcbiAgICAgICAgaWYgKGFycmF5KSB7XG4gICAgICAgICAgc3RyID0gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgPSAnXFxuJyArIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICBpZiAoYXJyYXkgJiYga2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgbmFtZSA9IEpTT04uc3RyaW5naWZ5KCcnICsga2V5KTtcbiAgICBpZiAobmFtZS5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykpIHtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG59XG5cblxuZnVuY3Rpb24gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpIHtcbiAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgdmFyIGxlbmd0aCA9IG91dHB1dC5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XG4gICAgbnVtTGluZXNFc3QrKztcbiAgICBpZiAoY3VyLmluZGV4T2YoJ1xcbicpID49IDApIG51bUxpbmVzRXN0Kys7XG4gICAgcmV0dXJuIHByZXYgKyBjdXIucmVwbGFjZSgvXFx1MDAxYlxcW1xcZFxcZD9tL2csICcnKS5sZW5ndGggKyAxO1xuICB9LCAwKTtcblxuICBpZiAobGVuZ3RoID4gNjApIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICtcbiAgICAgICAgICAgKGJhc2UgPT09ICcnID8gJycgOiBiYXNlICsgJ1xcbiAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIGJyYWNlc1sxXTtcbiAgfVxuXG4gIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgJyAnICsgb3V0cHV0LmpvaW4oJywgJykgKyAnICcgKyBicmFjZXNbMV07XG59XG5cblxuLy8gTk9URTogVGhlc2UgdHlwZSBjaGVja2luZyBmdW5jdGlvbnMgaW50ZW50aW9uYWxseSBkb24ndCB1c2UgYGluc3RhbmNlb2ZgXG4vLyBiZWNhdXNlIGl0IGlzIGZyYWdpbGUgYW5kIGNhbiBiZSBlYXNpbHkgZmFrZWQgd2l0aCBgT2JqZWN0LmNyZWF0ZSgpYC5cbmZ1bmN0aW9uIGlzQXJyYXkoYXIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXIpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gaXNCb29sZWFuKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nO1xufVxuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbmZ1bmN0aW9uIGlzTnVsbChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsID0gaXNOdWxsO1xuXG5mdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGxPclVuZGVmaW5lZCA9IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG5mdW5jdGlvbiBpc1N0cmluZyhhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N5bWJvbChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnO1xufVxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc1JlZ0V4cChyZSkge1xuICByZXR1cm4gaXNPYmplY3QocmUpICYmIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gaXNPYmplY3QoZCkgJiYgb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGUpICYmXG4gICAgICAob2JqZWN0VG9TdHJpbmcoZSkgPT09ICdbb2JqZWN0IEVycm9yXScgfHwgZSBpbnN0YW5jZW9mIEVycm9yKTtcbn1cbmV4cG9ydHMuaXNFcnJvciA9IGlzRXJyb3I7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3ltYm9sJyB8fCAgLy8gRVM2IHN5bWJvbFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbmV4cG9ydHMuaXNCdWZmZXIgPSByZXF1aXJlKCcuL3N1cHBvcnQvaXNCdWZmZXInKTtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuXG5cbmZ1bmN0aW9uIHBhZChuKSB7XG4gIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuLnRvU3RyaW5nKDEwKSA6IG4udG9TdHJpbmcoMTApO1xufVxuXG5cbnZhciBtb250aHMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJyxcbiAgICAgICAgICAgICAgJ09jdCcsICdOb3YnLCAnRGVjJ107XG5cbi8vIDI2IEZlYiAxNjoxOTozNFxuZnVuY3Rpb24gdGltZXN0YW1wKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gIHZhciB0aW1lID0gW3BhZChkLmdldEhvdXJzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRNaW51dGVzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCc6Jyk7XG4gIHJldHVybiBbZC5nZXREYXRlKCksIG1vbnRoc1tkLmdldE1vbnRoKCldLCB0aW1lXS5qb2luKCcgJyk7XG59XG5cblxuLy8gbG9nIGlzIGp1c3QgYSB0aGluIHdyYXBwZXIgdG8gY29uc29sZS5sb2cgdGhhdCBwcmVwZW5kcyBhIHRpbWVzdGFtcFxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJyVzIC0gJXMnLCB0aW1lc3RhbXAoKSwgZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKSk7XG59O1xuXG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyLlxuICpcbiAqIFRoZSBGdW5jdGlvbi5wcm90b3R5cGUuaW5oZXJpdHMgZnJvbSBsYW5nLmpzIHJld3JpdHRlbiBhcyBhIHN0YW5kYWxvbmVcbiAqIGZ1bmN0aW9uIChub3Qgb24gRnVuY3Rpb24ucHJvdG90eXBlKS4gTk9URTogSWYgdGhpcyBmaWxlIGlzIHRvIGJlIGxvYWRlZFxuICogZHVyaW5nIGJvb3RzdHJhcHBpbmcgdGhpcyBmdW5jdGlvbiBuZWVkcyB0byBiZSByZXdyaXR0ZW4gdXNpbmcgc29tZSBuYXRpdmVcbiAqIGZ1bmN0aW9ucyBhcyBwcm90b3R5cGUgc2V0dXAgdXNpbmcgbm9ybWFsIEphdmFTY3JpcHQgZG9lcyBub3Qgd29yayBhc1xuICogZXhwZWN0ZWQgZHVyaW5nIGJvb3RzdHJhcHBpbmcgKHNlZSBtaXJyb3IuanMgaW4gcjExNDkwMykuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB3aGljaCBuZWVkcyB0byBpbmhlcml0IHRoZVxuICogICAgIHByb3RvdHlwZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBpbmhlcml0IHByb3RvdHlwZSBmcm9tLlxuICovXG5leHBvcnRzLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuZXhwb3J0cy5fZXh0ZW5kID0gZnVuY3Rpb24ob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCAhaXNPYmplY3QoYWRkKSkgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn07XG5cbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC91dGlsLmpzXG4gKiogbW9kdWxlIGlkID0gMTdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgJ2JhY2tzcGFjZSc6IDgsXG4gICd0YWInOiA5LFxuICAnZW50ZXInOiAxMyxcbiAgJ3BhdXNlJzogMTksXG4gICdjYXBzJzogMjAsXG4gICdlc2MnOiAyNyxcbiAgJ3NwYWNlJzogMzIsXG4gICdwYWdlX3VwJzogMzMsXG4gICdwYWdlX2Rvd24nOiAzNCxcbiAgJ2VuZCc6IDM1LFxuICAnaG9tZSc6IDM2LFxuICAnbGVmdCc6IDM3LFxuICAndXAnOiAzOCxcbiAgJ3JpZ2h0JzogMzksXG4gICdkb3duJzogNDAsXG4gICdpbnNlcnQnOiA0NSxcbiAgJ2RlbGV0ZSc6IDQ2LFxuICAnMCc6IDQ4LFxuICAnMSc6IDQ5LFxuICAnMic6IDUwLFxuICAnMyc6IDUxLFxuICAnNCc6IDUyLFxuICAnNSc6IDUzLFxuICAnNic6IDU0LFxuICAnNyc6IDU1LFxuICAnOCc6IDU2LFxuICAnOSc6IDU3LFxuICAnYSc6IDY1LFxuICAnYic6IDY2LFxuICAnYyc6IDY3LFxuICAnZCc6IDY4LFxuICAnZSc6IDY5LFxuICAnZic6IDcwLFxuICAnZyc6IDcxLFxuICAnaCc6IDcyLFxuICAnaSc6IDczLFxuICAnaic6IDc0LFxuICAnayc6IDc1LFxuICAnbCc6IDc2LFxuICAnbSc6IDc3LFxuICAnbic6IDc4LFxuICAnbyc6IDc5LFxuICAncCc6IDgwLFxuICAncSc6IDgxLFxuICAncic6IDgyLFxuICAncyc6IDgzLFxuICAndCc6IDg0LFxuICAndSc6IDg1LFxuICAndic6IDg2LFxuICAndyc6IDg3LFxuICAneCc6IDg4LFxuICAneSc6IDg5LFxuICAneic6IDkwLFxuICAnbnVtcGFkXzAnOiA5NixcbiAgJ251bXBhZF8xJzogOTcsXG4gICdudW1wYWRfMic6IDk4LFxuICAnbnVtcGFkXzMnOiA5OSxcbiAgJ251bXBhZF80JzogMTAwLFxuICAnbnVtcGFkXzUnOiAxMDEsXG4gICdudW1wYWRfNic6IDEwMixcbiAgJ251bXBhZF83JzogMTAzLFxuICAnbnVtcGFkXzgnOiAxMDQsXG4gICdudW1wYWRfOSc6IDEwNSxcbiAgJ211bHRpcGx5JzogMTA2LFxuICAnYWRkJzogMTA3LFxuICAnc3Vic3RyYWN0JzogMTA5LFxuICAnZGVjaW1hbCc6IDExMCxcbiAgJ2RpdmlkZSc6IDExMSxcbiAgJ2YxJzogMTEyLFxuICAnZjInOiAxMTMsXG4gICdmMyc6IDExNCxcbiAgJ2Y0JzogMTE1LFxuICAnZjUnOiAxMTYsXG4gICdmNic6IDExNyxcbiAgJ2Y3JzogMTE4LFxuICAnZjgnOiAxMTksXG4gICdmOSc6IDEyMCxcbiAgJ2YxMCc6IDEyMSxcbiAgJ2YxMSc6IDEyMixcbiAgJ2YxMic6IDEyMyxcbiAgJ3NoaWZ0JzogMTYsXG4gICdjdHJsJzogMTcsXG4gICdhbHQnOiAxOCxcbiAgJ3BsdXMnOiAxODcsXG4gICdjb21tYSc6IDE4OCxcbiAgJ21pbnVzJzogMTg5LFxuICAncGVyaW9kJzogMTkwXG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMva2V5cy5qc1xuICoqLyIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyByZXNvbHZlcyAuIGFuZCAuLiBlbGVtZW50cyBpbiBhIHBhdGggYXJyYXkgd2l0aCBkaXJlY3RvcnkgbmFtZXMgdGhlcmVcbi8vIG11c3QgYmUgbm8gc2xhc2hlcywgZW1wdHkgZWxlbWVudHMsIG9yIGRldmljZSBuYW1lcyAoYzpcXCkgaW4gdGhlIGFycmF5XG4vLyAoc28gYWxzbyBubyBsZWFkaW5nIGFuZCB0cmFpbGluZyBzbGFzaGVzIC0gaXQgZG9lcyBub3QgZGlzdGluZ3Vpc2hcbi8vIHJlbGF0aXZlIGFuZCBhYnNvbHV0ZSBwYXRocylcbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KHBhcnRzLCBhbGxvd0Fib3ZlUm9vdCkge1xuICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgbGFzdCA9IHBhcnRzW2ldO1xuICAgIGlmIChsYXN0ID09PSAnLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKGxhc3QgPT09ICcuLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgcGF0aCBpcyBhbGxvd2VkIHRvIGdvIGFib3ZlIHRoZSByb290LCByZXN0b3JlIGxlYWRpbmcgLi5zXG4gIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xuICAgIGZvciAoOyB1cC0tOyB1cCkge1xuICAgICAgcGFydHMudW5zaGlmdCgnLi4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFydHM7XG59XG5cbi8vIFNwbGl0IGEgZmlsZW5hbWUgaW50byBbcm9vdCwgZGlyLCBiYXNlbmFtZSwgZXh0XSwgdW5peCB2ZXJzaW9uXG4vLyAncm9vdCcgaXMganVzdCBhIHNsYXNoLCBvciBub3RoaW5nLlxudmFyIHNwbGl0UGF0aFJlID1cbiAgICAvXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLztcbnZhciBzcGxpdFBhdGggPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICByZXR1cm4gc3BsaXRQYXRoUmUuZXhlYyhmaWxlbmFtZSkuc2xpY2UoMSk7XG59O1xuXG4vLyBwYXRoLnJlc29sdmUoW2Zyb20gLi4uXSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlc29sdmUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc29sdmVkUGF0aCA9ICcnLFxuICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgdmFyIHBhdGggPSAoaSA+PSAwKSA/IGFyZ3VtZW50c1tpXSA6IHByb2Nlc3MuY3dkKCk7XG5cbiAgICAvLyBTa2lwIGVtcHR5IGFuZCBpbnZhbGlkIGVudHJpZXNcbiAgICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5yZXNvbHZlIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH0gZWxzZSBpZiAoIXBhdGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlc29sdmVkUGF0aCA9IHBhdGggKyAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckF0KDApID09PSAnLyc7XG4gIH1cblxuICAvLyBBdCB0aGlzIHBvaW50IHRoZSBwYXRoIHNob3VsZCBiZSByZXNvbHZlZCB0byBhIGZ1bGwgYWJzb2x1dGUgcGF0aCwgYnV0XG4gIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICByZXNvbHZlZFBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocmVzb2x2ZWRQYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIXJlc29sdmVkQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICByZXR1cm4gKChyZXNvbHZlZEFic29sdXRlID8gJy8nIDogJycpICsgcmVzb2x2ZWRQYXRoKSB8fCAnLic7XG59O1xuXG4vLyBwYXRoLm5vcm1hbGl6ZShwYXRoKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5ub3JtYWxpemUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpLFxuICAgICAgdHJhaWxpbmdTbGFzaCA9IHN1YnN0cihwYXRoLCAtMSkgPT09ICcvJztcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIWlzQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICBpZiAoIXBhdGggJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBwYXRoID0gJy4nO1xuICB9XG4gIGlmIChwYXRoICYmIHRyYWlsaW5nU2xhc2gpIHtcbiAgICBwYXRoICs9ICcvJztcbiAgfVxuXG4gIHJldHVybiAoaXNBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmlzQWJzb2x1dGUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5qb2luID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXRocyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiBleHBvcnRzLm5vcm1hbGl6ZShmaWx0ZXIocGF0aHMsIGZ1bmN0aW9uKHAsIGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBwICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG4gIH0pLmpvaW4oJy8nKSk7XG59O1xuXG5cbi8vIHBhdGgucmVsYXRpdmUoZnJvbSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlbGF0aXZlID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgZnJvbSA9IGV4cG9ydHMucmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7XG4gIHRvID0gZXhwb3J0cy5yZXNvbHZlKHRvKS5zdWJzdHIoMSk7XG5cbiAgZnVuY3Rpb24gdHJpbShhcnIpIHtcbiAgICB2YXIgc3RhcnQgPSAwO1xuICAgIGZvciAoOyBzdGFydCA8IGFyci5sZW5ndGg7IHN0YXJ0KyspIHtcbiAgICAgIGlmIChhcnJbc3RhcnRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgdmFyIGVuZCA9IGFyci5sZW5ndGggLSAxO1xuICAgIGZvciAoOyBlbmQgPj0gMDsgZW5kLS0pIHtcbiAgICAgIGlmIChhcnJbZW5kXSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChzdGFydCA+IGVuZCkgcmV0dXJuIFtdO1xuICAgIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQsIGVuZCAtIHN0YXJ0ICsgMSk7XG4gIH1cblxuICB2YXIgZnJvbVBhcnRzID0gdHJpbShmcm9tLnNwbGl0KCcvJykpO1xuICB2YXIgdG9QYXJ0cyA9IHRyaW0odG8uc3BsaXQoJy8nKSk7XG5cbiAgdmFyIGxlbmd0aCA9IE1hdGgubWluKGZyb21QYXJ0cy5sZW5ndGgsIHRvUGFydHMubGVuZ3RoKTtcbiAgdmFyIHNhbWVQYXJ0c0xlbmd0aCA9IGxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChmcm9tUGFydHNbaV0gIT09IHRvUGFydHNbaV0pIHtcbiAgICAgIHNhbWVQYXJ0c0xlbmd0aCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0cHV0UGFydHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IHNhbWVQYXJ0c0xlbmd0aDsgaSA8IGZyb21QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG91dHB1dFBhcnRzLnB1c2goJy4uJyk7XG4gIH1cblxuICBvdXRwdXRQYXJ0cyA9IG91dHB1dFBhcnRzLmNvbmNhdCh0b1BhcnRzLnNsaWNlKHNhbWVQYXJ0c0xlbmd0aCkpO1xuXG4gIHJldHVybiBvdXRwdXRQYXJ0cy5qb2luKCcvJyk7XG59O1xuXG5leHBvcnRzLnNlcCA9ICcvJztcbmV4cG9ydHMuZGVsaW1pdGVyID0gJzonO1xuXG5leHBvcnRzLmRpcm5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciByZXN1bHQgPSBzcGxpdFBhdGgocGF0aCksXG4gICAgICByb290ID0gcmVzdWx0WzBdLFxuICAgICAgZGlyID0gcmVzdWx0WzFdO1xuXG4gIGlmICghcm9vdCAmJiAhZGlyKSB7XG4gICAgLy8gTm8gZGlybmFtZSB3aGF0c29ldmVyXG4gICAgcmV0dXJuICcuJztcbiAgfVxuXG4gIGlmIChkaXIpIHtcbiAgICAvLyBJdCBoYXMgYSBkaXJuYW1lLCBzdHJpcCB0cmFpbGluZyBzbGFzaFxuICAgIGRpciA9IGRpci5zdWJzdHIoMCwgZGlyLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIHJvb3QgKyBkaXI7XG59O1xuXG5cbmV4cG9ydHMuYmFzZW5hbWUgPSBmdW5jdGlvbihwYXRoLCBleHQpIHtcbiAgdmFyIGYgPSBzcGxpdFBhdGgocGF0aClbMl07XG4gIC8vIFRPRE86IG1ha2UgdGhpcyBjb21wYXJpc29uIGNhc2UtaW5zZW5zaXRpdmUgb24gd2luZG93cz9cbiAgaWYgKGV4dCAmJiBmLnN1YnN0cigtMSAqIGV4dC5sZW5ndGgpID09PSBleHQpIHtcbiAgICBmID0gZi5zdWJzdHIoMCwgZi5sZW5ndGggLSBleHQubGVuZ3RoKTtcbiAgfVxuICByZXR1cm4gZjtcbn07XG5cblxuZXhwb3J0cy5leHRuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gc3BsaXRQYXRoKHBhdGgpWzNdO1xufTtcblxuZnVuY3Rpb24gZmlsdGVyICh4cywgZikge1xuICAgIGlmICh4cy5maWx0ZXIpIHJldHVybiB4cy5maWx0ZXIoZik7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGYoeHNbaV0sIGksIHhzKSkgcmVzLnB1c2goeHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG52YXIgc3Vic3RyID0gJ2FiJy5zdWJzdHIoLTEpID09PSAnYidcbiAgICA/IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHsgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbikgfVxuICAgIDogZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfVxuO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3BhdGgtYnJvd3NlcmlmeS9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDE5XG4gKiogbW9kdWxlIGNodW5rcyA9IDEzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL3NyYy9hdWRpby1tYW5hZ2VyJyk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9wb3Rpb24tYXVkaW8vaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAyMFxuICoqIG1vZHVsZSBjaHVua3MgPSAxM1xuICoqLyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gdHJ1ZTtcbiAgICB2YXIgY3VycmVudFF1ZXVlO1xuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgICAgICAgICBjdXJyZW50UXVldWVbaV0oKTtcbiAgICAgICAgfVxuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG59XG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHF1ZXVlLnB1c2goZnVuKTtcbiAgICBpZiAoIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vcHJvY2Vzcy9icm93c2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTNcbiAqKi8iLCJ2YXIgTG9hZGVkQXVkaW8gPSByZXF1aXJlKCcuL2xvYWRlZC1hdWRpbycpO1xuXG52YXIgQXVkaW9NYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG4gIHZhciBBdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG5cbiAgdGhpcy5fY3R4ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICB0aGlzLl9tYXN0ZXJHYWluID0gdGhpcy5fY3R4LmNyZWF0ZUdhaW4oKTtcbiAgdGhpcy5fdm9sdW1lID0gMTtcbiAgdGhpcy5pc011dGVkID0gZmFsc2U7XG5cbiAgdmFyIGlPUyA9IC8oaVBhZHxpUGhvbmV8aVBvZCkvZy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICBpZiAoaU9TKSB7XG4gICAgdGhpcy5fZW5hYmxlaU9TKCk7XG4gIH1cbn07XG5cbkF1ZGlvTWFuYWdlci5wcm90b3R5cGUuX2VuYWJsZWlPUyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIHRvdWNoID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJ1ZmZlciA9IHNlbGYuX2N0eC5jcmVhdGVCdWZmZXIoMSwgMSwgMjIwNTApO1xuICAgIHZhciBzb3VyY2UgPSBzZWxmLl9jdHguY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgc291cmNlLmJ1ZmZlciA9IGJ1ZmZlcjtcbiAgICBzb3VyY2UuY29ubmVjdChzZWxmLl9jdHguZGVzdGluYXRpb24pO1xuICAgIHNvdXJjZS5zdGFydCgwKTtcblxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdG91Y2gsIGZhbHNlKTtcbiAgfTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRvdWNoLCBmYWxzZSk7XG59O1xuXG5BdWRpb01hbmFnZXIucHJvdG90eXBlLm11dGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5pc011dGVkID0gdHJ1ZTtcbiAgdGhpcy5fdXBkYXRlTXV0ZSgpO1xufTtcblxuQXVkaW9NYW5hZ2VyLnByb3RvdHlwZS51bm11dGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5pc011dGVkID0gZmFsc2U7XG4gIHRoaXMuX3VwZGF0ZU11dGUoKTtcbn07XG5cbkF1ZGlvTWFuYWdlci5wcm90b3R5cGUudG9nZ2xlTXV0ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmlzTXV0ZWQgPSAhdGhpcy5pc011dGVkO1xuICB0aGlzLl91cGRhdGVNdXRlKCk7XG59O1xuXG5BdWRpb01hbmFnZXIucHJvdG90eXBlLl91cGRhdGVNdXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX21hc3RlckdhaW4uZ2Fpbi52YWx1ZSA9IHRoaXMuaXNNdXRlZCA/IDAgOiB0aGlzLl92b2x1bWU7XG59O1xuXG5BdWRpb01hbmFnZXIucHJvdG90eXBlLnNldFZvbHVtZSA9IGZ1bmN0aW9uKHZvbHVtZSkge1xuICB0aGlzLl92b2x1bWUgPSB2b2x1bWU7XG4gIHRoaXMuX21hc3RlckdhaW4uZ2Fpbi52YWx1ZSA9IHZvbHVtZTtcbn07XG5cbkF1ZGlvTWFuYWdlci5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uKHVybCwgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIHJlcXVlc3Qub3BlbignR0VUJywgdXJsLCB0cnVlKTtcbiAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIHNlbGYuZGVjb2RlQXVkaW9EYXRhKHJlcXVlc3QucmVzcG9uc2UsIGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgY2FsbGJhY2soc291cmNlKTtcbiAgICB9KTtcbiAgfTtcbiAgcmVxdWVzdC5zZW5kKCk7XG59O1xuXG5BdWRpb01hbmFnZXIucHJvdG90eXBlLmRlY29kZUF1ZGlvRGF0YSA9IGZ1bmN0aW9uKGRhdGEsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB0aGlzLl9jdHguZGVjb2RlQXVkaW9EYXRhKGRhdGEsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgIHZhciBhdWRpbyA9IG5ldyBMb2FkZWRBdWRpbyhzZWxmLl9jdHgsIHJlc3VsdCwgc2VsZi5fbWFzdGVyR2Fpbik7XG5cbiAgICBjYWxsYmFjayhhdWRpbyk7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBdWRpb01hbmFnZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9wb3Rpb24tYXVkaW8vc3JjL2F1ZGlvLW1hbmFnZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyMlxuICoqIG1vZHVsZSBjaHVua3MgPSAxM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qc1xuICoqIG1vZHVsZSBpZCA9IDIzXG4gKiogbW9kdWxlIGNodW5rcyA9IDEzXG4gKiovIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC9+L2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyNFxuICoqIG1vZHVsZSBjaHVua3MgPSAxM1xuICoqLyIsInZhciBQbGF5aW5nQXVkaW8gPSByZXF1aXJlKCcuL3BsYXlpbmctYXVkaW8nKTtcblxudmFyIExvYWRlZEF1ZGlvID0gZnVuY3Rpb24oY3R4LCBidWZmZXIsIG1hc3RlckdhaW4pIHtcbiAgdGhpcy5fY3R4ID0gY3R4O1xuICB0aGlzLl9tYXN0ZXJHYWluID0gbWFzdGVyR2FpbjtcbiAgdGhpcy5fYnVmZmVyID0gYnVmZmVyO1xuICB0aGlzLl9idWZmZXIubG9vcCA9IGZhbHNlO1xufTtcblxuTG9hZGVkQXVkaW8ucHJvdG90eXBlLl9jcmVhdGVTb3VuZCA9IGZ1bmN0aW9uKGdhaW4pIHtcbiAgdmFyIHNvdXJjZSA9IHRoaXMuX2N0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbiAgc291cmNlLmJ1ZmZlciA9IHRoaXMuX2J1ZmZlcjtcblxuICB0aGlzLl9tYXN0ZXJHYWluLmNvbm5lY3QodGhpcy5fY3R4LmRlc3RpbmF0aW9uKTtcblxuICBnYWluLmNvbm5lY3QodGhpcy5fbWFzdGVyR2Fpbik7XG5cbiAgc291cmNlLmNvbm5lY3QoZ2Fpbik7XG5cbiAgcmV0dXJuIHNvdXJjZTtcbn07XG5cbkxvYWRlZEF1ZGlvLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBnYWluID0gdGhpcy5fY3R4LmNyZWF0ZUdhaW4oKTtcblxuICB2YXIgc291bmQgPSB0aGlzLl9jcmVhdGVTb3VuZChnYWluKTtcblxuICBzb3VuZC5zdGFydCgwKTtcblxuICByZXR1cm4gbmV3IFBsYXlpbmdBdWRpbyhzb3VuZCwgZ2Fpbik7XG59O1xuXG5Mb2FkZWRBdWRpby5wcm90b3R5cGUuZmFkZUluID0gZnVuY3Rpb24odmFsdWUsIHRpbWUpIHtcbiAgdmFyIGdhaW4gPSB0aGlzLl9jdHguY3JlYXRlR2FpbigpO1xuXG4gIHZhciBzb3VuZCA9IHRoaXMuX2NyZWF0ZVNvdW5kKGdhaW4pO1xuXG4gIGdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCAwKTtcbiAgZ2Fpbi5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAuMDEsIDApO1xuICBnYWluLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUodmFsdWUsIHRpbWUpO1xuXG4gIHNvdW5kLnN0YXJ0KDApO1xuXG4gIHJldHVybiBuZXcgUGxheWluZ0F1ZGlvKHNvdW5kLCBnYWluKTtcbn07XG5cbkxvYWRlZEF1ZGlvLnByb3RvdHlwZS5sb29wID0gZnVuY3Rpb24oKSB7XG4gIHZhciBnYWluID0gdGhpcy5fY3R4LmNyZWF0ZUdhaW4oKTtcblxuICB2YXIgc291bmQgPSB0aGlzLl9jcmVhdGVTb3VuZChnYWluKTtcblxuICBzb3VuZC5sb29wID0gdHJ1ZTtcbiAgc291bmQuc3RhcnQoMCk7XG5cbiAgcmV0dXJuIG5ldyBQbGF5aW5nQXVkaW8oc291bmQsIGdhaW4pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2FkZWRBdWRpbztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3BvdGlvbi1hdWRpby9zcmMvbG9hZGVkLWF1ZGlvLmpzXG4gKiogbW9kdWxlIGlkID0gMjVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTNcbiAqKi8iLCJ2YXIgUGxheWluZ0F1ZGlvID0gZnVuY3Rpb24oc291cmNlLCBnYWluKSB7XG4gIHRoaXMuX2dhaW4gPSBnYWluO1xuICB0aGlzLl9zb3VyY2UgPSBzb3VyY2U7XG59O1xuXG5QbGF5aW5nQXVkaW8ucHJvdG90eXBlLnNldFZvbHVtZSA9IGZ1bmN0aW9uKHZvbHVtZSkge1xuICB0aGlzLl9nYWluLmdhaW4udmFsdWUgPSB2b2x1bWU7XG59O1xuXG5QbGF5aW5nQXVkaW8ucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fc291cmNlLnN0b3AoMCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXlpbmdBdWRpbztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3BvdGlvbi1hdWRpby9zcmMvcGxheWluZy1hdWRpby5qc1xuICoqIG1vZHVsZSBpZCA9IDI2XG4gKiogbW9kdWxlIGNodW5rcyA9IDEzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIiLCJmaWxlIjoic2hhcmVkLmpzIn0=