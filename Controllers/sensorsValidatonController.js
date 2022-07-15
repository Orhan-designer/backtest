'use strict'

const db = require("./../settings/mySqlDb");

exports.getValidDeviceId = (req, res) => {
    const sensorsSelect = `SELECT Device_ID, Coops_ID FROM sensors WHERE Device_ID = ${req.params.deviceId}`;
    db.query(sensorsSelect, (error, sensorsResults) => {
        let filteredSensorResults = [];

        if(sensorsResults) {
            sensorsResults.forEach( sensor => {
                if(sensor.Coops_ID !== +req.params.coopId) {
                    filteredSensorResults.push(sensor)
                }
            })
        }
        
        if (filteredSensorResults.length) {
            res.status(200).send({ result: false });
        } else {
            res.status(200).send({ result: true });
        }
    });
};

/* exports.getValidDeviceId = (req, res) => {
    const sensorsSelect = `SELECT Device_ID FROM sensors WHERE Device_ID = ${req.params.deviceId}`;

    db.query(sensorsSelect, (error, sensorsResults) => {
        if (sensorsResults) {
            res.status(400).send({ result: false });
        } else {
            res.status(200).send({ result: true });
        }
    });
}; */