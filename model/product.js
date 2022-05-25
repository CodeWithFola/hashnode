var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Product = new Schema({
    name: { type: String, required: true },
    price: { type: String,required: true},
    quantity: {type: Number, required: true},
})


module.exports = mongoose.model('products', Product);