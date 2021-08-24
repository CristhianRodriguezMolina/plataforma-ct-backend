import request from 'supertest';

import app from '../src/app';

import fs from 'fs';

import path from 'path';

import assert from "assert";

var activityMazeID = null;
var userToken = null;

describe('REQUEST /api/maze', () => {

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

	describe('Get maze by activity ID', () => {

		it('Respond with a json containing a mesage for notify no token provided', done => {
			request(app)
				.get(`/api/maze/${activityMazeID}`)
				.expect(403)
				.expect((res) => {
					assert.strictEqual(res.body.message, "No token provided");
				})
				.end((err, res) => {
					done();
				});
		});

		it('Respond with a json containing the associate maze', done => {
			request(app)
				.get(`/api/maze/${activityMazeID}`)
				.set('x-access-token', userToken)
				.expect(200)
				.end(err => {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing a message for notify maze not found', done => {
			request(app)
				.get(`/api/maze/666666666666666666666666`)
				.set('x-access-token', userToken)
				.expect(400)
				.expect(res => {
					assert.strictEqual(res.body.message, "Laberinto no encontrado");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});
	});

	//RESIZE THE  MAZE ==================================================================================================================================================
	describe('Resizing the maze', () => {

		it('Respond with a json containing a message for notify No token provided', done => {
			request(app)
				.put(`/api/maze/resize/${activityMazeID}`)
				.send({
					columns: "2",
					rows: "2",
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
						]
				})
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

		it('Respond with a json containing a message for notify the columns or rows number must be greater than zero', done => {
			request(app)
				.put(`/api/maze/resize/${activityMazeID}`)
				.send({
					columns: "0",
					rows: "0",
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
						]
				})
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "El número de columnas o filas debe de ser mayor a cero");
				})
				.end(err => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the operation success returning a resized maze 2x2', done => {
			request(app)
				.put(`/api/maze/resize/${activityMazeID}`)
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.send({
					columns: "2",
					rows: "2",
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
						]
				})
				.expect(201)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Cells updated satisfactorily");
					assert.strictEqual(res.body.maze.cells.length, 4);
				})
				.end(err => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the operation success returning a resized maze 5x5', done => {
			request(app)
				.put(`/api/maze/resize/${activityMazeID}`)
				.send({
					columns: "5",
					rows: "5",
					cells: [
							{ i: 0, j: 0, type: 'EMPTY' },	
							{ i: 0, j: 1, type: 'EMPTY' },
							{ i: 1, j: 0, type: 'EMPTY' },
							{ i: 1, j: 1, type: 'EMPTY' }
						]
				})
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(201)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Cells updated satisfactorily");
					assert.strictEqual(res.body.maze.cells.length, 25);
				})
				.end(err => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify fields missing', done => {
			request(app)
				.put(`/api/maze/resize/${activityMazeID}`)
				.set('x-access-token', userToken)
				.expect(400)
				.expect((res) => {
					assert.strictEqual(res.body.message, "¡Campos requeridos!");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});

		it('Respond with a json containing a message for notify the maze has been not found', done => {
			request(app)
				.put('/api/maze/resize/666666666666666666666666')
				.send({
					columns: "2",
					rows: "2",
					cells: [
							{ i: 0, j: 0, type: 'EMPTY' },	
							{ i: 0, j: 1, type: 'EMPTY' },
							{ i: 0, j: 2, type: 'EMPTY' },
							{ i: 1, j: 0, type: 'EMPTY' },
							{ i: 1, j: 1, type: 'EMPTY' },
							{ i: 1, j: 2, type: 'EMPTY' },
							{ i: 2, j: 0, type: 'EMPTY' },
							{ i: 2, j: 1, type: 'BLOCK' },
							{ i: 2, j: 2, type: 'BLOCK' },
							{ i: 0, j: 3, type: 'EMPTY' },
							{ i: 1, j: 3, type: 'EMPTY' },
							{ i: 2, j: 3, type: 'EMPTY' },
							{ i: 3, j: 0, type: 'END' },
							{ i: 3, j: 1, type: 'BLOCK' },
							{ i: 3, j: 2, type: 'BLOCK' },
							{ i: 3, j: 3, type: 'START' }
						]
				})
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect(404)
				.expect((res) => {
					assert.strictEqual(res.body.message, "Maze not found");
				})
				.end((err) => {
					if (err) return done(err);
					done();
				});
		});
	});
});
