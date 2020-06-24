const { Router } = require('express')
const Notifications = require('./notifications')
const Posts = require('./posts')
const { User } = require('../../models')
const { isUserAdmin } = require('../../utils/jwt.utils')
const UsersCtrl = require('./UsersCtrl')


const router = new Router()

router.use('/:uid/notifications', Notifications)
router.use('/:uid/posts', Posts)

//TOKEN User
router.get('/me', UsersCtrl.getUserProfile)

router.put('/me', UsersCtrl.updateUserProfile)

//Only Admin 
router.get('/', UsersCtrl.getAllUsers)

router.post('/', UsersCtrl.createUser)

router.delete('/:uid', UsersCtrl.deleteUser)

router.put('/:uid', UsersCtrl.updateUser)

//No condition
router.get('/:uid', UsersCtrl.getUser)





module.exports = router