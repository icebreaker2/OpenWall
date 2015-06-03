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
			stepsFromStart: 0,
			stepsForCheckpoint1: 0,
			stepsForCheckpoint2: 0,
			stepsForCheckpoint3: 0,
			stepsForMaxHeight: '' // leave max height empty until set
			
		}, {
			stepPin: 12,
			dirPin: 13,
			stepsFromStart: 0,
			stepsForCheckpoint1: 0,
			stepsForCheckpoint2: 0,
			stepsForCheckpoint3: 0,
			stepsForMaxHeight: '' // leave max height empty until set
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

	// radius for the checkPoint in steps relative to the stepperMotor
	var radius = stepper1.stepsPerRev*0.5;

	// Checkpoint LED's
	var led1 = new five.Led(6);
	arduino.repl.inject({
		led: led1
	});

	var led2 = new five.Led(7);
	arduino.repl.inject({
		led: led2
	});

	var led3 = new five.Led(8);
	arduino.repl.inject({
		led: led3
	});

	controller.on('change', function () {
		
		controller.result = controller.result[0];

		// set various locations on the gamefield
		if (currentControllerState.calibrateStart != controller.result.calibrateStart) {
			motors[0].stepsFromStart = 0;
			motors[1].stepsFromStart = 0;
		}

		if (currentControllerState.calibrateCheckPoint1 != controller.result.calibrateCheckPoint1) {
			motors[0].stepsForCheckPoint1 = motors[0].stepsFromStart;
			motors[1].stepsForCheckpoint1 = motors[1].stepsFromStart;
		}

		if (currentControllerState.calibrateCheckPoint2 != controller.result.calibrateCheckPoint2) {
			motors[0].stepsForCheckPoint2 = motors[0].stepsFromStart;
			motors[1].stepsForCheckpoint2 = motors[1].stepsFromStart;
		}

		if (currentControllerState.calibrateCheckPoint3 != controller.result.calibrateCheckPoint3) {
			motors[0].stepsForCheckPoint3 = motors[0].stepsFromStart;
			motors[1].stepsForCheckpoint3 = motors[1].stepsFromStart;
		}

		if (currentControllerState.calibrateMaxHeight != controller.result.calibrateMaxHeight) {
			motors[0].stepsForMaxHeight = motors[0].stepsFromStart;
			motors[1].stepsForMaxHeight = motors[1].stepsFromStart;
		}

		// change direction of the stepper-Rotation
		if (currentControllerState.state1 != controller.result.state1) {
			motors[0].speed = controller.result.state1 * (-1);
		}
		
		if (currentControllerState.state2 != controller.result.state2) {
			motors[1].speed = controller.result.state2;
		}

		// fall back to startingPoint
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
						// turn the leds off for a new game
						led1.off();
						led2.off();
						led3.off();
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
						// turn the leds off for a new game
						led1.off();
						led2.off();
						led3.off();
					} else {
						finish1 = true;
					}
				});

			}
		}

	currentControllerState = controller.result;
	});
 
	this.loop(3, function() {

		// check for checkpoints reached by the player
		if (motors[0].stepsFromStart >= motors[0].stepsForCheckpoint1-radius && motors[0].stepsFromStart <= motors[0].stepsForCheckpoint1+radius) { // first stepper is in line
			if(motors[1].stepsFromStart >= motors[1].stepsForCheckpoint1-radius && motors[1].stepsFromStart <= motors[1].stepsForCheckpoint1+radius) { // second stepper is in line to
				// stepper is in Checkpoint1-Area
				led1.on();
			}
		}

		if (motors[0].stepsFromStart >= motors[0].stepsForCheckpoint2-radius && motors[0].stepsFromStart <= motors[0].stepsForCheckpoint2+radius) { // first stepper is in line
			if(motors[1].stepsFromStart >= motors[1].stepsForCheckpoint2-radius && motors[1].stepsFromStart <= motors[1].stepsForCheckpoint2+radius) { // second stepper is in line to
				if(led1.isOn()){
					// stepper is in Checkpoint2-Area and previous checkedPoints has been passed
					led2.on();
				}
			}
		}

		if (motors[0].stepsFromStart >= motors[0].stepsForCheckpoint3-radius && motors[0].stepsFromStart <= motors[0].stepsForCheckpoint3+radius) { // first stepper is in line
			if(motors[1].stepsFromStart >= motors[1].stepsForCheckpoint3-radius && motors[1].stepsFromStart <= motors[1].stepsForCheckpoint3+radius) { // second stepper is in line to
				if(led2.isOn()){
					// stepper is in Checkpoint3-Area and previous checkedPoints has been passed
					led3.on();
				}
			}
		}
		
		if (motors[0].speed > 0) {
			stepper0.cw().step(1, function() {
				motors[0].stepsFromStart--;
			});
		} else if (motors[0].speed < 0) {
			// prevent tearing of the line
			if(motors[0].stepsFromStart < motors[0].stepsForMaxHeight || motors[0].stepsForMaxHeight == '') {
				stepper0.ccw().step(1, function() {
					motors[0].stepsFromStart++;
				});
			}
		}
		
		
		if (motors[1].speed > 0) {
			stepper1.cw().step(1, function() {
				motors[1].stepsFromStart--;
			});
		} else if (motors[1].speed < 0) {
			// prevent tearing of the line
			if(motors[1].stepsFromStart < motors[1].stepsForMaxHeight || motors[1].stepsForMaxHeight == '') {
				stepper1.ccw().step(1, function() {
					motors[1].stepsFromStart++;
				});
			}
		}

	});
});