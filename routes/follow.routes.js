
const app =require('express').Router();
const corporate_infoModel = require('../models/corporate_info.model');
const FollowModel = require('../models/follow.model');
const personal_infoModel = require('../models/personal_info.model');
const talentedModel = require('../models/talented.model');




app.post('/isfollow',async(req,res)=>{
    const{MyId,talentId}=req.body
    // console.log(req.body);
    const following = await FollowModel.findOne({myId:MyId,talentId})

    if(following){
    res.json({message:"is follow"})
    }else{
        res.json({message:"not Follow"})
    }
})

app.post('/follow',async(req,res)=>{
    const{MyId,talentId,from}=req.body
    // console.log(req.body);
        await FollowModel.insertMany({myId:MyId,talentId})
        res.json({message:"done"})

        const followingnumb = await FollowModel.find({myId:MyId}).count()
        // console.log(followingnumb);



         await talentedModel .updateOne({_id:MyId},{numbOfFollowing:followingnumb})

        const followersnumb = await FollowModel.find({talentId}).count()







        if(from=="agency"){

            let agencyNumb =await corporate_infoModel.find().count()


            let ratepercent = (followersnumb/agencyNumb)*100
let ratenum
            // console.log(ratepercent);
            // console.log("com",ratepercent,followersnumb,agencyNumb);


            if(ratepercent <10){
                ratenum=0 
            }else if(ratepercent > 10 && ratepercent <= 20 ){
                ratenum=1
            }else if(ratepercent > 30 && ratepercent <= 40){
                ratenum=2

            }else if(ratepercent > 50 && ratepercent <= 60){
                ratenum=3

            }else if(ratepercent > 70 && ratepercent <= 80){
                ratenum=4
                
            }else if(ratepercent > 90){
                ratenum=5 
            }


            await corporate_infoModel .updateOne({_id:talentId},{numbOfFollower:followersnumb,rating:ratenum})

        }else if(from=="talent"){

            let talentNumb =await talentedModel.find().count()

            let ratepercent = (followersnumb/talentNumb)*100
            let ratenum


            if(ratepercent <10){
                ratenum=0 
            }else if(ratepercent > 10 && ratepercent <= 20 ){
                ratenum=1
            }else if(ratepercent > 30 && ratepercent <= 40){
                ratenum=2

            }else if(ratepercent > 50 && ratepercent <= 60){
                ratenum=3

            }else if(ratepercent > 70 && ratepercent <= 80){
                ratenum=4
                
            }else if(ratepercent > 90){
                ratenum=5 
            }
            // console.log(ratepercent);



            // console.log("tal",ratepercent,followersnumb,talentNumb);


            await talentedModel .updateOne({_id:talentId},{numbOfFollower:followersnumb,rating:ratenum})

        }else if(from=="person"){

            let personNumb =await personal_infoModel.find().count()

            


            let ratepercent = (followersnumb/personNumb)*100
            let ratenum


            if(ratepercent <10){
                ratenum=0 
            }else if(ratepercent > 10 && ratepercent <= 20 ){
                ratenum=1
            }else if(ratepercent > 30 && ratepercent <= 40){
                ratenum=2

            }else if(ratepercent > 50 && ratepercent <= 60){
                ratenum=3

            }else if(ratepercent > 70 && ratepercent <= 80){
                ratenum=4
                
            }else if(ratepercent > 90){
                ratenum=5 
            }
            // console.log("per",ratepercent,followersnumb,personNumb);

            await personal_infoModel .updateOne({_id:talentId},{numbOfFollower:followersnumb,rating:ratenum})

        }
        



})


app.post('/unfollow',async(req,res)=>{
    const{MyId,talentId,from}=req.body
    // console.log(req.body);

    await FollowModel.deleteOne({myId:MyId})
    res.json({message:"done"})

    const followingnumb = await FollowModel.find({myId:MyId}).count()
    // console.log(followingnumb);
     await talentedModel .updateOne({_id:MyId},{numbOfFollowing:followingnumb})

    const followersnumb = await FollowModel.find({talentId}).count()
    if(from=="agency"){

        let agencyNumb =await corporate_infoModel.find().count()
        let ratepercent = (followersnumb/agencyNumb)*100

        let ratenum


        if(ratepercent <10){
            ratenum=0 
        }else if(ratepercent > 10 && ratepercent <= 20 ){
            ratenum=1
        }else if(ratepercent > 30 && ratepercent <= 40){
            ratenum=2

        }else if(ratepercent > 50 && ratepercent <= 60){
            ratenum=3

        }else if(ratepercent > 70 && ratepercent <= 80){
            ratenum=4
            
        }else if(ratepercent > 90){
            ratenum=5 
        }
        await corporate_infoModel.updateOne({_id:talentId},{numbOfFollower:followersnumb,rating:ratenum})

    }else if(from=="talent"){
        
        let talentNumb =await talentedModel.find().count()
        let ratepercent = (followersnumb/talentNumb)*100
        let ratenum

        if(ratepercent <10){
            ratenum=0 
        }else if(ratepercent > 10 && ratepercent <= 20 ){
            ratenum=1
        }else if(ratepercent > 30 && ratepercent <= 40){
            ratenum=2

        }else if(ratepercent > 50 && ratepercent <= 60){
            ratenum=3

        }else if(ratepercent > 70 && ratepercent <= 80){
            ratenum=4
            
        }else if(ratepercent > 90){
            ratenum=5 
        }
        await talentedModel.updateOne({_id:talentId},{numbOfFollower:followersnumb,rating:ratenum})

    }else if(from=="person"){
        let personNumb =await personal_infoModel.find().count()
        let ratepercent = (followersnumb/personNumb)*100
        console.log(ratepercent);
        let ratenum

        if(ratepercent <10){
            ratenum=0 
        }
        else if(ratepercent > 10 && ratepercent <= 20 ){
            ratenum=1
        }else if(ratepercent > 30 && ratepercent <= 40){
            ratenum=2
        }else if(ratepercent > 50 && ratepercent <= 60){
            ratenum=3
        }else if(ratepercent > 70 && ratepercent <= 80){
            ratenum=4
        }else if(ratepercent > 90){
            ratenum=5 
        }

        console.log(ratenum);
        await personal_infoModel .updateOne({_id:talentId},{numbOfFollower:followersnumb,rating:ratenum})
    }

})



module.exports=app