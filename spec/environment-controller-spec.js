describe("environment controller", function(){
	let HVAC;

	beforeEach(function() {
		HVAC = {
			_temp: 70,
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
				return this._temp;
			},
		}
	});

	it("heat is off if temp is between 65 and 75", () => {
		for(var i = 0; i <= 8; i++) {
			let environment = new EnvironmentController(HVAC);
			HVAC._temp = 66 + i;
			environment.tick();
			expect(HVAC.heatOn).toBeFalsy();
		}
	});
	
	it("cool is off if temp is between 65 and 75", () => {
		for(var i = 0; i <= 8; i++) {
			let environment = new EnvironmentController(HVAC);
			HVAC._temp = 66 + i;
			environment.tick();
			expect(HVAC.coolOn).toBeFalsy();
		}
	});

	it("fan is off if temp is between 65 and 75", () => {
		for(var i = 0; i <= 8; i++) {
			let environment = new EnvironmentController(HVAC);
			HVAC._temp = 66 + i;
			environment.tick();
			expect(HVAC.fanOn).toBeFalsy();
		}
	});

	it("heat is on if temp is at or below 65", () => {
		for(var i = 0; i <= 5; i++) {
			let environment = new EnvironmentController(HVAC);
			HVAC._temp = 60 + i;
			environment.tick();
			expect(HVAC.heatOn).toBeTruthy();
		}
	});

	it("cool is on if temp is at or above 75", () => {
		for(var i = 0; i <= 5; i++) {
			let environment = new EnvironmentController(HVAC);
			HVAC._temp = 75 + i;
			environment.tick();
			expect(HVAC.coolOn).toBeTruthy();
		}
	});

	it("fan is on for heat 3 min after cool is turned off", () => {
		let environment = new EnvironmentController(HVAC);
		HVAC._temp = 60;

		for(var i = 0; i <= 3; i++) {
			expect(environment.timer).toEqual(i);
			expect(HVAC.fanOn).toBeFalsy();
			environment.tick();
		}

		environment.tick();
		expect(HVAC.coolOn).toBeFalsy();
		expect(HVAC.heatOn).toBeTruthy();
		expect(HVAC.fanOn).toBeTruthy();
	});

	it("fan truns on for cool 5 min after heat is turned off", () => {
		let environment = new EnvironmentController(HVAC);
		HVAC._temp = 76;

		for(var i = 0; i <=5; i++) {
			expect(environment.timer).toEqual(i);
			expect(HVAC.fanOn).toBeFalsy();
			environment.tick();
		}

		environment.tick();
		expect(HVAC.heatOn).toBeFalsy();
		expect(HVAC.coolOn).toBeTruthy();
		expect(HVAC.fanOn).toBeTruthy();
	});
});
