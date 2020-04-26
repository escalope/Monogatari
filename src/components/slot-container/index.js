import { Component } from './../../lib/Component';
import { $_ } from '@aegis-framework/artemis';

class SlotContainer extends Component {

	static shouldRollback () {
		return Promise.resolve ();
	}

	static willRollback () {
		return Promise.resolve ();
	}

	static bind () {
		this.engine.registerListener ('overwrite-slot', {
			callback: (element) => {
				const customName = $_(element).closest ('[data-content="context"]').text ().trim ();
				if (customName !== '') {
					this.engine.saveTo ('SaveLabel', this.engine.global ('overwrite_slot'), customName);

					this.engine.global ('overwrite_slot', null);
					this.engine.dismissAlert ('slot-overwrite');
				}
			}
		});
		return Promise.resolve();
	}

	constructor () {
		super();

		this.props = {
			type: 'load',
			label: ''
		};

		this.state = {
			slots: []
		};
	}

	willMount () {
		this.classList.add('row', 'row--spaced');
		return this.engine.Storage.keys().then((keys) => {
			const fullLabel = `${this.props.label}_`;

			const savedData = keys.filter((key) => {
				return key.indexOf(fullLabel) === 0;
			}).sort((a, b) => {

				const aNumber = parseInt(a.split(fullLabel)[1]);
				const bNumber = parseInt(b.split(fullLabel)[1]);

				if (aNumber > bNumber) {
					return 1;
				} else if (aNumber < bNumber) {
					return -1;
				} else {
					return 0;
				}
			});

			this.setState({
				slots: savedData
			});
		});
	}

	didMount () {
		const engine = this.engine;

		if (this.props.type === 'load') {
			// Load a saved game slot when it is pressed
			this.element().on ('click', '[data-component="save-slot"]', function (event) {
				const isDeleteButton = $_(event.target).closestParent ('[data-delete]', '[data-component="save-slot"]').exists ();
				if (!isDeleteButton) {
					engine.loadFromSlot($_(this).attribute ('slot')).then (() => {
						engine.run (engine.label ()[engine.state ('step')]);
					});
				}
			});
		} else if (this.props.type === 'save') {

			const self = this;
			// Save to slot when a slot is pressed.
			this.element().on('click', '[data-component="save-slot"]', function (event) {
				const isDeleteButton = $_(event.target).closestParent ('[data-delete]', '[data-component="save-slot"]').exists ();

				if (!isDeleteButton) {
					engine.debug.debug('Registered Click on Slot');

					event.stopImmediatePropagation();
					event.stopPropagation();
					event.preventDefault();

					engine.global('overwrite_slot', $_(this).attribute ('slot').split ('_').pop ());
					engine.Storage.get (self.props.label + '_' + engine.global('overwrite_slot')).then((data) => {
						engine.alert('slot-overwrite', {
							message: 'SlotOverwrite',
							context: typeof data.name !== 'undefined' ? data.name : data.date,
							editable: true,
							actions: [
								{
									label: 'Overwrite',
									listener: 'overwrite-slot'
								},
								{
									label: 'Cancel',
									listener: 'dismiss-alert'
								}
							]
						});
					});
				}
			});
		}

		this.engine.Storage.onCreate ((key, value) => {
			if (key.indexOf (`${this.props.label}_`) === 0) {
				this.setState ({
					slots: [...new Set([...this.state.slots, key])]
				});
			}
		});

		this.engine.Storage.onUpdate ((key, value) => {
			if (key.indexOf (`${this.props.label}_`) === 0) {
				this.element ().find (`[slot="${key}"]`).get (0).setProps (value);
			}
		});

		this.engine.Storage.onDelete ((key, value) => {
			if (key.indexOf (`${this.props.label}_`) === 0) {
				this.setState ({
					slots: this.state.slots.filter (s => s !== key)
				});
			}
		});

		this.engine.on ('didLocalize', () => {
			this.forceRender ();
		});

		return Promise.resolve();
	}

	onStateUpdate (property, oldValue, newValue) {
		if (property === 'slots') {
			this.forceRender ();
		}
		return Promise.resolve();
	}

	render () {
		const slots = this.state.slots.map(slot => `<save-slot slot="${slot}"></save-slot>`).join('');

		if (slots !== '') {
			return slots;
		}

		return `<p data-string="NoSavedGames">${this.engine.string('NoSavedGames')}</p>`;
	}
}

SlotContainer.tag = 'slot-container';


export default SlotContainer;