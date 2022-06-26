const express = require('express')
require ('dotenv').config()
const db = require('./database/connection')

const app = express()


// middleware
const bodyparser = require('body-parser')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')

//routes
const CategoryRoute = require('./routes/categoryRoute')
const ProductRoute = require('./routes/productRoute')
const UserRoute = require('./routes/userRoute')
const OrderRoute = require('./routes/orderRoute')

const port = process.env.PORT || 8000

//middleware
app.use(bodyparser.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors())
// routes
app.use('/api',CategoryRoute)
app.use('/api',ProductRoute)
app.use('/api',UserRoute)
app.use('/api',OrderRoute)

app.use('/public/uploads', express.static('public/uploads'))
// / ->localhost:5000

app.listen(port,()=>{
    console.log(`server started at port ${port}`)
})