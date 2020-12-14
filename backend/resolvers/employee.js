const db = require('../database')


module.exports = {
    Query: {
        async employee(_, { id }) {
            return await db('employees')
                .where({ id })
                .first()
        },
        async employees(_, {name}) {
            return await db('employees').where( buidler => {
                if (name) {
                    buidler.where('firstName', 'like', `%${name}%`)
                    buidler.orWhere('lastName', 'like', `%${name}%`)
                }
            }).orderBy('id')
        }
    },
    Mutation: {
        async createEmployee(_, { employee }) {

            const { 
                firstName,
                lastName,
                title,
                birthDate,
                hireDate,
                notes,
                reports_to,
                address } = employee

            const addressResult = await db('addresses')
                .insert(address)
                .returning('id')

            const address_id = addressResult[0]

            const result = await db('employees')
                .insert({
                    firstName,
                    lastName,
                    title,
                    birthDate,
                    hireDate,
                    notes,
                    reports_to,
                    address_id
                })
                .returning('id')

            const id = result[0]

            return await db('employees')
                .where({ id })
                .first()

        },
        async editEmployee(_, { id, employee }) {

            const { 
                firstName,
                lastname,
                title,
                birthDate,
                hireDate,
                notes,
                reports_to,
                address } = employee

            const { address_id } = await db('employees')
                .where({ id })
                .select(['address_id'])
                .first()

            console.log(address_id)

            await db('addresses')
                .where({ id: address_id })
                .update(address)

            await db('employees')
                .where({ id })
                .update({
                    firstName,
                    lastname,
                    title,
                    birthDate,
                    hireDate,
                    notes,
                    reports_to,
                    address_id
                })

            return await db('employees')
                .where({ id })
                .first()
        },

        async deleteEmployee(_, { id }) {
            const { address_id } = await db('employees')
                .where({ id })
                .select(['address_id'])
                .first()

            await db('addresses')
                .where({ id: address_id })
                .delete()

            await db('employees')
                .where({ id })
                .delete()

            return true
        }

    },
    Employee: {
        async reportsTo(parent) {
            const id = parent.reports_to
            return await db('employees')
                .where({ id })
                .first()
        },
        async team(parent) {
            const id = parent.id
            return await db('employees')
                .where({ reports_to: id })
        },
        async address(parent) {
            const id = parent.address_id
            return await db('addresses')
                .where({ id })
                .first()
        }
    }
}