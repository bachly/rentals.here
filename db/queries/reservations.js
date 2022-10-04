const knex = require('../connection');

function getAllReservations() {
    return knex('reservations')
        .select('*');
}

function getBikesReservedByUser(userId) {
    return knex('reservations')
        .leftJoin('bikes', 'reservations.bike_id', '=', 'bikes.id')
        .select('bikes.id', 'model', 'color', 'reservations.active', 'reserved_from', 'reserved_to')
        .where('reservations.user_id', '=', userId)
        .orderBy('reserved_from', 'asc')
}

function addReservation(reservation) {
    return knex('reservations')
        .insert({
            ...reservation,
            active: true
        })
        .returning('*');
}

function updateReservation(id, reservation) {
    return knex('reservations')
        .update(reservation)
        .where({ id: parseInt(id) })
        .returning('*');
}

module.exports = {
    getAllReservations,
    getBikesReservedByUser,
    addReservation,
    updateReservation
};