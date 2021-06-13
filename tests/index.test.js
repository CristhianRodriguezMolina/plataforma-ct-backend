import dotenv from 'dotenv/config';
import mongoose from 'mongoose';

import path, { resolve } from 'path';
import fs from 'fs';

//DB Schema imports
import Person from '../src/models/Person';

import './auth.test';
import './user.test';
import './course.test';
import './activity.test';

/**
 * Data base configuration
 * NoSQL MongoDB
 */
const URI = process.env.MONGODB_URI;


/**
 * Connecting to database
 */
before((done) => {
	if (mongoose.connection.db) return done();

	mongoose.connect("mongodb+srv://Cristh:WinterHat@cluster-ct.aqcqb.mongodb.net/ct-database?retryWrites=true&w=majority", {
		useCreateIndex: true,
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	}, done);
});


/**
 * Adding some temporal students for test the functionality to add students to a course (course-student.test)
 */
before(async () => {
	const students = [
		new Person({
			first_name: "temp student 1",
			last_name: "rJ5TcUWFvxAuxD3X",
			genre: "Male",
			id: "rNzb8ZW5KgZVceVY",
			password: "12345",
			role: "student"
		}),
		new Person({
			first_name: "temp student 2",
			last_name: "rJ5TcUWFvxAuxD3X",
			genre: "Male",
			id: "sXEDs3gYEphBjNUz",
			password: "12345",
			role: "student"
		})
	];

	return new Promise((resolve, reject) => {
		Person.insertMany(students, (err, studentDocs) => {
			if (err) reject(err);
			resolve(studentDocs);
		});
	}).then(docs => {
		return new Promise((resolve, reject) => {
			var myJsonString = JSON.stringify(docs);
			let filePath = path.join(__dirname, './static_test/tempStudents.json');
			fs.writeFile(filePath, myJsonString, (err) => {
				if (err) return reject(err);
				console.log('Temp students documents has been created');
				resolve();
			});
		})

	}).catch(e => {
		return Promise.reject(e);
	});
});

/**
 * Delete temporal students documents after the test ends
 */
after((done) => {
	Person.deleteMany({ last_name: "rJ5TcUWFvxAuxD3X" }, (err) => {
		if (err) done(err);
		console.log('Temp students documents has been deleted');
		done()
	})
});



