const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create Schema
const UserScheme = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
    },
    date:{
        type:Date,
        default:new Date
        // required:true
    },
})

module.exports = User = mongoose.model('users',UserScheme);