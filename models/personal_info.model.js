const mongoose = require('mongoose');


const personal_infoSchema =mongoose.Schema({
    username:String,
    email:String,
    phone:String,
    password:String,
    position:String,

    profilePic:String,
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


const personal_infoModel= mongoose.model('personal_info',personal_infoSchema)

module.exports =personal_infoModel