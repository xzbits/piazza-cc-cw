const express = require('express')

const Post = require('../models/Post')
const auth = require('../utils/verifyToken')

const router = express.Router()

router.post('/', auth, async(req, res) => {
    try {
        const { topic } = req.body

        const posts = await Post.find({ topics: topic })

        res.status(200).json({ posts })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

module.exports = router

