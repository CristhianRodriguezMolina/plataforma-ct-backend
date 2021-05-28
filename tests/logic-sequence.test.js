import request from 'supertest';

import app from '../src/app';

import fs from 'fs';

import path from 'path';

import assert from "assert";

var activityID = null;
var logicSequenceID = null;
var sequenceCardID = null;

describe('REQUEST /api/logic-sequence', () => {

    before((done) => {
        let activityIDPath = path.join(__dirname, 'activityID.txt');
        try {
            activityID = fs.readFileSync(activityIDPath, 'utf8');
            console.log('Activity ID defined');
            done();
        } catch (err) {
            console.log('Activity ID not found');
            done(err);
        }
    });

    describe('Get logic sequence by activity ID', () => {
        it('Respond with a json containing the associate logic sequence', done => {
            request(app)
                .get(`/api/logic-sequence/${activityID}`)
                .expect(200)
                .end((err, res) => {
                    if(err) return done(err);
                    let filePath = path.join(__dirname, 'logicSequenceID.txt');
                    fs.writeFile(filePath, res.body._id, (err) => {
                        if (err) console.error(err);
                    });
                    done();
                });
        });
    });
    
    describe('Create a sequence card', () => {
        before((done) => {
            let logicSequenceIDPath = path.join(__dirname, 'logicSequenceID.txt');
            try {
                logicSequenceID = fs.readFileSync(logicSequenceIDPath, 'utf8');
                console.log('Logic sequence ID defined');
                done();
            } catch (err) {
                console.log('Logic sequence ID not found');
                done(err);
            }
        });
        
        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .post(`/api/logic-sequence/sequence-card/${logicSequenceID}`)
                .send({
                    name: "Fourth",
                    image: "image.jpg"
                })
                .set('Accept', 'application/json')
                .expect(201)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "The new Sequence card has been created satisfatorily");
                })
                .end((err, res) => {
                    if(err) return done(err);
                    let filePath = path.join(__dirname, 'sequenceCardID.txt');
                    fs.writeFile(filePath, res.body.updatedLogicSequence.sequence_cards[0]._id, (err) => {
                        if (err) console.error(err);
                    });
                    done();
                });
        });

        it('Respond with a json containing a message for notify fields missing', done => {
            request(app)
                .post(`/api/logic-sequence/sequence-card/${logicSequenceID}`)
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Field(s) required!");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify name field is empty', done => {
            request(app)
                .post(`/api/logic-sequence/sequence-card/${logicSequenceID}`)
                .send({
                    name: "   ",
                    image: "image.jpg"
                })
                .set('Accept', 'application/json')
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Field(s) required!");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the logic sequence Id is invalid', done => {
            request(app)
                .post('/api/logic-sequence/sequence-card/genericID')
                .send({
                    name: "Fourth",
                    image: "image.jpg"
                })
                .set('Accept', 'application/json')
                .expect(500)
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the logic sequence has been not found', done => {
            request(app)
                .post('/api/logic-sequence/sequence-card/666666666666666666666666')
                .send({
                    name: "Fourth",
                    image: "image.jpg"
                })
                .set('Accept', 'application/json')
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Logic sequence not found");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });
    });

    describe('Update a sequence card', () => {
        before((done) => {
            let sequenceCardIDPath = path.join(__dirname, 'sequenceCardID.txt');
            try {
                sequenceCardID = fs.readFileSync(sequenceCardIDPath, 'utf8');
                console.log('Sequence card ID defined');
                done();
            } catch (err) {
                console.log('Sequence card ID not found');
                done(err);
            }
        });

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .put(`/api/logic-sequence/sequence-card/${logicSequenceID}/${sequenceCardID}`)
                .send({
                    name: "My Third Sequence Card",
                    image: "image.jpg"
                })
                .set('Accept', 'application/json')
                .expect(201)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "The Sequence card has been updated satisfatorily");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify fields missing', done => {
            request(app)
                .put(`/api/logic-sequence/sequence-card/${logicSequenceID}/${sequenceCardID}`)
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Field(s) required!");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify name field is empty', done => {
            request(app)
                .put(`/api/logic-sequence/sequence-card/${logicSequenceID}/${sequenceCardID}`)
                .send({
                    name: "    ",
                    image: "image.jpg"
                })
                .set('Accept', 'application/json')
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Field(s) required!");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the logic sequence Id is invalid', done => {
            request(app)
                .put(`/api/logic-sequence/sequence-card/genericID/${sequenceCardID}`)
                .send({
                    name: "My Third Sequence Card",
                    image: "image.jpg"
                })
                .set('Accept', 'application/json')
                .expect(500)
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the sequence card Id is invalid', done => {
            request(app)
                .put(`/api/logic-sequence/sequence-card/${logicSequenceID}/genericID`)
                .send({
                    name: "My Third Sequence Card",
                    image: "image.jpg"
                })
                .set('Accept', 'application/json')
                .expect(500)
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the logic sequence Id and sequence card Id are invalid', done => {
            request(app)
                .put('/api/logic-sequence/sequence-card/genericLSID/genericSCID')
                .send({
                    name: "My Third Sequence Card",
                    image: "image.jpg"
                })
                .set('Accept', 'application/json')
                .expect(500)
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the logic sequence has been not found', done => {
            request(app)
                .put(`/api/logic-sequence/sequence-card/666666666666666666666666/${sequenceCardID}`)
                .send({
                    name: "My Third Sequence Card",
                    image: "image.jpg"
                })
                .set('Accept', 'application/json')
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "The logic sequence or the sequence card not found");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the sequence card has been not found', done => {
            request(app)
                .put(`/api/logic-sequence/sequence-card/${logicSequenceID}/666666666666666666666666`)
                .send({
                    name: "My Third Sequence Card",
                    image: "image.jpg"
                })
                .set('Accept', 'application/json')
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message,"The logic sequence or the sequence card not found");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the logic sequence or the sequence card have been not found', done => {
            request(app)
                .put('/api/logic-sequence/sequence-card/666666666666666666666666/666666666666666666666666')
                .send({
                    name: "My Third Sequence Card",
                    image: "image.jpg"
                })
                .set('Accept', 'application/json')
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message,"The logic sequence or the sequence card not found");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });
    });

    describe('list logic sequences', () => {

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .get('/api/logic-sequence')
                .send({
                    name: "My Third Sequence Card",
                    image: "image.jpg"
                })
                .set('Accept', 'application/json')
                .expect(200)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Logic sequences list request has been completed satisfactorily");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });
    });

    describe('Delete a sequence card', () => {

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .delete(`/api/logic-sequence/sequence-card/${logicSequenceID}/${sequenceCardID}`)
                .expect(201)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "The Sequence card has been deleted satisfatorily");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the logic sequence Id is invalid', done => {
            request(app)
                .delete(`/api/logic-sequence/sequence-card/genericID/${sequenceCardID}`)
                .expect(500)
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the sequence card Id is invalid', done => {
            request(app)
                .delete(`/api/logic-sequence/sequence-card/${logicSequenceID}/genericID`)
                .expect(500)
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the logic sequence Id and sequence card Id are invalid', done => {
            request(app)
                .delete('/api/logic-sequence/sequence-card/genericLSID/genericSCID')
                .expect(500)
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the sequence card Id is invalid', done => {
            request(app)
                .delete(`/api/logic-sequence/sequence-card/${logicSequenceID}/genericID`)
                .expect(500)
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the logic sequence has been not found', done => {
            request(app)
                .delete(`/api/logic-sequence/sequence-card/666666666666666666666666/${sequenceCardID}`)
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "The logic sequence or the sequence card not found");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });
    });
});
