const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    name:{
        type: String,
    },
    username:{
        type: String,
        required: [true, 'Please enter your user name']
    },
    email:{
        type: String,
        required: [true, 'Please enter your email']
    },
    password:{
        type: String,
        required: [true, 'Please enter your password']
    },
    contact:{
        type: String,
    },
    gender:{
        type: String,
        required: [true, 'Please enter your gender']
    },
    following:[{
        type: mongoose.Schema.Types.ObjectId
    }],
    follower:[{
        type: mongoose.Schema.Types.ObjectId
    }]
  });

  const user = mongoose.model('user',userschema);

  module.exports = user;