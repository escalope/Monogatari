import { Action } from './../lib/Action';
import { FancyError } from '../lib/FancyError';

export class Call extends Action {

	static setup () {
		this.engine.history ('label');
		this.engine.history ('call');
		return Promise.resolve ();
	}

	static bind (selector) {
		this.engine.registerListener ('call', {
			callback: (element) => {
				this.engine.run (`call ${element.data('jump')}`, false);
			}
		});
		return Promise.resolve ();
	}

	static matchString ([ action ]) {
		return action === 'call';
	}

	constructor ([ action, label ]) {
		super ();
		this.label = label;
	}

	willApply () {
		if (typeof this.engine.script (this.label) !== 'undefined') {
			this.engine.stopAmbient ();
			this.engine.showScreen ('game');
			return Promise.resolve ();
		} else {
			FancyError.show (
				`The label "${this.label}" does not exist`,
				`Monogatari attempted to jump to the label named "${this.label}" but it wasn't found on the script.`,
				{
					'Missing Label': this.label,
					'You may have meant one of these': Object.keys (this.engine.script ()),
					'Statement': `<code class='language=javascript'>"${this._statement}"</code>`,
					'Label': this.engine.state ('label'),
					'Step': this.engine.state ('step'),
					'Help': {
						'_': 'Check if the label in your jump statement is correct and that you have also defined it correctly.'
					}
				}
			);
		}
		return Promise.reject ();
	}

	apply () {
		this.engine.history ('call').push ({
			source: {
				label: this.engine.state ('label'),
				step: this.engine.state ('step')
			},
			destination: {
				label: this.label,
				step: 0
			}
		});
		this.engine.state ({
			step: 0,
			label: this.label
		});

		if (!this.engine.element ().find ('[data-component="text-box"]').hasClass ('nvl')) {
			this.engine.action ('Dialog').reset ();
		}

		this.engine.history ('label').push (this.label);
		this.engine.run (this.engine.label ()[this.engine.state ('step')]);


		return Promise.resolve ();
	}

	// Jump is right now not reversible due to complications with the logic for it
	willRevert () {
		if (this.engine.history ('call').length > 0) {
			return Promise.resolve ();
		}
		return Promise.reject ('No elements in history available.');
	}

	revert () {
		const last = this.engine.history ('call')[this.engine.history ('call').length - 1];
		if (typeof last !== 'undefined') {
			this.engine.state ({
				step: last.source.step,
				label: last.source.label
			});
			return Promise.resolve ();
		}
		return Promise.reject ('No elements in history available.');
	}

	didRevert () {
		this.engine.history ('call').pop ();
		this.engine.history ('label').pop ();
		return Promise.resolve ({ advance: true, step: false });
	}
}

Call.id = 'Call';

export default Call;
