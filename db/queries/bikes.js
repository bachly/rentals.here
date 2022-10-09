const { endOfDay, startOfDay } = require('date-fns');
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
 *  fromDate-toDate  [reseved_from ...                 ... reserved_to]                   => Available
 *  fromDate         [reseved_from ... toDate          ... reserved_to]                   => Reserved
 *  fromDate         [reseved_from ...                 ... reserved_to] toDate            => Reserved
 *                   [reseved_from ... fromDate-toDate ... reserved_to]                   => Reserved
 *                   [reseved_from ...        fromDate ... reserved_to] toDate            => Reserved
 *                   [reseved_from ...                 ... reserved_to] fromDate-toDate   => Available
 * 
 * @param {*} date 
 * @returns 
 */
async function getAvailableBikesOnADate(fromDate, toDate) {
    // console.log("date range", fromDate, toDate);

    const reservedBikesOnDate = await knex('bikes')
        .leftJoin('reservations', 'reservations.bike_id', '=', 'bikes.id')
        .pluck('bikes.id')
        .where(function () {
            this.where('reserved_from', '<=', toDate)  
                .andWhere('reserved_to', '>=', fromDate)
        })
        .andWhere('reservations.active', '=', true);

    console.log("reservedBikesOnDate", reservedBikesOnDate);

    const bikesExcluded = await knex('bikes').select('*')
        .where('active', '=', true)
        .whereNotIn('id', reservedBikesOnDate)
        .orderBy('bikes.id')

    console.log("bikesExcluded", bikesExcluded);

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