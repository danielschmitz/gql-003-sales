const db = require('./database')

const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')

module.exports = {
    Query: {
        async login(_, { email, password }) {
            const user = await db('users').where({ email }).first()
            if (!user) {
                throw new Error('No user found with that email')
            }
            const valid = await bcrypt.compare(password, user.password)
            if (!valid) {
                throw new Error('Incorrect password')
            }
            // return json web token
            return jsonwebtoken.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            )
        }
    },
    Mutation: {
        async signup(_, { name, email, password }) {

            const checkUser = await db('users').where({ email }).first()
            
            if (checkUser !== undefined)
                throw new Error('Email exists in database')

            const hash = bcrypt.hashSync(password, 10);

            const result = await db('users').insert({
                name,
                email,
                password: hash
            })
            const id = result[0]
            const user = await db('users').where({ id }).first()
            return jsonwebtoken.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            )
        }
    }
}
