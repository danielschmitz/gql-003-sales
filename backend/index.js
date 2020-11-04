//
//Read .env files
//
require('dotenv').config()

const isProduction = process.env.NODE_ENV === 'production'

const express = require('express')
const app = express()

//
//Cors config
//
const cors = require('cors')
const corsOptions = {
    exposedHeaders: 'Authorization'
}
app.use(cors(corsOptions))

//
//BodyParser config
//
const BodyParser = require('body-parser')
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }))

//
//JWT config middleware
//
const jwt = require('express-jwt')
const auth = jwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: true,
    algorithms: ['HS256']
})

// app.get('/', (req, res) => {
//     res.send('Hello World')
// })
app.use('/', express.static(__dirname + '/dist'))


//
// GraphQL imports
//
const { makeExecutableSchema } = require('graphql-tools')
const { importSchema } = require('graphql-import')
const { graphqlHTTP } = require('express-graphql')

//
//GraphQL /api
//
app.use('/api', auth,  graphqlHTTP({
    schema: makeExecutableSchema({
        typeDefs: importSchema('./schema.graphql'),
        resolvers: require('./resolvers')
    }),
    graphiql: !isProduction
}))

//
//graphiql api
//
app.use('/graphiql', graphqlHTTP({
    schema: makeExecutableSchema({
        typeDefs: importSchema('./schema.graphql'),
        resolvers: require('./resolvers')
    }),
    graphiql: !isProduction
}))

//
//GraphQL auth
//
app.use('/auth', graphqlHTTP({
    schema: makeExecutableSchema({
        typeDefs: importSchema('./auth-schema.graphql'),
        resolvers: require('./auth-resolvers')
    }),
    graphiql: !isProduction
}))


const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server started ar port ${port}`)
});