const queries = require('../../../db/queries/bikes');

export default async function bikes(req, res) {
  try {
    switch (req.method) {
      case "GET":
        const data = await queries.getAllBikes();
        res.status(200).json({ status: "success", data });
        break;
      case "POST":
        const bike = await queries.addBike({
          ...req.body,
          active: true
        });
        if (bike.length) {
          res.status(200).json({ status: 'success', data: bike })
        } else {
          res.status(400).end('Error adding bike.')
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
