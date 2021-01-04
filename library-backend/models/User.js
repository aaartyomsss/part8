const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: {
        type: String, 
        minlength: 3,
        required: true
    } ,
    password: {
        type: String,
        minlength: 5,
        required: true
    }
})

module.exports = mongoose.model('User', schema)