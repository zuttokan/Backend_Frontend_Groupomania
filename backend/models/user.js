const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { isEmail } = require('validator');
const passwordValidator = require('password-validator');
let schemaPass = new passwordValidator();
schemaPass
  .is()
  .min(6) // Minimum length 6
  .is()
  .max(100) // Maximum length 100
  .has()
  .lowercase() // Must have lowercase letters
  .not()
  .spaces(); // Should not have spaces

const userSchema = mongoose.Schema({
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
    minlength: 6,
    schemaPass,
  },
  isAdmin: { type: Boolean },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
// const regExtMail =
//   '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{4,20}$';
// const regExtPass =
//   '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{4,20}$';
