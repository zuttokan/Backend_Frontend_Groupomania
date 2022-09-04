const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { isEmail } = require('validator');
//const { isStrongPassword } = require('validator');
//const validator = require('validator');
//let test = {minLength:6} as strongPasswordOptions
//let options = {} as strongPasswordOptions;

// const passwordValidator = require('password-validator');
// let schemaPass = new passwordValidator();
// schemaPass
//   .is()
//   .min(6) // Minimum length 6
//   .is()
//   .max(100) // Maximum length 100
//   .has()
//   .lowercase() // Must have lowercase letters
//   .not()
//   .spaces(); // Should not have spaces

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: [isEmail],
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    //validate: [isStrongPassword],
    //validate: schemaPass,
    minLength: 6,
    maxLength: 100,
    // validate(value) {
    //   if (!validator.isStrongPassword(value)) {
    //     throw new Error('Password is not Strong');
    //   }
    // },
  },
  isAdmin: { type: Boolean },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
