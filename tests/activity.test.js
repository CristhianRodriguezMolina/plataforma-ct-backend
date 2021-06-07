import request from 'supertest';

import app from '../src/app';

import fs from 'fs';

import path from 'path';

import assert from "assert"; 

var activityID = null;

/**
 * Testing activity endpoints
 */
describe('REQUEST /api/activity', () => {
    describe('Create an activity', () => {
        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .post('/api/activity')
                .send({
                    name: "My first activity",
                    description: "Introduction to the logic activities, this activity is only for test the students basic knowledges",
                    type: "logic_sequence"
                })
                .set('Accept', 'application/json')
                .expect(201)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "The activity has been created satisfactorily");
                })
                .end((err, res) => {
                    if(err) return done(err);
                    let filePath = path.join(__dirname, './static_test/activityID.txt');
                    fs.writeFile(filePath, res.body.activity_id, (err) => {
                        if (err) console.error(err);
                    });
                    done();
                });
        });

        it('Respond with a json containing a message for notify fields missing', done => {
            request(app)
                .post('/api/activity')
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

        it('Respond with a json containing a message for notify type not accepted', done => {
            request(app)
                .post('/api/activity')
                .set('Accept', 'application/json')
                .send({
                    name: "My first activity",
                    description: "Introduction to the logic activities, this activity is only for test the students basic knowledges",
                    type: "activity"
                })
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Invalid type");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify name field is empty', done => {
            request(app)
                .post('/api/activity')
                .set('Accept', 'application/json')
                .send({
                    name: "   ",
                    description: "Introduction to the logic activities, this activity is only for test the students basic knowledges",
                    type: "logic_sequence"
                })
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Field(s) required!");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });
    });

    describe('Running logic sequence tests', () => {
        require('./logic-sequence.test');
    });

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

        it('Respond with a json containing a message for notify the operation success', done => {
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
                .expect(201)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "The activity has been updated satisfactorily");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the name field is empty', done => {
            request(app)
                .put(`/api/activity/${activityID}`)
                .set('Accept', 'application/json')
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
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the name field is missing', done => {
            request(app)
                .put(`/api/activity/${activityID}`)
                .set('Accept', 'application/json')
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
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the activity Id is invalid', done => {
            request(app)
                .put('/api/activity/genericID')
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
                .expect(500)
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the activity has been not found', done => {
            request(app)
                .put('/api/activity/666666666666666666666666')
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
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Activity not found");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });
    });

    describe('List activities', () => {

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .get(`/api/activity`)
                .expect(200)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Activities list request has been completed satisfactorily");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });
    });

    

    describe('Delete an activity', () => {

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .delete(`/api/activity/${activityID}`)
                .expect(200)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "The activity has been deleted satisfactorily");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the activity has been not found', done => {
            request(app)
                .delete('/api/activity/666666666666666666666666')
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Activity not found");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the activity Id is invalid', done => {
            request(app)
                .delete('/api/activity/genericID')
                .expect(500)
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });
    });
});