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

const getAyahs = async (req, res) => {
    var dbo = db.getDb();
    var string2ID = db.string2ID;

    // data from fe
    let { id } = req.params;
    dbo.collection("surahs").find({_id: string2ID(id)}, { projection: { _id: 0, ayahs: 1 }}).toArray(function (err, result) {
        if (err) throw err;

        let responseApi = {
            status: true,
            data: result?.[0]?.ayahs || []
        }
        res.json(responseApi);
    });
};

module.exports = {
    getSurahs,
    getAyahs
};