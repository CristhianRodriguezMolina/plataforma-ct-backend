import request from 'supertest';

import app from '../src/app';

import fs from 'fs';

import path from 'path';

import assert from "assert"; 

var personID = null;

/**
 * Testing users tests
 */
 describe('REQUEST /api/person', () => {     
    describe('Create an person', () => {
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
                .expect(201)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Usuario creado satisfactoriamente");
                })
                .end((err, res) => {
                    if(err) return done(err);
                    let filePath = path.join(__dirname, 'personID.txt');
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
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Por favor, ingrese el nombre");
                })
                .end((err) => {
                    if(err) return done(err);
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
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "El role bulldog no existe");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });
    });

    describe('Update a person', () => {
        before((done) => {
            let personIDPath = path.join(__dirname, 'personID.txt');
            try {
                personID = fs.readFileSync(personIDPath, 'utf8');
                console.log('Person ID defined');
                done();
            } catch (err) {
                console.log('Person ID not found');
                done(err);
            }
        });

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .put(`/api/person/${personID}`)
                .set('Accept', 'application/json')
                .send({
                    first_name: "ChangeFirstNameTest",
                    last_name: "ChangeLastNameTest"
                })
                .expect(201)
                .expect((res) => {                    
                    assert.strictEqual(res.body.message, "Usuario actualizado con exito");
                })
                .end((err) => {
                    if(err) return done(err);
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
                .expect(500)
                .end((err) => {
                    if(err) return done(err);
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
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Usuario no entontrado");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });
    });

    describe('List persons (teachers and students)', () => {

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .get(`/api/person/role/teacher`)
                .expect(200)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Usuarios con role teacher obtenidos satisfactoriamente");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .get(`/api/person/role/student`)
                .expect(200)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Usuarios con role student obtenidos satisfactoriamente");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .get(`/api/person/${personID}`)
                .expect(200)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Usuario encontrado satisfactoriamente!");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .get(`/api/person/666666666666666666666666`)
                .expect(404)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Usuario no encontrado o inexistente!");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .get(`/api/person/genericID`)
                .expect(500)
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });
    });

    

    describe('Delete a person', () => {

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .delete(`/api/person/${personID}`)
                .expect(200)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Usuario borrado con exito");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the activity has been not found', done => {
            request(app)
                .delete('/api/person/666666666666666666666666')
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Usuario no entontrado");
                })
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Respond with a json containing a message for notify the activity Id is invalid', done => {
            request(app)
                .delete('/api/person/genericID')
                .expect(500)
                .end((err) => {
                    if(err) return done(err);
                    done();
                });
        });
    });
});
