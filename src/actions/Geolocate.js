import { Action } from './../lib/Action';
import { FancyError } from './../lib/FancyError';

export class Geolocate extends Action {



	static matchString ([ action ]) {
		return action === 'geolocate';
	}

	constructor ([ action, area,checkevery=500, timeout, precision ]) {
		super ();
		this.waited=0;
		this.area=area;
		this.timeout=timeout;
		this.precision=parseFloat (precision);
		this.checkevery=parseInt (checkevery);
		// First check if vibration is available available
		if (navigator) {
			if (navigator.geolocate) {
				// Since time can be a pattern made of different lengths, we have
				// to use an array
				// Check if all times are valid integers
				if (!isNaN (timeout)) {
					this.timeout= parseInt (timeout)*1000;
				} else {
					FancyError.show (
						'The specified area is not known',
						'Monogatari attempted to geolocate an area but failed. ',
						{
							'Specified time': time[i],
							'Statement': `<code class='language=javascript'>"${this._statement}"</code>`,
							'Label': this.engine.state ('label'),
							'Step': this.engine.state ('step'),
							'Help': {
								'_': 'Please, define the locations in your script first by defining monogatari.gelocation as in the examples'
							}
						}
					);
				}
			} else {
				console.warn ('Geolocation is not supported in this platform.');
			}
		} else {
			console.warn ('Geolocation is not supported in this platform.');
		}
	}

	willApply () {
		if (typeof this.area !== 'undefined') {
			return Promise.resolve ();
		}
		return Promise.reject ();
	}


	withinArea(coords, othercoords, precision){
		var res1=Math.abs(coords.latitude-othercoords.latitude);
		var res2=Math.abs(coords.longitude-othercoords.longitude);
		return 	res1<precision && res2<precision;
	}

	getLocation(positionProcessing) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(positionProcessing);
			return true;
		} else {
			return  false;
		}
	}

  // Code from https://www.geodatasource.com/developers/javascript
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	//:::                                                                         :::
	//:::  This routine calculates the distance between two points (given the     :::
	//:::  latitude/longitude of those points). It is being used to calculate     :::
	//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
	//:::                                                                         :::
	//:::  Definitions:                                                           :::
	//:::    South latitudes are negative, east longitudes are positive           :::
	//:::                                                                         :::
	//:::  Passed to function:                                                    :::
	//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
	//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
	//:::    unit = the unit you desire for results                               :::
	//:::           where: 'M' is statute miles (default)                         :::
	//:::                  'K' is kilometers                                      :::
	//:::                  'N' is nautical miles                                  :::
	//:::                                                                         :::
	//:::  Worldwide cities and other features databases with latitude longitude  :::
	//:::  are available at https://www.geodatasource.com                         :::
	//:::                                                                         :::
	//:::  For enquiries, please contact sales@geodatasource.com                  :::
	//:::                                                                         :::
	//:::  Official Web site: https://www.geodatasource.com                       :::
	//:::                                                                         :::
	//:::               GeoDataSource.com (C) All Rights Reserved 2018            :::
	//:::                                                                         :::
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	distance(lat1, lon1, lat2, lon2, unit) {
		if ((lat1 == lat2) && (lon1 == lon2)) {
			return 0;
		}
		else {
			var radlat1 = Math.PI * lat1/180;
			var radlat2 = Math.PI * lat2/180;
			var theta = lon1-lon2;
			var radtheta = Math.PI * theta/180;
			var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
			if (dist > 1) {
				dist = 1;
			}
			dist = Math.acos(dist);
			dist = dist * 180/Math.PI;
			dist = dist * 60 * 1.1515;
			if (unit=="K") { dist = dist * 1.609344 }
			if (unit=="N") { dist = dist * 0.8684 }
			var decimals=3;
			// from https://www.jacklmoore.com/notes/rounding-in-javascript/
			return Number(Math.round(dist+'e'+decimals)+'e-'+decimals);;
		}
	}



