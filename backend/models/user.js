const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const regExtMail =
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{4,20}$';
const regExtPass =
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{4,20}$';

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true, regExtMail },
  password: { type: String, required: true, regExtPass },
  isAdmin: { type: Boolean },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
