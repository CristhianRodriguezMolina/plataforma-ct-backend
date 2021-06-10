import request from 'supertest';

import app from '../src/app';

import fs from 'fs';

import path from 'path';

import assert from "assert"; 

/**
 * Testing course tests
 */
 describe('REQUEST /api/auth', () => {     
    describe('Signin correcto', () => {
        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .post('/api/auth/signin')
                .send({
                    id: "111",
                    password: "12345"
                })
                .set('Accept', 'application/json')
                .expect(200)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Signin correcto");
                })
                .end((err, res) => {                    
                    if(err) return done(err);
                    let filePath = path.join(__dirname, './static_test/userToken.txt');
                    fs.writeFile(filePath, res.body.token, (err) => {
                        if (err) console.error(err);
                    });
                    done();
                });
        });
    });

    describe('Signin con errores', () => {
        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .post('/api/auth/signin')
                .send({
                    id: "111"
                })
                .set('Accept', 'application/json')
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Campo(s) requerido(s)!");
                })
                .end((err, res) => {                    
                    if(err) return done(err);
                    done(err);
                });
        });

        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .post('/api/auth/signin')
                .send({
                    id: "111",
                    password: "123456"
                })
                .set('Accept', 'application/json')
                .expect(200)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "ID o contraseña incorrectos!");
                })
                .end((err, res) => {                    
                    if(err) return done(err);
                    done(err);
                });
        });
    });
});
