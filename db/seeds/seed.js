
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('reservations').del();
  await knex('bikes').del();
  await knex('users').del();

  await knex('bikes').insert([

    // ==== PARK ENTRANCE ====

    // kid bikes
    { model: 'Kid Bike', color: 'black', location: 'Park Entrance', active: true },
    { model: 'Kid Bike', color: 'white', location: 'Park Entrance', active: true },

    // adult bikes
    { model: 'Adult Bike', color: 'black', location: 'Park Entrance', active: true },
    { model: 'Adult Bike', color: 'white', location: 'Park Entrance', active: true },

    // ==== PICNIC AREAS ====

    // kid bikes
    { model: 'Kid Bike', color: 'black', location: 'Picnic Area', active: true },
    { model: 'Kid Bike', color: 'white', location: 'Picnic Area', active: true },

    // adult bikes - not available for rent
    { model: 'Mountain Bike', color: 'black', location: 'Picnic Area', active: false },
    { model: 'Mountain Bike', color: 'white', location: 'Picnic Area', active: false },
  ]);

  await knex('users').insert([
    { username: 'user1', password: '1234', roles: '', active: true },
    { username: 'user2', password: '1234', roles: '', active: true },
    { username: 'user3', password: '1234', roles: '', active: true },
    { username: 'user4', password: '1234', roles: '', active: false },
    { username: 'admin', password: '1234', roles: 'manager', active: true },
  ])

  const allUsers = await knex('users').select('*').where('active', '=', true).orderBy('id', 'asc');
  const allBikes = await knex('bikes').select('*').where('active', '=', true).orderBy('id', 'asc');
  const user1 = allUsers[0];
  const user2 = allUsers[1];
  const user3 = allUsers[2];
  const b1 = allBikes[0];
  const b2 = allBikes[1];
  const b3 = allBikes[2];
  const b4 = allBikes[3];
  const b5 = allBikes[4];
  const b6 = allBikes[5];

  return await knex('reservations').insert([
    /***
     * Reservation tables
     * 
     *  Date     04 05 06 07 08 09 10 11  Reservations
     * User1     b1 b1    b1 b1           (2)
     * User2        b2 b2 b2 b2 b2 b2     (1)
     * User3           b3 b3 b3 b3        (1)     
     * User3           b4 b4 b4 b4 b4     (1)
     * User3           b5 b5 b5    b5     (2)
     * User3           b6 b6 b6*   b5     (3) *Cancelled          
     *    b1     x  x     x  x   
     *    b2        x  x  x  x  x  x
     * b3-b6           x  x  x
     * Remain:   5  4  1  0  1  3  2  6
     */
    // user1 reservations
    { user_id: user1.id, bike_id: b1.id, reserved_from: '2022-10-04T00:00:00+11', reserved_to: '2022-10-05T23:00:00+11', active: true },
    { user_id: user1.id, bike_id: b1.id, reserved_from: '2022-10-07T00:00:00+11', reserved_to: '2022-10-08T23:00:00+11', active: true },
    // user2 reservation
    { user_id: user2.id, bike_id: b2.id, reserved_from: '2022-10-05T00:00:00+11', reserved_to: '2022-10-10T23:00:00+11', active: true },
    // user3 reservations
    { user_id: user3.id, bike_id: b3.id, reserved_from: '2022-10-06T00:00:00+11', reserved_to: '2022-10-09T23:00:00+11', active: true },
    { user_id: user3.id, bike_id: b4.id, reserved_from: '2022-10-06T00:00:00+11', reserved_to: '2022-10-10T23:00:00+11', active: true },
    { user_id: user3.id, bike_id: b5.id, reserved_from: '2022-10-06T00:00:00+11', reserved_to: '2022-10-08T23:00:00+11', active: true },
    { user_id: user3.id, bike_id: b5.id, reserved_from: '2022-10-10T00:00:00+11', reserved_to: '2022-10-10T23:00:00+11', active: true },
    { user_id: user3.id, bike_id: b6.id, reserved_from: '2022-10-06T00:00:00+11', reserved_to: '2022-10-07T23:00:00+11', active: true },
    { user_id: user3.id, bike_id: b6.id, reserved_from: '2022-10-08T00:00:00+11', reserved_to: '2022-10-08T23:00:00+11', active: false },
    { user_id: user3.id, bike_id: b6.id, reserved_from: '2022-10-10T00:00:00+11', reserved_to: '2022-10-10T23:00:00+11', active: true },
  ])
};
