const Router = require('@koa/router');
const router = new Router();
const BASE_URL = `/v1/default`;

router.get(BASE_URL, async (context) => {
    try {
        context.body = {
            status: 'success',
            data: [1, 2, 3, 4]
        };
    } catch (err) {
        console.error(err)
    }
})

module.exports = router;