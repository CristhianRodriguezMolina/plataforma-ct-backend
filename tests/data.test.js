import request from 'supertest';

import app from '../src/app';

import fs from 'fs';

import path from 'path';

import assert from "assert";

var logicSequenceID = null;
var sequenceCardID = null;
var imageName = null;
var userToken = null;

describe('REQUEST /api/data', () => {

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

	describe('Uploading Sequence card image', () => {


		before((done) => {
			let logicSequenceIDPath = path.join(__dirname, './static_test/logicSequenceID.txt');
			let sequenceCardIDPath = path.join(__dirname, './static_test/sequenceCardID.txt');
			try {
				logicSequenceID = fs.readFileSync(logicSequenceIDPath, 'utf8');
				console.log('Logic sequence ID defined');
				sequenceCardID = fs.readFileSync(sequenceCardIDPath, 'utf8');
				console.log('Sequence card ID defined');
				done();
			} catch (err) {
				console.log('Logic sequence ID or sequenceCard ID not found');
				done(err);
			}
		});

		it('Respond with a json containing a message for notify No token provided', (done) => {
			request(app)
				.post(`/api/data/upload-img/${logicSequenceID}/${sequenceCardID}`)
				.set('Content-Type', 'multipart/form-data')
				.set('Accept', 'application/json')
				.set('Connection', 'keep-alive')
				.attach('image', path.join(__dirname, './static_test/image.png'))
				.field('name', "My activity with an image")
				.expect(403)
				.expect(res => {
					assert.strictEqual(res.body.message, "No token provided");
				})
				.end(function (err, res) {
					if (err) return done(err);
					done();
				});
		});

		it('Responds with a json containing the logic sequence when the selected sequence card has changed its image', (done) => {
			request(app)
				.post(`/api/data/upload-img/${logicSequenceID}/${sequenceCardID}`)
				.set('Content-Type', 'multipart/form-data')
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.field('name', "My activity with an image")
				.field('folder', 'i')
				.attach('image', path.join(__dirname, './static_test/image.png'))
				.expect(201)
				.end(function (err, res) {
					if (err) return done(err);
					let length = res.body.updatedLogicSequence.sequence_cards.length;
					let found = false;
					let sequenceCard;
					for (let i = 0; i < length && !found; i++) {
						let tempSequenceCard = res.body.updatedLogicSequence.sequence_cards[i];
						if (tempSequenceCard._id.localeCompare(sequenceCardID) === 0) {
							found = true;
							sequenceCard = tempSequenceCard;
						}
					}
					imageName = sequenceCard.image;
					done();
				});
		});

		it('Respond with a json containing a message for notify file type not valid', (done) => {
			request(app)
				.post(`/api/data/upload-img/${logicSequenceID}/${sequenceCardID}`)
				.set('Content-Type', 'multipart/form-data')
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.field('name', "My activity with an image")
				.attach('image', path.join(__dirname, './static_test/document.pdf'))
				.expect(400)
				.expect(res => {
					assert.strictEqual(res.body.message, "The image couldn't be uploaded, make sure you are uploading an image file or check your internet connection");
				})
				.end(function (err, res) {
					if (err) return done(err);
					done();
				});
		});
	});

	describe('Image visualization', () => {
		it('Responds with a visualization of the image from the server', (done) => {
			request(app)
				.get(`/i/${imageName}`)
				.expect(200)
				.end(function (err, res) {
					if (err) return done(err);
					done();
				});
		});
	});



	after((done) => {
		let filePath = path.join(__dirname, `../static_content/i/${imageName}`);
		if (fs.existsSync(filePath)) {
			fs.unlink(filePath, (err) => {
				if (err) return console.log(err);
				console.log(`file deleted successfully: ${filePath}`);
			});
		}
		done();
	});
});
