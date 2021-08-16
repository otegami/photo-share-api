const { ApolloServer } = require(`apollo-server`)

// フィールド
const typeDefs = `
  type Query {
    totalPhotos: Int!
  }

  type Mutation {
    postPhoto(
      name: String!
      description: String
    ): Boolean!
  }
`

// リゾルバ
let photos = []

const resolvers = {
  Query: {
    totalPhotos: () => photos.length
  },
  Mutation: {
    postPhoto(parent, args) {
      photos.push(args)
      return true
    }
  }
}

// 全てのフィールドに対応するリゾルバ関数が必要
const server = new ApolloServer({
  typeDefs,
  resolvers
})

server
  .listen()
  .then(({url}) => console.log(`GraphQL Service running on ${url}`))
