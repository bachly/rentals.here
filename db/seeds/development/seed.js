
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('reservations').del();
  await knex('bikes').del();
  await knex('users').del();

  await knex('bikes').insert([

    // ==== PARK ENTRANCE ====

    // mountain bikes
    { model: 'Mountain Bike', color: 'black', location: 'Park Entrance', available: true },
    { model: 'Mountain Bike', color: 'white', location: 'Park Entrance', available: true },
    { model: 'Mountain Bike', color: 'blue', location: 'Park Entrance', available: true },
    { model: 'Mountain Bike', color: 'red', location: 'Park Entrance', available: true },

    // commuter bikes
    { model: 'Commuter Bike', color: 'black', location: 'Park Entrance', available: true },
    { model: 'Commuter Bike', color: 'white', location: 'Park Entrance', available: true },
    { model: 'Commuter Bike', color: 'blue', location: 'Park Entrance', available: false },
    { model: 'Commuter Bike', color: 'red', location: 'Park Entrance', available: false },

    // kid bikes
    { model: 'Kid Bike', color: 'black', location: 'Park Entrance', available: false },
    { model: 'Kid Bike', color: 'white', location: 'Park Entrance', available: true },
    { model: 'Kid Bike', color: 'blue', location: 'Park Entrance', available: true },
    { model: 'Kid Bike', color: 'red', location: 'Park Entrance', available: true },

    // bmx bikes
    { model: 'BMX Bike', color: 'black', location: 'Park Entrance', available: true },
    { model: 'BMX Bike', color: 'white', location: 'Park Entrance', available: true },
    { model: 'BMX Bike', color: 'blue', location: 'Park Entrance', available: false },
    { model: 'BMX Bike', color: 'red', location: 'Park Entrance', available: true },

    // electric bikes
    { model: 'Electric Bike', color: 'black', location: 'Park Entrance', available: true },
    { model: 'Electric Bike', color: 'white', location: 'Park Entrance', available: true },
    { model: 'Electric Bike', color: 'blue', location: 'Park Entrance', available: false },
    { model: 'Electric Bike', color: 'red', location: 'Park Entrance', available: true },


    // ==== PICNIC AREAS ====

    // mountain bikes
    { model: 'Mountain Bike', color: 'black', location: 'Picnic Area', available: false },
    { model: 'Mountain Bike', color: 'white', location: 'Picnic Area', available: false },
    { model: 'Mountain Bike', color: 'blue', location: 'Picnic Area', available: true },
    { model: 'Mountain Bike', color: 'red', location: 'Picnic Area', available: true },

    // commuter bikes
    { model: 'Commuter Bike', color: 'black', location: 'Picnic Area', available: true },
    { model: 'Commuter Bike', color: 'white', location: 'Picnic Area', available: true },
    { model: 'Commuter Bike', color: 'blue', location: 'Picnic Area', available: true },
    { model: 'Commuter Bike', color: 'red', location: 'Picnic Area', available: true },

    // kid bikes
    { model: 'Kid Bike', color: 'black', location: 'Picnic Area', available: true },
    { model: 'Kid Bike', color: 'white', location: 'Picnic Area', available: true },
    { model: 'Kid Bike', color: 'blue', location: 'Picnic Area', available: true },
    { model: 'Kid Bike', color: 'red', location: 'Picnic Area', available: false },

    // bmx bikes
    { model: 'BMX Bike', color: 'black', location: 'Picnic Area', available: false },
    { model: 'BMX Bike', color: 'white', location: 'Picnic Area', available: true },
    { model: 'BMX Bike', color: 'blue', location: 'Picnic Area', available: false },
    { model: 'BMX Bike', color: 'red', location: 'Picnic Area', available: true },

    // electric bikes
    { model: 'Electric Bike', color: 'black', location: 'Picnic Area', available: false },
    { model: 'Electric Bike', color: 'white', location: 'Picnic Area', available: true },
    { model: 'Electric Bike', color: 'blue', location: 'Picnic Area', available: true },
    { model: 'Electric Bike', color: 'red', location: 'Picnic Area', available: true },
  ]);

  await knex('users').insert([
    { username: 'user1@test.com', password: 'user1', roles: JSON.stringify([]), active: true },
    { username: 'user2@test.com', password: 'user2', roles: JSON.stringify([]), active: true },
    { username: 'user3@test.com', password: 'user3', roles: JSON.stringify([]), active: false },
    { username: 'user4test.com', password: 'user4', roles: JSON.stringify(['manager']), active: true },
    { username: 'user5@test.com', password: 'user5', roles: JSON.stringify(['manager']), active: true },
  ])

  const user1 = await knex('users').select('*').first();
  const bike1 = await knex('bikes').select('*').first();

  return await knex('reservations').insert([
    { user_id: user1.id, bike_id: bike1.id, reserved_from: '2022-10-01 08:00:00+11', reserved_to: '2022-10-01 12:00:00+11', active: true }
  ])
};
