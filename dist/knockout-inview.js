'use strict';

var listeners = [];
var states = [];

var isOverlapping = function isOverlapping(x1, x2, y1, y2) {
  return x1 <= y2 && y1 <= x2;
};

var isPercent = function isPercent(n) {
  return n === Number(n) && n <= 1 && (n % 1 !== 0 || n === 1);
};

var getTop = function getTop(top, bottom, mode, pad) {

  if (isPercent(pad)) {
    top += (bottom - top) * pad;
  }

  if (typeof pad === "number") {
    top += pad;
  }

  if (mode === "in-view" || mode === "top-in-view") {
    return top;
  }

  if (mode === "bottom-in-view") {
    return bottom;
  }
};

var getBottom = function getBottom(top, bottom, mode, pad) {

  if (isPercent(pad)) {
    top += (bottom - top) * pad;
  }

  if (typeof pad === "number") {
    top += pad;
  }

  if (mode === "top-in-view") {
    return top;
  }

  if (mode === "in-view" || mode === "bottom-in-view") {
    return bottom;
  }
};

var getState = function getState(element) {
  var filtered = states.filter(function (s) {
    return s.element === element;
  });
  if (filtered && filtered.length) {
    return filtered[0].value;
  }
};

var setState = function setState(element, value) {
  var filtered = states.filter(function (s) {
    return s.element === element;
  });
  if (filtered && filtered.length) {
    filtered[0].value = value;
  } else {
    states.push({ element: element, value: value });
  }
};

var removeListener = function removeListener(element) {

  return function () {

    var listener = listeners.filter(function (l) {
      return l.element === element;
    });

    if (listener[0]) {
      window.removeEventListener("scroll", listener[0].listener);
    }
  };
};

var bindListener = function bindListener(element, listener) {

  window.addEventListener("scroll", listener);

  listeners.push({ element: element, listener: listener });

  listener();
};

var isInViewport = function isInViewport(element, options) {
  var offset = options.offset;
  var pad = options.pad;

  var rect = element.getBoundingClientRect();
  var top = getTop(rect.top, rect.bottom, offset, pad);
  var bottom = getBottom(rect.top, rect.bottom, offset, pad);

  return isOverlapping(top, bottom, 0, window.outerHeight || screen.height);
};

var addListenerObservable = function addListenerObservable(element, observable, options) {

  var fireOnce = options.fireOnce;

  var listener = function listener() {

    var isInview = isInViewport(element, options);

    var fired = false;

    if (!isInview && observable()) {
      observable(false);
      fired = true;
    }

    if (isInview && !observable()) {
      observable(true);
      fired = true;
    }

    if (fireOnce && fired) {
      removeListener(element)();
    }
  };

  if (options.defer) {
    setTimeout(function () {
      return bindListener(element, listener);
    }, 0);
  } else {
    bindListener(element, listener);
  }
};

var addListenerCallback = function addListenerCallback(element, callback, options) {

  var fireOnce = options.fireOnce;

  var listener = function listener() {

    var isInview = isInViewport(element, options);
    var state = getState(element);

    var fired = false;

    if (!isInview && state) {
      callback(element, { isInview: isInview });
      setState(element, false);
      fired = true;
    }

    if (isInview && !state) {
      callback(element, { isInview: isInview });
      setState(element, true);
      fired = true;
    }

    if (fireOnce && fired) {
      removeListener(element)();
    }
  };

  if (options.defer) {
    setTimeout(function () {
      return bindListener(element, listener);
    }, 0);
  } else {
    bindListener(element, listener);
  }
};

var binding = function binding(ko) {

  ko = ko || window.ko;

  var init = function init(element, valueAccessor) {

    var value = valueAccessor();
    var handler = value.handler || value;
    var offset = value.offset || "in-view";
    var pad = value.pad;
    var fireOnce = value.fireOnce === "true" || value.fireOnce === true;
    var defer = value.defer;

    if (ko.isObservable(handler)) {
      addListenerObservable(element, handler, { offset: offset, fireOnce: fireOnce, defer: defer, pad: pad });
    } else if (handler instanceof Function) {
      addListenerCallback(element, handler, { offset: offset, fireOnce: fireOnce, defer: defer, pad: pad });
    }

    ko.utils.domNodeDisposal.addDisposeCallback(element, removeListener(element));
  };

  return { init: init };
};

module.exports = binding;