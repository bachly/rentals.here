exports.up = async function (knex) {
    await knex.schema.createTable('bikes', (table) => {
        table.increments();
        table.string('model').notNullable();
        table.string('color').notNullable();
        table.string('location').notNullable();
        table.boolean('active').notNullable();
    });

    await knex.schema.createTable('users', (table) => {
        table.increments();
        table.string('username').notNullable();
        table.string('password').notNullable();
        table.json('roles').notNullable();
        table.boolean('active').notNullable();
    });

    return await knex.schema.createTable('reservations', (table) => {
        table.increments();
        table.integer('user_id').references('id').inTable('users').onDelete('SET NULL');
        table.integer('bike_id').references('id').inTable('bikes').onDelete('SET NULL');
        table.datetime('reserved_from').notNullable();
        table.datetime('reserved_to').notNullable();
        table.boolean('active').notNullable();
    });
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.dropTableIfExists('reservations'),
        knex.schema.dropTableIfExists('bikes'),
        knex.schema.dropTableIfExists('users')
    ]);
};
