const app =require('express').Router()
const mediaUploaded = require('../models/talentmedia.model')
const newsUploaded =require('../models/agency_news.model')
var fs =require('fs')
const path =require('path')
const agency_workModel = require('../models/agencyWork.model')



app.post("/uploadMedia", async(req,res)=>{
 const {caption,id,fileUrl,type,link }=req.body
console.log(req.body);

if(type==undefined){
    // console.log('gfh');
    let url2
    let youtube
    if(link.includes('watch?v=')){

        console.log("dssds");
         youtube=link.split('&')
        // console.log(youtube);
        let youtube2=youtube[0].split('watch?v=')
        console.log(youtube2);
         url2=youtube2[1]
         console.log(url2);
    }else{
         youtube=link.split('be/')    
         url2=youtube[1]
         console.log(url2);
    }

  

    // console.log(youtube);
    await mediaUploaded.insertMany({ UserID:id,videoUrl:url2,caption:caption,type:'youtube' },()=>{
        res.json({message:"ImageDone"})
        });
}else{  
    // console.log("dsddsds");
    let mediaType =type.split('/')

    await mediaUploaded.insertMany({ UserID:id,Pic:fileUrl,caption:caption,type:mediaType[0]},()=>{
    res.json({message:"ImageDone"})
    });
}


})

app.post("/uploadNews", async(req,res)=>{
    const {title,caption,id,fileUrl ,filetype,link}=req.body
//    console.log(req.body);


if(filetype==undefined){
    let url2
    let youtube
    if(link.includes('watch?v=')){
         youtube=link.split('&')
        // console.log(youtube);
        let youtube2=youtube[0].split('watch?v=')
        // console.log(youtube2);
         url2=youtube2[1]
         console.log(url2);
    }else{
         youtube=link.split('be/')    
         url2=youtube[1]
         console.log(url2);
    }
    

    await newsUploaded.insertMany({ agencyID:id,videoUrl:url2,mediaType:'youtube',caption,title},()=>{
        res.json({message:"newsDone"})
    });

}else{
    let mediaType =filetype.split('/')
    await newsUploaded.insertMany({ agencyID:id,Pic:fileUrl,mediaType:mediaType[0],caption,title},()=>{
    res.json({message:"newsDone"})
    });

}

   
    })



   app.post("/uploadwork", async(req,res)=>{
    const {title,caption,id,fileUrl ,filetype,link}=req.body

        if(filetype==undefined){
            let url2
            let youtube
            if(link.includes('watch?v=')){
                 youtube=link.split('&')
                // console.log(youtube);
                let youtube2=youtube[0].split('watch?v=')
                console.log(youtube2);
                 url2=youtube2[1]
                 console.log(url2);
            }else{
                 youtube=link.split('be/')    
                 url2=youtube[1]
                 console.log(url2);
            }
    

    await agency_workModel.insertMany({ agencyID:id,videoUrl:url2,mediaType:'youtube',caption,title},()=>{
        res.json({message:"addedworked"})
    });

}else{
    let mediaType =filetype.split('/')
    // console.log(mediaType[0]);
            await agency_workModel.insertMany({ agencyID:id,Pic:fileUrl,mediaType:mediaType[0],caption,title},()=>{
            res.json({message:"addedworked"})
            });
}

//    console.log(req.body);
       
    })



    app.post("/deleteMedia",async(req,res)=>{
        //    console.log(req.body);
        const {Id}=req.body
        const data= await mediaUploaded.findOne({ _id:Id})

        console.log(data);

        if(data.type=='youtube' ){
            await mediaUploaded.deleteOne({_id:Id})
            res.json({message:'deleted'})
        }else{

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