const db = require('../database')


module.exports = {
    Query: {
        async order(_, { id }) {
            return await db('orders')
                .where({ id })
                .first()
        },
        async orders() {
            return await db('orders').orderBy('id')
        }
    },
    Mutation: {

        async createOrder(_, { order }) {

            const {
                orderDate,
                freight,
                customer_id,
                employee_id,
                shipper_id
            } = order;

            let order_id = 0;
            await db.transaction(async trx => {

                const { to } = order

                const addressResult = await trx('addresses')
                    .insert(to)
                    .returning('id')
                const address_id = addressResult[0]

                const resultOrder = await trx('orders')
                    .insert({
                        orderDate,
                        freight,
                        customer_id,
                        employee_id,
                        shipper_id,
                        to: address_id
                    })
                    .returning('id')

                order_id = resultOrder[0]

                const items = order.items.map(item => ({ ...item, order_id }))
            
                await trx('order_product').insert(items)

                // use for insted .forEach to avoid aysnc/await handles
                for (const item of items) {
                    await trx('products')
                        .where({ id: item.product_id })
                        .update({ 'unitsInStock': db.raw(`unitsInStock-${item.quantity}`) })
                }

            });

            return order_id
        },
        async deleteOrder(_, { id }) {
            await db.transaction(async trx => {
                const { to } = await trx('orders')
                    .where({ id })
                    .select(['to'])
                    .first()

                await trx('addresses')
                    .where({ id: to })
                    .delete()

                const items = await trx('order_product')
                    .where({ order_id: id })

                // use for insted .forEach to avoid aysnc/await handles
                for (const item of items) {
                    await trx('products')
                        .where({ id: item.product_id })
                        .update({ 'unitsInStock': db.raw(`unitsInStock+${item.quantity}`) })
                }

                await trx('order_product')
                    .where({ order_id: id })
                    .delete()

                await trx('orders')
                    .where({ id })
                    .delete()

            });
            return true;
        }
    },
    Order: {
        async customer(parent) {
            const id = parent.customer_id
            return await db('customers')
                .where({ id })
                .first()
        },
        async employee(parent) {
            const id = parent.employee_id
            return await db('employees')
                .where({ id })
                .first()
        },
        async shipper(parent) {
            const id = parent.shipper_id
            return await db('shippers')
                .where({ id })
                .first()
        },
        async to(parent) {
            const id = parent.to
            return await db('addresses')
                .where({ id })
                .first()
        },
        async items(parent) {
            const order_id = parent.id
            return await db('order_product')
                .where({ order_id })
        }
    }
}