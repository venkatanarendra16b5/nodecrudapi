// Import expressjs for creating the server and creating api routes
const express = require('express')

// Body Parser for urlencoded form data 
const bodyParser = require('body-parser')

// Importing Mongo client
const MongoClient = require('mongodb').MongoClient 
const res = require('express/lib/response')


const{locals}=require('ejs')
// Creating app function from the express functional constructor to use it for creating
// server and apis
const app = express()

// Enabling body parser with urlencoded form data to be true
app.use(bodyParser.urlencoded({extended:true}))
//setting ejs template engie
app.set('view engine','ejs')
// Database Connection String
const connectionString ="mongodb+srv://venkatanarendra:Venkata123@cluster0.vv6id.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
// Connecting the database server
MongoClient.connect(connectionString,{useUnifiedTopology:true})
 .then(client => {
     console.log('connected to database server')
     // Connecting the database
     const db= client.db('star-wars-quotes')
     // Connecting the collection
     const quotesCollection = db.collection('quotes')
     
     // 1. Create with POST
     // Two parameters first one route, second one is function what you want to execute
        app.post('/quotes', (req,res) => {
            // Inserting the document
            quotesCollection.insertOne(req.body)
            // Post inserting getting the result
            .then(result=>{
                res.send(result)
            })
            // Error for document
            .catch(error=>console.error(error))
        })

    // 2. Reading data from MongoDB
        app.get('/getall',(req,res)=>{
            // Finding the collection quotes and changing object of objects to array of objects
            db.collection('quotes').find().toArray()
             // Waiting for the promise to send us the result back
            .then(result=>{
             res.render('index.ejs',{quotes:result})
            })
            // Waiting for the promise to send us the error back
           .catch(error=>console.error(error))

        })

        // //3.Updating data
        // app.put('/updatequote',(req,res)=>{
        //     quotesCollection.findOneAndUpdate()
        //     // Waiting for the promise to send us the result back
        //     .then(result=>{
        //         res.send(result)
        //       })
        //     // Waiting for the promise to send us the error back
        //     .catch(error=>console.error(error))
        // })


}).catch(console.error) // MongoDB Atlas Cluster/Server Connection Error
res.render(views,locals)
// Creating the server
const PORT = 3000
//here we are trying to send index.html to frontend client request from body to data
app.get('/',(req,res)=>{
    res.sendFile(__dirname +'/index.html')
})
app.listen(PORT, () => {
    console.log(`Server is Running on PORT: ${PORT}`)
})

