import request from 'supertest';

import app from '../src/app';

import fs from 'fs';

import path from 'path';

import assert from "assert";

var userToken = null;
var tempStudents = null;
var tempActivities = null;
var courseID = null;
var unitID = null;
var taskID = null;
var studentActivityID = null;

describe('REQUEST /api/activity', () => {
	//Obtaining user token for do the tests
	before(done => {
		let userTokenPath = path.join(__dirname, './static_test/userToken.txt');
		try {
			userToken = fs.readFileSync(userTokenPath, 'utf8');
			console.log('User Token defined');
			done();
		} catch (err) {
			console.log('User token not found');
			done(err);
		}
	});

	before((done) => {
		let courseIDPath = path.join(__dirname, './static_test/courseID.txt');
		try {
			courseID = fs.readFileSync(courseIDPath, 'utf8');
			console.log('Course ID defined');
			done();
		} catch (err) {
			console.log('Course ID not found');
			done(err);
		}
	});

	before((done) => {
		let unitIDPath = path.join(__dirname, './static_test/unitID.txt');
		try {
			unitID = fs.readFileSync(unitIDPath, 'utf8');
			console.log('Unit ID defined');
			done();
		} catch (err) {
			console.log('Unit ID not found');
			done(err);
		}
	});

	before((done) => {
		let taskIDPath = path.join(__dirname, './static_test/taskID.txt');
		try {
			taskID = fs.readFileSync(taskIDPath, 'utf8');
			console.log('task ID defined');
			done();
		} catch (err) {
			console.log('task ID not found');
			done(err);
		}
	});

	/**
	 * Obtaining temporal students to relate with a activity
	 */
	before(done => {
		let tempStudentsPath = path.join(__dirname, './static_test/tempStudents.json');
		try {
			let data = fs.readFileSync(tempStudentsPath, 'utf8');
			tempStudents = JSON.parse(data);
			console.log('Temporal student found');
			done();
		} catch (err) {
			console.log('Temporal student not found');
			done(err);
		}
	});

	/**
	 * Obtaining temporal activities to relate with a student
	 */
	before(done => {
		let tempActivitiesPath = path.join(__dirname, './static_test/tempActivities.json');
		try {
			let data = fs.readFileSync(tempActivitiesPath, 'utf8');
			tempActivities = JSON.parse(data);
			console.log('Temporal activity found');
			done();
		} catch (err) {
			console.log('Temporal activity not found');
			done(err);
		}
	});

	describe('Relate a student with an activity', () => {

		it('Responds with a json containing a message for notify No token provided', (done) => {
			request(app)
				.post(`/api/student-activity`)
				.send({
					courseId: courseID,
					unitId: unitID,
					taskId: taskID,
					activityId: tempActivities[0]._id,
					studentId: tempStudents[0]._id
				})
				.set('Accept', 'application/json')
				.expect(403)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'No token provided');
				})
				.end((err, res) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify That the course provided doesnt exist', (done) => {
			request(app)
				.post(`/api/student-activity`)
				.send({
					courseId: '666666666666666666666666',
					unitId: unitID,
					taskId: taskID,
					activityId: tempActivities[0]._id,
					studentId: tempStudents[0]._id
				})
				.set('x-access-token', userToken)
				.set('Accept', 'application/json')
				.expect(404)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'No existe una relacion entre la tarea y la actividad');
				})
				.end((err, res) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify That the unit provided doesnt exist', (done) => {
			request(app)
				.post(`/api/student-activity`)
				.send({
					courseId: courseID,
					unitId: '666666666666666666666666',
					taskId: taskID,
					activityId: tempActivities[0]._id,
					studentId: tempStudents[0]._id
				})
				.set('x-access-token', userToken)
				.set('Accept', 'application/json')
				.expect(404)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'No existe una relacion entre la tarea y la actividad');
				})
				.end((err, res) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify That the unit provided doesnt exist (test 1)', (done) => {
			request(app)
				.post(`/api/student-activity`)
				.send({
					courseId: courseID,
					unitId: unitID,
					taskId: '666666666666666666666666',
					activityId: tempActivities[0]._id,
					studentId: tempStudents[0]._id
				})
				.set('x-access-token', userToken)
				.set('Accept', 'application/json')
				.expect(404)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'No existe una relacion entre la tarea y la actividad');
				})
				.end((err, res) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify That the unit provided doesnt exist (test 2)', (done) => {
			request(app)
				.post(`/api/student-activity`)
				.send({
					courseId: courseID,
					unitId: unitID,
					taskId: taskID,
					activityId: '666666666666666666666666',
					studentId: tempStudents[0]._id
				})
				.set('x-access-token', userToken)
				.set('Accept', 'application/json')
				.expect(404)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'No existe una relacion entre la tarea y la actividad');
				})
				.end((err, res) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify That the unit provided doesnt exist (test 3)', (done) => {
			request(app)
				.post(`/api/student-activity`)
				.send({
					courseId: courseID,
					unitId: unitID,
					taskId: taskID,
					activityId: tempActivities[0]._id,
					studentId: '666666666666666666666666'
				})
				.set('x-access-token', userToken)
				.set('Accept', 'application/json')
				.expect(404)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'Estudiante no encontrado');
				})
				.end((err, res) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify that a student-activity has been created', (done) => {
			request(app)
				.post(`/api/student-activity`)
				.send({
					courseId: courseID,
					unitId: unitID,
					taskId: taskID,
					activityId: tempActivities[0]._id,
					studentId: tempStudents[0]._id
				})
				.set('x-access-token', userToken)
				.set('Accept', 'application/json')
				.expect(200)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'Entidad student activity creada');
				})
				.end((err, res) => {
					if (err) return done(err);
					let filePath = path.join(__dirname, './static_test/studentActivityID.txt');
					fs.writeFile(filePath, res.body.savedStudentActivity._id, (err) => {
						if (err) console.error(err);
					});
					done();
				});
		});


	});

	describe('Update a student-activity', () => {
		before((done) => {
			let studentActivityIDPath = path.join(__dirname, './static_test/studentActivityID.txt');
			try {
				studentActivityID = fs.readFileSync(studentActivityIDPath, 'utf8');
				console.log('Student Activity ID defined');
				done();
			} catch (err) {
				console.log('Student Activity ID not found');
				done(err);
			}
		});

		it('Responds with a json containing a message for notify No token provided', done => {
			request(app)
				.put(`/api/student-activity/${studentActivityID}`)
				.send({
					grade: 4,
					complete: true
				})
				.set('Accept', 'application/json')
				.expect(403)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'No token provided');
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify No data sent', done => {
			request(app)
				.put(`/api/student-activity/${studentActivityID}`)
				.set('x-access-token', userToken)
				.set('Accept', 'application/json')
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'Falta los datos para editar la entidad StudentActivity');
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify that the student activity has not been found', done => {
			request(app)
				.put(`/api/student-activity/666666666666666666666666`)
				.send({
					grade: 4,
					complete: true
				})
				.set('x-access-token', userToken)
				.set('Accept', 'application/json')
				.expect(404)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'Entidad StudentActivity no entontrada');
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify that the student activity has not been found', done => {
			request(app)
				.put(`/api/student-activity/${courseID}/${taskID}/666666666666666666666666/${tempStudents[0]._id}`)
				.send({
					grade: 4,
					complete: true
				})
				.set('x-access-token', userToken)
				.set('Accept', 'application/json')
				.expect(404)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'Entidad StudentActivity no entontrada');
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify that a student-activity has been updated', done => {
			request(app)
				.put(`/api/student-activity/${courseID}/${taskID}/${tempActivities[0]._id}/${tempStudents[0]._id}`)
				.send({
					grade: 4,
					complete: true
				})
				.set('x-access-token', userToken)
				.set('Accept', 'application/json')
				.expect(200)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'Entidad student activity actualizada satisfactoriamente');
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify that a student-activity has been updated', done => {
			request(app)
				.put(`/api/student-activity/${studentActivityID}`)
				.send({
					grade: 5,
				})
				.set('x-access-token', userToken)
				.set('Accept', 'application/json')
				.expect(200)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'Entidad student activity actualizada satisfactoriamente');
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});
	});

	describe('Get student activity entities', () => {
		it('Responds with a json containing a message for notify No token provided', done => {
			request(app)
				.get(`/api/student-activity/${studentActivityID}`)
				.expect(403)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'No token provided');
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify that a student-activity has not been found', done => {
			request(app)
				.get(`/api/student-activity/666666666666666666666666`)
				.set('x-access-token', userToken)
				.expect(404)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'Entidad student activity no encontrada');
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify No data sent', done => {
			request(app)
				.post(`/api/student-activity/foreign`)
				.set('x-access-token', userToken)
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'No envio datos para buscar la entidad student activity');
					assert.strictEqual(res.body.found, false);
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify that a student-activity has not been found', done => {
			request(app)
				.post(`/api/student-activity/foreign`)
				.send({
					course: courseID,
					unit: unitID,
					task: '666666666666666666666666',
				})
				.set('x-access-token', userToken)
				.expect(200)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'Entidad student activity no encontrada o inexistente');
					assert.strictEqual(res.body.found, false);
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify that a student-activity has been found', done => {
			request(app)
				.get(`/api/student-activity/${studentActivityID}`)
				.set('x-access-token', userToken)
				.expect(200)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'Entidad student activity obtenida satisfactoriamente');
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify that a student-activity has been found', done => {
			request(app)
				.post(`/api/student-activity/foreign`)
				.send({
					course: courseID,
					unit: unitID,
					task: taskID,
				})
				.set('x-access-token', userToken)
				.expect(200)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'Entidad student activity obtenida satisfactoriamente');
					assert.strictEqual(res.body.found, true);
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});
	});

	describe('Remove a student activity entity', () => {
		it('Responds with a json containing a message for notify No token provided', done => {
			request(app)
				.delete(`/api/student-activity/${studentActivityID}`)
				.expect(403)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'No token provided');
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify that a student-activity has not been found', done => {
			request(app)
				.delete(`/api/student-activity/666666666666666666666666`)
				.set('x-access-token', userToken)
				.expect(404)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'Entidad student activity no encontrada');
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify that a student-activity has been deleted', done => {
			request(app)
				.delete(`/api/student-activity/${studentActivityID}`)
				.set('x-access-token', userToken)
				.expect(200)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'Entidad student activity borrada satisfactoriamente');
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

	});


});

