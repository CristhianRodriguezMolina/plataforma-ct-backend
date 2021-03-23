import mongoose from 'mongoose';

/**
 * Data base configuration
 * NoSQL MongoDB
 */
const URI = process.env.MONGODB_URI;
// const URI = 'mongodb://127.0.0.1:27017/ct-database'
mongoose.connect(URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));