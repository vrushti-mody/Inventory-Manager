var mongoose= require('mongoose');

var schema = new mongoose.Schema({
    itemname: {type:String, required:true},
    price: {type:Number, required:true},
    quantity: {type:Number, required:true},
    userid: {type:String, required:true}, 
})

module.exports = mongoose.model('Item',schema)