// module.exports.knex = function (environment) {
//   var config = require("../knexfile.js")[environment];
//   return require("knex")(config);
// };

const environment = process.env.NODE_ENV || 'development';
const config = require('../knexfile.js')[environment];

module.exports = require('knex')(config);