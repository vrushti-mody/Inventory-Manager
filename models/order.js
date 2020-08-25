var mongoose= require('mongoose');

var schema = new mongoose.Schema({
    
    total:  {type:Number, required:true},
    items:  {type:Array, required:true},
    userid: {type:String, required:true},
    name:   {type:String,required:true},
    date:   {type:Date, required:true}
})

module.exports = mongoose.model('Order',schema)