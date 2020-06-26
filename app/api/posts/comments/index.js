const { Router } = require('express')
const { Comment } = require('../../../models')
const commentCtrl = require('./commentCtrl')


const router = new Router({mergeParams: true})

router.get("/", commentCtrl.getComments)

router.post("/", commentCtrl.createComment)

router.delete("/:commId", commentCtrl.deleteComment)


module.exports = router