import Ember from 'ember';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';

var App, server;

module('Integration - Speaker Page', {
	beforeEach: function() {
		App = startApp();
		var speakers = [
			{
				id: 1,
				name: 'Tom Dale'
			},
			{
				id: 2,
				name: 'Barnabas Bulpett'
			},
			{
				id: 3,
				name: 'Yehuda Katz'
			}
		];

		server = new Pretender(function() {
			this.get('/api/speakers', function(request) {
				return [200, {"Content-Type": "application/json"}, JSON.stringify({speakers: speakers})];
			});

			this.get('/api/speakers/:id', function(request) {
				var speaker = speakers.find(function(speaker) {
					if (speaker.id === parseInt(request.params.id, 10)) {
						return speaker;
					}
				});

        return [200, {"Content-Type": "application/json"}, JSON.stringify({speaker: speaker})];
			});
		});

	},
	afterEach: function() {
		Ember.run(App, 'destroy');
		server.shutdoen();
	}
});

test('Should allow navigation to the speakers page from the landing page', function(assert){
		visit('/').then(function() {
			click('a:contains("Speakers")').then(function(assert) {
				assert.equal(find('h3').text(), 'Speakers');
			});
		});
});

test('Should list all speakers', function(assert) {
	visit('/speakers').then(function() {
		assert.equal(find('a:contains("Tom Dale")').length, 1);
		assert.equal(find('a:contains("Barnabas Bulpett")').length, 1);
		assert.equal(find('a:contains("Yehuda Katz")').length, 1);
	});
});

test('Should be able to navigate to a speaker page', function(assert) {
	visit('/speakers').then(function() {
		click('a:contains("Tom Dale")').then(function() {
			assert.equal(find('h4').text(), 'Tom Dale');
		});
	});
});

test('Should be able to visit a speaker page', function(assert) {
	visit('/speakers/1').then(function() {
		assert.equal(find('h4').text(), 'Tom Dale');
	});
});

