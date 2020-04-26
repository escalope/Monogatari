/* global monogatari */

/*function getLocation() {
if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(showPosition);
} else {
var x = document.getElementById("demo");
x.innerHTML = "Geolocation is not supported by this browser.";
}
}

function showPosition(position) {
var x = document.getElementById("demo");
x.innerHTML = "Latitude: " + position.coords.latitude +
"<br>Longitude: " + position.coords.longitude;
}

function getLocation(positionProcessing) {
if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(positionProcessing);
return true;
} else {
return  false;
}
}*/


function getPicture(){
	// get a getPicture

	// confirm

	// do something

}

/*monogatari.component ('game-screen').template (function() {
return " <h1>My Awesome Game</h1>antes<p id='demo'></p>despues";
});*/

// Define the messages used in the game.
monogatari.action ('message').messages ({
	'Help': {
		title: 'Help',
		subtitle: 'Some useful Links',
		body: `
		<p><a href='https://developers.monogatari.io/documentation/'>Documentation</a> - Everything you need to know.</p>
		<p><a href='https://monogatari.io/demo/'>Demo</a> - A simple Demo.</p>
		`
	}
});



// Define the notifications used in the game
monogatari.action ('notification').notifications ({
	'Welcome': {
		title: 'Welcome',
		body: 'This is the Monogatari VN Engine1',
		icon: ''
	}
});

// Credits of the people involved in the creation of this awesome game
monogatari.configuration ('credits', {

});

// Define the Particles JS Configurations used in the game
monogatari.action ('particles').particles ({

});

// Define the images that will be available on your game's image gallery
monogatari.assets ('gallery', {

});

// Define the music used in the game.
monogatari.assets ('music', {

});

// Define the voice files used in the game.
monogatari.assets ('voices', {

});

// Define the sounds used in the game.
monogatari.assets ('sounds', {

});

// Define the videos used in the game.
monogatari.assets ('videos', {

});

// Define the images used in the game.
monogatari.assets ('images', {

});

// Define the backgrounds for each scene.
monogatari.assets ('scenes', {
	"aereo":"aereo.jpg"
});

// Define the Characters
monogatari.characters ({
	'y': {
		name: 'Yui',
		color: '#5bcaff'
	}
});
//https://makitweb.com/how-to-capture-picture-from-webcam-with-webcam-js/

//$_ready(()=>{


/*
// example of event generation
monogatari.script({"NorthArea":['waitevent northarea 100',
"Things that happen in the north area"]});
monogatari.script({"SouthArea":['waitevent southarea 100',
"Things that happen in the south area"]});
monogatari.script ({	'Start': ["Testing event based choice",
{'Choice': {
'Dialog': 'Choose destination',
'North Area': {
'Text': 'Lets go to the north',
'Do': 'jump NorthArea',
'Condition': function () {
// check something else, such as items the character happens
// or the status of the novel
return true;
}
},
'South Area': {
'Text': 'Lets go to the south',
'Do': 'jump SouthArea',
}
}},"end"]});

// events can be produced like this
setTimeout(function(){monogatari.sendEvent("northarea");alert("Hello!");},10000);
*/

// check google maps to obtain coordinates by right clicking anyplace in the map
// and choosing "what's here"
monogatari.geolocations({
	"northarea":{latitude:40.437542, longitude:-3.724985},
	"southarea": {latitude:40.437912, longitude:-3.724768},
	"berlin":{latitude:52.520007,longitude:13.404954}
});

monogatari.customForms({
	"opinion":{
		"schema": {
			"title":"User Feedback1",
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
					"title": "Enviar"
				}
			}
		}
	},
	"view" : "bootstrap-create"
}
});

// using geolication with basic fail/success control
/*monogatari.script({"NorthArea":['geolocate berlin 1000 100000 1',
{'Conditional':{
'Condition':function(){return monogatari.checkAndResetIfLastActionFailed()},
'True':'nope, dude',
'False':'alright, you got there'
}
},"Things that happen in the north area"]});*/

// improved version to handle arrival to location or failure to do so within
// the timeout
monogatari.script({"NorthArea":[
	{'ConditionalGeolocation':{
		'Condition':"geolocate berlin 1000 100000 0.001",
		'False':'nope, dude',
		'True':'alright, you got there'
	}
},"Things that happen in the north area","end"]});

monogatari.script({"SouthArea":['geolocate southarea 10000 100 1',
"Things that happen in the south area"]});


monogatari.script ({	'Start': [
	"customform opinion",
	function(){
		monogatari.setContentToSend(monogatari.getFormResult("opinion"));
		return true;
	},
	"sendaction pabgob opinion",
	"show scene aereo",
	function(){
		monogatari.setContentToSend("achieved");
		return true;
	},
	"sendaction pabgob delivered",
	"Testing event based choice",
	{'Choice': {
		'Dialog': 'Choose destination',
		'North Area': {
			'Text': 'Lets go to the north2',
			'Do': 'jump NorthArea',
			'Condition': function () {
				// check something else, such as items the character happens
				// or the status of the novel
				return true;
			}
		},
		'South Area': {
			'Text': 'Lets go to the south',
			'Do': 'jump SouthArea',
		}
	}},"end"]});






	//});
	/*
	monogatari.script ({
	// The game starts here.
	'Start': [

	function(){
	getLocation();
	return true;
},
'call uno',"dos",
"call uno","cuatro",
{
'Input': {
'Text': 'What is your name1?',
'Validation': function (input) {
return input.trim ().length > 0;
},
'Save': function (input) {
this.storage ({
player: {
name: input
}
});
return true;
},
'Revert': function () {
this.storage ({
player: {
name: ''
}
});
},
'Warning': 'You must enter a name!'
}
},
'y Hi {{player.name}} Welcome to Monogatari!',
{
'Choice': {
'Dialog': 'y Have you already read some documentation?',
'Yes': {
'Text': 'Yes',
'Do': 'jump Yes'
},
'No': {
'Text': 'No',
'Do': 'jump No'
}
}
}
],

'uno':["prueba","return","tres"],

'Yes': [
'y Thats awesome!',
'y Then you are ready to go ahead and create an amazing Game!',
'y I can’t wait to see what story you’ll tell!',
'end'
],

'No': [

'y You can do it now.',

'show message Help',

'y Go ahead and create an amazing Game!',
'y I can’t wait to see what story you’ll tell!',
'end'
]
});*/
