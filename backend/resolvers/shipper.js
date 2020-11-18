const db = require('../database')

module.exports = {
    Query: {
        async shipper(_, { id }) {
            return await db('shippers')
                .where({ id })
                .first()
        },
        async shippers() {
            return await db('shippers')
                .orderBy('id')
        }
    },
    Mutation: {
        async createShipper(_, { shipper }) {

            const { companyName,
                contactEmail,
                contactName,
                address } = shipper

            const addressResult = await db('addresses')
                .insert(address)
                .returning('id')

            const address_id = addressResult[0]

            const result = await db('shippers')
                .insert({
                    companyName,
                    contactEmail,
                    contactName,
                    address_id
                })
                .returning('id')

            const id = result[0]

            return await db('shippers')
                .where({ id })
                .first()

        },
        async editShipper(_, { id, shipper }) {

            const { companyName,
                contactEmail,
                contactName,
                address } = shipper

            const { address_id } = await db('shippers')
                .where({ id })
                .select(['address_id'])
                .first()

            await db('addresses')
                .where({ id: address_id })
                .update(address)

            await db('shippers')
                .where({ id })
                .update({
                    companyName,
                    contactEmail,
                    contactName,
                    address_id
                })

            return await db('shippers')
                .where({ id })
                .first()
        },

        async deleteShipper(_, { id }) {
            const { address_id } = await db('shippers')
                .where({ id })
                .select(['address_id'])
                .first()

            await db('addresses')
                .where({ id: address_id })
                .delete()

            await db('shippers')
                .where({ id })
                .delete()

            return true
        }

    },
    Shipper: {
        async address(parent) {
            const id = parent.address_id
            return await db('addresses')
                .where({ id })
                .first()
        }
    }
}