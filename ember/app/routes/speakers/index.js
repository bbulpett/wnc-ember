import Ember from 'ember';

export default Ember.Route.extend({
	model: functoin() {
		return this.store.find('speaker');
	}
});