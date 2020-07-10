const config = require('./configs_push')
const { Router } = require('express')
const jwtUtils = require('../../utils/jwt.utils.js')

const router = new Router({ mergeParams: true })


const notification_options = {
  priority: "high",
  timeToLive: 60 * 60 * 24
};


router.post('/notification', (req, res) => {
  const headerAuth = req.headers['authorization'];
  if(headerAuth==null){
    return res.status(400).json({'error':'wrong token'})
  }

  if (!(jwtUtils.isUserAdmin(req.headers['authorization']) === true)) {
    return res.status(400).json({ 'error': 'not allowed' })
  }
  else{
  const registrationToken = req.body.registrationToken
  const message = req.body.message
  const options = notification_options

  if (message == null && registrationToken == null) {
    res.status(400).json({ 'error': 'missing parameters' })
  }
  if (message == null) {
    res.status(400).json({ 'error': 'missing message' })
  }
  if (registrationToken == null) {
    res.status(400).json({ 'error': 'missing token device' })
  }

  const message_notification = {
    notification: {
      title: message,
    }
  };

  config.admin.messaging().sendToDevice(registrationToken, message_notification, options)
    .then(response => {

      res.status(200).send("Notification sent successfully")

    })
    .catch(error => {
      console.log(error);
    });
  }

})



module.exports = router