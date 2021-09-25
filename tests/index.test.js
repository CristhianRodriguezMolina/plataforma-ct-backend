import mongoose from 'mongoose';

import path, { resolve } from 'path';
import fs from 'fs';

//DB Schema imports
import Person from '../src/models/Person';
import Activity from '../src/models/Activity';

import './auth.test';
import './user.test';
import './activity.test';



/**
 * Connecting to database
 */
before((done) => {
	if (mongoose.connection.db) return done();

	mongoose.connect("mongodb://127.0.0.1:27017/ct-database", {
		useCreateIndex: true,
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	}, done);
});

/**
 * Adding some temporal activities for test the functionality to add activities to a task (task-activity.test)
 */
before(async () => {
	const activities = [
		new Activity({
			name: "Temp activity 1",
			description: "c9KY7Q8Qg2Br5zDY",
			type: "logic_sequence",
			creator: "60b98fe8b1465f35148b53e4"
		}),
		new Activity({
			name: "Temp activity 2",
			description: "c9KY7Q8Qg2Br5zDY",
			type: "logic_sequence",
			creator: "60b98fe8b1465f35148b53e4"
		})
	];

	return new Promise((resolve, reject) => {
		Activity.insertMany(activities, (err, activitiesDocs) => {
			if (err) reject(err);
			resolve(activitiesDocs);
		});
	}).then(docs => {
		return new Promise((resolve, reject) => {
			var myJsonString = JSON.stringify(docs);
			let filePath = path.join(__dirname, './static_test/tempActivities.json');
			fs.writeFile(filePath, myJsonString, (err) => {
				if (err) return reject(err);
				console.log('Temp activities documents has been created');
				resolve();
			});
		})

	}).catch(e => {
		return Promise.reject(e);
	});
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
		});

	}).catch(e => {
		return Promise.reject(e);
	});
});

// ==================================================================================
// DELETING DOCUMENTS
// ==================================================================================



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

/**
 * Delete temporal activities documents after the test ends
 */
after((done) => {
	Activity.deleteMany({ description: "c9KY7Q8Qg2Br5zDY" }, (err) => {
		if (err) done(err);
		console.log('Temp activities documents has been deleted');
		done()
	})
});


