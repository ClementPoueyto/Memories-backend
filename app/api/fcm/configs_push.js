var admin = require("firebase-admin");

var serviceAccount = require("./memories-2721a-firebase-adminsdk-hvl01-03105e51c5.json");
const { Client } = require("../../models");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://memories-2721a.firebaseio.com"
});


module.exports = {
  admin,

  sendPushNotification: function (data, callback) {
    const id = data.id
    if (id == null) {
      callback('failed no id', null)

    }
    const message = data.message
    if (message == null) {
      callback('failed no message', null)
    }

    Client.getById(id, (err, client) => {
      const registrationToken = client.pushToken
      if (registrationToken == null) {
        callback('failed no pushToken', null)
      }
      else {
        const message_notification = {
          notification: {
            title: message,
          }
        };

        const notification_options = {
          priority: "high",
          timeToLive: 60 * 60 * 24
        };

        admin.messaging().sendToDevice(registrationToken, message_notification, notification_options)
          .then(response => {
            callback(null, 'success')
          })
          .catch(error => {
            console.log(error);
          });
      }

    })


  }

}
