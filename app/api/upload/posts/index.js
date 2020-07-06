const { Router } = require('express')
const mongoose = require('mongoose')
const fs = require('fs')
const jwtUtils = require('../../../utils/jwt.utils.js')

const bodyParser = require('body-parser')
const { imagePost } = require('../../../models')

const multer = require('multer');
const path = require('path');
const router = new Router()

var storage = multer.memoryStorage();

var upload = multer({
    storage:storage
})


router.use(bodyParser.urlencoded({extended:true})),


router.post('/',upload.single('post'),(req, res)=>{

    const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        if (userId.length <= 1) {
            console.log('token')

            return res.status(400).json({
                'error': 'wrong token'
            })
        }

   const file =req.file
   if(!file){
    console.log('file')

       return res.status(400).json({'error':'no file'})
   }
   var img = new Buffer.from(req.file.buffer,'base64')
    
   var finalImg = {
       contentType : req.file.mimetype,
       path : "post-"+Date.now()+".jpg",
       image :img ,
       uid : userId
   }

   imagePost.create(finalImg,(err,uploaded)=>{
       if(err||!uploaded){
           return res.status(500).json({"error":err})
       }
       else{
        return res.status(201).send({...uploaded, image:1})
       }
   })
} )

router.get('/:path', (req, res)=>{

    const path = req.params.path;
    if(!path){
        return res.status(400).json({'error': 'no path'})
    }

    imagePost.mongooseModel.findOne({path : path }).then(function (imageFound) {
        if(imageFound){
            let file = imageFound
            
            res.contentType(file.contentType);
            res.status(200).send(file.image);
        }
        else{
            res.status(400).json({'error':'no image found'})
        }
        
    })

}),

router.delete('/:path',(req, res)=>{
    const path = req.params.path;
    if(!path){
        return res.status(400).json({'error': 'no path'})
    }

    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    if (userId.length <= 1) {
        console.log('token')

        return res.status(400).json({
            'error': 'wrong token'
        })
    }

    imagePost.mongooseModel.findOneAndDelete({uid:userId, path: path}).then(function (image) {
        if(!image){
            return res.status(400).json({'error':'no image found'})
        }
        else{
            return res.status(200).send({...image, image: 0})
        }
    })
})


module.exports = router;