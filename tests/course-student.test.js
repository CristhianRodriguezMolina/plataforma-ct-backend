import request from 'supertest';

import app from '../src/app';

import fs from 'fs';

import path from 'path';

import assert from "assert";

var userToken = null;
var tempStudents = null;
var courseID = null;

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

	/**
	 * Obtaining temporal students for adding to a course
	 */
	before(done => {
		let tempStudentsPath = path.join(__dirname, './static_test/tempStudents.json');
		try {
			let data = fs.readFileSync(tempStudentsPath, 'utf8');
			tempStudents = JSON.parse(data);
			console.log('User Token defined');
			done();
		} catch (err) {
			console.log('User token not found');
			done(err);
		}
	});

	describe('Add students to a course', () => {

		it('Responds with a json containing a message for notify No token provided', (done) => {
			request(app)
				.post(`/api/course/students/${courseID}`)
				.send({
					students: [
						{
							_id: tempStudents[0]._id
						},
						{
							_id: tempStudents[1]._id
						}
					]
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

		it('Responds with a json containing a message for notify students not found', (done) => {
			request(app)
				.post(`/api/course/students/${courseID}`)
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Los estudiantes no fueron encontrados");
				})
				.end((err, res) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify course not found', (done) => {
			request(app)
				.post('/api/course/students/666666666666666666666666')
				.send({
					students: [
						{
							_id: tempStudents[0]._id
						},
						{
							_id: tempStudents[1]._id
						}
					]
				})
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Curso no encontrado");
				})
				.end((err, res) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify students accepted: 1, students denied: 0', (done) => {
			request(app)
				.post(`/api/course/students/${courseID}`)
				.send({
					students: [
						{
							_id: tempStudents[0]._id
						}
					]
				})
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(201)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'Estudiantes añadidos al curso satisfactoriamente');
					assert.strictEqual(res.body.acceptedStudents.length, 1);
				})
				.end((err, res) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify students accepted: 1, students denied: 1', (done) => {
			request(app)
				.post(`/api/course/students/${courseID}`)
				.send({
					students: [
						{
							_id: tempStudents[0]._id
						},
						{
							_id: tempStudents[1]._id
						}
					]
				})
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(201)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'Estudiantes añadidos al curso satisfactoriamente');
					assert.strictEqual(res.body.acceptedStudents.length, 1);
					assert.strictEqual(res.body.deniedStudents.length, 1);
				})
				.end((err, res) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify students accepted: 0, students denied: 2', (done) => {
			request(app)
				.post(`/api/course/students/${courseID}`)
				.send({
					students: [
						{
							_id: tempStudents[0]._id
						},
						{
							_id: tempStudents[1]._id
						}
					]
				})
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(201)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'Estudiantes añadidos al curso satisfactoriamente');
					assert.strictEqual(res.body.acceptedStudents.length, 0);
					assert.strictEqual(res.body.deniedStudents.length, 2);
				})
				.end((err, res) => {
					if (err) return done(err);
					done();
				});
		});
	});


	describe('Remove students to a course', () => {
		it('Responds with a json containing a message for notify no token provided', done => {
			request(app)
				.delete(`/api/course/students/${courseID}/${tempStudents[0]._id}`)
				.expect(403)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'No token provided');
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify student or course not found', done => {
			request(app)
				.delete('/api/course/students/666666666666666666666666/666666666666666666666666')
				.set('x-access-token', userToken)
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Curso o estudiante no encontrado");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify temp student 1 has been removed from course', done => {
			request(app)
				.delete(`/api/course/students/${courseID}/${tempStudents[0]._id}`)
				.set('x-access-token', userToken)
				.expect(201)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Estudiante eliminado satisfactoriamente");
				})
				.end((err, res) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify temp student 2 has been removed from course', done => {
			request(app)
				.delete(`/api/course/students/${courseID}/${tempStudents[1]._id}`)
				.set('x-access-token', userToken)
				.expect(201)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Estudiante eliminado satisfactoriamente");
				})
				.end((err, res) => {
					if (err) return done(err);
					done();
				});
		});
	});


});

