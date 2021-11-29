const { MongoClient, ObjectID, Db } = require("mongodb");

const connctionURL = 'mongodb://localhost:27017';
const databaseName = 'test';

const id = new ObjectID();
console.log(id);
console.log(id.getTimestamp());

MongoClient.connect(connctionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log("Unable to connect to database");
    }
    const db = client.db(databaseName);

    /* Challange DeleteOne */
    db.collection("tasks").deleteOne({
        _id: new ObjectID("617e2004c25aa5f3a5cf135d")
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.error(error);
    })

})