const knex = require('../connection');

function getAllBikes() {
    return knex('bikes')
        .select('*');
}

function getSingleBike(id) {
    return knex('bikes')
        .select('*')
        .where({ id: parseInt(id) });
}

function addBike(bike) {
    return knex('bikes')
        .insert(bike)
        .returning('*');
}

function updateBike(id, bike) {
    return knex('bikes')
        .update(bike)
        .where({ id: parseInt(id) })
        .returning('*');
}

function deleteBike(id) {
    return knex('bikes')
        .del()
        .where({ id: parseInt(id) })
        .returning('*');
}

function getAvailableBikesOnADate(date) {
    return knex('bikes')
        .leftJoin('reservations', 'reservations.bike_id', '=', 'bikes.id')
        .select('bikes.id', 'model', 'color', 'available', 'reserved_from', 'reserved_to')
        .where('reserved_from', '>', date)
        .orWhere('reserved_to', '<', date)
        .orWhereNull('reserved_from')
        .orWhereNull('reserved_to')
        .orderBy('id', 'asc')
}

module.exports = {
    getAllBikes,
    getSingleBike,
    getAvailableBikesOnADate,
    addBike,
    updateBike,
    deleteBike
};