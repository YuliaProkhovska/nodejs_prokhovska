const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt'); 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
   
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email address'
        }
    },

    age: {
        type: Number,
        default: 0,
        validate: {
            validator: value => value >= 0,
            message: 'Age must be a positive number'
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 7, 
        trim: true, 
        validate: {
            validator: value => !value.toLowerCase().includes('password'), 
            message: 'Password cannot contain the word "password"'
        }
    }
});

userSchema.pre('insertMany', async function (next, documents) {
    const salt = await bcrypt.genSalt(8);
  
    if (!documents.length && documents) {
      documents.password = await bcrypt.hash(documents.password, salt);
    }
  
    for (let i = 0; i < documents.length; i++) {
      if (documents[i].password) {
        documents[i].password = await bcrypt.hash(documents[i].password, salt);
      }
    }
  
    next();
  });
  
  userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 8);
    }
    next();
  });
  
  userSchema.statics.findOneByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
  
    return user;
  }
  
  userSchema.methods.generateAuthToken = async (user) => {
  
    const token = jwt.sign({ _id: user._id.toString() }, 'superkeysuperkeysuperkey')
  
    user.tokens = user.tokens.concat({ token })
  
    await user.save();
  
    return token
  }

  userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.tokens;
    return user;
};


const User = mongoose.model('User', userSchema);
  
module.exports =  User;