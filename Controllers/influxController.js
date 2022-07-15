"use strict";

const db = require("../settings/mySqlDb");
const clientInflux = require("../settings/influxDb");
const { Point } = require("@influxdata/influxdb-client");

let org = `just.hanmamedov@gmail.com`;
let bucket = `ChikenHouse`;

exports.postDataToInfluxdb = (req, res) => {
  try {

    const sensors = "SELECT farm.ID as Farm_ID, farm.Farm_Name, coops.ID as Coops_ID, coops.Name as Coops_Name, sensors.Device_ID, sensors.Position, sensors.Type  FROM sensors as sensors, coops as coops, farm as farm where sensors.Device_ID = " +
      "'" + req.body.parameters.device_id + "'" + "and coops.ID = sensors.Coops_ID and farm.ID = coops.Farm_ID"
    db.query(sensors, (err, result) => {
      if (err || result.length < 1) {
        res.status(400).send({ message: 'Sensor not found', err })
        return;
      }
      let writeClient = clientInflux.getWriteApi(org, bucket, "ns");
      result.forEach((item) => {

        let point = new Point(item.Farm_Name + " " + item.Farm_ID)
          .tag("software_version", req.body.parameters.software_version)
          .tag("device_id", item.Device_ID)
          .tag("mq137_r0", req.body.parameters.mq137_r0)
          .tag("mq136_r0", req.body.parameters.mq136_r0)
          .tag("mq135_r0", req.body.parameters.mq135_r0)
          .tag("CoopName", item.Coops_Name)
          .tag('CoopId', item.Coops_ID)
          .tag("Farm_Name", item.Farm_Name)
          .tag('Farm_Id', item.Farm_ID)
          .tag("position", item.Position)
          .tag("DeviceId", item.Device_ID)
          .floatField("temperature", req.body.telemetry.temperature)
          .floatField("humidity", req.body.telemetry.humidity)
          .floatField("pm1.0", req.body.telemetry.sps30["pm1.0"])
          .floatField("pm2.5", req.body.telemetry.sps30["pm2.5"])
          .floatField("pm4.0", req.body.telemetry.sps30["pm4.0"])
          .floatField("pm10.0", req.body.telemetry.sps30["pm10.0"])
          .floatField("nc0.5", req.body.telemetry.sps30["nc0.5"])
          .floatField("nc1.0", req.body.telemetry.sps30["nc1.0"])
          .floatField("nc2.5", req.body.telemetry.sps30["nc2.5"])
          .floatField("nc4.0", req.body.telemetry.sps30["nc4.0"])
          .floatField("nc10.0", req.body.telemetry.sps30["nc10.0"])
          .floatField("typical_size", req.body.telemetry.sps30["typical_size"])
          .floatField("h2s_ppm", req.body.telemetry.h2s_ppm)
          .floatField("nh3_ppm", req.body.telemetry.nh3_ppm)
          .floatField("co2_ppm", req.body.telemetry.co2_ppm);
        writeClient.writePoint(point);
        writeClient.flush()
      });

      res.status(200).send({ message: 'Success!' })
    });
  }
  catch (e) {
    res.status(400).send(e)
  }
}