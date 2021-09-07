import request from 'supertest';

import app from '../src/app';

import fs from 'fs';

import path from 'path';

import assert from "assert";

var studentID = null;
var teacherID = null;
var courseID = null;
var perspectiveID = null;
var userToken = null;

/**
 * Testing perspective endpoints
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

    before((done) => {
        let studentIDPath = path.join(__dirname, './static_test/tempStudents.json');
        try {
            let data = fs.readFileSync(studentIDPath, 'utf8');
            studentID = JSON.parse(data)[0]._id;
            console.log('Student ID defined');
            done();
        } catch (err) {
            console.log('Student ID not found');
            done(err);
        }
    });

    before((done) => {
        let teacherIDPath = path.join(__dirname, './static_test/personID.txt');
        try {
            teacherID = fs.readFileSync(teacherIDPath, 'utf8');
            console.log('Teacher ID defined');
            done();
        } catch (err) {
            console.log('Teacher ID not found');
            done(err);
        }
    });

    /**
     * Creating a perspective
     */
    describe('Create a perspective', () => {

        it('Respond with a json containing a message for notify no token provided', done => {
            request(app)
                .post(`/api/perspective/${courseID}/${teacherID}/${studentID}`)
                .send({
                    message: "El estudiante tuvo un desempeño aceptable pero se distrae facilmente con sus compañeros"
                })
                .set('Accept', 'application/json')
                .expect(403)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "No token provided");
                })
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify course not found', done => {
            request(app)
                .post(`/api/perspective/666666666666666666666666/${teacherID}/${studentID}`)
                .send({
                    message: "El estudiante tuvo un desempeño aceptable pero se distrae facilmente con sus compañeros"
                })
                .set('Accept', 'application/json')
                .set('x-access-token', userToken)
                .expect(404)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "¡Curso no encontrado!");
                })
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify teacher not found', done => {
            request(app)
                .post(`/api/perspective/${courseID}/666666666666666666666666/${studentID}`)
                .send({
                    message: "El estudiante tuvo un desempeño aceptable pero se distrae facilmente con sus compañeros"
                })
                .set('Accept', 'application/json')
                .set('x-access-token', userToken)
                .expect(404)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "¡Profesor no encontrado!");
                })
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify student not found', done => {
            request(app)
                .post(`/api/perspective/${courseID}/${teacherID}/666666666666666666666666`)
                .send({
                    message: "El estudiante tuvo un desempeño aceptable pero se distrae facilmente con sus compañeros"
                })
                .set('Accept', 'application/json')
                .set('x-access-token', userToken)
                .expect(404)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "¡Estudiante no encontrado!");
                })
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify message is empty', done => {
            request(app)
                .post(`/api/perspective/${courseID}/${teacherID}/${studentID}`)
                .send({
                    message: "   "
                })
                .set('Accept', 'application/json')
                .set('x-access-token', userToken)
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "¡El mensaje no puede estar vacio!");
                })
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify no message field provided', done => {
            request(app)
                .post(`/api/perspective/${courseID}/${teacherID}/${studentID}`)
                .send({
                    another: "El estudiante tuvo un desempeño aceptable pero se distrae facilmente con sus compañeros"
                })
                .set('Accept', 'application/json')
                .set('x-access-token', userToken)
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "¡Campo de mensaje requerido!");
                })
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .post(`/api/perspective/${courseID}/${teacherID}/${studentID}`)
                .send({
                    message: "El estudiante tuvo un desempeño aceptable pero se distrae facilmente con sus compañeros"
                })
                .set('Accept', 'application/json')
                .set('x-access-token', userToken)
                .expect(201)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Perspectiva creada exitosamente");
                })
                .end((err, res) => {
                    if (err) return done(err);
                    let filePath = path.join(__dirname, './static_test/perspectiveID.txt');
                    fs.writeFile(filePath, res.body.perspective._id, (err) => {
                        if (err) console.error(err);
                    });
                    done();
                });
        });
    });

    /**
     * Obtaining perspectives
     */
    describe('Get a perspective /api/perspective/:person/:personId', () => {

        it('Respond with a json containing a message for notify no token provided', done => {
            request(app)
                .get(`/api/perspective/student/${studentID}`)
                .expect(403)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "No token provided");
                })
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify invalid rol', done => {
            request(app)
                .get(`/api/perspective/worker/${studentID}`)
                .set('x-access-token', userToken)
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "¡Rol de la persona inválido!");
                })
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the perspective not found due to teacher id', done => {
            request(app)
                .get(`/api/perspective/student/${teacherID}`)
                .set('x-access-token', userToken)
                .expect(200)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "¡Perspectivas no encontrada!");
                })
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the perspective not found due to student id', done => {
            request(app)
                .get(`/api/perspective/teacher/${studentID}`)
                .set('x-access-token', userToken)
                .expect(200)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "¡Perspectivas no encontrada!");
                })
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });
        it('Respond with a json containing a message for notify perspective not found', done => {
            request(app)
                .get('/api/perspective/teacher/666666666666666666666666')
                .set('x-access-token', userToken)
                .expect(200)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "¡Perspectivas no encontrada!");
                })
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the operation success for a student request', done => {
            request(app)
                .get(`/api/perspective/student/${studentID}`)
                .set('x-access-token', userToken)
                .expect(200)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Perspectivas obtenidas exitosamente");
                })
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the operation success for a teacher request', done => {
            request(app)
                .get(`/api/perspective/teacher/${teacherID}`)
                .set('x-access-token', userToken)
                .expect(200)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Perspectivas obtenidas exitosamente");
                })
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

    });

    /**
     * Obtaining perspectives
     */
    describe('Get a perspective /api/perspective/:courseId/:teacherId/:studentId', () => {

        it('Respond with a json containing a message for notify no token provided', done => {
            request(app)
                .get(`/api/perspective/${courseID}/${teacherID}/${studentID}`)
                .expect(403)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "No token provided");
                })
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for perspective not found', done => {
            request(app)
                .get('/api/perspective/666666666666666666666666/666666666666666666666666/666666666666666666666666')
                .set('x-access-token', userToken)
                .expect(200)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "¡No se encontro ninguna perspectiva!");
                })
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .get(`/api/perspective/${courseID}/${teacherID}/${studentID}`)
                .set('x-access-token', userToken)
                .expect(200)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Perspectivas obtenidas exitosamente");
                })
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });
    });

    /**
     * Updating a perspective
     */
    describe('Update a perspective', () => {

        before((done) => {
            let perspectiveIDPath = path.join(__dirname, './static_test/perspectiveID.txt');
            try {
                perspectiveID = fs.readFileSync(perspectiveIDPath, 'utf8');
                console.log('Perspective ID defined');
                done();
            } catch (err) {
                console.log('Perspective ID not found');
                done(err);
            }
        });

        it('Respond with a json containing a message for notify no token provided', done => {
            request(app)
                .put(`/api/perspective/${perspectiveID}`)
                .send({
                    message: "El estudiante mejoró mucho su atención en las ultimas 2 semanas"
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

        it('Respond with a json containing a message for notify perspective not found', done => {
            request(app)
                .put('/api/perspective/666666666666666666666666')
                .send({
                    message: "El estudiante mejoró mucho su atención en las ultimas 2 semanas"
                })
                .set('Accept', 'application/json')
                .set('x-access-token', userToken)
                .expect(404)
                .expect((res) => {
                    assert.strictEqual(res.body.message, '¡Perspectiva no encontrada!');
                })
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the message field is empty', done => {
            request(app)
                .put(`/api/perspective/${perspectiveID}`)
                .send({
                    message: "    "
                })
                .set('Accept', 'application/json')
                .set('x-access-token', userToken)
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "¡El mensaje es requerido!");
                })
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the message field is missing', done => {
            request(app)
                .put(`/api/perspective/${perspectiveID}`)
                .send({
                    another: "El estudiante mejoró mucho su atención en las ultimas 2 semanas"
                })
                .set('Accept', 'application/json')
                .set('x-access-token', userToken)
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "¡El mensaje es requerido!");
                })
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .put(`/api/perspective/${perspectiveID}`)
                .send({
                    message: "El estudiante mejoró mucho su atención en las ultimas 2 semanas"
                })
                .set('Accept', 'application/json')
                .set('x-access-token', userToken)
                .expect(201)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "¡Perspectiva actualizada exitosamente!");
                })
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

    });



    /**
     * Deleting a perspective
     */
    describe('Delete a perspective', () => {
        before((done) => {
            let perspectiveIDPath = path.join(__dirname, './static_test/perspectiveID.txt');
            try {
                perspectiveID = fs.readFileSync(perspectiveIDPath, 'utf8');
                console.log('Perspective ID defined');
                done();
            } catch (err) {
                console.log('Perspective ID not found');
                done(err);
            }
        });

        it('Respond with a json containing a message for notify no token provided', done => {
            request(app)
                .delete(`/api/perspective/${perspectiveID}`)
                .expect(403)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "No token provided");
                })
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify perspective not found', done => {
            request(app)
                .delete('/api/perspective/666666666666666666666666')
                .set('x-access-token', userToken)
                .expect(404)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "¡Perspectiva no encontrada!");
                })
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .delete(`/api/perspective/${perspectiveID}`)
                .set('x-access-token', userToken)
                .expect(201)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "¡Perspectiva eliminada satisfactoriamente!");
                })
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });
    });
});