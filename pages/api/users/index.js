const queries = require('../../../db/queries/users');

export default async function users(req, res) {
  try {
    switch (req.method) {
      case "GET":
        const data = await queries.getUsersWithReservations();
        res.status(200).json({ status: "success", data });
        break;
      case "POST":
        const users = await queries.addUser({
          ...req.body,
          active: true
        });
        if (users.length) {
          res.status(200).json({ status: 'success', data: users })
        } else {
          res.status(400).end('Error adding users.')
        }
        break;
      default:
        res.status(400).end('Unknown Request Method.')
    }
  } catch (error) {
    console.error(error);
    res.status(500).end(`[ERR] ${error.message}`)
  }
}
