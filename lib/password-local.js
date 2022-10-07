import Local from 'passport-local'
import { findUser, validatePassword } from './user'

export const localStrategy = new Local.Strategy(async function (
  username,
  password,
  done
) {
  const user = await findUser({ username });
  try {
    if (user && validatePassword(user, password)) {
      done(null, user)
    } else {
      done(new Error('Invalid username and password combination'))
    }
  } catch (error) {
    done(error)
  }
})
