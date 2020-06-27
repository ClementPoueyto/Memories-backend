const { Router } = require('express')
const Notifications = require('./notifications')
const {  User } = require('../../models')
const JSONStream = require('JSONStream')
const UsersCtrl = require('./UsersCtrl')


const router = new Router()

router.use('/notifs', Notifications)

//TOKEN User
router.get('/me', UsersCtrl.getUserProfile)

router.get('/myFollowers', UsersCtrl.getMyFollowers)

router.get('/myFollowing', UsersCtrl.getMyFollowing)

router.get('/search/:pseudo', UsersCtrl.searchUser)

router.get('/test', (req, res) => {
    User.mongooseModel
    .watch()
    .on('change', data => console.log(new Date(), data));
  })

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