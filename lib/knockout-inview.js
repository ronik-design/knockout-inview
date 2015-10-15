"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var listeners = [];

var addListener = function addListener(element, value) {

  var listener = function listener() {

    var rect = element.getBoundingClientRect();

    if (rect.bottom <= 0 && value()) {
      value(false);
    }

    if (rect.bottom >= 0 && !value()) {
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