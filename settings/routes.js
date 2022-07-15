"use strict";

module.exports = (app) => {
  const user = require("./../settings/firebaseDb");
  const farm = require("./../Controllers/farmController");
  const coops = require("./../Controllers/coopsController");
  const sensors = require("./../Controllers/sensorsController");
  const sensorsValidation = require('./../Controllers/sensorsValidatonController');
  const influx = require('../Controllers/influxController');
  // const authMiddleware = require('../Middleware/auth');

  app.route("/api/auth/signin").get(user.signIn);

  app.route("/api/auth/signup").post(user.signUp);
  app.route("/api/auth/signin").post(user.signIn);

  app.route("/api/farms").get(farm.getFarms);
  app.route("/api/create-farms").post(farm.createFarms);
  app.route("/api/update-farms/:id").put(farm.updateFarms);
  app.route("/api/delete-farms/:id").delete(farm.deleteFarms);

  app.route("/api/coops/:id").get(coops.getCoops);
  app.route("/api/create-coops").post(coops.createCoops);
  app.route("/api/update-coops/:id").put(coops.updateCoops);
  app.route("/api/delete-coops/:id").delete(coops.deleteCoops);

  app.route("/api/sensors/:id").get(sensors.getSensors);
  app.route('/api/sensors-is-valid/:deviceId/:coopId').get(sensorsValidation.getValidDeviceId)
  app.route("/api/create-deviceId").put(sensors.createDeviceId);

  app.route("/api/postData-to-influxDb").post(influx.postDataToInfluxdb);
};
