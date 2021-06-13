import request from 'supertest';

import app from '../src/app';

import fs from 'fs';

import path from 'path';

import assert from "assert";

var activityID = null;
var userToken = null;
var personID = null


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

	// RUNNING LOGIC SEQUENCE TESTS -----------------------------------------------------------------------------------------------------------------------------------------
	describe('Running logic sequence tests', () => {
		require('./logic-sequence.test');
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
					assert.strictEqual(res.body.message, "The activity has been updated satisfactorily");
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
					assert.strictEqual(res.body.message, "The activity has been deleted satisfactorily");
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
});