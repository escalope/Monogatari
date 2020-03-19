import { Action } from './../lib/Action';
import { FancyError } from '../lib/FancyError';

export class Return extends Action {

	static setup () {
		this.engine.history ('call');
		return Promise.resolve ();
	}

	static bind (selector) {
		this.engine.registerListener ('return', {
			callback: (element) => {
				this.engine.run ("return", false);
			}
		});
		return Promise.resolve ();
	}

	static matchString ([ action ]) {
		return action === 'return';
	}

	constructor ([ action ]) {
		super ();
	}

	willApply () {
		const last = this.engine.history ('call')[this.engine.history ('call').length - 1];
		if (typeof last !== 'undefined') {			
			return Promise.resolve ();
		} else {
			FancyError.show (
				`There was no call statement before this return`,
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
	
		const last = this.engine.history ('call')[this.engine.history ('call').length - 1];
		if (typeof last !== 'undefined') {
			this.engine.state ({
				step: last.source.step,
				label: last.source.label
			});
			this.engine.history ('call').pop ();
			this.engine.history ('label').pop ();
			//this.engine.run (this.engine.label ()[this.engine.state ('step')+1]);
			return Promise.resolve ();
		}
		return Promise.reject ('No call elements in history available.');		
	}

	// Return is right now not reversible due to complications with the logic for it
	willRevert () {
	
		return Promise.reject ('Cannot revert a return');
	}

	revert () {
		return Promise.reject ('Cannot revert a return');
	}

	didRevert () {
		
		return Promise.resolve ({ advance: true, step: false });
	}
}

Return.id = 'Return';

export default Return;
