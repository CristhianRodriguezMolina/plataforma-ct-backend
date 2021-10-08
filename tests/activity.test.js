import request from 'supertest';

import app from '../src/app';

import fs from 'fs';

import path from 'path';

import assert from "assert";

var activityID = null;
var userToken = null;
var personID = null
var activityMazeID = null;
var activityQuestionnaireID = null;

/**
 * Testing activity endpoints
 */
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

	before((done) => {
		let personIDPath = path.join(__dirname, './static_test/personID.txt');
		try {
			personID = fs.readFileSync(personIDPath, 'utf8');
			console.log('Person ID defined');
			done();
		} catch (err) {
			console.log('Person ID not found');
			done(err);
		}
	});
	describe('Create an activity', () => {

		it('Responds with a json containing a message for notify not token provided', done => {
			request(app)
				.post('/api/activity')
				.send({
					name: "My first activity",
					description: "Introduction to the logic activities, this activity is only for test the students basic knowledges",
					type: "logic_sequence",
					creator: `${personID}`
				})
				.expect(403)
				.expect((res) => {
					assert.strictEqual(res.body.message, 'No token provided');
				})
				.end((err, res) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify the operation success', done => {
			request(app)
				.post('/api/activity')
				.send({
					name: "My first activity",
					description: "Introduction to the logic activities, this activity is only for test the students basic knowledges",
					type: "logic_sequence",
					creator: `${personID}`
				})
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(201)
				.expect((res) => {
					assert.strictEqual(res.body.message, "The activity has been created satisfactorily");
				})
				.end((err, res) => {
					if (err) return done(err);
					let filePath = path.join(__dirname, './static_test/activityID.txt');
					fs.writeFile(filePath, res.body.activity_id, (err) => {
						if (err) console.error(err);
					});
					done();
				});
		});

		it('Responds with a json containing a message for notify fields missing', done => {
			request(app)
				.post('/api/activity')
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Field(s) required!");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify type not accepted', done => {
			request(app)
				.post('/api/activity')
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.send({
					name: "My first activity",
					description: "Introduction to the logic activities, this activity is only for test the students basic knowledges",
					type: "activity",
					creator: `${personID}`
				})
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Invalid type");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify name field is empty', done => {
			request(app)
				.post('/api/activity')
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.send({
					name: "   ",
					description: "Introduction to the logic activities, this activity is only for test the students basic knowledges",
					type: "logic_sequence",
					creator: `${personID}`
				})
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Field(s) required!");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});
	});

	describe('Creating an activity with type maze', () => {
		it('Responds with a json containing a message for notify the operation success', done => {
			request(app)
				.post('/api/activity')
				.send({
					name: "My first activity",
					description: "Introduction to the logic activities, this activity is only for test the students basic knowledges",
					type: "maze",
					creator: `${personID}`
				})
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(201)
				.expect((res) => {
					assert.strictEqual(res.body.message, "The activity has been created satisfactorily");
				})
				.end((err, res) => {
					if (err) return done(err);
					let filePath = path.join(__dirname, './static_test/activityMazeID.txt');
					fs.writeFile(filePath, res.body.activity_id, (err) => {
						if (err) console.error(err);
					});
					done();
				});
		});
	});

	describe('Creating an activity with type maze', () => {
		it('Responds with a json containing a message for notify the operation success', done => {
			request(app)
				.post('/api/activity')
				.send({
					name: "My first questionnaire activity",
					description: "Introduction to the logic activities, this activity is only for test the students basic knowledges",
					type: "questionnaire",
					creator: `${personID}`
				})
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(201)
				.expect((res) => {
					assert.strictEqual(res.body.message, "The activity has been created satisfactorily");
				})
				.end((err, res) => {
					if (err) return done(err);
					let filePath = path.join(__dirname, './static_test/activityQuestionnaireID.txt');
					fs.writeFile(filePath, res.body.activity_id, (err) => {
						if (err) console.error(err);
					});
					done();
				});
		});
	});

	// RUNNING LOGIC SEQUENCE TESTS -----------------------------------------------------------------------------------------------------------------------------------------
	describe('Running logic sequence tests', () => {
		require('./logic-sequence.test');
	});

	// RUNNING MAZE TESTS -----------------------------------------------------------------------------------------------------------------------------------------
	describe('Running logic sequence tests', () => {
		require('./maze.test');
	});

	// RUNNING QUESTIONNAIRE TESTS -----------------------------------------------------------------------------------------------------------------------------------------
	describe('Running questionnaire tests', () => {
		require('./questionnaire.test');
	});

	// UPDATE AN ACTIVITY -----------------------------------------------------------------------------------------------------------------------------------------
	describe('Update an activity', () => {
		before((done) => {
			let activityIDPath = path.join(__dirname, './static_test/activityID.txt');
			try {
				activityID = fs.readFileSync(activityIDPath, 'utf8');
				console.log('Activity ID defined');
				done();
			} catch (err) {
				console.log('Activity ID not found');
				done(err);
			}
		});

		it('Responds with a json containing a message for notify no token provided', done => {
			request(app)
				.put(`/api/activity/${activityID}`)
				.set('Accept', 'application/json')
				.send({
					activity: {
						name: "My first activity",
						description: "Only for new students. Introduction to the logic activities, this activity is only for test the students basic knowledges"
					},
					child: {
						sequence_cards: [
							{
								name: "First",
								image: "image.jpg"
							},
							{
								name: "Second",
								image: "image.jpg"
							},
							{
								name: "Third",
								image: "image.jpg"
							},
							{
								name: "Fourth",
								image: "image.jpg"
							}
						]
					}
				})
				.expect(403)
				.expect((res) => {
					assert.strictEqual(res.body.message, "No token provided");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify the operation success', done => {
			request(app)
				.put(`/api/activity/${activityID}`)
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.send({
					activity: {
						name: "My first activity",
						description: "Only for new students. Introduction to the logic activities, this activity is only for test the students basic knowledges"
					},
					child: {
						sequence_cards: [
							{
								name: "First",
								image: "image.jpg"
							},
							{
								name: "Second",
								image: "image.jpg"
							},
							{
								name: "Third",
								image: "image.jpg"
							},
							{
								name: "Fourth",
								image: "image.jpg"
							}
						]
					}
				})
				.expect(201)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Actividad actualizada");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify the name field is empty', done => {
			request(app)
				.put(`/api/activity/${activityID}`)
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.send({
					activity: {
						name: "   ",
						description: "Only for new students. Introduction to the logic activities, this activity is only for test the students basic knowledges"
					},
					child: {
						sequence_cards: [
							{
								name: "First",
								image: "image.jpg"
							},
							{
								name: "Second",
								image: "image.jpg"
							},
							{
								name: "Third",
								image: "image.jpg"
							},
							{
								name: "Fourth",
								image: "image.jpg"
							}
						]
					}
				})
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Field(s) required!");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify the name field is missing', done => {
			request(app)
				.put(`/api/activity/${activityID}`)
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.send({
					activity: {
						description: "Only for new students. Introduction to the logic activities, this activity is only for test the students basic knowledges"
					},
					child: {
						sequence_cards: [
							{
								name: "First",
								image: "image.jpg"
							},
							{
								name: "Second",
								image: "image.jpg"
							},
							{
								name: "Third",
								image: "image.jpg"
							},
							{
								name: "Fourth",
								image: "image.jpg"
							}
						]
					}
				})
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Field(s) required!");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify the activity Id is invalid', done => {
			request(app)
				.put('/api/activity/genericID')
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.send({
					activity: {
						name: "My first activity",
						description: "Only for new students. Introduction to the logic activities, this activity is only for test the students basic knowledges"
					},
					child: {
						sequence_cards: [
							{
								name: "First",
								image: "image.jpg"
							},
							{
								name: "Second",
								image: "image.jpg"
							},
							{
								name: "Third",
								image: "image.jpg"
							},
							{
								name: "Fourth",
								image: "image.jpg"
							}
						]
					}
				})
				.expect(500)
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify the activity has been not found', done => {
			request(app)
				.put('/api/activity/666666666666666666666666')
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.send({
					activity: {
						name: "My first activity",
						description: "Only for new students. Introduction to the logic activities, this activity is only for test the students basic knowledges"
					},
					child: {
						sequence_cards: [
							{
								name: "First",
								image: "image.jpg"
							},
							{
								name: "Second",
								image: "image.jpg"
							},
							{
								name: "Third",
								image: "image.jpg"
							},
							{
								name: "Fourth",
								image: "image.jpg"
							}
						]
					}
				})
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Activity not found");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});
	});

	describe('Update an activity', () => {
		before((done) => {
			let activityQuestionnaireIDPath = path.join(__dirname, './static_test/activityQuestionnaireID.txt');
			try {
				activityQuestionnaireID = fs.readFileSync(activityQuestionnaireIDPath, 'utf8');
				console.log('Activity ID of the questionnaire defined');
				done();
			} catch (err) {
				console.log('Activity ID of the questionnaire not found');
				done(err);
			}
		});

		it('Responds with a json containing a message for notify no token provided', done => {
			request(app)
				.put(`/api/activity/${activityID}`)
				.set('Accept', 'application/json')
				.send({
					activity: {
						name: "My first questionnaire activity",
						description: "Only for new students. Introduction to the logic activities, this activity is only for test the students basic knowledges"
					},
					child: {
						questions: [
							{
								question: "First",
								image: "image.jpg",
								options: [
									{
										option: 'First',
										image: "image.jpg",
									},
									{
										option: 'First',
										image: "image.jpg",
									}
								]
							},
							{
								question: "Second",
								image: "image.jpg",
								options: [
									{
										option: 'First',
										image: "image.jpg",
									},
									{
										option: 'First',
										image: "image.jpg",
									}
								]
							},
						]
					}
				})
				.expect(403)
				.expect((res) => {
					assert.strictEqual(res.body.message, "No token provided");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for the operation success', done => {
			request(app)
				.put(`/api/activity/${activityQuestionnaireID}`)
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.send({
					activity: {
						name: "My first questionnaire activity",
						description: "Only for new students. Introduction to the logic activities, this activity is only for test the students basic knowledges"
					},
					child: {
						questions: [
							{
								question: "First",
								image: "image.jpg",
								options: [
									{
										option: 'First',
										image: "image.jpg",
									},
									{
										option: 'First',
										image: "image.jpg",
									}
								]
							},
							{
								question: "Second",
								image: "image.jpg",
								options: [
									{
										option: 'First',
										image: "image.jpg",
									},
									{
										option: 'First',
										image: "image.jpg",
									}
								]
							},
						]
					}
				})
				.expect(201)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Actividad actualizada");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for fields missing', done => {
			request(app)
				.put(`/api/activity/${activityQuestionnaireID}`)
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.send({
					activity: {
						name: "My first questionnaire activity",
						description: "Only for new students. Introduction to the logic activities, this activity is only for test the students basic knowledges"
					},
					child: {
						questions: [
							{
								question: "   ",
								image: "image.jpg",
								options: [
									{
										option: 'First',
										image: "image.jpg",
									},
									{
										option: 'First',
										image: "image.jpg",
									}
								]
							},
							{
								question: "Second",
								image: "image.jpg",
								options: [
									{
										option: '   ',
										image: "image.jpg",
									},
									{
										option: 'First',
										image: "image.jpg",
									}
								]
							},
						]
					}
				})
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Ninguna pregunta puede estar vacia");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for fields missing', done => {
			request(app)
				.put(`/api/activity/${activityQuestionnaireID}`)
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.send({
					activity: {
						name: "My first questionnaire activity",
						description: "Only for new students. Introduction to the logic activities, this activity is only for test the students basic knowledges"
					},
					child: {
						questions: [
							{
								question: "First",
								image: "image.jpg",
								options: [
									{
										option: 'First',
										image: "image.jpg",
									},
									{
										option: 'First',
										image: "image.jpg",
									}
								]
							},
							{
								question: "Second",
								image: "image.jpg",
								options: [
									{
										option: '    ',
										image: "image.jpg",
									},
									{
										option: 'First',
										image: "image.jpg",
									}
								]
							},
						]
					}
				})
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Ninguna pregunta puede tener opciones vacias");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});
	});

	describe('Updating an activity with maze type', () => {
		before((done) => {
			let activityMazeIDPath = path.join(__dirname, './static_test/activityMazeID.txt');
			try {
				activityMazeID = fs.readFileSync(activityMazeIDPath, 'utf8');
				console.log('Activity ID of the maze defined');
				done();
			} catch (err) {
				console.log('Activity ID of the maze not found');
				done(err);
			}
		});
		it('Responds with a json containing a message for notify the operation success', done => {
			request(app)
				.put(`/api/activity/${activityMazeID}`)
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.send({
					activity: {
						name: "My first activity",
						description: "Only for new students. Introduction to the logic activities, this activity is only for test the students basic knowledges"
					},
					child: [{
						cells: [
							{ i: 0, j: 0, type: 'EMPTY' },
							{ i: 0, j: 1, type: 'EMPTY' },
							{ i: 0, j: 2, type: 'EMPTY' },
							{ i: 0, j: 3, type: 'EMPTY' },
							{ i: 0, j: 4, type: 'EMPTY' },
							{ i: 1, j: 0, type: 'EMPTY' },
							{ i: 1, j: 1, type: 'EMPTY' },
							{ i: 1, j: 2, type: 'EMPTY' },
							{ i: 1, j: 3, type: 'EMPTY' },
							{ i: 1, j: 4, type: 'EMPTY' },
							{ i: 2, j: 0, type: 'EMPTY' },
							{ i: 2, j: 1, type: 'BLOCK' },
							{ i: 2, j: 2, type: 'BLOCK' },
							{ i: 2, j: 3, type: 'EMPTY' },
							{ i: 2, j: 4, type: 'EMPTY' },
							{ i: 3, j: 0, type: 'EMPTY' },
							{ i: 3, j: 1, type: 'EMPTY' },
							{ i: 3, j: 2, type: 'EMPTY' },
							{ i: 3, j: 3, type: 'END' },
							{ i: 3, j: 4, type: 'BLOCK' },
							{ i: 4, j: 0, type: 'BLOCK' },
							{ i: 4, j: 1, type: 'START' },
							{ i: 4, j: 2, type: 'EMPTY' },
							{ i: 4, j: 3, type: 'EMPTY' },
							{ i: 4, j: 4, type: 'EMPTY' }
						],
						instructions: [
							{ type: 'LEFT', num: '3' },
							{ type: 'FORWARD', num: '0' },
							{ type: 'FORWARD', num: '4' },
							{ type: 'RIGHT', num: '14' },
							{ type: 'FORWARD', num: '5' },
							{ type: 'RIGHT', num: '2' },
							{ type: 'FORWARD', num: '7' },
							{ type: 'FORWARD', num: '8' },
							{ type: 'FORWARD', num: '6' },
							{ type: 'RIGHT', num: '1' },
							{ type: 'FORWARD', num: '9' },
							{ type: 'FORWARD', num: '11' },
							{ type: 'FORWARD', num: '10' },
							{ type: 'FORWARD', num: '12' },
							{ type: 'FORWARD', num: '13' },
							{ type: 'LEFT', num: '15' }
						],
						columns: "5",
						rows: "5",
					}
					]
				})
				.expect(201)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Actividad actualizada");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});
	});

	// LIST ACTIVITIES -----------------------------------------------------------------------------------------------------------------------------------------
	describe('List activities', () => {

		it('Responds with a json containing a message for notify no token provided', done => {
			request(app)
				.get(`/api/activity`)
				.set('Accept', 'application/json')
				.expect(403)
				.expect((res) => {
					assert.strictEqual(res.body.message, "No token provided");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify the operation success', done => {
			request(app)
				.get(`/api/activity`)
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(200)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Activities list request has been completed satisfactorily");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

	});


	// DELETE AN ACTIVITY -----------------------------------------------------------------------------------------------------------------------------------------
	describe('Delete an activity', () => {

		it('Respond with a json containing a message for notify no token provided', done => {
			request(app)
				.delete(`/api/activity/${activityID}`)
				.set('Accept', 'application/json')
				.expect(403)
				.expect((res) => {
					assert.strictEqual(res.body.message, "No token provided");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the operation success', done => {
			request(app)
				.delete(`/api/activity/${activityID}`)
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(200)
				.expect((res) => {
					assert.strictEqual(res.body.message, "La actividad ha sido borrada satisfactoriamente");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the activity has been not found', done => {
			request(app)
				.delete('/api/activity/666666666666666666666666')
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Activity not found");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the activity Id is invalid', done => {
			request(app)
				.delete('/api/activity/genericID')
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(500)
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});
	});

	describe('Deleting an activity with maze type', () => {

		it('Respond with a json containing a message for notify the operation success', done => {
			request(app)
				.delete(`/api/activity/${activityMazeID}`)
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(200)
				.expect((res) => {
					assert.strictEqual(res.body.message, "La actividad ha sido borrada satisfactoriamente");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});
	});

	describe('Deleting an activity with questionnaire type', () => {

		it('Respond with a json containing a message for notify the operation success', done => {
			request(app)
				.delete(`/api/activity/${activityQuestionnaireID}`)
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(200)
				.expect((res) => {
					assert.strictEqual(res.body.message, "La actividad ha sido borrada satisfactoriamente");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});
	});
});
