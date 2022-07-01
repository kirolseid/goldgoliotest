const mongoose = require('mongoose');



const commentSchema =mongoose.Schema({
    ItemID:mongoose.Schema.Types.ObjectId,
    comment:String,
    ownerPic:String,
    ownerName:String,
    
    // likesNumb:Number
})


const commentModel= mongoose.model('comment',commentSchema)

module.exports =commentModel