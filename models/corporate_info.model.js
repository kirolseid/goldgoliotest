const mongoose = require('mongoose');


const corporate_infoSchema =mongoose.Schema({
    username:String,
    company_field:String,
    email:String,
    phone:String,
    password:String,
    address:String,
  
        profilePic:String,
        profilePic2:String,
        about:String,
        numbOfFollower:Number,
        rating:Number,
       
            linkedin:String,
            youtube:String,
            insta:String,
            twitter:String,
            tiktok:String,
            chats:[mongoose.Schema.Types.ObjectId],
            online:{
                type:Boolean,
                default:false
            }
     
})


const corporate_infoModel= mongoose.model('corporate_info',corporate_infoSchema)

module.exports =corporate_infoModel