const request = require("supertest");
const koa = require("../koa")();
const knex = require('../../db/connection');

describe('routes: /v1/bikes', () => {
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

    describe('GET /v1/bikes', () => {
        it('should return all bikes', async (done) => {
            const response = await request(koa.callback()).get("/v1/bikes");
            expect(response.status).toEqual(200);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('success');
            expect(response.body.data.length).toEqual(8);
            done();
        });
    });

    describe('GET /v1/bikes/:id', () => {
        it('should respond with a single bike', async (done) => {
            const response = await request(koa.callback()).get("/v1/bikes/1");
            expect(response.status).toEqual(200);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('success');
            expect(Object.keys(response.body.data[0])).toEqual(
                expect.arrayContaining(['id', 'model', 'color', 'location', 'active'])
            );
            done();
        });

        it('should throw an error if the bike does not exist', async (done) => {
            const response = await request(koa.callback()).get("/v1/bikes/9999999");
            expect(response.status).toEqual(404);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('error');
            expect(response.body.message).toEqual('That bike does not exist.');
            done();
        });
    });

    describe('GET /v1/bikes/availableOnDate/:date', () => {
        it("should return all bikes with expected fields", async (done) => {
            const response = await request(koa.callback()).get(`/v1/bikes/availableOnDate/2022-10-04`);
            expect(response.status).toEqual(200);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('success');
            expect(Object.keys(response.body.data[0])).toEqual(
                expect.arrayContaining(['id', 'model', 'color', 'location', 'active'])
            );
            done();
        })
        it("should return only bikes that are available on the specified date", async (done) => {
            let response;

            response = await request(koa.callback()).get(`/v1/bikes/availableOnDate/2022-10-04`);
            expect(response.body.data.length).toEqual(5);

            response = await request(koa.callback()).get(`/v1/bikes/availableOnDate/2022-10-05`);
            expect(response.body.data.length).toEqual(4);

            response = await request(koa.callback()).get(`/v1/bikes/availableOnDate/2022-10-06`);
            expect(response.body.data.length).toEqual(1);

            response = await request(koa.callback()).get(`/v1/bikes/availableOnDate/2022-10-07`);
            expect(response.body.data.length).toEqual(0);

            response = await request(koa.callback()).get(`/v1/bikes/availableOnDate/2022-10-09`);
            expect(response.body.data.length).toEqual(3);

            response = await request(koa.callback()).get(`/v1/bikes/availableOnDate/2022-10-10`);
            expect(response.body.data.length).toEqual(2);

            response = await request(koa.callback()).get(`/v1/bikes/availableOnDate/2022-10-11`);
            expect(response.body.data.length).toEqual(6);

            done();
        })
        it("should return only bikes that are available on the specified date and its reservation not canceled", async (done) => {
            let response;

            response = await request(koa.callback()).get(`/v1/bikes/availableOnDate/2022-10-08`);
            expect(response.body.data.length).toEqual(1);

            done();
        })
    })

    describe('POST /v1/bikes', () => {
        it('should return the bike that was added', async (done) => {
            const response = await request(koa.callback()).post("/v1/bikes").send({
                model: 'Kid Bike',
                color: 'green',
                location: 'Playground Area',
                active: true
            });
            expect(response.status).toEqual(201);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('success');
            expect(Object.keys(response.body.data[0])).toEqual(
                expect.arrayContaining(['id', 'model', 'color', 'location', 'active'])
            );
            done();
        });
        it('should throw an error if the payload is malformed', async (done) => {
            const response = await request(koa.callback()).post("/v1/bikes").send({
                model: 'Kid Bike'
            });
            expect(response.status).toEqual(400);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('error');
            expect(response.body.message).toBeDefined();
            done();
        });
    });

    describe('PUT /v1/bikes', () => {
        it('should return the bike that was updated', async (done) => {
            const allBikes = await knex('bikes').select('*');
            const firstBike = allBikes[0];
            const response = await request(koa.callback()).put(`/v1/bikes/${firstBike.id}`).send({
                color: 'yellow'
            });
            expect(response.status).toEqual(200);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('success');
            expect(Object.keys(response.body.data[0])).toEqual(
                expect.arrayContaining(['id', 'model', 'color', 'location', 'active'])
            );
            // ensure the bike was in fact updated
            const theUpdatedBike = response.body.data[0];
            expect(theUpdatedBike.color).not.toEqual(firstBike.color);
            expect(theUpdatedBike.color).toEqual('yellow');
            done();
        });

        it('should throw an error if the bike does not exist', async (done) => {
            const response = await request(koa.callback()).put(`/v1/bikes/9999999`).send({
                color: 'yellow'
            });

            expect(response.status).toEqual(404);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('error');
            expect(response.body.message).toEqual('That bike does not exist.');
            done();
        });
    });

    describe('DELETE /v1/bikes/:id', () => {
        it('should return the bike that was deleted', async (done) => {
            const allBikesBeforeDelete = await knex('bikes').select('*');
            const firstBike = allBikesBeforeDelete[0];
            const response = await request(koa.callback()).delete(`/v1/bikes/${firstBike.id}`);

            expect(response.status).toEqual(200);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('success');
            expect(Object.keys(response.body.data[0])).toEqual(
                expect.arrayContaining(['id', 'model', 'color', 'location', 'active'])
            );

            // ensure the bike was in fact deleted
            const allBikesAfterDeletion = await knex('bikes').select('*');
            expect(allBikesAfterDeletion.length).toEqual(allBikesBeforeDelete.length - 1);
            done();
        });

        it('should throw an error if the bike does not exist', async (done) => {
            const response = await request(koa.callback()).delete(`/v1/bikes/9999999`);

            expect(response.status).toEqual(404);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('error');
            expect(response.body.message).toEqual('That bike does not exist.');
            done();
        });
    });
})