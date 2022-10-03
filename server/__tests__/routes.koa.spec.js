const request = require("supertest");
const koa = require("../koa")();
const knex = require('../../db/connection');

describe("routes: /v1/test", () => {
    beforeEach(async (done) => {
        await knex.migrate.rollback();
        await knex.migrate.latest();
        await knex.seed.run();
        done();
    });

    afterEach(async (done) => {
        await knex.migrate.rollback();
        await knex.destroy();
        done();
    });

    test("GET /v1/test", async (done) => {
        const response = await request(koa.callback()).get("/v1/test");

        expect(response.status).toEqual(200);
        expect(response.type).toEqual("application/json");
        expect(Object.keys(response.body.data)).toEqual(
            expect.arrayContaining(["sampleProducts"])
        );
        expect(response.body.data.sampleProducts.length).toEqual(
            5
        );

        done();
    });
})