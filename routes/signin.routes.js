const app =require('express').Router()
// const query  = require('../database/db')
const {validationResult}=require('express-validator');
const validation =require('../validation/login.valid');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const talentedModel = require('../models/talented.model');
const personal_infoModel = require('../models/personal_info.model');
const corporate_infoModel = require('../models/corporate_info.model');
const verif_codeModel = require('../models/verif_code.model');





let transporter = nodemailer.createTransport({
    service:"gmail",
    
    auth: {
        user:'goldgolio1@gmail.com', // generated ethereal user
        pass:'Gold@1234' , // generated ethereal password
    },
});








app.post('/signin',validation.login,async (req, res) => {
    const {email,password}=req.body
    const errValid=validationResult(req)
    if (errValid.isEmpty()) {
        const tdata = await talentedModel.findOne({email})
            if(!tdata){
                const cdata = await corporate_infoModel.findOne({email})
                    if(!cdata){
                        const pdata = await personal_infoModel.findOne({email})
                            if(!pdata){
                                res.json({message:'Email is incorrect'})
                            }else{
                                const match = await bcrypt.compare(password , pdata.password);
                                if(match) {
                                    // req.session.Id=pdata._id
                                    // req.session.name=pdata.full_name
                                    let token=jwt.sign({userId:pdata._id},"secretKey")
                                    res.json({token ,message:'success',type:'person'})
                                }else{
                                    res.json({message:"password incorrect"})
                                }
                            }
                    }else{
                        // console.log(Cdata);
                        const match = await bcrypt.compare(password, cdata.password);
                           if(match) {
                            // req.session.Id=cdata._id
                            // req.session.name=cdata.company_name
                               let token=jwt.sign({userId:cdata.id},"secretKey")
                               res.json({token ,message:'success',type:'company'})
                           }else{
                               res.json({message:"password incorrect"})
                           }
                    }
            }else{
                const match = await bcrypt.compare(password, tdata.password);
                if(match) {
                    // req.session.Id=tdata._id
                    // req.session.name=tdata.full_name
                    let token=jwt.sign({userId:tdata.id},"secretKey")
                    res.json({token ,message:'success',type:'talent'})
                }else{
                    
                    res.json({message:"password incorrect"})
                }
            }
    }else{
            res.json({"error":errValid.array()})
        }
});




