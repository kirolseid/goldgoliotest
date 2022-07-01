const mongoose = require('mongoose');


const offerSchema =mongoose.Schema({
    agencyId:mongoose.Schema.Types.ObjectId,
    talentId:mongoose.Schema.Types.ObjectId,
    talentPic:String,
    location:String,
    date:String,
    time:String,
    salary:String,
    pref:String,
    company_name:String,
    company_field:String,
    address:String,
    profilePic1:String,
    profilePic2:String,
    numbOfFollower:Number,
    rating:Number,
    deal:{type:Boolean,default:false}

})


const offerModel= mongoose.model('offer',offerSchema)

module.exports =offerModel