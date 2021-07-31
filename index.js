const express = require('express');
const helmet =  require('helmet')
const mongoose =  require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const app = express()

dotenv.config();

//Db connection
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true},()=>{
    console.log('Connected to mongo.')
});
//Middlewares
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use('/api/users',userRoute)
app.use('/api/auth',authRoute)
app.use('/api/posts',postRoute)



app.listen(5000,()=>{
    console.log('Server is running on the port 5000...')
})