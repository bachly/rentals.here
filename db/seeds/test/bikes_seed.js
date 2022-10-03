
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('bikes').del()
    .then(function () {
      // Inserts seed entries
      return knex('bikes').insert([

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
    });
};
