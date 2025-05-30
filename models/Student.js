const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name: String,
  class: String,
  collegeId: { type: String, unique: true },
  branch: String,
  phone: String,
  password: String,
  status: {
    type: String,
    enum: ['Pending', 'Approved'],
    default: 'Pending', 
  },
});

// Hash password before saving
studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare hashed password during login
studentSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);
