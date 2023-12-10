const express = require('express')
const Post = require('../models/Post')
const auth = require('../utils/verifyToken')

const router = express.Router()

router.post('/', auth, async (req, res) => {
    try {
        const { topic } = req.params

        // Find the post with the highest total likes and dislikes for the given topic
        const result = await Post.aggregate([
            { $match: { topic: topic } },
            {
                $project: {
                    _id: 1,
                    totalLikesAndDislikes: { $add: ['$likes', '$dislikes'] },
                },
            },
            { $sort: { totalLikesAndDislikes: -1 } },
            { $limit: 1 },
        ])

        if (result.length === 0) {
            return res.status(404).json({ message: 'Post not found' })
        }

        // Extract the post ID from the result
        const mostActivePostId = result[0]._id

        // Retrieve the full post details using the post ID
        const mostActivePostDetails = await Post.findById(mostActivePostId)

        res.status(200).json({ mostActivePost: mostActivePostDetails })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

module.exports = router
