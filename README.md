# emitting-map

A map that emits events when it is updated. The events are simple and ensure that you can easily keep views, other stores, and whatever else in sync with it.


## Example

```javascript
var EmittingMap = require('emitting-map');

// Initial state can be passed during construction, or it will be empty
var map = new EmittingMap({some: 'values', and: 'keys'}, {deleteOnSet: true});

// The handler will be called once for each event required to bring a new listener
// up to date with the current state of the map
counter.onChange(function(type, key, value) {
	switch(type) {
	case 'set':
		chatroom.addUser(value);
		break;
	case 'delete':
		chatroom.removeUser(value);
	}
});

// The handler will be called again with this new update
list.delete('some');
```


## Methods

* `constructor([map, options])` - `map` may be a Map instance, or a plain object. `options` should be an object with some properties:
  * deleteOnSet=false - If true, whenever an existing key is `set` first delete the key and emit the associated `delete` event.
* `.get(key)` - Returns the value stored in `key`
* `.set(key, value)` - Adds `key`/`value` pair to the map
* `.delete(key)` - Removes `key` from the map
* `.onChange(fn)` - Registers `fn` as a handler that will be called whenever the map is updated. Also returns a function that will unregister your callback when called.
