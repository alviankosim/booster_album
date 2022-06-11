// Emulating environment
require('dotenv').config();

const db = require("../db"),
    quranJSON = require('./quran.json');

db.connectToServer((err, client) => {
    if (err) console.log(err);

    // DB Successfully connected
    console.log(`Database successfully connected`);

    // Creating collections
    let dbo = client.db(`${process.env?.DB_NAME || ''}`);
    dbo.createCollection("surahs", function (err, res) {
        if (err) console.log(err?.message);
        console.log("Surah collection created!");
    });

    // For uploading ayah data
    for (const key in quranJSON) {
        if (Object.hasOwnProperty.call(quranJSON, key)) {
            const singleSurah = quranJSON[key];
            dbo.collection("surahs").insertOne(singleSurah, function (err, res) {
                if (err) throw err;
                console.log(`1 surah: ${singleSurah?.number} - ${singleSurah?.englishName} inserted to surahs collection`);
            });
        }
    }
})