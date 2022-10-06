const queries = require('../../db/queries/bikes');

export default async function bikes(req, res) {
  try {
    const data = await queries.getAllBikes();
    res.status(200).json({ status: "success", data })
  } catch (error) {
    console.error(error)
    res.status(500).end('Error getting bikes')
  }
}
