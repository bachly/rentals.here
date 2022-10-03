exports.up = function (knex) {
    return knex.schema.createTable('bikes', (table) => {
        table.increments();
        table.string('model').notNullable();
        table.string('color').notNullable();
        table.string('location').notNullable();
        table.boolean('available').notNullable();
    });
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.dropTableIfExists('bikes')
    ]);
};
