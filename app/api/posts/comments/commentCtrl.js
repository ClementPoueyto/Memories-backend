const jwtUtils = require('../../../utils/jwt.utils.js')
const { Comment, Post } = require('../../../models');
const { addNotifs } = require('../../users/notifications/notifCtrl.js');
const notifCtrl = require('../../users/notifications/notifCtrl.js');

module.exports = {
    getComments: function (req, res) {

    },

    createComment: function (req, res) {
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
        const textComment = req.body.textComment

        const date = req.body.date
        if (date == null && textComment == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        if (textComment && (textComment.length > 100 || textComment.length < 1)) {
            return res.status(400).json({ 'error': 'wrong comment (must be length 1 - 100)' })
        }

        const idComment = Date.now().toString()

        const comment = {
            _id: idComment,
            uid: userId,
            textComment: textComment,
            date: date,
        }
        const { error } = Comment.schema.validate(comment)
        if (error) return res.status(400).json({ 'error': `Create Error : Object ${JSON.stringify(comment)} does not match schema of model ${Comment.name}` })

        Post.getById(idPost, (err, post) => {
            if (err || !post) {
                err ? res.status(400).json({ 'error': err }) : res.status(500).json({ 'error': "server failed to get post" });
            }
            else {
                let comments = post.comments
                comments.push(comment)
                Post.update(idPost, { comments: comments }, (error, updated) => {
                    if (error || !updated) {
                        error ? res.status(400).json({ 'error': error }) : res.status(500).json({ 'error': "server failed to update post" });
                    }
                    else {
                        if (post.uid != userId) {
                            const notif = {
                                idFrom: userId,
                                idTo: post.uid,
                                types: "comment",
                                idRef: idPost.toString()
                            }
                            addNotifs(notif)
                        }

                        res.status(201).send(comment)
                    }
                })
            }
        })


    },
    deleteComment: function (req, res) {
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);
        if (userId.length <= 1) {
            return res.status(400).json({
                'error': 'wrong token'
            })
        }
        const idPost = req.params.id
        if (!(typeof idPost === 'string' && idPost.match(/^[0-9a-fA-F]{24}$/))) {
            return res.status(400).json({ 'error': 'bad post id' });
        }
        const idComm = req.params.commId


        Post.getById(idPost, (err, post) => {
            if (err || !post) {
                err ? res.status(400).json({ 'error': err }) : res.status(500).json({ 'error': "server failed to get post" });
            }
            else {
                if (post.uid != userId) {
                    return res.status(400).json({ 'error': "not allowed" })
                }
                let comments = post.comments
                const commToDelete = comments.find(element => element._id === idComm)
                if (!commToDelete) {
                    return res.status(400).json({ 'error': "no comment" })
                }
                comments.splice(comments.indexOf(commToDelete), 1)
                Post.update(idPost, { comments: comments }, (error, updated) => {
                    if (error || !updated) {
                        error ? res.status(400).json({ 'error': error }) : res.status(500).json({ 'error': "server failed to update post" });
                    }
                    else {
                        res.status(201).send(commToDelete)
                    }
                })
            }
        })
    }
}