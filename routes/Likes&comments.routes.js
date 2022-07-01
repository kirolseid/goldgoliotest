
const app =require('express').Router();
const commentModel = require('../models/comments.model');
const corporate_infoModel = require('../models/corporate_info.model');

const LikeModel = require('../models/Like.model');
const personal_infoModel = require('../models/personal_info.model');
const talentedModel = require('../models/talented.model');



app.post('/Like',async(req,res)=>{
    // console.log(req.body);
   const {imageId,makeLike,imageowner,LikedName,LikedPic} =req.body

   let getLike = await LikeModel.findOne({imageId:imageId,MakeLikeId:makeLike});

   if(getLike){
        await LikeModel.deleteOne({imageId})
   }else{
        await LikeModel.insertMany({imageId,MakeLikeId:makeLike,imageownerId:imageowner,LikedPic,LikedName})
        res.json({message:'Liked'})
   }
    console.log("sadas",getLike);


})


app.post('/getIfLikes',async(req,res)=>{
    const{imageId,makeLike}=req.body
    const IfLike = await LikeModel.find({imageId:imageId,MakeLikeId:makeLike})
    res.json({IfLike})
    // console.log(allLikesforuser);
})

app.post('/getAllLikes',async(req,res)=>{
    const{id}=req.body
    let makesLikeName = await LikeModel.find({imageId:id}).sort({_id:-1})
    let numbLikeOfPhoto = await LikeModel.find({imageId:id}).count()
    res.json({numbLikeOfPhoto,makesLikeName})
    console.log(numbLikeOfPhoto,makesLikeName[0].LikedName);
})


app.post('/getcomments' ,async(req,res)=>{
    const{Id}=req.body
    const comments = await commentModel.find({ItemID:Id})
    res.json({comments})
})

app.post("/addcomment",async(req,res)=>{
    const{Id,comment ,ownerPic,ownerName}=req.body

    // console.log(req.body);

    await commentModel.insertMany({ ItemID:Id ,comment,ownerPic,ownerName})
    res.json({message:"addedcomment"})
})


module.exports=app

