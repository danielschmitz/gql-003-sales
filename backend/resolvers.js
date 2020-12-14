
const lodash = require('lodash')
const users = require('./resolvers/user')
const categories = require('./resolvers/category')
const suppliers = require('./resolvers/supplier')
const customers = require('./resolvers/customer')
const shippers = require('./resolvers/shipper')
const employees = require('./resolvers/employee')
const products = require('./resolvers/product')

module.exports = lodash.merge(
                        users,
                        categories,
                        suppliers,
                        customers,
                        shippers,
                        employees,
                        products
                        )