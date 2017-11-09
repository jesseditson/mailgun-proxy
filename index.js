const config = { domains: '*' }
try {
  config = require('config')
} catch (e) {}

module.exports = require('./proxy')(config)