"use strict";

const db = require("./../settings/mySqlDb");
//get
exports.getSensors = (req, res) => {
  const sensors =
    "SELECT `ID`, `Coops_ID`, `Position`, `Device_ID`, `Type` FROM `sensors` WHERE `Coops_ID` = '" +
    req.params.id +
    "'";

  db.query(sensors, (error, results) => {
    if (error) {
      res.status(400).send({ message: error });
    } else {
      results = results.map(x => {
        return {
          ...x,
          Device_ID: x.Device_ID ? x.Device_ID : ''
        }
      })
      res.status(200).send({ result: results });
    }
  });
};

//post
exports.createDeviceId = async (req, res) => {  

  
  let arrayForCheck = [];
  req.body.forEach( sensor => {
    if(sensor.Device_ID === '') {
      arrayForCheck.push(sensor.Device_ID)
    }
  });
  let isAllEmpty = arrayForCheck.length === 6 ? true : false;
  
  if (req.body.length) {
    let coopId = req.body[0].Coops_ID
    let filteredIds = req.body.filter(el => el.Device_ID !== '')
    let deviceIds = filteredIds.map(element => element.Device_ID)
    

    if(!isAllEmpty) {

      const sensors =
        `SELECT Device_ID, Coops_ID FROM sensors WHERE Device_ID IN (${deviceIds.reduce((acc, curr, ind) => acc + "'" + curr + (ind === deviceIds.length - 1 ? "'" : "',"), "")})`;
  
      db.query(sensors, async (error, result) => {
        if (error) {
          res.status(400).send({ message: error })
        } else {
          let resultForCheck = []
          result.forEach( sensor => {
            if(sensor.Coops_ID !== coopId) resultForCheck.push(sensor) 
          })
  
          if (resultForCheck.length > 0) {
            res.status(400).send({ result: 'Some names are duplicates' });
            return;
          } else {
  
            let results = [];
            let promises = [];
            for (let i = 0; i < req.body.length; i++) {
              const sensors =
                "UPDATE `sensors` SET `Device_ID` = '" +
                req.body[i].Device_ID +
                "' WHERE `ID` = '" +
                req.body[i].ID +
                "'";
                promises.push(new Promise((resolve) => {
                  db.query(sensors, (error, sensorsResult) => {
                    results.push(sensorsResult)
                    resolve(1);
                });
              }))
            }
  
            await Promise.all(promises);
            res.status(200).send({ result: results })
          }
        }
      })
    } else {



       let results = [];
      let promises = [];



      for (let i = 0; i < 6; i++) {
        const sensors =
          "UPDATE `sensors` SET `Device_ID` = '" +
          '' +
          "' WHERE `ID` = '" +
          req.body[i].ID +
          "'";
          promises.push(new Promise((resolve) => {
            db.query(sensors, (error, sensorsResult) => {
              results.push(sensorsResult)
              resolve(1);
          });
        }))
      }

      await Promise.all(promises);
      res.status(200).send({ result: results }) 



    }





  }
};
