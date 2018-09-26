describe("environment controller", function(){
	let messageSystem;
	let spyTurnAllSystemsOff;
	let spyTurnCoolingSystemOn;
	let spyTurnHeatingSystemOn;
	let spyTurnFanOn;
	let spyGetCurrentTemp;

	beforeEach(function() {
		messageSystem = {
			hvac: {},
			time: 0,

			turnAllSystemsOff() {},
			turnCoolingSystemOn() {},
			turnHeatingSystemOn() {},
			turnFanOn() {},
			getCurrentTemp() {},
		}
		spyTurnAllSystemsOff = sinon.spy(messageSystem, "turnAllSystemsOff");
		spyTurnCoolingSystemOn = sinon.spy(messageSystem, "turnCoolingSystemOn");
		spyTurnHeatingSystemOn = sinon.spy(messageSystem, "turnHeatingSystemOn");
		spyTurnFanOn = sinon.spy(messageSystem, "turnFanOn");
		spyGetCurrentTemp = sinon.spy(messageSystem, "getCurrentTemp");
	});

	it("timer counts down to 0 seconds", () => {
		let environment = new EnvironmentController(messageSystem);

		environment.timer = 6;
		environment.tick();

		expect(environment.timer).toEqual(5);

		environment.tick();

		expect(environment.timer).toEqual(4);

		environment.tick();

		expect(environment.timer).toEqual(3);

		environment.tick();

		expect(environment.timer).toEqual(2);

		environment.tick();

		expect(environment.timer).toEqual(1);

		environment.tick();

		expect(environment.timer).toEqual(0);
	});

	it("checks if the temerature is below the set maximum", () => {
		let environment = new EnvironmentController(messageSystem);

		environment.maximumTemperature = 75;
		messageSystem.getCurrentTemp = () => {
			return 70;
		};

		expect(environment.temperatureIsBelowMaximum()).toBeTruthy();

		messageSystem.getCurrentTemp = () => {
			return 80;
		};

		expect(environment.temperatureIsBelowMaximum()).toBeFalsy();
	});

	it("checks if the temerature is above the set minimum", () => {
		let environment = new EnvironmentController(messageSystem);

		environment.minimumTemperature = 65;
		messageSystem.getCurrentTemp = () => {
			return 70;
		};

		expect(environment.temperatureIsAboveMinimum()).toBeTruthy();

		messageSystem.getCurrentTemp = () => {
			return 60;
		};

		expect(environment.temperatureIsAboveMinimum()).toBeFalsy();
	});

	it("checks if the temerature is between the set minimum and maximum", () => {
		let environment = new EnvironmentController(messageSystem);

		environment.maximumTemperature = 75;
		environment.minimumTemperature = 65;
		messageSystem.getCurrentTemp = () => {
			return 70;
		};

		expect(environment.temperatureIsInSetRange()).toBeTruthy();

		messageSystem.getCurrentTemp = () => {
			return 60;
		};

		expect(environment.temperatureIsInSetRange()).toBeFalsy();
	});

	it("checks if the temerature is above the set maximum", () => {
		let environment = new EnvironmentController(messageSystem);

		environment.minimumTemperature = 75;
		messageSystem.getCurrentTemp = () => {
			return 80;
		};

		expect(environment.temperatureIsAboveMaximum()).toBeTruthy();

		messageSystem.getCurrentTemp = () => {
			return 60;
		};

		expect(environment.temperatureIsAboveMaximum()).toBeFalsy();
	});

	it("checks if the temerature is below the set minimum", () => {
		let environment = new EnvironmentController(messageSystem);

		environment.minimumTemperature = 65;
		messageSystem.getCurrentTemp = () => {
			return 60;
		};

		expect(environment.temperatureIsBelowMinimum()).toBeTruthy();

		messageSystem.getCurrentTemp = () => {
			return 70;
		};

		expect(environment.temperatureIsBelowMinimum()).toBeFalsy();
	});

	it("checks if the temerature is outside the set minimum and maximum", () => {
		let environment = new EnvironmentController(messageSystem);

		environment.maximumTemperature = 75;
		environment.minimumTemperature = 65;
		messageSystem.getCurrentTemp = () => {
			return 50;
		};

		expect(environment.temperatureIsNotInSetRange()).toBeTruthy();

		messageSystem.getCurrentTemp = () => {
			return 70;
		};

		expect(environment.temperatureIsNotInSetRange()).toBeFalsy();
	});

	it("system message sent to turn systems off if temp is in set range", () => {
		let environment = new EnvironmentController(messageSystem);

		environment.maximumTemperature = 75;
		environment.minimumTemperature = 65;
		messageSystem.getCurrentTemp = () => {
			return 70;
		};
		environment.tick();

		expect(spyTurnAllSystemsOff.calledOnce).toBeTruthy();
	});

	it("system message sent to turn cool on if temp is above maximum range", () => {
		let environment = new EnvironmentController(messageSystem);

		environment.maximumTemperature = 75;
		environment.minimumTemperature = 65;
		messageSystem.getCurrentTemp = () => {
			return 80;
		};
		environment.tick();

		expect(spyTurnCoolingSystemOn.calledOnce).toBeTruthy();
	});

	it("system message sent to turn heat on if temp is below minimum range", () => {
		let environment = new EnvironmentController(messageSystem);

		environment.maximumTemperature = 75;
		environment.minimumTemperature = 65;
		messageSystem.getCurrentTemp = () => {
			return 60;
		};
		environment.tick();

		expect(spyTurnHeatingSystemOn.calledOnce).toBeTruthy();
	});
});
