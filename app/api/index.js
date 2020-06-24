const { Router } = require('express')
const UsersRouter = require('./users')
const ClientRouter = require('./authentification')

const { User } = require('../models')

const router = new Router()


router.get('/status', (req, res) => res.status(200).json('ok'))

router.use('/users', UsersRouter)
router.use('/auth', ClientRouter)


module.exports = router