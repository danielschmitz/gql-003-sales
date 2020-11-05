const db = require('../database')

module.exports = {
    Query: {
        async category(_, { id }) {
            return await db('categories').where({ id }).first()
        },
        async categories() {
            return await db('categories').orderBy('id')
        }
    },
    Mutation: {
        async createCategory(_, { category }) {
            const { name, description } = category

            if (name === "") throw new Error("Name can't be empty")

            const checkName = await db('categories').where({ name }).first()
            if (checkName !== undefined) {
                throw new Error('There is already a category with that name')
            }

            const result = await db('categories').insert({
                name,
                description
            })
            const id = result[0]
            console.log("id", id)
            console.log("result",result)
            return await db('categories').where({ id }).first()

        },
        async editCategory(_, { id, category }) {
            const { name, description } = category

            if (name === "") throw new Error("Name can't be empty")
            
            const checkName = await db('categories').where({ name }).whereNot('id', id).first()
            if (checkName !== undefined) {
                throw new Error('There is already a category with that name')
            }
            await db('categories').where({ id }).update({ name, description })
            return await db('categories').where({ id }).first()
        },
        async deleteCategory(_, { id }) {
            await db('categories').where({ id }).delete()
            return true
        }

    }
}