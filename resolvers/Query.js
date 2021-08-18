module.exports = {
  totalPhotos: () => photos.length,
  allPhotos: (parent, args) => {
    args.after
    return photos
  }
}
