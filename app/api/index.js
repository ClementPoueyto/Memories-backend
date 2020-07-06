const { Router } = require('express')
const UsersRouter = require('./users')
const ClientRouter = require('./authentification')
const PostsRouter = require('./posts')
const VersionRouter = require('./version')
const UploadRouter = require('./upload')

const router = new Router()


router.get('/status', (req, res) => res.status(200).json('ok'))

router.use('/users', UsersRouter)

router.use('/auth', ClientRouter)

router.use('/posts', PostsRouter)

router.use('/version', VersionRouter)

router.use('/upload', UploadRouter)


module.exports = router