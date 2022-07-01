const mongoose = require('mongoose');


const talentedSchema =mongoose.Schema({
    username:String,
    email:String,
    phone:String,
    password:String,
    gender:String,
    talent1:String,
    talent2:String,
    talent3:String,
    
        profilePic:String,
        about:String,
        Bio:String,
        numbOfFollowing:Number,
        numbOfFollower:Number,
        rating:Number,
       
            location:String,
            age:Number,
            height:Number,
            weight:Number,
            salary:Number,
      
        
            linkedin:String,
            youtube:String,
            insta:String,
            twitter:String,
            tiktok:String,
            online:{
                type:Boolean,
                default:false
            }

       
   

})


const talentedModel= mongoose.model('talented',talentedSchema)

module.exports =talentedModel