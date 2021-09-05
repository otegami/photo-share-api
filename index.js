import expressPlayground from 'graphql-playground-middleware-express'
const graphQLPlayground = expressPlayground.default

import { ApolloServer } from 'apollo-server-express'
import express from 'express'

import { readFileSync } from 'fs'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

import resolvers from './resolvers/index.js'
const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')

const startApolloServer = async () => {
  const app = express()

  const MONGO_DB = process.env.DB_HOST
  const client = await MongoClient.connect(
    MONGO_DB,
    { useNewUrlParser: true }
  )
  const db = client.db()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const githubToken = req.headers.authorization
      const currentUser = await db.collection('users').findOne({ githubToken })
      return { db, currentUser }
    }
  })

  await server.start()

  server.applyMiddleware({ app })

  app.get(`/`, (req, res) => res.end(`Welcome to the PhotoShare API`))
  app.get(`/playground`, graphQLPlayground({ endpoint: `/graphql` }))

  app.listen({ port: 4000 }, () => {
    console.log(`GraphQL Server running @ http://localhost:4000${server.graphqlPath}`)
  })
}

startApolloServer()
