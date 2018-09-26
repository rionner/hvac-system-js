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
		expect(HVAC.fanOn).toBeTruthy();
	});

	it("turns heating on", () => {
		let messageSystem = new MessageSystemController(HVAC, time);

		messageSystem.turnAllSystemsOff();
		messageSystem.turnHeatingSystemOn();

		expect(HVAC.coolOn).toBeFalsy();
		expect(HVAC.heatOn).toBeTruthy();
		expect(HVAC.fanOn).toBeTruthy();
	});

	it("fan can turn on 5 seconds after heat is turned off", () => {
		let messageSystem = new MessageSystemController(HVAC, time);

		messageSystem.turnAllSystemsOff();
		messageSystem.time = 5;
		messageSystem.turnCoolingSystemOn();

		expect(HVAC.coolOn).toBeTruthy();
		expect(HVAC.heatOn).toBeFalsy();
		expect(HVAC.fanOn).toBeFalsy();

		messageSystem.time = 0;
		messageSystem.turnCoolingSystemOn();

		expect(HVAC.coolOn).toBeTruthy();
		expect(HVAC.heatOn).toBeFalsy();
		expect(HVAC.fanOn).toBeTruthy();
	});

	it("fan can turn on 3 seconds after cool is turned off", () => {
		let messageSystem = new MessageSystemController(HVAC, time);

		messageSystem.turnAllSystemsOff();
		messageSystem.time = 3;
		messageSystem.turnHeatingSystemOn();

		expect(HVAC.coolOn).toBeFalsy();
		expect(HVAC.heatOn).toBeTruthy();
		expect(HVAC.fanOn).toBeFalsy();

		messageSystem.time = 0;
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