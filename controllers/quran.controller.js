const db = require("../lib/db");

// api version
const getSurahs = async (req, res) => {
    var dbo = db.getDb();

    // dbo.collection("surahs").find({}, { projection: { englishName: 1, name: 1 } }).toArray(function (err, result) {
    //     if (err) throw err;

    //     let responseApi = {
    //         status: true,
    //         data: result
    //     }
    //     res.json(responseApi);
    // });
    dbo.collection("surahs").aggregate(
        [
            { $project: { name: { $concat: ["$englishName", " - ", "$name"] } } }
        ]
    ).toArray(function (err, result) {
        if (err) throw err;

        let responseApi = {
            status: true,
            data: result
        }
        res.json(responseApi);
    });
};

module.exports = {
    getSurahs
};