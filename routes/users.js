const express =  require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User');
//Update User
router.put('/:id',async (req,res)=>{
    if(req.body.userId === req.params.id ||req.body.isAdmin){
        if(req.body.password){
            try {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(req.body.password,salt)
                req.body.password = hashedPassword                    
            } catch (error) {
                return res.status(500).json(error)
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body
            })
            res.status(200).json("Account has been updated");
        }catch(error){
            return res.status(500).json(error)
        }
    }
    else{
        res.status(403).json("You can update only your account!")
    }
})
//Delete User
router.delete('/:id',async (req,res)=>{
    if(req.body.userId === req.params.id){
        try{
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account has been deleted");
        }catch(error){
            res.status(500).send({msg:'ERROR',status:'500',error:error})
        }
    }
    else{
        res.status(403).json("You can delete only your account!")
    }
})
//Get user
router.get('/:id',async (req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        if(!user){
            res.status(400).json('User does not exists!')
        }
        res.status(200).send({msg:'Success',status:'200',user:user,userid:user._id})
    } catch (error) {
        res.status(500).send({msg:'ERROR',status:'500',error:error})
    }
})
//follow all users
router.put('/:id/follow',async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
                await User.updateOne({_id:user._id},{$push:{followers:req.body.userId}})
                await User.updateOne({_id:currentUser._id},{$push:{following:req.params.id}})
                res.status(200).json('Successful follow')
            }
            else{
                res.status(400).json('User is already being followed!')
            }
        } catch (error) {
            res.status(500).send({msg:'ERROR',status:'500',error:error})
        }
    }
    else{
        res.status(403).send('You can not follow yourself!')
    }
})
//unfollow
router.put('/:id/unfollow',async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(user.followers.includes(req.body.userId)){
                await User.updateOne({_id:user._id},{$pull:{followers:req.body.userId}})
                await User.updateOne({_id:currentUser._id},{$pull:{following:req.params.id}})
                res.status(200).json('Successful unfollow')
            }
            else{
                res.status(400).json('User is already being unfollowed!')
            }
        } catch (error) {
            res.status(500).send({msg:'ERROR',status:'500',error:error})
        }
    }
    else{
        res.status(403).send('You can not unfollow yourself!')
    }
})
router.get('/',(req,res)=>{
    res.status(200).send('Hello from the users route');
})

module.exports = router;