const app =require('express').Router()




const talentedModel = require('../models/talented.model');
const personal_infoModel = require('../models/personal_info.model');
const corporate_infoModel = require('../models/corporate_info.model');
const NewsModel = require('../models/agency_news.model');
const talentmedia = require('../models/talentmedia.model');
const offerModel = require('../models/offer.model');
const agency_workModel = require('../models/agencyWork.model');





app.post('/getDtalilsForlogin',async(req,res)=>{
    const{Id,type}=req.body
    if(type==="talent"){
        const loginData= await talentedModel.findOne({_id:Id})
        res.json({loginData})
    }else if(type==="company"){
        const loginData= await corporate_infoModel.findOne({_id:Id})
        res.json({loginData})
    }else if(type==="person"){
        const loginData= await personal_infoModel.findOne({_id:Id})
        res.json({loginData})
        
    }



})


app.post('/getTalentDetails',async(req,res)=>{
    // console.log(req.body);
        const {userID}=req.body
        const details = await talentedModel.findOne({_id:userID})
        // console.log(details);
        res.json({message:"success",details})
    })






app.post('/saveTalentProfEdit',async (req,res)=>{
    // console.log(req.body);
   const {Id,about,bio,location,age,height,weight,salary,linkedin,youtube,insta,twitter,tiktok}=req.body
    await talentedModel.updateMany({_id:Id},{about,Bio:bio,location,age,height,weight,salary,
                                    linkedin,youtube,insta,twitter,tiktok},()=>{
           
            res.json({message:"success"})
                                      })
})

app.post('/getAgencyDetails', async (req,res)=>{

    const {userID}=req.body
    const details = await corporate_infoModel.findOne({_id:userID})
    // console.log(details);
    res.json({message:"success",details})
    
})


app.post('/getPersonDetails',async(req,res)=>{
    // console.log(req.body);
    const {userID}=req.body
    const details = await personal_infoModel.findOne({_id:userID})
    // console.log(details);
    res.json({message:"success",details})
    

})




app.post('/saveAgencyEdit',async (req,res)=>{
    // console.log(req.body);
   const {Id,about,linkedin,youtube,insta,twitter,tiktok}=req.body
    await corporate_infoModel.updateMany({_id:Id},{about,linkedin,youtube,insta,twitter,tiktok},()=>{
            res.json({message:"success"})   
                                    })
})

app.post('/savepersonEdit',async (req,res)=>{
    // console.log(req.body);
   const {Id,about,linkedin,youtube,insta,twitter,tiktok}=req.body
    await personal_infoModel.updateMany({_id:Id},{about,linkedin,youtube,insta,twitter,tiktok},()=>{
            res.json({message:"success"})   
                                    })
})





app.get('/homeProfils',async(req,res)=>{
    const profiles = await talentedModel.find()
    // console.log(profiles);
    res.json({profiles})
})



app.get('/getTopProfiles',async(req,res)=>{
    const TopProfiles = await talentedModel.find({rating : { $gt:3}})
    // console.log(profiles);
    res.json({TopProfiles})
})





app.get('/getMixTalentDetails',async(req,res)=>{
    // console.log(req.body);
        
        // const details = await talentedModel.findOne({_id:userID})
    const mixprofiles = await talentedModel.find().sort({_id:-1})
        // console.log(details);
        res.json({message:"success",mixprofiles})

// let mix
// for (var i = profiles.length - 1; i > 0; i--) {
//     var j = Math.floor(Math.random() * (i + 1));
//     var temp = profiles[i];
//     profiles[i] = profiles[j];
//     profiles[j] = temp;
// }

//         console.log(temp);

//         res.json(temp)

    })




app.get('/homeAgencies',async(req,res)=>{
    const Agencies = await corporate_infoModel.find().sort({_id:-1})
    // console.log(Agencies);
    res.json({Agencies})
})


app.get('/personalProfiles',async(req,res)=>{
    const personalProfiles = await personal_infoModel.find().sort({_id:-1})
    // console.log(Agencies);
    res.json({personalProfiles})
})



app.get('/NewsAgencies',async(req,res)=>{
    const news = await NewsModel.find()
    // console.log(news);
    res.json({news})
})


app.get('/latestPhoto',async(req,res)=>{
    const latestphotes = await talentmedia.find({ type: "image"  }).sort({_id:-1})
    // console.log(latestphotes);
    res.json({latestphotes})
})



app.get('/latestVedio',async(req,res)=>{
    const latestVedio = await talentmedia.find({ type: 'video' } ).sort({_id:-1})
    // console.log(latestVedio);
    res.json({latestVedio})
})

app.post('/getUsermedia',async(req,res)=>{
    const{ID}=req.body
    const Usermedia = await talentmedia.find({ UserID:ID }).sort({_id:-1})
    // console.log(Usermedia);
    res.json({Usermedia:Usermedia})
})

app.post('/userPhotos',async(req,res)=>{
    const{ID}=req.body

    const userPhotos = await talentmedia.find({ UserID:ID ,type:"image"}).sort({_id:-1})
    // console.log(userPhotos);
    res.json({userPhotos})
})




