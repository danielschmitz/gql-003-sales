const db = require('./../database')

module.exports = {
  Query: {
      async user (_, { id }) {
          return await db('users').where({ id }).first()
      },
      async users () {
          return await db('users')
      }
  },
  Mutation: {
      async createUser (_, { user }) {
          const { name, email, password } = user
          const checkEmailExists = await db('users').where({ email }).first()
          if (checkEmailExists !== undefined) {
              throw new Error('Email exists in database')
          }

          const result = await db('users').insert({
              name,
              email,
              password
          }).returning('id')
          
          const id = result[0]
          return await db('users').where({ id }).first()

      }
  }
}