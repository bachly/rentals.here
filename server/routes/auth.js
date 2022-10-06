const Router = require('@koa/router');
const router = new Router();
const BASE_URL = `/v1/auth`;

import passport from 'passport'
import nextConnect from 'next-connect'
import { localStrategy } from '../../lib/password-local'
import { setLoginSession } from '../../lib/auth'

const authenticate = (method, req, res) =>
    new Promise((resolve, reject) => {
        passport.authenticate(method, { session: false }, (error, token) => {
            if (error) {
                reject(error)
            } else {
                resolve(token)
            }
        })(req, res)
    })

passport.use(localStrategy)

router.get(`${BASE_URL}/login`, async (context) => {
    nextConnect()
        .use(passport.initialize())
        .post(async (req, res) => {
            try {
                const user = await authenticate('local', req, res)
                // session is the payload to save in the token, it may contain basic info about the user
                const session = { ...user }

                await setLoginSession(res, session)

                context.body = {
                    status: 'success',
                    data: {
                        done: true
                    }
                };

            } catch (error) {
                console.error(error)
                context.status = 401;
                context.body = {
                    status: 'error',
                    message: 'Cannot login'
                };
            }
        })
})

