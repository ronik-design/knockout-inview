
const listeners = [];
const states = [];

const isOverlapping = function (x1, x2, y1, y2) {
  return x1 <= y2 && y1 <= x2;
};

const getState = function (element) {
  const filtered = states.filter((s) => s.element === element);
  if (filtered && filtered.length) {
    return filtered[0].value;
  }
};

const setState = function (element, value) {
  const filtered = states.filter((s) => s.element === element);
  if (filtered && filtered.length) {
    filtered[0].value = value;
  } else {
    states.push({ element, value });
  }
};

const removeListener = function (element) {

  return function () {

    const listener = listeners.filter((l) => l.element === element);

    if (listener[0]) {
      window.removeEventListener("scroll", listener[0].listener);
    }
  };
};

const bindListener = function (element, listener) {

  window.addEventListener("scroll", listener);

  listeners.push({ element, listener });

  listener();
};

const addListenerObservable = function (element, observable, options) {

  const offset = options.offset;
  const fireOnce = options.fireOnce;

  const listener = function () {

    const rect = element.getBoundingClientRect();
    const top = offset === "bottom-in-view" ? rect.bottom : rect.top;
    const isInview = isOverlapping(top, rect.bottom, 0, window.outerHeight || screen.height);

    let fired = false;

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
    setTimeout(() => bindListener(element, listener), 0);
  } else {
    bindListener(element, listener);
  }
};

const addListenerCallback = function (element, callback, options) {

  const offset = options.offset;
  const fireOnce = options.fireOnce;

  const listener = function () {

    const rect = element.getBoundingClientRect();
    const top = offset === "bottom-in-view" ? rect.bottom : rect.top;
    const isInview = isOverlapping(top, rect.bottom, 0, window.outerHeight || screen.height);
    const state = getState(element);

    let fired = false;

    if (!isInview && state) {
      callback(element, false);
      setState(element, false);
      fired = true;
    }

    if (isInview && !state) {
      callback(element, true);
      setState(element, true);
      fired = true;
    }

    if (fireOnce && fired) {
      removeListener(element)();
    }
  };

  if (options.defer) {
    setTimeout(() => bindListener(element, listener), 0);
  } else {
    bindListener(element, listener);
  }
};

const binding = function (ko) {

  ko = ko || window.ko;

  const init = function (element, valueAccessor) {

    const value = valueAccessor();
    const handler = value.handler || value;
    const offset = value.offset || "in-view";
    const fireOnce = value.fireOnce === "true" || value.fireOnce === true;
    const defer = value.defer;

    if (ko.isObservable(handler)) {
      addListenerObservable(element, handler, { offset, fireOnce, defer });
    } else if (handler instanceof Function) {
      addListenerCallback(element, handler, { offset, fireOnce, defer });
    }

    ko.utils.domNodeDisposal.addDisposeCallback(element, removeListener(element));
  };

  return { init };
};

export default binding;
