
const lodash = require('lodash')
const users = require('./resolvers/user')
const categories = require('./resolvers/category')
const suppliers = require('./resolvers/supplier')
const customers = require('./resolvers/customer')
const shippers = require('./resolvers/shipper')
const employees = require('./resolvers/employee')
const products = require('./resolvers/product')
const orders = require('./resolvers/order')
const orderproduct = require('./resolvers/orderproduct')

module.exports = lodash.merge(
                        users,
                        categories,
                        suppliers,
                        customers,
                        shippers,
                        employees,
                        products,
                        orders,
                        orderproduct
                        )