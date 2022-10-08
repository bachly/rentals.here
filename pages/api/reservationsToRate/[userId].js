const queries = require('../../../db/queries/reservations');

export default async function reservationsToRateByUser(req, res) {
    try {
        const userId = req.query.userId;

        switch (req.method) {
            case "GET":
                const bikes = await queries.getReservationsToRateByUser(userId);
                res.status(200).json({ status: 'success', data: bikes })
                break;
            default:
                res.status(400).end('Unknown Request Method.')
        }
    } catch (error) {
        console.error(error);
        res.status(500).end('[API/Bikes] Server Error.')
    }
}
