const bcrypt = require('bcrypt')
const jwtUtils = require('../../utils/jwt.utils.js')
const { Post, User } = require('../../models')
const notifCtrl = require('../users/notifications/notifCtrl.js')

module.exports = {
    getAllPosts: function (req, res) {
        if (jwtUtils.isUserAdmin(req.headers['authorization']) === true) {
            Post.get((err, posts) => {
                if (posts) {
                    res.status(200).json(posts)
                }
                else {
                    res.status(400).json({ 'error': 'no posts found' });
                }
            })
        }
        else {
            res.status(404).json({ 'error': 'not allowed' });
        }
    },

    getPost: function (req, res) {
        const id = req.params.id
        if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
            Post.getById(id, (error, post) => {
                if (!post || error) {
                    (!post) ? res.status(400).json({ 'error': 'no post found' }) : res.status(400).json({ 'error': error });
                }
                else {
                    if (post.isPrivate == true) {
                        return res.status(400).json({ 'error': 'post is private' })
                    }
                    else {
                        res.status(200).send(post)
                    }
                }
            })
        }
        else {
            res.status(400).json({ 'error': 'bad id' });
        }
    },

    createPost: function (req, res) {
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        if (userId.length <= 1) {
            return res.status(400).json({
                'error': 'wrong token'
            })
        }

        const title = req.body.title
        const description = req.body.description
        const isPrivate = req.body.isPrivate
        const imageUrl = req.body.imageUrl
        const position = req.body.position
        const adress = req.body.adress
        const date = req.body.date

        if (title == null || isPrivate == null || date == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        if ((title.length > 50 || title.length < 1)) {
            return res.status(400).json({ 'error': 'wrong title (must be length 1 - 50)' })
        }

        if (description && (description.length > 500)) {
            return res.status(400).json({ 'error': 'wrong description (must be length max 500)' })
        }
        if (position && (position.latitude == null || position.longitude == null)) {
            return res.status(400).json({ 'error': 'wrong coordinates ' })
        }

        if (adress && (adress.length > 100)) {
            return res.status(400).json({ 'error': 'wrong adress (must be length max 100)' })
        }

        var post = {
            uid: userId,
            title: title,
            likes: [],
            comments: [],
            isPrivate: isPrivate,
            date: date
        }

        if (description != null) post = { ...post, description: description }
        if (position != null) post = { ...post, position: position }
        if (imageUrl != null) post = { ...post, imageUrl: imageUrl }
        if (adress != null) post = { ...post, adress: adress }

        Post.create(post, (error, post) => {
            if (error || !post) {
                error ? res.status(400).json({ 'error': error }) : res.status(500).json({ 'error': "server failed to create post" });
            }
            else {
                User.getById(userId, (err, user) => {
                    if (error || !user) {
                        error ? res.status(400).json({ 'error': error }) : res.status(500).json({ 'error': "server failed to update user" });
                    }
                    else {
                        var postArray = user.posts
                        postArray.push(post._id)
                        User.update(userId, { posts: postArray }, (error, user) => {
                            if (error || !user) {
                                error ? res.status(400).json({ 'error': error }) : res.status(500).json({ 'error': "server failed to update user" });
                            }
                            else {
                                res.status(201).json(post)
                            }
                        })
                    }
                })

            }
        })
    },
    updatePost: function (req, res) {
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);
        const id = req.params.id
        if (!(typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/))) {
            return res.status(400).json({ 'error': 'bad id' });
        }
        const title = req.body.title
        const description = req.body.description
        const isPrivate = req.body.isPrivate
        const imageUrl = req.body.imageUrl
        const position = req.body.position
        const adress = req.body.adress

        if (title == null && isPrivate == null && description == null && imageUrl == null && position == null && adress == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        if (title && (title.length > 50 || title.length < 1)) {
            return res.status(400).json({ 'error': 'wrong title (must be length 1 - 50)' })
        }

        if (description && (description.length > 500)) {
            return res.status(400).json({ 'error': 'wrong description (must be length max 500)' })
        }
        if (position && (position.latitude == null || position.longitude == null)) {
            return res.status(400).json({ 'error': 'wrong coordinates ' })
        }

        if (adress && (adress.length > 100)) {
            return res.status(400).json({ 'error': 'wrong adress (must be length max 100)' })
        }

        var updatedPost = {}
        if (title != null) updatedPost = { ...updatedPost, title: title }
        if (description != null) updatedPost = { ...updatedPost, description: description }
        if (position != null) updatedPost = { ...updatedPost, position: position }
        if (imageUrl != null) updatedPost = { ...updatedPost, imageUrl: imageUrl }
        if (adress != null) updatedPost = { ...updatedPost, adress: adress }
        if (isPrivate != null) updatedPost = { ...updatedPost, isPrivate: isPrivate }


        Post.getById(id, (err, post) => {
            if (err || !post) {
                return res.status(400).json({ 'error': 'no post found' })
            }
            else {
                if ((jwtUtils.isUserAdmin(headerAuth) === true) || post.uid === userId) {

                    Post.update(id, updatedPost, function (err, post) {

                        if (!post || err) {
                            res.status(400).json({ 'error': err });
                        }
                        else {
                            res.status(200).send(post)
                        }
                    })
                }
                else {
                    res.status(404).json({ 'error': 'not allowed' });
                }
            }
        })
    },

    getMyPosts: function (req, res) {
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        if (userId.length <= 1) {
            return res.status(400).json({
                'error': 'wrong token'
            })
        }

        Post.mongooseModel.find({ uid: userId }).then(function (postsFound) {
            if (postsFound) {
                return res.status(200).send(postsFound)
            }
            else {
                return res.status(400).json({ 'error': 'no post found' })
            }
        })
    },

    getPostsFromUid: function (req, res) {   
        const id = req.params.uid
        if (!(typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/))) {
            return res.status(400).json({ 'error': 'bad id' });
        }
        Post.mongooseModel.find({ uid: id, isPrivate : false}).then(function (postsFound) {
            if (postsFound) {
                return res.status(200).send(postsFound)
            }
            else {
                return res.status(400).json({ 'error': 'no post found' })
            }
        })
    },

    //TODO ADD NOTIFS
    likePost : function (req, res) {
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);
        if (userId.length <= 1) {
            return res.status(400).json({
                'error': 'wrong token'
            })
        }
        const idPost = req.params.id
        if (!(typeof idPost === 'string' && idPost.match(/^[0-9a-fA-F]{24}$/))) {
            return res.status(400).json({ 'error': 'bad id' });
        }

        Post.getById(idPost, (err, post)=>{
            if(err || !post){
                return res.status(400).json({ 'error': 'no post found' });
            }
            else{
                let likes = post.likes
                const index = likes.indexOf(userId)
                const messsage =""
                if(index!=-1){
                    //dislike
                    likes.splice(index, 1)
                    message = "dislike"
                }
                else{
                    //like
                    likes.push(userId)
                    message = "like"
                }
                Post.update(idPost, {likes : likes}, (err, updatedPost)=>{
                    if(err || !updatedPost){
                        return res.status(500).json({ 'error': 'server failed to update post' });
                    }
                    else{
                        const notif={
                            idFrom : userId,
                            idTo : post.uid,
                            types : "likes"
                        }
                        notifCtrl.addNotifs(notif)
                        return res.status(200).json({"success": message});
                    }
                })
            }
        })
    }
}