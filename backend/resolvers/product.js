const db = require('../database')

module.exports = {
    Query: {
        async product(_, { id }) {
            return await db('products').where({ id }).first()
        },
        async products(_, {discontinued}) {
            return await db('products').where( buidler => {
                if (discontinued) {
                    buidler.where({discontinued})
                }
            }).orderBy('id')
        }
    },
    Mutation: {
        async createProduct(_, { product }) {
            const { name, 
                    quantityPerUnit,
                    unitPrice,
                    unitsInStock,
                    discontinued,
                    supplier_id,
                    category_id
            } = product

            if (name === "") throw new Error("Name can't be empty")

            const checkName = await db('products').where({ name }).first()
            if (checkName !== undefined) {
                throw new Error('There is already a product with that name')
            }

            const result = await db('products').insert({
                name, 
                quantityPerUnit,
                unitPrice,
                unitsInStock,
                discontinued,
                supplier_id,
                category_id
            }).returning('id')

            const id = result[0]
            
            return await db('products').where({ id }).first()

        },
        async editProduct(_, { id, product }) {
            const { name, 
                quantityPerUnit,
                unitPrice,
                unitsInStock,
                discontinued,
                supplier_id,
                category_id
            } = product

            if (name === "") throw new Error("Name can't be empty")
            
            const checkName = await db('products')
                .where({ name })
                .whereNot('id', id)
                .first()

            if (checkName !== undefined) {
                throw new Error('There is already a product with that name')
            }

            await db('products').where({ id }).update({
                    name, 
                    quantityPerUnit,
                    unitPrice,
                    unitsInStock,
                    discontinued,
                    supplier_id,
                    category_id
                })
            return await db('products').where({ id }).first()
        },
        async deleteProduct(_, { id }) {
            await db('products').where({ id }).delete()
            return true
        }

    },
    Product: {
        async supplier(parent) {
            const id = parent.supplier_id
            return await db('suppliers')
                .where({ id })
                .first()
        },
        async category(parent) {
            const id = parent.category_id
            return await db('categories')
                .where({ id })
                .first()
        },
    }
}