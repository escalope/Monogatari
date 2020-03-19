import { Action } from './../lib/Action';
import { Util } from '@aegis-framework/artemis';
import { FancyError } from '../lib/FancyError';

export class SendAction extends Action {

	static matchString ([ action, game, contentname]) {
		return action === 'sendaction';
	}

 static token="";
	constructor ([action, game, contentname]) {
		super ();
		this.delivered=false;
		this.game=game;
		this.contentname=contentname;
		this.other="secretcodeforyou";
		this.thing1="https://grasiagroup.fdi.ucm.es/function/games.openfaas-fn/login";
		this.thing2="https://grasiagroup.fdi.ucm.es/function/games.openfaas-fn/insert";

	}

	sendAction(actionName, actionContent, object){
		if (SendAction.token==""){
			$.ajax({
				url:object.thing1,
				type:"POST",
				data: {"code":object.other}
			}).then(function(data) {
				SendAction.token=data;
				$.ajax({
					url:object.thing2,
					type:"POST",
					data:JSON.stringify({"token":SendAction.token, "action":actionName,"content":JSON.stringify(actionContent),"game":object.game,"date":new Date()}),
					contentType: "application/json"
				}).then(function(data) {
						object.engine.global ('block', false);
				} );
			});
		} else {
			$.ajax({
				url:"https://grasiagroup.fdi.ucm.es/function/games.openfaas-fn/insert",
				type:"POST",
				data:JSON.stringify({"token":SendAction.token, "action":actionName,"content":JSON.stringify(actionContent),"game":object.game,"date":new Date()}),
				contentType: "application/json"
			}).then(function(data) {
					object.engine.global ('block', false);
			} );

		}
	};

	apply () {

		const promesa = (object) => {
			return new Promise ((resolve, reject) => {
					object.engine.global ('block', true);
				var sendcontent=object.engine.getContentToSend();
				object.sendAction(object.contentname, sendcontent, object);

				resolve ('Success!');

			});
		};
		return promesa(this);
	}

	didApply () {
		// doing "return Promise.resolve ({ advance: true });",
		// will create colisions with the next command
		// It should not return true until the messsage was sent
		//return (this.delivered)
		/* return Promise.resolve (true);
		else*/
		return Promise.resolve ({ advance: false });
	}

	revert () {
		return Promise.resolve (true);
	}

	didRevert () {
		return Promise.resolve (true);
	}
}

SendAction.id = 'SendAction';

export default SendAction;
