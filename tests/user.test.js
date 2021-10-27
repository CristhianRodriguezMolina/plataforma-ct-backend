import request from 'supertest';

import app from '../src/app';

import fs from 'fs';

import path from 'path';

import assert from "assert";

var personID = null;
var userToken = null;

/**
 * Testing users endpoints
 */
describe('REQUEST /api/person', () => {
	before((done) => {
		let userTokenPath = path.join(__dirname, './static_test/userToken.txt');
		try {
			userToken = fs.readFileSync(userTokenPath, 'utf8');
			console.log('User Token defined');
			done();
		} catch (err) {
			console.log('User Token not found');
			done(err);
		}
	});

	/**
	 * Creating a person
	 */
	describe('Create a person', () => {

		it('Respond with a json containing a message for notify the operation failed', done => {
			request(app)
				.post('/api/person')
				.send({
					id: 111111,                         //
					password: "12345",                   //  PARAMETROS 
					confirm_password: "12345",           //  DE 
					first_name: "Test",                 //  LA PETICION
					last_name: "Test",                  //
					birth_date: Date.now(),                        //
					genre: "NB",                      //
					role: "teacher"
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

		it('Respond with a json containing a message for notify the operation success', done => {
			request(app)
				.post('/api/person')
				.send({
					id: 111111,                         //
					password: "12345",                   //  PARAMETROS 
					confirm_password: "12345",           //  DE 
					first_name: "Test",                 //  LA PETICION
					last_name: "Test",                  //
					birth_date: Date.now(),                        //
					genre: "NB",                      //
					role: "teacher"
				})
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(201)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Usuario creado satisfactoriamente");
				})
				.end((err, res) => {
					if (err) return done(err);
					let filePath = path.join(__dirname, './static_test/personID.txt');
					fs.writeFile(filePath, res.body.savedUser._id, (err) => {
						if (err) console.error(err);
					});
					done();
				});
		});

		it('Respond with a json containing a message for notify fields missing', done => {
			request(app)
				.post('/api/person')
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Por favor, ingrese el nombre");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify type not accepted', done => {
			request(app)
				.post('/api/person')
				.set('Accept', 'application/json')
				.send({
					id: 222222,                         //
					password: "12345",                   //  PARAMETROS 
					confirm_password: "12345",           //  DE 
					first_name: "Test",                 //  LA PETICION
					last_name: "Test",                  //
					birth_date: Date.now(),                        //
					genre: "NB",
					role: "bulldog"
				})
				.set('x-access-token', userToken)
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "El role bulldog no existe");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});
	});

	// RUNNING COURSE TESTS -----------------------------------------------------------------------------------------------------------------------------------------
	//TESTS FOR CREATE, UPDATE AND REMOVE A COURSE
	describe('Running course tests', () => {
		require('./course.test');
	});

	// UPDATE A PERSON -----------------------------------------------------------------------------------------------------------------------------------------

	describe('Update a person', () => {
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

		it('Respond with a json containing a message for notify the operation failed', done => {
			request(app)
				.put(`/api/person/${personID}`)
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
				.put(`/api/person/${personID}`)
				.set('Accept', 'application/json')
				.send({
					first_name: "ChangeFirstNameTest",
					last_name: "ChangeLastNameTest"
				})
				.set('x-access-token', userToken)
				.expect(201)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Usuario actualizado con éxito");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the activity Id is invalid', done => {
			request(app)
				.put('/api/person/genericID')
				.set('Accept', 'application/json')
				.send({
					first_name: "ChangeFirstNameTest",
					last_name: "ChangeLastNameTest"
				})
				.set('x-access-token', userToken)
				.expect(500)
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the activity has been not found', done => {
			request(app)
				.put('/api/person/666666666666666666666666')
				.set('Accept', 'application/json')
				.send({
					first_name: "ChangeFirstNameTest",
					last_name: "ChangeLastNameTest"
				})
				.set('x-access-token', userToken)
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Usuario no entontrado");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});
	});

	describe('List persons (teachers and students)', () => {

		it('Respond with a json containing a message for notify the operation failed', done => {
			request(app)
				.get(`/api/person/role/teacher`)
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
				.get(`/api/person/role/teacher`)
				.set('x-access-token', userToken)
				.expect(200)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Usuarios con role teacher obtenidos satisfactoriamente");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the operation success', done => {
			request(app)
				.get(`/api/person/role/student`)
				.set('x-access-token', userToken)
				.expect(200)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Usuarios con role student obtenidos satisfactoriamente");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the operation success', done => {
			request(app)
				.get(`/api/person/${personID}`)
				.set('x-access-token', userToken)
				.expect(200)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Usuario encontrado satisfactoriamente!");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the operation success', done => {
			request(app)
				.get(`/api/person/666666666666666666666666`)
				.set('x-access-token', userToken)
				.expect(404)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Usuario no encontrado o inexistente!");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the operation success', done => {
			request(app)
				.get(`/api/person/genericID`)
				.set('x-access-token', userToken)
				.expect(500)
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});
	});

	// DELETE A PERSON -----------------------------------------------------------------------------------------------------------------------------------------

	describe('Delete a person', () => {

		it('Respond with a json containing a message for notify the operation failed', done => {
			request(app)
				.delete(`/api/person/${personID}`)
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
				.delete(`/api/person/${personID}`)
				.set('x-access-token', userToken)
				.expect(200)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Usuario borrado con éxito");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the activity has been not found', done => {
			request(app)
				.delete('/api/person/666666666666666666666666')
				.set('x-access-token', userToken)
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Usuario no entontrado");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the activity Id is invalid', done => {
			request(app)
				.delete('/api/person/genericID')
				.set('x-access-token', userToken)
				.expect(500)
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});
	});
});
