# emitting-map

A map that emits events when it is updated. The events are simple and ensure that you can easily keep views, other stores, and whatever else in sync with it.


## Example

```javascript
var EmittingMap = require('emitting-map');

// Initial state can be passed during construction, or it will be empty
var map = new EmittingMap({some: 'values', and: 'keys'});

// The handler will be called once for each event required to bring a new listener
// up to date with the current state of the map
counter.onChange(function(type, index, item) {
	switch(type) {
	case 'set':
		view.insertChild(item, index);
		break;
	case 'delete':
		view.removeChildAt(index);
	}
});

// The handler will be called again with this new update
list.delete('some');
```


## Methods

* `.get(index)` - Gets the value stored at `index`
* `.push(item)` - Adds `item` to the end of the list
* `.pop()` - Removes the last item from the end of the list and returns it
* `.unshift(item)` - Adds `item` to the front of the list
* `.shift()` - Removed first item of the list and returns it
* `.splice(startIndex, removeCount, ...itemsToAdd)` - Starting at `startIndex`, removed `removeCount` items and add each item in `itemsToAdd`
* `.onChange(fn)` - Registers `fn` as a handler that will be called whenever the list is updated. Also returns a function that will unregister your callback when called.
