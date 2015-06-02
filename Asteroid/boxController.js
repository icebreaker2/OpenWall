var Asteroid = require("asteroid");
var five = require("johnny-five");

// Connect to the OpenWall Meteor backend
var OpenWall = new Asteroid("localhost:3000");
var collection = OpenWall.getCollection("controller");
var controller = collection.reactiveQuery({});
OpenWall.on("connected", function() {
	console.log("Asteroid connected to Meteor");
});

var currentControllerState = {};

var arduino = new five.Board();
arduino.on("ready", function() {

	motors = [
		{
			stepPin: 3,
			dirPin: 4,
			stepsFromStart: 0
			
		}, {
			stepPin: 12,
			dirPin: 13,
			stepsFromStart: 0
		}
	];
	
	var stepper0 = five.Stepper({
		type: five.Stepper.TYPE.DRIVER,
		stepsPerRev: 200,
		pins: {
			step: motors[0].stepPin,
			dir: motors[0].dirPin
		}
	});
	var stepper1 = five.Stepper({
		type: five.Stepper.TYPE.DRIVER,
		stepsPerRev: 200,
		pins: {
			step: motors[1].stepPin,
			dir: motors[1].dirPin
		}
	});
	
	controller.on('change', function () {			var led1 = new five.Led(6);			arduino.repl.inject({			led: led1		});				led1.on();				led2 = new five.Led(7);			arduino.repl.inject({			led: led2		});				led2.on();				led3 = new five.Led(8);			arduino.repl.inject({			led: led3		});				led3.on();		  		  
		
		controller.result = controller.result[0];
		
		if (currentControllerState.calibrateStart != controller.result.calibrateStart) {
			motors[0].stepsFromStart = 0;
			motors[1].stepsFromStart = 0;
		}
	
		if (currentControllerState.state1 != controller.result.state1) {
			motors[0].speed = controller.result.state1 * (-1);
		}
		
		if (currentControllerState.state2 != controller.result.state2) {
			motors[1].speed = controller.result.state2;
		}
		
		if (currentControllerState.movingToStart != controller.result.movingToStart) {
			if(controller.result.movingToStart == true) {
				
				var finish0 = false;
				var finish1 = false;
				
				if (motors[0].stepsFromStart > 0) {
					stepper0.cw();
				} else {
					stepper0.ccw();
				}
			
				stepper0.step(Math.abs(motors[0].stepsFromStart), function() {
				
					motors[0].stepsFromStart = 0;
				
					if (finish1) {
						OpenWall.call("movingToStartCompleted");
					} else {
						finish0 = true;
					}
				});
				
				if (motors[1].stepsFromStart > 0) {
					stepper1.cw();
				} else {
					stepper1.ccw();
				}
				
				stepper1.step(Math.abs(motors[1].stepsFromStart), function() {
				
					motors[1].stepsFromStart = 0;
					
					if (finish0) {
						OpenWall.call("movingToStartCompleted");
					} else {
						finish1 = true;
					}
				});
				
			}
		}

	currentControllerState = controller.result;
	});
	
	
 
	this.loop(3, function() {
		
		if (motors[0].speed > 0) {
			stepper0.cw().step(1, function() {
				motors[0].stepsFromStart--;
			});
		} else if (motors[0].speed < 0) {
			stepper0.ccw().step(1, function() {
				motors[0].stepsFromStart++;
			});
		}		
		
		if (motors[1].speed > 0) {
			stepper1.cw().step(1, function() {
				motors[1].stepsFromStart--;
			});
		} else if (motors[1].speed < 0) {
			stepper1.ccw().step(1, function() {
				motors[1].stepsFromStart++;
			});
		}		
	});
});