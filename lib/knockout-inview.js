"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var listeners = [];
var states = [];

var isOverlapping = function isOverlapping(x1, x2, y1, y2) {
  return x1 <= y2 && y1 <= x2;
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

var bindListener = function bindListener(element, listener) {

  window.addEventListener("scroll", listener);

  listeners.push({ element: element, listener: listener });

  listener();
};

var addListenerObservable = function addListenerObservable(element, observable) {

  var listener = function listener() {

    var rect = element.getBoundingClientRect();
    var isInview = isOverlapping(rect.top, rect.bottom, 0, window.outerHeight);

    if (!isInview && observable()) {
      observable(false);
    }

    if (isInview && !observable()) {
      observable(true);
    }
  };

  bindListener(element, listener);
};

var addListenerCallback = function addListenerCallback(element, callback) {

  var listener = function listener() {

    var rect = element.getBoundingClientRect();
    var isInview = isOverlapping(rect.top, rect.bottom, 0, window.outerHeight);
    var state = getState(element);

    if (!isInview && state) {
      callback(element, false);
      setState(element, false);
    }

    if (isInview && !state) {
      callback(element, true);
      setState(element, true);
    }
  };

  bindListener(element, listener);
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

var binding = function binding(ko) {

  ko = ko || window.ko;

  var init = function init(element, valueAccessor) {

    var value = valueAccessor();

    if (ko.isObservable(value)) {
      addListenerObservable(element, value);
    } else if (value instanceof Function) {
      addListenerCallback(element, value);
    }

    ko.utils.domNodeDisposal.addDisposeCallback(element, removeListener(element));
  };

  return { init: init };
};

exports["default"] = binding;
module.exports = exports["default"];