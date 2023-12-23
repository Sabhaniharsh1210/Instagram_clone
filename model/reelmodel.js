const mongoose = require('mongoose');


const reelschema = new mongoose.Schema({
    name:{
        type: String
    },
    path:{
        type: String
    },
    caption:{
        type: String
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    like:{
        type: Array,
        likeuser:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    },
    comment:[{
        usercomment: {
            type: String
        },
        commentuser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    }],

});

const reel = mongoose.model('reel',reelschema);

module.exports = reel;