const Router = require('@koa/router');
const queries = require('../../db/queries/reservations');

const router = new Router();
const BASE_URL = `/v1/reservations`;

router.get(`${BASE_URL}`, async (context) => {
    try {
        const reservations = await queries.getAllReservations();
        context.body = {
            status: 'success',
            data: reservations
        };
    } catch (err) {
        console.error(err)
    }
})

router.get(`${BASE_URL}/byUser/:userId`, async (context) => {
    try {
        const bikes = await queries.getBikesReservedByUser(context.params.userId);
        context.body = {
            status: 'success',
            data: bikes
        };
    } catch (err) {
        console.error(err)
    }
})

router.post(`${BASE_URL}`, async (context) => {
    try {
        const reservation = await queries.addReservation(context.request.body);

        if (reservation.length) {
            context.status = 201;
            context.body = {
                status: 'success',
                data: reservation
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

router.put(`${BASE_URL}/:id/cancel`, async (context) => {
    try {
        const reservation = await queries.updateReservation(context.params.id, { active: false });
        if (reservation.length) {
            context.status = 200;
            context.body = {
                status: 'success',
                data: reservation
            };
        } else {
            context.status = 404;
            context.body = {
                status: 'error',
                message: 'That reservation does not exist.'
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