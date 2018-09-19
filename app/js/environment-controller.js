class EnvironmentController {
	constructor(hvac) {
		this.hvac = hvac;
		this.timer = 0;
	}

	checkTimer() {
		if (this.timer > 5) {
			this.timer = 0;
		} else {
			this.timer += 1;
		}
		return this.timer;
	}

	allSystemsOff() {
		this.timer = 0;
		this.hvac.heat(false);
		this.hvac.cool(false);
		this.hvac.fan(false);
	}

	coolingSystemOn() {
		this.hvac.cool(true);
		if(this.timer > 5) {
			this.hvac.fan(true);
		}
	}

	heatingSystemOn() {
		this.hvac.heat(true);
		if(this.timer > 3) {
			this.hvac.fan(true);
		}
	}

	//called every minute
	tick() {
		this.checkTimer();

		let temp = this.hvac.temp();
		let tempInRange = temp > 65 && temp < 75;
		let tempTooHigh = temp >= 75;
		let tempTooLow = temp <= 65;

		if(tempInRange) {
			this.allSystemsOff();
		} else if(tempTooLow) {
			this.heatingSystemOn();
		} else if(tempTooHigh) {
			this.coolingSystemOn();
		}
	}
}

