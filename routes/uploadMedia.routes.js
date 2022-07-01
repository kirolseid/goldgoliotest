const app =require('express').Router()
const mediaUploaded = require('../models/talentmedia.model')
const newsUploaded =require('../models/agency_news.model')
var fs =require('fs')
const path =require('path')
const agency_workModel = require('../models/agencyWork.model')



app.post("/uploadMedia", async(req,res)=>{
 const {caption,id,fileUrl,type }=req.body
// console.log(req.body);
let mediaType =type.split('/')

    await mediaUploaded.insertMany({ UserID:id,Pic:fileUrl,caption:caption,type:mediaType[0]},()=>{
    res.json({message:"ImageDone"})
    });

})

app.post("/uploadNews", async(req,res)=>{
    const {title,caption,id,fileUrl }=req.body
//    console.log(req.body);
        await newsUploaded.insertMany({ agencyID:id,Pic:fileUrl,caption,title},()=>{
        res.json({message:"newsDone"})
        });
    })

   app.post("/uploadwork", async(req,res)=>{
    const {title,caption,id,fileUrl ,filetype}=req.body
//    console.log(req.body);
        let mediaType =filetype.split('/')
// console.log(mediaType[0]);
        await agency_workModel.insertMany({ agencyID:id,Pic:fileUrl,mediaType:mediaType[0],caption,title},()=>{
        res.json({message:"addedworked"})
        });
    })



    app.post("/deleteMedia",async(req,res)=>{
        //    console.log(req.body);
        const {Id}=req.body
        const data= await mediaUploaded.findOne({ _id:Id})

        if(data){
            // path.join(__dirname,"uploads")
            const name =data.Pic.split('uploads/')
            // console.log(jjj);
            const imagePath ='./uploads/'+name[1]
            fs.unlinkSync(imagePath)
            console.log(imagePath);
// 
            await mediaUploaded.deleteOne({_id:Id})
            res.json({message:'deleted'})

        }

    })

    app.post("/editMedia",async(req,res)=>{
    const {Id}=req.body

    const Photo= await mediaUploaded.findOne({_id:Id});
        res.json({Photo})

        // console.log(Photo);

   })


   app.post("/saveEditMedia",async(req,res)=>{
//    console.log(req.body);
 const   {Id,newCaption}=req.body
 await mediaUploaded.updateMany({_id:Id},{caption:newCaption})             
    res.json({message : "success"})
    
    
    // const Photo= await mediaUploaded.findOne({_id:Id});
    //     res.json({Photo})

    //     console.log(Photo);

   })



module.exports=app