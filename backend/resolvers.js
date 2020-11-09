
const lodash = require('lodash')
const users = require('./resolvers/user')
const categories = require('./resolvers/category')
const suppliers = require('./resolvers/supplier')

module.exports = lodash.merge(
                        users,
                        categories,
                        suppliers
                        )