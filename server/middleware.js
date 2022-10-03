
const knex = require('../db/connection');
const dotenv = require("dotenv");
dotenv.config();

/**
 * Last-stop Error Handling for all middleware
 * @param {*} context 
 * @param {*} next 
 */
module.exports.errorHandling = async (context, next) => {
    try {
        await next();
    } catch (error) {
        context.status = error.status || 500;
        context.body = {
            success: false,
            error: {
                message: error.message,
            },
        };

        if (context.state.debug) {
            context.body = {
                ...context.body,
                debug: {
                    request: context.request || null,
                    query: context.request.query || null,
                    requestBody: context.request.body || null,
                    contextState: context.state || null,
                },
            };
        }

        context.app.emit("error", error, context);
    }
};

/**
 * 
 * Format the response before returnning to the frontend
 * 
 * @param {*} context 
 * @param {*} next 
 */
module.exports.response = (context, next) => {
    context.status = 200;

    context.body = {
        ...context.body,
        success: true,
        result: context.state.result || null,
    };

    if (context.state.debug) {
        context.body = {
            ...context.body,
            debug: {
                request: context.request || null,
                query: context.request.query || null,
                requestBody: context.request.body || null,
                contextState: context.state || null,
            },
        };
    }
};