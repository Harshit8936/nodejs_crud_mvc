// imports

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 4000;
const db = process.env.DB_CONNECT;

// mongodb connection
try {
    mongoose.connect(db,{useUnifiedTopology:true,useNewUrlParser:true},
        console.log('MongoDB is connected'))
} catch (error) {
    console.log(error)
}
// middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(session({
    secret:"My secret key",
    saveUninitialized:true,
    resave:false
}));
app.use((req,res,next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})

//set template engine
app.set("view engine","ejs");

// routes import
app.use("",require('./routes/route'))
app.use(express.static("uploads"));
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Hello world!')

})

app.listen(PORT,()=>{
       console.log(`App is listening on ${PORT}`)
})