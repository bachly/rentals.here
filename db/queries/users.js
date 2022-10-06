const knex = require('../connection');
const fields = ['id', 'username', 'roles', 'active'];

function getAllUsers() {
    return knex('users')
        .select(...fields);
}

function getSingleUser(id) {
    return knex('users')
        .select(...fields)
        .where({ id: parseInt(id) });
}

function getSingleUserByUsername(username) {
    return knex('users')
        .select(...fields)
        .where({ username });
}

function addUser(user) {
    return knex('users')
        .insert(user)
        .returning(fields);
}

function updateUser(id, user) {
    return knex('users')
        .update(user)
        .where({ id: parseInt(id) })
        .returning(fields);
}

function deleteUser(id) {
    return knex('users')
        .del()
        .where({ id: parseInt(id) })
        .returning(['id', 'username', 'roles', 'active']);
}

function getUsersWithReservations() {
    return knex('users')
        .leftJoin('reservations', 'reservations.user_id', '=', 'users.id')
        .leftJoin('bikes', 'reservations.bike_id', '=', 'bikes.id')
        .select('users.id', 'username', 'bikes.id AS bike_id', 'model', 'color', 'location', 'reserved_from', 'reserved_to')
        .orderBy('users.id')
        .orderBy('reserved_from')
    // .whereNotNull('reserved_from')
    // .count('reserved_from AS num_reservations')
    // .groupBy('users.id', 'username')
}

module.exports = {
    getAllUsers,
    getSingleUser,
    getSingleUserByUsername,
    getUsersWithReservations,
    addUser,
    updateUser,
    deleteUser
};