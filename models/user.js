const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{type:String},
    email:{type:String},
    phone:{type:Number},
    image:{type:String},
    created_at:{type:Date,required:true,default:Date.now},
    status:{type:Boolean},

})
module.exports = mongoose.model('User',userSchema);