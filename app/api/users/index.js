const { Router } = require('express')
const Notifications = require('./notifications')

const UsersCtrl = require('./UsersCtrl')


const router = new Router()

router.use('/:uid/notifications', Notifications)

//TOKEN User
router.get('/me', UsersCtrl.getUserProfile)

router.put('/me', UsersCtrl.updateUserProfile)

router.put("/follow/:uid", UsersCtrl.followUser)

//Only Admin 
router.get('/', UsersCtrl.getAllUsers)

router.post('/', UsersCtrl.createUser)

router.delete('/:uid', UsersCtrl.deleteUser)

router.put('/:uid', UsersCtrl.updateUser)

//No condition
router.get('/:uid', UsersCtrl.getUser)





module.exports = router