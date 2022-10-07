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

/**
 * 
 *  Yes:     date  [reseved_from ... reserved_to]
 *   No:           [reseved_from ... date ... reserved_to]
 *  Yes:           [reseved_from ... reserved_to]            date
 * @param {*} date 
 * @returns 
 */
async function getAvailableBikesOnADate(date) {
    // console.log("date", date);

    const reservedBikesOnDate = await knex('bikes')
        .leftJoin('reservations', 'reservations.bike_id', '=', 'bikes.id')
        .pluck('bikes.id')
        .where('reserved_from', '<=', date)
        .andWhere('reserved_to', '>=', date)
        .andWhere('reservations.active', '=', true);

    // console.log("reservedBikesOnDate", reservedBikesOnDate);

    const bikesExcluded = await knex('bikes').select('*')
        .where('active', '=', true)
        .whereNotIn('id', reservedBikesOnDate)
        .orderBy('bikes.id')

    // console.log("bikesExcluded", bikesExcluded);

    return bikesExcluded;
}

module.exports = {
    getAllBikes,
    getSingleBike,
    getAvailableBikesOnADate,
    addBike,
    updateBike,
    deleteBike
};