var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var pet = new Schema({
    name:{type:String,lowercase:true},
    cost:{type:String,unique:true,lowercase:true}
});

module.exports=mongoose.model('pet',pet,'pet');