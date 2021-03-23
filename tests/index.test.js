import dotenv from 'dotenv/config';
import mongoose from 'mongoose'
import './user.test';

/**
 * Data base configuration
 * NoSQL MongoDB
 */
const URI = process.env.MONGODB_URI;

before((done) => {
    if (mongoose.connection.db) return done();
    
    mongoose.connect(URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }, done);
});

 

