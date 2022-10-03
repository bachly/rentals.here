const request = require("supertest");
const koa = require("../koa")();
const knex = require('../../db/connection');

describe('routes: /v1/users', () => {
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

    describe('GET /api/v1/users', () => {
        test('should return all users', async (done) => {
            const response = await request(koa.callback()).get("/v1/users");
            expect(response.status).toEqual(200);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('success');
            expect(response.body.data.length).toEqual(5);
            done();
        });
    });

    describe('GET /api/v1/users/:id', () => {
        it('should respond with a single user', async (done) => {
            const response = await request(koa.callback()).get("/v1/users/1");
            expect(response.status).toEqual(200);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('success');
            expect(Object.keys(response.body.data[0])).toEqual(
                expect.arrayContaining(['id', 'username', 'roles', 'active'])
            );
            done();
        });

        it('should throw an error if the user does not exist', async (done) => {
            const response = await request(koa.callback()).get("/v1/users/9999999");
            expect(response.status).toEqual(404);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('error');
            expect(response.body.message).toEqual('That user does not exist.');
            done();
        });
    });

    describe('POST /api/v1/users', () => {
        it('should return the user that was added', async (done) => {
            const response = await request(koa.callback()).post("/v1/users").send({
                username: 'user@test.com',
                password: '123',
                roles: [],
                active: true
            });
            expect(response.status).toEqual(201);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('success');
            expect(Object.keys(response.body.data[0])).toEqual(
                expect.arrayContaining(['id', 'username', 'roles', 'active'])
            );
            done();
        });
        it('should throw an error if the payload is malformed', async (done) => {
            const response = await request(koa.callback()).post("/v1/users").send({
                username: 'user@test.com',
            });
            expect(response.status).toEqual(400);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('error');
            expect(response.body.message).toBeDefined();
            done();
        });
    });

    describe('PUT /api/v1/users', () => {
        it('should return the user that was updated', async (done) => {
            const allUsers = await knex('users').select('*');
            const firstUser = allUsers[0];
            const response = await request(koa.callback()).put(`/v1/users/${firstUser.id}`).send({
                roles: JSON.stringify(["manager"])
            });
            expect(response.status).toEqual(200);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('success');
            expect(Object.keys(response.body.data[0])).toEqual(
                expect.arrayContaining(['id', 'username', 'roles', 'active'])
            );
            // ensure the user was in fact updated
            const theUpdatedUser = response.body.data[0];
            expect(theUpdatedUser.roles).not.toEqual(firstUser.roles);
            expect(theUpdatedUser.roles).toEqual(["manager"]);

            done();
        });

        it('should throw an error if the user does not exist', async (done) => {
            const response = await request(koa.callback()).put(`/v1/users/9999999`).send({
                active: false
            });

            expect(response.status).toEqual(404);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('error');
            expect(response.body.message).toEqual('That user does not exist.');
            done();
        });
    });

    describe('DELETE /api/v1/users/:id', () => {
        it('should return the user that was deleted', async (done) => {
            const allUsersBeforeDelete = await knex('users').select('*');
            const firstUser = allUsersBeforeDelete[0];
            const response = await request(koa.callback()).delete(`/v1/users/${firstUser.id}`);

            expect(response.status).toEqual(200);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('success');

            expect(Object.keys(response.body.data[0])).toEqual(
                expect.arrayContaining(['id', 'username', 'roles', 'active'])
            );

            // ensure the user was in fact deleted
            const allUsersAfterDeletion = await knex('users').select('*');
            expect(allUsersAfterDeletion.length).toEqual(allUsersBeforeDelete.length - 1);
            done();
        });

        it('should throw an error if the user does not exist', async (done) => {
            const response = await request(koa.callback()).delete(`/v1/users/9999999`);

            expect(response.status).toEqual(404);
            expect(response.type).toEqual("application/json");
            expect(response.body.status).toEqual('error');
            expect(response.body.message).toEqual('That user does not exist.');
            done();
        });
    });
})