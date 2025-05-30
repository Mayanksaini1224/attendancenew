const mongoose = require('mongoose');

const classLocationSchema = new mongoose.Schema({
  className: { type: String, required: true, unique: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  Roomnum : {type:Number,required:true,unique:true},
});

module.exports = mongoose.model('ClassLocation', classLocationSchema);
