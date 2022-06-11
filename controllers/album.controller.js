const db = require("../lib/db");

// api version
const getAlbum = async (req, res) => {
    var dbo = db.getDb();

    dbo.collection("albums").find({}).toArray(function (err, result) {
        if (err) throw err;

        let responseApi = {
            status: true,
            data: result
        }
        res.json(responseApi);
    });
};

const addAlbum = async (req, res) => {
    var dbo = db.getDb();

    // data from fe
    let { caption, image } = req.body;

    let insertData = { caption, image };
    dbo.collection("albums").insertOne(insertData, function (err, result) {
        if (err) throw err;

        let responseApi = {
            status: true,
            data: null
        }
        res.json(responseApi);
    });
};

const editAlbum = async (req, res) => {
    var dbo = db.getDb();
    var string2ID = db.string2ID;

    // data from fe
    let { caption, image } = req.body;
    let { id } = req.params;

    let condition = { _id: string2ID(id) };
    let updateData = { $set: { caption, image } };
    dbo.collection("albums").updateOne(condition, updateData, function (err, result) {
        if (err) throw err;

        let responseApi = {
            status: true,
            data: null
        }
        res.json(responseApi);
    });
};

const deleteAlbum = async (req, res) => {
    var dbo = db.getDb();
    var string2ID = db.string2ID;

    // data from fe
    let { id } = req.params;
    var deleteCondition = { _id: string2ID(id) };
    dbo.collection("albums").deleteOne(deleteCondition, function (err, obj) {
        if (err) throw err;

        let responseApi = {
            status: true,
            data: null
        }
        res.json(responseApi);
    });
};

// web version
const viewAlbum = async (req, res) => {
    res.render("album/index");
};

module.exports = {
    getAlbum,
    addAlbum,
    editAlbum,
    deleteAlbum,
    viewAlbum
};