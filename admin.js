const express = require('express')
const router = express.Router()
const Book = require('./bookSchema')
const Admin = require('./adminSchema')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const saltRounds = 10;
var cookieSession = require('cookie-session')
// const cookieParser = require('cookie-parser')
// var session = require('./app')
var logon = false
//$2b$10$yYUtfwvm7wdMRAXYbklT7.udVLcQ3M2duO4R1OUVUt7FPmGbpA9cW
//$2b$10$9Gu3o/f.XF53CsjENx9V6uVPvajqwfym23GCK9aj3VtvgWPF/6o/K

router.get("/login", (req, res)=>{
    logon = false
    res.render('adminlog')
})

router.post("/db",async (req,res)=>{
    
    

    const check = req.body.pass
    const uname = req.body.uname
    const data = await Admin.findOne({username: uname})
    
    if(data !== null) {
        const hash = data.password
        console.log(req.body)
        console.log(hash)
    
        bcrypt.compare(check, hash, (err, result) => {
            console.log(result)
            if(result == true) {
                logon = true
                let token;
                try {
                    token = jwt.sign(
                    { username: uname},
                    "007",
                    { expiresIn: "1h" }
                    );
                } catch (err) {
                    console.log(err.message)
                }           
                console.log(token)
                req.session.token = token
                if(data.isAdmin)
                    res.render('querypageAdmin', {token: 0})
                else res.render('querypage', {token: 0})
            }
            else {
                
                res.render('adminlog')
            }
        })
    }
    else res.render('adminlog')

})

router.post("/all", checkLog, async (req,res)=>{
    const result = await Book.find()
    res.send(result)
})
router.post("/find", checkLog, async (req, res)=>{
    const id = req.body.qid
    const result = await Book.find({id: parseInt(id)})
    res.send(result)
})

router.post("/insert", checkLog, async (req, res)=>{
    const id = req.body.Iid
    const bname = req.body.bname
    const aname = req.body.aname
    try {
    const result = await Book.create({id: parseInt(id), name: bname, author: aname})
    } catch (e) {
        console.log(e.message)
    }
    res.send("Inserted")
})
router.post("/update", checkLog,async (req, res)=>{
    const id = req.body.Iid
    const bname = req.body.bname
    const aname = req.body.aname
    console.log(req.body)
    try {
        const result = await Book.updateMany({id: parseInt(id)}, {id: parseInt(id), name: bname, author: aname})
    } catch (e) {
        console.log(e.message)
    }
    res.send("Updated")

})

router.post("/createUser", async(req, res)=>{
    const {newuname, newpass} = req.body
    try{
    bcrypt.hash(newpass, saltRounds, async function(err, hash) {
        const user = Admin.create({username: newuname, password: hash, isAdmin: false})
    });} catch(e) {console.log(e.message)}
    
    let token;
    try {
        token = jwt.sign(
            { username: newuname},
            "007",
            { expiresIn: "1h" }
        );
    } catch (err) {
        console.log(err.message)
    }
    res.session.token = token
    res.render('querypage', {token: 0})
})

router.post("/createAdmin", async(req, res)=>{
    const {newuname, newpass} = req.body
    try{
    bcrypt.hash(newpass, saltRounds, async function(err, hash) {
        const user = Admin.create({username: newuname, password: hash, isAdmin: true})
    });} catch(e) {console.log(e.message)}
    
    let token;
    try {
        token = jwt.sign(
            { username: newuname},
            "007",
            { expiresIn: "1h" }
        );
    } catch (err) {
        console.log(err.message)
    }
    res.session.token = token

    res.render('querypageAdmin', {token: 0})
})


async function checkLog(req, res, next) {
    console.log(req.session)
    const token = req.session.token
    if(!token) {
        console.log("No token provided")
    }
    try{
        const decoded = jwt.verify(token, "007")
        next()
    } catch(e) {
        console.log(e.message)
        res.send(e.message)
    }

}



module.exports = router