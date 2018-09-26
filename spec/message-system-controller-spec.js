describe("message system controller", function(){
	let HVAC;
	let time;

	beforeEach(function() {
		HVAC = {
			temperature: 70,
			heatOn: false,
			coolOn: false,
			fanOn: false,
			
			heat(isOn) { 
				this.heatOn = isOn;
			},
			cool(isOn) { 
				this.coolOn = isOn; 
			},
			fan(isOn) {
				this.fanOn = isOn;
			},
			temp() {
				return this.temperature;
			},
		};

		time = 0;
	});

	it("turns all systems off", () => {
		let messageSystem = new MessageSystemController(HVAC, time);

		messageSystem.turnAllSystemsOff();

		expect(HVAC.heatOn).toBeFalsy();
		expect(HVAC.coolOn).toBeFalsy();
		expect(HVAC.fanOn).toBeFalsy();
	});

	it("turns cooling on", () => {
		let messageSystem = new MessageSystemController(HVAC, time);

		messageSystem.turnAllSystemsOff();
		messageSystem.turnCoolingSystemOn();

		expect(HVAC.coolOn).toBeTruthy();
		expect(HVAC.heatOn).toBeFalsy();
		expect(HVAC.fanOn).toBeFalsy();
	});

	it("turns heating on", () => {
		let messageSystem = new MessageSystemController(HVAC, time);

		messageSystem.turnAllSystemsOff();
		messageSystem.turnHeatingSystemOn();

		expect(HVAC.coolOn).toBeFalsy();
		expect(HVAC.heatOn).toBeTruthy();
		expect(HVAC.fanOn).toBeFalsy();
	});

	it("fan turns on for cool 5 seconds after heat is turned off", () => {
		let messageSystem = new MessageSystemController(HVAC, time);

		messageSystem.turnAllSystemsOff();

		for(var i = 0; i <= 5; i++) {
			messageSystem.time = i;
			messageSystem.turnCoolingSystemOn();

			expect(HVAC.coolOn).toBeTruthy();
			expect(HVAC.heatOn).toBeFalsy();
			expect(HVAC.fanOn).toBeFalsy();	
		}

		messageSystem.time = 6;
		messageSystem.turnCoolingSystemOn();

		expect(HVAC.coolOn).toBeTruthy();
		expect(HVAC.heatOn).toBeFalsy();
		expect(HVAC.fanOn).toBeTruthy();
	});

	it("fan is on for heat 3 seconds after cool is turned off", () => {
		let messageSystem = new MessageSystemController(HVAC, time);

		messageSystem.turnAllSystemsOff();

		for(var i = 0; i <= 3; i++) {
			messageSystem.time = i;
			messageSystem.turnHeatingSystemOn();

			expect(HVAC.coolOn).toBeFalsy();
			expect(HVAC.heatOn).toBeTruthy();
			expect(HVAC.fanOn).toBeFalsy();
		}

		messageSystem.time = 4;
		messageSystem.turnHeatingSystemOn();

		expect(HVAC.heatOn).toBeTruthy();
		expect(HVAC.coolOn).toBeFalsy();
		expect(HVAC.fanOn).toBeTruthy();
	});

	it("returns the current temperature", () => {
		let messageSystem = new MessageSystemController(HVAC, time);

		expect(messageSystem.getCurrentTemp()).toEqual(70);
	});
});