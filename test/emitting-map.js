var EmittingMap = require('../');

var assert = require('assert');


describe('EmittingMap', function() {
	it('is creatable', function() {
		var em = new EmittingMap();

		assert(em instanceof EmittingMap);
	});

	it('has a get method', function() {
		var em = new EmittingMap();

		assert(em.get);
	});

	it('has an onChange method', function() {
		var em = new EmittingMap();

		assert(em.onChange);
	});

	it('has a set method', function() {
		var em = new EmittingMap();

		assert(em.set);
	});

	it('has a delete method', function() {
		var em = new EmittingMap();

		assert(em.delete);
	});

	it('can initialize with a Map', function() {
		var em = new EmittingMap(new Map([['test', 6]]));

		assert.equal(em.get('test'), 6);
	});

	it('can initialize with an object', function() {
		var em = new EmittingMap({'test': 6});

		assert.equal(em.get('test'), 6);
	});

	it('can set a key', function() {
		var em = new EmittingMap();

		em.set('test', 'hug');

		assert.equal(em.get('test'), 'hug');
	});

	it('can delete a key', function() {
		var em = new EmittingMap({'test': 6});

		em.delete('test');

		assert.equal(em.get('test'), undefined);
	});

	it('emits init events when a listener is registered', function(done) {
		var em = new EmittingMap({'test': 6, 'gear': 'teststring', 'what': false});

		var values = [];
		em.onChange(function(type, key, value) {
			if(type === 'set') {
				values.push(value);

				if(values.length === 3) {
					assert.deepEqual(values, [6, 'teststring', false]);

					done();
				}
			}
		});
	});

	it('emits an event when a set happens', function(done) {
		var em = new EmittingMap();

		em.onChange(function(type, key, value) {
			assert.equal(type, 'set');
			assert.equal(key, 't');
			assert.equal(value, 5);

			done();
		});

		setTimeout(function() {
			em.set('t', 5);
		}, 10);
	});

	it('emits an event when an overwriting set happens', function(done) {
		var em = new EmittingMap({t: 2});

		var stage = 0;
		em.onChange(function(type, key, value) {
			switch(stage) {
			case 0:
				assert.equal(type, 'set');
				assert.equal(key, 't');
				assert.equal(value, 2);
				stage++;
				break;

			case 1:
				assert.equal(type, 'set');
				assert.equal(key, 't');
				assert.equal(value, 5);
				done();
			}
		});

		setTimeout(function() {
			em.set('t', 5);
		}, 10);
	});

	it('emits two events when an overwriting set happens with deleteOnSet option', function(done) {
		var em = new EmittingMap({t: 2}, {deleteOnSet: true});

		var stage = 0;
		em.onChange(function(type, key, value) {
			switch(stage) {
			case 0:
				assert.equal(type, 'set');
				assert.equal(key, 't');
				assert.equal(value, 2);
				stage++;
				break;

			case 1:
				assert.equal(type, 'delete');
				assert.equal(key, 't');
				stage++;
				break;

			case 2:
				assert.equal(type, 'set');
				assert.equal(key, 't');
				assert.equal(value, 5);
				done();
			}
		});

		setTimeout(function() {
			em.set('t', 5);
		}, 10);
	});

	it('emits an event when a delete happens', function(done) {
		var em = new EmittingMap({t: 1});

		em.onChange(function(type, key, value) {
			if(type === 'delete') {
				assert.equal(key, 't');
				assert.equal(value, 1);

				done();
			}
		});

		em.delete('t');
	});
});
