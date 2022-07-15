const db = require("./../settings/mySqlDb");

exports.getFarms = (req, res) => {
  const farms = "SELECT `ID`, `Farm_Name` FROM `farm`";

  db.query(farms, (error, results) => {
    if (error) {
      res.status(400).send({ message: error });
    } else {
      res.status(200).send({ user: results });
    }
  });
};

exports.createFarms = (req, res) => {
  const farms =
    "INSERT INTO `farm`(`Farm_Name`) VALUES('" + req.body.name + "')";

  db.query(farms, (error, results) => {
    if (error) {
      res.status(400).send({ message: error });
    } else {
      res.status(200).send({ user: results });
    }
  });
};

exports.updateFarms = (req, res) => {
  const farms =
    "UPDATE `farm` SET `Farm_Name` = '" +
    req.body.name +
    "' WHERE `ID` = '" +
    req.body.id +
    "'";

  db.query(farms, (error, results) => {
    if (error) {
      res.status(400).send({ message: error });
    } else {
      res.status(200).send({ user: results });
    }
  });
};

exports.deleteFarms = (req, res) => {
  const coopsOfFarm = `SELECT coops.Name FROM coops WHERE coops.Farm_ID = ${req.params.id}`;

  db.query(coopsOfFarm, (error, result) => {
    if (error) {
      res.status(400).send({ result: error })
    } else {
      if (result.length) {
        console.log('if coopsOfFarm exist', result)
        const farms =
          `DELETE FROM farm, coops, sensors USING farm, coops, sensors WHERE farm.ID = ${req.params.id} AND farm.ID = coops.Farm_ID AND coops.ID = sensors.Coops_ID`

        db.query(farms, (error, farmResult) => {
          if (error) {
            res.status(400).send({ message: error });
          } else {
            res.status(200).send({ result: farmResult })
          }
        })
      } else {
        const deleteSingleFarm =
          `DELETE FROM farm WHERE farm.ID = ${req.params.id}`

        db.query(deleteSingleFarm, (error, result) => {
          if (error) {
            res.status(400).send({ result: error })
          } else {
            console.log('if coopsOfFarm not exist', result)
            res.status(200).send({ result: result })
          }
        })
      }
    }
  });
};