app.post('/userVedio',async(req,res)=>{
    const{ID}=req.body
    const userVedio = await talentmedia.find({ UserID:ID,type:"video"}).sort({_id:-1})
    // console.log(userVedio);
    res.json({userVedio})
})


app.post('/getAgencyNews',async(req,res)=>{
    const{Id}=req.body
    const news = await  NewsModel.find({agencyID:Id}).sort({_id:-1})
    res.json({news})
})

app.post('/getAgencyworks',async(req,res)=>{
    const{Id}=req.body
    const works = await  agency_workModel.find({agencyID:Id}).sort({_id:-1})
    res.json({works})
})




app.post('/getAgencyProfiles',async(req,res)=>{
    const{Id}=req.body
    const profiles = await  offerModel.find({agencyID:Id,deal:true}).sort({_id:-1})
    res.json({profiles})
    // console.log(profiles);
})


app.get('/getActors',async(req,res)=>{
    // const{Id}=req.body
    const actors = await  talentedModel.find({$or:[{talent1:'Actor'},{talent2:'Actor'},{talent3:'Actor'}] }).sort({_id:-1})
    res.json({actors})
})

app.get('/getTopActors',async(req,res)=>{
    // const{Id}=req.body
    const topactors = await  talentedModel.find({$or:[{talent1:'Actor'},{talent2:'Actor'},{talent3:'Actor'}] ,rating : { $gt:3}}).sort({_id:-1}).limit(3)
    res.json({topactors})
})

app.get('/getSinger',async(req,res)=>{
    // const{Id}=req.body
    const Singer = await  talentedModel.find({$or:[{talent1:'Singer'},{talent2:'Singer'},{talent3:'Singer'}] }).sort({_id:-1})
    res.json({Singer})
})


app.get('/getTopSinger',async(req,res)=>{
    // const{Id}=req.body
    const topSinger = await  talentedModel.find({$or:[{talent1:'Singer'},{talent2:'Singer'},{talent3:'Singer'}],rating : { $gt:3} }).sort({_id:-1}).limit(3)
    res.json({topSinger})
})

app.get('/getfootball',async(req,res)=>{
    // const{Id}=req.body
    const football = await  talentedModel.find({$or:[{talent1:'Football_Player'},{talent2:'Football_Player'},{talent3:'Football_Player'}] }).sort({_id:-1})
    res.json({football})
})

app.get('/getTopfootball',async(req,res)=>{
    // const{Id}=req.body
    const topfootball = await  talentedModel.find({$or:[{talent1:'Football_Player'},{talent2:'Football_Player'},{talent3:'Football_Player'}],rating : { $gt:3}  }).sort({_id:-1}).limit(3)
    res.json({topfootball})
})

app.get('/getphotogharaphy',async(req,res)=>{
    // const{Id}=req.body
    const photogharaphy = await  talentedModel.find({$or:[{talent1:'Photographer'},{talent2:'Photographer'},{talent3:'Photographer'}] }).sort({_id:-1})
    res.json({photogharaphy})
})


app.get('/getTopPhotogharaphy',async(req,res)=>{
    // const{Id}=req.body
    const topPhotogharaphy = await  talentedModel.find({$or:[{talent1:'Photographer'},{talent2:'Photographer'},{talent3:'Photographer'}],rating : { $gt:3} }).sort({_id:-1}).limit(3)
    res.json({topPhotogharaphy})
})


app.get('/getart',async(req,res)=>{
    // const{Id}=req.body
    const art = await  talentedModel.find({$or:[{talent1:'Art_Director'},{talent2:'Art_Director'},{talent3:'Art_Director'}] }).sort({_id:-1})
    res.json({art})
})

app.get('/getTopart',async(req,res)=>{
    // const{Id}=req.body
    const topart = await  talentedModel.find({$or:[{talent1:'Art_Director'},{talent2:'Art_Director'},{talent3:'Art_Director'}],rating : { $gt:3}  }).sort({_id:-1})
    res.json({topart})
})




app.post('/getPhotoDetails',async(req,res)=>{
    const{Id}=req.body
    let Photo = await talentmedia.findOne({_id:Id})
    res.json({Photo})
    // console.log(Photo);
})





app.post('/search',async(req,res)=>{
    // console.log(req.body);
    const   { talent, gender, salary }=req.body

    if(salary==="1"){
    const data = await talentedModel.find({$and:[{gender},{$or:[{talent1:talent},{talent2:talent},{talent3:talent}]},{$and:[{salary:{ $lt:51},salary:{ $gt:9}}]}]})
    // console.log(data);
    res.json({data})

    // console.log(typeof(data[0].salary))
    } else if(salary==="2"){
        const data = await talentedModel.find({$and:[{gender},{$or:[{talent1:talent},{talent2:talent},{talent3:talent}]},{$and:[{salary:{ $lt:101},salary:{ $gt:50}}]}]})
        // console.log(data);
        res.json({data})
    } else if(salary==="3"){
        const data = await talentedModel.find({$and:[{gender},{$or:[{talent1:talent},{talent2:talent},{talent3:talent}]},{$and:[{salary:{ $lt:151},salary:{ $gt:100}}]}]})
        console.log(data);
        res.json({data})

    } else if(salary==="4"){
        const data = await talentedModel.find({$and:[{gender},{$or:[{talent1:talent},{talent2:talent},{talent3:talent}]},{$and:[{salary:{ $lt:201},salary:{ $gt:150}}]}]})
        // console.log(data);
        res.json({data})

    }




    

    
   
    

})






