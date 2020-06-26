const { Router } = require('express')
const NotifCtrl = require('./notifCtrl')

const router = new Router()

//Token user
router.get("/me", NotifCtrl.getMyNotifs)

//Admin
router.get("/", NotifCtrl.getNotifs)

module.exports = router