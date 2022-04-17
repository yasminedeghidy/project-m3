const express = require('express');
const dbConnection = require('./DB/db');
const app = express()
const port = 5000
require("dotenv").config()
const userRoutes=require("./src/users/routes/userRoutes")
const postRoutes=require("./src/posts/routes/postRoutes")


app.use(express.json());
dbConnection();
app.use('/uploads',express.static('uploads'))
var cors = require('cors');
app.use(cors())
app.use(userRoutes,postRoutes);



app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))