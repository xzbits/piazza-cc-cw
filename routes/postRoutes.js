const express = require('express')

const auth = require('../utils/verifyToken')
const Post = require('../models/Post')


const router = express.Router()

router.post('/', auth, async(req, res) => {
    try {
        const { title, topics, body, expirationTime, owner } = req.body

        const newPost = new Post({
            title,
            topics,
            body,
            expirationTime,
            owner,
        })

        await newPost.save()

        res.status(201).json({ message: 'Post created successfully', post: newPost })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error })
    }
})

module.exports = router
