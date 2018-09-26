class EnvironmentController {
	constructor(messageSystem) {
		this.messageSystem = messageSystem;
		this.timer = 0;
		this.maximumTemperature = 75;
		this.minimumTemperature = 65;
		this.turnAllSystemsOff = messageSystem.turnAllSystemsOff;
		this.turnHeatingSystemOn = messageSystem.turnHeatingSystemOn;
		this.turnCoolingSystemOn = messageSystem.turnCoolingSystemOn;
	}

	checkTimer() {
		if (this.timer > 5) {
			this.timer = 0;
		} else {
			this.timer += 1;
		}
		return this.timer;
	}

	readCurrentTemperature() {
		return this.messageSystem.getCurrentTemp();
	}

	temperatureIsBelowMaximum() {
		return this.readCurrentTemperature() < this.maximumTemperature;
	}

	temperatureIsAboveMinimum() {
		return this.readCurrentTemperature() > this.minimumTemperature;
	}

	temperatureIsInSetRange() {
		return this.temperatureIsAboveMinimum() && this.temperatureIsBelowMaximum();
	}

	temperatureIsAboveMaximum() {
		return this.readCurrentTemperature() > this.maximumTemperature;
	}

	temperatureIsBelowMinimum() {
		return this.readCurrentTemperature() < this.minimumTemperature;
	}

	temperatureIsNotInSetRange() {
		return this.temperatureIsAboveMaximum() || this.temperatureIsBelowMinimum();
	}

	tick() {
		this.checkTimer();

		if(this.temperatureIsInSetRange()) {
			this.timer = 5;
			this.turnAllSystemsOff();
		} else if(this.temperatureIsBelowMinimum()) {
			this.turnHeatingSystemOn();
		} else if(this.temperatureIsAboveMaximum()) {
			this.turnCoolingSystemOn();
		}
	}
}

class MessageSystemController {
	constructor(hvac, time) {
		this.hvac = hvac;
		this.time = time;
	}

	turnAllSystemsOff() {
		this.hvac.heat(false);
		this.hvac.cool(false);
		this.hvac.fan(false);
	}

	turnCoolingSystemOn() {
		this.hvac.cool(true);
		if(this.time > 5) {
			this.turnFanOn();
		}
	}

	turnHeatingSystemOn() {
		this.hvac.heat(true);
		if(this.time > 3) {
			this.turnFanOn();
		}
	}

	turnFanOn() {
		this.hvac.fan(true);
	}

	getCurrentTemp() {
		return this.hvac.temp();
	}
}

class HVAC {
	init() {
		temperature = 70;
		heatOn = false;
		coolOn = false;
		fanOn = false;
	}
	
	heat(isOn) { 
		this.heatOn = isOn;
	}

	cool(isOn) { 
		this.coolOn = isOn; 
	}

	fan(isOn) {
		this.fanOn = isOn;
	}

	temp() {
		return this.temperature;
	}
}

