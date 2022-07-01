
const app =require('express').Router();
const corporate_infoModel = require('../models/corporate_info.model');
const offerModel = require('../models/offer.model');
const talentedModel = require('../models/talented.model');


app.post("/addOffer",async(req,res)=>{
// console.log(req.body);
const {location,date,time,salary,pref,agencyId,talentId,talentPic} =req.body;

    const agencydata = await corporate_infoModel.findOne({_id:agencyId})

    await offerModel.insertMany({agencyId,talentId,talentPic,location,date,time,salary,pref
        ,company_name:agencydata.company_name,company_field:agencydata.company_field
        ,address:agencydata.address,profilePic1:agencydata.profilePic1,profilePic2:agencydata.profilePic2
        ,numbOfFollower:agencydata.numbOfFollower,rating:agencydata.rating})
    res.json({message:'addedOffer'})

})


app.post ("/getOffers", async (req,res)=>{
    const{Id}=req.body
    // console.log(Id);
    const dealOffers = await offerModel.find({talentId:Id}).sort({_id:-1})
    //    console.log(dealOffers);
       res.json({dealOffers})
})


app.post ("/getOffer", async (req,res)=>{
    const{Id}=req.body
    // console.log(Id);
    const offer = await offerModel.findOne({_id:Id})
        console.log(offer);
        res.json({offer})
})

app.post ("/acceptOffer", async (req,res)=>{
    const{Id}=req.body
    // console.log(Id);
 await offerModel.updateMany({_id:Id},{deal:true})
      
})



module.exports=app
