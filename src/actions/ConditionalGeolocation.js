import { Action } from '../lib/Action';
import { Util } from '@aegis-framework/artemis';
import Geolocate from './Geolocate.js';

export class ConditionalGeolocation extends Action {

	static setup () {
		this.engine.history ('conditionalgeolocation');
	}

	static matchObject (statement) {
		return typeof statement.ConditionalGeolocation !== 'undefined';
	}

	constructor (statement) {
		super ();
		this.statement = statement.ConditionalGeolocation;
	}

	apply () {
		return new Promise ((resolve) => {

			var	interpolatedStatement = this.engine.replaceVariables (this.statement.Condition).split (' ');


 		const act = new Geolocate (interpolatedStatement);
		act.apply().then (() => {
			// Call the condition function. Since the function might use a
			// Promise.reject () to return as false, we also define a catch
			// block to run the False branch of the condition.
			//this.engine.run (this.statement.Condition, false);

				// Check if the function returned true so we run the True branch
				// of the conditional. If false is returned, we run the False
				// branch of the conditional and if a string is returned, we use
				// it as a key so we run the branch that has that key
				if (this.engine.checkAndResetIfLastActionFailed() === true) {
					this.engine.run (this.statement.False, false);
					this.engine.history ('conditionalgeolocation').push ('False');
				}  else {
					this.engine.run (this.statement.True, false);
					this.engine.history ('conditionalgeolocation').push ('True');
				}

				resolve ();
			});
		});
	}

	willRevert () {
		if (this.engine.history ('conditionalgeolocation').length > 0) {
			const conditional = this.engine.history ('conditionalgeolocation')[this.engine.history ('conditionalgeolocation').length - 1];
			if (this.statement[conditional] !== 'undefined') {
				return Promise.resolve ();
			}
		}
		return Promise.reject ();
	}

	revert () {
		const conditional = this.engine.history ('conditionalgeolocation')[this.engine.history ('conditionalgeolocation').length - 1];
		return this.engine.revert (this.statement[conditional], false);
	}

	didRevert () {
		this.engine.history ('conditionalgeolocation').pop ();
		return Promise.resolve ({ advance: false, step: false });
	}
}

ConditionalGeolocation.id = 'ConditionalGeolocation';

export default ConditionalGeolocation;
