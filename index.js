// Emulating environment
require('dotenv').config();

const app = require('./app');
const db = require('./lib/db');

let server;
db.connectToServer((err, client) => {
    if (err) console.log(err);

    // DB Successfully connected
    console.log(`Database successfully connected`);

    // Creating collections
    let dbo = client.db(`${process.env?.DB_NAME || ''}`);
    dbo.createCollection("albums", function (err, res) {
        if (err) console.log(err?.message);
        console.log("Album collection created!");
    });

    // For dummy data
    // var myobj = { caption: "Company Inc", image: "boy.jpeg"};
    // dbo.collection("albums").insertOne(myobj, function (err, res) {
    //     if (err) throw err;
    //     console.log("1 document inserted to albums collection");
    // });

    server = app.listen(process.env?.APP_PORT || 3000, () => {
        console.log(`Listening to port ${process.env?.APP_PORT || 3000}`);
    });
})