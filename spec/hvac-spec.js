describe("HVAC", function() {
	it("should set heat to on or off", () => {
		let hvac = new HVAC();

		[true, false].forEach((state) => {
			hvac.heat(state);

			expect(hvac.heatOn).toEqual(state);
		});
	});

	it("should set cool to on or off", () => {
		let hvac = new HVAC();

		[true, false].forEach((state) => {
			hvac.cool(state);

			expect(hvac.coolOn).toEqual(state);
		});
	});

	it("should set fan to on or off", () => {
		let hvac = new HVAC();

		[true, false].forEach((state) => {
			hvac.fan(state);

			expect(hvac.fanOn).toEqual(state);
		});
	});

	it("should return the current temp", () => {
		let hvac = new HVAC();

		hvac.temperature = 60;

		expect(hvac.temp()).toEqual(60);
	});
});