// https://nocurve.com/tutorials/cordova-2/learning-phonegapcordova-part-6/
	drawArrow(r) {

 	   if (document.getElementById('arrow')){
			  var g_PI2 = Math.PI*2;   // 2 x Pi
		    var g_toRAD = 360/g_PI2; // Divide degrees by this to get radians
		    var g_ArrHeight = 24;
        var ctx = document.getElementById('arrow').getContext('2d');
        ctx.clearRect(0, 0, g_ArrHeight*4, g_ArrHeight*4);
        var state = ctx.save();
        var fulld3 = g_ArrHeight/3;
        var fulld2 = g_ArrHeight/2;
        ctx.translate(g_ArrHeight*2, g_ArrHeight*2);
        ctx.rotate(r);

        ctx.beginPath();
        ctx.strokeStyle = '#aaaaff';
        ctx.lineWidth = 5;

        ctx.moveTo(0, -g_ArrHeight);
        ctx.lineTo(g_ArrHeight, fulld3);
        ctx.lineTo(fulld2, fulld3);
        ctx.lineTo(fulld2, g_ArrHeight);
        ctx.lineTo(-fulld2, g_ArrHeight);
        ctx.lineTo(-fulld2, fulld3);
        ctx.lineTo(-g_ArrHeight, fulld3);

        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle="#33ff30";
        ctx.fill();

        ctx.restore(state);
			}
    }

		// Converts from degrees to radians.
 toRadians(degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
 toDegrees(radians) {
  return radians * 180 / Math.PI;
}

// from https://stackoverflow.com/questions/46590154/calculate-bearing-between-2-points-with-javascript
 bearing(startLat, startLng, destLat, destLng){
  startLat = this.toRadians(startLat);
  startLng = this.toRadians(startLng);
  destLat = this.toRadians(destLat);
  destLng = this.toRadians(destLng);

  var y = Math.sin(destLng - startLng) * Math.cos(destLat);
  var x = Math.cos(startLat) * Math.sin(destLat) -
        Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  var brng = Math.atan2(y, x);
  brng = this.toDegrees(brng);
  return (brng + 360) % 360;
}



  // called on device orientation change
	// code based on project https://github.com/lamplightdev/compass
  onHeadingChange(event) {
    var heading = event.alpha;

    if (typeof event.webkitCompassHeading !== "undefined") {
      heading = event.webkitCompassHeading; //iOS non-standard
    }

		var orientation;
    if (screen.orientation && screen.orientation.type) {
      orientation = screen.orientation.type;
    } else {
      orientation = screen.orientation ||
                    screen.mozOrientation ||
                    screen.msOrientation;
    }

    if (typeof heading !== "undefined" && heading !== null) { // && typeof orientation !== "undefined") {
      // we have a browser that reports device heading and orientation


      // what adjustment we have to add to rotation to allow for current device orientation
      var adjustment = 0;
			var defaultOrientation="landscape";
      /*if (defaultOrientation === "landscape") {
        adjustment -= 90;
      }*/

      if (typeof orientation !== "undefined") {
        var currentOrientation = orientation.split("-");

        if (defaultOrientation !== currentOrientation[0]) {
          if (defaultOrientation === "landscape") {
            adjustment -= 270;
          } else {
            adjustment -= 90;
          }
        }

        if (currentOrientation[1] === "secondary") {
          adjustment -= 180;
        }
      }

			this.headingCurrent=heading + adjustment;
  };
};


	checkLocation(resolve,reject){

		this.getLocation((position)=>{
			/*alert("ya1 "+
			JSON.stringify(this.engine.geolocation(this.area)));*/
			var d=this.distance(position.coords.latitude,
				position.coords.longitude,this.engine.geolocation(this.area).latitude,
				this.engine.geolocation(this.area).longitude,'K' );
			var res=d<this.precision;
			if (res){
				// we are there
				var elem = document.querySelector('#distancevalue');
				if (elem !== null)
					elem.parentNode.removeChild(elem);
				this.engine.global ('block', false);
				resolve();
			} else {

				var elem = document.querySelector('#distancevalue');
				if (elem !== null)
					elem.parentNode.removeChild(elem);


					const elementarrow = document.createElement ("canvas");
					elementarrow.setAttribute("id", "arrow");
			//		elementarrow.setAttribute("class","centerscreen");



				const element = document.createElement ("div");
					element.setAttribute("class","centerscreen");
				element.setAttribute("id", "distancevalue");
				const para = document.createElement ("p");
				para.setAttribute("style","background-color: white");
				//para.setAttribute("class","centerscreen");
				const content=document.createTextNode(" "+d+" Km");
				para.appendChild(content);
				element.appendChild(para);
				element.appendChild(elementarrow);

				var insertionpoint=this.engine.element ().find ('[id="distance-geo"]');
				insertionpoint.append(element);
				//position.heading=Math.random()*Math.PI;
				if (this.headingCurrent){
					var bearing=this.bearing(position.coords.latitude,
						position.coords.longitude,this.engine.geolocation(this.area).latitude,
						this.engine.geolocation(this.area).longitude);
					this.drawArrow(this.toRadians(this.headingCurrent-bearing));
				}
				this.waitForLocation(resolve,reject);
			}
		})
	};


	waitForLocation(resolve,reject){
		setTimeout (() => {
			this.waited=this.waited+this.checkevery;
			if (this.waited>this.timeout){
				this.engine.lastActionFailed();
				this.engine.global ('block', false);
				var elem = document.querySelector('#distancevalue');
				if (elem !== null)
					elem.parentNode.removeChild(elem);
				resolve();
			} else
			this.checkLocation(resolve,reject)
		}, this.checkevery);
	}



	apply () {
		return new Promise ((resolve,reject) => {
			// Block the game so the player can't advance
			this.engine.global ('block', true);
			// wait for location arrival
			window.addEventListener("deviceorientation", (event)=>{this.onHeadingChange(event)});
			this.waitForLocation(resolve, reject);
		});
	}

	didApply () {
		return Promise.resolve ({ advance: true });
	}

	didRevert () {
		var elem = document.querySelector('#distancevalue');
		if (elem !== null)
		 return Promise.reject ();
		return Promise.resolve ({ advance: false, step: false });
	}

	willRevert () {
			return Promise.resolve ();
	}

	revert () {
		var elem = document.querySelector('#distancevalue');
		if (elem !== null)
			elem.parentNode.removeChild(elem);
		window.removeEventListener("deviceorientation", this.onHeadingChange);
	  return Promise.resolve ();

	}
}

Geolocate.id = 'Geolocate';

export default Geolocate;
