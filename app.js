const express = require('express')
const mongoose = require('mongoose')
const user = require('./user')
const admin = require('./admin')
var cookieSession = require('cookie-session')
// var session = require('express-session')
// const cookieParser = require('cookie-parser')


var logon = false


const app = express()
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(cookieSession({
    name: 'session',
    keys: ['imaad'],
  
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }))


app.get("/", (req,res)=>{
    logon = false
    res.render("adminlog")
})



app.use("/user", user)
app.use("/admin", admin)

app.listen(3000, ()=>{
    console.log("Listening on 3000")
})

module.exports = logon