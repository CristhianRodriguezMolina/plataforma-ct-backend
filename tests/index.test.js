import dotenv from 'dotenv/config';
import mongoose from 'mongoose'
import './user.test';
import './activity.test';
import './course.test';
 
/**
 * Data base configuration
 * NoSQL MongoDB
 */
const URI = process.env.MONGODB_URI;

before((done) => {
    if (mongoose.connection.db) return done();
    
    mongoose.connect("mongodb+srv://Cristh:WinterHat@cluster-ct.aqcqb.mongodb.net/ct-database?retryWrites=true&w=majority", {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }, done);
});

 

