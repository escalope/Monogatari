import { Action } from '../Action';
import { Monogatari } from '../monogatari';
import { $_ } from '@aegis-framework/artemis';

export class Message extends Action {

	static setup () {
		$_('#game #components').append (`
			<div data-component="modal" data-ui="messages" class="middle">
				<div data-ui="message-content"></div>
				<div class="horizontal horizontal--center" data-ui="inner-menu">
					<button data-action="close" data-close="messages" data-string="Close">Close</button>
				</div>
			</div>
		`);
	}

	static matchString ([ action, type ]) {
		return action === 'display' && type === 'message';
	}

	constructor ([ action, type, asset ]) {
		super ();
		this.type = type;
		this.message = Message.settings.messages[asset];
	}

	willApply () {
		if (typeof this.message !== 'undefined') {
			return Promise.resolve ();
		}
		return Promise.reject ();
	}

	apply () {

		$_('[data-ui="message-content"]').html (`
			<h3>${this.message.Title}</h3>
			<p>${this.message.Subtitle}</p>
			<p>${this.message.Message}</p>
		`);
		$_('[data-ui="messages"]').addClass ('active');
		return Promise.resolve ();
	}

	revert () {
		$_('[data-ui="message-content"]').html ('');
		$_('[data-ui="messages"]').removeClass ('active');
		return Promise.resolve ();
	}
}

Message.id = 'Message';
Message.settings = {
	messages: {}
};

Monogatari.registerAction (Message);