describe("message system controller", function(){
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

	it("should request the temperature", () => {
		let messageSystem = new MessageSystemController(HVAC, 0);
		let methodCalled = false;

		HVAC.temp = () => {
			return methodCalled = true;
		};
		messageSystem.getTemp();
		expect(methodCalled).toBeTruthy();
	});

	it("should turn off all systems", () => {
		let messageSystem = new MessageSystemController(HVAC);
		messageSystem.turnAllSystemsOff();
		expect(HVAC.heatOn).toBeFalsy();
		expect(HVAC.coolOn).toBeFalsy();
		expect(HVAC.fanOn).toBeFalsy();
	});
});