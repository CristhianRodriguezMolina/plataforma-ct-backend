import request from 'supertest';

import app from '../src/app';




/**
 * Testing users endpoint
 */
describe('REQUEST /api/user', () => {
    it('test example', done => {
        request(app)
            .get(`/api/user`)
            .set('Accept', 'application/json')
            .expect({"message":"Hello baby ;v"})
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
});
