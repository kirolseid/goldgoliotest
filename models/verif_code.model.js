const mongoose = require('mongoose');


const verif_codeSchema =mongoose.Schema({
    email:String,
    code:Number,

})


const verif_codeModel= mongoose.model('verif_code',verif_codeSchema)

module.exports =verif_codeModel