const { add } = require('lodash')
const db = require('../database')

module.exports = {
    Query: {
        async supplier(_, { id }) {
            return await db('suppliers')
                .where({ id })
                .first()
        },
        async suppliers() {
            return await db('suppliers')
                .orderBy('id')
        }
    },
    Mutation: {
        async createSupplier(_, { supplier }) {

            const { companyName,
                contactEmail,
                contactName,
                address } = supplier

            const addressResult = await db('addresses')
                .insert(address)
                .returning('id')

            const address_id = addressResult[0]

            const result = await db('suppliers')
                .insert({
                    companyName,
                    contactEmail,
                    contactName,
                    address_id
                })
                .returning('id')

            const id = result[0]

            return await db('suppliers')
                .where({ id })
                .first()

        },
        async editSupplier(_, { id, supplier }) {

            const { companyName,
                contactEmail,
                contactName,
                address } = supplier

            const { address_id } = await db('suppliers')
                .where({ id })
                .select(['address_id'])
                .first()

            await db('addresses')
                .where({ id: address_id })
                .update(address)

            await db('suppliers')
                .where({ id })
                .update({
                    companyName,
                    contactEmail,
                    contactName,
                    address_id
                })

            return await db('suppliers')
                .where({ id })
                .first()
        },

        async deleteSupplier(_, { id }) {
            const { address_id } = await db('suppliers')
                .where({ id })
                .select(['address_id'])
                .first()

            await db('addresses')
                .where({ id: address_id })
                .delete()

            await db('suppliers')
                .where({ id })
                .delete()

            return true
        }

    },
    Supplier: {
        async address(parent) {
            const id = parent.address_id
            return await db('addresses')
                .where({ id })
                .first()
        }
    }
}