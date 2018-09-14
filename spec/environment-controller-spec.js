describe("environmentController", function() {

  // Note this now ignored
  let hvacDummy = {
    _temp: 0,
    _heatOn: false,
    _coolOn: false,
    _fanOn: false,
    getTemp() { return this._temp; },
    setHeat(on) { this._heatOn = on; },
    setCool(on) { this._coolOn = on; },
    setFan(on) { this._fanOn = on; }
  };

  // This is actually the Mock. Interestingly this creates a wider interface, but this is actually the exception not the rule
  let fakeHvacWrapper = {
    temp() { return this._temp; },
    turnOnHeat() { this._heatOn = true; },
    turnOnFan() { this._fanOn = true; },
    turnOnAir() { this._coolOn = true; },

    turnOffFan() { this._fanOn = false; },
    turnOffAir() { this._coolOn = false; },
    turnOffHeat() { this._heatOn = false; },

    // helper functions for testing
    init() {
      this._temp = 0;
      this._heatOn = false;
      this._coolOn = false;
      this._fanOn = false;
    },
    isOff() { return !(this._heatOn || this._fanOn || this._coolOn); },
    isHeating() { return this._heatOn && this._fanOn && !this._coolOn; },
    isCooling() { return this._coolOn && this._fanOn && !this._heatOn; }
  };

  let controller;

  beforeEach(() => {
    fakeHvacWrapper.init();
    controller = new EnvironmentController(fakeHvacWrapper);
  });

  it ("does nothing at the perfect temperature", () => {
    fakeHvacWrapper._temp = 70;

    controller.tick();

    expect(fakeHvacWrapper.isOff()).toBeTruthy();
  });

  it ("turns on the heat at 64", () => {
    fakeHvacWrapper._temp = 64;

    controller.tick();

    expect(fakeHvacWrapper.isHeating()).toBeTruthy();
  });

  it ("does not turn on the heat at 65", () => {
    fakeHvacWrapper._temp = 65;

    controller.tick();

    expect(fakeHvacWrapper.isOff()).toBeTruthy();
  });

  it("turns on the air at 76", () => {
    fakeHvacWrapper._temp = 76;

    controller.tick();

    expect(fakeHvacWrapper.isCooling()).toBeTruthy();
  });

  it("doesn't turn on the air at 75", () => {
    fakeHvacWrapper._temp = 75;

    controller.tick();

    expect(fakeHvacWrapper.isOff()).toBeTruthy();
  });

  it("explicitly turns the air off at 75", () => {
    fakeHvacWrapper._temp = 75;
    fakeHvacWrapper._fanOn = true;
    fakeHvacWrapper._coolOn = true;

    controller.tick();

    expect(fakeHvacWrapper.isOff()).toBeTruthy();
  });

  it("explicitly turns the heat off at 65", () => {
    fakeHvacWrapper._temp = 65;
    fakeHvacWrapper._heatOn = true;
    fakeHvacWrapper._fanOn = true;

    controller.tick();

    expect(fakeHvacWrapper.isOff()).toBeTruthy();
  });

  it("does not turn on the fan right after turning off the heater", () => {
    fakeHvacWrapper._temp = 64;
    controller.tick();
    fakeHvacWrapper._temp = 65;
    controller.tick();

    fakeHvacWrapper._temp = 64;
    controller.tick();

    expect(fakeHvacWrapper.isOff()).toBeTruthy();
  });

  it("waits for 5 minutes to turn the fan on after turning the heater off ", () => {
    fakeHvacWrapper._temp = 64;
    controller.tick();
    fakeHvacWrapper._temp = 65;
    controller.tick();

    fakeHvacWrapper._temp = 64;
    controller.tick();
    controller.tick();
    controller.tick();
    controller.tick();
    controller.tick();
    expect(fakeHvacWrapper.isOff()).toBeTruthy();

    controller.tick();
    expect(fakeHvacWrapper.isHeating()).toBeTruthy();
  });

  it("only waits for 3 min after turning off the air", () => {
    fakeHvacWrapper._temp = 76;
    controller.tick();
    fakeHvacWrapper._temp = 75;
    controller.tick();

    fakeHvacWrapper._temp = 76;
    controller.tick();
    controller.tick();
    controller.tick();
    expect(fakeHvacWrapper.isOff()).toBeTruthy();

    controller.tick();
    expect(fakeHvacWrapper.isCooling()).toBeTruthy();
  });

  it("turns off everything in the event of spike in heat", () => {
    fakeHvacWrapper._temp = 64;
    controller.tick();
    fakeHvacWrapper._temp = 76;
    controller.tick();

    expect(fakeHvacWrapper.isOff()).toBeTruthy();
  });

  it("turns off everything in the event of a sudden drop in temperature", () => {
    fakeHvacWrapper._temp = 76;
    controller.tick();
    fakeHvacWrapper._temp = 64;
    controller.tick();

    expect(fakeHvacWrapper.isOff()).toBeTruthy();
  });
});
