const mongoose = require('mongoose');


const LikeSchema =mongoose.Schema({
    imageId:mongoose.Schema.Types.ObjectId,
    MakeLikeId:mongoose.Schema.Types.ObjectId,
    imageownerId:mongoose.Schema.Types.ObjectId,
   LikedName:String,
   LikedPic:String,


})


const LikeModel= mongoose.model('Like',LikeSchema)

module.exports =LikeModel