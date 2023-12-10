const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
	user: { 
		type: String, 
		required: true 
	},

	interactionValue: { 
		type: String, 
		enum: ['like', 'dislike', 'comment'], 
		required: true 
	},

	timeLeft: { 
		type: Number, 
		required: true 
	},

	postId: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Post', 
		required: true 
	},

	timestamp: { 
		type: Date, 
		default: Date.now 
	},
});

module.exports = mongoose.model('Interaction', interactionSchema);
