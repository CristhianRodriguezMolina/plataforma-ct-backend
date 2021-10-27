import request from 'supertest';

import app from '../src/app';

import fs from 'fs';

import path from 'path';

import assert from "assert";

import Person from '../src/models/Person';

/**
 * Testing course tests
 */
describe('REQUEST /api/auth', () => {

    before(async () => {
        let userTokenPath = path.join(__dirname, './static_test/userToken.txt');
        try {
            const person = await Person.findOneAndUpdate({ id: 'fRnV4K9Z2wMBjp' }, {
                password: await Person.encryptPassword('fRnV4K9Z2wMBjp')
            }, {
                new: true
            });
            console.log("The password has been encrypted successfully")
            return Promise.resolve()
        } catch (err) {
            console("The password couldn't be encrypted successfully");
            done(err);
        }
    });

    describe('Signin correcto', () => {
        it('Respond with a json containing a message for notify the operation success', done => {
            request(app)
                .post('/api/auth/signin')
                .send({
                    id: "fRnV4K9Z2wMBjp",
                    password: "fRnV4K9Z2wMBjp"
                })
                .set('Accept', 'application/json')
                .expect(200)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Signin correcto");
                })
                .end((err, res) => {
                    if (err) return done(err);
                    let filePath = path.join(__dirname, './static_test/userToken.txt');
                    fs.writeFile(filePath, res.body.token, (err) => {
                        if (err) console.error(err);
                    });
                    done();
                });
        });
    });

    describe('Signin con errores', () => {
        it('Respond with a json containing a message for notify required fields', done => {
            request(app)
                .post('/api/auth/signin')
                .send({
                    id: "fRnV4K9Z2wMBjp"
                })
                .set('Accept', 'application/json')
                .expect(400)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "Campo(s) requerido(s)!");
                })
                .end((err, res) => {
                    if (err) return done(err);
                    done(err);
                });
        });

        it('Respond with a json containing a message for notify incorrect id or password ', done => {
            request(app)
                .post('/api/auth/signin')
                .send({
                    id: "fRnV4K9Z2wMBjp",
                    password: "sadfhos"
                })
                .set('Accept', 'application/json')
                .expect(200)
                .expect((res) => {
                    assert.strictEqual(res.body.message, "ID o contraseña incorrectos!");
                })
                .end((err, res) => {
                    if (err) return done(err);
                    done(err);
                });
        });
    });
});
