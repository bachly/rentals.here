const queries = require('../../../db/queries/bikes');

export default async function availableBikesOnDate(req, res) {
    try {
        const dateRange = req.query.dateRange;
        const fromDate = dateRange.split('_')[0];
        const toDate = dateRange.split('_')[1];

        switch (req.method) {
            case "GET":
                const bikes = await queries.getAvailableBikesOnADate(fromDate, toDate);
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
