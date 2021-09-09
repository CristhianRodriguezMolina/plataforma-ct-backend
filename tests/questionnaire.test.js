import request from 'supertest';

import app from '../src/app';

import fs from 'fs';

import path from 'path';

import assert from "assert";

var activityQuestionnaireID = null;
var questionnaireID = null;
var questionID = null;
var userToken = null;

describe('REQUEST /api/questionnaire', () => {

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

	describe('Get questionnaire by activity ID', () => {

		it('Respond with a json containing a mesage for notify no token provided', done => {
			request(app)
				.get(`/api/questionnaire/${activityQuestionnaireID}`)
				.expect(403)
				.expect((res) => {
					assert.strictEqual(res.body.message, "No token provided");
				})
				.end((err, res) => {
					done();
				});
		});

		it('Respond with a json containing the associate questionnaire', done => {
			request(app)
				.get(`/api/questionnaire/${activityQuestionnaireID}`)
				.set('x-access-token', userToken)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					let filePath = path.join(__dirname, './static_test/questionnaireID.txt');
					fs.writeFile(filePath, res.body._id, (err) => {
						if (err) console.error(err);
					});
					done();
				});
		});

		it('Responds with a json containing a message for notify maze not found', done => {
			request(app)
				.get(`/api/questionnaire/666666666666666666666666`)
				.set('x-access-token', userToken)
				.expect(400)
				.expect(res => {
					assert.strictEqual(res.body.message, "Cuestionario no encontrado");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});
	});

	//CREATE A QUESTION ==================================================================================================================================================
	describe('Create a question', () => {
		before((done) => {
			let questionnaireIDPath = path.join(__dirname, './static_test/questionnaireID.txt');
			try {
				questionnaireID = fs.readFileSync(questionnaireIDPath, 'utf8');
				console.log('Questionnaire ID defined');
				done();
			} catch (err) {
				console.log('Questionnaire ID not found');
				done(err);
			}
		});

		it('Respond with a json containing a message for notify No token provided', done => {
			request(app)
				.post(`/api/questionnaire/question/${questionnaireID}`)
				.set('Accept', 'application/json')
				.expect(403)
				.expect((res) => {
					assert.strictEqual(res.body.message, "No token provided");
				})
				.end((err, res) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the operation success', done => {
			request(app)
				.post(`/api/questionnaire/question/${questionnaireID}`)
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(201)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Pregunta del cuestionario actualizado satisfactoriamente");
				})
				.end((err, res) => {
					if (err) return done(err);
					let filePath = path.join(__dirname, './static_test/questionID.txt');
					fs.writeFile(filePath, res.body.updatedQuestionnaire.questions[0]._id, (err) => {
						if (err) console.error(err);
					});
					done();
				});
		});

		it('Respond with a json containing a message for notify the logic sequence Id is invalid', done => {
			request(app)
				.post('/api/questionnaire/question/genericID')
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(500)
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the logic sequence has been not found', done => {
			request(app)
				.post('/api/questionnaire/question/666666666666666666666666')
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Cuestionario no encontrado o inexistente");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});
	});

	//UPDATE A QUESTION ==================================================================================================================================================
	describe('Update a question', () => {
		before((done) => {
			let questionIDPath = path.join(__dirname, './static_test/questionID.txt');
			try {
				questionID = fs.readFileSync(questionIDPath, 'utf8');
				console.log('Question ID defined');
				done();
			} catch (err) {
				console.log('Question ID not found');
				done(err);
			}
		});

		it('Respond with a json containing a message for No token provided', done => {
			request(app)
				.put(`/api/questionnaire/question/${questionnaireID}/${questionID}`)
				.send({
					question: "This a updated question",
				})
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

		it('Respond with a json containing a message for notify fields missing', done => {
			request(app)
				.put(`/api/questionnaire/question/${questionnaireID}/${questionID}`)
				.set('x-access-token', userToken)
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Campos requeridos!");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify fields missing', done => {
			request(app)
				.put(`/api/questionnaire/question/${questionnaireID}/${questionID}`)
				.send({
					question: "    ",
				})
				.set('x-access-token', userToken)
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "No pueden haber preguntas vacias!");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify fields missing', done => {
			request(app)
				.put(`/api/questionnaire/question/${questionnaireID}/${questionID}`)
				.send({
					question: "This a updated question",
					options: [{
						option: '    '
					}]
				})
				.set('x-access-token', userToken)
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "La pregunta no puede tener opciones vacias");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the questionnaire Id is invalid', done => {
			request(app)
				.put(`/api/questionnaire/question/genericID/${questionID}`)
				.send({
					question: "This a updated question",
				})
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(500)
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the question Id is invalid', done => {
			request(app)
				.put(`/api/questionnaire/question/${questionnaireID}/genericSCID`)
				.send({
					question: "This a updated question",
				})
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(404)
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the questionnaire Id and question Id are invalid', done => {
			request(app)
				.put('/api/questionnaire/question/genericLSID/genericSCID')
				.send({
					question: "This a updated question",
				})
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(500)
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the questionnaire has been not found', done => {
			request(app)
				.put(`/api/questionnaire/question/666666666666666666666666/${questionID}`)
				.send({
					question: "This a updated question",
				})
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Cuestionario no encontrado o inexistente");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the question has been not found', done => {
			request(app)
				.put(`/api/questionnaire/question/${questionnaireID}/666666666666666666666666`)
				.send({
					question: "This a updated question",
				})
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(404)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Pregunta no encontrada o inexistente");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the operation success', done => {
			request(app)
				.put(`/api/questionnaire/question/${questionnaireID}/${questionID}`)
				.send({
					question: "This a updated question",
					options: [{
						option: 'This a updated option'
					}]
				})
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(201)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Pregunta del cuestionario actualizada satisfactoriamente");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});
	});

	//DELETE A QUESTION ==================================================================================================================================================
	describe('Delete a question', () => {

		it('Respond with a json containing a message for notify No token provided', done => {
			request(app)
				.delete(`/api/questionnaire/question/${questionnaireID}/${questionID}`)
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
				.delete(`/api/questionnaire/question/${questionnaireID}/${questionID}`)
				.set('x-access-token', userToken)
				.expect(201)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Pregunta del cuestionario eliminada satisfactoriamente");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the questionnaire Id is invalid', done => {
			request(app)
				.delete(`/api/questionnaire/question/genericID/${questionID}`)
				.set('x-access-token', userToken)
				.expect(500)
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the question Id is invalid', done => {
			request(app)
				.delete(`/api/questionnaire/question/${questionnaireID}/genericSCID`)
				.set('x-access-token', userToken)
				.expect(404)
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the questionnaire Id and question Id are invalid', done => {
			request(app)
				.delete('/api/questionnaire/question/genericLSID/genericSCID')
				.set('x-access-token', userToken)
				.expect(500)
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the questionnaire has been not found', done => {
			request(app)
				.delete(`/api/questionnaire/question/666666666666666666666666/${questionID}`)
				.set('x-access-token', userToken)
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Cuestionario no encontrado o inexistente");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the question has been not found', done => {
			request(app)
				.delete(`/api/questionnaire/question/${questionnaireID}/666666666666666666666666`)
				.set('x-access-token', userToken)
				.expect(404)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Pregunta no encontrada o inexistente");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});
	});

});