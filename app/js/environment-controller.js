// I did this all es5 style, moment of whimsy. Don't take this to imply I normally don't use modules or classes.

HvacWrapper = function(hvac) {
  this.temp = function() {
    return hvac.getTemp();
  };

  this.turnOnHeat = function() {
    hvac.setHeat(true);
  };

  this.turnOffHeat = function() {
    hvac.setHeat(false);
  };

  this.turnOnAir = function() {
    hvac.setCool(true);
  };

  this.turnOffAir = function() {
    hvac.setCool(false);
  };

  this.turnOnFan = function() {
    hvac.setFan(true);
  };

  this.turnOffFan = function() {
    hvac.setFan(false);
  };

  return this;
};

EnvironmentController = function(hvac) {
  const HEAT_SLEEP_TIME = 5;
  const AIR_SLEEP_TIME = 3;
  const MINIMUM_TEMP = 65;
  const MAX_TEMP = 75;

  this._sleepRemaining = 0;
  this._previousTemp = -Number.MAX_SAFE_INTEGER;

  this.tick = function() {
    if (this.isSleeping()) {
      this.sleepAnotherMinute();
    } else {
      if (hvac.temp() < MINIMUM_TEMP && !this.wasCooling())  {
        hvac.turnOnHeat();
        hvac.turnOnFan();
      } else if (hvac.temp() > MAX_TEMP && !this.wasHeating()) {
        hvac.turnOnAir();
        hvac.turnOnFan();
      } else {
        hvac.turnOffFan();
        hvac.turnOffAir();
        hvac.turnOffHeat();
        this.startSleeping();
      }
      this._previousTemp = hvac.temp();
    }
  };

  this.isSleeping = function() {
    return this._sleepRemaining != 0;
  };

  this.sleepAnotherMinute = function() {
    this._sleepRemaining--;
  };

  this.wasHeating = function() {
    return this._previousTemp != -Number.MAX_SAFE_INTEGER &&
        this._previousTemp < MINIMUM_TEMP;
  };

  this.wasCooling = function() {
    return this._previousTemp > MAX_TEMP;
  };

  this.startSleeping = function() {
    if (this.wasHeating())  {
      this._sleepRemaining = HEAT_SLEEP_TIME;
    } else if (this.wasCooling()) {
      this._sleepRemaining = AIR_SLEEP_TIME;
    }
  };

  return this;
};