app.post('/forgetPass',async(req, res) => {
    const {email} =req.body
    let x = Math.floor(100000 + Math.random() * 900000);
    

   

    const tdata = await talentedModel.findOne({email})
    if(!tdata){
        const cdata = await corporate_infoModel.findOne({email})
            if(!cdata){
                const pdata = await personal_infoModel.findOne({email})
                    if(!pdata){
                        res.json({message:'Email is incorrect'})
                    }else{
                        let emailToken=jwt.sign({email},"secretKey")                            
                        res.json({message:"success",emailToken})
                
                       //  console.log(email);

                           let info ={
                               from: '"Gold Golio " <goldgolio1@gmail.com>', // sender address
                               to: email, // list of receivers
                               subject: "Verification Code ",// Subject line
                               html: 
                               `
                               <div  style=" width : 80%; margin: auto;">
                               <div class="logo " style=" margin-top:20px ;text-align: center;" >
                               
                               <img src="cid:unique"/>
                               </div>
                               
                               <h2 style="font-family: 'Poppins';
                               font-style: normal;
                               font-weight: 600;
                               font-size: 50px;
                               line-height: 75px;
                               /* identical to box height */
                               text-align: center;
                               
                               color: #111111;">Your verification code</h2>
                               <h3 style="font-family: 'Poppins';
                               font-style: normal;
                               font-weight: 600;
                               font-size: 50px;
                               line-height: 75px;
                               /* identical to box height */
                               text-align: center;
                               
                               color: #111111;
                               width: 15%;
                               margin: auto;
                               border-bottom:3px dashed goldenrod ;
                               
                               "> ${x}</h3>
                               
                               <p style="font-family: 'Poppins';
                               font-style: normal;
                               font-weight: 400;
                               font-size: 30px;
                               line-height: 45px;
                               text-align: center;
                               
                               color: #000000;
                               ">lf you didn't request a code
                                   you can safely ignore this email.</p>
                               
                               
                                   <hr>
                               
                                   <p style="font-family: 'Poppins';
                                   font-style: normal;
                                   font-weight: 500;
                                   font-size: 25px;
                                   line-height: 38px;
                                   /* identical to box height */
                                   
                                   text-align: center;
                                   color: #000000;
                                   ">All content Copyright ©Goldgolio </p>
                               
                               </div>
                                       `
               ,
               
              
                    attachments: [{
                        filename: 'Logoword.png',
                        path: __dirname+'/Logoword.png',
                        cid: 'unique@nodemailer.com' //same cid value as in the html img src
                    }]
                    
                                       
                                        // html body
                           };
                                await transporter.sendMail(info)

                                const veremail = await verif_codeModel.findOne({email})
                                if(veremail){
                                    await verif_codeModel.updateOne({email:email},{code:x})
                                }else{
                                    await verif_codeModel.insertMany({email,code:x})
                                }
                    }
            }else{
                    let emailToken=jwt.sign({email},"secretKey")                            
                    res.json({message:"success",emailToken})

                //  console.log(email);
                    let info ={
                from: '"Gold Golio " <goldgolio1@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Verification Code ", // Subject line
              
                html: 
                `
                <div  style=" width : 80%; margin: auto;">
                <div class="logo " style=" margin-top:20px ;text-align: center;" >
                
                <img src="cid:unique"/>
                </div>
                
                <h2 style="font-family: 'Poppins';
                font-style: normal;
                font-weight: 600;
                font-size: 50px;
                line-height: 75px;
                /* identical to box height */
                text-align: center;
                
                color: #111111;">Your verification code</h2>
                <h3 style="font-family: 'Poppins';
                font-style: normal;
                font-weight: 600;
                font-size: 50px;
                line-height: 75px;
                /* identical to box height */
                text-align: center;
                
                color: #111111;
                width: 15%;
                margin: auto;
                border-bottom:3px dashed goldenrod ;
                
                "> ${x}</h3>
                
                <p style="font-family: 'Poppins';
                font-style: normal;
                font-weight: 400;
                font-size: 30px;
                line-height: 45px;
                text-align: center;
                
                color: #000000;
                ">lf you didn't request a code
                    you can safely ignore this email.</p>
                
                
                    <hr>
                
                    <p style="font-family: 'Poppins';
                    font-style: normal;
                    font-weight: 500;
                    font-size: 25px;
                    line-height: 38px;
                    /* identical to box height */
                    
                    text-align: center;
                    color: #000000;
                    ">All content Copyright ©Goldgolio </p>
                
                </div>
                        `
               ,
               
              
                    attachments: [{
                        filename: 'Logoword.png',
                        path: __dirname+'/Logoword.png',
                        cid: 'unique@nodemailer.com' //same cid value as in the html img src
                    }]
                    
            };
                    await transporter.sendMail(info)
                    
                    const veremail = await verif_codeModel.findOne({email})
                    if(veremail){
                        await verif_codeModel.updateOne({email:email},{code:x})
                    }else{
                        await verif_codeModel.insertMany({email,code:x})
                    }
            }
    }else{

        let emailToken=jwt.sign({email},"secretKey")                            
        res.json({message:"success",emailToken})

       //  console.log(email);
       
            let info ={
               from: '"Gold Golio " <goldgolio1@gmail.com>', // sender address
               to: email, // list of receivers
               subject: "Verification Code ", // Subject line 
               attachments: [{
                filename: 'Logoword.png',
                path: __dirname+'/Logoword.png',
                cid: 'unique' //same cid value as in the html img src
            }],    
                html: `
                <div  style=" width : 80%; margin: auto;">
                <div class="logo " style="width : 100%; margin-top:20px ;text-align: center;" >
                
                <img src="cid:unique"/>
                </div>
                
                <h2 style="font-family: 'Poppins';
                font-style: normal;
                font-weight: 600;
                font-size: 50px;
                line-height: 75px;
                /* identical to box height */
                text-align: center;
                
                color: #111111;">Your verification code</h2>
                <h3 style="font-family: 'Poppins';
                font-style: normal;
                font-weight: 600;
                font-size: 50px;
                line-height: 75px;
                /* identical to box height */
                text-align: center;
                
                color: #111111;
                width: 15%;
                margin: auto;
                border-bottom:3px dashed goldenrod ;
                
                "> ${x}</h3>
                
                <p style="font-family: 'Poppins';
                font-style: normal;
                font-weight: 400;
                font-size: 30px;
                line-height: 45px;
                text-align: center;
                
                color: #000000;
                ">lf you didn't request a code
                    you can safely ignore this email.</p>
                
                
                    <hr>
                
                    <p style="font-family: 'Poppins';
                    font-style: normal;
                    font-weight: 500;
                    font-size: 25px;
                    line-height: 38px;
                    /* identical to box height */
                    
                    text-align: center;
                    color: #000000;
                    ">All content Copyright ©Goldgolio </p>
                
                </div>
                        `
                ,     
           };
                await transporter.sendMail(info)
                 
                const veremail = await verif_codeModel.findOne({email})
                if(veremail){
                    await verif_codeModel.updateOne({email:email},{code:x})
                }else{
                    await verif_codeModel.insertMany({email,code:x})
                }
    }
});


app.post('/verCode',async(req, res)=>{
// console.log(req.body);
    const {n1,n2,n3,n4,n5,n6,email} =req.body;
    const code = n1.toString()+n2.toString()+n3.toString()+n4.toString()+n5.toString()+n6.toString()

    // console.log(req.body);
        const data = await verif_codeModel.findOne({email})

        if(data){
            console.log(data);
            if(data.code==code){
                res.json({message: "success"})
            }else{
                res.json({message: " verification code is Incorrect"})
            }
        }else{
            res.json({message: "email is Incorrect"})
        }

});


app.post("/newpass",async(req,res)=>{
// console.log(req.body);
const{newPassword,REpassword,email}=req.body
// console.log(email);

    if(newPassword===REpassword){
  
        const tdata = await talentedModel.findOne({email})
        if(!tdata){
            const cdata = await corporate_infoModel.findOne({email})
                if(!cdata){
                    const pdata = await personal_infoModel.findOne({email})
                        if(!pdata){
                            res.json({message:'Email is incorrect'})
                        }else{
                            bcrypt.hash(newPassword, 7,async function(err, hash) {
                                // Store hash in your password DB
                                await personal_infoModel.updateOne({email:email},{password:hash})
                                res.json({message : "success"})
                            }); 
                        }
                }else{
                    bcrypt.hash(newPassword, 7,async function(err, hash) {
                        // Store hash in your password DB
                        await corporate_infoModel.updateOne({email:email},{password:hash})
                        res.json({message : "success"})          
                    }); 
                }
        }else{
            bcrypt.hash(newPassword, 7,async function(err, hash) {
                // Store hash in your password DB
                await talentedModel.updateOne({email:email},{password:hash})
                res.json({message : "success"})
            }); 
        }
    }else{
        res.json({message:'password And rePassword not equal'})
    }
});


module.exports=app
