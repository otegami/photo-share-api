export const me = (parent, args, { currentUser }) => { currentUser }

export const totalPhotos = (parent, args, { db }) => {
  db.collection(`photos`)
    .estimatedDocumentCount()
}

export const allPhotos = (parent, args, { db }) => {
  db.collection(`photos`)
    .find()
    .toArray()
}

export const totalUsers = (parent, args, { db }) => {
  db.collection(`users`)
    .estimatedDocumentCount()
}

export const allUsers = (parent, args, { db }) => {
  db.collection(`users`)
    .find()
    .toArray()
}
