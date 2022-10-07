const queries = require('../../../db/queries/reservations');

export default async function reservations(req, res) {
    try {
        switch (req.method) {
            case "GET":
                const data = await queries.getAllReservations();
                res.status(200).json({ status: "success", data });
                break;
            case "POST":
                const reservation = await queries.addReservation({
                    ...req.body,
                    active: true
                });
                if (reservation.length) {
                    res.status(200).json({ status: 'success', data: reservation })
                } else {
                    res.status(400).end('Error adding reservation.')
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
