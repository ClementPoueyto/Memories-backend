const { Router } = require('express')
const mongoose = require('mongoose')
const imagePostRouter = require('./posts')
const imageUserRouter = require('./users')
const router = new Router()

router.use('/posts', imagePostRouter)

router.use('/users',imageUserRouter)


module.exports = router;