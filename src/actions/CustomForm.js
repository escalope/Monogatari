import { Action } from './../lib/Action';
import { Util } from '@aegis-framework/artemis';
import { FancyError } from '../lib/FancyError';

export class CustomForm extends Action {

	static matchString ([ action ]) {
		return action === 'customform';
	}

	constructor ([action, formid]) {
		super ();
		this.formid= formid;
		this.shouldContinue=false;
	}

	apply () {
		this.engine.global ('block', true);
		const promesa = (engine, formid, object) => {
			 return new Promise ((resolve, reject) => {
			var formcontent=this.engine.customForm(formid);
			formcontent["options"]["form"]["buttons"]["submit"]["click"]=function() {
				if (this.isValid(true)) {
					var value = this.getValue();
					engine.setFormResult(formid, value);
				}

				$("#form").empty();
				object.shouldContinue=true;
				engine.global ('block', false);
				resolve ('Success!');
			};

			$("#form").alpaca(formcontent);

			setTimeout (function (){
				// You need to resolve the promise once your task is done
				resolve ('Success!');
				$("#form").empty();
				object.shouldContinue=true;
				engine.global ('block', false);
			}, 210050);
		}).then ((successMessage) => {
			return true;
		})};
		return promesa(this.engine,this.formid,this);
	}

	didApply () {
		return Promise.resolve ({ advance: true });
	}

	revert () {
		return Promise.resolve (true);
	}

	didRevert () {
		return Promise.resolve (true);
	}
}

CustomForm.id = 'CustomForm';

export default CustomForm;
