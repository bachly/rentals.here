const queries = require('../../../db/queries/reservations');

export default async function reservationsWithId(req, res) {
    try {
        const id = req.query.id;

        switch (req.method) {
            case "GET":
                const data = await queries.getSingleReservation(id);
                if (reservation.length) {
                    res.status(200).json({ status: 'success', data })
                } else {
                    res.status(404).end(`That reservation doens't exist.`)
                }
                break;
            case "POST":
            case "PUT":
                let updatedReservation = await queries.updateReservation(id, req.body);
                if (updatedReservation.length) {
                    res.status(200).json({ status: 'success', data: updatedReservation })
                } else {
                    res.status(404).end(`That reservation doens't exist.`)
                }
                break;
            case "DELETE":
                let deletedReservation = await queries.deleteReservation(id);
                if (deletedReservation.length) {
                    res.status(200).json({ status: 'success', data: deletedReservation })
                } else {
                    res.status(404).end(`That reservation doens't exist.`)
                }
                break;
            default:
                res.status(400).end('Unknown Request Method.')
        }
    } catch (error) {
        console.error(error);
        res.status(500).end('[API/Reservations] Server Error.')
    }
}
