const mongoose = require('mongoose');
const { stringify } = require('uuid');




const talentmediaSchema =mongoose.Schema({
    UserID:mongoose.Schema.Types.ObjectId,
    Pic:String,
    videoUrl:String,
    caption:String,
    type:String,
    likesNumb:Number,       
})


const talentmediaModel= mongoose.model('talentmedia',talentmediaSchema)

module.exports =talentmediaModel