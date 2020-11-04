
const lodash = require('lodash')
const users = require('./resolvers/user')
const categories = require('./resolvers/category')

module.exports = lodash.merge(
                        users,
                        categories
                        )