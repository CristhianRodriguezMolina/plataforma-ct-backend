import request from 'supertest';

import app from '../src/app';

import fs from 'fs';

import path from 'path';

import assert from "assert";

var userToken = null;

describe('REQUEST /api/activity', () => {
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

	describe('Add students to a course', () => {

		it('Responds with a json containing a message for notify No token provided', (done) => {
			request(app)
				.post('/api/course/add-students/60ba98dbe280073b40dad089')
				.send({
					students: [
						{
							_id: "60c279584b657423a4fc1ea1"
						},
						{
							_id: "60c2791b4b657423a4fc1ea0"
						},
						{
							_id: "60c279074b657423a4fc1e9f"
						},
						{
							_id: "60c278e64b657423a4fc1e9e"
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

		it('Responds with a json containing a message for notify the operation success', (done) => {
			request(app)
				.post('/api/course/add-students/60ba98dbe280073b40dad089')
				.send({
					students: [
						{
							_id: "60c279584b657423a4fc1ea1"
						},
						{
							_id: "60c2791b4b657423a4fc1ea0"
						},
						{
							_id: "60c279074b657423a4fc1e9f"
						},
						{
							_id: "60c278e64b657423a4fc1e9e"
						}
					]
				})
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(201)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'Estudiantes añadidos al curso satisfactoriamente');
				})
				.end((err, res) => {
					if (err) return done(err);
					done();
				});
		});
	})
});

