const knex = require('../connection');

function getAllRatings() {
    return knex('ratings')
        .select('*');
}

function getAverageRatingsForAllBikes(userId) {
    return knex('ratings')
        .leftJoin('reservations', 'ratings.reservation_id', '=', 'reservations.id')
        .leftJoin('bikes', 'reservations.bike_id', '=', 'bikes.id')
        .select('bikes.id AS bike_id', knex.raw('ROUND(AVG(rating),2) AS avg_rating'))
        .groupBy('bikes.id')
        .orderBy('bike_id', 'asc')
}

function addRating(rating) {
    return knex('ratings')
        .insert(rating)
        .returning('*');
}

function updateRating(id, rating) {
    return knex('ratings')
        .update(rating)
        .where({ id: parseInt(id) })
        .returning('*');
}

function deleteRating(id) {
    return knex('ratings')
        .del()
        .where({ id: parseInt(id) })
        .returning('*');
}

module.exports = {
    getAllRatings,
    getAverageRatingsForAllBikes,
    addRating,
    updateRating,
    deleteRating
};