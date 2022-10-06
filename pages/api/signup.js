import { createUser } from '../../lib/user'

export default async function signup(req, res) {
  try {
    const data = await createUser(req.body)
    res.status(200).send({ status: "success", data })
  } catch (error) {
    console.error(error)
    res.status(500).end(error.message)
  }
}
