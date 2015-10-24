# knockout-inview
Simple knockout binding to toggle a value when an element comes into or leaves the viewport.

# Usage
```html
<div data-bind="inview: foo"></div>
```

```js
var foo = ko.observable(false);
foo.subscribe(function (val) {
  // will be triggered when inview update the val
});
```

# Installation

This is how I use it with a Webpack bundled project. Your set-up may be different.

```sh
$ npm install knockout-inview --save-dev
```

```js
import ko from "knockout";
import inview from "knockout-inview";

ko.bindingHandlers.inview = inview(ko);
```
