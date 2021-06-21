import request from 'supertest';

import app from '../src/app';

import fs from 'fs';

import path from 'path';

import assert from "assert";

var userToken = null;
var tempActivities = null;
var taskID = null;

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
        let taskIDPath = path.join(__dirname, './static_test/taskID.txt');
        try {
            taskID = fs.readFileSync(taskIDPath, 'utf8');
            console.log('task ID defined');
            done();
        } catch (err) {
            console.log('task ID not found');
            done(err);
        }
    });

    /**
     * Obtaining temporal actvities for adding to a task
     */
    before(done => {
        let tempActivitiesPath = path.join(__dirname, './static_test/tempActivities.json');
        try {
            let data = fs.readFileSync(tempActivitiesPath, 'utf8');
            tempActivities = JSON.parse(data);
            console.log('Temporal activities found');
            done();
        } catch (err) {
            console.log('Temporal activities not found');
            done(err);
        }
    });

    describe('Add activities to a task', () => {

        it('Responds with a json containing a message for notify No token provided', (done) => {
            request(app)
                .post(`/api/course/task/activity/${taskID}`)
                .send({
                    activities: [
                        {
                            _id: tempActivities[0]._id
                        },
                        {
                            _id: tempActivities[1]._id
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

        it('Responds with a json containing a message for notify activities not found', (done) => {
            request(app)
                .post(`/api/course/task/activity/${taskID}`)
                .set('Accept', 'application/json')
                .set('x-access-token', userToken)
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Las actividades no fueron encontradas");
                })
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Responds with a json containing a message for notify task not found', (done) => {
            request(app)
                .post('/api/course/task/activity/666666666666666666666666')
                .send({
                    activities: [
                        {
                            _id: tempActivities[0]._id
                        },
                        {
                            _id: tempActivities[1]._id
                        }
                    ]
                })
                .set('Accept', 'application/json')
                .set('x-access-token', userToken)
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Tarea no encontrada");
                })
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Responds with a json containing a message for notify activities accepted: 1, activities denied: 0', (done) => {
            request(app)
                .post(`/api/course/task/activity/${taskID}`)
                .send({
                    activities: [
                        {
                            _id: tempActivities[0]._id
                        }
                    ]
                })
                .set('Accept', 'application/json')
                .set('x-access-token', userToken)
                .expect(201)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Actividades añadidas al curso satisfactoriamente");
                    assert.strictEqual(res.body.acceptedActivities.length, 1);
                })
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Responds with a json containing a message for notify activities accepted: 1, activities denied: 1', (done) => {
            request(app)
                .post(`/api/course/task/activity/${taskID}`)
                .send({
                    activities: [
                        {
                            _id: tempActivities[0]._id
                        },
                        {
                            _id: tempActivities[1]._id
                        }
                    ]
                })
                .set('Accept', 'application/json')
                .set('x-access-token', userToken)
                .expect(201)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Actividades añadidas al curso satisfactoriamente");
                    assert.strictEqual(res.body.acceptedActivities.length, 1);
                    assert.strictEqual(res.body.deniedActivities.length, 1);
                })
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Responds with a json containing a message for notify activities accepted: 0, activities denied: 2', (done) => {
            request(app)
                .post(`/api/course/task/activity/${taskID}`)
                .send({
                    activities: [
                        {
                            _id: tempActivities[0]._id
                        },
                        {
                            _id: tempActivities[1]._id
                        }
                    ]
                })
                .set('Accept', 'application/json')
                .set('x-access-token', userToken)
                .expect(201)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Actividades añadidas al curso satisfactoriamente");
                    assert.strictEqual(res.body.acceptedActivities.length, 0);
                    assert.strictEqual(res.body.deniedActivities.length, 2);
                })
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        });
    });


    describe('Remove activities to a task', () => {
        it('Responds with a json containing a message for notify no token provided', done => {
            request(app)
                .delete(`/api/course/task/activity/${taskID}/${tempActivities[0]._id}`)
                .expect(403)
                .expect((res) => {
                    assert.strictEqual(res.body.message, 'No token provided');
                })
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Responds with a json containing a message for notify task or activities not found', done => {
            request(app)
                .delete('/api/course/task/activity/666666666666666666666666/666666666666666666666666')
                .set('x-access-token', userToken)
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Tarea o actividad no encontrada");
                })
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Responds with a json containing a message for notify temp activity 1 has been removed from task', done => {
            request(app)
                .delete(`/api/course/task/activity/${taskID}/${tempActivities[0]._id}`)
                .set('x-access-token', userToken)
                .expect(201)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Actividad eliminada satisfactoriamente");
                })
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Responds with a json containing a message for notify temp actviity 2 has been removed from task', done => {
            request(app)
                .delete(`/api/course/task/activity/${taskID}/${tempActivities[1]._id}`)
                .set('x-access-token', userToken)
                .expect(201)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Actividad eliminada satisfactoriamente");
                })
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        });
    });


});

