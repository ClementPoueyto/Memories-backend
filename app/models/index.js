const User = require('./user.model.js')
const Notif = require('./notification.model.js')
const Post = require('./post.model.js')
const Comment = require('./comment.model.js')
const Client = require('./client.model.js')
const imagePost= require('./imagePost.model.js')
const imageUser = require('./imageUser.model.js')

module.exports = {
    User,
    Notif,
    Post,
    Comment,
    Client,
    imagePost,
    imageUser
}
