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
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        if (userId.length <= 1) {
            return res.status(400).json({
                'error': 'wrong token'
            })
        }
        const id = req.params.id
        if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
            Post.getById(id, (error, post) => {
                if (!post || error) {
                    (!post) ? res.status(400).json({ 'error': 'no post found' }) : res.status(400).json({ 'error': error });
                }
                else {
                    if (post.isPrivate == true&&post.uid!=userId) {
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

    test : function (req,res) {
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        if (userId.length <= 1) {
            return res.status(400).json({
                'error': 'wrong token'
            })
        }

        
    }
,
    createPost: function (req, res) {
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        if (userId.length <= 1) {
            return res.status(400).json({
                'error': 'wrong token'
            })
        }

        const dateServ = Date.now();
        var start = dateServ-86400000;
        var end = dateServ+86400000;

        const title = req.body.title
        const description = req.body.description
        const isPrivate = req.body.isPrivate
        var imageUrl = req.body.imageUrl
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

        if(date <start || date>end){
            return res.status(400).json({'error': 'wrong date'})
        }
        if(imageUrl==null){
            imageUrl="";
        }

        var post = {
            uid: userId,
            title: title,
            likes: [],
            comments: [],
            isPrivate: isPrivate,
            date: date,
            imageUrl : imageUrl
        }

        if (description != null) post = { ...post, description: description }
        if (position != null) post = { ...post, position: position }
        if (adress != null) post = { ...post, adress: adress }


        
       Post.mongooseModel.find({uid:userId,date: {$gte: start, $lt: end}}).then(function(posts){
            if(posts.length>1){
                posts.forEach((post)=>{
                    Post.delete(post.id,(err,res)=>{
                        console.log("deleted")
                    })
                })
            }
            else{
                Post.create(post, (error, post) => {
                    if (error || !post) {
                        error ? res.status(400).json({ 'error': error }) : res.status(500).json({ 'error': "server failed to create post" });
                    }
                    else {
                        res.status(201).json(post)
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

        console.log(updatedPost)

        Post.getById(id, (err, post) => {
            if (err || !post) {
                return err?res.status(500).json({'error': err}):res.status(400).json({ 'error': 'no post found' })
            }
            else {
                if ((jwtUtils.isUserAdmin(headerAuth) === true) || post.uid === userId) {

                    Post.update(id, updatedPost, function (err, post) {

                        if (!post || err) {
                            res.status(400).json({ 'error': err });
                        }
                        else {
                            const toSend = {
                                ...post, _id : id
                            }
                            res.status(200).send(toSend)
                        }
                    })
                }
                else {
                    res.status(404).json({ 'error': 'not allowed' });
                }
            }
        })
    },

    deletePost : function (req, res) {
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        if (userId.length <= 1) {
            return res.status(400).json({
                'error': 'wrong token'
            })
        }
        const id = req.params.id
        if (!(typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/))) {
            return res.status(400).json({ 'error': 'bad id' });
        }

        Post.mongooseModel.findOneAndDelete({ uid : userId,_id: id }).then(function (postsFound) {
            if (postsFound) {
                return res.status(200).send(postsFound)
            }
            else {
                return res.status(400).json({ 'error': 'no post found' })
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
                        if(message==="like"){
                            const notif={
                                idFrom : userId,
                                idTo : post.uid,
                                types : "likes",
                                idRef : idPost.toString()
                            }
                            notifCtrl.addNotifs(notif)
                        }
                        const postToSend = {
                            ...updatedPost, _id : idPost
                        }
                        return res.status(200).json(postToSend);
                    }
                })
            }
        })
    },

    getMyFeed : function (req, res) {
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        if (userId.length <= 1) {
            return res.status(400).json({
                'error': 'wrong token'
            })
        }

        User.mongooseModel.find({followers: userId, isPrivate:false}, (error, users) => {
            var feedPosts =[]
            if (!users || error) {
                (!users) ?  res.status(400).json({ 'error': 'no user found' }) :  res.status(400).json({ 'error': error });
                return 
            }
            else {
                 users.forEach((user)=>{
                    Post.mongooseModel.find({ uid: user._id, isPrivate: false }).then(function (postsFound) {
                        if (postsFound) {
                            postsFound.forEach((element)=>{

                                feedPosts.push(element)
                            })
                        }
                    })
                })

                if(feedPosts.length==0){
                    return res.status(400).json({'error':'no posts'})
                }
                return res.status(200).send(feedPosts)
            }
        })
    }
}