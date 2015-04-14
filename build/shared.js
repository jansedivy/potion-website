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
	
	var isRetina = __webpack_require__(14)();
	
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
	
	var keys = __webpack_require__(13);
	
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
/* 14 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYzRhOTU4Zjc2MDYxNTc3ZjUzYWIiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VuZ2luZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmFmLXBvbHlmaWxsLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RpbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YXRlLW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wb3Rpb24tZGVidWdnZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZpZGVvLmpzIiwid2VicGFjazovLy8uL3NyYy9hc3NldHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2lucHV0LmpzIiwid2VicGFjazovLy8uL3NyYy9sb2FkaW5nLmpzIiwid2VicGFjazovLy8uL34vcG90aW9uLWRlYnVnZ2VyL2RpcnR5LW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tleXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JldGluYS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbG9hZGVyL2pzb24tbG9hZGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9sb2FkZXIvaW1hZ2UtbG9hZGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9sb2FkZXIvdGV4dC1sb2FkZXIuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC91dGlsLmpzIiwid2VicGFjazovLy8od2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3BhdGgtYnJvd3NlcmlmeS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3BvdGlvbi1hdWRpby9pbmRleC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wb3Rpb24tYXVkaW8vc3JjL2F1ZGlvLW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi91dGlsL34vaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9+L3BvdGlvbi1hdWRpby9zcmMvbG9hZGVkLWF1ZGlvLmpzIiwid2VicGFjazovLy8uL34vcG90aW9uLWF1ZGlvL3NyYy9wbGF5aW5nLWF1ZGlvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBUSxvQkFBb0I7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDRDOzs7Ozs7Ozs7O0FDeEZBLEtBQUksTUFBTSxHQUFHLG1CQUFPLENBQUMsQ0FBYyxDQUFDLENBQUM7O0FBRXJDLE9BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixPQUFJLEVBQUUsY0FBUyxNQUFNLEVBQUUsT0FBTyxFQUFFO0FBQzlCLFNBQUksTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFP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QUcsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUUxRCxPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztBQUMvRCxPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUVsRCxPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQzNCLE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsS0FBSyxHQUFHLEVBQUUsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDNUQsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDM0IsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7O0FBRXhCLE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsb0JBQW9CLENBQUM7QUFDN0UsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDOztBQUU5RCxPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMs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Q1gsU0FBUSxFQUFFO0FBQ1YsUUFBTyxFQUFFO0FBQ1QsVUFBUyxFQUFFO0FBQ1gsWUFBVyxFQUFFO0FBQ2IsY0FBYSxFQUFFO0FBQ2YsUUFBTyxFQUFFO0FBQ1QsU0FBUSxFQUFFO0FBQ1YsU0FBUSxFQUFFO0FBQ1YsT0FBTSxFQUFFO0FBQ1IsVUFBUyxFQUFFO0FBQ1gsU0FBUSxFQUFFO0FBQ1YsV0FBVSxFQUFFO0FBQ1osV0FBUSxFQUFFLEVBQUU7QUFDWixNQUFHLEVBQUUsRUFBRTtBQUNQLE1BQUcsRUFBRSxFQUFFO0FBQ1AsTUFBRyxFQUFFLEVBQUU7QUFDUCxNQUFHLEVBQUUsRUFBRTtBQUNQLE1BQUcsRUFBRSxFQUFFO0FBQ1AsTUFBRyxFQUFFLEVBQUU7QUFDUCxNQUFHLEVBQUUsRUFBRTtBQUNQLE1BQUcsRUFBRSxFQUFFO0FBQ1AsTUFBRyxFQUFFLEVBQUU7QUFDUCxNQUFHLEVBQUUsRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLE1BQUssRUFBRTtBQUNQLGFBQVksRUFBRTtBQUNkLGFBQVksRUFBRTtBQUNkLGFBQVksRUFBRTtBQUNkLGFBQVksRUFBRTtBQUNkLGFBQVksR0FBRztBQUNmLGFBQVksR0FBRztBQUNmLGFBQVksR0FBRztBQUNmLGFBQVksR0FBRztBQUNmLGFBQVksR0FBRztBQUNmLGFBQVksR0FBRztBQUNmLGFBQVksR0FBRztBQUNmLFFBQU8sR0FBRztBQUNWLGNBQWEsR0FBRztBQUNoQixZQUFXLEdBQUc7QUFDZCxXQUFVLEdBQUc7QUFDYixPQUFNLEdBQUc7QUFDVCxPQUFNLEdBQUc7QUFDVCxPQUFNLEdBQUc7QUFDVCxPQUFNLEdBQUc7QUFDVCxPQUFNLEdBQUc7QUFDVCxPQUFNLEdBQUc7QUFDVCxPQUFNLEdBQUc7QUFDVCxPQUFNLEdBQUc7QUFDVCxPQUFNLEdBQUc7QUFDVCxRQUFPLEdBQUc7QUFDVixRQUFPLEdBQUc7QUFDVixRQUFPLEdBQUc7QUFDVixVQUFTLEVBQUU7QUFDWCxTQUFRLEVBQUU7QUFDVixRQUFPLEVBQUU7QUFDVCxTQUFRLEdBQUc7QUFDWCxVQUFTLEdBQUc7QUFDWixVQUFTLEdBQUc7QUFDWixXQUFVLEdBQUc7RUFDZCxDOzs7Ozs7OztBQ3hGRCxLQUFJLFFBQVEsR0FBRyxvQkFBVztBQUN4QixPQUFJLFVBQVUsR0FBRywySUFHUyxDQUFDOztBQUUzQixPQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDO0FBQzdCLFlBQU8sSUFBSSxDQUFDO0lBRWQsSUFBSSxNQUFNLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTztBQUM1RCxZQUFPLElBQUksQ0FBQztJQUVkLE9BQU8sS0FBSyxDQUFDO0VBQ2QsQ0FBQzs7QUFFRixPQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQzs7Ozs7Ozs7QUNmekIsT0FBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO0FBQzlDLE9BQUksT0FBTyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7O0FBRW5DLFVBQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMvQixVQUFPLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQztBQUM5QixVQUFPLENBQUMsTUFBTSxHQUFHLFlBQVc7QUFDMUIsU0FBSSxPQUFPLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtBQUMxQixjQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUNuQjs7QUFFRCxTQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyQyxhQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEIsQ0FBQztBQUNGLFVBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztFQUNoQixDOzs7Ozs7OztBQ2RELE9BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtBQUM5QyxPQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0FBQ3hCLFFBQUssQ0FBQyxNQUFNLEdBQUcsWUFBVztBQUN4QixhQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakIsQ0FBQztBQUNGLFFBQUssQ0FBQyxPQUFPLEdBQUcsWUFBVztBQUN6QixVQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWixDQUFDO0FBQ0YsUUFBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7RUFDakIsQzs7Ozs7Ozs7QUNURCxPQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7QUFDOUMsT0FBSSxPQUFPLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQzs7QUFFbkMsVUFBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQy9CLFVBQU8sQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDO0FBQzlCLFVBQU8sQ0FBQyxNQUFNLEdBQUcsWUFBVztBQUMxQixTQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFO0FBQzFCLGNBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ25COztBQUVELFNBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDekIsYUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hCLENBQUM7QUFDRixVQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7RUFDaEIsQzs7Ozs7O0FDZEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixzQkFBc0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0gsd0JBQXVCLFNBQVM7QUFDaEM7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLE9BQU87QUFDbEIsWUFBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNkNBQTRDLEtBQUs7O0FBRWpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxvQ0FBbUMsT0FBTztBQUMxQztBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsMERBQXlEO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYLFVBQVM7QUFDVDtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7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O0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxJQUFHO0FBQ0g7O0FBRUE7Ozs7Ozs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEU7Ozs7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQSxFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDdEJBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7OztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG4gXHR2YXIgcGFyZW50SnNvbnBGdW5jdGlvbiA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXTtcbiBcdHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSA9IGZ1bmN0aW9uIHdlYnBhY2tKc29ucENhbGxiYWNrKGNodW5rSWRzLCBtb3JlTW9kdWxlcykge1xuIFx0XHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcbiBcdFx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG4gXHRcdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDAsIGNhbGxiYWNrcyA9IFtdO1xuIFx0XHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbiBcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pXG4gXHRcdFx0XHRjYWxsYmFja3MucHVzaC5hcHBseShjYWxsYmFja3MsIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSk7XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbiBcdFx0fVxuIFx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0fVxuIFx0XHRpZihwYXJlbnRKc29ucEZ1bmN0aW9uKSBwYXJlbnRKc29ucEZ1bmN0aW9uKGNodW5rSWRzLCBtb3JlTW9kdWxlcyk7XG4gXHRcdHdoaWxlKGNhbGxiYWNrcy5sZW5ndGgpXG4gXHRcdFx0Y2FsbGJhY2tzLnNoaWZ0KCkuY2FsbChudWxsLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcbiBcdFx0aWYobW9yZU1vZHVsZXNbMF0pIHtcbiBcdFx0XHRpbnN0YWxsZWRNb2R1bGVzWzBdID0gMDtcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3NcbiBcdC8vIFwiMFwiIG1lYW5zIFwiYWxyZWFkeSBsb2FkZWRcIlxuIFx0Ly8gQXJyYXkgbWVhbnMgXCJsb2FkaW5nXCIsIGFycmF5IGNvbnRhaW5zIGNhbGxiYWNrc1xuIFx0dmFyIGluc3RhbGxlZENodW5rcyA9IHtcbiBcdFx0MTM6MFxuIFx0fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG4gXHQvLyBUaGlzIGZpbGUgY29udGFpbnMgb25seSB0aGUgZW50cnkgY2h1bmsuXG4gXHQvLyBUaGUgY2h1bmsgbG9hZGluZyBmdW5jdGlvbiBmb3IgYWRkaXRpb25hbCBjaHVua3NcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZSA9IGZ1bmN0aW9uIHJlcXVpcmVFbnN1cmUoY2h1bmtJZCwgY2FsbGJhY2spIHtcbiBcdFx0Ly8gXCIwXCIgaXMgdGhlIHNpZ25hbCBmb3IgXCJhbHJlYWR5IGxvYWRlZFwiXG4gXHRcdGlmKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMClcbiBcdFx0XHRyZXR1cm4gY2FsbGJhY2suY2FsbChudWxsLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBhbiBhcnJheSBtZWFucyBcImN1cnJlbnRseSBsb2FkaW5nXCIuXG4gXHRcdGlmKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSAhPT0gdW5kZWZpbmVkKSB7XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdLnB1c2goY2FsbGJhY2spO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdC8vIHN0YXJ0IGNodW5rIGxvYWRpbmdcbiBcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSBbY2FsbGJhY2tdO1xuIFx0XHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiBcdFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gXHRcdFx0c2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiBcdFx0XHRzY3JpcHQuY2hhcnNldCA9ICd1dGYtOCc7XG4gXHRcdFx0c2NyaXB0LmFzeW5jID0gdHJ1ZTtcbiBcdFx0XHRzY3JpcHQuc3JjID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGNodW5rSWQgKyBcIi5jaHVuay5qc1wiO1xuIFx0XHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvYnVpbGQvXCI7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgYzRhOTU4Zjc2MDYxNTc3ZjUzYWJcbiAqKi8iLCJ2YXIgRW5naW5lID0gcmVxdWlyZSgnLi9zcmMvZW5naW5lJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpbml0OiBmdW5jdGlvbihjYW52YXMsIG1ldGhvZHMpIHtcbiAgICB2YXIgZW5naW5lID0gbmV3IEVuZ2luZShjYW52YXMsIG1ldGhvZHMpO1xuICAgIHJldHVybiBlbmdpbmUuYXBwO1xuICB9XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9pbmRleC5qc1xuICoqLyIsInJlcXVpcmUoJy4vcmFmLXBvbHlmaWxsJykoKTtcblxudmFyIEFwcCA9IHJlcXVpcmUoJy4vYXBwJyk7XG5cbnZhciBUaW1lID0gcmVxdWlyZSgnLi90aW1lJyk7XG5cbnZhciBEZWJ1Z2dlciA9IHJlcXVpcmUoJ3BvdGlvbi1kZWJ1Z2dlcicpO1xuXG52YXIgU3RhdGVNYW5hZ2VyID0gcmVxdWlyZSgnLi9zdGF0ZS1tYW5hZ2VyJyk7XG5cbi8qKlxuICogTWFpbiBFbmdpbmUgY2xhc3Mgd2hpY2ggY2FsbHMgdGhlIGFwcCBtZXRob2RzXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIEVuZ2luZSA9IGZ1bmN0aW9uKGNvbnRhaW5lciwgbWV0aG9kcykge1xuICB2YXIgQXBwQ2xhc3MgPSB0aGlzLl9zdWJjbGFzc0FwcChjb250YWluZXIsIG1ldGhvZHMpO1xuXG4gIGNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG5cbiAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICBjYW52YXMuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjYW52YXMpO1xuXG4gIHRoaXMuYXBwID0gbmV3IEFwcENsYXNzKGNhbnZhcyk7XG4gIHRoaXMuYXBwLmRlYnVnID0gbmV3IERlYnVnZ2VyKHRoaXMuYXBwKTtcblxuICB0aGlzLl9zZXREZWZhdWx0U3RhdGVzKCk7XG5cbiAgdGhpcy50aWNrRnVuYyA9IChmdW5jdGlvbiAoc2VsZikgeyByZXR1cm4gZnVuY3Rpb24oKSB7IHNlbGYudGljaygpOyB9OyB9KSh0aGlzKTtcbiAgdGhpcy5wcmVsb2FkZXJUaWNrRnVuYyA9IChmdW5jdGlvbiAoc2VsZikgeyByZXR1cm4gZnVuY3Rpb24oKSB7IHNlbGYuX3ByZWxvYWRlclRpY2soKTsgfTsgfSkodGhpcyk7XG5cbiAgdGhpcy5zdHJheVRpbWUgPSAwO1xuXG4gIHRoaXMuX3RpbWUgPSBUaW1lLm5vdygpO1xuXG4gIHRoaXMuYXBwLmFzc2V0cy5vbmxvYWQoZnVuY3Rpb24oKSB7XG4gICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMucHJlbG9hZGVySWQpO1xuICAgIHRoaXMuYXBwLl9wcmVsb2FkZXIuZXhpdCgpO1xuXG4gICAgdGhpcy5zdGFydCgpO1xuICB9LmJpbmQodGhpcykpO1xuXG4gIGlmICh0aGlzLmFwcC5hc3NldHMuaXNMb2FkaW5nICYmIHRoaXMuYXBwLmNvbmZpZy5zaG93UHJlbG9hZGVyKSB7XG4gICAgdGhpcy5wcmVsb2FkZXJJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5wcmVsb2FkZXJUaWNrRnVuYyk7XG4gIH1cbn07XG5cbi8qKlxuICogQWRkIGV2ZW50IGxpc3RlbmVyIGZvciB3aW5kb3cgZXZlbnRzXG4gKiBAcHJpdmF0ZVxuICovXG5FbmdpbmUucHJvdG90eXBlLmFkZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbigpIHtcbiAgICBzZWxmLmFwcC5pbnB1dC5yZXNldEtleXMoKTtcbiAgICBzZWxmLmFwcC5ibHVyKCk7XG4gIH0pO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGZ1bmN0aW9uKCkge1xuICAgIHNlbGYuYXBwLmlucHV0LnJlc2V0S2V5cygpO1xuICAgIHNlbGYuYXBwLmZvY3VzKCk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBTdGFydHMgdGhlIGFwcCwgYWRkcyBldmVudHMgYW5kIHJ1biBmaXJzdCBmcmFtZVxuICogQHByaXZhdGVcbiAqL1xuRW5naW5lLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5hcHAuY29uZmlnLmFkZElucHV0RXZlbnRzKSB7XG4gICAgdGhpcy5hZGRFdmVudHMoKTtcbiAgfVxuXG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrRnVuYyk7XG59O1xuXG4vKipcbiAqIE1haW4gdGljayBmdW5jdGlvbiBpbiBhcHAgbG9vcFxuICogQHByaXZhdGVcbiAqL1xuRW5naW5lLnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24oKSB7XG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrRnVuYyk7XG5cbiAgdGhpcy5hcHAuZGVidWcuYmVnaW4oKTtcblxuICB2YXIgbm93ID0gVGltZS5ub3coKTtcbiAgdmFyIHRpbWUgPSAobm93IC0gdGhpcy5fdGltZSkgLyAxMDAwO1xuICB0aGlzLl90aW1lID0gbm93O1xuXG4gIHRoaXMuYXBwLmRlYnVnLnBlcmYoJ3VwZGF0ZScpO1xuICB0aGlzLnVwZGF0ZSh0aW1lKTtcbiAgdGhpcy5hcHAuZGVidWcuc3RvcFBlcmYoJ3VwZGF0ZScpO1xuXG4gIHRoaXMuYXBwLnN0YXRlcy5leGl0VXBkYXRlKHRpbWUpO1xuXG4gIHRoaXMuYXBwLmRlYnVnLnBlcmYoJ3JlbmRlcicpO1xuICB0aGlzLnJlbmRlcigpO1xuICB0aGlzLmFwcC5kZWJ1Zy5zdG9wUGVyZigncmVuZGVyJyk7XG5cbiAgdGhpcy5hcHAuZGVidWcucmVuZGVyKCk7XG5cbiAgdGhpcy5hcHAuZGVidWcuZW5kKCk7XG59O1xuXG4vKipcbiAqIFVwZGF0ZXMgdGhlIGFwcFxuICogQHBhcmFtIHtudW1iZXJ9IHRpbWUgLSB0aW1lIGluIHNlY29uZHMgc2luY2UgbGFzdCBmcmFtZVxuICogQHByaXZhdGVcbiAqL1xuRW5naW5lLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbih0aW1lKSB7XG4gIGlmICh0aW1lID4gdGhpcy5hcHAuY29uZmlnLm1heFN0ZXBUaW1lKSB7IHRpbWUgPSB0aGlzLmFwcC5jb25maWcubWF4U3RlcFRpbWU7IH1cblxuICBpZiAodGhpcy5hcHAuY29uZmlnLmZpeGVkU3RlcCkge1xuICAgIHRoaXMuc3RyYXlUaW1lID0gdGhpcy5zdHJheVRpbWUgKyB0aW1lO1xuICAgIHdoaWxlICh0aGlzLnN0cmF5VGltZSA+PSB0aGlzLmFwcC5jb25maWcuc3RlcFRpbWUpIHtcbiAgICAgIHRoaXMuc3RyYXlUaW1lID0gdGhpcy5zdHJheVRpbWUgLSB0aGlzLmFwcC5jb25maWcuc3RlcFRpbWU7XG4gICAgICB0aGlzLmFwcC5zdGF0ZXMudXBkYXRlKHRoaXMuYXBwLmNvbmZpZy5zdGVwVGltZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuYXBwLnN0YXRlcy51cGRhdGUodGltZSk7XG4gIH1cbn07XG5cbi8qKlxuICogUmVuZGVycyB0aGUgYXBwXG4gKiBAcHJpdmF0ZVxuICovXG5FbmdpbmUucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmFwcC52aWRlby5iZWdpbkZyYW1lKCk7XG5cbiAgdGhpcy5hcHAudmlkZW8uY2xlYXIoKTtcblxuICB0aGlzLmFwcC5zdGF0ZXMucmVuZGVyKCk7XG5cbiAgdGhpcy5hcHAudmlkZW8uZW5kRnJhbWUoKTtcbn07XG5cbi8qKlxuICogTWFpbiB0aWNrIGZ1bmN0aW9uIGluIHByZWxvYWRlciBsb29wXG4gKiBAcHJpdmF0ZVxuICovXG5FbmdpbmUucHJvdG90eXBlLl9wcmVsb2FkZXJUaWNrID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucHJlbG9hZGVySWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucHJlbG9hZGVyVGlja0Z1bmMpO1xuXG4gIHZhciBub3cgPSBUaW1lLm5vdygpO1xuICB2YXIgdGltZSA9IChub3cgLSB0aGlzLl90aW1lKSAvIDEwMDA7XG4gIHRoaXMuX3RpbWUgPSBub3c7XG5cbiAgdGhpcy5hcHAucHJlbG9hZGluZyh0aW1lKTtcbn07XG5cbkVuZ2luZS5wcm90b3R5cGUuX3NldERlZmF1bHRTdGF0ZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHN0YXRlcyA9IG5ldyBTdGF0ZU1hbmFnZXIoKTtcbiAgc3RhdGVzLmFkZCgnYXBwJywgdGhpcy5hcHApO1xuICBzdGF0ZXMuYWRkKCdkZWJ1ZycsIHRoaXMuYXBwLmRlYnVnKTtcblxuICBzdGF0ZXMucHJvdGVjdCgnYXBwJyk7XG4gIHN0YXRlcy5wcm90ZWN0KCdkZWJ1ZycpO1xuICBzdGF0ZXMuaGlkZSgnZGVidWcnKTtcblxuICB0aGlzLmFwcC5zdGF0ZXMgPSBzdGF0ZXM7XG59O1xuXG5FbmdpbmUucHJvdG90eXBlLl9zdWJjbGFzc0FwcCA9IGZ1bmN0aW9uKGNvbnRhaW5lciwgbWV0aG9kcykge1xuICB2YXIgQXBwQ2xhc3MgPSBmdW5jdGlvbihjb250YWluZXIpIHtcbiAgICBBcHAuY2FsbCh0aGlzLCBjb250YWluZXIpO1xuICB9O1xuXG4gIEFwcENsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQXBwLnByb3RvdHlwZSk7XG5cbiAgZm9yICh2YXIgbWV0aG9kIGluIG1ldGhvZHMpIHtcbiAgICBBcHBDbGFzcy5wcm90b3R5cGVbbWV0aG9kXSA9IG1ldGhvZHNbbWV0aG9kXTtcbiAgfVxuXG4gIHJldHVybiBBcHBDbGFzcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRW5naW5lO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW5naW5lLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGxhc3RUaW1lID0gMDtcbiAgdmFyIHZlbmRvcnMgPSBbJ21zJywgJ21veicsICd3ZWJraXQnLCAnbyddO1xuXG4gIGZvciAodmFyIGk9MDsgaTx2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKytpKSB7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW2ldKydSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1tpXSsnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSB8fCB3aW5kb3dbdmVuZG9yc1tpXSsnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gIH1cblxuICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XG5cbiAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBjYWxsYmFjayhjdXJyVGltZSArIHRpbWVUb0NhbGwpO1xuICAgICAgfSwgdGltZVRvQ2FsbCk7XG5cbiAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgcmV0dXJuIGlkO1xuICAgIH07XG4gIH1cblxuICBpZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSkge1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGlkKSB7IGNsZWFyVGltZW91dChpZCk7IH07XG4gIH1cbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yYWYtcG9seWZpbGwuanNcbiAqKi8iLCJ2YXIgVmlkZW8gPSByZXF1aXJlKCcuL3ZpZGVvJyk7XG52YXIgQXNzZXRzID0gcmVxdWlyZSgnLi9hc3NldHMnKTtcbnZhciBJbnB1dCA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbnZhciBMb2FkaW5nID0gcmVxdWlyZSgnLi9sb2FkaW5nJyk7XG5cbnZhciBBcHAgPSBmdW5jdGlvbihjYW52YXMpIHtcbiAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG5cbiAgdGhpcy53aWR0aCA9IDMwMDtcblxuICB0aGlzLmhlaWdodCA9IDMwMDtcblxuICB0aGlzLmFzc2V0cyA9IG5ldyBBc3NldHMoKTtcblxuICB0aGlzLnN0YXRlcyA9IG51bGw7XG4gIHRoaXMuZGVidWcgPSBudWxsO1xuICB0aGlzLmlucHV0ID0gbnVsbDtcbiAgdGhpcy52aWRlbyA9IG51bGw7XG5cbiAgdGhpcy5jb25maWcgPSB7XG4gICAgYWxsb3dIaURQSTogdHJ1ZSxcbiAgICBnZXRDYW52YXNDb250ZXh0OiB0cnVlLFxuICAgIGluaXRpYWxpemVWaWRlbzogdHJ1ZSxcbiAgICBhZGRJbnB1dEV2ZW50czogdHJ1ZSxcbiAgICBzaG93UHJlbG9hZGVyOiB0cnVlLFxuICAgIGZpeGVkU3RlcDogZmFsc2UsXG4gICAgc3RlcFRpbWU6IDAuMDE2NjYsXG4gICAgbWF4U3RlcFRpbWU6IDAuMDE2NjZcbiAgfTtcblxuICB0aGlzLmNvbmZpZ3VyZSgpO1xuXG4gIGlmICh0aGlzLmNvbmZpZy5pbml0aWFsaXplVmlkZW8pIHtcbiAgICB0aGlzLnZpZGVvID0gbmV3IFZpZGVvKHRoaXMsIGNhbnZhcywgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgaWYgKHRoaXMuY29uZmlnLmFkZElucHV0RXZlbnRzKSB7XG4gICAgdGhpcy5pbnB1dCA9IG5ldyBJbnB1dCh0aGlzLCBjYW52YXMucGFyZW50RWxlbWVudCk7XG4gIH1cblxuICB0aGlzLl9wcmVsb2FkZXIgPSBuZXcgTG9hZGluZyh0aGlzKTtcbn07XG5cbkFwcC5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcbiAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICB0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuICBpZiAodGhpcy52aWRlbykge1xuICAgIHRoaXMudmlkZW8uc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgfVxufTtcblxuQXBwLnByb3RvdHlwZS5wcmVsb2FkaW5nID0gZnVuY3Rpb24odGltZSkge1xuICBpZiAodGhpcy5jb25maWcuc2hvd1ByZWxvYWRlcikge1xuICAgIHRoaXMuX3ByZWxvYWRlci5yZW5kZXIodGltZSk7XG4gIH1cbn07XG5cbkFwcC5wcm90b3R5cGUuY29uZmlndXJlID0gZnVuY3Rpb24oKSB7fTtcblxuQXBwLnByb3RvdHlwZS5mb2N1cyA9IGZ1bmN0aW9uKCkge307XG5cbkFwcC5wcm90b3R5cGUuYmx1ciA9IGZ1bmN0aW9uKCkge307XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvYXBwLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiB3aW5kb3cucGVyZm9ybWFuY2UgfHwgRGF0ZTtcbn0pKCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy90aW1lLmpzXG4gKiovIiwidmFyIHJlbmRlck9yZGVyU29ydCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIGEucmVuZGVyT3JkZXIgPCBiLnJlbmRlck9yZGVyO1xufTtcblxudmFyIHVwZGF0ZU9yZGVyU29ydCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIGEudXBkYXRlT3JkZXIgPCBiLnVwZGF0ZU9yZGVyO1xufTtcblxudmFyIFN0YXRlTWFuYWdlciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnN0YXRlcyA9IHt9O1xuICB0aGlzLnJlbmRlck9yZGVyID0gW107XG4gIHRoaXMudXBkYXRlT3JkZXIgPSBbXTtcblxuICB0aGlzLl9wcmV2ZW50RXZlbnQgPSBmYWxzZTtcbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24obmFtZSwgc3RhdGUpIHtcbiAgdGhpcy5zdGF0ZXNbbmFtZV0gPSB0aGlzLl9uZXdTdGF0ZUhvbGRlcihuYW1lLCBzdGF0ZSk7XG4gIHRoaXMucmVmcmVzaE9yZGVyKCk7XG4gIHJldHVybiBzdGF0ZTtcbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuZW5hYmxlID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBpZiAoIWhvbGRlci5lbmFibGVkKSB7XG4gICAgICBpZiAoaG9sZGVyLnN0YXRlLmVuYWJsZSkge1xuICAgICAgICBob2xkZXIuc3RhdGUuZW5hYmxlKCk7XG4gICAgICB9XG4gICAgICBob2xkZXIuZW5hYmxlZCA9IHRydWU7XG4gICAgICBob2xkZXIuY2hhbmdlZCA9IHRydWU7XG5cbiAgICAgIGlmIChob2xkZXIucGF1c2VkKSB7XG4gICAgICAgIHRoaXMudW5wYXVzZShuYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaWYgKGhvbGRlci5lbmFibGVkKSB7XG4gICAgICBpZiAoaG9sZGVyLnN0YXRlLmRpc2FibGUpIHtcbiAgICAgICAgaG9sZGVyLnN0YXRlLmRpc2FibGUoKTtcbiAgICAgIH1cbiAgICAgIGhvbGRlci5jaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIGhvbGRlci5lbmFibGVkID0gZmFsc2U7XG4gICAgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGlmIChob2xkZXIuZW5hYmxlZCkge1xuICAgICAgaG9sZGVyLmNoYW5nZWQgPSB0cnVlO1xuICAgICAgaG9sZGVyLnJlbmRlciA9IGZhbHNlO1xuICAgIH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBpZiAoaG9sZGVyLmVuYWJsZWQpIHtcbiAgICAgIGhvbGRlci5jaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIGhvbGRlci5yZW5kZXIgPSB0cnVlO1xuICAgIH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGhvbGRlciA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoaG9sZGVyKSB7XG4gICAgaWYgKGhvbGRlci5zdGF0ZS5wYXVzZSkge1xuICAgICAgaG9sZGVyLnN0YXRlLnBhdXNlKCk7XG4gICAgfVxuXG4gICAgaG9sZGVyLmNoYW5nZWQgPSB0cnVlO1xuICAgIGhvbGRlci5wYXVzZWQgPSB0cnVlO1xuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnVucGF1c2UgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGlmIChob2xkZXIuc3RhdGUudW5wYXVzZSkge1xuICAgICAgaG9sZGVyLnN0YXRlLnVucGF1c2UoKTtcbiAgICB9XG5cbiAgICBob2xkZXIuY2hhbmdlZCA9IHRydWU7XG4gICAgaG9sZGVyLnBhdXNlZCA9IGZhbHNlO1xuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnByb3RlY3QgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGhvbGRlci5wcm90ZWN0ID0gdHJ1ZTtcbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS51bnByb3RlY3QgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGhvbGRlci5wcm90ZWN0ID0gZmFsc2U7XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUucmVmcmVzaE9yZGVyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucmVuZGVyT3JkZXIubGVuZ3RoID0gMDtcbiAgdGhpcy51cGRhdGVPcmRlci5sZW5ndGggPSAwO1xuXG4gIGZvciAodmFyIG5hbWUgaW4gdGhpcy5zdGF0ZXMpIHtcbiAgICB2YXIgaG9sZGVyID0gdGhpcy5zdGF0ZXNbbmFtZV07XG4gICAgaWYgKGhvbGRlcikge1xuICAgICAgdGhpcy5yZW5kZXJPcmRlci5wdXNoKGhvbGRlcik7XG4gICAgICB0aGlzLnVwZGF0ZU9yZGVyLnB1c2goaG9sZGVyKTtcbiAgICB9XG4gIH1cblxuICB0aGlzLnJlbmRlck9yZGVyLnNvcnQocmVuZGVyT3JkZXJTb3J0KTtcbiAgdGhpcy51cGRhdGVPcmRlci5zb3J0KHVwZGF0ZU9yZGVyU29ydCk7XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLl9uZXdTdGF0ZUhvbGRlciA9IGZ1bmN0aW9uKG5hbWUsIHN0YXRlKSB7XG4gIHZhciBob2xkZXIgPSB7fTtcbiAgaG9sZGVyLm5hbWUgPSBuYW1lO1xuICBob2xkZXIuc3RhdGUgPSBzdGF0ZTtcblxuICBob2xkZXIucHJvdGVjdCA9IGZhbHNlO1xuXG4gIGhvbGRlci5lbmFibGVkID0gdHJ1ZTtcbiAgaG9sZGVyLnBhdXNlZCA9IGZhbHNlO1xuXG4gIGhvbGRlci5yZW5kZXIgPSB0cnVlO1xuXG4gIGhvbGRlci5pbml0aWFsaXplZCA9IGZhbHNlO1xuICBob2xkZXIudXBkYXRlZCA9IGZhbHNlO1xuICBob2xkZXIuY2hhbmdlZCA9IHRydWU7XG5cbiAgaG9sZGVyLnVwZGF0ZU9yZGVyID0gMDtcbiAgaG9sZGVyLnJlbmRlck9yZGVyID0gMDtcblxuICByZXR1cm4gaG9sZGVyO1xufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5zZXRVcGRhdGVPcmRlciA9IGZ1bmN0aW9uKG5hbWUsIG9yZGVyKSB7XG4gIHZhciBob2xkZXIgPSB0aGlzLmdldChuYW1lKTtcbiAgaWYgKGhvbGRlcikge1xuICAgIGhvbGRlci51cGRhdGVPcmRlciA9IG9yZGVyO1xuICAgIHRoaXMucmVmcmVzaE9yZGVyKCk7XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuc2V0UmVuZGVyT3JkZXIgPSBmdW5jdGlvbihuYW1lLCBvcmRlcikge1xuICB2YXIgaG9sZGVyID0gdGhpcy5nZXQobmFtZSk7XG4gIGlmIChob2xkZXIpIHtcbiAgICBob2xkZXIucmVuZGVyT3JkZXIgPSBvcmRlcjtcbiAgICB0aGlzLnJlZnJlc2hPcmRlcigpO1xuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuZ2V0KG5hbWUpO1xuICBpZiAoc3RhdGUgJiYgIXN0YXRlLnByb3RlY3QpIHtcbiAgICBpZiAoc3RhdGUuc3RhdGUuY2xvc2UpIHtcbiAgICAgIHN0YXRlLnN0YXRlLmNsb3NlKCk7XG4gICAgfVxuICAgIGRlbGV0ZSB0aGlzLnN0YXRlc1tuYW1lXTtcbiAgICB0aGlzLnJlZnJlc2hPcmRlcigpO1xuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLmRlc3Ryb3lBbGwgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy51cGRhdGVPcmRlci5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnVwZGF0ZU9yZGVyW2ldO1xuICAgIGlmICghc3RhdGUucHJvdGVjdCkge1xuICAgICAgaWYgKHN0YXRlLnN0YXRlLmNsb3NlKSB7XG4gICAgICAgIHN0YXRlLnN0YXRlLmNsb3NlKCk7XG4gICAgICB9XG4gICAgICBkZWxldGUgdGhpcy5zdGF0ZXNbc3RhdGUubmFtZV07XG4gICAgfVxuICB9XG5cbiAgdGhpcy5yZWZyZXNoT3JkZXIoKTtcbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSkge1xuICByZXR1cm4gdGhpcy5zdGF0ZXNbbmFtZV07XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy51cGRhdGVPcmRlci5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnVwZGF0ZU9yZGVyW2ldO1xuXG4gICAgaWYgKHN0YXRlKSB7XG4gICAgICBzdGF0ZS5jaGFuZ2VkID0gZmFsc2U7XG5cbiAgICAgIGlmIChzdGF0ZS5lbmFibGVkKSB7XG4gICAgICAgIGlmICghc3RhdGUuaW5pdGlhbGl6ZWQgJiYgc3RhdGUuc3RhdGUuaW5pdCkge1xuICAgICAgICAgIHN0YXRlLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgICBzdGF0ZS5zdGF0ZS5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RhdGUuc3RhdGUudXBkYXRlICYmICFzdGF0ZS5wYXVzZWQpIHtcbiAgICAgICAgICBzdGF0ZS5zdGF0ZS51cGRhdGUodGltZSk7XG4gICAgICAgICAgc3RhdGUudXBkYXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUuZXhpdFVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy51cGRhdGVPcmRlci5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnVwZGF0ZU9yZGVyW2ldO1xuXG4gICAgaWYgKHN0YXRlICYmIHN0YXRlLmVuYWJsZWQgJiYgc3RhdGUuc3RhdGUuZXhpdFVwZGF0ZSAmJiAhc3RhdGUucGF1c2VkKSB7XG4gICAgICBzdGF0ZS5zdGF0ZS5leGl0VXBkYXRlKHRpbWUpO1xuICAgIH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy5yZW5kZXJPcmRlci5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnJlbmRlck9yZGVyW2ldO1xuICAgIGlmIChzdGF0ZSAmJiBzdGF0ZS5lbmFibGVkICYmIChzdGF0ZS51cGRhdGVkIHx8ICFzdGF0ZS5zdGF0ZS51cGRhdGUpICYmIHN0YXRlLnJlbmRlciAmJiBzdGF0ZS5zdGF0ZS5yZW5kZXIpIHtcbiAgICAgIHN0YXRlLnN0YXRlLnJlbmRlcigpO1xuICAgIH1cbiAgfVxufTtcblN0YXRlTWFuYWdlci5wcm90b3R5cGUubW91c2Vtb3ZlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgdGhpcy5fcHJldmVudEV2ZW50ID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy51cGRhdGVPcmRlci5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnVwZGF0ZU9yZGVyW2ldO1xuICAgIGlmIChzdGF0ZSAmJiBzdGF0ZS5lbmFibGVkICYmICFzdGF0ZS5jaGFuZ2VkICYmIHN0YXRlLnN0YXRlLm1vdXNlbW92ZSAmJiAhc3RhdGUucGF1c2VkKSB7XG4gICAgICBzdGF0ZS5zdGF0ZS5tb3VzZW1vdmUodmFsdWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wcmV2ZW50RXZlbnQpIHsgYnJlYWs7IH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5tb3VzZXVwID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgdGhpcy5fcHJldmVudEV2ZW50ID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy51cGRhdGVPcmRlci5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnVwZGF0ZU9yZGVyW2ldO1xuICAgIGlmIChzdGF0ZSAmJiBzdGF0ZS5lbmFibGVkICYmICFzdGF0ZS5jaGFuZ2VkICYmIHN0YXRlLnN0YXRlLm1vdXNldXAgJiYgIXN0YXRlLnBhdXNlZCkge1xuICAgICAgc3RhdGUuc3RhdGUubW91c2V1cCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3ByZXZlbnRFdmVudCkgeyBicmVhazsgfVxuICB9XG59O1xuXG5TdGF0ZU1hbmFnZXIucHJvdG90eXBlLm1vdXNlZG93biA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHRoaXMuX3ByZXZlbnRFdmVudCA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMudXBkYXRlT3JkZXIubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy51cGRhdGVPcmRlcltpXTtcbiAgICBpZiAoc3RhdGUgJiYgc3RhdGUuZW5hYmxlZCAmJiAhc3RhdGUuY2hhbmdlZCAmJiBzdGF0ZS5zdGF0ZS5tb3VzZWRvd24gJiYgIXN0YXRlLnBhdXNlZCkge1xuICAgICAgc3RhdGUuc3RhdGUubW91c2Vkb3duKHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcHJldmVudEV2ZW50KSB7IGJyZWFrOyB9XG4gIH1cbn07XG5cblN0YXRlTWFuYWdlci5wcm90b3R5cGUua2V5dXAgPSBmdW5jdGlvbih2YWx1ZSkge1xuICB0aGlzLl9wcmV2ZW50RXZlbnQgPSBmYWxzZTtcblxuICBmb3IgKHZhciBpPTAsIGxlbj10aGlzLnVwZGF0ZU9yZGVyLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMudXBkYXRlT3JkZXJbaV07XG4gICAgaWYgKHN0YXRlICYmIHN0YXRlLmVuYWJsZWQgJiYgIXN0YXRlLmNoYW5nZWQgJiYgc3RhdGUuc3RhdGUua2V5dXAgJiYgIXN0YXRlLnBhdXNlZCkge1xuICAgICAgc3RhdGUuc3RhdGUua2V5dXAodmFsdWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wcmV2ZW50RXZlbnQpIHsgYnJlYWs7IH1cbiAgfVxufTtcblxuU3RhdGVNYW5hZ2VyLnByb3RvdHlwZS5rZXlkb3duID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgdGhpcy5fcHJldmVudEV2ZW50ID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy51cGRhdGVPcmRlci5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnVwZGF0ZU9yZGVyW2ldO1xuICAgIGlmIChzdGF0ZSAmJiBzdGF0ZS5lbmFibGVkICYmICFzdGF0ZS5jaGFuZ2VkICYmIHN0YXRlLnN0YXRlLmtleWRvd24gJiYgIXN0YXRlLnBhdXNlZCkge1xuICAgICAgc3RhdGUuc3RhdGUua2V5ZG93bih2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3ByZXZlbnRFdmVudCkgeyBicmVhazsgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YXRlTWFuYWdlcjtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3N0YXRlLW1hbmFnZXIuanNcbiAqKi8iLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciBEaXJ0eU1hbmFnZXIgPSByZXF1aXJlKCcuL2RpcnR5LW1hbmFnZXInKTtcblxudmFyIE9iamVjdFBvb2wgPSBbXTtcblxudmFyIEdldE9iamVjdEZyb21Qb29sID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXN1bHQgPSBPYmplY3RQb29sLnBvcCgpO1xuXG4gIGlmIChyZXN1bHQpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcmV0dXJuIHt9O1xufTtcblxudmFyIGluZGV4VG9OdW1iZXJBbmRMb3dlckNhc2VLZXkgPSBmdW5jdGlvbihpbmRleCkge1xuICBpZiAoaW5kZXggPD0gOSkge1xuICAgIHJldHVybiA0OCArIGluZGV4O1xuICB9IGVsc2UgaWYgKGluZGV4ID09PSAxMCkge1xuICAgIHJldHVybiA0ODtcbiAgfSBlbHNlIGlmIChpbmRleCA+IDEwICYmIGluZGV4IDw9IDM2KSB7XG4gICAgcmV0dXJuIDY0ICsgKGluZGV4LTEwKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufTtcblxudmFyIGRlZmF1bHRzID0gW1xuICB7IG5hbWU6ICdTaG93IEZQUycsIGVudHJ5OiAnc2hvd0ZwcycsIGRlZmF1bHRzOiB0cnVlIH0sXG4gIHsgbmFtZTogJ1Nob3cgS2V5IENvZGVzJywgZW50cnk6ICdzaG93S2V5Q29kZXMnLCBkZWZhdWx0czogdHJ1ZSB9XG5dO1xuXG52YXIgRGVidWdnZXIgPSBmdW5jdGlvbihhcHApIHtcbiAgdGhpcy52aWRlbyA9IGFwcC52aWRlby5jcmVhdGVMYXllcih7XG4gICAgYWxsb3dIaURQSTogdHJ1ZSxcbiAgICBnZXRDYW52YXNDb250ZXh0OiB0cnVlXG4gIH0pO1xuXG4gIHRoaXMuZ3JhcGggPSBhcHAudmlkZW8uY3JlYXRlTGF5ZXIoe1xuICAgIGFsbG93SGlEUEk6IGZhbHNlLFxuICAgIGdldENhbnZhc0NvbnRleHQ6IHRydWVcbiAgfSk7XG5cbiAgdGhpcy5fZ3JhcGhIZWlnaHQgPSAxMDA7XG4gIHRoaXMuXzYwZnBzTWFyayA9IHRoaXMuX2dyYXBoSGVpZ2h0ICogMC44O1xuICB0aGlzLl9tc1RvUHggPSB0aGlzLl82MGZwc01hcmsvMTYuNjY7XG5cbiAgdGhpcy5hcHAgPSBhcHA7XG5cbiAgdGhpcy5vcHRpb25zID0gZGVmYXVsdHM7XG4gIHRoaXMuX21heExvZ3NDb3VudHMgPSAxMDtcblxuICBmb3IgKHZhciBpPTA7IGk8dGhpcy5vcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG9wdGlvbiA9IHRoaXMub3B0aW9uc1tpXTtcbiAgICB0aGlzLl9pbml0T3B0aW9uKG9wdGlvbik7XG4gIH1cblxuICB0aGlzLmRpc2FibGVkID0gZmFsc2U7XG5cbiAgdGhpcy5mcHMgPSAwO1xuICB0aGlzLmZwc0NvdW50ID0gMDtcbiAgdGhpcy5mcHNFbGFwc2VkVGltZSA9IDA7XG4gIHRoaXMuZnBzVXBkYXRlSW50ZXJ2YWwgPSAwLjU7XG4gIHRoaXMuX2ZyYW1lUGVyZiA9IFtdO1xuXG4gIHRoaXMuX2ZvbnRTaXplID0gMDtcbiAgdGhpcy5fZGlydHlNYW5hZ2VyID0gbmV3IERpcnR5TWFuYWdlcih0aGlzLnZpZGVvLmNhbnZhcywgdGhpcy52aWRlby5jdHgpO1xuXG4gIHRoaXMubG9ncyA9IFtdO1xuXG4gIHRoaXMuX3BlcmZWYWx1ZXMgPSB7fTtcbiAgdGhpcy5fcGVyZk5hbWVzID0gW107XG5cbiAgdGhpcy5zaG93RGVidWcgPSBmYWxzZTtcbiAgdGhpcy5lbmFibGVEZWJ1Z0tleXMgPSB0cnVlO1xuICB0aGlzLmVuYWJsZVNob3J0Y3V0cyA9IGZhbHNlO1xuXG4gIHRoaXMuZW5hYmxlU2hvcnRjdXRzS2V5ID0gMjIwO1xuXG4gIHRoaXMubGFzdEtleSA9IG51bGw7XG5cbiAgdGhpcy5fbG9hZCgpO1xuXG4gIHRoaXMua2V5U2hvcnRjdXRzID0gW1xuICAgIHsga2V5OiAxMjMsIGVudHJ5OiAnc2hvd0RlYnVnJywgdHlwZTogJ3RvZ2dsZScgfVxuICBdO1xuXG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLmFkZENvbmZpZyh7IG5hbWU6ICdTaG93IFBlcmZvcm1hbmNlIEdyYXBoJywgZW50cnk6ICdzaG93R3JhcGgnLCBkZWZhdWx0czogZmFsc2UsIGNhbGw6IGZ1bmN0aW9uKCkgeyBzZWxmLmdyYXBoLmNsZWFyKCk7IH0gfSk7XG5cbiAgdGhpcy5fZGlmZiA9IDA7XG4gIHRoaXMuX2ZyYW1lU3RhcnQgPSAwO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLmJlZ2luID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLnNob3dEZWJ1Zykge1xuICAgIHRoaXMuX2ZyYW1lU3RhcnQgPSB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCk7XG4gIH1cbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuc2hvd0RlYnVnKSB7XG4gICAgdGhpcy5fZGlmZiA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSAtIHRoaXMuX2ZyYW1lU3RhcnQ7XG4gIH1cbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5fc2V0Rm9udCA9IGZ1bmN0aW9uKHB4LCBmb250KSB7XG4gIHRoaXMuX2ZvbnRTaXplID0gcHg7XG4gIHRoaXMudmlkZW8uY3R4LmZvbnQgPSBweCArICdweCAnICsgZm9udDtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy52aWRlby5zZXRTaXplKHRoaXMuYXBwLndpZHRoLCB0aGlzLmFwcC5oZWlnaHQpO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLmFkZENvbmZpZyA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICB0aGlzLm9wdGlvbnMucHVzaChvcHRpb24pO1xuICB0aGlzLl9pbml0T3B0aW9uKG9wdGlvbik7XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuX2luaXRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgb3B0aW9uLnR5cGUgPSBvcHRpb24udHlwZSB8fCAndG9nZ2xlJztcbiAgb3B0aW9uLmRlZmF1bHRzID0gb3B0aW9uLmRlZmF1bHRzID09IG51bGwgPyBmYWxzZSA6IG9wdGlvbi5kZWZhdWx0cztcblxuICBpZiAob3B0aW9uLnR5cGUgPT09ICd0b2dnbGUnKSB7XG4gICAgdGhpc1tvcHRpb24uZW50cnldID0gb3B0aW9uLmRlZmF1bHRzO1xuICB9XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5sb2dzLmxlbmd0aCA9IDA7XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUubG9nID0gZnVuY3Rpb24obWVzc2FnZSwgY29sb3IpIHtcbiAgY29sb3IgPSBjb2xvciB8fCAnd2hpdGUnO1xuICBtZXNzYWdlID0gdHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnID8gbWVzc2FnZSA6IHV0aWwuaW5zcGVjdChtZXNzYWdlKTtcblxuICB2YXIgbWVzc2FnZXMgPSBtZXNzYWdlLnJlcGxhY2UoL1xcXFwnL2csIFwiJ1wiKS5zcGxpdCgnXFxuJyk7XG5cbiAgZm9yICh2YXIgaT0wOyBpPG1lc3NhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG1zZyA9IG1lc3NhZ2VzW2ldO1xuICAgIGlmICh0aGlzLmxvZ3MubGVuZ3RoID49IHRoaXMuX21heExvZ3NDb3VudHMpIHtcbiAgICAgIE9iamVjdFBvb2wucHVzaCh0aGlzLmxvZ3Muc2hpZnQoKSk7XG4gICAgfVxuXG4gICAgdmFyIG1lc3NhZ2VPYmplY3QgPSBHZXRPYmplY3RGcm9tUG9vbCgpO1xuICAgIG1lc3NhZ2VPYmplY3QudGV4dCA9IG1zZztcbiAgICBtZXNzYWdlT2JqZWN0LmxpZmUgPSAxMDtcbiAgICBtZXNzYWdlT2JqZWN0LmNvbG9yID0gY29sb3I7XG5cbiAgICB0aGlzLmxvZ3MucHVzaChtZXNzYWdlT2JqZWN0KTtcbiAgfVxufTtcblxuRGVidWdnZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge307XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5leGl0VXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xuICBpZiAodGhpcy5kaXNhYmxlZCkgeyByZXR1cm47IH1cblxuICBpZiAodGhpcy5zaG93RGVidWcpIHtcbiAgICB0aGlzLl9tYXhMb2dzQ291bnRzID0gTWF0aC5jZWlsKCh0aGlzLmFwcC5oZWlnaHQgKyAyMCkvMjApO1xuICAgIHRoaXMuZnBzQ291bnQgKz0gMTtcbiAgICB0aGlzLmZwc0VsYXBzZWRUaW1lICs9IHRpbWU7XG5cbiAgICBpZiAodGhpcy5mcHNFbGFwc2VkVGltZSA+IHRoaXMuZnBzVXBkYXRlSW50ZXJ2YWwpIHtcbiAgICAgIHZhciBmcHMgPSB0aGlzLmZwc0NvdW50L3RoaXMuZnBzRWxhcHNlZFRpbWU7XG5cbiAgICAgIGlmICh0aGlzLnNob3dGcHMpIHtcbiAgICAgICAgdGhpcy5mcHMgPSB0aGlzLmZwcyAqICgxLTAuOCkgKyAwLjggKiBmcHM7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZnBzQ291bnQgPSAwO1xuICAgICAgdGhpcy5mcHNFbGFwc2VkVGltZSA9IDA7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaT0wLCBsZW49dGhpcy5sb2dzLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgICAgdmFyIGxvZyA9IHRoaXMubG9nc1tpXTtcbiAgICAgIGlmIChsb2cpIHtcbiAgICAgICAgbG9nLmxpZmUgLT0gdGltZTtcbiAgICAgICAgaWYgKGxvZy5saWZlIDw9IDApIHtcbiAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmxvZ3MuaW5kZXhPZihsb2cpO1xuICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7IHRoaXMubG9ncy5zcGxpY2UoaW5kZXgsIDEpOyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5rZXlkb3duID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKHRoaXMuZGlzYWJsZWQpIHsgcmV0dXJuOyB9XG5cbiAgdGhpcy5sYXN0S2V5ID0gdmFsdWUua2V5O1xuXG4gIHZhciBpO1xuXG4gIGlmICh0aGlzLmVuYWJsZURlYnVnS2V5cykge1xuICAgIGlmICh2YWx1ZS5rZXkgPT09IHRoaXMuZW5hYmxlU2hvcnRjdXRzS2V5KSB7XG4gICAgICB2YWx1ZS5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB0aGlzLmVuYWJsZVNob3J0Y3V0cyA9ICF0aGlzLmVuYWJsZVNob3J0Y3V0cztcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmVuYWJsZVNob3J0Y3V0cykge1xuICAgICAgZm9yIChpPTA7IGk8dGhpcy5vcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBvcHRpb24gPSB0aGlzLm9wdGlvbnNbaV07XG4gICAgICAgIHZhciBrZXlJbmRleCA9IGkgKyAxO1xuXG4gICAgICAgIGlmICh0aGlzLmFwcC5pbnB1dC5pc0tleURvd24oJ2N0cmwnKSkge1xuICAgICAgICAgIGtleUluZGV4IC09IDM2O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoYXJJZCA9IGluZGV4VG9OdW1iZXJBbmRMb3dlckNhc2VLZXkoa2V5SW5kZXgpO1xuXG4gICAgICAgIGlmIChjaGFySWQgJiYgdmFsdWUua2V5ID09PSBjaGFySWQpIHtcbiAgICAgICAgICB2YWx1ZS5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgaWYgKG9wdGlvbi50eXBlID09PSAndG9nZ2xlJykge1xuXG4gICAgICAgICAgICB0aGlzW29wdGlvbi5lbnRyeV0gPSAhdGhpc1tvcHRpb24uZW50cnldO1xuICAgICAgICAgICAgaWYgKG9wdGlvbi5jYWxsKSB7XG4gICAgICAgICAgICAgIG9wdGlvbi5jYWxsKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3NhdmUoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbi50eXBlID09PSAnY2FsbCcpIHtcbiAgICAgICAgICAgIG9wdGlvbi5lbnRyeSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yIChpPTA7IGk8dGhpcy5rZXlTaG9ydGN1dHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5U2hvcnRjdXQgPSB0aGlzLmtleVNob3J0Y3V0c1tpXTtcbiAgICBpZiAoa2V5U2hvcnRjdXQua2V5ID09PSB2YWx1ZS5rZXkpIHtcbiAgICAgIHZhbHVlLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGlmIChrZXlTaG9ydGN1dC50eXBlID09PSAndG9nZ2xlJykge1xuICAgICAgICB0aGlzW2tleVNob3J0Y3V0LmVudHJ5XSA9ICF0aGlzW2tleVNob3J0Y3V0LmVudHJ5XTtcbiAgICAgICAgdGhpcy5fc2F2ZSgpO1xuICAgICAgfSBlbHNlIGlmIChrZXlTaG9ydGN1dC50eXBlID09PSAnY2FsbCcpIHtcbiAgICAgICAgdGhpc1trZXlTaG9ydGN1dC5lbnRyeV0oKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLl9zYXZlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkYXRhID0ge1xuICAgIHNob3dEZWJ1ZzogdGhpcy5zaG93RGVidWcsXG4gICAgb3B0aW9uczoge31cbiAgfTtcblxuICBmb3IgKHZhciBpPTA7IGk8dGhpcy5vcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG9wdGlvbiA9IHRoaXMub3B0aW9uc1tpXTtcbiAgICB2YXIgdmFsdWUgPSB0aGlzW29wdGlvbi5lbnRyeV07XG4gICAgZGF0YS5vcHRpb25zW29wdGlvbi5lbnRyeV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHdpbmRvdy5sb2NhbFN0b3JhZ2UuX19wb3Rpb25EZWJ1ZyA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xufTtcblxuRGVidWdnZXIucHJvdG90eXBlLl9sb2FkID0gZnVuY3Rpb24oKSB7XG4gIGlmICh3aW5kb3cubG9jYWxTdG9yYWdlICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2UuX19wb3Rpb25EZWJ1Zykge1xuICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZSh3aW5kb3cubG9jYWxTdG9yYWdlLl9fcG90aW9uRGVidWcpO1xuICAgIHRoaXMuc2hvd0RlYnVnID0gZGF0YS5zaG93RGVidWc7XG5cbiAgICBmb3IgKHZhciBuYW1lIGluIGRhdGEub3B0aW9ucykge1xuICAgICAgdGhpc1tuYW1lXSA9IGRhdGEub3B0aW9uc1tuYW1lXTtcbiAgICB9XG4gIH1cbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuZGlzYWJsZWQpIHsgcmV0dXJuOyB9XG5cbiAgdGhpcy5fZGlydHlNYW5hZ2VyLmNsZWFyKCk7XG5cbiAgaWYgKHRoaXMuc2hvd0RlYnVnKSB7XG4gICAgdGhpcy52aWRlby5jdHguc2F2ZSgpO1xuICAgIHRoaXMuX3NldEZvbnQoMTUsICdzYW5zLXNlcmlmJyk7XG5cbiAgICB0aGlzLl9yZW5kZXJMb2dzKCk7XG4gICAgdGhpcy5fcmVuZGVyRGF0YSgpO1xuICAgIHRoaXMuX3JlbmRlclNob3J0Y3V0cygpO1xuXG4gICAgdGhpcy52aWRlby5jdHgucmVzdG9yZSgpO1xuXG4gICAgaWYgKHRoaXMuc2hvd0dyYXBoKSB7XG4gICAgICB0aGlzLmdyYXBoLmN0eC5kcmF3SW1hZ2UodGhpcy5ncmFwaC5jYW52YXMsIDAsIHRoaXMuYXBwLmhlaWdodCAtIHRoaXMuX2dyYXBoSGVpZ2h0LCB0aGlzLmFwcC53aWR0aCwgdGhpcy5fZ3JhcGhIZWlnaHQsIC0yLCB0aGlzLmFwcC5oZWlnaHQgLSB0aGlzLl9ncmFwaEhlaWdodCwgdGhpcy5hcHAud2lkdGgsIHRoaXMuX2dyYXBoSGVpZ2h0KTtcblxuICAgICAgdGhpcy5ncmFwaC5jdHguZmlsbFN0eWxlID0gJyNGMkYwRDgnO1xuICAgICAgdGhpcy5ncmFwaC5jdHguZmlsbFJlY3QodGhpcy5hcHAud2lkdGggLSAyLCB0aGlzLmFwcC5oZWlnaHQgLSB0aGlzLl9ncmFwaEhlaWdodCwgMiwgdGhpcy5fZ3JhcGhIZWlnaHQpO1xuXG4gICAgICB0aGlzLmdyYXBoLmN0eC5maWxsU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjUpJztcbiAgICAgIHRoaXMuZ3JhcGguY3R4LmZpbGxSZWN0KHRoaXMuYXBwLndpZHRoIC0gMiwgdGhpcy5hcHAuaGVpZ2h0IC0gdGhpcy5fNjBmcHNNYXJrLCAyLCAxKTtcblxuICAgICAgdmFyIGxhc3QgPSAwO1xuICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMuX2ZyYW1lUGVyZi5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX2ZyYW1lUGVyZltpXTtcbiAgICAgICAgdmFyIG5hbWUgPSB0aGlzLl9wZXJmTmFtZXNbaV07XG5cbiAgICAgICAgdGhpcy5fZHJhd0ZyYW1lTGluZShpdGVtLCBuYW1lLCBsYXN0KTtcblxuICAgICAgICBsYXN0ICs9IGl0ZW07XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2RyYXdGcmFtZUxpbmUodGhpcy5fZGlmZiAtIGxhc3QsICdsYWcnLCBsYXN0KTtcbiAgICAgIHRoaXMuX2ZyYW1lUGVyZi5sZW5ndGggPSAwO1xuICAgIH1cbiAgfVxufTtcblxuRGVidWdnZXIucHJvdG90eXBlLl9kcmF3RnJhbWVMaW5lID0gZnVuY3Rpb24odmFsdWUsIG5hbWUsIGxhc3QpIHtcbiAgdmFyIGJhY2tncm91bmQgPSAnYmxhY2snO1xuICBpZiAobmFtZSA9PT0gJ3VwZGF0ZScpIHtcbiAgICBiYWNrZ3JvdW5kID0gJyM2QkE1RjInO1xuICB9IGVsc2UgaWYgKG5hbWUgPT09ICdyZW5kZXInKSB7XG4gICAgYmFja2dyb3VuZCA9ICcjRjI3ODMwJztcbiAgfSBlbHNlIGlmIChuYW1lID09PSAnbGFnJykge1xuICAgIGJhY2tncm91bmQgPSAnIzkxZjY4Mic7XG4gIH1cbiAgdGhpcy5ncmFwaC5jdHguZmlsbFN0eWxlID0gYmFja2dyb3VuZDtcblxuICB2YXIgaGVpZ2h0ID0gKHZhbHVlICsgbGFzdCkgKiB0aGlzLl9tc1RvUHhcblxuICB2YXIgeCA9IHRoaXMuYXBwLndpZHRoIC0gMjtcbiAgdmFyIHkgPSB0aGlzLmFwcC5oZWlnaHQgLSBoZWlnaHQ7XG5cbiAgdGhpcy5ncmFwaC5jdHguZmlsbFJlY3QoeCwgeSwgMiwgaGVpZ2h0IC0gKGxhc3QgKiB0aGlzLl9tc1RvUHgpKTtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5fcmVuZGVyTG9ncyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnZpZGVvLmN0eC50ZXh0QWxpZ24gPSAnbGVmdCc7XG4gIHRoaXMudmlkZW8uY3R4LnRleHRCYXNlbGluZSA9ICdib3R0b20nO1xuXG4gIGZvciAodmFyIGk9MCwgbGVuPXRoaXMubG9ncy5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICB2YXIgbG9nID0gdGhpcy5sb2dzW2ldO1xuXG4gICAgdmFyIHkgPSAtMTAgKyB0aGlzLmFwcC5oZWlnaHQgKyAoaSAtIHRoaXMubG9ncy5sZW5ndGggKyAxKSAqIDIwO1xuICAgIHRoaXMuX3JlbmRlclRleHQobG9nLnRleHQsIDEwLCB5LCBsb2cuY29sb3IpO1xuICB9XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmRpc2FibGVkID0gdHJ1ZTtcbn07XG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5wZXJmID0gZnVuY3Rpb24obmFtZSkge1xuICBpZiAoIXRoaXMuc2hvd0RlYnVnKSB7IHJldHVybjsgfVxuXG4gIHZhciBleGlzdHMgPSB0aGlzLl9wZXJmVmFsdWVzW25hbWVdO1xuXG4gIGlmIChleGlzdHMgPT0gbnVsbCkge1xuICAgIHRoaXMuX3BlcmZOYW1lcy5wdXNoKG5hbWUpO1xuXG4gICAgdGhpcy5fcGVyZlZhbHVlc1tuYW1lXSA9IHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICB2YWx1ZTogMCxcbiAgICAgIHJlY29yZHM6IFtdXG4gICAgfTtcbiAgfVxuXG4gIHZhciB0aW1lID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xuXG4gIHZhciByZWNvcmQgPSB0aGlzLl9wZXJmVmFsdWVzW25hbWVdO1xuXG4gIHJlY29yZC52YWx1ZSA9IHRpbWU7XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuc3RvcFBlcmYgPSBmdW5jdGlvbihuYW1lKSB7XG4gIGlmICghdGhpcy5zaG93RGVidWcpIHsgcmV0dXJuOyB9XG5cbiAgdmFyIHJlY29yZCA9IHRoaXMuX3BlcmZWYWx1ZXNbbmFtZV07XG5cbiAgdmFyIHRpbWUgPSB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCk7XG4gIHZhciBkaWZmID0gdGltZSAtIHJlY29yZC52YWx1ZTtcblxuICByZWNvcmQucmVjb3Jkcy5wdXNoKGRpZmYpO1xuICBpZiAocmVjb3JkLnJlY29yZHMubGVuZ3RoID4gMTApIHtcbiAgICByZWNvcmQucmVjb3Jkcy5zaGlmdCgpO1xuICB9XG5cbiAgdmFyIHN1bSA9IDA7XG4gIGZvciAodmFyIGk9MDsgaTxyZWNvcmQucmVjb3Jkcy5sZW5ndGg7IGkrKykge1xuICAgIHN1bSArPSByZWNvcmQucmVjb3Jkc1tpXTtcbiAgfVxuXG4gIHZhciBhdmcgPSBzdW0vcmVjb3JkLnJlY29yZHMubGVuZ3RoO1xuXG4gIHJlY29yZC52YWx1ZSA9IGF2ZztcbiAgdGhpcy5fZnJhbWVQZXJmLnB1c2goZGlmZik7XG59O1xuXG5EZWJ1Z2dlci5wcm90b3R5cGUuX3JlbmRlckRhdGEgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy52aWRlby5jdHgudGV4dEFsaWduID0gJ3JpZ2h0JztcbiAgdGhpcy52aWRlby5jdHgudGV4dEJhc2VsaW5lID0gJ3RvcCc7XG5cbiAgdmFyIHggPSB0aGlzLmFwcC53aWR0aCAtIDE0O1xuICB2YXIgeSA9IDE0O1xuXG4gIGlmICh0aGlzLnNob3dGcHMpIHtcbiAgICB0aGlzLl9yZW5kZXJUZXh0KE1hdGgucm91bmQodGhpcy5mcHMpICsgJyBmcHMnLCB4LCB5KTtcbiAgfVxuXG4gIHkgKz0gMjQ7XG5cbiAgdGhpcy5fc2V0Rm9udCgxNSwgJ3NhbnMtc2VyaWYnKTtcblxuICBpZiAodGhpcy5zaG93S2V5Q29kZXMpIHtcbiAgICB2YXIgYnV0dG9uTmFtZSA9ICcnO1xuICAgIGlmICh0aGlzLmFwcC5pbnB1dC5tb3VzZS5pc0xlZnREb3duKSB7XG4gICAgICBidXR0b25OYW1lID0gJ2xlZnQnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hcHAuaW5wdXQubW91c2UuaXNSaWdodERvd24pIHtcbiAgICAgIGJ1dHRvbk5hbWUgPSAncmlnaHQnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hcHAuaW5wdXQubW91c2UuaXNNaWRkbGVEb3duKSB7XG4gICAgICBidXR0b25OYW1lID0gJ21pZGRsZSc7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVuZGVyVGV4dCgna2V5ICcgKyB0aGlzLmxhc3RLZXksIHgsIHksIHRoaXMuYXBwLmlucHV0LmlzS2V5RG93bih0aGlzLmxhc3RLZXkpID8gJyNlOWRjN2MnIDogJ3doaXRlJyk7XG4gICAgdGhpcy5fcmVuZGVyVGV4dCgnYnRuICcgKyBidXR0b25OYW1lLCB4IC0gNjAsIHksIHRoaXMuYXBwLmlucHV0Lm1vdXNlLmlzRG93biA/ICcjZTlkYzdjJyA6ICd3aGl0ZScpO1xuXG4gICAgZm9yICh2YXIgaT0wOyBpPHRoaXMuX3BlcmZOYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5hbWUgPSB0aGlzLl9wZXJmTmFtZXNbaV07XG4gICAgICB2YXIgdmFsdWUgPSB0aGlzLl9wZXJmVmFsdWVzW25hbWVdO1xuXG4gICAgICB5ICs9IDI0O1xuICAgICAgdGhpcy5fcmVuZGVyVGV4dChuYW1lICsgJzogJyArICB2YWx1ZS52YWx1ZS50b0ZpeGVkKDMpICsgJ21zJywgeCwgeSk7XG4gICAgfVxuICB9XG59O1xuXG5cbkRlYnVnZ2VyLnByb3RvdHlwZS5fcmVuZGVyU2hvcnRjdXRzID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmVuYWJsZVNob3J0Y3V0cykge1xuICAgIHZhciBoZWlnaHQgPSAyODtcblxuICAgIHRoaXMuX3NldEZvbnQoMjAsICdIZWx2ZXRpY2EgTmV1ZSwgc2Fucy1zZXJpZicpO1xuICAgIHRoaXMudmlkZW8uY3R4LnRleHRBbGlnbiA9ICdsZWZ0JztcbiAgICB0aGlzLnZpZGVvLmN0eC50ZXh0QmFzZWxpbmUgPSAndG9wJztcbiAgICB2YXIgbWF4UGVyQ29sbHVtbiA9IE1hdGguZmxvb3IoKHRoaXMuYXBwLmhlaWdodCAtIDE0KS9oZWlnaHQpO1xuXG4gICAgZm9yICh2YXIgaT0wOyBpPHRoaXMub3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG9wdGlvbiA9IHRoaXMub3B0aW9uc1tpXTtcbiAgICAgIHZhciB4ID0gMTQgKyBNYXRoLmZsb29yKGkvbWF4UGVyQ29sbHVtbikgKiAzMjA7XG4gICAgICB2YXIgeSA9IDE0ICsgaSVtYXhQZXJDb2xsdW1uICogaGVpZ2h0O1xuXG4gICAgICB2YXIga2V5SW5kZXggPSBpICsgMTtcbiAgICAgIHZhciBjaGFySWQgPSBpbmRleFRvTnVtYmVyQW5kTG93ZXJDYXNlS2V5KGtleUluZGV4KTtcblxuICAgICAgdmFyIGlzT24gPSB0aGlzW29wdGlvbi5lbnRyeV07XG5cbiAgICAgIHZhciBzaG9ydGN1dCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2hhcklkKTtcblxuICAgICAgaWYgKCFjaGFySWQpIHtcbiAgICAgICAgc2hvcnRjdXQgPSAnXisnICsgU3RyaW5nLmZyb21DaGFyQ29kZShpbmRleFRvTnVtYmVyQW5kTG93ZXJDYXNlS2V5KGtleUluZGV4IC0gMzYpKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRleHQgPSAnWycgKyBzaG9ydGN1dCArICddICcgKyBvcHRpb24ubmFtZTtcbiAgICAgIGlmIChvcHRpb24udHlwZSA9PT0gJ3RvZ2dsZScpIHtcbiAgICAgICAgdGV4dCArPSAnICgnICsgKGlzT24gPyAnT04nIDogJ09GRicpICsgJyknO1xuICAgICAgfSBlbHNlIGlmIChvcHRpb24udHlwZSA9PT0gJ2NhbGwnKSB7XG4gICAgICAgIHRleHQgKz0gJyAoQ0FMTCknO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29sb3IgPSAncmdiYSgyNTUsIDI1NSwgMjU1LCAxKSc7XG4gICAgICB2YXIgb3V0bGluZSA9ICdyZ2JhKDAsIDAsIDAsIDEpJztcblxuICAgICAgaWYgKCFpc09uKSB7XG4gICAgICAgIGNvbG9yID0gJ3JnYmEoMjU1LCAyNTUsIDI1NSwgLjcpJztcbiAgICAgICAgb3V0bGluZSA9ICdyZ2JhKDAsIDAsIDAsIC43KSc7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3JlbmRlclRleHQodGV4dCwgeCwgeSwgY29sb3IsIG91dGxpbmUpO1xuICAgIH1cbiAgfVxufTtcblxuRGVidWdnZXIucHJvdG90eXBlLl9yZW5kZXJUZXh0ID0gZnVuY3Rpb24odGV4dCwgeCwgeSwgY29sb3IsIG91dGxpbmUpIHtcbiAgY29sb3IgPSBjb2xvciB8fCAnd2hpdGUnO1xuICBvdXRsaW5lID0gb3V0bGluZSB8fCAnYmxhY2snO1xuICB0aGlzLnZpZGVvLmN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgdGhpcy52aWRlby5jdHgubGluZUpvaW4gPSAncm91bmQnO1xuICB0aGlzLnZpZGVvLmN0eC5zdHJva2VTdHlsZSA9IG91dGxpbmU7XG4gIHRoaXMudmlkZW8uY3R4LmxpbmVXaWR0aCA9IDM7XG4gIHRoaXMudmlkZW8uY3R4LnN0cm9rZVRleHQodGV4dCwgeCwgeSk7XG4gIHRoaXMudmlkZW8uY3R4LmZpbGxUZXh0KHRleHQsIHgsIHkpO1xuXG4gIHZhciB3aWR0aCA9IHRoaXMudmlkZW8uY3R4Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoO1xuXG4gIHZhciBkeCA9IHggLSA1O1xuICB2YXIgZHkgPSB5O1xuICB2YXIgZHdpZHRoID0gd2lkdGggKyAxMDtcbiAgdmFyIGRoZWlnaHQgPSB0aGlzLl9mb250U2l6ZSArIDEwO1xuXG4gIGlmICh0aGlzLnZpZGVvLmN0eC50ZXh0QWxpZ24gPT09ICdyaWdodCcpIHtcbiAgICBkeCA9IHggLSA1IC0gd2lkdGg7XG4gIH1cblxuICB0aGlzLl9kaXJ0eU1hbmFnZXIuYWRkUmVjdChkeCwgZHksIGR3aWR0aCwgZGhlaWdodCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERlYnVnZ2VyO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcG90aW9uLWRlYnVnZ2VyL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAxM1xuICoqLyIsInZhciBpc1JldGluYSA9IHJlcXVpcmUoJy4vcmV0aW5hJykoKTtcblxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR9IGNhbnZhcyAtIENhbnZhcyBET00gZWxlbWVudFxuICovXG52YXIgVmlkZW8gPSBmdW5jdGlvbihhcHAsIGNhbnZhcywgY29uZmlnKSB7XG4gIHRoaXMuYXBwID0gYXBwO1xuXG4gIHRoaXMuY29uZmlnID0gY29uZmlnO1xuXG4gIHRoaXMuY2FudmFzID0gY2FudmFzO1xuXG4gIHRoaXMud2lkdGggPSBhcHAud2lkdGg7XG5cbiAgdGhpcy5oZWlnaHQgPSBhcHAuaGVpZ2h0O1xuXG4gIGlmIChjb25maWcuZ2V0Q2FudmFzQ29udGV4dCkge1xuICAgIHRoaXMuY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gIH1cblxuICB0aGlzLl9hcHBseVNpemVUb0NhbnZhcygpO1xufTtcblxuLyoqXG4gKiBJbmNsdWRlcyBtaXhpbnMgaW50byBWaWRlbyBsaWJyYXJ5XG4gKiBAcGFyYW0ge29iamVjdH0gbWV0aG9kcyAtIG9iamVjdCBvZiBtZXRob2RzIHRoYXQgd2lsbCBpbmNsdWRlZCBpbiBWaWRlb1xuICovXG5WaWRlby5wcm90b3R5cGUuaW5jbHVkZSA9IGZ1bmN0aW9uKG1ldGhvZHMpIHtcbiAgZm9yICh2YXIgbWV0aG9kIGluIG1ldGhvZHMpIHtcbiAgICB0aGlzW21ldGhvZF0gPSBtZXRob2RzW21ldGhvZF07XG4gIH1cbn07XG5cblZpZGVvLnByb3RvdHlwZS5iZWdpbkZyYW1lID0gZnVuY3Rpb24oKSB7fTtcblxuVmlkZW8ucHJvdG90eXBlLmVuZEZyYW1lID0gZnVuY3Rpb24oKSB7fTtcblxuVmlkZW8ucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5jYW52YXMucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmNhbnZhcyk7XG59O1xuXG5WaWRlby5wcm90b3R5cGUuc2NhbGVDYW52YXMgPSBmdW5jdGlvbihzY2FsZSkge1xuICB0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9IHRoaXMuY2FudmFzLndpZHRoICsgJ3B4JztcbiAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0ICsgJ3B4JztcblxuICB0aGlzLmNhbnZhcy53aWR0aCAqPSBzY2FsZTtcbiAgdGhpcy5jYW52YXMuaGVpZ2h0ICo9IHNjYWxlO1xuXG4gIGlmICh0aGlzLmN0eCkge1xuICAgIHRoaXMuY3R4LnNjYWxlKHNjYWxlLCBzY2FsZSk7XG4gIH1cbn07XG5cblZpZGVvLnByb3RvdHlwZS5zZXRTaXplID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICB0aGlzLndpZHRoID0gd2lkdGg7XG4gIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gIHRoaXMuX2FwcGx5U2l6ZVRvQ2FudmFzKCk7XG59O1xuXG5WaWRlby5wcm90b3R5cGUuX2FwcGx5U2l6ZVRvQ2FudmFzID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcbiAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cbiAgdmFyIGNvbnRhaW5lciA9IHRoaXMuY2FudmFzLnBhcmVudEVsZW1lbnQ7XG4gIGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGggKyAncHgnO1xuICBjb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyAncHgnO1xuXG4gIGlmICh0aGlzLmNvbmZpZy5hbGxvd0hpRFBJICYmIGlzUmV0aW5hKSB7XG4gICAgdGhpcy5zY2FsZUNhbnZhcygyKTtcbiAgfVxufTtcblxuVmlkZW8ucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmN0eCkgeyB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpOyB9XG59O1xuXG5WaWRlby5wcm90b3R5cGUuY3JlYXRlTGF5ZXIgPSBmdW5jdGlvbihjb25maWcpIHtcbiAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG4gIHZhciBjb250YWluZXIgPSB0aGlzLmNhbnZhcy5wYXJlbnRFbGVtZW50O1xuICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gIGNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gIGNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgY2FudmFzLnN0eWxlLnRvcCA9ICcwcHgnO1xuICBjYW52YXMuc3R5bGUubGVmdCA9ICcwcHgnO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2FudmFzKTtcblxuICB2YXIgdmlkZW8gPSBuZXcgVmlkZW8odGhpcy5hcHAsIGNhbnZhcywgY29uZmlnKTtcblxuICByZXR1cm4gdmlkZW87XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZGVvO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvdmlkZW8uanNcbiAqKi8iLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG52YXIgUG90aW9uQXVkaW8gPSByZXF1aXJlKCdwb3Rpb24tYXVkaW8nKTtcblxudmFyIEpzb25Mb2FkZXIgPSByZXF1aXJlKCcuL2xvYWRlci9qc29uLWxvYWRlcicpO1xudmFyIGltYWdlTG9hZGVyID0gcmVxdWlyZSgnLi9sb2FkZXIvaW1hZ2UtbG9hZGVyJyk7XG52YXIgdGV4dExvYWRlciA9IHJlcXVpcmUoJy4vbG9hZGVyL3RleHQtbG9hZGVyJyk7XG5cbi8qKlxuICogQ2xhc3MgZm9yIG1hbmFnaW5nIGFuZCBsb2FkaW5nIGFzc2V0IGZpbGVzXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIEFzc2V0cyA9IGZ1bmN0aW9uKCkge1xuICAvKipcbiAgICogSXMgY3VycmVudGx5IGxvYWRpbmcgYW55IGFzc2V0c1xuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG5cbiAgdGhpcy5pdGVtc0NvdW50ID0gMDtcbiAgdGhpcy5sb2FkZWRJdGVtc0NvdW50ID0gMDtcbiAgdGhpcy5wcm9ncmVzcyA9IDA7XG5cbiAgdGhpcy5fdGhpbmdzVG9Mb2FkID0gMDtcbiAgdGhpcy5fZGF0YSA9IHt9O1xuICB0aGlzLl9wcmVsb2FkaW5nID0gdHJ1ZTtcblxuICB0aGlzLl9jYWxsYmFjayA9IG51bGw7XG5cbiAgdGhpcy5fdG9Mb2FkID0gW107XG5cbiAgdGhpcy5fbG9hZGVycyA9IHt9O1xuXG4gIHRoaXMuYXVkaW8gPSBuZXcgUG90aW9uQXVkaW8oKTtcblxuICB0aGlzLmFkZExvYWRlcignanNvbicsIEpzb25Mb2FkZXIpO1xuXG4gIHRoaXMuYWRkTG9hZGVyKCdtcDMnLCB0aGlzLmF1ZGlvLmxvYWQuYmluZCh0aGlzLmF1ZGlvKSk7XG4gIHRoaXMuYWRkTG9hZGVyKCdtdXNpYycsIHRoaXMuYXVkaW8ubG9hZC5iaW5kKHRoaXMuYXVkaW8pKTtcbiAgdGhpcy5hZGRMb2FkZXIoJ3NvdW5kJywgdGhpcy5hdWRpby5sb2FkLmJpbmQodGhpcy5hdWRpbykpO1xuXG4gIHRoaXMuYWRkTG9hZGVyKCdpbWFnZScsIGltYWdlTG9hZGVyKTtcbiAgdGhpcy5hZGRMb2FkZXIoJ3RleHR1cmUnLCBpbWFnZUxvYWRlcik7XG4gIHRoaXMuYWRkTG9hZGVyKCdzcHJpdGUnLCBpbWFnZUxvYWRlcik7XG59O1xuXG5Bc3NldHMucHJvdG90eXBlLmFkZExvYWRlciA9IGZ1bmN0aW9uKG5hbWUsIGZuKSB7XG4gIHRoaXMuX2xvYWRlcnNbbmFtZV0gPSBmbjtcbn07XG5cbi8qKlxuICogU3RhcnRzIGxvYWRpbmcgc3RvcmVkIGFzc2V0cyB1cmxzIGFuZCBydW5zIGdpdmVuIGNhbGxiYWNrIGFmdGVyIGV2ZXJ5dGhpbmcgaXMgbG9hZGVkXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gKi9cbkFzc2V0cy5wcm90b3R5cGUub25sb2FkID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgdGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcblxuICBpZiAodGhpcy5fdGhpbmdzVG9Mb2FkID09PSAwKSB7XG4gICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLl9wcmVsb2FkaW5nID0gZmFsc2U7XG4gICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fbmV4dEZpbGUoKTtcbiAgfVxufTtcblxuLyoqXG4gKiBHZXR0ZXIgZm9yIGxvYWRlZCBhc3NldHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdXJsIG9mIHN0b3JlZCBhc3NldFxuICovXG5Bc3NldHMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgcmV0dXJuIHRoaXMuX2RhdGFbcGF0aC5ub3JtYWxpemUobmFtZSldO1xufTtcblxuQXNzZXRzLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHRoaXMuc2V0KG5hbWUsIG51bGwpO1xufTtcblxuXG4vKipcbiAqIFVzZWQgZm9yIHN0b3Jpbmcgc29tZSB2YWx1ZSBpbiBhc3NldHMgbW9kdWxlXG4gKiB1c2VmdWwgZm9yIG92ZXJyYXRpbmcgdmFsdWVzXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHVybCBvZiB0aGUgYXNzZXRcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZSAtIHZhbHVlIHRvIGJlIHN0b3JlZFxuICovXG5Bc3NldHMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHRoaXMuX2RhdGFbcGF0aC5ub3JtYWxpemUobmFtZSldID0gdmFsdWU7XG59O1xuXG4vKipcbiAqIFN0b3JlcyB1cmwgc28gaXQgY2FuIGJlIGxvYWRlZCBsYXRlclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSB0eXBlIG9mIGFzc2V0XG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gdXJsIG9mIGdpdmVuIGFzc2V0XG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gKi9cbkFzc2V0cy5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uKHR5cGUsIHVybCwgY2FsbGJhY2spIHtcbiAgdmFyIGxvYWRPYmplY3QgPSB7IHR5cGU6IHR5cGUsIHVybDogdXJsICE9IG51bGwgPyBwYXRoLm5vcm1hbGl6ZSh1cmwpIDogbnVsbCwgY2FsbGJhY2s6IGNhbGxiYWNrIH07XG5cbiAgaWYgKHRoaXMuX3ByZWxvYWRpbmcpIHtcbiAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XG4gICAgdGhpcy5pdGVtc0NvdW50ICs9IDE7XG4gICAgdGhpcy5fdGhpbmdzVG9Mb2FkICs9IDE7XG5cbiAgICB0aGlzLl90b0xvYWQucHVzaChsb2FkT2JqZWN0KTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5fbG9hZEFzc2V0RmlsZShsb2FkT2JqZWN0LCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBzZWxmLnNldChsb2FkT2JqZWN0LnVybCwgZGF0YSk7XG4gICAgICBpZiAoY2FsbGJhY2spIHsgY2FsbGJhY2soZGF0YSk7IH1cbiAgICB9KTtcbiAgfVxufTtcblxuQXNzZXRzLnByb3RvdHlwZS5fZmluaXNoZWRPbmVGaWxlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX25leHRGaWxlKCk7XG4gIHRoaXMucHJvZ3Jlc3MgPSB0aGlzLmxvYWRlZEl0ZW1zQ291bnQgLyB0aGlzLml0ZW1zQ291bnQ7XG4gIHRoaXMuX3RoaW5nc1RvTG9hZCAtPSAxO1xuICB0aGlzLmxvYWRlZEl0ZW1zQ291bnQgKz0gMTtcblxuICBpZiAodGhpcy5fdGhpbmdzVG9Mb2FkID09PSAwKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBzZWxmLl9jYWxsYmFjaygpO1xuICAgICAgc2VsZi5fcHJlbG9hZGluZyA9IGZhbHNlO1xuICAgICAgc2VsZi5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICB9LCAwKTtcbiAgfVxufTtcblxuQXNzZXRzLnByb3RvdHlwZS5fZXJyb3IgPSBmdW5jdGlvbih1cmwpIHtcbiAgY29uc29sZS53YXJuKCdFcnJvciBsb2FkaW5nIFwiJyArIHVybCArICdcIiBhc3NldCcpO1xuICB0aGlzLl9uZXh0RmlsZSgpO1xufTtcblxuQXNzZXRzLnByb3RvdHlwZS5fc2F2ZSA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgdGhpcy5zZXQodXJsLCBkYXRhKTtcbiAgaWYgKGNhbGxiYWNrKSB7IGNhbGxiYWNrKGRhdGEpOyB9XG4gIHRoaXMuX2ZpbmlzaGVkT25lRmlsZSgpO1xufTtcblxuQXNzZXRzLnByb3RvdHlwZS5faGFuZGxlQ3VzdG9tTG9hZGluZyA9IGZ1bmN0aW9uKGxvYWRpbmcpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgZG9uZSA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgc2VsZi5fc2F2ZShuYW1lLCB2YWx1ZSk7XG4gIH07XG4gIGxvYWRpbmcoZG9uZSk7XG59O1xuXG5Bc3NldHMucHJvdG90eXBlLl9uZXh0RmlsZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY3VycmVudCA9IHRoaXMuX3RvTG9hZC5zaGlmdCgpO1xuXG4gIGlmICghY3VycmVudCkgeyByZXR1cm47IH1cblxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX2xvYWRBc3NldEZpbGUoY3VycmVudCwgZnVuY3Rpb24oZGF0YSkge1xuICAgIHNlbGYuX3NhdmUoY3VycmVudC51cmwsIGRhdGEsIGN1cnJlbnQuY2FsbGJhY2spO1xuICB9KTtcbn07XG5cbkFzc2V0cy5wcm90b3R5cGUuX2xvYWRBc3NldEZpbGUgPSBmdW5jdGlvbihmaWxlLCBjYWxsYmFjaykge1xuICB2YXIgdHlwZSA9IGZpbGUudHlwZTtcbiAgdmFyIHVybCA9IGZpbGUudXJsO1xuXG4gIGlmICh1dGlsLmlzRnVuY3Rpb24odHlwZSkpIHtcbiAgICB0aGlzLl9oYW5kbGVDdXN0b21Mb2FkaW5nKHR5cGUpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHR5cGUgPSB0eXBlLnRvTG93ZXJDYXNlKCk7XG5cbiAgdmFyIGxvYWRlciA9IHRoaXMuX2xvYWRlcnNbdHlwZV0gfHwgdGV4dExvYWRlcjtcbiAgbG9hZGVyKHVybCwgY2FsbGJhY2ssIHRoaXMuX2Vycm9yLmJpbmQodGhpcykpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBc3NldHM7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9hc3NldHMuanNcbiAqKi8iLCJ2YXIga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG52YXIgaW52S2V5cyA9IHt9O1xuZm9yICh2YXIga2V5TmFtZSBpbiBrZXlzKSB7XG4gIGludktleXNba2V5c1trZXlOYW1lXV0gPSBrZXlOYW1lO1xufVxuXG52YXIgSW5wdXQgPSBmdW5jdGlvbihhcHAsIGNvbnRhaW5lcikge1xuICB0aGlzLl9jb250YWluZXIgPSBjb250YWluZXI7XG4gIHRoaXMuX2tleXMgPSB7fTtcblxuICB0aGlzLmNhbkNvbnRyb2xLZXlzID0gdHJ1ZTtcblxuICB0aGlzLm1vdXNlID0ge1xuICAgIGlzRG93bjogZmFsc2UsXG4gICAgaXNMZWZ0RG93bjogZmFsc2UsXG4gICAgaXNNaWRkbGVEb3duOiBmYWxzZSxcbiAgICBpc1JpZ2h0RG93bjogZmFsc2UsXG4gICAgeDogbnVsbCxcbiAgICB5OiBudWxsXG4gIH07XG5cbiAgdGhpcy5fYWRkRXZlbnRzKGFwcCk7XG59O1xuXG5JbnB1dC5wcm90b3R5cGUucmVzZXRLZXlzID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX2tleXMgPSB7fTtcbn07XG5cbklucHV0LnByb3RvdHlwZS5pc0tleURvd24gPSBmdW5jdGlvbihrZXkpIHtcbiAgaWYgKGtleSA9PSBudWxsKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGlmICh0aGlzLmNhbkNvbnRyb2xLZXlzKSB7XG4gICAgdmFyIGNvZGUgPSB0eXBlb2Yga2V5ID09PSAnbnVtYmVyJyA/IGtleSA6IGtleXNba2V5LnRvTG93ZXJDYXNlKCldO1xuICAgIHJldHVybiB0aGlzLl9rZXlzW2NvZGVdO1xuICB9XG59O1xuXG5JbnB1dC5wcm90b3R5cGUuX2FkZEV2ZW50cyA9IGZ1bmN0aW9uKGFwcCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIG1vdXNlRXZlbnQgPSB7XG4gICAgeDogbnVsbCxcbiAgICB5OiBudWxsLFxuICAgIGJ1dHRvbjogbnVsbCxcbiAgICBldmVudDogbnVsbCxcbiAgICBzdGF0ZVN0b3BFdmVudDogZnVuY3Rpb24oKSB7XG4gICAgICBhcHAuc3RhdGVzLl9wcmV2ZW50RXZlbnQgPSB0cnVlO1xuICAgIH1cbiAgfTtcblxuICB2YXIga2V5Ym9hcmRFdmVudCA9IHtcbiAgICBrZXk6IG51bGwsXG4gICAgbmFtZTogbnVsbCxcbiAgICBldmVudDogbnVsbCxcbiAgICBzdGF0ZVN0b3BFdmVudDogZnVuY3Rpb24oKSB7XG4gICAgICBhcHAuc3RhdGVzLl9wcmV2ZW50RXZlbnQgPSB0cnVlO1xuICAgIH1cbiAgfTtcblxuICBzZWxmLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24oZSkge1xuICAgIHZhciB4ID0gZS5vZmZzZXRYID09PSB1bmRlZmluZWQgPyBlLmxheWVyWCAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRMZWZ0IDogZS5vZmZzZXRYO1xuICAgIHZhciB5ID0gZS5vZmZzZXRZID09PSB1bmRlZmluZWQgPyBlLmxheWVyWSAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRUb3AgOiBlLm9mZnNldFk7XG5cbiAgICBzZWxmLm1vdXNlLnggPSB4O1xuICAgIHNlbGYubW91c2UueSA9IHk7XG5cbiAgICBtb3VzZUV2ZW50LnggPSB4O1xuICAgIG1vdXNlRXZlbnQueSA9IHk7XG4gICAgbW91c2VFdmVudC5idXR0b24gPSBudWxsO1xuICAgIG1vdXNlRXZlbnQuZXZlbnQgPSBlO1xuXG4gICAgYXBwLnN0YXRlcy5tb3VzZW1vdmUobW91c2VFdmVudCk7XG4gIH0pO1xuXG4gIHNlbGYuX2NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciB4ID0gZS5vZmZzZXRYID09PSB1bmRlZmluZWQgPyBlLmxheWVyWCAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRMZWZ0IDogZS5vZmZzZXRYO1xuICAgIHZhciB5ID0gZS5vZmZzZXRZID09PSB1bmRlZmluZWQgPyBlLmxheWVyWSAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRUb3AgOiBlLm9mZnNldFk7XG5cbiAgICBzd2l0Y2ggKGUuYnV0dG9uKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHNlbGYubW91c2UuaXNMZWZ0RG93biA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHNlbGYubW91c2UuaXNNaWRkbGVEb3duID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBzZWxmLm1vdXNlLmlzUmlnaHREb3duID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHNlbGYubW91c2UuaXNEb3duID0gc2VsZi5tb3VzZS5pc0xlZnREb3duIHx8IHNlbGYubW91c2UuaXNSaWdodERvd24gfHwgc2VsZi5tb3VzZS5pc01pZGRsZURvd247XG5cbiAgICBtb3VzZUV2ZW50LnggPSB4O1xuICAgIG1vdXNlRXZlbnQueSA9IHk7XG4gICAgbW91c2VFdmVudC5idXR0b24gPSBlLmJ1dHRvbjtcbiAgICBtb3VzZUV2ZW50LmV2ZW50ID0gZTtcblxuICAgIGFwcC5zdGF0ZXMubW91c2V1cChtb3VzZUV2ZW50KTtcbiAgfSwgZmFsc2UpO1xuXG4gIHNlbGYuX2NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdmFyIHggPSBlLm9mZnNldFggPT09IHVuZGVmaW5lZCA/IGUubGF5ZXJYIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldExlZnQgOiBlLm9mZnNldFg7XG4gICAgdmFyIHkgPSBlLm9mZnNldFkgPT09IHVuZGVmaW5lZCA/IGUubGF5ZXJZIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldFRvcCA6IGUub2Zmc2V0WTtcblxuICAgIHNlbGYubW91c2UueCA9IHg7XG4gICAgc2VsZi5tb3VzZS55ID0geTtcbiAgICBzZWxmLm1vdXNlLmlzRG93biA9IHRydWU7XG5cbiAgICBzd2l0Y2ggKGUuYnV0dG9uKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHNlbGYubW91c2UuaXNMZWZ0RG93biA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgc2VsZi5tb3VzZS5pc01pZGRsZURvd24gPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgc2VsZi5tb3VzZS5pc1JpZ2h0RG93biA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIG1vdXNlRXZlbnQueCA9IHg7XG4gICAgbW91c2VFdmVudC55ID0geTtcbiAgICBtb3VzZUV2ZW50LmJ1dHRvbiA9IGUuYnV0dG9uO1xuICAgIG1vdXNlRXZlbnQuZXZlbnQgPSBlO1xuXG4gICAgYXBwLnN0YXRlcy5tb3VzZWRvd24obW91c2VFdmVudCk7XG4gIH0sIGZhbHNlKTtcblxuICBzZWxmLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBmb3IgKHZhciBpPTA7IGk8ZS50b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdG91Y2ggPSBlLnRvdWNoZXNbaV07XG5cbiAgICAgIHZhciB4ID0gdG91Y2gucGFnZVggLSBzZWxmLl9jb250YWluZXIub2Zmc2V0TGVmdDtcbiAgICAgIHZhciB5ID0gdG91Y2gucGFnZVkgLSBzZWxmLl9jb250YWluZXIub2Zmc2V0VG9wO1xuXG4gICAgICBzZWxmLm1vdXNlLnggPSB4O1xuICAgICAgc2VsZi5tb3VzZS55ID0geTtcbiAgICAgIHNlbGYubW91c2UuaXNEb3duID0gdHJ1ZTtcbiAgICAgIHNlbGYubW91c2UuaXNMZWZ0RG93biA9IHRydWU7XG5cbiAgICAgIG1vdXNlRXZlbnQueCA9IHg7XG4gICAgICBtb3VzZUV2ZW50LnkgPSB5O1xuICAgICAgbW91c2VFdmVudC5idXR0b24gPSAxO1xuICAgICAgbW91c2VFdmVudC5ldmVudCA9IGU7XG5cbiAgICAgIGFwcC5zdGF0ZXMubW91c2Vkb3duKG1vdXNlRXZlbnQpO1xuICAgIH1cbiAgfSk7XG5cbiAgc2VsZi5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBmb3IgKHZhciBpPTA7IGk8ZS50b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdG91Y2ggPSBlLnRvdWNoZXNbaV07XG5cbiAgICAgIHZhciB4ID0gdG91Y2gucGFnZVggLSBzZWxmLl9jb250YWluZXIub2Zmc2V0TGVmdDtcbiAgICAgIHZhciB5ID0gdG91Y2gucGFnZVkgLSBzZWxmLl9jb250YWluZXIub2Zmc2V0VG9wO1xuXG4gICAgICBzZWxmLm1vdXNlLnggPSB4O1xuICAgICAgc2VsZi5tb3VzZS55ID0geTtcbiAgICAgIHNlbGYubW91c2UuaXNEb3duID0gdHJ1ZTtcbiAgICAgIHNlbGYubW91c2UuaXNMZWZ0RG93biA9IHRydWU7XG5cbiAgICAgIG1vdXNlRXZlbnQueCA9IHg7XG4gICAgICBtb3VzZUV2ZW50LnkgPSB5O1xuICAgICAgbW91c2VFdmVudC5ldmVudCA9IGU7XG5cbiAgICAgIGFwcC5zdGF0ZXMubW91c2Vtb3ZlKG1vdXNlRXZlbnQpO1xuICAgIH1cbiAgfSk7XG5cbiAgc2VsZi5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciB0b3VjaCA9IGUuY2hhbmdlZFRvdWNoZXNbMF07XG5cbiAgICB2YXIgeCA9IHRvdWNoLnBhZ2VYIC0gc2VsZi5fY29udGFpbmVyLm9mZnNldExlZnQ7XG4gICAgdmFyIHkgPSB0b3VjaC5wYWdlWSAtIHNlbGYuX2NvbnRhaW5lci5vZmZzZXRUb3A7XG5cbiAgICBzZWxmLm1vdXNlLnggPSB4O1xuICAgIHNlbGYubW91c2UueSA9IHk7XG4gICAgc2VsZi5tb3VzZS5pc0Rvd24gPSBmYWxzZTtcbiAgICBzZWxmLm1vdXNlLmlzTGVmdERvd24gPSBmYWxzZTtcblxuICAgIG1vdXNlRXZlbnQueCA9IHg7XG4gICAgbW91c2VFdmVudC55ID0geTtcbiAgICBtb3VzZUV2ZW50LmV2ZW50ID0gZTtcblxuICAgIGFwcC5zdGF0ZXMubW91c2V1cChtb3VzZUV2ZW50KTtcbiAgfSk7XG5cbiAgc2VsZi5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfSk7XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtcbiAgICBzZWxmLl9rZXlzW2Uua2V5Q29kZV0gPSB0cnVlO1xuXG4gICAga2V5Ym9hcmRFdmVudC5rZXkgPSBlLndoaWNoO1xuICAgIGtleWJvYXJkRXZlbnQubmFtZSA9IGludktleXNbZS53aGljaF07XG4gICAga2V5Ym9hcmRFdmVudC5ldmVudCA9IGU7XG5cbiAgICBhcHAuc3RhdGVzLmtleWRvd24oa2V5Ym9hcmRFdmVudCk7XG4gIH0pO1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24oZSkge1xuICAgIHNlbGYuX2tleXNbZS5rZXlDb2RlXSA9IGZhbHNlO1xuXG4gICAga2V5Ym9hcmRFdmVudC5rZXkgPSBlLndoaWNoO1xuICAgIGtleWJvYXJkRXZlbnQubmFtZSA9IGludktleXNbZS53aGljaF07XG4gICAga2V5Ym9hcmRFdmVudC5ldmVudCA9IGU7XG5cbiAgICBhcHAuc3RhdGVzLmtleXVwKGtleWJvYXJkRXZlbnQpO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW5wdXQ7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9pbnB1dC5qc1xuICoqLyIsInZhciBMb2FkaW5nID0gZnVuY3Rpb24oYXBwKSB7XG4gIHRoaXMuYXBwID0gYXBwO1xuXG4gIHRoaXMuYmFyV2lkdGggPSAwO1xuXG4gIHRoaXMudmlkZW8gPSBhcHAudmlkZW8uY3JlYXRlTGF5ZXIoe1xuICAgIGFsbG93SGlEUEk6IHRydWUsXG4gICAgZ2V0Q2FudmFzQ29udGV4dDogdHJ1ZVxuICB9KTtcbn07XG5cbkxvYWRpbmcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgdGhpcy52aWRlby5jbGVhcigpO1xuXG4gIHZhciBjb2xvcjEgPSAnI2I5ZmY3MSc7XG4gIHZhciBjb2xvcjIgPSAnIzhhYzI1MCc7XG4gIHZhciBjb2xvcjMgPSAnIzY0OGUzOCc7XG5cbiAgdmFyIHdpZHRoID0gTWF0aC5taW4odGhpcy5hcHAud2lkdGggKiAyLzMsIDMwMCk7XG4gIHZhciBoZWlnaHQgPSAyMDtcblxuICB2YXIgeSA9ICh0aGlzLmFwcC5oZWlnaHQgLSBoZWlnaHQpIC8gMjtcbiAgdmFyIHggPSAodGhpcy5hcHAud2lkdGggLSB3aWR0aCkgLyAyO1xuXG4gIHZhciBjdXJyZW50V2lkdGggPSB3aWR0aCAqIHRoaXMuYXBwLmFzc2V0cy5wcm9ncmVzcztcbiAgdGhpcy5iYXJXaWR0aCA9IHRoaXMuYmFyV2lkdGggKyAoY3VycmVudFdpZHRoIC0gdGhpcy5iYXJXaWR0aCkgKiB0aW1lICogMTA7XG5cbiAgdGhpcy52aWRlby5jdHguZmlsbFN0eWxlID0gY29sb3IyO1xuICB0aGlzLnZpZGVvLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLmFwcC53aWR0aCwgdGhpcy5hcHAuaGVpZ2h0KTtcblxuICB0aGlzLnZpZGVvLmN0eC5mb250ID0gJzQwMCA0MHB4IHNhbnMtc2VyaWYnO1xuICB0aGlzLnZpZGVvLmN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgdGhpcy52aWRlby5jdHgudGV4dEJhc2VsaW5lID0gJ2JvdHRvbSc7XG5cbiAgdGhpcy52aWRlby5jdHguZmlsbFN0eWxlID0gJ3JnYmEoMCwgMCwgMCwgMC4xKSc7XG4gIHRoaXMudmlkZW8uY3R4LmZpbGxUZXh0KFwiUG90aW9uLmpzXCIsIHRoaXMuYXBwLndpZHRoLzIsIHkgKyAyKTtcblxuICB0aGlzLnZpZGVvLmN0eC5maWxsU3R5bGUgPSAnI2QxZmZhMSc7XG4gIHRoaXMudmlkZW8uY3R4LmZpbGxUZXh0KFwiUG90aW9uLmpzXCIsIHRoaXMuYXBwLndpZHRoLzIsIHkpO1xuXG4gIHRoaXMudmlkZW8uY3R4LnN0cm9rZVN0eWxlID0gdGhpcy52aWRlby5jdHguZmlsbFN0eWxlID0gY29sb3IzO1xuICB0aGlzLnZpZGVvLmN0eC5maWxsUmVjdCh4LCB5ICsgMTUsIHdpZHRoLCBoZWlnaHQpO1xuXG4gIHRoaXMudmlkZW8uY3R4LmxpbmVXaWR0aCA9IDI7XG4gIHRoaXMudmlkZW8uY3R4LmJlZ2luUGF0aCgpO1xuICB0aGlzLnZpZGVvLmN0eC5yZWN0KHggLSA1LCB5ICsgMTAsIHdpZHRoICsgMTAsIGhlaWdodCArIDEwKTtcbiAgdGhpcy52aWRlby5jdHguY2xvc2VQYXRoKCk7XG4gIHRoaXMudmlkZW8uY3R4LnN0cm9rZSgpO1xuXG4gIHRoaXMudmlkZW8uY3R4LnN0cm9rZVN0eWxlID0gdGhpcy52aWRlby5jdHguZmlsbFN0eWxlID0gJ3JnYmEoMCwgMCwgMCwgMC4xKSc7XG4gIHRoaXMudmlkZW8uY3R4LmZpbGxSZWN0KHgsIHkgKyAxNSwgdGhpcy5iYXJXaWR0aCwgaGVpZ2h0ICsgMik7XG5cbiAgdGhpcy52aWRlby5jdHgubGluZVdpZHRoID0gMjtcbiAgdGhpcy52aWRlby5jdHguYmVnaW5QYXRoKCk7XG5cbiAgdGhpcy52aWRlby5jdHgubW92ZVRvKHggKyB0aGlzLmJhcldpZHRoLCB5ICsgMTIpO1xuICB0aGlzLnZpZGVvLmN0eC5saW5lVG8oeCAtIDUsIHkgKyAxMik7XG4gIHRoaXMudmlkZW8uY3R4LmxpbmVUbyh4IC0gNSwgeSArIDEwICsgaGVpZ2h0ICsgMTIpO1xuICB0aGlzLnZpZGVvLmN0eC5saW5lVG8oeCArIHRoaXMuYmFyV2lkdGgsIHkgKyAxMCArIGhlaWdodCArIDEyKTtcblxuICB0aGlzLnZpZGVvLmN0eC5zdHJva2UoKTtcbiAgdGhpcy52aWRlby5jdHguY2xvc2VQYXRoKCk7XG5cbiAgdGhpcy52aWRlby5jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLnZpZGVvLmN0eC5maWxsU3R5bGUgPSBjb2xvcjE7XG4gIHRoaXMudmlkZW8uY3R4LmZpbGxSZWN0KHgsIHkgKyAxNSwgdGhpcy5iYXJXaWR0aCwgaGVpZ2h0KTtcblxuICB0aGlzLnZpZGVvLmN0eC5saW5lV2lkdGggPSAyO1xuICB0aGlzLnZpZGVvLmN0eC5iZWdpblBhdGgoKTtcblxuICB0aGlzLnZpZGVvLmN0eC5tb3ZlVG8oeCArIHRoaXMuYmFyV2lkdGgsIHkgKyAxMCk7XG4gIHRoaXMudmlkZW8uY3R4LmxpbmVUbyh4IC0gNSwgeSArIDEwKTtcbiAgdGhpcy52aWRlby5jdHgubGluZVRvKHggLSA1LCB5ICsgMTAgKyBoZWlnaHQgKyAxMCk7XG4gIHRoaXMudmlkZW8uY3R4LmxpbmVUbyh4ICsgdGhpcy5iYXJXaWR0aCwgeSArIDEwICsgaGVpZ2h0ICsgMTApO1xuXG4gIHRoaXMudmlkZW8uY3R4LnN0cm9rZSgpO1xuICB0aGlzLnZpZGVvLmN0eC5jbG9zZVBhdGgoKTtcbn07XG5cbkxvYWRpbmcucHJvdG90eXBlLmV4aXQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy52aWRlby5kZXN0cm95KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvYWRpbmc7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9sb2FkaW5nLmpzXG4gKiovIiwidmFyIERpcnR5TWFuYWdlciA9IGZ1bmN0aW9uKGNhbnZhcywgY3R4KSB7XG4gIHRoaXMuY3R4ID0gY3R4O1xuICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcblxuICB0aGlzLnRvcCA9IGNhbnZhcy5oZWlnaHQ7XG4gIHRoaXMubGVmdCA9IGNhbnZhcy53aWR0aDtcbiAgdGhpcy5ib3R0b20gPSAwO1xuICB0aGlzLnJpZ2h0ID0gMDtcblxuICB0aGlzLmlzRGlydHkgPSBmYWxzZTtcbn07XG5cbkRpcnR5TWFuYWdlci5wcm90b3R5cGUuYWRkUmVjdCA9IGZ1bmN0aW9uKGxlZnQsIHRvcCwgd2lkdGgsIGhlaWdodCkge1xuICB2YXIgcmlnaHQgID0gbGVmdCArIHdpZHRoO1xuICB2YXIgYm90dG9tID0gdG9wICsgaGVpZ2h0O1xuXG4gIHRoaXMudG9wICAgID0gdG9wIDwgdGhpcy50b3AgICAgICAgPyB0b3AgICAgOiB0aGlzLnRvcDtcbiAgdGhpcy5sZWZ0ICAgPSBsZWZ0IDwgdGhpcy5sZWZ0ICAgICA/IGxlZnQgICA6IHRoaXMubGVmdDtcbiAgdGhpcy5ib3R0b20gPSBib3R0b20gPiB0aGlzLmJvdHRvbSA/IGJvdHRvbSA6IHRoaXMuYm90dG9tO1xuICB0aGlzLnJpZ2h0ICA9IHJpZ2h0ID4gdGhpcy5yaWdodCAgID8gcmlnaHQgIDogdGhpcy5yaWdodDtcblxuICB0aGlzLmlzRGlydHkgPSB0cnVlO1xufTtcblxuRGlydHlNYW5hZ2VyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMuaXNEaXJ0eSkgeyByZXR1cm47IH1cblxuICB0aGlzLmN0eC5jbGVhclJlY3QodGhpcy5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3AsXG4gICAgICAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0IC0gdGhpcy5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3R0b20gLSB0aGlzLnRvcCk7XG5cbiAgdGhpcy5sZWZ0ID0gdGhpcy5jYW52YXMud2lkdGg7XG4gIHRoaXMudG9wID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xuICB0aGlzLnJpZ2h0ID0gMDtcbiAgdGhpcy5ib3R0b20gPSAwO1xuXG4gIHRoaXMuaXNEaXJ0eSA9IGZhbHNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXJ0eU1hbmFnZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9wb3Rpb24tZGVidWdnZXIvZGlydHktbWFuYWdlci5qc1xuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDEzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICdiYWNrc3BhY2UnOiA4LFxuICAndGFiJzogOSxcbiAgJ2VudGVyJzogMTMsXG4gICdwYXVzZSc6IDE5LFxuICAnY2Fwcyc6IDIwLFxuICAnZXNjJzogMjcsXG4gICdzcGFjZSc6IDMyLFxuICAncGFnZV91cCc6IDMzLFxuICAncGFnZV9kb3duJzogMzQsXG4gICdlbmQnOiAzNSxcbiAgJ2hvbWUnOiAzNixcbiAgJ2xlZnQnOiAzNyxcbiAgJ3VwJzogMzgsXG4gICdyaWdodCc6IDM5LFxuICAnZG93bic6IDQwLFxuICAnaW5zZXJ0JzogNDUsXG4gICdkZWxldGUnOiA0NixcbiAgJzAnOiA0OCxcbiAgJzEnOiA0OSxcbiAgJzInOiA1MCxcbiAgJzMnOiA1MSxcbiAgJzQnOiA1MixcbiAgJzUnOiA1MyxcbiAgJzYnOiA1NCxcbiAgJzcnOiA1NSxcbiAgJzgnOiA1NixcbiAgJzknOiA1NyxcbiAgJ2EnOiA2NSxcbiAgJ2InOiA2NixcbiAgJ2MnOiA2NyxcbiAgJ2QnOiA2OCxcbiAgJ2UnOiA2OSxcbiAgJ2YnOiA3MCxcbiAgJ2cnOiA3MSxcbiAgJ2gnOiA3MixcbiAgJ2knOiA3MyxcbiAgJ2onOiA3NCxcbiAgJ2snOiA3NSxcbiAgJ2wnOiA3NixcbiAgJ20nOiA3NyxcbiAgJ24nOiA3OCxcbiAgJ28nOiA3OSxcbiAgJ3AnOiA4MCxcbiAgJ3EnOiA4MSxcbiAgJ3InOiA4MixcbiAgJ3MnOiA4MyxcbiAgJ3QnOiA4NCxcbiAgJ3UnOiA4NSxcbiAgJ3YnOiA4NixcbiAgJ3cnOiA4NyxcbiAgJ3gnOiA4OCxcbiAgJ3knOiA4OSxcbiAgJ3onOiA5MCxcbiAgJ251bXBhZF8wJzogOTYsXG4gICdudW1wYWRfMSc6IDk3LFxuICAnbnVtcGFkXzInOiA5OCxcbiAgJ251bXBhZF8zJzogOTksXG4gICdudW1wYWRfNCc6IDEwMCxcbiAgJ251bXBhZF81JzogMTAxLFxuICAnbnVtcGFkXzYnOiAxMDIsXG4gICdudW1wYWRfNyc6IDEwMyxcbiAgJ251bXBhZF84JzogMTA0LFxuICAnbnVtcGFkXzknOiAxMDUsXG4gICdtdWx0aXBseSc6IDEwNixcbiAgJ2FkZCc6IDEwNyxcbiAgJ3N1YnN0cmFjdCc6IDEwOSxcbiAgJ2RlY2ltYWwnOiAxMTAsXG4gICdkaXZpZGUnOiAxMTEsXG4gICdmMSc6IDExMixcbiAgJ2YyJzogMTEzLFxuICAnZjMnOiAxMTQsXG4gICdmNCc6IDExNSxcbiAgJ2Y1JzogMTE2LFxuICAnZjYnOiAxMTcsXG4gICdmNyc6IDExOCxcbiAgJ2Y4JzogMTE5LFxuICAnZjknOiAxMjAsXG4gICdmMTAnOiAxMjEsXG4gICdmMTEnOiAxMjIsXG4gICdmMTInOiAxMjMsXG4gICdzaGlmdCc6IDE2LFxuICAnY3RybCc6IDE3LFxuICAnYWx0JzogMTgsXG4gICdwbHVzJzogMTg3LFxuICAnY29tbWEnOiAxODgsXG4gICdtaW51cyc6IDE4OSxcbiAgJ3BlcmlvZCc6IDE5MFxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2tleXMuanNcbiAqKi8iLCJ2YXIgaXNSZXRpbmEgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG1lZGlhUXVlcnkgPSBcIigtd2Via2l0LW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDEuNSksXFxcbiAgKG1pbi0tbW96LWRldmljZS1waXhlbC1yYXRpbzogMS41KSxcXFxuICAoLW8tbWluLWRldmljZS1waXhlbC1yYXRpbzogMy8yKSxcXFxuICAobWluLXJlc29sdXRpb246IDEuNWRwcHgpXCI7XG5cbiAgaWYgKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvID4gMSlcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBpZiAod2luZG93Lm1hdGNoTWVkaWEgJiYgd2luZG93Lm1hdGNoTWVkaWEobWVkaWFRdWVyeSkubWF0Y2hlcylcbiAgICByZXR1cm4gdHJ1ZTtcblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzUmV0aW5hO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmV0aW5hLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1cmwsIGNhbGxiYWNrLCBlcnJvcikge1xuICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gIHJlcXVlc3Qub3BlbignR0VUJywgdXJsLCB0cnVlKTtcbiAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSAndGV4dCc7XG4gIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHJlcXVlc3Quc3RhdHVzICE9PSAyMDApIHtcbiAgICAgIHJldHVybiBlcnJvcih1cmwpO1xuICAgIH1cblxuICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlKTtcbiAgICBjYWxsYmFjayhkYXRhKTtcbiAgfTtcbiAgcmVxdWVzdC5zZW5kKCk7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbG9hZGVyL2pzb24tbG9hZGVyLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1cmwsIGNhbGxiYWNrLCBlcnJvcikge1xuICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgY2FsbGJhY2soaW1hZ2UpO1xuICB9O1xuICBpbWFnZS5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgZXJyb3IodXJsKTtcbiAgfTtcbiAgaW1hZ2Uuc3JjID0gdXJsO1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xvYWRlci9pbWFnZS1sb2FkZXIuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVybCwgY2FsbGJhY2ssIGVycm9yKSB7XG4gIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgcmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9ICd0ZXh0JztcbiAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAocmVxdWVzdC5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgcmV0dXJuIGVycm9yKHVybCk7XG4gICAgfVxuXG4gICAgdmFyIGRhdGEgPSB0aGlzLnJlc3BvbnNlO1xuICAgIGNhbGxiYWNrKGRhdGEpO1xuICB9O1xuICByZXF1ZXN0LnNlbmQoKTtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9sb2FkZXIvdGV4dC1sb2FkZXIuanNcbiAqKi8iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIGZvcm1hdFJlZ0V4cCA9IC8lW3NkaiVdL2c7XG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKGYpIHtcbiAgaWYgKCFpc1N0cmluZyhmKSkge1xuICAgIHZhciBvYmplY3RzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iamVjdHMucHVzaChpbnNwZWN0KGFyZ3VtZW50c1tpXSkpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0cy5qb2luKCcgJyk7XG4gIH1cblxuICB2YXIgaSA9IDE7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICB2YXIgbGVuID0gYXJncy5sZW5ndGg7XG4gIHZhciBzdHIgPSBTdHJpbmcoZikucmVwbGFjZShmb3JtYXRSZWdFeHAsIGZ1bmN0aW9uKHgpIHtcbiAgICBpZiAoeCA9PT0gJyUlJykgcmV0dXJuICclJztcbiAgICBpZiAoaSA+PSBsZW4pIHJldHVybiB4O1xuICAgIHN3aXRjaCAoeCkge1xuICAgICAgY2FzZSAnJXMnOiByZXR1cm4gU3RyaW5nKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclZCc6IHJldHVybiBOdW1iZXIoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVqJzpcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIHJldHVybiAnW0NpcmN1bGFyXSc7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfSk7XG4gIGZvciAodmFyIHggPSBhcmdzW2ldOyBpIDwgbGVuOyB4ID0gYXJnc1srK2ldKSB7XG4gICAgaWYgKGlzTnVsbCh4KSB8fCAhaXNPYmplY3QoeCkpIHtcbiAgICAgIHN0ciArPSAnICcgKyB4O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgKz0gJyAnICsgaW5zcGVjdCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cblxuLy8gTWFyayB0aGF0IGEgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZC5cbi8vIFJldHVybnMgYSBtb2RpZmllZCBmdW5jdGlvbiB3aGljaCB3YXJucyBvbmNlIGJ5IGRlZmF1bHQuXG4vLyBJZiAtLW5vLWRlcHJlY2F0aW9uIGlzIHNldCwgdGhlbiBpdCBpcyBhIG5vLW9wLlxuZXhwb3J0cy5kZXByZWNhdGUgPSBmdW5jdGlvbihmbiwgbXNnKSB7XG4gIC8vIEFsbG93IGZvciBkZXByZWNhdGluZyB0aGluZ3MgaW4gdGhlIHByb2Nlc3Mgb2Ygc3RhcnRpbmcgdXAuXG4gIGlmIChpc1VuZGVmaW5lZChnbG9iYWwucHJvY2VzcykpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy5kZXByZWNhdGUoZm4sIG1zZykuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHByb2Nlc3Mubm9EZXByZWNhdGlvbiA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKHByb2Nlc3MudGhyb3dEZXByZWNhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy50cmFjZURlcHJlY2F0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59O1xuXG5cbnZhciBkZWJ1Z3MgPSB7fTtcbnZhciBkZWJ1Z0Vudmlyb247XG5leHBvcnRzLmRlYnVnbG9nID0gZnVuY3Rpb24oc2V0KSB7XG4gIGlmIChpc1VuZGVmaW5lZChkZWJ1Z0Vudmlyb24pKVxuICAgIGRlYnVnRW52aXJvbiA9IHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJyc7XG4gIHNldCA9IHNldC50b1VwcGVyQ2FzZSgpO1xuICBpZiAoIWRlYnVnc1tzZXRdKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoJ1xcXFxiJyArIHNldCArICdcXFxcYicsICdpJykudGVzdChkZWJ1Z0Vudmlyb24pKSB7XG4gICAgICB2YXIgcGlkID0gcHJvY2Vzcy5waWQ7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbXNnID0gZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKTtcbiAgICAgICAgY29uc29sZS5lcnJvcignJXMgJWQ6ICVzJywgc2V0LCBwaWQsIG1zZyk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWJ1Z3Nbc2V0XTtcbn07XG5cblxuLyoqXG4gKiBFY2hvcyB0aGUgdmFsdWUgb2YgYSB2YWx1ZS4gVHJ5cyB0byBwcmludCB0aGUgdmFsdWUgb3V0XG4gKiBpbiB0aGUgYmVzdCB3YXkgcG9zc2libGUgZ2l2ZW4gdGhlIGRpZmZlcmVudCB0eXBlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcHJpbnQgb3V0LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdGhhdCBhbHRlcnMgdGhlIG91dHB1dC5cbiAqL1xuLyogbGVnYWN5OiBvYmosIHNob3dIaWRkZW4sIGRlcHRoLCBjb2xvcnMqL1xuZnVuY3Rpb24gaW5zcGVjdChvYmosIG9wdHMpIHtcbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHZhciBjdHggPSB7XG4gICAgc2VlbjogW10sXG4gICAgc3R5bGl6ZTogc3R5bGl6ZU5vQ29sb3JcbiAgfTtcbiAgLy8gbGVnYWN5Li4uXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDMpIGN0eC5kZXB0aCA9IGFyZ3VtZW50c1syXTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkgY3R4LmNvbG9ycyA9IGFyZ3VtZW50c1szXTtcbiAgaWYgKGlzQm9vbGVhbihvcHRzKSkge1xuICAgIC8vIGxlZ2FjeS4uLlxuICAgIGN0eC5zaG93SGlkZGVuID0gb3B0cztcbiAgfSBlbHNlIGlmIChvcHRzKSB7XG4gICAgLy8gZ290IGFuIFwib3B0aW9uc1wiIG9iamVjdFxuICAgIGV4cG9ydHMuX2V4dGVuZChjdHgsIG9wdHMpO1xuICB9XG4gIC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSkgY3R4LnNob3dIaWRkZW4gPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5kZXB0aCkpIGN0eC5kZXB0aCA9IDI7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY29sb3JzKSkgY3R4LmNvbG9ycyA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKSBjdHguY3VzdG9tSW5zcGVjdCA9IHRydWU7XG4gIGlmIChjdHguY29sb3JzKSBjdHguc3R5bGl6ZSA9IHN0eWxpemVXaXRoQ29sb3I7XG4gIHJldHVybiBmb3JtYXRWYWx1ZShjdHgsIG9iaiwgY3R4LmRlcHRoKTtcbn1cbmV4cG9ydHMuaW5zcGVjdCA9IGluc3BlY3Q7XG5cblxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BTlNJX2VzY2FwZV9jb2RlI2dyYXBoaWNzXG5pbnNwZWN0LmNvbG9ycyA9IHtcbiAgJ2JvbGQnIDogWzEsIDIyXSxcbiAgJ2l0YWxpYycgOiBbMywgMjNdLFxuICAndW5kZXJsaW5lJyA6IFs0LCAyNF0sXG4gICdpbnZlcnNlJyA6IFs3LCAyN10sXG4gICd3aGl0ZScgOiBbMzcsIDM5XSxcbiAgJ2dyZXknIDogWzkwLCAzOV0sXG4gICdibGFjaycgOiBbMzAsIDM5XSxcbiAgJ2JsdWUnIDogWzM0LCAzOV0sXG4gICdjeWFuJyA6IFszNiwgMzldLFxuICAnZ3JlZW4nIDogWzMyLCAzOV0sXG4gICdtYWdlbnRhJyA6IFszNSwgMzldLFxuICAncmVkJyA6IFszMSwgMzldLFxuICAneWVsbG93JyA6IFszMywgMzldXG59O1xuXG4vLyBEb24ndCB1c2UgJ2JsdWUnIG5vdCB2aXNpYmxlIG9uIGNtZC5leGVcbmluc3BlY3Quc3R5bGVzID0ge1xuICAnc3BlY2lhbCc6ICdjeWFuJyxcbiAgJ251bWJlcic6ICd5ZWxsb3cnLFxuICAnYm9vbGVhbic6ICd5ZWxsb3cnLFxuICAndW5kZWZpbmVkJzogJ2dyZXknLFxuICAnbnVsbCc6ICdib2xkJyxcbiAgJ3N0cmluZyc6ICdncmVlbicsXG4gICdkYXRlJzogJ21hZ2VudGEnLFxuICAvLyBcIm5hbWVcIjogaW50ZW50aW9uYWxseSBub3Qgc3R5bGluZ1xuICAncmVnZXhwJzogJ3JlZCdcbn07XG5cblxuZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICB2YXIgc3R5bGUgPSBpbnNwZWN0LnN0eWxlc1tzdHlsZVR5cGVdO1xuXG4gIGlmIChzdHlsZSkge1xuICAgIHJldHVybiAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVsxXSArICdtJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cblxuZnVuY3Rpb24gc3R5bGl6ZU5vQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgcmV0dXJuIHN0cjtcbn1cblxuXG5mdW5jdGlvbiBhcnJheVRvSGFzaChhcnJheSkge1xuICB2YXIgaGFzaCA9IHt9O1xuXG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsLCBpZHgpIHtcbiAgICBoYXNoW3ZhbF0gPSB0cnVlO1xuICB9KTtcblxuICByZXR1cm4gaGFzaDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRWYWx1ZShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMpIHtcbiAgLy8gUHJvdmlkZSBhIGhvb2sgZm9yIHVzZXItc3BlY2lmaWVkIGluc3BlY3QgZnVuY3Rpb25zLlxuICAvLyBDaGVjayB0aGF0IHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGFuIGluc3BlY3QgZnVuY3Rpb24gb24gaXRcbiAgaWYgKGN0eC5jdXN0b21JbnNwZWN0ICYmXG4gICAgICB2YWx1ZSAmJlxuICAgICAgaXNGdW5jdGlvbih2YWx1ZS5pbnNwZWN0KSAmJlxuICAgICAgLy8gRmlsdGVyIG91dCB0aGUgdXRpbCBtb2R1bGUsIGl0J3MgaW5zcGVjdCBmdW5jdGlvbiBpcyBzcGVjaWFsXG4gICAgICB2YWx1ZS5pbnNwZWN0ICE9PSBleHBvcnRzLmluc3BlY3QgJiZcbiAgICAgIC8vIEFsc28gZmlsdGVyIG91dCBhbnkgcHJvdG90eXBlIG9iamVjdHMgdXNpbmcgdGhlIGNpcmN1bGFyIGNoZWNrLlxuICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgIHZhciByZXQgPSB2YWx1ZS5pbnNwZWN0KHJlY3Vyc2VUaW1lcywgY3R4KTtcbiAgICBpZiAoIWlzU3RyaW5nKHJldCkpIHtcbiAgICAgIHJldCA9IGZvcm1hdFZhbHVlKGN0eCwgcmV0LCByZWN1cnNlVGltZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLy8gUHJpbWl0aXZlIHR5cGVzIGNhbm5vdCBoYXZlIHByb3BlcnRpZXNcbiAgdmFyIHByaW1pdGl2ZSA9IGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKTtcbiAgaWYgKHByaW1pdGl2ZSkge1xuICAgIHJldHVybiBwcmltaXRpdmU7XG4gIH1cblxuICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICB2YXIgdmlzaWJsZUtleXMgPSBhcnJheVRvSGFzaChrZXlzKTtcblxuICBpZiAoY3R4LnNob3dIaWRkZW4pIHtcbiAgICBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpO1xuICB9XG5cbiAgLy8gSUUgZG9lc24ndCBtYWtlIGVycm9yIGZpZWxkcyBub24tZW51bWVyYWJsZVxuICAvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvZHd3NTJzYnQodj12cy45NCkuYXNweFxuICBpZiAoaXNFcnJvcih2YWx1ZSlcbiAgICAgICYmIChrZXlzLmluZGV4T2YoJ21lc3NhZ2UnKSA+PSAwIHx8IGtleXMuaW5kZXhPZignZGVzY3JpcHRpb24nKSA+PSAwKSkge1xuICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICAvLyBTb21lIHR5cGUgb2Ygb2JqZWN0IHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWQuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW0Z1bmN0aW9uJyArIG5hbWUgKyAnXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfVxuICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdkYXRlJyk7XG4gICAgfVxuICAgIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgYmFzZSA9ICcnLCBhcnJheSA9IGZhbHNlLCBicmFjZXMgPSBbJ3snLCAnfSddO1xuXG4gIC8vIE1ha2UgQXJyYXkgc2F5IHRoYXQgdGhleSBhcmUgQXJyYXlcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgYXJyYXkgPSB0cnVlO1xuICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gIH1cblxuICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICBiYXNlID0gJyBbRnVuY3Rpb24nICsgbiArICddJztcbiAgfVxuXG4gIC8vIE1ha2UgUmVnRXhwcyBzYXkgdGhhdCB0aGV5IGFyZSBSZWdFeHBzXG4gIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBEYXRlLnByb3RvdHlwZS50b1VUQ1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZXJyb3Igd2l0aCBtZXNzYWdlIGZpcnN0IHNheSB0aGUgZXJyb3JcbiAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCAmJiAoIWFycmF5IHx8IHZhbHVlLmxlbmd0aCA9PSAwKSkge1xuICAgIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgYnJhY2VzWzFdO1xuICB9XG5cbiAgaWYgKHJlY3Vyc2VUaW1lcyA8IDApIHtcbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cblxuICBjdHguc2Vlbi5wdXNoKHZhbHVlKTtcblxuICB2YXIgb3V0cHV0O1xuICBpZiAoYXJyYXkpIHtcbiAgICBvdXRwdXQgPSBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKTtcbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGN0eC5zZWVuLnBvcCgpO1xuXG4gIHJldHVybiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHZhciBzaW1wbGUgPSAnXFwnJyArIEpTT04uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgIHJldHVybiBjdHguc3R5bGl6ZShzaW1wbGUsICdzdHJpbmcnKTtcbiAgfVxuICBpZiAoaXNOdW1iZXIodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnbnVtYmVyJyk7XG4gIGlmIChpc0Jvb2xlYW4odmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnYm9vbGVhbicpO1xuICAvLyBGb3Igc29tZSByZWFzb24gdHlwZW9mIG51bGwgaXMgXCJvYmplY3RcIiwgc28gc3BlY2lhbCBjYXNlIGhlcmUuXG4gIGlmIChpc051bGwodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnbnVsbCcsICdudWxsJyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IodmFsdWUpIHtcbiAgcmV0dXJuICdbJyArIEVycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSArICddJztcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkodmFsdWUsIFN0cmluZyhpKSkpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAgU3RyaW5nKGkpLCB0cnVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dC5wdXNoKCcnKTtcbiAgICB9XG4gIH1cbiAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIGlmICgha2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBrZXksIHRydWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpIHtcbiAgdmFyIG5hbWUsIHN0ciwgZGVzYztcbiAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIGtleSkgfHwgeyB2YWx1ZTogdmFsdWVba2V5XSB9O1xuICBpZiAoZGVzYy5nZXQpIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmICghaGFzT3duUHJvcGVydHkodmlzaWJsZUtleXMsIGtleSkpIHtcbiAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICB9XG4gIGlmICghc3RyKSB7XG4gICAgaWYgKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSkgPCAwKSB7XG4gICAgICBpZiAoaXNOdWxsKHJlY3Vyc2VUaW1lcykpIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgcmVjdXJzZVRpbWVzIC0gMSk7XG4gICAgICB9XG4gICAgICBpZiAoc3RyLmluZGV4T2YoJ1xcbicpID4gLTEpIHtcbiAgICAgICAgaWYgKGFycmF5KSB7XG4gICAgICAgICAgc3RyID0gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgPSAnXFxuJyArIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICBpZiAoYXJyYXkgJiYga2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgbmFtZSA9IEpTT04uc3RyaW5naWZ5KCcnICsga2V5KTtcbiAgICBpZiAobmFtZS5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykpIHtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG59XG5cblxuZnVuY3Rpb24gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpIHtcbiAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgdmFyIGxlbmd0aCA9IG91dHB1dC5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XG4gICAgbnVtTGluZXNFc3QrKztcbiAgICBpZiAoY3VyLmluZGV4T2YoJ1xcbicpID49IDApIG51bUxpbmVzRXN0Kys7XG4gICAgcmV0dXJuIHByZXYgKyBjdXIucmVwbGFjZSgvXFx1MDAxYlxcW1xcZFxcZD9tL2csICcnKS5sZW5ndGggKyAxO1xuICB9LCAwKTtcblxuICBpZiAobGVuZ3RoID4gNjApIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICtcbiAgICAgICAgICAgKGJhc2UgPT09ICcnID8gJycgOiBiYXNlICsgJ1xcbiAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIGJyYWNlc1sxXTtcbiAgfVxuXG4gIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgJyAnICsgb3V0cHV0LmpvaW4oJywgJykgKyAnICcgKyBicmFjZXNbMV07XG59XG5cblxuLy8gTk9URTogVGhlc2UgdHlwZSBjaGVja2luZyBmdW5jdGlvbnMgaW50ZW50aW9uYWxseSBkb24ndCB1c2UgYGluc3RhbmNlb2ZgXG4vLyBiZWNhdXNlIGl0IGlzIGZyYWdpbGUgYW5kIGNhbiBiZSBlYXNpbHkgZmFrZWQgd2l0aCBgT2JqZWN0LmNyZWF0ZSgpYC5cbmZ1bmN0aW9uIGlzQXJyYXkoYXIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXIpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gaXNCb29sZWFuKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nO1xufVxuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbmZ1bmN0aW9uIGlzTnVsbChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsID0gaXNOdWxsO1xuXG5mdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGxPclVuZGVmaW5lZCA9IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG5mdW5jdGlvbiBpc1N0cmluZyhhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N5bWJvbChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnO1xufVxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc1JlZ0V4cChyZSkge1xuICByZXR1cm4gaXNPYmplY3QocmUpICYmIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gaXNPYmplY3QoZCkgJiYgb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGUpICYmXG4gICAgICAob2JqZWN0VG9TdHJpbmcoZSkgPT09ICdbb2JqZWN0IEVycm9yXScgfHwgZSBpbnN0YW5jZW9mIEVycm9yKTtcbn1cbmV4cG9ydHMuaXNFcnJvciA9IGlzRXJyb3I7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3ltYm9sJyB8fCAgLy8gRVM2IHN5bWJvbFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbmV4cG9ydHMuaXNCdWZmZXIgPSByZXF1aXJlKCcuL3N1cHBvcnQvaXNCdWZmZXInKTtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuXG5cbmZ1bmN0aW9uIHBhZChuKSB7XG4gIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuLnRvU3RyaW5nKDEwKSA6IG4udG9TdHJpbmcoMTApO1xufVxuXG5cbnZhciBtb250aHMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJyxcbiAgICAgICAgICAgICAgJ09jdCcsICdOb3YnLCAnRGVjJ107XG5cbi8vIDI2IEZlYiAxNjoxOTozNFxuZnVuY3Rpb24gdGltZXN0YW1wKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gIHZhciB0aW1lID0gW3BhZChkLmdldEhvdXJzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRNaW51dGVzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCc6Jyk7XG4gIHJldHVybiBbZC5nZXREYXRlKCksIG1vbnRoc1tkLmdldE1vbnRoKCldLCB0aW1lXS5qb2luKCcgJyk7XG59XG5cblxuLy8gbG9nIGlzIGp1c3QgYSB0aGluIHdyYXBwZXIgdG8gY29uc29sZS5sb2cgdGhhdCBwcmVwZW5kcyBhIHRpbWVzdGFtcFxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJyVzIC0gJXMnLCB0aW1lc3RhbXAoKSwgZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKSk7XG59O1xuXG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyLlxuICpcbiAqIFRoZSBGdW5jdGlvbi5wcm90b3R5cGUuaW5oZXJpdHMgZnJvbSBsYW5nLmpzIHJld3JpdHRlbiBhcyBhIHN0YW5kYWxvbmVcbiAqIGZ1bmN0aW9uIChub3Qgb24gRnVuY3Rpb24ucHJvdG90eXBlKS4gTk9URTogSWYgdGhpcyBmaWxlIGlzIHRvIGJlIGxvYWRlZFxuICogZHVyaW5nIGJvb3RzdHJhcHBpbmcgdGhpcyBmdW5jdGlvbiBuZWVkcyB0byBiZSByZXdyaXR0ZW4gdXNpbmcgc29tZSBuYXRpdmVcbiAqIGZ1bmN0aW9ucyBhcyBwcm90b3R5cGUgc2V0dXAgdXNpbmcgbm9ybWFsIEphdmFTY3JpcHQgZG9lcyBub3Qgd29yayBhc1xuICogZXhwZWN0ZWQgZHVyaW5nIGJvb3RzdHJhcHBpbmcgKHNlZSBtaXJyb3IuanMgaW4gcjExNDkwMykuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB3aGljaCBuZWVkcyB0byBpbmhlcml0IHRoZVxuICogICAgIHByb3RvdHlwZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBpbmhlcml0IHByb3RvdHlwZSBmcm9tLlxuICovXG5leHBvcnRzLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuZXhwb3J0cy5fZXh0ZW5kID0gZnVuY3Rpb24ob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCAhaXNPYmplY3QoYWRkKSkgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn07XG5cbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9+L25vZGUtbGlicy1icm93c2VyL34vdXRpbC91dGlsLmpzXG4gKiogbW9kdWxlIGlkID0gMThcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTNcbiAqKi8iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gcmVzb2x2ZXMgLiBhbmQgLi4gZWxlbWVudHMgaW4gYSBwYXRoIGFycmF5IHdpdGggZGlyZWN0b3J5IG5hbWVzIHRoZXJlXG4vLyBtdXN0IGJlIG5vIHNsYXNoZXMsIGVtcHR5IGVsZW1lbnRzLCBvciBkZXZpY2UgbmFtZXMgKGM6XFwpIGluIHRoZSBhcnJheVxuLy8gKHNvIGFsc28gbm8gbGVhZGluZyBhbmQgdHJhaWxpbmcgc2xhc2hlcyAtIGl0IGRvZXMgbm90IGRpc3Rpbmd1aXNoXG4vLyByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgcGF0aHMpXG5mdW5jdGlvbiBub3JtYWxpemVBcnJheShwYXJ0cywgYWxsb3dBYm92ZVJvb3QpIHtcbiAgLy8gaWYgdGhlIHBhdGggdHJpZXMgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIGB1cGAgZW5kcyB1cCA+IDBcbiAgdmFyIHVwID0gMDtcbiAgZm9yICh2YXIgaSA9IHBhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdmFyIGxhc3QgPSBwYXJ0c1tpXTtcbiAgICBpZiAobGFzdCA9PT0gJy4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwLS07XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgdGhlIHBhdGggaXMgYWxsb3dlZCB0byBnbyBhYm92ZSB0aGUgcm9vdCwgcmVzdG9yZSBsZWFkaW5nIC4uc1xuICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICBmb3IgKDsgdXAtLTsgdXApIHtcbiAgICAgIHBhcnRzLnVuc2hpZnQoJy4uJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzO1xufVxuXG4vLyBTcGxpdCBhIGZpbGVuYW1lIGludG8gW3Jvb3QsIGRpciwgYmFzZW5hbWUsIGV4dF0sIHVuaXggdmVyc2lvblxuLy8gJ3Jvb3QnIGlzIGp1c3QgYSBzbGFzaCwgb3Igbm90aGluZy5cbnZhciBzcGxpdFBhdGhSZSA9XG4gICAgL14oXFwvP3wpKFtcXHNcXFNdKj8pKCg/OlxcLnsxLDJ9fFteXFwvXSs/fCkoXFwuW14uXFwvXSp8KSkoPzpbXFwvXSopJC87XG52YXIgc3BsaXRQYXRoID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgcmV0dXJuIHNwbGl0UGF0aFJlLmV4ZWMoZmlsZW5hbWUpLnNsaWNlKDEpO1xufTtcblxuLy8gcGF0aC5yZXNvbHZlKFtmcm9tIC4uLl0sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZXNvbHZlID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXNvbHZlZFBhdGggPSAnJyxcbiAgICAgIHJlc29sdmVkQWJzb2x1dGUgPSBmYWxzZTtcblxuICBmb3IgKHZhciBpID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gLTEgJiYgIXJlc29sdmVkQWJzb2x1dGU7IGktLSkge1xuICAgIHZhciBwYXRoID0gKGkgPj0gMCkgPyBhcmd1bWVudHNbaV0gOiBwcm9jZXNzLmN3ZCgpO1xuXG4gICAgLy8gU2tpcCBlbXB0eSBhbmQgaW52YWxpZCBlbnRyaWVzXG4gICAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGgucmVzb2x2ZSBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9IGVsc2UgaWYgKCFwYXRoKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICByZXNvbHZlZFBhdGggPSBwYXRoICsgJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgIHJlc29sdmVkQWJzb2x1dGUgPSBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xuICB9XG5cbiAgLy8gQXQgdGhpcyBwb2ludCB0aGUgcGF0aCBzaG91bGQgYmUgcmVzb2x2ZWQgdG8gYSBmdWxsIGFic29sdXRlIHBhdGgsIGJ1dFxuICAvLyBoYW5kbGUgcmVsYXRpdmUgcGF0aHMgdG8gYmUgc2FmZSAobWlnaHQgaGFwcGVuIHdoZW4gcHJvY2Vzcy5jd2QoKSBmYWlscylcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcmVzb2x2ZWRQYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHJlc29sdmVkUGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFyZXNvbHZlZEFic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgcmV0dXJuICgocmVzb2x2ZWRBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHJlc29sdmVkUGF0aCkgfHwgJy4nO1xufTtcblxuLy8gcGF0aC5ub3JtYWxpemUocGF0aClcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMubm9ybWFsaXplID0gZnVuY3Rpb24ocGF0aCkge1xuICB2YXIgaXNBYnNvbHV0ZSA9IGV4cG9ydHMuaXNBYnNvbHV0ZShwYXRoKSxcbiAgICAgIHRyYWlsaW5nU2xhc2ggPSBzdWJzdHIocGF0aCwgLTEpID09PSAnLyc7XG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFpc0Fic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgaWYgKCFwYXRoICYmICFpc0Fic29sdXRlKSB7XG4gICAgcGF0aCA9ICcuJztcbiAgfVxuICBpZiAocGF0aCAmJiB0cmFpbGluZ1NsYXNoKSB7XG4gICAgcGF0aCArPSAnLyc7XG4gIH1cblxuICByZXR1cm4gKGlzQWJzb2x1dGUgPyAnLycgOiAnJykgKyBwYXRoO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5pc0Fic29sdXRlID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuam9pbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcGF0aHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICByZXR1cm4gZXhwb3J0cy5ub3JtYWxpemUoZmlsdGVyKHBhdGhzLCBmdW5jdGlvbihwLCBpbmRleCkge1xuICAgIGlmICh0eXBlb2YgcCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLmpvaW4gbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfVxuICAgIHJldHVybiBwO1xuICB9KS5qb2luKCcvJykpO1xufTtcblxuXG4vLyBwYXRoLnJlbGF0aXZlKGZyb20sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZWxhdGl2ZSA9IGZ1bmN0aW9uKGZyb20sIHRvKSB7XG4gIGZyb20gPSBleHBvcnRzLnJlc29sdmUoZnJvbSkuc3Vic3RyKDEpO1xuICB0byA9IGV4cG9ydHMucmVzb2x2ZSh0bykuc3Vic3RyKDEpO1xuXG4gIGZ1bmN0aW9uIHRyaW0oYXJyKSB7XG4gICAgdmFyIHN0YXJ0ID0gMDtcbiAgICBmb3IgKDsgc3RhcnQgPCBhcnIubGVuZ3RoOyBzdGFydCsrKSB7XG4gICAgICBpZiAoYXJyW3N0YXJ0XSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIHZhciBlbmQgPSBhcnIubGVuZ3RoIC0gMTtcbiAgICBmb3IgKDsgZW5kID49IDA7IGVuZC0tKSB7XG4gICAgICBpZiAoYXJyW2VuZF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoc3RhcnQgPiBlbmQpIHJldHVybiBbXTtcbiAgICByZXR1cm4gYXJyLnNsaWNlKHN0YXJ0LCBlbmQgLSBzdGFydCArIDEpO1xuICB9XG5cbiAgdmFyIGZyb21QYXJ0cyA9IHRyaW0oZnJvbS5zcGxpdCgnLycpKTtcbiAgdmFyIHRvUGFydHMgPSB0cmltKHRvLnNwbGl0KCcvJykpO1xuXG4gIHZhciBsZW5ndGggPSBNYXRoLm1pbihmcm9tUGFydHMubGVuZ3RoLCB0b1BhcnRzLmxlbmd0aCk7XG4gIHZhciBzYW1lUGFydHNMZW5ndGggPSBsZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZnJvbVBhcnRzW2ldICE9PSB0b1BhcnRzW2ldKSB7XG4gICAgICBzYW1lUGFydHNMZW5ndGggPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdmFyIG91dHB1dFBhcnRzID0gW107XG4gIGZvciAodmFyIGkgPSBzYW1lUGFydHNMZW5ndGg7IGkgPCBmcm9tUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBvdXRwdXRQYXJ0cy5wdXNoKCcuLicpO1xuICB9XG5cbiAgb3V0cHV0UGFydHMgPSBvdXRwdXRQYXJ0cy5jb25jYXQodG9QYXJ0cy5zbGljZShzYW1lUGFydHNMZW5ndGgpKTtcblxuICByZXR1cm4gb3V0cHV0UGFydHMuam9pbignLycpO1xufTtcblxuZXhwb3J0cy5zZXAgPSAnLyc7XG5leHBvcnRzLmRlbGltaXRlciA9ICc6JztcblxuZXhwb3J0cy5kaXJuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICB2YXIgcmVzdWx0ID0gc3BsaXRQYXRoKHBhdGgpLFxuICAgICAgcm9vdCA9IHJlc3VsdFswXSxcbiAgICAgIGRpciA9IHJlc3VsdFsxXTtcblxuICBpZiAoIXJvb3QgJiYgIWRpcikge1xuICAgIC8vIE5vIGRpcm5hbWUgd2hhdHNvZXZlclxuICAgIHJldHVybiAnLic7XG4gIH1cblxuICBpZiAoZGlyKSB7XG4gICAgLy8gSXQgaGFzIGEgZGlybmFtZSwgc3RyaXAgdHJhaWxpbmcgc2xhc2hcbiAgICBkaXIgPSBkaXIuc3Vic3RyKDAsIGRpci5sZW5ndGggLSAxKTtcbiAgfVxuXG4gIHJldHVybiByb290ICsgZGlyO1xufTtcblxuXG5leHBvcnRzLmJhc2VuYW1lID0gZnVuY3Rpb24ocGF0aCwgZXh0KSB7XG4gIHZhciBmID0gc3BsaXRQYXRoKHBhdGgpWzJdO1xuICAvLyBUT0RPOiBtYWtlIHRoaXMgY29tcGFyaXNvbiBjYXNlLWluc2Vuc2l0aXZlIG9uIHdpbmRvd3M/XG4gIGlmIChleHQgJiYgZi5zdWJzdHIoLTEgKiBleHQubGVuZ3RoKSA9PT0gZXh0KSB7XG4gICAgZiA9IGYuc3Vic3RyKDAsIGYubGVuZ3RoIC0gZXh0Lmxlbmd0aCk7XG4gIH1cbiAgcmV0dXJuIGY7XG59O1xuXG5cbmV4cG9ydHMuZXh0bmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHNwbGl0UGF0aChwYXRoKVszXTtcbn07XG5cbmZ1bmN0aW9uIGZpbHRlciAoeHMsIGYpIHtcbiAgICBpZiAoeHMuZmlsdGVyKSByZXR1cm4geHMuZmlsdGVyKGYpO1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChmKHhzW2ldLCBpLCB4cykpIHJlcy5wdXNoKHhzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuLy8gU3RyaW5nLnByb3RvdHlwZS5zdWJzdHIgLSBuZWdhdGl2ZSBpbmRleCBkb24ndCB3b3JrIGluIElFOFxudmFyIHN1YnN0ciA9ICdhYicuc3Vic3RyKC0xKSA9PT0gJ2InXG4gICAgPyBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7IHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pIH1cbiAgICA6IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSBzdHIubGVuZ3RoICsgc3RhcnQ7XG4gICAgICAgIHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pO1xuICAgIH1cbjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9wYXRoLWJyb3dzZXJpZnkvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAxOVxuICoqIG1vZHVsZSBjaHVua3MgPSAxM1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9zcmMvYXVkaW8tbWFuYWdlcicpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcG90aW9uLWF1ZGlvL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMjBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTNcbiAqKi8iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IHRydWU7XG4gICAgdmFyIGN1cnJlbnRRdWV1ZTtcbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgICAgICAgY3VycmVudFF1ZXVlW2ldKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xufVxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICBxdWV1ZS5wdXNoKGZ1bik7XG4gICAgaWYgKCFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3Byb2Nlc3MvYnJvd3Nlci5qc1xuICoqIG1vZHVsZSBpZCA9IDIxXG4gKiogbW9kdWxlIGNodW5rcyA9IDEzXG4gKiovIiwidmFyIExvYWRlZEF1ZGlvID0gcmVxdWlyZSgnLi9sb2FkZWQtYXVkaW8nKTtcblxudmFyIEF1ZGlvTWFuYWdlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuXG4gIHRoaXMuX2N0eCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAgdGhpcy5fbWFzdGVyR2FpbiA9IHRoaXMuX2N0eC5jcmVhdGVHYWluKCk7XG4gIHRoaXMuX3ZvbHVtZSA9IDE7XG4gIHRoaXMuaXNNdXRlZCA9IGZhbHNlO1xuXG4gIHZhciBpT1MgPSAvKGlQYWR8aVBob25lfGlQb2QpL2cudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgaWYgKGlPUykge1xuICAgIHRoaXMuX2VuYWJsZWlPUygpO1xuICB9XG59O1xuXG5BdWRpb01hbmFnZXIucHJvdG90eXBlLl9lbmFibGVpT1MgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciB0b3VjaCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBidWZmZXIgPSBzZWxmLl9jdHguY3JlYXRlQnVmZmVyKDEsIDEsIDIyMDUwKTtcbiAgICB2YXIgc291cmNlID0gc2VsZi5fY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgIHNvdXJjZS5idWZmZXIgPSBidWZmZXI7XG4gICAgc291cmNlLmNvbm5lY3Qoc2VsZi5fY3R4LmRlc3RpbmF0aW9uKTtcbiAgICBzb3VyY2Uuc3RhcnQoMCk7XG5cbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRvdWNoLCBmYWxzZSk7XG4gIH07XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0b3VjaCwgZmFsc2UpO1xufTtcblxuQXVkaW9NYW5hZ2VyLnByb3RvdHlwZS5tdXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuaXNNdXRlZCA9IHRydWU7XG4gIHRoaXMuX3VwZGF0ZU11dGUoKTtcbn07XG5cbkF1ZGlvTWFuYWdlci5wcm90b3R5cGUudW5tdXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuaXNNdXRlZCA9IGZhbHNlO1xuICB0aGlzLl91cGRhdGVNdXRlKCk7XG59O1xuXG5BdWRpb01hbmFnZXIucHJvdG90eXBlLnRvZ2dsZU11dGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5pc011dGVkID0gIXRoaXMuaXNNdXRlZDtcbiAgdGhpcy5fdXBkYXRlTXV0ZSgpO1xufTtcblxuQXVkaW9NYW5hZ2VyLnByb3RvdHlwZS5fdXBkYXRlTXV0ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9tYXN0ZXJHYWluLmdhaW4udmFsdWUgPSB0aGlzLmlzTXV0ZWQgPyAwIDogdGhpcy5fdm9sdW1lO1xufTtcblxuQXVkaW9NYW5hZ2VyLnByb3RvdHlwZS5zZXRWb2x1bWUgPSBmdW5jdGlvbih2b2x1bWUpIHtcbiAgdGhpcy5fdm9sdW1lID0gdm9sdW1lO1xuICB0aGlzLl9tYXN0ZXJHYWluLmdhaW4udmFsdWUgPSB2b2x1bWU7XG59O1xuXG5BdWRpb01hbmFnZXIucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbih1cmwsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcbiAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBzZWxmLmRlY29kZUF1ZGlvRGF0YShyZXF1ZXN0LnJlc3BvbnNlLCBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIGNhbGxiYWNrKHNvdXJjZSk7XG4gICAgfSk7XG4gIH07XG4gIHJlcXVlc3Quc2VuZCgpO1xufTtcblxuQXVkaW9NYW5hZ2VyLnByb3RvdHlwZS5kZWNvZGVBdWRpb0RhdGEgPSBmdW5jdGlvbihkYXRhLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdGhpcy5fY3R4LmRlY29kZUF1ZGlvRGF0YShkYXRhLCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICB2YXIgYXVkaW8gPSBuZXcgTG9hZGVkQXVkaW8oc2VsZi5fY3R4LCByZXN1bHQsIHNlbGYuX21hc3RlckdhaW4pO1xuXG4gICAgY2FsbGJhY2soYXVkaW8pO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXVkaW9NYW5hZ2VyO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcG90aW9uLWF1ZGlvL3NyYy9hdWRpby1tYW5hZ2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyKGFyZykge1xuICByZXR1cm4gYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIGFyZy5jb3B5ID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5maWxsID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5yZWFkVUludDggPT09ICdmdW5jdGlvbic7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyM1xuICoqIG1vZHVsZSBjaHVua3MgPSAxM1xuICoqLyIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3V0aWwvfi9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMTNcbiAqKi8iLCJ2YXIgUGxheWluZ0F1ZGlvID0gcmVxdWlyZSgnLi9wbGF5aW5nLWF1ZGlvJyk7XG5cbnZhciBMb2FkZWRBdWRpbyA9IGZ1bmN0aW9uKGN0eCwgYnVmZmVyLCBtYXN0ZXJHYWluKSB7XG4gIHRoaXMuX2N0eCA9IGN0eDtcbiAgdGhpcy5fbWFzdGVyR2FpbiA9IG1hc3RlckdhaW47XG4gIHRoaXMuX2J1ZmZlciA9IGJ1ZmZlcjtcbiAgdGhpcy5fYnVmZmVyLmxvb3AgPSBmYWxzZTtcbn07XG5cbkxvYWRlZEF1ZGlvLnByb3RvdHlwZS5fY3JlYXRlU291bmQgPSBmdW5jdGlvbihnYWluKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzLl9jdHguY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gIHNvdXJjZS5idWZmZXIgPSB0aGlzLl9idWZmZXI7XG5cbiAgdGhpcy5fbWFzdGVyR2Fpbi5jb25uZWN0KHRoaXMuX2N0eC5kZXN0aW5hdGlvbik7XG5cbiAgZ2Fpbi5jb25uZWN0KHRoaXMuX21hc3RlckdhaW4pO1xuXG4gIHNvdXJjZS5jb25uZWN0KGdhaW4pO1xuXG4gIHJldHVybiBzb3VyY2U7XG59O1xuXG5Mb2FkZWRBdWRpby5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZ2FpbiA9IHRoaXMuX2N0eC5jcmVhdGVHYWluKCk7XG5cbiAgdmFyIHNvdW5kID0gdGhpcy5fY3JlYXRlU291bmQoZ2Fpbik7XG5cbiAgc291bmQuc3RhcnQoMCk7XG5cbiAgcmV0dXJuIG5ldyBQbGF5aW5nQXVkaW8oc291bmQsIGdhaW4pO1xufTtcblxuTG9hZGVkQXVkaW8ucHJvdG90eXBlLmZhZGVJbiA9IGZ1bmN0aW9uKHZhbHVlLCB0aW1lKSB7XG4gIHZhciBnYWluID0gdGhpcy5fY3R4LmNyZWF0ZUdhaW4oKTtcblxuICB2YXIgc291bmQgPSB0aGlzLl9jcmVhdGVTb3VuZChnYWluKTtcblxuICBnYWluLmdhaW4uc2V0VmFsdWVBdFRpbWUoMCwgMCk7XG4gIGdhaW4uZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLjAxLCAwKTtcbiAgZ2Fpbi5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHZhbHVlLCB0aW1lKTtcblxuICBzb3VuZC5zdGFydCgwKTtcblxuICByZXR1cm4gbmV3IFBsYXlpbmdBdWRpbyhzb3VuZCwgZ2Fpbik7XG59O1xuXG5Mb2FkZWRBdWRpby5wcm90b3R5cGUubG9vcCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZ2FpbiA9IHRoaXMuX2N0eC5jcmVhdGVHYWluKCk7XG5cbiAgdmFyIHNvdW5kID0gdGhpcy5fY3JlYXRlU291bmQoZ2Fpbik7XG5cbiAgc291bmQubG9vcCA9IHRydWU7XG4gIHNvdW5kLnN0YXJ0KDApO1xuXG4gIHJldHVybiBuZXcgUGxheWluZ0F1ZGlvKHNvdW5kLCBnYWluKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGVkQXVkaW87XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9wb3Rpb24tYXVkaW8vc3JjL2xvYWRlZC1hdWRpby5qc1xuICoqIG1vZHVsZSBpZCA9IDI1XG4gKiogbW9kdWxlIGNodW5rcyA9IDEzXG4gKiovIiwidmFyIFBsYXlpbmdBdWRpbyA9IGZ1bmN0aW9uKHNvdXJjZSwgZ2Fpbikge1xuICB0aGlzLl9nYWluID0gZ2FpbjtcbiAgdGhpcy5fc291cmNlID0gc291cmNlO1xufTtcblxuUGxheWluZ0F1ZGlvLnByb3RvdHlwZS5zZXRWb2x1bWUgPSBmdW5jdGlvbih2b2x1bWUpIHtcbiAgdGhpcy5fZ2Fpbi5nYWluLnZhbHVlID0gdm9sdW1lO1xufTtcblxuUGxheWluZ0F1ZGlvLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3NvdXJjZS5zdG9wKDApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5aW5nQXVkaW87XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9wb3Rpb24tYXVkaW8vc3JjL3BsYXlpbmctYXVkaW8uanNcbiAqKiBtb2R1bGUgaWQgPSAyNlxuICoqIG1vZHVsZSBjaHVua3MgPSAxM1xuICoqLyJdLCJzb3VyY2VSb290IjoiIiwiZmlsZSI6InNoYXJlZC5qcyJ9