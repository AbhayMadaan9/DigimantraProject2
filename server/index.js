const express = require('express');
const app = express();
const bodyparser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/Digimantraproject2")
app.use(express.json())
app.use(bodyparser.json());
app.use(cors())


//routes
app.use('/auth', require('./routes/auth'))

app.listen(5000, ()=>{console.log("Server running successfully on port 5000")})