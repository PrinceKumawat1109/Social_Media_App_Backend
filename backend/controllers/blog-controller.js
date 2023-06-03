const Blog = require('../model/Blog.js');
const User = require('../model/User.js');
const mongoose = require('mongoose');


//get all blogs
const getAllBlogs = async(req, res, next) => {
    let blogs;
    try {
        blogs = await Blog.find();
    }catch(err){  
        return console.log(err);
    }
    if(!blogs){
        return res.status(404).json({message: "No blogs found"});
    }
    return res.status(200).json({blogs: blogs});
}

//add new blog
const addBlogs = async(req, res, next) => {
    const {title, description, image, user} = req.body;

    let existingUser;
    try{
        existingUser = await User.findById(user);
    }catch(err){
        return console.log(err);
    }
    if(!existingUser){
        return res.status(404).json({message: "User does not exist"});
    }
    const newBlog = new Blog({
        title,
        description,
        image,
        user
    });
    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        await newBlog.save({session: session});
        existingUser.blogs.push(newBlog);
        await existingUser.save({session: session});
        await session.commitTransaction();
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err});
    }
    return res.status(201).json({newBlog});
}

//update the blog by id
const updateBlog = async(req, res, next) => {
    const {title, description} = req.body;
    const blogId = req.params.id;
    let blog;
    try{
        blog = await Blog.findByIdAndUpdate(blogId,{
            title,
            description
        });
    }catch(err){
        return console.log(err);
    }
    if(!blog){
        return res.status(500).json({message: "Unable to update blog"});
    }
    return res.status(200).json({blog});
}

//get blog by id
const getBlogById = async(req, res, next) => {
    const blogId = req.params.id;
    let blog;
    try{
        blog = await Blog.findById(blogId);
    }catch(err){
        return console.log(err);
    }
    if(!blog){
        return res.status(404).json({message: "No blog found"});
    }
    return res.status(200).json({blog});
}

//delete blog by id
const deleteBlog = async(req, res, next) => {
    const blogId = req.params.id;
    let blog;
    try{
        blog = await Blog.findByIdAndDelete(blogId).populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    }catch(err){
        return console.log(err);
    }
    if(!blog){
        return res.status(500).json({message: "Unable to delete blog"});
    }
    return res.status(200).json({message: "Blog deleted"});
}

// getbyuserid

//getbyuserid

const getByUserId = async (req, res, next) => {
    const userId = req.params.id;
    let userBlogs;
    try {
        userBlogs = await User.findById(userId).populate('blogs');
    }catch(err) {
        return console.log(err);
    }
    if(!userBlogs) {
        return res.status(404).json({message: "User not found"});
    }
    return res.status(200).json({ userBlogs });
};

exports.getAllBlogs = getAllBlogs;
exports.addBlogs = addBlogs;
exports.updateBlog = updateBlog;
exports.getBlogById = getBlogById;
exports.deleteBlog = deleteBlog;
exports.getByUserId = getByUserId;