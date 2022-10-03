module.exports = {

    // development env settings

    development: {
        client: "postgresql",
        debug: true,
        connection: {
            host: "localhost",
            user: "",
            password:
                "",
            database: "BikeRentals_DEV",
            ssl: false,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: __dirname + "/db/migrations",
        },
        seeds: {
            directory: __dirname + "/db/seeds/development",
        },
    },

    // test env settings

    test: {
        client: "postgresql",
        debug: false,
        connection: {
            host: "localhost",
            user: "",
            password:
                "",
            database: "BikeRentals_TEST",
            ssl: false,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: __dirname + "/db/migrations",
        },
        seeds: {
            directory: __dirname + "/db/seeds/test",
        },
    },

    // production env settings

    production: {
        client: "postgresql",
        connection: {
            host: "ec2-34-230-115-172.compute-1.amazonaws.com",
            user: "odyiviucnsulpa",
            password:
                "c5866556275794ebd8970d68f761acc70366c0cafdb5a1a7329bbbd16ce2b338",
            database: "d2fi2d0muni6jb",
            ssl: { rejectUnauthorized: false },
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: __dirname + "/db/migrations",
        },
        seeds: {
            directory: __dirname + "/db/seeds/production",
        },
    }
};