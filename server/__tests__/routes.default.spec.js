const request = require("supertest");
const koa = require("../koa")();
const knex = require('../../db/connection');

describe("routes: /v1/default", () => {
    beforeAll(async (done) => {
        await knex.migrate.rollback();
        await knex.migrate.latest();
        await knex.seed.run();
        done();
    });

    afterAll(async (done) => {
        await knex.migrate.rollback();
        await knex.destroy();
        done();
    });

    describe('GET /v1/default', () => {
        it('should return test results', async (done) => {
            const response = await request(koa.callback()).get("/v1/default");
            expect(response.status).toEqual(200);
            expect(response.type).toEqual("application/json");
            expect(response.body.data.length).toEqual(4);
            done();
        });
    })
})