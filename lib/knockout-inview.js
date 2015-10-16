"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var listeners = [];

var isOverlapping = function isOverlapping(x1, x2, y1, y2) {
  return x1 <= y2 && y1 <= x2;
};

var addListener = function addListener(element, value) {

  var listener = function listener() {

    var rect = element.getBoundingClientRect();
    var isInview = isOverlapping(rect.top, rect.bottom, 0, window.outerHeight);

    if (!isInview && value()) {
      value(false);
    }

    if (isInview && !value()) {
      value(true);
    }
  };

  window.addEventListener("scroll", listener);

  listeners.push({ element: element, listener: listener });

  listener();
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

var init = function init(element, valueAccessor) {

  var value = valueAccessor();

  addListener(element, value);

  if (ko) {
    ko.utils.domNodeDisposal.addDisposeCallback(element, removeListener(element));
  }
};

exports["default"] = { init: init };
module.exports = exports["default"];