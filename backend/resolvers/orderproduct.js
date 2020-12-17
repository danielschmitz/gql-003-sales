const db = require('../database')

module.exports = {
    OrderProduct: {
        async product(parent) {
            const id = parent.product_id
            return await db('products')
                .where({ id })
                .first()
        }
    }
}