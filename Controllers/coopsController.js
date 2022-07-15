const db = require("./../settings/mySqlDb");

exports.getCoops = (req, res) => {
    const currentFarm = req.params.id;
    const coops =
        "SELECT `ID`, `Name`, `Farm_ID` FROM `coops` WHERE `Farm_ID` = '" +
        currentFarm +
        "'";

    db.query(coops, (error, results) => {
        if (error) {
            res.status(400).send({ message: error });
        } else {
            res.status(200).send({ result: results });
        }
    });
};

exports.createCoops = (req, res) => {
    const coops =
        "INSERT INTO `coops` (`Name`, `Farm_ID`) VALUES('" +
        req.body.name +
        "', '" +
        req.body.id +
        "')";

    db.query(coops, (error, results) => {
        if (error) {
            res.status(400).send({ message: error });
        } else {
            for (let i = 1; i < 7; i++) {
                const sensors =
                    "INSERT INTO `sensors`(`Coops_ID`, `position`, `Type`) VALUES('" +
                    results.insertId +
                    "', '" +
                    i +
                    "', '" +
                    1 +
                    "')";

                db.query(sensors, (error, sensorResult) => {
                    if (error) {
                        res.status(400).send({ message: 'Cannot create a coop', error });
                    } else {
                        results[i] = sensorResult;
                    }
                });
            }
            res.status(200).send({ result: results });
        }
    });
};

exports.updateCoops = (req, res) => {
    const coops =
        "UPDATE `coops` SET `Name` = '" +
        req.body.Name +
        "' WHERE `ID` = '" +
        req.body.ID +
        "'";

    db.query(coops, (error, results) => {
        if (error) {
            res.status(400).send({ message: error });
        } else {
            res.status(200).send({ result: results });
        }
    });
};

exports.deleteCoops = (req, res) => {
    const coops = "DELETE FROM `coops` WHERE `ID` = '" + req.params.id + "'";

    db.query(coops, (error, results) => {
        if (error) {
            res.status(400).send({ message: error });
        } else {
            const sensors =
                "DELETE FROM `sensors` WHERE `Coops_ID` = '" + req.params.id + "'";

            db.query(sensors, (error, sensorsDeleteResult) => {
                if (error) {
                    res.status(400).send({ message: error });
                } else {
                    res.status(200).send({ result: sensorsDeleteResult });
                }
            });
        }
    });
};
