const express =  require('express')
const User = require('../models/User')
const router = express.Router()
const bcrypt = require('bcrypt');

router.get('/',(req,res)=>{
    res.send('Hello from the auth router')
})

router.post('/register',async (req,res)=>{
    try {
        //Salted Hash Password creation
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password,salt)

        //Create new User
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPass
        })
        
        //save the user
        const user = await newUser.save()
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
})
router.post('/login', async (req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email})
        if(!user){
            res.status(404).send({msg:'NOT FOUND!',status:'404',data:[]})
        }

        const validPassword = await bcrypt.compare(req.body.password,user.password);
        
        if(!validPassword){
            res.status(400).send({msg:'Wrong password',error:validPassword})
        }
        res.status(200).send({msg:'User exists!',status:'200'})
    } catch (error) {
        res.status(500).json(error)
    }
})
module.exports = router;