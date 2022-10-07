const queries = require('../../../db/queries/users');

export default async function usersWithId(req, res) {
    try {
        const id = req.query.id;

        switch (req.method) {
            case "GET":
                const data = await queries.getSingleUser(id);
                if (user.length) {
                    res.status(200).json({ status: 'success', data })
                } else {
                    res.status(404).end(`That user doens't exist.`)
                }
                break;
            case "POST":
            case "PUT":
                let updatedUser = await queries.updateUser(id, req.body);
                if (updatedUser.length) {
                    res.status(200).json({ status: 'success', data: updatedUser })
                } else {
                    res.status(404).end(`That user doens't exist.`)
                }
                break;
            case "DELETE":
                let deletedUser = await queries.deleteUser(id);
                if (deletedUser.length) {
                    res.status(200).json({ status: 'success', data: deletedUser })
                } else {
                    res.status(404).end(`That user doens't exist.`)
                }
                break;
            default:
                res.status(400).end('Unknown Request Method.')
        }
    } catch (error) {
        console.error(error);
        res.status(500).end('[API/Users] Server Error.')
    }
}
