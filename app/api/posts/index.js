const { Router } = require('express')
const { Post } = require('../../models')
const postsCtrl = require('./postsCtrl')
const Comment = require('./comments')


const router = new Router()

router.use('/:id/comments', Comment)


//TOKEN
router.get('/myPosts', postsCtrl.getMyPosts)

router.post('/', postsCtrl.createPost)

router.put('/:id', postsCtrl.updatePost)

router.put("/:id/like" , postsCtrl.likePost)

//Admin
router.get("/", postsCtrl.getAllPosts)

//No condition
router.get("/postsFrom/:uid", postsCtrl.getPostsFromUid)

router.get("/:id", postsCtrl.getPost)



module.exports = router