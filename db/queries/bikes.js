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

module.exports = {
    getAllBikes,
    getSingleBike,
    addBike,
    updateBike,
    deleteBike
};