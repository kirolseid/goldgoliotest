const mongoose = require('mongoose');



const agency_workSchema =mongoose.Schema({
    agencyID:mongoose.Schema.Types.ObjectId,
    Pic:String,
    mediaType:String,
    title:String,
    caption:String,
    videoUrl:String,

})


const agency_workModel= mongoose.model('agency_work',agency_workSchema)

module.exports =agency_workModel