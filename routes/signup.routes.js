const app = require('express').Router()
// const query  = require('../database/db')
const { validationResult } = require('express-validator');
const validation = require('../validation/resgiser.validation')
const bcrypt = require('bcrypt');

const User = require('../models/user');


const talentedModel = require('../models/talented.model');
const personal_infoModel = require('../models/personal_info.model');
const corporate_infoModel = require('../models/corporate_info.model');



app.post('/talented_reg', validation.talented, async (req, res) => {
    // console.log(req.body);
    const { username, email, phone, password, gender, talents } = req.body
    const errValid = validationResult(req)

    if (errValid.isEmpty()) {

        const tdata = await talentedModel.findOne({ email })
        if (!tdata) {
            const cdata = await corporate_infoModel.findOne({ email })
            if (!cdata) {
                const pdata = await personal_infoModel.findOne({ email })
                if (!pdata) {
                    bcrypt.hash(password, 7, async function (err, hash) {
                        // Store hash in your password DB
                        const userData = await talentedModel.insertMany({
                            username, email, phone, password: hash, gender, talent1: talents[0], talent2: talents[1], talent3: talents[2],
                            profilePic: '/assets/images/avatar.png', about: '', Bio: '', numbOfFollowing: 0, numbOfFollower: 0, rating: 0,
                            location: '', age: null, height: null, weight: null, salary: 0,
                            linkedin: '', youtube: '', insta: '', twitter: '', tiktok: ''
                        });
                        const user = new User(username, email, userData[0]._id, 'talented');
                        await user.addUser();
                        res.json({ message: "success" })
                    });
                } else {
                    res.json({ message: 'Email is exsit' })
                }
            } else {
                res.json({ message: 'Email is exsit' })
            }
        } else {
            res.json({ message: 'Email is exsit' })
        }
    } else {
        res.json({ "errors": errValid.array() })
    }

});



app.post('/personal_reg', validation.personal, async (req, res) => {
    const { username, email, phone, password, position } = req.body
    const errValid = validationResult(req)

    if (errValid.isEmpty()) {

        const tdata = await talentedModel.findOne({ email })
        if (!tdata) {
            const cdata = await corporate_infoModel.findOne({ email })
            if (!cdata) {
                const pdata = await personal_infoModel.findOne({ email })
                if (!pdata) {
                    bcrypt.hash(password, 7, async function (err, hash) {
                        // Store hash in your password DB
                        const userData = await personal_infoModel.insertMany({
                            username, email, phone, password: hash, position,
                            profilePic: '/assets/images/avatar.png', about: '', numbOfFollower: 0, rating: 0,
                            linkedin: '', youtube: '', insta: '', twitter: '', tiktok: ''
                        })


                        const user = new User(
                            username,
                            email,
                            userData[0]._id,
                            'personal_info'
                        );

                        await user.addUser();


                        res.json({ message: "success" })
                    });
                } else {
                    res.json({ message: 'Email is exsit' })
                }
            } else {
                res.json({ message: 'Email is exsit' })
            }
        } else {
            res.json({ message: 'Email is exsit' })
        }

    } else {
        res.json({ "errors": errValid.array() })
    }
});


app.post('/corporate_reg', validation.coporation, async (req, res) => {
    // console.log(req.body);
    const { username, company_field, email, phone, password, address } = req.body
    const errValid = validationResult(req)
    if (errValid.isEmpty()) {

        const tdata = await talentedModel.findOne({ email })
        if (!tdata) {
            const cdata = await corporate_infoModel.findOne({ email })
            if (!cdata) {
                const pdata = await personal_infoModel.findOne({ email })
                if (!pdata) {
                    bcrypt.hash(password, 7, async function (err, hash) {
                        // Store hash in your password DB
                        const userData = await corporate_infoModel.insertMany({
                            username, company_field, email, phone, password: hash, address,
                            profilePic: '/assets/images/avatar.png',  about: '', numbOfFollower: 0, rating: 0,
                            linkedin: '', youtube: '', insta: '', twitter: '', tiktok: ''
                        });
                        const user = new User(
                            username,
                            email,
                            userData[0]._id,
                            'corporate_info'
                        );
                        await user.addUser();

                        res.json({ message: "success" })
                    });
                } else {
                    res.json({ message: 'Email is exsit' })
                }
            } else {
                res.json({ message: 'Email is exsit' })
            }
        } else {
            res.json({ message: 'Email is exsit' })
        }

    } else {
        res.json({ "errors": errValid.array() })
    }
});
/////////////////////
/////////////////////


module.exports = app
