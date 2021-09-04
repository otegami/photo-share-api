const fetch = require('node-fetch')
const { authorizeWithGithub } = require('../lib')

module.exports = {
  addFakeUsers: async (root, { count }, { db }) => {
    let randomUserApi = `https://randomuser.me/api/?results=${count}`
    console.log(randomUserApi)
    let { results } = await fetch(randomUserApi).then(res => res.json())
    let users = results.map(r => ({
      githubLogin: r.login.username,
      name: `${r.name.first} ${r.name.last}`,
      avatar: r.picture.thumnail,
      githubToken: r.login.sha1
    }))

    await db.collection('users').insertMany(users)

    return users
  },
  fakeUserAuth: async (parent, { githubLogin }, { db }) => {
    let user = await db.collection('users').findOne({ githubLogin })

    if (!user) {
      throw new Error(`Cannot find user with githubLogin ${githubLogin}`)
    }

    return { user, token: user.githubToken }
  },
  postPhoto: async (parent, args, { db, currentUser }) => {
    if (!currentUser) {
      throw new Error('only an authorized user can post a photo')
    }

    let newPhoto = {
      ...args.input,
      userID: currentUser.githubLogin,
      created: new Date()
    }

    const { insertedId } = await db.collection('photos').insertOne(newPhoto)
    newPhoto.id = insertedId

    return newPhoto
  },
  async githubAuth(parent, { code }, { db }) {
    let {
      message,
      access_token,
      avatar_url,
      login,
      name
    } = await authorizeWithGithub({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code
    })

    if (message) {
      throw new Error(message)
    }

    let latestUserInfo = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url
    }

    await db.collection('users').replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true })
    const user = await db.collection('users').findOne({ githubLogin: login })

    return { user, token: access_token }
  }
}
