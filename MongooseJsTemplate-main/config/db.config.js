const mongoose = require('mongoose');

async function connectToDb() {
    await mongoose.connect(
        `mongodb://user1:1234@ac-5mp0uee-shard-00-00.ckdc5tq.mongodb.net:27017,ac-5mp0uee-shard-00-01.ckdc5tq.mongodb.net:27017,ac-5mp0uee-shard-00-02.ckdc5tq.mongodb.net:27017/?ssl=true&replicaSet=atlas-y2b8k6-shard-0&authSource=admin&appName=Cluster0`    );
}

mongoose.connection.on('error', err => {
    console.log(err);
});

module.exports = () =>
    connectToDb()
        .then(() => console.log('Connected to MongoDB Atlas'))
        .catch(console.log);
