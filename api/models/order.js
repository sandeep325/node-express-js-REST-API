const mongoose = require("mongoose");

const OrderSchema   =  mongoose.Schema({
                        _id: mongoose.Schema.Types.ObjectId,
                        product: {type:mongoose.Schema.Types.ObjectId,ref:'product',required:true},
                        quantity:{type:Number,default:1,required:true},
                        name: {type:String,required:true}


});

module.exports = mongoose.model('order',OrderSchema);