const jwt = require('jsonwebtoken');
const key = require('../api/secretKey.js');
const JWT_SIGN_SECRET = key.JWT_SIGN_SECRET

module.exports = {
    GenerateTokenForUser : function (userData) {
        return jwt.sign({
            uid : userData._id,
            isAdmin : userData.isAdmin,
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        })
    },

    parseAuthorization: function (authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', ""):null;
    },

    getUserId: function (authorization) {
        let userId="0";
        const token = module.exports.parseAuthorization(authorization);
        if(token!=null){
            try{
                let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if(jwtToken != null){
                    userId = jwtToken.uid;
                }
                
            }catch(err){
                    
            }
        }
        return userId;
    },

    isUserAdmin : function(authorization){
        const token = module.exports.parseAuthorization(authorization);
        if(token!=null){
            try{
                let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if(jwtToken != null){
                    return jwtToken.isAdmin
                }

                return false
                
            }catch(err){
                    
            }
        }

    }


}