const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const User = require('../models/User')

//get post
router.get('/:id',async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).send(post)
    } catch (error) {
        res.status(500).json(err)
    }
})
//post post
router.post('/',async (req,res)=>{
    const newPost = new Post(req.body)
    try{
        const savedPost =  await newPost.save()
        res.status(200).json(savedPost)
    }
    catch(err){
        res.status(500).json(err)
    }
})
//update post
router.put('/:id',async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(post.userid === req.body.userid){
            await Post.updateOne({_id:post._id},{$set:req.body})
            res.status(200).json('Post has been updated')
        }
        else{
            res.status(403).json('You can only update your post')
        }
    } catch (error) {
        res.status(500).json(err)
    }
})
//delete post
router.delete('/:id',async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(post.userid === req.body.userid){
            await Post.deleteOne({_id:post._id})
            res.status(200).json('Post has been deleted')
        }
        else{
            res.status(403).json('You can only delete your post')
        }
    } catch (error) {
        res.status(500).json(err)
    }
})
//like a post
router.put('/:id/like',async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userid)){
            await Post.updateOne({_id:post._id},{$push:{likes:req.body.userid}})
            res.status(200).json('You liked the post successfully')
        }
        else{
            await Post.updateOne({_id:post._id},{$pull:{likes:req.body.userid}})
            res.status(200).json('You disliked the post successfully')
        }
    } catch (error) {
        res.status(500).json(error)
    }
})
router.get('/timeline/all',async(req,res)=>{
    try {
        const currentUser = await User.findById(req.body.userid)    
        const userPosts = await Post.find({userid:currentUser._id})
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId)=>{
                return Post.find({userid:friendId})
             })
        )
        console.log(friendPosts)
        res.json(userPosts.concat(...friendPosts))
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;