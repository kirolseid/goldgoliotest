const mongoose = require('mongoose');



const agency_newsSchema =mongoose.Schema({
    agencyID:mongoose.Schema.Types.ObjectId,
    Pic:String,
    title:String,
    caption:String,
})


const agency_newsModel= mongoose.model('agency_news',agency_newsSchema)

module.exports =agency_newsModel