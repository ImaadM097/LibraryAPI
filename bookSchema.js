const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1/test")

const bookSchema = new mongoose.Schema({
    id: Number,
    name: String,
    author: String
})

module.exports = mongoose.model("Book", bookSchema)