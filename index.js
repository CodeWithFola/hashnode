
// Configure the environment variable
require('dotenv').config()

//Module Exports
const express = require('express');
const logger= require('morgan');
const bodyparser = require('body-parser');
const DB = require('./model/product');
const mongoose = require(`mongoose`);

// Initiating our express app
const app = express()



// Middlewares
// logging our route calls to the console
app.use(logger('dev'));

//Middleware to handle your post request
app.use(bodyparser.json()) //This allows us to be able to read json data from our form

//Connecting our app to our DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
const dbConnection = mongoose.connection;
dbConnection.on('connected',()=>{
    console.log("***************************************************") //Just for design, Does nothng special
    console.log("\x1b[36m%s\x1b[0m","Database is up and running...") 
    console.log("***************************************************") //Just for design, Does nothng special
})
dbConnection.on('disconnected',()=>{
    console.log("***************************************************") //Just for design, Does nothng special
    console.log("\x1b[31m%s\x1b[0m","Database is disconneted and Reconnect to continue transcation...")
    console.log("***************************************************") //Just for design, Does nothng special
})

dbConnection.on('err',console.error.bind('Databse refussed to connect, Try again'))


// Configuration of server port
const PORT = process.env.PORT || 4000


// Basic Routing
app.get('/',(req,res)=>{
    res.json({message:'Api is working'}) 
})



// Creating Product - Verb (POST)
app.post('/create/product',async (req,res)=>{
    let data  = req.body
    await DB.insertMany(data,function (err,result) {
        if (err) return res.json({status:503,response:err.message})
        // saved!
      });
    return  res.json({status:200,message:"Product Added successfully"}) 
      
})



//Reading Product 


// Get all product
app.get('/read/allProducts',(req,res)=>{
    const products = DB.find({},(err,product)=>{
    if(err) return  res.json({status:500,message:err.message})
    if(!products) return  res.json({status:405,reponse:"Product is not in database"})
    if(!err) return  res.json({status:200,response:"Products Fetched successfully",products:product})
    })
})

// Get product by id in the database

app.get(`/read/product/:id`,(req,res)=>{

    let id = req.params.id // putting the params in a variable

    // querrying the database
    DB.findOne({_id:id},(err,product)=>{
        //Just some verification
        if(err) return  res.json({status:500,response:err.message})
        if(!id) return res.json({status:403,response:"Provide a valid parameter"})
        if(!product) return res.json({staus:403, response:"No products with this parameter in our database"})
        return(res.json({status:200,response:"Product fetched successfully", product:product}))
    })
})

//Updating Product 
app.post(`/product/update/:id`,(req,res)=>{
    let id = req.params.id // putting the params in a variable
    let data = req.body
    // querrying the database
   DB.findOneAndUpdate({_id:id},data,(err,product)=>{
        if(err) return  res.json({status:500,response:err.message})
        if(!product) return  res.json({status:500,response:"Product not found in the database"}) // Will Fire this if the id provided is wrong
        return(res.json({status:200,response:"Product updated successfully"}))
    })
   
})


//Deleting Product
app.post(`/product/delete/:id`,(req,res)=>{
    let id = req.params.id // putting the params in a variable
    // querrying the database
    DB.findByIdAndDelete({_id:id},(err,product)=>{
        if(err) return  res.json({status:500,response:err.message})
        if(!product) return  res.json({status:500,response:"Product not found in the database"}) // Will Fire this if the id provided is wrong
        return(res.json({status:200,response:"Product deleted successfully"}))
    })
   
})

app.listen(PORT,()=>{
    console.log("=========================================================") //Just for design, Does nothng special

    console.log("\x1b[36m%s\x1b[0m",`Server is now running on http://localhost:${PORT}`)

    console.log("========================================================") //Just for design, Does nothng special

})