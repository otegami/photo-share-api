import { me, totalPhotos, allPhotos, totalUsers, allUsers, } from './Query.js'
import { addFakeUsers, fakeUserAuth, postPhoto, githubAuth } from './Mutation.js'
import { Photo, User, DateTime } from './Type.js'

const resolvers = {
  Query: {
    me,
    totalPhotos,
    allPhotos,
    totalUsers,
    allUsers,
  },
  Mutation: {
    addFakeUsers,
    fakeUserAuth,
    postPhoto,
    githubAuth,
  },
  Photo,
  User,
  DateTime,
}

export default resolvers
