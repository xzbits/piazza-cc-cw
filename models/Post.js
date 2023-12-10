const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },

    topics: [{ 
        type: String, 
        enum: ['Politics', 'Health', 'Sport', 'Tech'], 
        required: true 
    }],

    timestamp: { 
        type: Date, 
        default: Date.now 
    },

    body: { 
        type: String, 
        required: true 
    },

    expirationTime: { 
        type: Date, 
        required: true 
    },

    status: { 
        type: String, 
        enum: ['Live', 'Expired'], 
        default: 'Live' 
    },

    owner: { 
        type: String, 
        required: true 
    },

    likes: { 
        type: Number, 
        default: 0 
    },

    dislikes: { 
        type: Number, 
        default: 0 
    },
    
    comments: [
        {
            user: { type: String, required: true },
            text: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        },
  ],
});

module.exports = mongoose.model('Post', postSchema);
