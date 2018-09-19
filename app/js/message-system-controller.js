class messageSystemController {
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
			this.hvac.fan(true);
		}
	}

	turnHeatingSystemOn() {
		this.hvac.heat(true);
		if(this.time > 3) {
			this.hvac.fan(true);
		}
	}
}
// HVAC Wrapper
// use the existing interface or Web service version of HVAC
