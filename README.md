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
