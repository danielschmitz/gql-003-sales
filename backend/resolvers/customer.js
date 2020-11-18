const db = require('../database')

module.exports = {
    Query: {
        async customer(_, { id }) {
            return await db('customers')
                .where({ id })
                .first()
        },
        async customers() {
            return await db('customers')
                .orderBy('id')
        }
    },
    Mutation: {
        async createCustomer(_, { customer }) {

            const { 
                contactEmail,
                contactName,
                address } = customer

            const addressResult = await db('addresses')
                .insert(address)
                .returning('id')

            const address_id = addressResult[0]

            const result = await db('customers')
                .insert({
                    contactEmail,
                    contactName,
                    address_id
                })
                .returning('id')

            const id = result[0]

            return await db('customers')
                .where({ id })
                .first()

        },
        async editCustomer(_, { id, customer }) {

            const { 
                contactEmail,
                contactName,
                address } = customer

            const { address_id } = await db('customers')
                .where({ id })
                .select(['address_id'])
                .first()

            await db('addresses')
                .where({ id: address_id })
                .update(address)

            await db('customers')
                .where({ id })
                .update({
                    contactEmail,
                    contactName,
                    address_id
                })

            return await db('customers')
                .where({ id })
                .first()
        },

        async deleteCustomer(_, { id }) {
            const { address_id } = await db('customers')
                .where({ id })
                .select(['address_id'])
                .first()

            await db('addresses')
                .where({ id: address_id })
                .delete()

            await db('customers')
                .where({ id })
                .delete()

            return true
        }

    },
    Customer: {
        async address(parent) {
            const id = parent.address_id
            return await db('addresses')
                .where({ id })
                .first()
        }
    }
}