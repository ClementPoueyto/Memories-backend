const jwtUtils = require('../../../utils/jwt.utils.js')
const { Notif, User } = require('../../../models')

module.exports = {
    getNotifs : function (req , res) {
        if (jwtUtils.isUserAdmin(req.headers['authorization']) === true) {
            Notif.get((err, notifs) => {
                if (notifs) {
                    res.status(200).json(notifs)
                }
                else {
                    res.status(400).json({ 'error': 'no notifs found' });
                }
            })
        }
        else {
            res.status(404).json({ 'error': 'not allowed' });
        }
    },
    getMyNotifs : function (req , res) {
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        if (userId.length <= 1) {
            return res.status(400).json({
                'error': 'wrong token'
            })
        }

        Notif.mongooseModel.find({idTo:userId}, (err, notifs) => {
            if (notifs) {
                res.status(200).json(notifs)
            }
            else {
                err ? res.status(400).json({ 'error': err }) : res.status(404).json({ "error": "no notification found" })
            }
        })
    },

    addNotifs : function (notif={}) {
        if(notif.idTo==notif.idFrom){
            return 
        }
        else{
            User.getById(notif.idFrom,(err, user)=>{
                if(err||!user){
                    return 
                }
                else{
                    const name = user.firstName+" "+user.lastName+" "
                    let message =name
                    switch(notif.types){
                        case "likes":
                            message += "a aimé votre publication"
                            break;
                        case "follow" :
                            message += "a commencé à vous suivre"
                            break;
                        case "comment":
                            message =+ "a commenté votre publication"
                            break;
                    }
                    const myNotif={
                        idFrom : notif.idFrom,
                        idTo : notif.idTo,
                        date : Date.now().toString(),
                        seen : false,
                        textNotification : message,
                        types : notif.types
                    }
                    Notif.create(myNotif)
                }
            } )

            
        }
    }
}