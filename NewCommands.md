
==
Its syntax is 

	call LABEL

It jumps to the designated label. It gets back tot he instruction after when it finds a "return" statement. Calls should be stackable, so you should be able to nest calls. Infinite call loops are possible too.


return
===

To be used together with call. It resumes the execution after the call target.

sendaction
====
Its syntax is 

	sendaction GAMEID CONTENTID

It sends to a preconfigured server the content associated with CONTENTID. Content can be a string, a number or whatever, which has been previously stored with 

	monogatari.setContentToSend("WHATEVER")

GAMEID is the id assigned to the game whose data is going to be stored.

example: 

	function(){
			monogatari.setContentToSend("helloworld");
			return true;
		},
		"sendaction mygame sampleaction",

This will create a record ("sampleaction", "helloworld") in the database of "mygame". 

WaitEvent
====
Its syntax is 

	WaitEvent EVENT_NAME [TIMEOUT=100]

Holds the execution of Monogatari until a notify is generated. Events are triggered with a 

	monogatari.sendEvent("EVENTNAME")

It is useful to launch additional actions in the background using Javascript and returning the control to the novel afterwards.

ConditionalGeolocation 
====

It handles the execution of a *Geolocate* command, capturing the outcome of the geolocation:

	{'ConditionalGeolocation':{
			'Condition':"geolocate berlin 1000 100000 0.001",
			'False':'nope, dude',
			'True':'alright, you got there'
		}
	}


Gelocate
=======
Its syntax is

	Gelocate AREA POLL_FRECUENCY TIMEOUT PRECISION

It holds the execution of monogatari until the user reaches the location. The location is defined before and assigned an ID. Location is checked each POLL_FRECUENCY milliseconds. TIMEOUT is measured in seconds. PRECISION in kilometers. 

The user sees an arrow pointing at the direction and showing the distance to get there.

When the user reaches within PRECISION kilometers to the AREA, the novel resumes. 

AREA is defined before the script with statements like the following:

	monogatari.geolocations({
		"northarea":{latitude:40.437542, longitude:-3.724985},
		"southarea": {latitude:40.437912, longitude:-3.724768},
		"berlin":{latitude:52.520007,longitude:13.404954}
	});

When TIMEOUT triggers without reaching the location it returns false, and the novel resumes.

CustomForm
======
Its syntax is 

	customform FORMID

It allows the developer to show a form declared in the document. Forms are defined using "alpaca" framework.For information on how to define Alpaca forms, check http://www.alpacajs.org/
 
Forms are defined as in the example:

	monogatari.customForms({
		"opinion":{
			"schema": {
				"title":"User Feedback",
				"description":"What do you think about Alpaca?",
				"type":"object",
				"properties": {
					"name": {
						"type":"string",
						"title":"Name"
					},
					"ranking": {
						"type":"string",
						"title":"Ranking",
						"enum":['excellent','ok','so so']
					}
				}
			},
			"options": {"form":{
				"buttons":{
					"submit":{
						"title": "Send"
					}
				}
			}
		},
		"view" : "bootstrap-create"
	}
	});

In the script, the form can be shown and delivered as follows:

	"customform opinion",
	function(){		
		monogatari.setContentToSend(monogatari.getFormResult("opinion"));
		return true;
	},
	"sendaction pabgob opinion"

This will create a record assocaited to the game pabgob, the content the result of the form, and associated with the keyword "opinion". This makes easier to gather the results. 
