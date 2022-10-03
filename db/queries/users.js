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

module.exports = {
    getAllUsers,
    getSingleUser,
    addUser,
    updateUser,
    deleteUser
};