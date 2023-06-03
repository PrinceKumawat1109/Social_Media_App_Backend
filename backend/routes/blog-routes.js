const express = require('express');
const {getAllBlogs, addBlogs, updateBlog, getBlogById, deleteBlog, getByUserId} = require('../controllers/blog-controller');
const blogrouter = express.Router();


blogrouter.get("/",getAllBlogs);
blogrouter.post("/add",addBlogs);
blogrouter.put("/update/:id",updateBlog);
blogrouter.get("/:id",getBlogById);
blogrouter.delete("/:id",deleteBlog);
blogrouter.get("/user/:id",getByUserId);

module.exports = blogrouter;