/////////////////////get sections



app.get('/getGraphicDesigner',async(req,res)=>{
    let GraphicDesigner = await  talentedModel.find({$or:[{talent1:'Graphic_Designer'},{talent2:'Graphic_Designer'},{talent3:'Graphic_Designer'}] }).sort({_id:-1}).limit(3)
    res.json({GraphicDesigner})

});


app.get('/getDirector',async(req,res)=>{
    let Director = await  talentedModel.find({$or:[{talent1:'Director'},{talent2:'Director'},{talent3:'Director'}] }).sort({_id:-1}).limit(3)
    res.json({Director})

});

app.get('/getArtDirector',async(req,res)=>{
    let ArtDirector = await  talentedModel.find({$or:[{talent1:'Art_Director'},{talent2:'Art_Director'},{talent3:'Art_Director'}] }).sort({_id:-1}).limit(3)
    res.json({ArtDirector})

});


app.get('/getVideographer',async(req,res)=>{
    let Videographer = await  talentedModel.find({$or:[{talent1:'Videographer'},{talent2:'Videographer'},{talent3:'Videographer'}] }).sort({_id:-1}).limit(3)
    res.json({Videographer})

});

app.get('/getEditor',async(req,res)=>{
    let Editor = await  talentedModel.find({$or:[{talent1:'Editor'},{talent2:'Editor'},{talent3:'Editor'}] }).sort({_id:-1}).limit(3)
    res.json({Editor})

});


app.get('/getStylistFashion',async(req,res)=>{
    let StylistFashion = await  talentedModel.find({$or:[{talent1:'Stylist_&_Fashion'},{talent2:'Stylist_&_Fashion'},{talent3:'Stylist_&_Fashion'}] }).sort({_id:-1}).limit(3)
    res.json({StylistFashion})
});

app.get('/getColorist',async(req,res)=>{
    let Colorist = await  talentedModel.find({$or:[{talent1:'Colorist'},{talent2:'Colorist'},{talent3:'Colorist'}] }).sort({_id:-1}).limit(3)
    res.json({Colorist})
});


app.get('/getMakeupArtist',async(req,res)=>{
    let MakeupArtist = await  talentedModel.find({$or:[{talent1:'Makeup_Artist'},{talent2:'Makeup_Artist'},{talent3:'Makeup_Artist'}] }).sort({_id:-1}).limit(3)
    res.json({MakeupArtist})
});


app.get('/getSoundEngineer',async(req,res)=>{
    let SoundEngineer = await  talentedModel.find({$or:[{talent1:'Sound_Engineer'},{talent2:'Sound_Engineer'},{talent3:'Sound_Engineer'}] }).sort({_id:-1}).limit(3)
    res.json({SoundEngineer})
});


app.get('/getJournalist',async(req,res)=>{
    let Journalist = await  talentedModel.find({$or:[{talent1:'Journalist'},{talent2:'Journalist'},{talent3:'Journalist'}] }).sort({_id:-1}).limit(3)
    res.json({Journalist})
});


app.get('/getWriter',async(req,res)=>{
    let Writer = await  talentedModel.find({$or:[{talent1:'Writer'},{talent2:'Writer'},{talent3:'Writer'}] }).sort({_id:-1}).limit(3)
    res.json({Writer})
});

app.get('/getProductionManager',async(req,res)=>{
    let ProductionManager = await  talentedModel.find({$or:[{talent1:'Production Manager'},{talent2:'Production Manager'},{talent3:'Production Manager'}] }).sort({_id:-1}).limit(3)
    res.json({ProductionManager})
});


app.get('/getVoiceOver',async(req,res)=>{
    let VoiceOver = await  talentedModel.find({$or:[{talent1:'Voice Over'},{talent2:'Voice Over'},{talent3:'Voice Over'}] }).sort({_id:-1}).limit(3)
    res.json({VoiceOver})
});

app.get('/getProducer',async(req,res)=>{
    let Producer = await  talentedModel.find({$or:[{talent1:'Producer'},{talent2:'Producer'},{talent3:'Producer'}] }).sort({_id:-1}).limit(3)
    res.json({Producer})
});




app.post('/getvedio',async(req,res)=>{
    console.log(req.body);
    let vedio = await talentmedia.findOne({_id:req.body.id})
    // console.log(vedio);
    res.json({vedio})

})






module.exports=app