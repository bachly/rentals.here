const Router = require('@koa/router');
const queries = require('../../db/queries/users');

const router = new Router();
const BASE_URL = `/v1/users`;

router.get(BASE_URL, async (context) => {
    try {
        const users = await queries.getAllUsers();
        context.body = {
            status: 'success',
            data: users
        };
    } catch (err) {
        console.log(err)
    }
})

router.get(`${BASE_URL}/:id`, async (context) => {
    try {
        const user = await queries.getSingleUser(context.params.id);
        if (user.length) {
            context.body = {
                status: 'success',
                data: user
            };
        } else {
            context.status = 404;
            context.body = {
                status: 'error',
                message: 'That user does not exist.'
            };
        }
    } catch (err) {
        console.log(err)
    }
})

router.get(`${BASE_URL}-and-reservations`, async (context) => {
    try {
        const users = await queries.getUsersWithReservations();
        context.body = {
            status: 'success',
            data: users
        };
    } catch (err) {
        console.log(err)
    }
})

router.post(`${BASE_URL}`, async (context) => {
    try {
        const user = await queries.addUser(context.request.body);
        if (user.length) {
            context.status = 201;
            context.body = {
                status: 'success',
                data: user
            };
        } else {
            context.status = 400;
            context.body = {
                status: 'error',
                message: 'Something went wrong.'
            };
        }
    } catch (err) {
        context.status = 400;
        context.body = {
            status: 'error',
            message: err.message || 'Sorry, an error has occurred.'
        };
    }
})

router.put(`${BASE_URL}/:id`, async (context) => {
    try {
        const user = await queries.updateUser(context.params.id, context.request.body);
        if (user.length) {
            context.status = 200;
            context.body = {
                status: 'success',
                data: user
            };
        } else {
            context.status = 404;
            context.body = {
                status: 'error',
                message: 'That user does not exist.'
            };
        }
    } catch (err) {
        context.status = 400;
        context.body = {
            status: 'error',
            message: err.message || 'Sorry, an error has occurred.'
        };
    }
})

router.delete(`${BASE_URL}/:id`, async (context) => {
    try {
        const user = await queries.deleteUser(context.params.id);
        if (user.length) {
            context.status = 200;
            context.body = {
                status: 'success',
                data: user
            };
        } else {
            context.status = 404;
            context.body = {
                status: 'error',
                message: 'That user does not exist.'
            };
        }
    } catch (err) {
        context.status = 400;
        context.body = {
            status: 'error',
            message: err.message || 'Sorry, an error has occurred.'
        };
    }
})

module.exports = router;