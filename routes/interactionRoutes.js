const express = require('express')

const Interaction = require('../models/Interaction')
const Post = require('../models/Post')
const auth = require('../utils/verifyToken')

const router = express.Router()

router.post('/', auth, async(req, res) => {
    try {
        const { user, interactionValue, postId, commentText } = req.body

        // Check if the user has already performed 'like' or 'dislike'
        const existingLikeInteraction = await Interaction.findOne({ user, postId, interactionValue: 'like' });
        const existingDislikeInteraction = await Interaction.findOne({ user, postId, interactionValue: 'dislike' });

        if (interactionValue === 'like' && existingLikeInteraction) {
            return res.status(400).json({ message: 'User has already liked this post' });
        }

        if (interactionValue === 'dislike' && existingDislikeInteraction) {
            return res.status(400).json({ message: 'User has already disliked this post' });
        }

        // Update the corresponding Post model based on the interaction type
        const post = await Post.findById(postId)

        // Check if the post is available
        if (!post) {
            return res.status(400).json({ message: 'Post not found' })
        }

        // Check if the post has expired
        const currentTimestamp = new Date()
        if (post.expirationTime && currentTimestamp > post.expirationTime) {
            return res.status(400).json({ message: 'User interactions are not allowed after the expiration time' })
        }

        // Calculate time left
        const timeLeft = Math.floor((post.expirationTime - currentTimestamp) / 60000)


        // Check if the interaction is from the owner of the post
        if (post.owner === user) {
            return res.status(400).json({ message: 'Owner of the post cannot interact with their own post' });
        }

        // Create a new interaction
        const newInteraction = new Interaction({
            user,
            interactionValue,
            timeLeft,
            postId,
        })

        if (interactionValue === 'like') {
        post.likes += 1
        } else if (interactionValue === 'dislike') {
        post.dislikes += 1
        } else if (interactionValue === 'comment') {
        // Handle comment interaction
        post.comments.push({ user, text: commentText })
        }

        await Promise.all([newInteraction.save(), post.save()])

        res.status(201).json({ message: 'Interaction recorded successfully', interaction: newInteraction })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

module.exports = router

