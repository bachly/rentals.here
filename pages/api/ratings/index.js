const queries = require('../../../db/queries/ratings');

export default async function ratings(req, res) {
    try {
        switch (req.method) {
            case "GET":
                const data = await queries.getAverageRatingsForAllBikes();
                res.status(200).json({ status: "success", data });
                break;
            case "POST":
                const rating = await queries.addRating({
                    ...req.body
                });
                if (rating.length) {
                    res.status(200).json({ status: 'success', data: rating })
                } else {
                    res.status(400).end('Error adding rating.')
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
