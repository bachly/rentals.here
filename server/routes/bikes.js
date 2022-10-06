const Router = require('@koa/router');
const queries = require('../../db/queries/bikes');

const router = new Router();
const BASE_URL = `/v1/bikes`;

router.get(BASE_URL, async (context) => {
    try {
        const bikes = await queries.getAllBikes();
        context.body = {
            status: 'success',
            data: bikes
        };
    } catch (err) {
        console.error(err)
    }
})

router.get(`${BASE_URL}/:id`, async (context) => {
    try {
        const bike = await queries.getSingleBike(context.params.id);
        if (bike.length) {
            context.body = {
                status: 'success',
                data: bike
            };
        } else {
            context.status = 404;
            context.body = {
                status: 'error',
                message: 'That bike does not exist.'
            };
        }
    } catch (err) {
        console.error(err)
    }
})

router.get(`${BASE_URL}/availableOnDate/:date`, async (context) => {
    try {
        const bikes = await queries.getAvailableBikesOnADate(context.params.date);
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
        const bike = await queries.addBike(context.request.body);
        if (bike.length) {
            context.status = 201;
            context.body = {
                status: 'success',
                data: bike
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
        const bike = await queries.updateBike(context.params.id, context.request.body);
        if (bike.length) {
            context.status = 200;
            context.body = {
                status: 'success',
                data: bike
            };
        } else {
            context.status = 404;
            context.body = {
                status: 'error',
                message: 'That bike does not exist.'
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
        const bike = await queries.deleteBike(context.params.id);
        if (bike.length) {
            context.status = 200;
            context.body = {
                status: 'success',
                data: bike
            };
        } else {
            context.status = 404;
            context.body = {
                status: 'error',
                message: 'That bike does not exist.'
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