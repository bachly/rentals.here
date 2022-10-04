const request = require("supertest");
const koa = require("../koa")();
const knex = require('../../db/connection');

describe('routes: /v1/reservations', () => {
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

    describe('GET /v1/reservations', () => {
        it('should return all reservations', async (done) => {
            const response = await request(koa.callback()).get("/v1/reservations");
            expect(response.status).toEqual(200);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('success');
            expect(response.body.data.length).toEqual(10);
            done();
        });
    });

    describe('GET /v1/reservations/byUser/:userId', () => {
        it('should return all reservations made by a user', async (done) => {
            const user1 = await knex('users')
                .select('users.id')
                .where('users.username', '=', 'user1@test.com')
                .first();

            const response = await request(koa.callback()).get(`/v1/reservations/byUser/${user1.id}`);
            expect(response.status).toEqual(200);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('success');
            expect(response.body.data.length).toEqual(2);
            expect(Object.keys(response.body.data[0])).toEqual(
                expect.arrayContaining(['id', 'model', 'color', 'active', 'reserved_from', 'reserved_to'])
            )
            done();
        });
    })

    describe('POST /v1/reservations', () => {
        it('should return the reservation that was added', async (done) => {
            const user = await knex('users').select('*').first();
            const bike = await knex('bikes').select('*').first();

            const response = await request(koa.callback()).post("/v1/reservations").send({
                user_id: user.id,
                bike_id: bike.id,
                reserved_from: '2022-10-01 08:00:00+11',
                reserved_to: '2022-10-01 12:00:00+11',
            });
            expect(response.status).toEqual(201);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('success');
            expect(Object.keys(response.body.data[0])).toEqual(
                expect.arrayContaining(['id', 'user_id', 'bike_id', 'reserved_from', 'reserved_to', 'active'])
            );
            done();
        });
        it('should throw an error if the payload is malformed', async (done) => {
            const user = knex('users').select('*').first();
            const bike = knex('bikes').select('*').first();

            const response = await request(koa.callback()).post("/v1/bikes").send({
                user_id: user.id,
                bike_id: bike.id,
            });
            expect(response.status).toEqual(400);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('error');
            expect(response.body.message).toBeDefined();
            done();
        });
    });

    describe('PUT /v1/reservations/:id/cancel', () => {
        it('should return the reservation that was cancelled', async (done) => {
            const allActiveReservations = await knex('reservations').select('*').where('active', '=', true);
            const reservation = allActiveReservations[0];
            const response = await request(koa.callback()).put(`/v1/reservations/${reservation.id}/cancel`).send({});
            expect(response.status).toEqual(200);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('success');
            expect(Object.keys(response.body.data[0])).toEqual(
                expect.arrayContaining(['id', 'user_id', 'bike_id', 'reserved_from', 'reserved_to', 'active'])
            );
            // ensure the reservation was in fact cancelled
            const theUpdatedReservation = response.body.data[0];
            expect(theUpdatedReservation.active).toEqual(false);
            done();
        });
    });
})