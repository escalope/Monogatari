import { Action } from './../lib/Action';
import { FancyError } from './../lib/FancyError';

export class WaitEvent extends Action {

	static matchString ([ action ]) {
		return action === 'waitevent';
	}

	constructor ([ action, eventName, time = 100 ]) {
		super ();

		this.eventName=eventName;
		// Check if the provided time is a valid integer
		if (!isNaN (time)) {
			this.time = parseInt (time);
		} else {
			FancyError.show (
				'The specified time was not an integer',
				'Monogatari attempted to transform the given time into an integer value but failed.',
				{
					'Specified time': time,
					'Statement': `<code class='language=javascript'>"${this._statement}"</code>`,
					'Label': this.engine.state ('label'),
					'Step': this.engine.state ('step'),
					'Help': {
						'_': 'Check if the value you provided is actually an integer (whole number). Remember the value used must be given in milliseconds and must not be mixed with characters other than numbers.',
						'_1': 'For example, the following statement would make the game wait for 5 seconds:',
						'_3':`
						<pre><code class='language-javascript'>"wait 5000"</code></pre>
						`
					}
				}
			);
		}
	}

waitForEvent(resolve){
		setTimeout (() => {
			if (this.engine.pollEvent(this.eventName)){
				// Unlock the game when the timeout ends.
				this.engine.global ('block', false);
				resolve ();
			} else {
				this.waitForEvent(resolve);
			}
		}, this.time);
	}

	apply () {
		return new Promise ((resolve) => {
			// Block the game so the player can't advance
			this.engine.global ('block', true);
			// Set the timeout for the specified time
			this.waitForEvent(resolve);
		});
	}

	didApply () {
		return Promise.resolve ({ advance: true });
	}

	didRevert () {
		return Promise.resolve ({ advance: true, step: true });
	}
}

WaitEvent.id = 'WaitEvent';

export default WaitEvent;
