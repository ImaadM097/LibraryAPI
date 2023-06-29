const mongoose = require('mongoose')
mongoose.connect("mongodb://127.0.0.1/test")

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: String
})

module.exports = mongoose.model("User", userSchema)