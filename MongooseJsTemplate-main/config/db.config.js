const mongoose = require('mongoose');

async function connectToDb() {
    await mongoose.connect(
        `<Put your connection string here>`,
    );
}

mongoose.connection.on('error', err => {
    console.log(err);
});

module.exports = () =>
    connectToDb()
        .then(() => console.log('Connected to MongoDB Atlas'))
        .catch(console.log);
