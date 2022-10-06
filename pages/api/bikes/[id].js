const queries = require('../../../db/queries/bikes');

export default async function bikesWithId(req, res) {
    try {
        const id = req.query.id;

        switch (req.method) {
            case "GET":
                const data = await queries.getSingleBike(id);
                if (bike.length) {
                    res.status(200).json({ status: 'success', data })
                } else {
                    res.status(404).end(`That bike doens't exist.`)
                }
                break;
            case "POST":
            case "PUT":
                let updatedBike = await queries.updateBike(id, req.body);
                if (updatedBike.length) {
                    res.status(200).json({ status: 'success', data: updatedBike })
                } else {
                    res.status(404).end(`That bike doens't exist.`)
                }
                break;
            case "DELETE":
                let deletedBike = await queries.deleteBike(id);
                if (deletedBike.length) {
                    res.status(200).json({ status: 'success', data: deletedBike })
                } else {
                    res.status(404).end(`That bike doens't exist.`)
                }
                break;
            default:
                res.status(400).end('Unknown Request Method.')
        }
    } catch (error) {
        console.error(error);
        res.status(500).end('[API/Bikes] Server Error.')
    }
}
