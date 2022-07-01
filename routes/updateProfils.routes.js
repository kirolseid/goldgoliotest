const app =require('express').Router();
const {validationResult}=require('express-validator');
const validation =require('../validation/resgiser.validation')
const bcrypt = require('bcrypt');



const talentedModel = require('../models/talented.model');
const personal_infoModel = require('../models/personal_info.model');
const corporate_infoModel = require('../models/corporate_info.model');



app.post('/updatetalented_info',async(req,res)=>{
const {username,email,phone,password,gender,id,imageUrl,talents}=req.body
  bcrypt.hash(password, 7,async function(err, hash) {
    //   console.log(req.body);
    // Store hash in your password DB
        await talentedModel.updateMany({_id:id},{username,email,phone,password:hash,gender,talent1:talents[0],talent2:talents[1],talent3:talents[2], profilePic:imageUrl})             
        res.json({message : "success"})
        
        }); 
    
    // console.log(req.body);
})




app.post('/Updatecoropate_info',async(req,res)=>{
    // console.log(req.body);
    const{id,username,company_field,email,phone,password,address,imageUrl,imageUrl1} =req.body
    bcrypt.hash(password, 7,async function(err, hash) {
        // Store hash in your password DB
        await corporate_infoModel.updateMany({_id:id},{username,company_field,email,phone,password:hash,address,
            profilePic:imageUrl,profilePic2:imageUrl1});             
res.json({message : "success"})
});
        
    
})



app.post('/Updatepreson_info',async(req,res)=>{
    // console.log(req.body);
    const{id,username,position,email,phone,password,imageUrl} =req.body
    bcrypt.hash(password, 7,async function(err, hash) {
        // Store hash in your password DB
        await personal_infoModel.updateMany({_id:id},{username,position,email,phone,password:hash,
                                            profilePic:imageUrl});             
            res.json({message : "success"})
        }); 
        
    
})







module.exports=app