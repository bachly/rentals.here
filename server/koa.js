require("isomorphic-fetch");
const dotenv = require("dotenv");
const Koa = require("koa");
const BodyParser = require("koa-bodyparser");
const session = require("koa-session");
// const Pg = require("pg");
const Router = require("@koa/router");
const {
    errorHandling,
    response
} = require('./middleware');
const Logger = require("koa-logger");

const defaultRoutes = require('./routes/default');
const bikeRoutes = require('./routes/bikes');
const userRoutes = require('./routes/users');
const reservationRoutes = require('./routes/reservations');

dotenv.config();

module.exports = function (nextJsRequestHandler) {
    const koa = new Koa();
    const router = new Router();

    koa.use(BodyParser());
    koa.use(session({ secure: true, sameSite: "none" }, koa));
    koa.keys = [];

    // database
    // const knexconfig = require("../knexfile.js");
    // koa.pool = new Pg.Pool({
    //     ...knexconfig[process.env.NODE_ENV].connection  // connectionString: process.env.DATABASE_URL
    // });

    // routes
    const handleRequest = async (context) => {
        if (nextJsRequestHandler) {
            await nextJsRequestHandler(context.req, context.res);
        }
        context.respond = false;
        context.res.statusCode = 200;
    };

    /***** REST API *****/
    koa.use(defaultRoutes.routes());
    koa.use(bikeRoutes.routes());
    koa.use(userRoutes.routes());
    koa.use(reservationRoutes.routes());

    /***** Frontend Pages *****/
    router.get("/", errorHandling, loadContextState, handleRequest);

    /***** Admin Pages *****/
    router.get("/admin", errorHandling, loadContextState, handleRequest);
    router.get("/admin/(.*)", errorHandling, loadContextState, handleRequest);

    /**** NextJS /api routes */
    router.get("/api/(.*)", handleRequest);
    router.post("/api/(.*)", handleRequest);

    /***** NEXT JS RESOURCES & ALL OTHER ROUTES *****/
    router.get("(/_next/static/.*)", handleRequest);
    router.get("/_next/webpack-hmr", handleRequest);
    router.get("/(.*)nextJS(.*)", handleRequest);

    koa.use(router.allowedMethods());
    koa.use(router.routes());

    // logger
    koa.use(Logger());

    // centralized error logging
    koa.on("error", (err, context) => {
        console.error("[FATAL ERROR] ", err);
    });

    return koa;
};

/*========== PRIVATE FUNCTIONS ================*/

async function loadContextState(context, next) {
    const useMock = context.request.query.useMock === '1'

    context.state = {
        ...context.state,
        debug: context.request.query.debug
    };

    if (useMock) {
        context.state = {
            ...
            context.state,
            useMocks
        }
    }

    await next();
}