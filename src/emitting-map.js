export default class EmittingMap {
	constructor(map, opts = {}) {
		this._handlers = new Set();

		this._state = new Map();

		this._deleteOnSet = opts.deleteOnSet || false;


		if(map instanceof Map) {
			map.forEach((value, key) => {
				this._state.set(key, value);
			});
		} else if(typeof map === 'object') {
			Object.keys(map).forEach(key => {
				this._state.set(key, map[key]);
			});
		}
	}

	onChange(fn) {
		if(typeof fn !== 'function') {
			throw new Error('Argument to onChange must be a function');
		}

		this._handlers.add(fn);

		// Initialize
		this._state.forEach((value, key) => {
			fn('set', key, value);
		});

		return () => {
			this._handlers.delete(fn);
		};
	}

	set(key, value) {
		if(this._deleteOnSet && this._state.has(key)) {
			this.delete(key);
		}

		this._state.set(key, value);

		this._emit('set', key, value);
	}

	delete(key) {
		if(!this._state.has(key)) return;

		let removedValue = this._state.get(key);

		this._state.delete(key);

		this._emit('delete', key, removedValue);
	}

	get(key) {
		return this._state.get(key);
	}

	_emit(type, index, item) {
		this._handlers.forEach(fn => {
			fn(type, index, item);
		});
	}
}
