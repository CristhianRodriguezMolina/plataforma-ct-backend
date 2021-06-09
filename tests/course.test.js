import request from 'supertest';

import app from '../src/app';

import fs from 'fs';

import path from 'path';

import assert from "assert"; 

var courseID = null;
var personID = null;
var userToken = null;

/**
 * Testing course tests
 */
 describe('REQUEST /api/course', () => {     
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

    describe('Create an course', () => {
        it('Respond with a json containing a message for notify the operation failed', done => {
            request(app)
                .post(`/api/course`)
                .set('Accept', 'application/json')
                .send({
                    name: "Nuevo curso test",
                    description: "Descripción test",
                    topic: "Tema test",
                    visible: false
                })
                .expect(403)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "No token provided");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .post('/api/course')
                .send({
                    name: "Nuevo curso test",
                    description: "Descripción test",
                    topic: "Tema test",
                    visible: false
                })
                .set('Accept', 'application/json')
                .set('x-access-token', userToken)
                .expect(201)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Curso creado satisfactoriamente");
                })
                .end((err, res) => {                    
                    if(err) return done(err);
                    let filePath = path.join(__dirname, './static_test/courseID.txt');
                    fs.writeFile(filePath, res.body.course._id, (err) => {
                        if (err) console.error(err);
                    });
                    done();
                });
        });
    });

    describe('Update a course', () => {
        before((done) => {
            let courseIDPath = path.join(__dirname, './static_test/courseID.txt');
            try {
                courseID = fs.readFileSync(courseIDPath, 'utf8');
                console.log('Course ID defined');
                done();
            } catch (err) {
                console.log('Course ID not found');
                done(err);
            }
        });

        it('Respond with a json containing a message for notify the operation failed', done => {
            request(app)
                .put(`/api/course/${courseID}`)
                .set('Accept', 'application/json')
                .send({
                    name: "ChangeNameTest",
                    description: "ChangeDescriptionTest"
                })
                .expect(403)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "No token provided");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .put(`/api/course/${courseID}`)
                .set('Accept', 'application/json')
                .set('x-access-token', userToken)
                .send({
                    name: "ChangeNameTest",
                    description: "ChangeDescriptionTest"
                })
                .expect(201)
                .expect((res) => {                    
                    assert.strictEqual(res.body.message, "El curso fue actualizado con exito");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the activity Id is invalid', done => {
            request(app)
                .put('/api/course/genericID')
                .set('Accept', 'application/json')
                .set('x-access-token', userToken)
                .send({
                    name: "ChangeNameTest",
                    description: "ChangeDescriptionTest"
                })
                .expect(500)
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the activity has been not found', done => {
            request(app)
                .put('/api/course/666666666666666666666666')
                .set('Accept', 'application/json')
                .send({
                    name: "ChangeNameTest",
                    description: "ChangeDescriptionTest"
                })                
                .set('x-access-token', userToken)
                .expect(404)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Curso no encontrado");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });
    });

    describe('List courses', () => {
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
                .get(`/api/course/mycourses/${courseID}`)
                .expect(403)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "No token provided");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .get(`/api/course/mycourses/${personID}`)
                .set('x-access-token', userToken)
                .expect(200)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Cursos hallados con exito");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .get(`/api/course/${courseID}`)
                .set('x-access-token', userToken)
                .expect(200)
                .expect((res) => {
                    assert.strictEqual(res.body.message, `Curso hallado con exito`);
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .get(`/api/course/666666666666666666666666`)
                .set('x-access-token', userToken)
                .expect(404)
                .expect((res) => {
                    assert.strictEqual(res.body.message, `Curso no encontrado o inexistente!`);
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .get(`/api/course/genericID`)
                .set('x-access-token', userToken)
                .expect(500)
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });
    });

    

    describe('Delete a person', () => {

        it('Respond with a json containing a message for notify the operation failed', done => {
            request(app)
                .delete(`/api/course/${courseID}`)
                .expect(403)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "No token provided");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .delete(`/api/course/${courseID}`)
                .set('x-access-token', userToken)
                .expect(200)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "El curso fue borrado con exito");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the activity has been not found', done => {
            request(app)
                .delete('/api/course/666666666666666666666666')
                .set('x-access-token', userToken)
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Curso no encontrado");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the activity Id is invalid', done => {
            request(app)
                .delete('/api/course/genericID')
                .set('x-access-token', userToken)
                .expect(500)
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });
    });
});