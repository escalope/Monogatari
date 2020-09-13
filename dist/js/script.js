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

function randomInt(min, max) {
	return min + Math.floor((max - min) * Math.random());
};

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
 'sylvie': {
        name: 'sylvie',
        color: '#00bfff', 
        directory: 'sylvie', // Optional*
        sprites :{ // Images Identifier for the 'Show' statement.
            giggle: 'sylvie blue giggle.png',
            normal: 'sylvie blue normal.png',
            smile: 'sylvie blue smile.png',
            surprised: 'sylvie blue surprised.png'
        },
        default_expression: 'face.png', // Optional, side image to show every time the character speaks.
        expressions: { // Side images identifiers to show on dialogs
             giggle: 'sylvie blue giggle.png',
            normal: 'sylvie blue normal.png',
            smile: 'sylvie blue smile.png',
            surprised: 'sylvie blue surprised.png'
        }
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
	"sitio1":{latitude:40.420242, longitude:-4.706434},
	"sitio2": {latitude:40.420208, longitude:-4.706264},
	"sitio3":{latitude:52.520007,longitude:13.404954},
	"rectorado1":{latitude:40.437399, longitude:-3.724405},
	"rectorado2":{latitude:40.437872, longitude:-3.724750}

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



monogatari.script({"randommessage":[	
{'Conditional': {

    'Condition': function(){
        return randomInt(1,4)+"";
    },
    '1': 'muevete ya',
    '2': 'a qué esperas?',
    '3': 'no seas perro',
    '4': 'las piedras se mueven más que tú'
}},"return"]});

function sitio(monogatari,etiqueta,sitio){
elemento= {};
elemento[etiqueta]=[
	{'ConditionalGeolocation':{
		'Condition':"geolocate "+sitio+" 1 30 0.05",
		'False':"call randommessage",
		'True':'olé'}
	},"call "+etiqueta];
monogatari.script(elemento);
}


sitio(monogatari,"primersitio","rectorado1");
sitio(monogatari,"segundositio","rectorado2");

/*
monogatari.script({"primersitio":[
	
	{'ConditionalGeolocation':{
		'Condition':"geolocate rectorado1 1 60 0.01",
		'False':"call randommessage",
		'True':'olé'}
	},"call primersitio"]});

monogatari.script({"segundositio":[
	
	{'ConditionalGeolocation':{
		'Condition':"geolocate rectorado1 1 60 0.01",
		'False':"call randommessage",
		'True':'olé'}
	},"call primersitio"]});
*/

monogatari.script ({	'Start': [

//	"call randommessage","primera","call randommessage","segunda","end",
/*	"customform opinion",
	function(){
		monogatari.setContentToSend(monogatari.getFormResult("opinion"));
		return true;
	},*/
//	"sendaction pabgob opinion",
	"show scene aereo",
	"show character sylvie normal at left with fadeIn end-fadeOut",
	"sylvie hello1",
	"call primersitio",
	"lo has conseguido",
	'show character sylvie normal at right with fadeIn end-fadeOut',
	"call segundositio",
	'show character sylvie giggle at left with fadeIn end-fadeOut',
	"goodbye",
	
/*	"sylvie Hola! me llamo Lara",
	'show character sylvie normal at right with giggle transition 6s',
	"show scene aereo",
	"sylvie Déjame contarte una historia",
	'show character sylvie giggle at left with giggle transition 6s',
	"sylvie Érase una vez una chica normal",
	"sylvie que se aburría mucho",
	'show character sylvie surprise at left with giggle transition 6s',
	"sylvie te lo juro, tía",*/

/*	function(){
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
	}},*/
	"end"]});






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
