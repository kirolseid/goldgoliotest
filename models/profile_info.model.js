const mongoose = require('mongoose');



const profile_infoSchema =mongoose.Schema({
    userID:mongoose.Schema.Types.ObjectId,
    name:String,
    talentName:String,
    profilePic:String,
    about:String,
    Bio:String,
    numbOfFollowing:Number,
    numbOfFollower:Number,
    rating:Number,
    info:{
        location:String,
        age:Number,
        height:Number,
        weight:Number,
        salary:String
    },
    social:{
        linkedin:String,
        youtube:String,
        insta:String,
        twitter:String,
        tiktok:String
    }
})


const profile_infoModel= mongoose.model('profile_info',profile_infoSchema)

module.exports =profile_infoModel