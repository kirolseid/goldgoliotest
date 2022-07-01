const mongoose = require('mongoose');


const FollowSchema =mongoose.Schema({
    myId:mongoose.Schema.Types.ObjectId,
    talentId:mongoose.Schema.Types.ObjectId,

})


const FollowModel= mongoose.model('Follow',FollowSchema)

module.exports =FollowModel