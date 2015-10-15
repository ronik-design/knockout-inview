
const listeners = [];

const addListener = function (element, value) {

  const listener = function () {

    const rect = element.getBoundingClientRect();

    if (rect.bottom <= 0 && value()) {
      value(false);
    }

    if (rect.bottom >= 0 && !value()) {
      value(true);
    }
  };

  window.addEventListener("scroll", listener);

  listeners.push({ element, listener });

  listener();
};

const removeListener = function (element) {

  return function () {

    const listener = listeners.filter((l) => l.element === element);

    if (listener[0]) {
      window.removeEventListener("scroll", listener[0].listener);
    }
  };
};

const init = function (element, valueAccessor) {

  const value = valueAccessor();

  addListener(element, value);

  if (ko) {
    ko.utils.domNodeDisposal.addDisposeCallback(element, removeListener(element));
  }
};

export default { init };
