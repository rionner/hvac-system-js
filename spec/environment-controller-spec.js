describe("environmentController", function() {

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

  it ("ticks", () => {
    controller = new EnvironmentController(hvacDummy);

    controller.tick();
  });
});
