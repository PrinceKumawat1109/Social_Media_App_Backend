const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/user-routes');
const blogrouter = require('./routes/blog-routes');

const app = express();

app.use(express.json());

app.use("/api/user",router);
app.use("/api/blog",blogrouter);

mongoose
    .connect(
        'mongodb+srv://9829236387n:Prince143@cluster0.x57aqnm.mongodb.net/Blog?retryWrites=true&w=majority'
    )
    .then(() => app.listen(5000))
    .then(() => console.log('Server Running'))
    .catch((err) => console.log(err));
